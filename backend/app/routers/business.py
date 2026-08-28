from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from bson import ObjectId
from app.database import businesses_collection
from app.models.business import BusinessDB
from app.schemas.business import BusinessIn, BusinessOut
from app.routers.auth import get_current_user_id
from app.services.cloudinary_service import upload_image

router = APIRouter(prefix="/business", tags=["business"])


@router.post("", response_model=BusinessOut)
async def create_business(payload: BusinessIn, user_id: str = Depends(get_current_user_id)):
    # Enforce maximum 2 projects (businesses) per user
    existing_count = await businesses_collection.count_documents({"user_id": user_id})
    if existing_count >= 2:
        raise HTTPException(
            status_code=400,
            detail="Project limit reached. You can only create up to 2 projects on the free tier."
        )

    doc = BusinessDB(user_id=user_id, **payload.model_dump())
    result = await businesses_collection.insert_one(doc.model_dump())
    return BusinessOut(id=str(result.inserted_id), user_id=user_id, **payload.model_dump())


@router.get("", response_model=list[BusinessOut])
async def list_businesses(user_id: str = Depends(get_current_user_id)):
    """List all businesses owned by the current user."""
    docs = await businesses_collection.find({"user_id": user_id}).to_list(20)
    result = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        result.append(BusinessOut(**d))
    return result


@router.get("/{business_id}", response_model=BusinessOut)
async def get_business(business_id: str, user_id: str = Depends(get_current_user_id)):
    doc = await businesses_collection.find_one({"_id": ObjectId(business_id), "user_id": user_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    doc["id"] = str(d.pop("_id"))
    return BusinessOut(**doc)


@router.post("/upload-image")
async def upload_business_image(file: UploadFile = File(...), user_id: str = Depends(get_current_user_id)):
    # Proxied through FastAPI so the Cloudinary secret never reaches Next.js.
    contents = await file.read()
    url = upload_image(contents, folder=f"devframes/{user_id}")
    return {"url": url}
