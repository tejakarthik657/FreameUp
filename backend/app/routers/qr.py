from fastapi import APIRouter
from app.services.qr_service import generate_qr_data_url

router = APIRouter(prefix="/qr", tags=["qr"])


@router.get("")
async def get_qr(url: str):
    return {"qr_data_url": generate_qr_data_url(url)}
