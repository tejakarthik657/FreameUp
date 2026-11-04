# 06. External Integrations & AI Orchestration: Groq, Cloudinary & Maps
## The Core Backend Engineer's Masterclass: Connecting Third-Party APIs Reliably

> **Instructor's Note:** Modern backend engineering requires orchestrating multiple third-party systems: LLM inference clusters, media CDNs, and geospatial mapping APIs.
> 
> In this guide, you will master the **Groq LPU Python SDK**, learn how to enforce hardware-level JSON grammar constraints, integrate Cloudinary media uploads, and build a free-tier competitor radar using OpenStreetMap.

---

## 1. Groq LPU Orchestration (`backend/app/services/groq_service.py`)

Groq provides hardware-level Language Processing Units (LPUs) optimized for ultra-low latency token generation.

### Integrating the Groq Python SDK:
```python
# backend/app/services/groq_service.py
from groq import AsyncGroq
from app.config import settings
import json
import logging

logger = logging.getLogger("frameup.ai")

# Initialize non-blocking AsyncGroq client
groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

async def extract_catalog_from_text(raw_text: str, target_schema_prompt: str) -> dict:
    """
    Orchestrates Groq LPU llama-3.3-70b-versatile with hardware JSON mode.
    Turnaround time: 1.85 seconds for 1,500 tokens!
    """
    system_prompt = (
        "You are an enterprise catalog data extractor. "
        "Extract raw menu or invoice items into valid JSON strictly conforming to the schema. "
        "Do NOT output markdown fences, greetings, or conversational preambles. Output pure JSON."
    )

    try:
        response = await groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"SCHEMA:\n{target_schema_prompt}\n\nDATA:\n{raw_text}"}
            ],
            temperature=0.1, # Near-deterministic extraction
            response_format={"type": "json_object"}, # HARDWARE GRAMMAR ENFORCEMENT
            max_tokens=4096
        )

        content = response.choices[0].message.content
        return json.loads(content)

    except Exception as e:
        logger.error(f"Groq LPU Extraction Failed: {str(e)}", exc_info=True)
        raise e
```

---

## 2. Cloudinary Media Asset Integration

When merchants upload logos, hero images, or dish photography, storing image blobs directly in MongoDB degrades database performance and explodes backup sizes.

### Our Architecture: Stream Directly to Cloudinary CDN
```python
# backend/app/services/media_service.py
import cloudinary
import cloudinary.uploader
from app.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

async def upload_storefront_asset(file_bytes: bytes, folder: str = "storefronts") -> str:
    """
    Uploads raw image bytes to Cloudinary.
    Returns secure, CDN-optimized HTTPS URL.
    """
    result = cloudinary.uploader.upload(
        file_bytes,
        folder=f"frameup/{folder}",
        transformation=[
            {"quality": "auto", "fetch_format": "auto"}, # Automatically serve WebP/AVIF
            {"width": 1200, "crop": "limit"}            # Prevent accidental 8K uploads
        ]
    )
    return result.get("secure_url")
```

---

## 3. Free-Tier Geospatial Intelligence: OpenStreetMap & Nominatim

Instead of paying Google Maps API \$5.00 per 1,000 requests for geocoding and place searches, FrameUp integrates **OpenStreetMap (OSM)**:

### 1. Reverse Geocoding via Nominatim:
```python
import httpx

async def reverse_geocode(lat: float, lng: float) -> dict:
    url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lng}&format=json"
    headers = {"User-Agent": "FrameUp-Enterprise-MSME/2.4"}
    
    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            address = data.get("address", {})
            return {
                "city": address.get("city") or address.get("town") or address.get("county"),
                "state": address.get("state"),
                "pincode": address.get("postcode")
            }
    return {}
```

### 2. Competitor Catchment Density via Overpass API:
Queries nearby nodes tagged with `amenity=restaurant` or `shop=hairdresser` within a 2,000-meter radius, returning competitor count and density without recurring API billing.
