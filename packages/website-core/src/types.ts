export type TemplateId =
  | "apex-corporate"
  | "fintech-modern"
  | "trust-classic"
  | "minimal-studio"
  | "easy-filings"
  | "accountax"
  | "fortax"
  | "lumen"
  | "pulse"
  | "ledger"
  | "kinetic"
  | (string & {});

export type SectionType =
  | "hero"
  | "services"
  | "tax-calendar"
  | "calculators"
  | "about"
  | "testimonials"
  | "cta"
  | "contact"
  | "footer";

export interface BrandingConfig {
  firmName: string;
  tagline: string;
  registrationNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export interface ThemeTokens {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  fontFamily?: string;
  headingFontFamily?: "Space Grotesk" | "Inter" | "Playfair Display" | "Plus Jakarta Sans" | string;
  bodyFontFamily?: "Space Grotesk" | "Inter" | "Playfair Display" | "Plus Jakarta Sans" | string;
  borderRadius: "none" | "sm" | "md" | "lg" | "full";
  animationsEnabled?: boolean;
  animationStyle?: "fade-up" | "slide-in" | "zoom" | "subtle" | "none";
  animationSpeed?: "slow" | "normal" | "fast";
  cardHoverEffect?: boolean;
  scrollAnimations?: boolean;
  glassmorphism?: boolean;
  glowingBadges?: boolean;
  scrollProgressBar?: boolean;
}

export interface HeaderNavItem {
  id?: string;
  label: string; // max 40
  url: string; // validated via isSafeLink
  enabled: boolean;
}

export interface HeaderCta {
  label: string;
  url: string;
  enabled: boolean;
}

export interface MegaMenuItem {
  id?: string;
  label: string;
  url: string;
  popular?: boolean;
}

export interface MegaMenuCategory {
  id?: string;
  title: string;
  icon?: string;
  viewAllText?: string;
  viewAllUrl?: string;
  items: MegaMenuItem[];
}

export interface MegaMenuConfig {
  enabled: boolean;
  categories: MegaMenuCategory[];
  bottomNotice?: string;
  bottomLinkText?: string;
  bottomLinkUrl?: string;
}

export const DEFAULT_MEGA_MENU_CONFIG: MegaMenuConfig = {
  enabled: true,
  bottomNotice: "Every service includes document review, departmental follow-up and a tracked compliance calendar.",
  bottomLinkText: "Browse all services →",
  bottomLinkUrl: "#services",
  categories: [
    {
      id: "cat-gst",
      title: "GST SERVICES",
      icon: "FileText",
      viewAllText: "View all 9 →",
      viewAllUrl: "#services",
      items: [
        { id: "gst-lut", label: "GST LUT Filing", url: "#services", popular: true },
        { id: "gst-1", label: "GST Registration", url: "#services", popular: true },
        { id: "gst-2", label: "GST Return Filing", url: "#services", popular: true },
        { id: "gst-3", label: "GST Modification / Amendment", url: "#services" },
        { id: "gst-4", label: "GST Cancellation / Surrender", url: "#services" },
        { id: "gst-5", label: "GST Annual Return (GSTR-9 & 9C)", url: "#services" },
      ],
    },
    {
      id: "cat-tax",
      title: "INCOME TAX & TDS",
      icon: "Scale",
      items: [
        { id: "tax-1", label: "Income Tax Return Filing", url: "#services", popular: true },
        { id: "tax-2", label: "TDS Return Filing", url: "#services" },
        { id: "tax-3", label: "Tax Audit (Section 44AB)", url: "#services" },
        { id: "tax-4", label: "Income Tax Notice Reply", url: "#services" },
        { id: "tax-5", label: "PAN & TAN Application", url: "#services" },
      ],
    },
    {
      id: "cat-incorporation",
      title: "BUSINESS REGISTRATION",
      icon: "Building2",
      viewAllText: "View all 11 →",
      viewAllUrl: "#services",
      items: [
        { id: "reg-1", label: "Private Limited Company Registration", url: "#services", popular: true },
        { id: "reg-2", label: "LLP Registration", url: "#services", popular: true },
        { id: "reg-3", label: "One Person Company (OPC) Registration", url: "#services" },
        { id: "reg-4", label: "Partnership Firm Registration", url: "#services" },
        { id: "reg-5", label: "Proprietorship Registration", url: "#services" },
      ],
    },
    {
      id: "cat-licenses",
      title: "LICENSES & REGISTRATIONS",
      icon: "Award",
      viewAllText: "View all 16 →",
      viewAllUrl: "#services",
      items: [
        { id: "lic-1", label: "MSME / Udyam Registration", url: "#services", popular: true },
        { id: "lic-2", label: "Startup India Registration (DPIIT)", url: "#services" },
        { id: "lic-3", label: "FSSAI Food License", url: "#services", popular: true },
        { id: "lic-4", label: "Import Export Code (IEC)", url: "#services" },
        { id: "lic-5", label: "PF & ESI Registration", url: "#services" },
      ],
    },
    {
      id: "cat-ip",
      title: "TRADEMARK & IP",
      icon: "Sparkles",
      items: [
        { id: "ip-1", label: "Trademark Registration", url: "#services", popular: true },
        { id: "ip-2", label: "Trademark Objection Reply", url: "#services" },
        { id: "ip-3", label: "Trademark Renewal", url: "#services" },
        { id: "ip-4", label: "Copyright Registration", url: "#services" },
      ],
    },
    {
      id: "cat-roc",
      title: "ROC & MCA COMPLIANCE",
      icon: "FileCheck",
      items: [
        { id: "roc-1", label: "Company Annual Filing (AOC-4 & MGT-7)", url: "#services" },
        { id: "roc-2", label: "DIR-3 KYC Filing", url: "#services" },
        { id: "roc-3", label: "Director Appointment & Resignation", url: "#services" },
        { id: "roc-4", label: "Registered Office Change", url: "#services" },
        { id: "roc-5", label: "Company Strike Off / Closure", url: "#services" },
      ],
    },
    {
      id: "cat-accounting",
      title: "ACCOUNTING & PAYROLL",
      icon: "Users",
      items: [
        { id: "acc-1", label: "Accounting & Bookkeeping", url: "#services", popular: true },
        { id: "acc-2", label: "Payroll Processing", url: "#services" },
        { id: "acc-3", label: "Professional Tax Registration & Return", url: "#services" },
        { id: "acc-4", label: "Virtual CFO Services", url: "#services" },
      ],
    },
    {
      id: "cat-audit",
      title: "AUDIT & CERTIFICATION",
      icon: "ShieldCheck",
      viewAllText: "View all 6 →",
      viewAllUrl: "#services",
      items: [
        { id: "aud-1", label: "Statutory Audit", url: "#services", popular: true },
        { id: "aud-2", label: "Internal Audit", url: "#services" },
        { id: "aud-3", label: "Project Report & CMA Data", url: "#services", popular: true },
        { id: "aud-4", label: "CA Certificates (Net Worth / Turnover)", url: "#services", popular: true },
        { id: "aud-5", label: "Due Diligence", url: "#services" },
      ],
    },
  ],
};

export interface HeaderConfig {
  layout: "standard" | "centered" | "topbar-cta";
  showTopInfoBar: boolean; // show/hide top info bar
  headerCta?: HeaderCta; // header CTA button (label + link, optional)
  showWhatsAppBtn: boolean;
  showClientPortalBtn: boolean;
  sticky: boolean;
  navLinks: HeaderNavItem[]; // up to 8 items, add / remove / reorder / hide
  megaMenu?: MegaMenuConfig; // Services mega dropdown menu
}

export interface FooterQuickLink {
  label: string;
  url: string;
}

export interface FooterQuickLinkGroup {
  title: string;
  links: FooterQuickLink[]; // up to 6 links per group
}

export type SocialPlatform = "linkedin" | "x" | "facebook" | "instagram" | "youtube";

export interface FooterSocialLink {
  platform: SocialPlatform;
  url: string; // https only
}

export interface FooterConfig {
  layout: "simple" | "multi-column" | "minimal";
  copyrightText: string;
  icaiDisclaimer: boolean;
  disclaimerText?: string;
  quickLinkGroups?: FooterQuickLinkGroup[]; // up to 2 groups x 6 links
  socialLinks: FooterSocialLink[];
}

export interface SeoConfig {
  siteTitle: string; // max 60
  metaDescription: string; // max 160
  socialShareImageUrl?: string; // https only, optional
  noIndexInDraft: boolean; // no-index while in draft toggle
  // Legacy / optional backward compatibility fields
  metaTitle?: string;
  ogImageUrl?: string;
  googleAnalyticsId?: string;
}

export interface SectionConfig<TProps = Record<string, unknown>> {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  props: TProps;
}

export interface PageConfig {
  id: string;
  slug: string;
  title: string;
  sections: SectionConfig[];
}

export interface WebsiteConfig {
  firmId: string;
  version: number;
  templateId: TemplateId;
  branding: BrandingConfig;
  theme: ThemeTokens;
  header: HeaderConfig;
  footer: FooterConfig;
  seo: SeoConfig;
  pages: PageConfig[];
  updatedAt: string;
}
