import React, { useState } from "react";
import "./fortax.css";
import {
  WebsiteConfig,
  SectionConfig,
  sanitizeLink,
  getLinkAttributes,
  DEFAULT_MEGA_MENU_CONFIG,
} from "website-core";
import {
  Check,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sparkles,
  HelpCircle,
  FileText,
  DollarSign,
  PieChart,
  Briefcase,
  Layers,
  ShieldCheck,
  X,
  ExternalLink,
} from "lucide-react";
import {
  SHARED_SERVICES,
  SHARED_TAX_DATES,
  SHARED_CLIENT_REVIEWS,
  SHARED_FIRM_CONTACT,
  SharedServiceItem,
} from "../../fixtures/sharedData";
import { SocialIcon } from "../../components/SocialIcon";
import { TemplateServicesDropdown } from "../../components/TemplateServicesDropdown";
import { TemplateConsultationForm } from "../../components/TemplateConsultationForm";
import { PracticeGallerySection } from "../../components/PracticeGallerySection";

export interface FortaxTemplateProps {
  config: WebsiteConfig;
}

// 5 Specific Service Cards matching the screenshot
interface FortaxServiceCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  tags: string[];
  description: string;
  professionalFee: string;
  turnaround: string;
}

const FORTAX_SERVICES: FortaxServiceCard[] = [
  {
    id: "ft-tax-planning",
    title: "Comprehensive Tax Planning",
    icon: <PieChart size={24} />,
    tags: ["Tax Plan", "ITR", "Direct Tax Laws", "GST Audit", "AIS Reconciliations", "Advance Tax", "File Assessment"],
    description: "Holistic direct and indirect tax planning structure designed to optimize legitimate deductions, eliminate statutory penalties, and align with new fiscal regime codes.",
    professionalFee: "Rs. 2,999 onwards",
    turnaround: "3 to 5 business days",
  },
  {
    id: "ft-tax-prep",
    title: "Tax Preparation Services",
    icon: <FileText size={24} />,
    tags: ["Tax Filing", "Statutory Audits", "AIS Analysis", "Form 26AS", "Notice Reply", "Pre-Audit Check", "Department Assist"],
    description: "End-to-end documentation preparation, computation of total taxable income, electronic verification, and immediate acknowledgement delivery with CA signoff.",
    professionalFee: "Rs. 1,499 onwards",
    turnaround: "24 to 48 hours",
  },
  {
    id: "ft-equity-planning",
    title: "Tax-or-Equity Tax Planning Session",
    icon: <DollarSign size={24} />,
    tags: ["Employee Stock", "F&O", "Capital Gain", "Crypto Assets", "Gift Instruments", "NRI Remittance", "Real Estate Tax"],
    description: "Specialized advisory sessions for equity portfolio managers, angel investors, ESOP holders, and crypto traders seeking legitimate tax deferral structures.",
    professionalFee: "Rs. 4,999 / session",
    turnaround: "Scheduled within 24h",
  },
  {
    id: "ft-business-tax",
    title: "Business Class Services",
    icon: <Briefcase size={24} />,
    tags: ["Pvt Ltd", "ROC Compliance", "Corporate Tax", "Payroll & TDS", "GST Advisory", "Bookkeeping"],
    description: "Retainer-based corporate governance covering periodic GST returns, quarterly TDS reconciliations, statutory MCA filings, and balance sheet finalization.",
    professionalFee: "Rs. 3,999 / month",
    turnaround: "Continuous Retainer",
  },
  {
    id: "ft-wealth-management",
    title: "Holistic Wealth Management",
    icon: <ShieldCheck size={24} />,
    tags: ["Family Trust", "Estate Planning", "Succession Law", "Cross Border", "Asset Protection", "Offshore Structuring"],
    description: "Private client advisory on family trust formulation, estate succession, HUF partitioning, and generational wealth preservation under Indian trust jurisprudence.",
    professionalFee: "Custom Engagement",
    turnaround: "Personalized Roadmap",
  },
];

