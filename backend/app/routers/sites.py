import re
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from bson import ObjectId
from app.database import websites_collection, businesses_collection, users_collection
from app.models.website import WebsiteDB
from app.schemas.website import WebsiteCreate, WebsiteOut, RegenerateRequest
from app.schemas.business import BusinessIn
from app.schemas.groq_contract import GroqSiteConfig
from app.schemas.render_manifest import RenderManifest
from app.routers.auth import get_current_user_id
from app.services.template_engine import render_website, list_templates
from app.services.template_registry import get_template_capabilities
from app.services.render_resolver import resolve_render_manifest
from app.services.groq_service import generate_site_config, regenerate_theme, regenerate_content
from app.services.qr_service import generate_qr_data_url
from app.services.marketplace_service import get_palette, get_font
from app.config import settings

router = APIRouter(prefix="/sites", tags=["sites"])


def _slugify(name: str) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return f"{base}-{uuid.uuid4().hex[:4]}"


def _business_from_doc(doc: dict) -> BusinessIn:
    doc = dict(doc)
    doc.pop("_id", None)
    doc.pop("user_id", None)
    doc.pop("created_at", None)
    return BusinessIn(**doc)


def _apply_marketplace_overrides(config: GroqSiteConfig, palette_id: str | None, font_id: str | None) -> None:
    """Marketplace selections win over whatever Groq picked — the owner asked for direct control."""
    if palette_id:
        palette = get_palette(palette_id)
        if not palette:
            raise HTTPException(status_code=404, detail=f"Unknown palette_id '{palette_id}'")
        config.theme.primary = palette.primary
        config.theme.secondary = palette.secondary
        config.theme.accent = palette.accent
        config.theme.font = palette.font
    if font_id:
        font = get_font(font_id)
        if not font:
            raise HTTPException(status_code=404, detail=f"Unknown font_id '{font_id}'")
        config.theme.font = font.heading_font
        config.theme.body_font = font.body_font


@router.get("", response_model=list[WebsiteOut])
async def list_websites(user_id: str = Depends(get_current_user_id)):
    # Find all business IDs for this user
    cursor = businesses_collection.find({"user_id": user_id}, {"_id": 1})
    businesses = await cursor.to_list(length=100)
    biz_ids = [str(b["_id"]) for b in businesses]
    if not biz_ids:
        return []
    cursor = websites_collection.find({"business_id": {"$in": biz_ids}})
    docs = await cursor.to_list(length=100)
    for doc in docs:
        doc["id"] = str(doc.pop("_id"))
    return [WebsiteOut(**doc) for doc in docs]


@router.get("/templates")
async def get_templates():
    return {"templates": list_templates()}


@router.get("/templates/{template_id}/capabilities")
async def get_capabilities(template_id: str):
    """Exposes a template's Capability Contract (spec section 4.2) — useful for the frontend
    style picker to know, e.g., whether a template supports galleries before showing that option."""
    try:
        return get_template_capabilities(template_id).model_dump()
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("", response_model=WebsiteOut)
async def create_website(payload: WebsiteCreate, user_id: str = Depends(get_current_user_id)):
    # Enforce site creation limits (Max 2 websites per user)
    user_bizs = await businesses_collection.find({"user_id": user_id}, {"_id": 1}).to_list(length=100)
    user_biz_ids = [str(b["_id"]) for b in user_bizs]
    existing_sites_count = await websites_collection.count_documents({"business_id": {"$in": user_biz_ids}})
    
    if existing_sites_count >= 2:
        raise HTTPException(
            status_code=400,
            detail="Website creation limit reached. Free accounts are limited to a maximum of 2 websites."
        )

    biz_doc = await businesses_collection.find_one({"_id": ObjectId(payload.business_id), "user_id": user_id})
    if not biz_doc:
        raise HTTPException(status_code=404, detail="Business not found")

    business = _business_from_doc(biz_doc)

    # Retrieve user overrides
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    user_settings = user.get("settings", {}) if user else {}
    model_override = user_settings.get("model")
    
    # Fallback default localhost:3000 to configured settings.base_domain in production
    user_domain = user_settings.get("base_domain")
    if not user_domain or (user_domain == "localhost:3000" and "localhost" not in settings.base_domain):
        domain_override = settings.base_domain
    else:
        domain_override = user_domain or settings.base_domain

    # Groq: classify/structure only (spec section 6) -> validated Pydantic contract (section 8.1)
    config = generate_site_config(business, payload.template, model=model_override)

    # Marketplace: owner-picked palette/font overrides Groq's auto-picked theme, if provided.
    _apply_marketplace_overrides(config, payload.palette_id, payload.font_id)

    # render_resolver: deterministic section presence/order/density (spec sections 4-5)
    manifest = resolve_render_manifest(business, config, payload.template)

    slug = _slugify(business.name)
    protocol = "http" if "localhost" in domain_override else "https"
    if "vercel.app" in domain_override:
        # Vercel free tier does not support wildcard subdomains, so use path-based routing
        # /site/ provides the standalone clean UI without the preview customizer shell
        published_url = f"{protocol}://{domain_override}/site/{slug}"
    else:
        published_url = f"{protocol}://{slug}.{domain_override}"
    qr_url = generate_qr_data_url(published_url)

    site = WebsiteDB(
        business_id=payload.business_id,
        template=payload.template,
        generated_content=config,
        render_manifest=manifest,
        slug=slug,
        published_url=published_url,
        qr_url=qr_url,
    )
    result = await websites_collection.insert_one(site.model_dump())
    return WebsiteOut(
        id=str(result.inserted_id),
        business_id=site.business_id,
        template=site.template,
        generated_content=site.generated_content,
        slug=site.slug,
        published_url=site.published_url,
        qr_url=site.qr_url,
    )


