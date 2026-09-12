from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.sessions import SessionMiddleware
from app.config import settings
from app.routers import auth, business, ai, sites, qr, marketplace, auth_google, leads, posters, ai_agent, operations, localization, loyalty, invoices, staff, importer

app = FastAPI(title="DevFrames API", version="1.0.0")

# Register SessionMiddleware (needed for Authlib Google OAuth flow state parameters)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.session_secret,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_origin_regex=r"https://.*\.vercel\.app$",  # covers all Vercel preview URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(auth_google.router)
app.include_router(business.router)
app.include_router(ai.router)
app.include_router(sites.router)
app.include_router(qr.router)
app.include_router(marketplace.router)
app.include_router(leads.router)
app.include_router(posters.router)
app.include_router(ai_agent.router)
app.include_router(operations.router)
app.include_router(localization.router)
app.include_router(loyalty.router)
app.include_router(invoices.router)
app.include_router(staff.router)
app.include_router(importer.router)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Ensure CORS headers are present even on unhandled 500 errors.
    Without this, browser shows a misleading CORS error instead of the real 500 message."""
    origin = request.headers.get("origin", "")
    headers = {}
    allowed_origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
    if origin in allowed_origins or ".vercel.app" in origin:
        headers["Access-Control-Allow-Origin"] = origin
        headers["Access-Control-Allow-Credentials"] = "true"
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers=headers,
    )
