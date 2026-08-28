"""
Section 4.2 + 8.1 of the Adaptive Template spec.
Loads every templates/<category>/<style>.manifest.json into a central catalog the backend reads,
instead of hardcoding template capability logic per business type.
"""
import json
from pathlib import Path
from app.schemas.template_registry import TemplateManifestDef

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "templates"

_cache: dict[str, TemplateManifestDef] = {}


def _load_all() -> None:
    if _cache:
        return
    for manifest_file in TEMPLATES_DIR.rglob("*.manifest.json"):
        data = json.loads(manifest_file.read_text(encoding="utf-8-sig"))
        entry = TemplateManifestDef(**data)
        _cache[entry.id] = entry


def get_template_capabilities(template_id: str) -> TemplateManifestDef:
    _load_all()
    if template_id not in _cache:
        raise ValueError(f"No registry entry for template '{template_id}'. Known: {list(_cache.keys())}")
    return _cache[template_id]


def list_template_ids() -> list[str]:
    _load_all()
    return list(_cache.keys())
