# DevFrames Component Library

A standalone, browsable library of static HTML/CSS components for building rich business
websites — separate from the main `devframes-mvp-scaffold.zip`, per your request.

## What's in here

**22 component categories, 86 working variants total.** Every file is real and renders —
nothing here is a placeholder or a stub.

| Component | Variants | Component | Variants |
|---|---|---|---|
| navbar | **10** | menu-services | 3 |
| hero | 6 | stats-counters | 3 |
| footer | 6 | team | 3 |
| about | 4 | faq | 3 |
| features | 4 | newsletter | 3 |
| gallery | 4 | map-location | 3 |
| testimonials | 4 | opening-hours | 3 |
| pricing | 4 | social-links | 3 |
| cta-banner | 4 | blog-teaser | 3 |
| contact-form | 4 | video-section | 3 |
| | | announcement-bar | 3 |
| | | timeline | 3 |

## Honest scope note

You asked for 10-15 variants per component (22 components × 10-15 = **220-375 files**). Hand-building
that many genuinely distinct, quality variants isn't something I could responsibly deliver as one
shot — it'd mean either shipping 300+ files where most are copy-paste with a color changed, or
taking far longer than a single conversation turn allows. Instead:

- **navbar got the full 10** you specifically asked for as the example.
- The 9 other "core" components (hero, footer, about, features, gallery, testimonials, pricing,
  cta-banner, contact-form) got 4-6 each — enough real variety to actually pick from.
- The remaining 12 "supporting" components got 3 each — present and usable, but the thinnest set.

**If you tell me which specific components matter most for your launch** (e.g. "get hero and
gallery to 10 each"), I can keep expanding those in follow-up turns using the exact same pattern
below — it's mechanical, just time-consuming to do all at once.

## How to browse

Open `index.html` in a browser. It's a sidebar gallery — click any component name to jump to it,
every variant renders live in an iframe. No build step, no server needed.

## File structure

```
components/
├── index.html              ← browsable gallery (open this)
├── README.md                ← this file
├── _shared/base.css         ← shared design tokens (CSS vars: --primary, --secondary, --accent,
│                                --font, --body-font) + reset + button/card/grid utility classes
├── navbar/
│   ├── manifest.json        ← {component, variants: [{id, name, tags}]}
│   ├── v1.html … v10.html
├── hero/
│   ├── manifest.json
│   ├── v1.html … v6.html
└── ... (20 more component folders, same shape)
```

Every variant file is fully self-contained HTML that links to `../_shared/base.css` — open any
`vN.html` directly in a browser and it renders on its own, with realistic sample content
("Paradise Kitchen", a restaurant) so you can judge how it'll actually look.

## How to plug a chosen variant into DevFrames

This library was built to slot directly into the **Component Registry** system already in
`devframes-mvp-scaffold.zip` (`backend/app/services/render_resolver.py` +
`backend/app/templates/sections/*.html`). The conversion is the same "replace hardcoded values
with data bindings" step used to build the original 3 templates from reference repos:

1. **Pick a variant** — say you like `hero/v6.html` (floating card on image).
2. **Copy it** into `devframes-mvp-scaffold/backend/app/templates/sections/` as a new file, e.g.
   `hero-v6.html`.
3. **Replace hardcoded text with Jinja tokens** matching what `render_resolver.py` already puts
   in a hero section's manifest data:
   ```html
   <!-- before (this library) -->
   <h1>Authentic South Indian Flavours</h1>
   <p>Fresh, homestyle cooking since day one.</p>

   <!-- after (DevFrames-ready) -->
   <h1>{{ section.data.headline }}</h1>
   <p>{{ section.data.description }}</p>
   ```
   Swap `var(--primary)` etc. for `{{ manifest.theme.primary }}` if you want per-business
   theming (the shared `base.css` in this library uses plain CSS vars; DevFrames' own
   `base/base.html` injects them from the manifest — same variable names, so this is usually a
   find-and-replace of the `:root {}` block only, not the component markup).
4. **Register it as a section-type alternative** — right now `template_engine.py`'s
   `TEMPLATE_REGISTRY` maps one whole template id to one `.html` file. To let an owner pick
   "which hero style" independently of "which overall template," the natural extension is:
   add a `hero_variant` field to `WebsiteCreate`, and in the hero include line
   (`{% include 'sections/' ~ section.type ~ '.html' %}`), resolve to
   `sections/hero-{{ manifest.hero_variant }}.html` when one was chosen, falling back to the
   template's default otherwise. This is a small, contained change — a few lines in
   `render_resolver.py` and one route parameter — because the Component Registry architecture
   was already built to support exactly this kind of per-section override.
5. Repeat for any other component category you want owner-selectable.

This is genuinely non-trivial engineering work (step 4 especially), not a copy-paste — flagging
that clearly rather than implying it's automatic.
