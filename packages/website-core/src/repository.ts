import { WebsiteConfig, PageConfig, SectionConfig, TemplateId, DEFAULT_MEGA_MENU_CONFIG } from "./types";
import { TemplateMetadata } from "./contracts";

export interface WebsiteConfigRepository {
  getDraft(firmId: string): Promise<WebsiteConfig | null>;
  saveDraft(firmId: string, config: WebsiteConfig): Promise<WebsiteConfig>;
  getPublished(firmId: string): Promise<WebsiteConfig | null>;
  publish(firmId: string, config: WebsiteConfig): Promise<WebsiteConfig>;
  listTemplates(): Promise<TemplateMetadata[]>;
  applyTemplate(firmId: string, templateId: TemplateId, templateMeta?: TemplateMetadata): Promise<WebsiteConfig>;
  setTemplatesProvider(provider: () => TemplateMetadata[]): void;
}

export function getDefaultWebsiteConfig(firmId: string, templateId: TemplateId = "apex-corporate"): WebsiteConfig {
  return {
    firmId,
    version: 1,
    templateId,
    branding: {
      firmName: "Ashish Shahu & Co.",
      tagline: "Chartered Accountants & Financial Advisors",
      registrationNumber: "Firm Reg. No. XXXXXX",
      phone: "+91 00000 00000",
      email: "office@example-cafirm.com",
      address: "101, Sample Business Hub, Financial District, Mumbai 400001",
      workingHours: "Mon – Sat: 10:00 AM – 6:30 PM",
      logoUrl: "",
      faviconUrl: "",
    },
    theme: {
      primaryColor: "#0f6e56",
      accentColor: "#1d9e75",
      backgroundColor: "#ffffff",
      surfaceColor: "#f9fafb",
      textColor: "#111827",
      fontFamily: "Space Grotesk",
      headingFontFamily: "Space Grotesk",
      bodyFontFamily: "Space Grotesk",
      borderRadius: "md",
      animationsEnabled: true,
      animationStyle: "fade-up",
      animationSpeed: "normal",
      cardHoverEffect: true,
      scrollAnimations: true,
      glassmorphism: true,
      glowingBadges: true,
      scrollProgressBar: false,
    },
    header: {
      layout: "standard",
      showTopInfoBar: true,
      headerCta: {
        label: "Book Consultation",
        url: "#contact",
        enabled: true,
      },
      showWhatsAppBtn: true,
      showClientPortalBtn: true,
      sticky: true,
      navLinks: [
        { label: "Home", url: "#home", enabled: true },
        { label: "Services", url: "#services", enabled: true },
        { label: "Tax Calendar", url: "#tax-calendar", enabled: true },
        { label: "Calculators", url: "#calculators", enabled: true },
        { label: "About", url: "#about", enabled: true },
        { label: "Contact", url: "#contact", enabled: true },
      ],
      megaMenu: DEFAULT_MEGA_MENU_CONFIG,
    },
    footer: {
      layout: "multi-column",
      copyrightText: "© 2026 Ashish Shahu & Co. Chartered Accountants. All rights reserved.",
      icaiDisclaimer: true,
      disclaimerText: "Standard Professional Disclaimer: In accordance with the Chartered Accountants Act, 1949 and guidelines issued by the regulatory council, this website is designed solely for providing informational facts about the firm and its areas of practice. It does not constitute an advertisement, personal communication, solicitation, or invitation to offer work.",
      quickLinkGroups: [
        {
          title: "Practice Areas",
          links: [
            { label: "Corporate Tax Advisory", url: "#services" },
            { label: "Statutory & Tax Audit", url: "#services" },
            { label: "GST Compliance & Returns", url: "#services" },
            { label: "Startup Incorporation", url: "#services" },
          ],
        },
        {
          title: "Statutory Resources",
          links: [
            { label: "Due Date Calendar", url: "#tax-calendar" },
            { label: "GST & Tax Calculators", url: "#calculators" },
            { label: "Client Consultation", url: "#contact" },
          ],
        },
      ],
      socialLinks: [
        { platform: "linkedin", url: "https://linkedin.com" },
        { platform: "x", url: "https://x.com" },
      ],
    },
    seo: {
      siteTitle: "Ashish Shahu & Co. | Chartered Accountants",
      metaDescription: "Professional Tax, Audit, GST & Company Incorporation Advisory for Modern Enterprises in India.",
      socialShareImageUrl: "",
      noIndexInDraft: true,
      metaTitle: "Ashish Shahu & Co. | Chartered Accountants",
    },
    pages: [
      {
        id: "home-page",
        slug: "home",
        title: "Home",
        sections: [
          {
            id: "sec-hero-1",
            type: "hero",
            enabled: true,
            order: 0,
            props: {
              headline: "Expert Financial, Tax & Compliance Advisory for Modern Enterprises",
              subheadline: "Trusted Chartered Accountancy firm delivering end-to-end GST, Income Tax, Statutory Audit and Business Setup services across India.",
              primaryCtaText: "Book Free Consultation",
              secondaryCtaText: "Explore Services",
            },
          },
          {
            id: "sec-services-1",
            type: "services",
            enabled: true,
            order: 1,
            props: {
              title: "Our Practice Areas",
              subtitle: "Comprehensive compliance and advisory services tailored for startups and businesses.",
            },
          },
          {
            id: "sec-tax-calendar-1",
            type: "tax-calendar",
            enabled: true,
            order: 2,
            props: {
              title: "Upcoming Statutory Due Dates",
              subtitle: "Stay ahead of your GST, TDS and ROC filing deadlines.",
            },
          },
          {
            id: "sec-calculators-1",
            type: "calculators",
            enabled: true,
            order: 3,
            props: {
              title: "Financial & Tax Calculators",
              subtitle: "Calculate GST, Old vs New Tax Regime, and Business EMI instantly.",
            },
          },
          {
            id: "sec-about-1",
            type: "about",
            enabled: true,
            order: 4,
            props: {
              title: "Excellence in Statutory Audit, Tax & Corporate Governance",
              subtitle: "Adhering strictly to ICAI standards of practice and ethical advisory.",
            },
          },
          {
            id: "sec-testimonials-1",
            type: "testimonials",
            enabled: true,
            order: 5,
            props: {
              title: "Client Endorsements",
              subtitle: "Over 500+ Indian businesses trust our advisory team.",
            },
          },
          {
            id: "sec-cta-1",
            type: "cta",
            enabled: true,
            order: 6,
            props: {
              headline: "Ready to streamline your company compliance?",
              buttonText: "Schedule a Discovery Call",
            },
          },
          {
            id: "sec-contact-1",
            type: "contact",
            enabled: true,
            order: 7,
            props: {
              title: "Contact Our Advisory Desk",
              subtitle: "Connect with our certified partners for audit and tax consultation.",
            },
          },
        ],
      },
    ],
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeWebsiteConfig(arg1: any, arg2?: any): WebsiteConfig {
  let rawConfig: any;
  let firmId: string;

  if (typeof arg1 === "string") {
    firmId = arg1;
    rawConfig = arg2 || {};
  } else {
    rawConfig = arg1 || {};
    firmId = typeof arg2 === "string" ? arg2 : (rawConfig?.firmId || "default_firm");
  }

  const templateId = rawConfig?.templateId || "apex-corporate";
  const defaultConfig = getDefaultWebsiteConfig(firmId, templateId);

  if (!rawConfig || typeof rawConfig !== "object") {
    return defaultConfig;
  }

  // Handle multi-page architecture: normalize each page or fallback to default pages
  let normalizedPages: PageConfig[] = [];
  const rawPages = Array.isArray(rawConfig.pages) && rawConfig.pages.length > 0 ? rawConfig.pages : null;

  if (rawPages) {
    normalizedPages = rawPages.map((rawPg: any, pIdx: number) => {
      const isFirstPage = pIdx === 0;
      const defaultPage = isFirstPage ? defaultConfig.pages[0] : null;
      const pageId = rawPg.id || (isFirstPage ? defaultPage?.id || "page-home" : `page-${pIdx}`);
      const pageSlug = isFirstPage ? "home" : (rawPg.slug || `page-${pIdx}`).toLowerCase().replace(/\s+/g, "-");
      const pageTitle = rawPg.title || (isFirstPage ? defaultPage?.title || "Home" : `Page ${pIdx + 1}`);

      let pageSections: SectionConfig[] = [];
      if (Array.isArray(rawPg.sections) && rawPg.sections.length > 0) {
        pageSections = rawPg.sections.map((savedSec: any, sIdx: number) => {
          const defaultSec = defaultPage?.sections.find((ds) => ds.id === savedSec.id || ds.type === savedSec.type);
          return {
            id: savedSec.id || `sec-${savedSec.type || "custom"}-${sIdx}`,
            type: savedSec.type || defaultSec?.type || "hero",
            enabled: typeof savedSec.enabled === "boolean" ? savedSec.enabled : true,
            order: typeof savedSec.order === "number" ? savedSec.order : sIdx,
            props: {
              ...(defaultSec?.props || {}),
              ...(savedSec.props || {}),
            },
          };
        });

        // For first page (home), append any missing default sections as disabled
        if (isFirstPage && defaultPage) {
          let nextOrder = pageSections.length;
          defaultPage.sections.forEach((defaultSec) => {
            const alreadyIncluded = pageSections.some(
              (s: any) => s.id === defaultSec.id || s.type === defaultSec.type
            );
            if (!alreadyIncluded) {
              pageSections.push({
                ...defaultSec,
                enabled: false,
                order: nextOrder++,
              });
            }
          });
        }
      } else if (isFirstPage && defaultPage) {
        pageSections = defaultPage.sections;
      } else {
        // Fallback default sections for subpages
        pageSections = [
          {
            id: `sec-hero-${pageId}`,
            type: "hero",
            enabled: true,
            order: 0,
            props: {
              headline: `${pageTitle} — ${rawConfig.branding?.firmName || defaultConfig.branding.firmName}`,
              subheadline: `Professional advisory and compliance services for ${pageTitle.toLowerCase()}.`,
              primaryCtaText: "Contact Us",
              primaryCtaLink: "#contact",
              secondaryCtaText: "View Services",
              secondaryCtaLink: "#services",
            },
          },
          {
            id: `sec-services-${pageId}`,
            type: "services",
            enabled: true,
            order: 1,
            props: {
              title: `${pageTitle} Scopes & Services`,
              subtitle: "Chartered accountancy, statutory compliance, and corporate management.",
            },
          },
          {
            id: `sec-contact-${pageId}`,
            type: "contact",
            enabled: true,
            order: 2,
            props: {
              title: "Speak with a Senior CA Partner",
              subtitle: "Get immediate statutory advisory for your business.",
              showMapPlaceholder: true,
            },
          },
        ];
      }

      return {
        id: pageId,
        slug: pageSlug,
        title: pageTitle,
        sections: pageSections,
      };
    });
  } else {
    normalizedPages = defaultConfig.pages;
  }

  const rawTheme = rawConfig.theme || {};
  const headingFont = rawTheme.headingFontFamily || rawTheme.fontFamily || defaultConfig.theme.headingFontFamily;
  const bodyFont = rawTheme.bodyFontFamily || rawTheme.fontFamily || defaultConfig.theme.bodyFontFamily;

  const normalized: WebsiteConfig = {
    ...defaultConfig,
    ...rawConfig,
    firmId,
    version: typeof rawConfig.version === "number" ? rawConfig.version : 1,
    templateId,
    branding: {
      ...defaultConfig.branding,
      ...(rawConfig.branding || {}),
    },
    theme: {
      ...defaultConfig.theme,
      ...rawTheme,
      fontFamily: rawTheme.fontFamily || headingFont,
      headingFontFamily: headingFont,
      bodyFontFamily: bodyFont,
    },
    header: {
      ...defaultConfig.header,
      ...(rawConfig.header || {}),
      showTopInfoBar:
        typeof rawConfig.header?.showTopInfoBar === "boolean"
          ? rawConfig.header.showTopInfoBar
          : defaultConfig.header.showTopInfoBar,
      headerCta: {
        label: rawConfig.header?.headerCta?.label || defaultConfig.header.headerCta?.label || "Book Consultation",
        url: rawConfig.header?.headerCta?.url || defaultConfig.header.headerCta?.url || "#contact",
        enabled:
          typeof rawConfig.header?.headerCta?.enabled === "boolean"
            ? rawConfig.header.headerCta.enabled
            : (defaultConfig.header.headerCta?.enabled ?? true),
      },
      navLinks: Array.isArray(rawConfig.header?.navLinks)
        ? rawConfig.header.navLinks.slice(0, 8).map((link: any, idx: number) => ({
            id: link.id || `nav-${idx}`,
            label: String(link.label || `Link ${idx + 1}`).slice(0, 40),
            url: String(link.url || "#"),
            enabled: typeof link.enabled === "boolean" ? link.enabled : true,
          }))
        : defaultConfig.header.navLinks,
    },
    footer: {
      ...defaultConfig.footer,
      ...(rawConfig.footer || {}),
      quickLinkGroups: Array.isArray(rawConfig.footer?.quickLinkGroups)
        ? rawConfig.footer.quickLinkGroups.slice(0, 2).map((grp: any) => ({
            title: String(grp.title || "Links").slice(0, 40),
            links: Array.isArray(grp.links)
              ? grp.links.slice(0, 6).map((lnk: any) => ({
                  label: String(lnk.label || "").slice(0, 40),
                  url: String(lnk.url || "#"),
                }))
              : [],
          }))
        : defaultConfig.footer.quickLinkGroups,
      socialLinks: Array.isArray(rawConfig.footer?.socialLinks)
        ? rawConfig.footer.socialLinks.map((s: any) => {
            const platform = (s.platform || "linkedin").toLowerCase();
            return {
              platform: ["linkedin", "x", "facebook", "instagram", "youtube"].includes(platform)
                ? (platform as any)
                : "linkedin",
              url: String(s.url || ""),
            };
          })
        : defaultConfig.footer.socialLinks,
    },
    seo: {
      ...defaultConfig.seo,
      siteTitle: String(rawConfig.seo?.siteTitle || rawConfig.seo?.metaTitle || defaultConfig.seo.siteTitle).slice(0, 60),
      metaDescription: String(rawConfig.seo?.metaDescription || defaultConfig.seo.metaDescription).slice(0, 160),
      socialShareImageUrl: rawConfig.seo?.socialShareImageUrl || rawConfig.seo?.ogImageUrl || "",
      noIndexInDraft: typeof rawConfig.seo?.noIndexInDraft === "boolean" ? rawConfig.seo.noIndexInDraft : true,
      metaTitle: rawConfig.seo?.metaTitle || rawConfig.seo?.siteTitle || defaultConfig.seo.siteTitle,
      ogImageUrl: rawConfig.seo?.ogImageUrl || rawConfig.seo?.socialShareImageUrl || "",
    },
    pages: normalizedPages,
    updatedAt: rawConfig.updatedAt || new Date().toISOString(),
  };

  return normalized;
}

export class MockWebsiteConfigRepository implements WebsiteConfigRepository {
  private templatesProvider: (() => TemplateMetadata[]) | null = null;

  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  }

  private getDraftKey(firmId: string): string {
    return `activedesk_wb_draft_${firmId}`;
  }

  private getPublishedKey(firmId: string): string {
    return `activedesk_wb_published_${firmId}`;
  }

  setTemplatesProvider(provider: () => TemplateMetadata[]): void {
    this.templatesProvider = provider;
  }

  async getDraft(firmId: string): Promise<WebsiteConfig | null> {
    if (!this.isBrowser()) {
      return getDefaultWebsiteConfig(firmId);
    }
    try {
      const raw = window.localStorage.getItem(this.getDraftKey(firmId));
      if (!raw) {
        const initial = getDefaultWebsiteConfig(firmId);
        window.localStorage.setItem(this.getDraftKey(firmId), JSON.stringify(initial));
        return initial;
      }
      return normalizeWebsiteConfig(JSON.parse(raw), firmId);
    } catch {
      return getDefaultWebsiteConfig(firmId);
    }
  }

  async saveDraft(firmId: string, config: WebsiteConfig): Promise<WebsiteConfig> {
    const updated = normalizeWebsiteConfig(config, firmId);
    if (this.isBrowser()) {
      try {
        window.localStorage.setItem(this.getDraftKey(firmId), JSON.stringify(updated));
      } catch (err) {
        console.warn("Failed to persist draft in localStorage", err);
      }
    }
    return updated;
  }

  async getPublished(firmId: string): Promise<WebsiteConfig | null> {
    if (!this.isBrowser()) {
      return null;
    }
    try {
      const raw = window.localStorage.getItem(this.getPublishedKey(firmId));
      return raw ? normalizeWebsiteConfig(JSON.parse(raw), firmId) : null;
    } catch {
      return null;
    }
  }

  async publish(firmId: string, config: WebsiteConfig): Promise<WebsiteConfig> {
    const published = {
      ...config,
      firmId,
      version: (config.version || 1) + 1,
      updatedAt: new Date().toISOString(),
    };
    if (this.isBrowser()) {
      try {
        window.localStorage.setItem(this.getPublishedKey(firmId), JSON.stringify(published));
        window.localStorage.setItem(this.getDraftKey(firmId), JSON.stringify(published));
      } catch (err) {
        console.warn("Failed to persist published config in localStorage", err);
      }
    }
    return published;
  }

  async listTemplates(): Promise<TemplateMetadata[]> {
    if (this.templatesProvider) {
      return this.templatesProvider();
    }
    return [];
  }

  async applyTemplate(firmId: string, templateId: TemplateId, templateMeta?: TemplateMetadata): Promise<WebsiteConfig> {
    const existingDraft = await this.getDraft(firmId);
    const template = templateMeta || (this.templatesProvider ? this.templatesProvider().find((t) => t.id === templateId) : undefined);

    const baseConfig = existingDraft || getDefaultWebsiteConfig(firmId, templateId);

    // Reconcile sections if template defines a section manifest
    let reconciledPages = baseConfig.pages;
    if (template?.sections && template.sections.length > 0 && reconciledPages && reconciledPages.length > 0) {
      const allowedSectionTypes = new Set(template.sections.map((s) => s.type));
      reconciledPages = reconciledPages.map((page, pIdx) => {
        if (pIdx === 0) {
          const existingSecs = (page.sections || []).filter((s) => allowedSectionTypes.has(s.type));
          const currentTypes = new Set(existingSecs.map((s) => s.type));
          template.sections!.forEach((ts, sIdx) => {
            if (!currentTypes.has(ts.type as any)) {
              existingSecs.push({
                id: `sec-${ts.id}-${Date.now() + sIdx}`,
                type: ts.type as any,
                enabled: ts.defaultEnabled !== false,
                order: existingSecs.length,
                props: (ts.defaultProps as any) || {},
              });
            }
          });
          return {
            ...page,
            sections: existingSecs.map((s, idx) => ({ ...s, order: idx })),
          };
        }
        return page;
      });
    }

    const newConfig: WebsiteConfig = {
      ...baseConfig,
      firmId,
      templateId,
      theme: {
        ...(existingDraft?.theme || getDefaultWebsiteConfig(firmId, templateId).theme),
        ...(template?.defaultTheme || {}),
      },
      pages: reconciledPages,
      updatedAt: new Date().toISOString(),
    };

    await this.saveDraft(firmId, newConfig);
    return newConfig;
  }
}

export const websiteConfigRepo = new MockWebsiteConfigRepository();

// ─── HTTP Repository (real backend) ──────────────────────────────────────────
// Used when NEXT_PUBLIC_API_URL is set. Falls back to the mock repo on network failure.

export class HttpWebsiteConfigRepository implements WebsiteConfigRepository {
  private baseUrl: string;
  private fallback: MockWebsiteConfigRepository;
  private templatesProvider: (() => TemplateMetadata[]) | null = null;

  constructor(baseUrl: string) {
    // Strip trailing slash
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.fallback = new MockWebsiteConfigRepository();
  }

  setTemplatesProvider(provider: () => TemplateMetadata[]): void {
    this.templatesProvider = provider;
    this.fallback.setTemplatesProvider(provider);
  }

  private url(firmId: string, path: string) {
    return `${this.baseUrl}/api/tools/website-config/${encodeURIComponent(firmId)}/${path}`;
  }

  async getDraft(firmId: string): Promise<WebsiteConfig | null> {
    try {
      const res = await fetch(this.url(firmId, "draft"));
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`getDraft: ${res.status}`);
      const json = await res.json();
      return normalizeWebsiteConfig(json.data, firmId);
    } catch {
      // Offline / service down — use localStorage fallback
      return this.fallback.getDraft(firmId);
    }
  }

  async saveDraft(firmId: string, config: WebsiteConfig): Promise<WebsiteConfig> {
    try {
      const res = await fetch(this.url(firmId, "draft"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error(`saveDraft: ${res.status}`);
      const json = await res.json();
      // Also mirror to localStorage for offline resilience
      this.fallback.saveDraft(firmId, json.data);
      return normalizeWebsiteConfig(json.data, firmId);
    } catch {
      return this.fallback.saveDraft(firmId, config);
    }
  }

  async getPublished(firmId: string): Promise<WebsiteConfig | null> {
    try {
      const res = await fetch(this.url(firmId, "published"));
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`getPublished: ${res.status}`);
      const json = await res.json();
      return normalizeWebsiteConfig(json.data, firmId);
    } catch {
      return this.fallback.getPublished(firmId);
    }
  }

  async publish(firmId: string, config: WebsiteConfig): Promise<WebsiteConfig> {
    try {
      const res = await fetch(this.url(firmId, "publish"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error(`publish: ${res.status}`);
      const json = await res.json();
      this.fallback.publish(firmId, json.data);
      return normalizeWebsiteConfig(json.data, firmId);
    } catch {
      return this.fallback.publish(firmId, config);
    }
  }

  async listTemplates(): Promise<TemplateMetadata[]> {
    return this.templatesProvider ? this.templatesProvider() : [];
  }

  async applyTemplate(
    firmId: string,
    templateId: TemplateId,
    templateMeta?: TemplateMetadata
  ): Promise<WebsiteConfig> {
    // applyTemplate always uses the in-memory template registry — no network call needed
    const existingDraft = await this.getDraft(firmId);
    const template =
      templateMeta ||
      (this.templatesProvider
        ? this.templatesProvider().find((t) => t.id === templateId)
        : undefined);

    const baseConfig = existingDraft || getDefaultWebsiteConfig(firmId, templateId);
    
    // Reconcile sections if template defines a section manifest
    let reconciledPages = baseConfig.pages;
    if (template?.sections && template.sections.length > 0 && reconciledPages && reconciledPages.length > 0) {
      const allowedSectionTypes = new Set(template.sections.map((s) => s.type));
      reconciledPages = reconciledPages.map((page, pIdx) => {
        if (pIdx === 0) {
          // Home / Primary Landing page: filter out sections not supported by template and ensure template sections exist
          const existingSecs = (page.sections || []).filter((s) => allowedSectionTypes.has(s.type));
          // If any declared template section was missing, add it
          const currentTypes = new Set(existingSecs.map((s) => s.type));
          template.sections!.forEach((ts, sIdx) => {
            if (!currentTypes.has(ts.type as any)) {
              existingSecs.push({
                id: `sec-${ts.id}-${Date.now() + sIdx}`,
                type: ts.type as any,
                enabled: ts.defaultEnabled !== false,
                order: existingSecs.length,
                props: (ts.defaultProps as any) || {},
              });
            }
          });
          return {
            ...page,
            sections: existingSecs.map((s, idx) => ({ ...s, order: idx })),
          };
        }
        return page;
      });
    }

    const newConfig: WebsiteConfig = {
      ...baseConfig,
      firmId,
      templateId,
      theme: {
        ...(existingDraft?.theme || getDefaultWebsiteConfig(firmId, templateId).theme),
        ...(template?.defaultTheme || {}),
      },
      pages: reconciledPages,
      updatedAt: new Date().toISOString(),
    };

    return this.saveDraft(firmId, newConfig);
  }
}

/**
 * Returns the appropriate repository implementation:
 * - HttpWebsiteConfigRepository when NEXT_PUBLIC_API_URL is set
 * - MockWebsiteConfigRepository (localStorage) otherwise
 *
 * This is the preferred factory over using `websiteConfigRepo` directly.
 */
export function createWebsiteConfigRepo(apiUrl?: string): WebsiteConfigRepository {
  const nodeProcess = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process;
  const url = apiUrl ?? nodeProcess?.env?.NEXT_PUBLIC_API_URL;
  if (url) {
    return new HttpWebsiteConfigRepository(url);
  }
  return new MockWebsiteConfigRepository();
}