const PRICING_TIERS = [
  {
    id: "tier-basic",
    name: "Basic Tax",
    price: "$500",
    period: "/ Year",
    isPopular: false,
    featuresTitle: "What you get :",
    features: [
      "Online corporate tax consultation",
      "Annual statutory bookkeeping check",
      "Personal tax strategy blueprint",
      "Bi-annual compliance status reports",
      "Dedicated senior accountant desk",
    ],
  },
  {
    id: "tier-medium",
    name: "Medium Tax",
    price: "$1500",
    period: "/ Year",
    isPopular: true,
    featuresTitle: "What you get :",
    features: [
      "Everything in Basic Tax tier",
      "Quarterly direct tax reviews & forecasts",
      "Full MCA statutory & ROC filing desk",
      "Unlimited advisory phone consultation",
      "Priority notice representation desk",
    ],
  },
  {
    id: "tier-elite",
    name: "Elite Tax",
    price: "$2100",
    period: "/ Year",
    isPopular: false,
    featuresTitle: "What you get :",
    features: [
      "Everything in Medium Tax tier",
      "Virtual CFO & strategic boardroom advisory",
      "Cross-border transfer pricing audit",
      "Zero-wait concierge CA partner channel",
      "Full family estate & asset protection",
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: "Why shall I hire a financial advisor?",
    a: "A qualified chartered accountant and financial advisor ensures complete regulatory compliance, minimizes statutory tax liabilities legitimately, navigates dynamic departmental tax codes, and protects your business from costly audit queries.",
  },
  {
    q: "What services do financial advisors provide?",
    a: "Our practice encompasses direct & indirect tax filings, statutory audits, company incorporation, transfer pricing, wealth preservation trusts, virtual CFO advisory, and departmental assessment representation.",
  },
  {
    q: "How much do financial advisors charge?",
    a: "We believe in transparent, fixed-fee schedules with zero hidden charges. Our engagements range from straightforward ITR filings to customized corporate retainer packages tailored to enterprise turnover.",
  },
  {
    q: "How often should I meet with my advisor?",
    a: "We recommend quarterly strategy review checkpoints for active businesses to monitor advance tax obligations, input tax credit balances, and statutory due dates well before deadlines.",
  },
];

export function FortaxTemplate({ config }: FortaxTemplateProps) {
  const page = config.pages?.[0];
  const [selectedService, setSelectedService] = useState<string>("Comprehensive Tax Planning");
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [formHighlight, setFormHighlight] = useState(false);

  const firmName = config.branding?.firmName || "FORTAX";
  const activeNavLinks = (config.header?.navLinks || []).filter((l) => l.enabled);
  const quickLinkGroups = (config.footer?.quickLinkGroups || []).filter((g) => g.title && g.links?.length > 0);
  const socialLinks = config.footer?.socialLinks || [];

  const handleSelectService = (service: string) => {
    setSelectedService(service);
    setIsServicesOpen(false);
    const formEl = document.getElementById("contact");
    if (formEl && typeof formEl.scrollIntoView === "function") {
      formEl.scrollIntoView({ behavior: "smooth" });
    }
    setFormHighlight(true);
    setTimeout(() => setFormHighlight(false), 2000);
  };

  return (
    <div className="fortax-root">
      {/* ── Sticky Modern Header ── */}
      <header className="ft-header">
        <div className="ft-header-inner">
          <a href="#home" className="ft-brand">
            {config.branding?.logoUrl ? (
              <img
                src={config.branding.logoUrl}
                alt={firmName}
                style={{ height: 38, objectFit: "contain" }}
              />
            ) : (
              <span className="ft-brand-logo-text">
                {firmName}
                <span className="ft-brand-logo-dot">•</span>
              </span>
            )}
          </a>

          <nav>
            {activeNavLinks.length > 0 ? (
              <ul className="ft-nav-list">
                {activeNavLinks.map((link, idx) => {
                  const safeUrl = sanitizeLink(link.url, "#");
                  const attrs = getLinkAttributes(safeUrl);
                  const isServices = link.label.toLowerCase().includes("service");

                  if (isServices) {
                    return (
                      <li
                        key={idx}
                        className="accountax-nav-services-wrapper"
                        style={{ position: "relative" }}
                        onMouseEnter={() => setIsServicesOpen(true)}
                        onMouseLeave={() => setIsServicesOpen(false)}
                      >
                        <a
                          href={safeUrl}
                          {...attrs}
                          className="ft-nav-link"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsServicesOpen((prev) => !prev);
                          }}
                          style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                        >
                          {link.label}
                          <ChevronDown size={13} />
                        </a>
                        <TemplateServicesDropdown
                          isOpen={isServicesOpen}
                          onClose={() => setIsServicesOpen(false)}
                          onSelectService={handleSelectService}
                          variant="accountax"
                          megaMenu={config.header.megaMenu}
                          onMouseEnter={() => setIsServicesOpen(true)}
                          onMouseLeave={() => setIsServicesOpen(false)}
                        />
                      </li>
                    );
                  }

                  return (
                    <li key={idx}>
                      <a href={safeUrl} {...attrs} className="ft-nav-link">
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="ft-nav-list">
                <li><a href="#home" className="ft-nav-link">Home</a></li>
                <li
                  className="accountax-nav-services-wrapper"
                  style={{ position: "relative" }}
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <a
                    href="#services"
                    className="ft-nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsServicesOpen((prev) => !prev);
                    }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                  >
                    Services <ChevronDown size={13} />
                  </a>
                  <TemplateServicesDropdown
                    isOpen={isServicesOpen}
                    onClose={() => setIsServicesOpen(false)}
                    onSelectService={handleSelectService}
                    variant="accountax"
                    megaMenu={config.header.megaMenu}
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  />
                </li>
                <li><a href="#tax-calendar" className="ft-nav-link">Tax Calendar</a></li>
                <li><a href="#about" className="ft-nav-link">About</a></li>
                <li><a href="#pricing" className="ft-nav-link">Pricing</a></li>
                <li><a href="#faqs" className="ft-nav-link">FAQs</a></li>
                <li><a href="#contact" className="ft-nav-link">Contact</a></li>
              </ul>
            )}
          </nav>

          {config.header?.headerCta?.enabled !== false && (
            <button
              onClick={() => {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="ft-header-btn"
            >
              {config.header?.headerCta?.label || "GET STARTED"}
            </button>
          )}
        </div>
      </header>

      {/* ── Dynamic Section Rendering by order & enabled status ── */}
      <main style={{ flex: 1 }}>
        {page?.sections
          ?.filter((s) => s.enabled)
          .sort((a, b) => a.order - b.order)
          .map((sec) => (
            <FortaxSectionRouter
              key={sec.id}
              sec={sec}
              config={config}
              selectedService={selectedService}
              onSelectService={handleSelectService}
              formHighlight={formHighlight}
            />
          ))}
      </main>

      {/* ── Comprehensive Dark Footer (Fortax Style) ── */}
      <footer className="ft-footer">
        <div className="ft-footer-inner">
          {/* Brand Col */}
          <div className="ft-footer-brand-col">
            <div className="ft-footer-logo-text">{firmName}</div>
            <p className="ft-footer-desc">
              Dedicated Chartered Accountancy and financial consulting practice offering direct tax planning, corporate statutory filings, and private wealth structuring.
            </p>
            {socialLinks.length > 0 && (
              <div className="ft-footer-socials">
                {socialLinks.map((s, sIdx) => {
                  const safeUrl = sanitizeLink(s.url, "#");
                  return (
                    <a
                      key={sIdx}
                      href={safeUrl}
                      {...getLinkAttributes(safeUrl)}
                      className="ft-footer-social-btn"
                    >
                      <SocialIcon platform={s.platform} size={13} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Link Groups */}
          {quickLinkGroups.length > 0 ? (
            quickLinkGroups.map((grp, gIdx) => (
              <div key={gIdx}>
                <h4 className="ft-footer-col-title">{grp.title}</h4>
                <ul className="ft-footer-links-list">
                  {grp.links
                    .filter((lnk) => lnk.label && lnk.url)
                    .map((lnk, lIdx) => {
                      const safeUrl = sanitizeLink(lnk.url, "#");
                      return (
                        <li key={lIdx}>
                          <a href={safeUrl} {...getLinkAttributes(safeUrl)} className="ft-footer-link">
                            {lnk.label}
                          </a>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))
          ) : (
            <>
              {/* Fallback Services Col */}
              <div>
                <h4 className="ft-footer-col-title">Services</h4>
                <ul className="ft-footer-links-list">
                  <li><a href="#services" className="ft-footer-link">Tax Planning</a></li>
                  <li><a href="#services" className="ft-footer-link">Free Consultation</a></li>
                  <li><a href="#services" className="ft-footer-link">Tax Return</a></li>
                  <li><a href="#services" className="ft-footer-link">Retirement Plans</a></li>
                  <li><a href="#services" className="ft-footer-link">Wealth Management</a></li>
                </ul>
              </div>

              {/* Fallback Quick Links Col */}
              <div>
                <h4 className="ft-footer-col-title">Quick Links</h4>
                <ul className="ft-footer-links-list">
                  <li><a href="#about" className="ft-footer-link">About Firm</a></li>
                  <li><a href="#pricing" className="ft-footer-link">Pricing Plans</a></li>
                  <li><a href="#faqs" className="ft-footer-link">FAQs</a></li>
                  <li><a href="#services" className="ft-footer-link">Practice Areas</a></li>
                  <li><a href="#contact" className="ft-footer-link">Contact Us</a></li>
                </ul>
              </div>
            </>
          )}

          {/* Contact Col */}
          <div>
            <h4 className="ft-footer-col-title">Contact</h4>
            <div className="ft-footer-contact-item">
              <MapPin size={16} className="ft-footer-contact-icon" />
              <span>{config.branding?.address || "101, Business Hub, Financial Center, Mumbai"}</span>
            </div>
            <div className="ft-footer-contact-item">
              <Phone size={16} className="ft-footer-contact-icon" />
              <span>{config.branding?.phone || "+91 (022) 2890-4500"}</span>
            </div>
            <div className="ft-footer-contact-item">
              <Mail size={16} className="ft-footer-contact-icon" />
              <span>{config.branding?.email || "advisory@fortax-india.com"}</span>
            </div>
          </div>
        </div>

        {/* ICAI Disclaimer */}
        {config.footer?.icaiDisclaimer && (
          <div className="ft-icai-notice-box">
            {config.footer.disclaimerText ||
              "Standard Professional Disclaimer: In accordance with the Chartered Accountants Act, 1949 and guidelines issued by the regulatory council, this website is designed solely for providing informational facts about the firm and its areas of practice. It does not constitute an advertisement, personal communication, solicitation, or invitation to offer work."}
          </div>
        )}

        <div className="ft-footer-bottom">
          <span>{config.footer?.copyrightText || `© ${new Date().getFullYear()} ${firmName}. All rights reserved.`}</span>
          <span>Chartered Accountancy & Tax Governance Platform</span>
        </div>
      </footer>
    </div>
  );
}

function FortaxSectionRouter({
  sec,
  config,
  selectedService,
  onSelectService,
  formHighlight,
}: {
  sec: SectionConfig;
  config: WebsiteConfig;
  selectedService: string;
  onSelectService: (serviceName: string) => void;
  formHighlight: boolean;
}) {
  switch (sec.type) {
    case "hero":
      return <FortaxHeroSection props={sec.props} config={config} onSelectService={onSelectService} />;
    case "services":
      return <FortaxServicesSection props={sec.props} config={config} onSelectService={onSelectService} />;
    case "tax-calendar":
      return <FortaxTaxCalendarSection props={sec.props} config={config} />;
    case "testimonials":
      return <FortaxTestimonialsSection props={sec.props} config={config} />;
    case "cta":
      return <FortaxCtaSection props={sec.props} config={config} onSelectService={onSelectService} />;
    case "contact":
      return (
        <FortaxContactSection
          props={sec.props}
          config={config}
          selectedService={selectedService}
          onSelectService={onSelectService}
          formHighlight={formHighlight}
        />
      );
    case "calculators":
      return <FortaxCalculatorsSection props={sec.props} config={config} />;
    default:
      return null;
  }
}

function FortaxCalculatorsSection({ props, config }: { props: any; config: WebsiteConfig }) {
  return (
    <section id="calculators" style={{ padding: "85px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div className="ft-section-header">
          <span className="ft-section-pill">FINANCIAL ESTIMATORS</span>
          <h2 className="ft-section-title">
            {props.title || "Statutory & Tax Estimation Tools"}
          </h2>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: "4px 0 0" }}>
            {props.subtitle || "Quickly estimate tax regime comparisons, GST liability offsets, and advance tax schedules."}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {[
            {
              title: "Old vs New Tax Regime Comparator",
              desc: "Compare personal income tax slabs under Section 115BAC versus standard Chapter VI-A deductions.",
              badge: "Income Tax",
            },
            {
              title: "GST Input Tax Credit & Net Liability",
              desc: "Calculate eligible CGST, SGST, and IGST credits under Rule 37A to forecast net cash outflows.",
              badge: "GST Compliance",
            },
            {
              title: "Advance Tax Quarterly Installments",
              desc: "Determine 15%, 45%, 75%, and 100% tax due installments to avoid Section 234B/C interest charges.",
              badge: "Direct Tax",
            },
          ].map((calc, cIdx) => (
            <div
              key={cIdx}
              style={{
                background: "#ffffff",
                padding: "28px 24px",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div>
                <div style={{ display: "inline-block", background: "#e2f0f4", color: "#025a70", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, marginBottom: 12 }}>
                  {calc.badge}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px", color: "#0e2938", fontFamily: "Playfair Display, Georgia, serif" }}>
                  {calc.title}
                </h3>
                <p style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                  {calc.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="ft-service-btn"
                style={{ width: "100%", justifyContent: "center", textAlign: "center" }}
              >
                REQUEST COMPUTATION DESK
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FortaxHeroSection({
  props,
  config,
  onSelectService,
}: {
  props: any;
  config: WebsiteConfig;
  onSelectService: (serviceName: string) => void;
}) {
  const heroImageUrl = props.heroImageUrl || props.imageUrl;

  return (
    <section
      id="home"
      className="ft-hero"
      style={
        heroImageUrl
          ? {
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.92)), url("${heroImageUrl}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              color: "#ffffff",
            }
          : {}
      }
    >
      <div className="ft-hero-inner" style={{ justifyContent: "center", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
        <div className="ft-hero-content" style={{ maxWidth: 840, alignItems: "center" }}>
          <div className="ft-hero-badge" style={{ margin: "0 auto" }}>
            <Sparkles size={12} />
            <span>{config.branding?.tagline || "Chartered Accountants & Financial Advisory"}</span>
          </div>

          <h1 className="ft-hero-title" style={{ color: "#ffffff", textAlign: "center" }}>
            {props.headline || "How Can a Financial Advisor Help You?"}
          </h1>

          <p className="ft-hero-subtitle" style={{ color: "rgba(255,255,255,0.85)", textAlign: "center", maxWidth: 700, margin: "0 auto 28px" }}>
            {props.subheadline ||
              "Tailored chartered accountancy, corporate tax governance, and investment planning delivered by experienced advisors."}
          </p>

          <div className="ft-hero-actions" style={{ justifyContent: "center" }}>
            <button
              onClick={() => {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="ft-btn-primary"
            >
              {props.primaryCtaText || "Book An Advisor"}
              <ArrowRight size={15} />
            </button>
            <a
              href={sanitizeLink(props.secondaryCtaLink || "#services")}
              {...getLinkAttributes(props.secondaryCtaLink || "#services")}
              className="ft-btn-secondary"
            >
              {props.secondaryCtaText || "Explore Services"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FortaxServicesSection({
  props,
  config,
  onSelectService,
}: {
  props: any;
  config: WebsiteConfig;
  onSelectService: (serviceName: string) => void;
}) {
  const visibleIds = Array.isArray(props.visibleServiceIds) ? props.visibleServiceIds : null;
  const filteredSharedServices = visibleIds !== null && visibleIds.length > 0
    ? SHARED_SERVICES.filter((s) => visibleIds.includes(s.id))
    : visibleIds !== null && visibleIds.length === 0
    ? []
    : null;

  return (
    <section id="services" className="ft-services-section">
      <div className="ft-services-inner">
        <div className="ft-section-header">
          <span className="ft-section-pill">FINANCIAL PRACTICE</span>
          <h2 className="ft-section-title">
            {props.title || (
              <>
                How Can a Financial{" "}
                <span className="ft-section-title-underline">Advisor Help You?</span>
              </>
            )}
          </h2>
        </div>

        {/* Render filtered services if user customized visibleServiceIds */}
        {filteredSharedServices !== null ? (
          <div className="ft-services-grid">
            {filteredSharedServices.map((item) => (
              <div key={item.id} className="ft-service-card">
                <div className="ft-service-icon-box"><ShieldCheck size={24} /></div>
                <h3 className="ft-service-name">{item.title}</h3>
                <div className="ft-service-tags-wrap">
                  {item.scopeList.map((tag, tIdx) => (
                    <span key={tIdx} className="ft-service-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => onSelectService(item.title)}
                  className="ft-service-btn"
                >
                  GET STARTED
                </button>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Row 1: 3 Cards */}
            <div className="ft-services-grid">
              {FORTAX_SERVICES.slice(0, 3).map((item) => (
                <div key={item.id} className="ft-service-card">
                  <div className="ft-service-icon-box">{item.icon}</div>
                  <h3 className="ft-service-name">{item.title}</h3>
                  <div className="ft-service-tags-wrap">
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="ft-service-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onSelectService(item.title)}
                    className="ft-service-btn"
                  >
                    GET STARTED
                  </button>
                </div>
              ))}
            </div>

            {/* Row 2: 2 Cards Centered */}
            <div className="ft-services-grid-row-2">
              {FORTAX_SERVICES.slice(3, 5).map((item) => (
                <div key={item.id} className="ft-service-card">
                  <div className="ft-service-icon-box">{item.icon}</div>
                  <h3 className="ft-service-name">{item.title}</h3>
                  <div className="ft-service-tags-wrap">
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="ft-service-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onSelectService(item.title)}
                    className="ft-service-btn"
                  >
                    GET STARTED
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Specialized Advisory Desks Photo Gallery ── */}
      <PracticeGallerySection
        tiles={props.galleryTiles}
        title={props.galleryTitle || "Specialized Advisory Desks"}
        tagline={props.galleryTagline || "FULL PRACTICE SPECTRUM"}
        subtitle={props.gallerySubtitle || "Built for modern startups, established enterprises, and global investors entering India."}
        variant="apex"
        onSelectService={onSelectService}
      />
    </section>
  );
}

function FortaxTaxCalendarSection({ props, config }: { props: any; config: WebsiteConfig }) {
  return (
    <section id="tax-calendar" style={{ padding: "80px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div className="ft-section-header">
          <span className="ft-section-pill">COMPLIANCE TIMELINE</span>
          <h2 className="ft-section-title">
            {props.title || "Statutory Due Dates & Compliance Monitor"}
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {SHARED_TAX_DATES.map((d, dIdx) => (
            <div
              key={`${d.title}-${dIdx}`}
              style={{
                background: "#ffffff",
                padding: 20,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#025a70", background: "#e2f0f4", padding: "3px 8px", borderRadius: 4 }}>
                  {d.authority} · {d.category}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#e69526" }}>{d.date}</span>
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "#0e2938" }}>{d.title}</h4>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Form: {d.form}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FortaxTestimonialsSection({ props, config }: { props: any; config: WebsiteConfig }) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const advisorCircleUrl =
    (props.advisorImageUrl as string) ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

  const faqAdvisorUrl =
    (props.faqAdvisorImageUrl as string) ||
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80";

  return (
    <>
      {/* ── Getting Started is Easy (Split 4-step with circular badge) ── */}
      <section id="about" className="ft-easy-section">
        <div className="ft-easy-inner">
          <div className="ft-easy-left">
            <h2 className="ft-easy-title">{props.title || "Getting started is easy"}</h2>
            <p className="ft-easy-intro">
              {props.subtitle || "Experience seamless tax filing and statutory corporate management with our structured 4-stage advisory workflow."}
            </p>

            <div className="ft-easy-steps-list">
              {[
                {
                  title: `Switch to ${config.branding?.firmName || "Fortax"} in minutes`,
                  desc: "Quickly onboard with your PAN and basic business registration details.",
                },
                {
                  title: "Meet your dedicated tax expert",
                  desc: "Partner with a certified CA specialized in your specific sector.",
                },
                {
                  title: "Connect with your expert from anywhere",
                  desc: "Secure document uploads, virtual consultations, and real-time status tracking.",
                },
                {
                  title: "Backed by our Full Service Guarantee",
                  desc: "100% accuracy, statutory protection, and proactive audit advisory.",
                },
              ].map((step, sIdx) => (
                <div key={sIdx} className="ft-step-item">
                  <div className="ft-step-icon-btn">
                    <Check size={14} />
                  </div>
                  <div className="ft-step-content">
                    <h4 className="ft-step-heading">{step.title}</h4>
                    <p className="ft-step-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ft-easy-right">
            <div className="ft-advisor-circle-container">
              <img
                src={advisorCircleUrl}
                alt="Expert Advisor"
                className="ft-advisor-circle-img"
              />
              <div className="ft-advisor-stamp-badge">
                <span className="ft-advisor-stamp-text-small">24H</span>
                <span className="ft-advisor-stamp-text-large">SERVICE</span>
                <span className="ft-advisor-stamp-text-small">GUARANTEE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Choose the Option That Best Fits Your Needs (Pricing 3-Tier Matrix) ── */}
      <section id="pricing" className="ft-pricing-section">
        <div className="ft-pricing-inner">
          <div className="ft-section-header">
            <span className="ft-section-pill">TRANSPARENT PLANS</span>
            <h2 className="ft-section-title">
              Choose the option that best fits your needs
            </h2>
          </div>

          <div className="ft-pricing-grid">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`ft-pricing-card ${tier.isPopular ? "featured" : ""}`}
              >
                {tier.isPopular && (
                  <div className="ft-pricing-badge-popular">MOST POPULAR</div>
                )}
                <h3 className="ft-pricing-plan-name">{tier.name}</h3>
                <span className="ft-pricing-starting-text">starting at</span>
                <div className="ft-pricing-amount">
                  <span>{tier.price}</span>
                  <span className="ft-pricing-period">{tier.period}</span>
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="ft-pricing-btn"
                >
                  GET STARTED
                </button>

                <div className="ft-pricing-features-title">{tier.featuresTitle}</div>
                <ul className="ft-pricing-features-list">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="ft-pricing-feature-item">
                      <Check size={14} style={{ color: "#025a70", flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Your Questions, Answered (FAQ Accordion with Male Advisor) ── */}
      <section id="faqs" className="ft-faq-section">
        <div className="ft-faq-inner">
          <div className="ft-faq-left">
            <span className="ft-faq-pill">FAQ DESK</span>
            <h2 className="ft-faq-title">
              Your questions, <br />
              <span className="ft-section-title-underline">answered</span>
            </h2>

            <div className="ft-faq-photo-wrapper">
              <img
                src={faqAdvisorUrl}
                alt="Advisory Desk"
                className="ft-faq-photo-img"
              />
            </div>
          </div>

          <div className="ft-faq-right">
            {FAQ_ITEMS.map((faq, fIdx) => {
              const isOpen = openFaqIndex === fIdx;
              return (
                <div key={fIdx} className="ft-accordion-item">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                    className="ft-accordion-trigger"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && <div className="ft-accordion-body">{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function FortaxCtaSection({
  props,
  config,
  onSelectService,
}: {
  props: any;
  config: WebsiteConfig;
  onSelectService: (serviceName: string) => void;
}) {
  const conciergeTeamUrl =
    (props.teamImageUrl as string) ||
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80";

  return (
    <section className="ft-concierge-section">
      <div className="ft-concierge-inner">
        <div className="ft-concierge-content">
          <h2 className="ft-concierge-heading">
            {props.headline || "Not sure what you need? Chat with a concierge about your situation."}
          </h2>
          <p style={{ margin: 0, fontSize: 13.5, color: "#d1e3ea", lineHeight: 1.6 }}>
            {props.subheadline || "Direct access to our senior Chartered Accountants for statutory registrations, tax appeals, and enterprise structuring."}
          </p>

          <button
            onClick={() => {
              const el = document.getElementById("contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="ft-concierge-btn"
          >
            {props.buttonText || "CHAT WITH US"}
          </button>
        </div>

        <div className="ft-concierge-img-wrap">
          <img
            src={conciergeTeamUrl}
            alt="Consulting Team"
            className="ft-concierge-photo"
          />
        </div>
      </div>
    </section>
  );
}

function FortaxContactSection({
  props,
  config,
  selectedService,
  onSelectService,
  formHighlight,
}: {
  props: any;
  config: WebsiteConfig;
  selectedService: string;
  onSelectService: (serviceName: string) => void;
  formHighlight: boolean;
}) {
  return (
    <section id="contact" style={{ padding: "80px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div className="ft-section-header">
          <span className="ft-section-pill">CONTACT & CONSULTATION</span>
          <h2 className="ft-section-title">
            {props.title || "Schedule Professional Advisory"}
          </h2>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: "4px 0 0" }}>
            {props.subtitle || "Direct communication channel with practicing Chartered Accountants."}
          </p>
        </div>

        <div style={{ maxWidth: 680, margin: "0 auto", background: "#ffffff", padding: 28, borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
          <TemplateConsultationForm
            selectedService={selectedService}
            onServiceChange={onSelectService}
            variant="corporate"
            megaMenu={config.header.megaMenu}
            sourceTemplate="Fortax Template"
            isHighlighted={formHighlight}
          />
        </div>
      </div>
    </section>
  );
}
