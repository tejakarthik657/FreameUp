"""
Loads the curated catalogs from app/data/*.json. Kept as flat files (not a DB collection) since
this is admin-curated content, not user data — versioning it via the codebase (git) makes more
sense than a MongoDB collection for an MVP. Swap for a DB-backed admin panel once you want
non-engineers editing the catalog.
"""
import json
from pathlib import Path
from app.schemas.marketplace import Palette, FontPairing, StockImage

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

_palettes: list[Palette] | None = None
_fonts: list[FontPairing] | None = None
_stock_images: dict[str, list[StockImage]] | None = None


def list_palettes() -> list[Palette]:
    global _palettes
    if _palettes is None:
        raw = json.loads((DATA_DIR / "palette_catalog.json").read_text())
        _palettes = [Palette(**p) for p in raw]
    return _palettes


def get_palette(palette_id: str) -> Palette | None:
    return next((p for p in list_palettes() if p.id == palette_id), None)


def list_fonts() -> list[FontPairing]:
    global _fonts
    if _fonts is None:
        raw = json.loads((DATA_DIR / "font_catalog.json").read_text())
        _fonts = [FontPairing(**f) for f in raw]
    return _fonts


def get_font(font_id: str) -> FontPairing | None:
    return next((f for f in list_fonts() if f.id == font_id), None)


def list_stock_images(category: str) -> list[StockImage]:
    global _stock_images
    if _stock_images is None:
        _stock_images = {}
        for f in (DATA_DIR / "stock_image_catalog").glob("*.json"):
            raw = json.loads(f.read_text())
            for entry in raw:
                _stock_images.setdefault(entry["category"], []).append(StockImage(**entry))
    return _stock_images.get(category, [])
