import { z } from "zod";
import { isSafeLink } from "./linkUtils";

export const BrandingSchema = z.object({
  firmName: z.string().default("Ashish Shahu & Co."),
  tagline: z.string().default(""),
  registrationNumber: z.string().default("Firm Reg. No. XXXXXX"),
  phone: z.string().default("+91 00000 00000"),
  email: z.string().default("office@example-cafirm.com"),
  address: z.string().default("101, Sample Business Hub, Financial District, Mumbai 400001"),
  workingHours: z.string().default("Mon – Sat: 10:00 AM – 6:30 PM"),
  logoUrl: z.string().optional().default(""),
  faviconUrl: z.string().optional().default(""),
});

export const ThemeTokensSchema = z.object({
  primaryColor: z.string().default("#0f6e56"),
  accentColor: z.string().default("#1d9e75"),
  backgroundColor: z.string().default("#ffffff"),
  surfaceColor: z.string().default("#f9fafb"),
  textColor: z.string().default("#111827"),
  fontFamily: z.string().default("Space Grotesk"),
  headingFontFamily: z.string().default("Space Grotesk"),
  bodyFontFamily: z.string().default("Space Grotesk"),
  borderRadius: z.enum(["none", "sm", "md", "lg", "full"]).default("md"),
  animationsEnabled: z.boolean().default(true),
  animationStyle: z.enum(["fade-up", "slide-in", "zoom", "subtle", "none"]).default("fade-up"),
  animationSpeed: z.enum(["slow", "normal", "fast"]).default("normal"),
  cardHoverEffect: z.boolean().default(true),
  scrollAnimations: z.boolean().default(true),
  glassmorphism: z.boolean().default(true),
  glowingBadges: z.boolean().default(true),
  scrollProgressBar: z.boolean().default(false),
});

export const SafeLinkSchema = z
  .string()
  .max(500, "Link too long (max 500 characters)")
  .refine(
    (val) => isSafeLink(val),
    { message: "Invalid or unsafe URL. Only relative paths (/...), #anchors, or https:// URLs are permitted." }
  );

export const HttpsOnlyUrlSchema = z
  .string()
  .max(500, "URL too long (max 500 characters)")
  .refine(
    (val) => {
      if (!val) return true;
      try {
        const u = new URL(val);
        if (u.username || u.password) return false;
        return u.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Must be a secure https:// URL." }
  );

export const HeaderNavItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().max(40, "Navigation label max 40 characters"),
  url: SafeLinkSchema,
  enabled: z.boolean().default(true),
});

export const HeaderCtaSchema = z.object({
  label: z.string().max(40, "CTA label max 40 characters").default("Get In Touch"),
  url: SafeLinkSchema.default("#contact"),
  enabled: z.boolean().default(true),
});

export const MegaMenuItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().max(80, "Service label max 80 characters"),
  url: SafeLinkSchema.default("#services"),
  popular: z.boolean().optional(),
});

export const MegaMenuCategorySchema = z.object({
  id: z.string().optional(),
  title: z.string().max(60, "Category title max 60 characters"),
  icon: z.string().optional(),
  viewAllText: z.string().optional(),
  viewAllUrl: SafeLinkSchema.optional(),
  items: z.array(MegaMenuItemSchema).default([]),
});

export const MegaMenuConfigSchema = z.object({
  enabled: z.boolean().default(true),
  categories: z.array(MegaMenuCategorySchema).default([]),
  bottomNotice: z.string().optional(),
  bottomLinkText: z.string().optional(),
  bottomLinkUrl: SafeLinkSchema.optional(),
});

export const HeaderConfigSchema = z.object({
  layout: z.enum(["standard", "centered", "topbar-cta"]).default("standard"),
  showTopInfoBar: z.boolean().default(true),
  headerCta: HeaderCtaSchema.optional(),
  showWhatsAppBtn: z.boolean().default(true),
  showClientPortalBtn: z.boolean().default(true),
  sticky: z.boolean().default(true),
  navLinks: z.array(HeaderNavItemSchema).max(8, "Maximum 8 navigation items allowed").default([]),
  megaMenu: MegaMenuConfigSchema.optional(),
});

export const FooterQuickLinkSchema = z.object({
  label: z.string().max(40, "Link label max 40 characters"),
  url: SafeLinkSchema,
});

