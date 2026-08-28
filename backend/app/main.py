from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, business, ai, sites, qr, marketplace

app = FastAPI(title="DevFrames API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(business.router)
app.include_router(ai.router)
app.include_router(sites.router)
app.include_router(qr.router)
app.include_router(marketplace.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
