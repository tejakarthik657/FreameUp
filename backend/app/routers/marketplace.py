from fastapi import APIRouter, Query
from app.services.marketplace_service import list_palettes, list_fonts, list_stock_images

router = APIRouter(prefix="/marketplace", tags=["marketplace"])


@router.get("/palettes")
async def get_palettes():
    return {"palettes": list_palettes()}


@router.get("/fonts")
async def get_fonts():
    return {"fonts": list_fonts()}


@router.get("/stock-images")
async def get_stock_images(category: str = Query(..., pattern="^(restaurant|salon|local_services)$")):
    # NOTE: ships with placehold.co placeholder imagery so the marketplace flow is fully
    # working end-to-end. Swap `app/data/stock_image_catalog/*.json` for a real licensed
    # source (Unsplash API, Pexels API, or your own curated Cloudinary folder) before launch.
    return {"images": list_stock_images(category)}
