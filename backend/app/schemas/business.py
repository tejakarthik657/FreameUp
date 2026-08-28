"""
The single shared data contract every template consumes, per section 5.2 of the product doc.
Groq output gets merged into this shape's `generated_content`; it never replaces it.
"""
from typing import Optional, Literal
from pydantic import BaseModel, Field


class MenuItem(BaseModel):
    name: str
    price: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None   # e.g. "Starters", "Mains", "Desserts", "Drinks"
    is_veg: Optional[bool] = None    # Restaurant: vegetarian flag


class ServiceItem(BaseModel):
    name: str
    price: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    category: Optional[str] = None   # e.g. "Hair", "Skin", "Nails" for salon


class Hours(BaseModel):
    day: str
    open: Optional[str] = None
    close: Optional[str] = None
    closed: bool = False


class TeamMember(BaseModel):
    name: str
    role: str
    image: Optional[str] = None


class Testimonial(BaseModel):
    quote: str
    author: str
    role: Optional[str] = None


class BusinessIn(BaseModel):
    """What the intake flow (section 4 / step 2 of build priorities) collects. Kept deliberately short."""
    category: Literal["restaurant", "salon", "local_services", "others"]
    name: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    maps: Optional[str] = None
    maps_url: Optional[str] = None
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    threads: Optional[str] = None
    website_url: Optional[str] = None
    booking_url: Optional[str] = None
    order_url: Optional[str] = None
    hours: list[Hours] = Field(default_factory=list)
    images: list[str] = Field(default_factory=list)   # Cloudinary URLs only, never raw bytes
    logo: Optional[str] = None                          # Cloudinary URL — owner's brand logo

    services: list[ServiceItem] = Field(default_factory=list)   # salon / local_services / others
    menu: list[MenuItem] = Field(default_factory=list)          # restaurant

    # Sector-specific metadata
    business_type: Optional[str] = None        # Free-text sub-type for "others" (e.g. "Bookstore")
    cuisine_type: Optional[str] = None         # Restaurant: "Indian", "Italian", etc.
    salon_type: Optional[str] = None           # Salon: "Hair Salon", "Spa", "Barbershop", etc.
    service_type: Optional[str] = None         # Local Services: "Plumbing", "Electrical", etc.
    years_in_business: Optional[str] = None    # e.g. "5" or "Est. 2019"
    emergency_service: Optional[bool] = None   # Local Services: offers 24/7 emergency?
    response_time: Optional[str] = None        # Local Services: "Within 2 hours"
    walk_in_accepted: Optional[bool] = None    # Salon: walk-ins welcome?
    certifications: Optional[str] = None       # Local Services: trust-building credentials
    service_area: Optional[str] = None         # Local Services: cities/areas covered

    # New advanced fields
    price_range: Optional[str] = None          # Restaurant / Salon: e.g. "$$", "Moderate"
    dietary_options: Optional[str] = None      # Restaurant: e.g. "Vegan, Vegetarian, Gluten-Free"
    reservation_policy: Optional[str] = None   # Restaurant / Salon: e.g. "Reservations Recommended"
    parking_info: Optional[str] = None         # General: e.g. "Valet Parking Available"
    dress_code: Optional[str] = None           # Restaurant: e.g. "Smart Casual"
    ambience: Optional[str] = None             # Restaurant / Salon: e.g. "Cosy, Fine Dining, Romantic"
    brands_used: Optional[str] = None          # Salon: e.g. "Olaplex, L'Oreal"
    amenities: Optional[str] = None            # General: e.g. "Free Wi-Fi, Coffee, Wheelchair Accessible"
    accessibility: Optional[str] = None        # General: e.g. "Wheelchair Access"
    cancellation_policy: Optional[str] = None   # Salon / Service: e.g. "24h Cancellation notice"
    specialties: Optional[str] = None           # Salon / Service: e.g. "Balayage, Handyman, Root Canal"
    licensing_info: Optional[str] = None       # Service: e.g. "Licensed Plumber"
    warranty_info: Optional[str] = None         # Service: e.g. "1 year warranty"
    pricing_model: Optional[str] = None         # Service: e.g. "Flat rate, Hourly rates"
    menu_image_url: Optional[str] = None        # Restaurant: Direct menu card image link

    team: list[TeamMember] = Field(default_factory=list)
    testimonials: list[Testimonial] = Field(default_factory=list)
    featured_images: list[str] = Field(default_factory=list, max_length=3)
    # ^ up to 3 owner-chosen images (their own upload OR picked from the stock marketplace), used in
    # SPECIFIC placements, not a generic pile: [0] -> hero background, [1] -> about section, [2] -> CTA highlight.
    # `images` above stays the general (unbounded) gallery.


class BusinessOut(BusinessIn):
    id: str
    user_id: str


class GeneratedTheme(BaseModel):
    primary: str
    secondary: str
    font: str = "Inter"


class GeneratedSection(BaseModel):
    title: str
    description: str


class GeneratedHero(BaseModel):
    headline: str
    description: str
    cta: str = "Get in touch"


class GeneratedContent(BaseModel):
    """The exact JSON contract Groq must return — see services/groq_service.py."""
    hero: GeneratedHero
    about: GeneratedSection
    theme: GeneratedTheme
    section_order: list[str] = Field(
        default_factory=lambda: ["hero", "about", "menu_or_services", "gallery", "contact"]
    )