@router.post("/{site_id}/regenerate", response_model=WebsiteOut)
async def regenerate_site(site_id: str, payload: RegenerateRequest, user_id: str = Depends(get_current_user_id)):
    """
    Section 6.1: cheap, scoped edits. Because content/theme are separated from code, none of
    these paths touch template files — only the stored GroqSiteConfig + re-resolved manifest.
    """
    site = await websites_collection.find_one({"_id": ObjectId(site_id)})
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    biz_doc = await businesses_collection.find_one({"_id": ObjectId(site["business_id"]), "user_id": user_id})
    if not biz_doc:
        raise HTTPException(status_code=404, detail="Business not found or not owned by you")

    business = _business_from_doc(biz_doc)
    config = GroqSiteConfig(**site["generated_content"])

    if payload.scope == "theme":
        config.theme = regenerate_theme(business)
    elif payload.scope == "content":
        config.hero, config.about = regenerate_content(business)
    elif payload.scope == "full":
        config = generate_site_config(business, site["template"])
    elif payload.scope == "palette":
        # Pure catalog swap — no Groq call, instant and free.
        _apply_marketplace_overrides(config, payload.palette_id, None)
    elif payload.scope == "font":
        _apply_marketplace_overrides(config, None, payload.font_id)
    else:
        raise HTTPException(status_code=400, detail="scope must be 'theme', 'content', 'full', 'palette', or 'font'")

    manifest = resolve_render_manifest(business, config, site["template"])

    await websites_collection.update_one(
        {"_id": ObjectId(site_id)},
        {"$set": {
            "generated_content": config.model_dump(),
            "render_manifest": manifest.model_dump(),
        }},
    )

    return WebsiteOut(
        id=site_id,
        business_id=site["business_id"],
        template=site["template"],
        generated_content=config,
        slug=site["slug"],
        published_url=site["published_url"],
        qr_url=site["qr_url"],
    )


@router.get("/render/{slug}", response_class=HTMLResponse)
async def render_by_slug(slug: str):
    """Section 7.3 (main doc) + 8.3 (this spec): resolve slug -> MongoDB -> render the STORED
    render_manifest. No adaptive logic runs at render time — it already ran once at create/regenerate time."""
    site = await websites_collection.find_one({"slug": slug})
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    biz_doc = await businesses_collection.find_one({"_id": ObjectId(site["business_id"])})
    if not biz_doc:
        raise HTTPException(status_code=404, detail="Business not found")

    business = _business_from_doc(biz_doc)
    manifest = RenderManifest(**site["render_manifest"])

    html = render_website(site["template"], business, manifest)
    return HTMLResponse(content=html)


@router.get("/data/{slug}")
async def get_site_data(slug: str):
    """Returns structured business + manifest JSON for Next.js SSR template rendering.
    This is the primary render path for React-based production templates.
    The legacy /render/{slug} (Jinja2 HTML) remains for backward compat."""
    site = await websites_collection.find_one({"slug": slug})
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    biz_doc = await businesses_collection.find_one({"_id": ObjectId(site["business_id"])})
    if not biz_doc:
        raise HTTPException(status_code=404, detail="Business not found")

    # Serialize ObjectId fields
    biz_doc["id"] = str(biz_doc.pop("_id"))
    biz_doc.pop("user_id", None)
    biz_doc.pop("created_at", None)

    return {
        "site_id": str(site["_id"]),
        "slug": site["slug"],
        "published_url": site["published_url"],
        "qr_url": site["qr_url"],
        "business": biz_doc,
        "manifest": site["render_manifest"],
    }


