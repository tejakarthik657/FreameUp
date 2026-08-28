from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.config import settings
from app.routers import auth, business, ai, sites, qr, marketplace, auth_google, leads

app = FastAPI(title="DevFrames API", version="1.0.0")

# Register SessionMiddleware (needed for Authlib Google OAuth flow state parameters)
app.add_middleware(
    SessionMiddleware,
    secret_key="devframes-google-oauth-session-secret-key-change-in-production-2026",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
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


@app.get("/health")
async def health():
    return {"status": "ok"}
