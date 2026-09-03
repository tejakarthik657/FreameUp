"use client";

import type { ComponentType } from "react";
import { getComponentMeta } from "./manifest";
import { NAVBAR_VARIANTS, getNavbarVariant } from "./navbar";
import { HERO_VARIANTS, getHeroVariant } from "./hero";
import { ABOUT_VARIANTS, getAboutVariant } from "./about";
import { ANNOUNCEMENT_BAR_VARIANTS, getAnnouncementBarVariant } from "./announcement-bar";
import { BLOG_TEASER_VARIANTS, getBlogTeaserVariant } from "./blog-teaser";
import { CONTACT_FORM_VARIANTS, getContactFormVariant } from "./contact-form";
import { CTA_BANNER_VARIANTS, getCtaBannerVariant } from "./cta-banner";
import { FAQ_VARIANTS, getFaqVariant } from "./faq";
import { FEATURES_VARIANTS, getFeaturesVariant } from "./features";
import { FOOTER_VARIANTS, getFooterVariant } from "./footer";
import { GALLERY_VARIANTS, getGalleryVariant } from "./gallery";
import { MAP_LOCATION_VARIANTS, getMapLocationVariant } from "./map-location";
import { MENU_SERVICES_VARIANTS, getMenuServicesVariant } from "./menu-services";
import { NEWSLETTER_VARIANTS, getNewsletterVariant } from "./newsletter";
import { OPENING_HOURS_VARIANTS, getOpeningHoursVariant } from "./opening-hours";
import { PRICING_VARIANTS, getPricingVariant } from "./pricing";
import { SOCIAL_LINKS_VARIANTS, getSocialLinksVariant } from "./social-links";
import { STATS_COUNTERS_VARIANTS, getStatsCountersVariant } from "./stats-counters";
import { TEAM_VARIANTS, getTeamVariant } from "./team";
import { TESTIMONIALS_VARIANTS, getTestimonialsVariant } from "./testimonials";
import { TIMELINE_VARIANTS, getTimelineVariant } from "./timeline";
import { VIDEO_SECTION_VARIANTS, getVideoSectionVariant } from "./video-section";
import "./library-preview.css";

/** Generic prop envelope for any rendered variant. */
export type VariantProps = Record<string, unknown>;

export interface ResolvedVariant {
  componentId: string;
  variantId: string;
  Component?: ComponentType<VariantProps>;
  htmlPath: string;
}

const GETTERS: Record<string, (id: string) => unknown> = {
  navbar: getNavbarVariant,
  hero: getHeroVariant,
  about: getAboutVariant,
  "announcement-bar": getAnnouncementBarVariant,
  "blog-teaser": getBlogTeaserVariant,
  "contact-form": getContactFormVariant,
  "cta-banner": getCtaBannerVariant,
  faq: getFaqVariant,
  features: getFeaturesVariant,
  footer: getFooterVariant,
  gallery: getGalleryVariant,
  "map-location": getMapLocationVariant,
  "menu-services": getMenuServicesVariant,
  newsletter: getNewsletterVariant,
  "opening-hours": getOpeningHoursVariant,
  pricing: getPricingVariant,
  "social-links": getSocialLinksVariant,
  "stats-counters": getStatsCountersVariant,
  team: getTeamVariant,
  testimonials: getTestimonialsVariant,
  timeline: getTimelineVariant,
  "video-section": getVideoSectionVariant,
};

/** Returns a TSX renderer for any category+variant combo, or undefined if
 *  the requested component/variant does not exist. */
export function getTsxRenderer(
  componentId: string,
  variantId: string
): ComponentType<VariantProps> | undefined {
  const get = GETTERS[componentId];
  if (!get) return undefined;
  return get(variantId) as ComponentType<VariantProps> | undefined;
}

export function resolveVariant(componentId: string, variantId: string): ResolvedVariant | null {
  const meta = getComponentMeta(componentId);
  if (!meta) return null;
  if (!meta.variants.some((v) => v.id === variantId)) return null;
  const Component = getTsxRenderer(componentId, variantId);
  return {
    componentId,
    variantId,
    Component,
    htmlPath: `/library-originals/${componentId}/${variantId}.html`,
  };
}

export const TSX_COMPONENT_IDS = Object.keys(GETTERS);

export {
  NAVBAR_VARIANTS,
  HERO_VARIANTS,
  ABOUT_VARIANTS,
  ANNOUNCEMENT_BAR_VARIANTS,
  BLOG_TEASER_VARIANTS,
  CONTACT_FORM_VARIANTS,
  CTA_BANNER_VARIANTS,
  FAQ_VARIANTS,
  FEATURES_VARIANTS,
  FOOTER_VARIANTS,
  GALLERY_VARIANTS,
  MAP_LOCATION_VARIANTS,
  MENU_SERVICES_VARIANTS,
  NEWSLETTER_VARIANTS,
  OPENING_HOURS_VARIANTS,
  PRICING_VARIANTS,
  SOCIAL_LINKS_VARIANTS,
  STATS_COUNTERS_VARIANTS,
  TEAM_VARIANTS,
  TESTIMONIALS_VARIANTS,
  TIMELINE_VARIANTS,
  VIDEO_SECTION_VARIANTS,
};