export const FooterQuickLinkGroupSchema = z.object({
  title: z.string().max(40, "Group title max 40 characters"),
  links: z.array(FooterQuickLinkSchema).max(6, "Maximum 6 links per group allowed").default([]),
});

export const FooterSocialLinkSchema = z.object({
  platform: z.enum(["linkedin", "x", "facebook", "instagram", "youtube"]),
  url: HttpsOnlyUrlSchema,
});

export const FooterConfigSchema = z.object({
  layout: z.enum(["simple", "multi-column", "minimal"]).default("multi-column"),
  copyrightText: z.string().default(""),
  icaiDisclaimer: z.boolean().default(true),
  disclaimerText: z.string().default(
    "Standard Professional Disclaimer: In accordance with the Chartered Accountants Act, 1949 and guidelines issued by the regulatory council, this website is designed solely for providing informational facts about the firm and its areas of practice. It does not constitute an advertisement, personal communication, solicitation, or invitation to offer work."
  ),
  quickLinkGroups: z.array(FooterQuickLinkGroupSchema).max(2, "Maximum 2 quick link groups allowed").default([]),
  socialLinks: z.array(FooterSocialLinkSchema).default([]),
});

export const SeoConfigSchema = z.object({
  siteTitle: z.string().max(60, "Site title max 60 characters").default("Ashish Shahu & Co. | Chartered Accountants"),
  metaDescription: z.string().max(160, "Meta description max 160 characters").default("Professional Tax, Audit, GST & Compliance Advisory for Modern Enterprises in India."),
  socialShareImageUrl: HttpsOnlyUrlSchema.optional(),
  noIndexInDraft: z.boolean().default(true),
  metaTitle: z.string().optional(),
  ogImageUrl: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
});

export const HeroSectionPropsSchema = z.object({
  headline: z.string().max(200, "Headline max 200 characters").default(""),
  subheadline: z.string().max(500, "Subheadline max 500 characters").default(""),
  primaryCtaText: z.string().max(50, "Button label max 50 characters").default(""),
  primaryCtaLink: SafeLinkSchema.default("#services"),
  secondaryCtaText: z.string().max(50, "Button label max 50 characters").default(""),
  secondaryCtaLink: SafeLinkSchema.default("#contact"),
});

export const ServicesSectionPropsSchema = z.object({
  title: z.string().max(120, "Title max 120 characters").default(""),
  subtitle: z.string().max(300, "Subtitle max 300 characters").default(""),
  visibleServiceIds: z.array(z.string()).default([]),
});

export const CtaSectionPropsSchema = z.object({
  headline: z.string().max(200, "Headline max 200 characters").default(""),
  subheadline: z.string().max(400, "Subheadline max 400 characters").default(""),
  buttonText: z.string().max(50, "Button label max 50 characters").default(""),
  buttonLink: SafeLinkSchema.default("#contact"),
});

export const ContactSectionPropsSchema = z.object({
  title: z.string().max(120, "Title max 120 characters").default(""),
  subtitle: z.string().max(300, "Subtitle max 300 characters").default(""),
  showMapPlaceholder: z.boolean().default(true),
});

export const GenericSectionPropsSchema = z.object({
  title: z.string().max(120, "Title max 120 characters").default(""),
  subtitle: z.string().max(300, "Subtitle max 300 characters").default(""),
});

export const SectionConfigSchema = z.object({
  id: z.string(),
  type: z.enum([
    "hero",
    "services",
    "tax-calendar",
    "calculators",
    "testimonials",
    "cta",
    "contact",
    "footer",
  ]),
  enabled: z.boolean().default(true),
  order: z.number().default(0),
  props: z.record(z.string(), z.unknown()).default({}),
});

export const PageConfigSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  sections: z.array(SectionConfigSchema).default([]),
});

export const WebsiteConfigSchema = z.object({
  firmId: z.string().min(1, "firmId is mandatory for all configs"),
  version: z.number().default(1),
  templateId: z.string().min(1),
  branding: BrandingSchema,
  theme: ThemeTokensSchema,
  header: HeaderConfigSchema,
  footer: FooterConfigSchema,
  seo: SeoConfigSchema,
  pages: z.array(PageConfigSchema).default([]),
  updatedAt: z.string(),
});
