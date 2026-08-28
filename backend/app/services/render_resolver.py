"""
Section 4.3, 5, and 8.1 of the Adaptive Template spec — the render_resolver.

This is THE deterministic, rule-based piece that decides section presence, ordering, and
layout density. Groq never makes these decisions (section 5.3: "All of these are rule-based
conditional rendering inside the template engine, not AI-decided layout").

Design choice worth flagging: rather than trusting Groq's `available_features` /
`recommended_sections` fields to decide what actually renders, this resolver checks the
owner's real business data directly. Groq's classification is still captured and stored
(see GroqSiteConfig) for future use / debugging, but final section presence is derived from
ground truth, not from what the AI *said* was present — a stricter reliability guarantee than
the spec strictly requires, in the same spirit as its "never pass unvalidated AI output into
the render pipeline" rule in section 8.1.

Input:  business data + validated Groq config + template capabilities
Output: RenderManifest — the ONLY thing the template engine consumes (section 8.3)
"""
from app.schemas.business import BusinessIn
from app.schemas.groq_contract import GroqSiteConfig
from app.schemas.render_manifest import RenderManifest, SectionManifest
from app.services.template_registry import get_template_capabilities
from app.services.component_library import find_fallback_component

MENU_DENSE_THRESHOLD = 8      # section 5.3: 1-8 items -> grid, 9+ -> categorized/expandable ("tabs")
GALLERY_DENSE_THRESHOLD = 4   # section 5.3: 1-4 photos -> standard grid, 5+ -> expanded/scrollable


def resolve_render_manifest(
    business: BusinessIn,
    groq_config: GroqSiteConfig,
    template_id: str,
) -> RenderManifest:
    capabilities = get_template_capabilities(template_id)
    allowed = set(capabilities.core_sections) | set(capabilities.optional_sections)

    sections: dict[str, SectionManifest] = {}
    components_used: list[str] = []

    # --- hero: core, always present ---
    # featured_images[0] (if the owner uploaded/chose one) becomes the hero's background photo —
    # this is the single biggest thing that makes a generated site feel designed instead of generic.
    sections["hero"] = SectionManifest(
        type="hero",
        data={
            "headline": groq_config.hero.title,
            "description": groq_config.hero.subtitle,
            "cta": groq_config.hero.cta,
            "image": business.featured_images[0] if len(business.featured_images) > 0 else None,
        },
    )

    # --- about: core, always present ---
    # featured_images[1] switches this from a plain text block to a two-column image+text layout.
    sections["about"] = SectionManifest(
        type="about",
        data={
            "title": groq_config.about.title,
            "description": groq_config.about.description,
            "image": business.featured_images[1] if len(business.featured_images) > 1 else None,
        },
    )

    # --- menu / services: category-dependent item section (section 5.3 density rules) ---
    item_section_id = "menu" if business.category == "restaurant" else "services"
    items = business.menu if business.category == "restaurant" else business.services
    if items and item_section_id in allowed:
        density = "grid" if len(items) <= MENU_DENSE_THRESHOLD else "tabs"
        sections[item_section_id] = SectionManifest(
            type=item_section_id,
            density=density,
            data={"entries": [i.model_dump() for i in items]},
        )
    # else: section is simply not rendered at all — section 5.3, "No menu items provided -> not rendered"

    # --- gallery: density tier (section 5.3) ---
    if business.images and "gallery" in allowed:
        density = "standard" if len(business.images) <= GALLERY_DENSE_THRESHOLD else "expanded"
        sections["gallery"] = SectionManifest(
            type="gallery", density=density, data={"images": business.images}
        )

    # --- opening_hours ---
    if business.hours and "opening_hours" in allowed:
        sections["opening_hours"] = SectionManifest(
            type="opening_hours", data={"hours": [h.model_dump() for h in business.hours]}
        )

    # --- location ---
    if (business.address or business.maps) and "location" in allowed:
        sections["location"] = SectionManifest(
            type="location", data={"address": business.address, "maps": business.maps}
        )

    # --- social: native features + Component Registry resolution flow (section 4.3) ---
    social_links: list[dict] = []
    if business.instagram:
        social_links.append({"platform": "instagram", "url": business.instagram, "native": True})
    if business.facebook:
        social_links.append({"platform": "facebook", "url": business.facebook, "native": True})
    if business.threads:
        social_links.append({"platform": "threads", "url": business.threads, "native": True})
    if business.whatsapp:
        social_links.append({"platform": "whatsapp", "url": f"https://wa.me/{business.whatsapp}", "native": True})
    if business.email:
        social_links.append({"platform": "email", "url": f"mailto:{business.email}", "native": True})

    for platform, url in getattr(business, "extra_social_links", {}).items():
        if any(s["platform"] == platform for s in social_links):
            continue
        # Not a section a template natively knows how to lay out — check the Component Library.
        fallback = find_fallback_component(platform)
        if fallback:
            components_used.append(fallback)
            social_links.append({"platform": platform, "url": url, "native": False, "component": fallback})
        # else: omitted gracefully, per section 4.3 — never breaks the layout, never force-inserted.

    if social_links and "social" in allowed:
        sections["social"] = SectionManifest(type="social", data={"links": social_links})

    # --- reviews: concrete Component Registry fallback demo (section 4.4) ---
    # None of the 3 shipped templates natively declare "reviews" as core/optional — so testimonials,
    # when present, always resolve through the Component Library rather than a template-specific layout.
    if business.testimonials:
        if "reviews" in allowed:
            sections["reviews"] = SectionManifest(type="reviews", data={"testimonials": business.testimonials})
        else:
            fallback = find_fallback_component("reviews")
            if fallback:
                components_used.append(fallback)
                sections["reviews"] = SectionManifest(
                    type=f"component:{fallback}", data={"testimonials": business.testimonials}
                )

    # --- contact: core, always present ---
    # featured_images[2] (if provided) becomes a highlight image next to the contact/CTA block.
    sections["contact"] = SectionManifest(
        type="contact",
        data={
            "phone": business.phone,
            "whatsapp": business.whatsapp,
            "email": getattr(business, "email", None),
            "address": business.address,
            "maps": business.maps,
            "maps_url": getattr(business, "maps_url", None),
            "booking_url": getattr(business, "booking_url", None),
            "order_url": getattr(business, "order_url", None),
            "image": business.featured_images[2] if len(business.featured_images) > 2 else None,
        },
    )

    # --- final ordering: template's fixed canonical order, filtered to what we actually built ---
    # (section 5.1: ordering changes only "within a template-defined allowed range, not arbitrary")
    section_order = [s for s in capabilities.section_order if s in sections]

    # Anything resolved purely via Component Library fallback (e.g. "reviews" above) isn't part of
    # any template's canonical order — insert it just before contact, or at the end if there's no contact.
    fallback_only = [s for s in sections if s not in section_order]
    if fallback_only:
        if "contact" in section_order:
            idx = section_order.index("contact")
            section_order = section_order[:idx] + fallback_only + section_order[idx:]
        else:
            section_order = section_order + fallback_only

    return RenderManifest(
        template_id=template_id,
        theme=groq_config.theme,
        section_order=section_order,
        sections=sections,
        components_used=components_used,
    )