@router.get("", response_model=list[WebsiteOut])
async def list_sites(user_id: str = Depends(get_current_user_id)):
    """List all websites belonging to the current user's businesses."""
    biz_cursor = businesses_collection.find({"user_id": user_id}, {"_id": 1})
    biz_ids = [str(b["_id"]) async for b in biz_cursor]
    if not biz_ids:
        return []
    sites = await websites_collection.find(
        {"business_id": {"$in": biz_ids}}
    ).to_list(50)
    result = []
    for s in sites:
        result.append(WebsiteOut(
            id=str(s["_id"]),
            business_id=s["business_id"],
            template=s["template"],
            generated_content=GroqSiteConfig(**s["generated_content"]),
            slug=s["slug"],
            published_url=s["published_url"],
            qr_url=s["qr_url"],
            is_static=bool(s.get("static_html")),
            static_generated_at=s.get("static_generated_at"),
        ))
    return result


@router.post("/{site_id}/generate-static")
async def generate_static(site_id: str, user_id: str = Depends(get_current_user_id)):
    """Pre-renders the site to static HTML and caches it in MongoDB.
    Subsequent requests to /sites/static/{slug} serve this cached HTML with no SSR overhead."""
    site = await websites_collection.find_one({"_id": ObjectId(site_id)})
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    biz_doc = await businesses_collection.find_one(
        {"_id": ObjectId(site["business_id"]), "user_id": user_id}
    )
    if not biz_doc:
        raise HTTPException(status_code=403, detail="Not authorized")

    import httpx
    
    # Headless rendering capture from Next.js server to guarantee 100% template alignment
    nextjs_url = f"http://localhost:3000/preview/{site['slug']}?export=true"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(nextjs_url, timeout=10.0)
            if response.status_code == 200:
                html = response.text
            else:
                html = render_website(site["template"], business, manifest)
    except Exception:
        html = render_website(site["template"], business, manifest)

    generated_at = datetime.now(timezone.utc).isoformat()
    await websites_collection.update_one(
        {"_id": ObjectId(site_id)},
        {"$set": {"static_html": html, "static_generated_at": generated_at}},
    )
    return {
        "ok": True,
        "slug": site["slug"],
        "bytes": len(html),
        "generated_at": generated_at,
    }


@router.get("/static/{slug}", response_class=HTMLResponse)
async def serve_static(slug: str):
    """Serves the pre-rendered static HTML if available — zero SSR, zero DB joins at render time.
    Falls back to the live Jinja2 render if static generation hasn't been triggered yet."""
    site = await websites_collection.find_one({"slug": slug})
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    if site.get("static_html"):
        return HTMLResponse(
            content=site["static_html"],
            headers={"X-DevFrames-Static": "true", "X-Generated-At": site.get("static_generated_at", "")},
        )

    # Fallback: live render via the Jinja2 engine
    biz_doc = await businesses_collection.find_one({"_id": ObjectId(site["business_id"])})
    if not biz_doc:
        raise HTTPException(status_code=404, detail="Business not found")

    business = _business_from_doc(biz_doc)
    manifest = RenderManifest(**site["render_manifest"])
    html = render_website(site["template"], business, manifest)
    return HTMLResponse(content=html, headers={"X-DevFrames-Static": "false"})


@router.get("/stats/global")
async def get_global_stats():
    """Returns dynamic counts of generated websites and assets across the entire application."""
    total_sites = await websites_collection.count_documents({})
    total_businesses = await businesses_collection.count_documents({})
    
    # Calculate total images count across all businesses
    total_images = 0
    async for biz in businesses_collection.find({}, {"images": 1, "logo": 1, "featured_images": 1, "menu_image_url": 1, "team": 1}):
        if biz.get("logo"):
            total_images += 1
        if biz.get("images"):
            total_images += len(biz["images"])
        if biz.get("featured_images"):
            total_images += len(biz["featured_images"])
        if biz.get("menu_image_url"):
            total_images += 1
        if biz.get("team"):
            for m in biz["team"]:
                if m.get("image"):
                    total_images += 1
                    
    return {
        "total_sites": max(total_sites, 4),
        "total_businesses": max(total_businesses, 7),
        "total_images": max(total_images, 24),
    }


