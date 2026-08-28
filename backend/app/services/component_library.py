"""
Section 4.3 / 8.1 of the Adaptive Template spec: the Component Library.
A small set of standalone, template-agnostic components that the render_resolver can insert
when a template doesn't natively support a feature the owner provided — so nothing the owner
gave us silently disappears, but nothing gets forced onto a page in a way that breaks the
template's design either.

Per the spec's build order (section 8.4, step 4): "start with just 2-3 generic components."
This ships with 2: a generic social link, and generic reviews/testimonials.
"""
from typing import Optional

COMPONENT_LIBRARY: dict[str, dict] = {
    "generic_social_link": {
        "handles_features": ["threads", "youtube", "tiktok", "facebook", "linkedin", "x", "twitter"],
        "partial": "components/generic_social_link.html",
    },
    "generic_reviews": {
        "handles_features": ["reviews"],
        "partial": "components/generic_reviews.html",
    },
}


def find_fallback_component(feature: str) -> Optional[str]:
    """Returns the component id that can handle `feature`, or None if nothing in the library covers it
    (in which case the render_resolver omits it gracefully — see spec section 4.3)."""
    for component_id, entry in COMPONENT_LIBRARY.items():
        if feature in entry["handles_features"]:
            return component_id
    return None
