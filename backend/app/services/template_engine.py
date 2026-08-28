"""
Section 8.3 of the Adaptive Template spec: each template component "accepts only the resolved
render_manifest — never raw Groq output, never raw business data directly [for section-presence
decisions]." All adaptive logic (what renders, in what order, at what density) already happened
in render_resolver.py. This engine's job is now purely mechanical: hand the manifest + business
(for raw display fields like phone/name/logo that every section partial may need) to Jinja2.

Registering a new template variant from the product doc's 9-cell matrix is still just:
  1. add templates/<category>/<style>.html   (extends base/base.html, loops manifest.section_order)
  2. add templates/<category>/<style>.manifest.json  (its Capability Contract, section 4.2)
  3. add one line to TEMPLATE_REGISTRY below
No section-partial code needs to change — every template shares the same sections/*.html and
components/*.html library.
"""
from pathlib import Path
from jinja2 import Environment, FileSystemLoader, select_autoescape
from app.schemas.business import BusinessIn
from app.schemas.render_manifest import RenderManifest

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "templates"

_env = Environment(
    loader=FileSystemLoader(str(TEMPLATES_DIR)),
    autoescape=select_autoescape(["html"]),
)

TEMPLATE_REGISTRY: dict[str, str] = {
    "restaurant-premium": "restaurant/premium.html",
    "restaurant-modern": "restaurant/modern.html",
    "restaurant-local": "restaurant/local.html",
    "salon-luxury": "salon/luxury.html",
    "salon-modern": "salon/modern.html",
    "salon-minimal": "salon/minimal.html",
    "services-professional": "local_services/professional.html",
    "local_services-professional": "local_services/professional.html",  # legacy compatibility
    "services-bold": "local_services/bold.html",
    "services-local": "local_services/local.html",
}


def list_templates() -> list[str]:
    return list(TEMPLATE_REGISTRY.keys())


def render_website(template_id: str, business: BusinessIn, manifest: RenderManifest) -> str:
    if template_id not in TEMPLATE_REGISTRY:
        raise ValueError(f"Unknown template_id '{template_id}'. Known: {list_templates()}")

    tpl = _env.get_template(TEMPLATE_REGISTRY[template_id])
    return tpl.render(business=business, manifest=manifest)
