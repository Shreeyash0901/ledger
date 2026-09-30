import React, { useState, useRef } from "react";
import "./accountax.css";
import {
  WebsiteConfig,
  SectionConfig,
  sanitizeLink,
  getLinkAttributes,
  DEFAULT_MEGA_MENU_CONFIG,
  MegaMenuConfig,
} from "website-core";
import {
  Check,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Search,
  ArrowRight,
  Star,
  ChevronDown,
  ShieldCheck,
  Building2,
  Award,
  Users,
  TrendingUp,
  Calendar,
  Briefcase,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Layers,
  FileCheck,
  Building,
  Scale,
  Headphones,
  Calculator,
  PieChart,
  Shield,
  FileText,
  DollarSign,
  UserCheck,
  MapPin,
  ChevronRight,
} from "lucide-react";
import {
  SHARED_SERVICES,
  SHARED_TAX_DATES,
  SHARED_CLIENT_REVIEWS,
  SHARED_FIRM_CONTACT,
  SharedServiceItem,
  DEFAULT_PRACTICE_GALLERY_TILES,
  PracticeGalleryTile,
} from "../../fixtures/sharedData";
import { SocialIcon } from "../../components/SocialIcon";
import { TemplateServicesDropdown } from "../../components/TemplateServicesDropdown";
import { PracticeGallerySection } from "../../components/PracticeGallerySection";

export interface AccountaxTemplateProps {
  config: WebsiteConfig;
}

// ─── SERVICE META & DETAILS CATALOG (Same comprehensive data as Easy Filings) ───────────

interface ServiceDetail {
  id: string;
  serviceTitle: string;
  tagline: string;
  badge: string;
  description: string;
  bulletPoints: string[];
  professionalFee: string;
  governmentFee: string;
  completedIn: string;
  estimatedValue: number;
  formTitle: string;
}

const SERVICE_DETAILS_CATALOG: Record<string, ServiceDetail> = {
  "Company Incorporation": {
    id: "company-incorporation",
    serviceTitle: "Company Incorporation",
    tagline: "Private Limited, LLP & OPC Setup in 7-10 Working Days",
    badge: "Fast Track 7-10 Days",
    description:
      "End-to-end statutory company registration with SPICe+ Part A & B filings, name approval, DIN, digital signatures, PAN, TAN, and EPFO/ESIC registrations.",
    bulletPoints: [
      "Name reservation via RUN / SPICe+ Part A",
      "Drafting MoA & AoA under Companies Act 2013",
      "DIN, DSC, PAN & TAN statutory allotment",
      "Zero hidden charges with fixed fee transparency",
    ],
    professionalFee: "Rs. 4,999 - 7,999",
    governmentFee: "As per Authorized Capital",
    completedIn: "7 to 10 working days",
    estimatedValue: 4999,
    formTitle: "Get Started with Company Incorporation",
  },
  "GST Registration": {
    id: "gst-registration",
    serviceTitle: "GST Registration",
    tagline: "Official 15-Digit GSTIN with Complete Verification",
    badge: "Filed in 3-7 Days",
    description:
      "Obtain your official 15-digit GST identification number smoothly with zero errors, full document verification, and ARN tracking.",
    bulletPoints: [
      "Guaranteed ARN generation within 24h",
      "Aadhaar OTP or biometric verification support",
      "HSN / SAC code mapping included",
      "No risk of rejection from officer queries",
    ],
    professionalFee: "Rs. 999 - 1,499",
    governmentFee: "Nil",
    completedIn: "3 to 7 working days",
    estimatedValue: 1299,
    formTitle: "Get Started with GST Registration",
  },
  "GST Return Filing": {
    id: "gst-return-filing",
    serviceTitle: "GST Return Filing",
    tagline: "On-Time GSTR-1 & 3B Monthly Compliance",
    badge: "Monthly Retainer",
    description:
      "Automated monthly & quarterly filing with 100% GSTR-2B input tax credit reconciliation to prevent penalties and blocked credits.",
    bulletPoints: [
      "Maximized ITC claim through 2B matching",
      "Zero late fee and interest penalties",
      "Direct CA review before portal upload",
      "Automatic statutory compliance alerts",
    ],
    professionalFee: "Rs. 999 - 2,499 / mo",
    governmentFee: "Nil",
    completedIn: "1 to 2 working days",
    estimatedValue: 1999,
    formTitle: "Get Started with GST Return Filing",
  },
  "Direct Tax & ITR Assessments": {
    id: "income-tax",
    serviceTitle: "Direct Tax & ITR Assessments",
    tagline: "Expert Tax Planning & Accurate ITR Filing",
    badge: "Handled by Senior CAs",
    description:
      "Comprehensive income tax returns for individuals, LLPs, and corporate entities with deep AIS/TIS reconciliation and notice protection.",
    bulletPoints: [
      "ITR-1 through ITR-6 Corporate & Individual Filing",
      "AIS, TIS & Form 26AS Tax Credit Matching",
      "Advance Tax Projections & Notice Advisory",
      "Maximum legitimate deduction optimization",
    ],
    professionalFee: "Rs. 1,499 - 4,999",
    governmentFee: "Nil",
    completedIn: "2 to 4 working days",
    estimatedValue: 2499,
    formTitle: "Get Started with Income Tax Filing",
  },
  "Audit & Statutory Assurance": {
    id: "statutory-audit",
    serviceTitle: "Audit & Statutory Assurance",
    tagline: "Companies Act & Tax Audit Assurance",
    badge: "ICAI Compliant Audit",
    description:
      "Independent statutory audit, Section 44AB tax audit, IFC assessment, and thorough internal controls evaluation for growing businesses.",
    bulletPoints: [
      "Section 44AB Tax Audit & Form 3CD Certification",
      "Companies Act 2013 Statutory Financial Audit",
      "Internal Financial Controls (IFC) Verification",
      "Complete statutory auditor report issuance",
    ],
    professionalFee: "Rs. 7,999 - 19,999",
    governmentFee: "Nil",
    completedIn: "5 to 10 working days",
    estimatedValue: 9999,
    formTitle: "Schedule Statutory Audit",
  },
  "Accounting & MIS Reporting": {
    id: "bookkeeping-reporting",
    serviceTitle: "Accounting & MIS Reporting",
    tagline: "Cloud Bookkeeping & Monthly Financial Controls",
    badge: "Dedicated Accountant",
    description:
      "Full cloud ledger management (Tally, Zoho, QuickBooks), monthly P&L, balance sheets, payroll reconciliation, and vendor TDS compliance.",
    bulletPoints: [
      "Dedicated senior accountant assignment",
      "Monthly Balance Sheet & P&L Statement",
      "Vendor TDS & Payroll Reconciliation",
      "Quarterly management reviews with Partner CA",
    ],
    professionalFee: "Rs. 2,999 - 7,999 / mo",
    governmentFee: "Nil",
    completedIn: "Monthly Continuous",
    estimatedValue: 3999,
    formTitle: "Get Started with Bookkeeping & MIS",
  },
  "Startup & Regulatory Registrations": {
    id: "startup-advisory",
    serviceTitle: "Startup & Regulatory Registrations",
    tagline: "DPIIT Recognition, Udyam MSME & Trade Licensing",
    badge: "Govt Subsidies",
    description:
      "Obtain government recognitions, tax exemptions under Section 80-IAC, MSME priority lending benefits, and export IEC codes.",
    bulletPoints: [
      "DPIIT Startup India Certificate & Tax Holiday filing",
      "Instant Udyam Registration processing",
      "Import Export Code (IEC) issuance",
      "Trademark availability search & filing",
    ],
    professionalFee: "Rs. 999 - 3,499",
    governmentFee: "Nil / Statutory",
    completedIn: "2 to 5 working days",
    estimatedValue: 1999,
    formTitle: "Get Started with Startup Registrations",
  },
};

function getServiceDetails(serviceTitle: string): ServiceDetail {
  if (SERVICE_DETAILS_CATALOG[serviceTitle]) {
    return SERVICE_DETAILS_CATALOG[serviceTitle];
  }
  const matchedKey = Object.keys(SERVICE_DETAILS_CATALOG).find(
    (k) => serviceTitle.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(serviceTitle.toLowerCase())
  );
  if (matchedKey) {
    return SERVICE_DETAILS_CATALOG[matchedKey];
  }
  return {
    id: "custom-service",
    serviceTitle: serviceTitle || "Professional CA Consultation",
    tagline: "Comprehensive Advisory & Regulatory Solutions",
    badge: "Chartered Accountant Verified",
    description: "Expert chartered accountant guidance for statutory filings, corporate registrations, and tax optimization.",
    bulletPoints: [
      "Direct review by qualified Chartered Accountants",
      "Complete documentation check and portal filing",
      "Transparent fees with zero hidden charges",
      "Guaranteed timelines and active status updates",
    ],
    professionalFee: "Rs. 1,499 - 4,999",
    governmentFee: "As per statutory portal",
    completedIn: "2 to 5 working days",
    estimatedValue: 2499,
    formTitle: `Get Started with ${serviceTitle || "Consultation"}`,
  };
}

// ─── MAIN ACCOUNTAX TEMPLATE COMPONENT ──────────────────────────────────────────

export function AccountaxTemplate({ config }: AccountaxTemplateProps) {
  const page = config.pages[0];
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Company Incorporation");
  const [formHighlight, setFormHighlight] = useState(false);
  const closeTimerRef = useRef<any>(null);

  const handleMouseEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsServicesOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 200);
  };

  const handleSelectService = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setIsServicesOpen(false);
    setFormHighlight(true);
    setTimeout(() => setFormHighlight(false), 2000);
    const target = document.getElementById("hero-consultation-card") || document.getElementById("contact");
    if (target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const activeNavLinks = (config.header.navLinks || []).filter((l) => l.enabled);
  const quickLinkGroups = (config.footer.quickLinkGroups || []).filter(
    (g) => g.title && g.links && g.links.length > 0
  );
  const socialLinks = config.footer.socialLinks || [];

  return (
    <div className="accountax-root">
      {/* 1. Black Top Info Bar */}
      {config.header.showTopInfoBar !== false && (
        <div className="at-topbar">
          <div className="at-topbar-inner">
            <div className="at-topbar-left">
              <div className="at-topbar-item">
                <MapPin size={12} style={{ color: "#f59e0b" }} />
                <span>{config.branding.address || SHARED_FIRM_CONTACT.primaryOffice}</span>
              </div>
              <div className="at-topbar-item">
                <Phone size={12} style={{ color: "#f59e0b" }} />
                <span>{config.branding.phone || SHARED_FIRM_CONTACT.phone}</span>
              </div>
              <div className="at-topbar-item">
                <Clock size={12} style={{ color: "#f59e0b" }} />
                <span>Mon – Sat: 9:30 AM – 6:30 PM</span>
              </div>
            </div>

            <div className="at-topbar-right">
              <span style={{ color: "#94a3b8", fontSize: 11 }}>Follow Us:</span>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {socialLinks.length > 0 ? (
                  socialLinks.map((s, idx) => (
                    <a
                      key={idx}
                      href={sanitizeLink(s.url, "#")}
                      {...getLinkAttributes(sanitizeLink(s.url, "#"))}
                      style={{ color: "#cbd5e1" }}
                    >
                      <SocialIcon platform={s.platform} size={13} />
                    </a>
                  ))
                ) : (
                  <>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: "#cbd5e1" }}>
                      <SocialIcon platform="linkedin" size={13} />
                    </a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" style={{ color: "#cbd5e1" }}>
                      <SocialIcon platform="x" size={13} />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Sleek White Main Header with Gold Action Button */}
      <header className="at-header">
        <div className="at-header-inner">
          <a href="#home" className="at-brand">
            {config.branding.logoUrl ? (
              <img
                src={config.branding.logoUrl}
                alt={config.branding.firmName}
                style={{ maxHeight: 38, objectFit: "contain" }}
              />
            ) : (
              <div className="at-brand-mark">
                <div className="at-brand-icon">
                  <PieChart size={18} color="#0f172a" />
                </div>
                <div className="at-brand-text">
                  <span className="at-brand-name">{config.branding.firmName || "Accountax"}</span>
                  <span className="at-brand-sub">{config.branding.tagline || "Chartered Accountants"}</span>
                </div>
              </div>
            )}
          </a>

          {/* Navigation Links */}
          {activeNavLinks.length > 0 ? (
            <nav className="at-nav">
              {activeNavLinks.map((link, idx) => {
                const safeUrl = sanitizeLink(link.url, "#");
                const attrs = getLinkAttributes(safeUrl);
                const isServicesLink = link.label.toLowerCase().includes("service");
                if (isServicesLink) {
                  return (
                    <div
                      key={idx}
                      className="accountax-nav-services-wrapper"
                      style={{ position: "relative" }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <a
                        href={safeUrl}
                        {...attrs}
                        className="at-nav-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsServicesOpen((prev) => !prev);
                        }}
                        style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                      >
                        {link.label}
                        <ChevronDown
                          size={13}
                          style={{
                            transition: "transform 0.2s ease",
                            transform: isServicesOpen ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        />
                      </a>
                      <TemplateServicesDropdown
                        isOpen={isServicesOpen}
                        onClose={() => setIsServicesOpen(false)}
                        onSelectService={handleSelectService}
                        variant="accountax"
                        megaMenu={config.header.megaMenu}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      />
                    </div>
                  );
                }
                return (
                  <a key={idx} href={safeUrl} {...attrs} className="at-nav-link">
                    {link.label}
                  </a>
                );
              })}
            </nav>
          ) : (
            <nav className="at-nav">
              <a href="#home" className="at-nav-link active">Home</a>
              <a href="#about" className="at-nav-link">About Us</a>
              <div
                style={{ position: "relative" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <a
                  href="#services"
                  className="at-nav-link"
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
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
              <a href="#tax-calendar" className="at-nav-link">Tax Calendar</a>
              <a href="#calculators" className="at-nav-link">Calculators</a>
              <a href="#contact" className="at-nav-link">Contact</a>
            </nav>
          )}

          {/* Header Action Button */}
          <div className="at-header-actions">
            {config.header.headerCta?.enabled !== false && (
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectService(selectedService);
                }}
                className="at-btn-gold"
              >
                {config.header.headerCta?.label || "Contact Us"}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* 3. Main Dynamic Sections Router */}
      <main style={{ flex: 1 }}>
        {page?.sections
          .filter((s) => s.enabled)
          .sort((a, b) => a.order - b.order)
          .map((sec) => (
            <AccountaxSectionRouter
              key={sec.id}
              sec={sec}
              config={config}
              selectedService={selectedService}
              onSelectService={handleSelectService}
              formHighlight={formHighlight}
            />
          ))}
      </main>

      {/* 4. Elegant Accountax Footer */}
      <footer className="at-footer">
        <div className="at-footer-top">
          <div className="at-footer-col" style={{ maxWidth: 360 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div className="at-brand-icon" style={{ background: "#f59e0b" }}>
                <PieChart size={18} color="#0f172a" />
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                {config.branding.firmName || "Accountax"}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: "0 0 20px" }}>
              {config.branding.tagline ||
                "Delivering trusted statutory audits, corporate taxation, structured bookkeeping, and enterprise regulatory governance."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12.5, color: "#cbd5e1" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <MapPin size={15} style={{ color: "#f59e0b", flexShrink: 0 }} />
                <span>{config.branding.address || SHARED_FIRM_CONTACT.primaryOffice}</span>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Phone size={15} style={{ color: "#f59e0b", flexShrink: 0 }} />
                <span>{config.branding.phone || SHARED_FIRM_CONTACT.phone}</span>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Mail size={15} style={{ color: "#f59e0b", flexShrink: 0 }} />
                <span>{config.branding.email || SHARED_FIRM_CONTACT.email}</span>
              </div>
            </div>
          </div>

          {/* Quick link columns */}
          {quickLinkGroups.length > 0 ? (
            quickLinkGroups.map((grp, gIdx) => (
              <div key={gIdx} className="at-footer-col">
                <h4 className="at-footer-heading">{grp.title}</h4>
                <ul className="at-footer-links">
                  {grp.links
                    .filter((l) => l.label && l.url)
                    .map((lnk, lIdx) => (
                      <li key={lIdx}>
                        <a href={sanitizeLink(lnk.url, "#")} {...getLinkAttributes(sanitizeLink(lnk.url, "#"))}>
                          {lnk.label}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))
          ) : (
            <>
              <div className="at-footer-col">
                <h4 className="at-footer-heading">Services</h4>
                <ul className="at-footer-links">
                  <li><a href="#services">Bookkeeping & Accounting</a></li>
                  <li><a href="#services">Statutory Audit & Assurance</a></li>
                  <li><a href="#services">Company Incorporation</a></li>
                  <li><a href="#services">GST Compliance & Filing</a></li>
                  <li><a href="#services">Direct Tax & Scrutiny</a></li>
                </ul>
              </div>

              <div className="at-footer-col">
                <h4 className="at-footer-heading">Quick Links</h4>
                <ul className="at-footer-links">
                  <li><a href="#about">About Firm</a></li>
                  <li><a href="#tax-calendar">Tax Calendar</a></li>
                  <li><a href="#calculators">Calculators (coming soon)</a></li>
                  <li><a href="#contact">Client Desk</a></li>
                  <li><a href="#contact">Office Directions</a></li>
                </ul>
              </div>
            </>
          )}

          <div className="at-footer-col">
            <h4 className="at-footer-heading">Working Hours</h4>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: "0 0 12px" }}>
              Monday – Saturday<br />
              <strong style={{ color: "#ffffff" }}>9:30 AM – 6:30 PM (IST)</strong>
            </p>
            <div style={{ marginTop: 16 }}>
              <a
                href="#contact"
                className="at-btn-gold"
                style={{ padding: "8px 16px", fontSize: 12, display: "inline-block" }}
              >
                Schedule Meeting
              </a>
            </div>
          </div>
        </div>

        {/* ICAI Standard Disclaimer */}
        {config.footer.icaiDisclaimer && (
          <div className="at-footer-disclaimer">
            {config.footer.disclaimerText ||
              "In accordance with the Chartered Accountants Act, 1949 and guidelines issued by the Institute of Chartered Accountants of India (ICAI), this website is designed exclusively for providing factual information regarding the firm's practice domains and compliance resources. It does not constitute any advertisement, solicitation, personal communication or invitation to offer work."}
          </div>
        )}

        <div className="at-footer-bottom">
          <div>{config.footer.copyrightText || `© ${new Date().getFullYear()} ${config.branding.firmName || "Accountax"}. All rights reserved.`}</div>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="#about">About Us</a>
            <a href="#services">Practice Areas</a>
            <a href="#tax-calendar">Compliance Calendar</a>
            <a href="#contact">Office Desk</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── SECTION ROUTER ────────────────────────────────────────────────────────────

function AccountaxSectionRouter({
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
      return (
        <AccountaxHeroSection
          props={sec.props}
          config={config}
          selectedService={selectedService}
          onSelectService={onSelectService}
          formHighlight={formHighlight}
        />
      );
    case "services":
      return (
        <AccountaxServicesSection
          props={sec.props}
          config={config}
          onSelectService={onSelectService}
        />
      );
    case "tax-calendar":
      return <AccountaxTaxCalendarSection props={sec.props} config={config} />;
    case "testimonials":
      return <AccountaxTestimonialsSection props={sec.props} config={config} />;
    case "cta":
      return <AccountaxCtaSection props={sec.props} config={config} />;
    case "contact":
      return (
        <AccountaxContactSection
          props={sec.props}
          config={config}
          selectedService={selectedService}
          onSelectService={onSelectService}
          formHighlight={formHighlight}
        />
      );
    case "calculators":
      return <AccountaxCalculatorsSection props={sec.props} config={config} />;
    default:
      return null;
  }
}

// ─── 1. HERO SECTION WITH SPLIT DARK/LIGHT DESIGN & 3 HIGHLIGHT PILLARS ─────────

function AccountaxHeroSection({
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
  const heroImage = props?.heroImageUrl || props?.imageUrl;
  const details = getServiceDetails(selectedService);

  return (
    <section
      className="at-hero-wrapper"
      id="home"
      style={
        heroImage
          ? {
              backgroundImage: `linear-gradient(rgba(10, 15, 25, 0.85), rgba(10, 15, 25, 0.94)), url("${heroImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
    >
      {/* Top Split Banner: Left Dark Content Column, Right Consultation Box */}
      <div className="at-hero-split">
        {/* Left Dark Content Column */}
        <div className="at-hero-left">
          <div className="at-hero-pill-badge">
            <span className="at-pill-dot" />
            <span>ESTABLISHED CHARTERED ACCOUNTANCY PRACTICE</span>
          </div>

          <h1 className="at-hero-title">
            {props?.headline ? (
              props.headline
            ) : (
              <>
                We Provide Best <span className="at-highlight-yellow">Accounting</span> & Tax Service For You
              </>
            )}
          </h1>

          <p className="at-hero-sub">
            {props?.subheadline ||
              "Structured statutory assurance, direct tax advisory, corporate MCA compliance and strategic financial solutions for emerging startups and established enterprises across India."}
          </p>

          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onSelectService(selectedService);
              }}
              className="at-btn-gold"
              style={{ padding: "14px 28px", fontSize: 14 }}
            >
              {props?.primaryCtaText || "Get Started"} <ArrowRight size={16} />
            </a>
            <a
              href="#services"
              className="at-btn-outline-white"
            >
              {props?.secondaryCtaText || "Explore Services"}
            </a>
          </div>
        </div>

        {/* Right Hero Column with Floating Callback Consultation Form Card */}
        <div className="at-hero-right">
          {/* Floating Callback Consultation Form Card */}
          <div
            id="hero-consultation-card"
            className={`at-hero-floating-form ${formHighlight ? "at-highlight-pulse" : ""}`}
          >
            <div className="at-form-card-header">
              <div className="at-form-badge">{details.badge}</div>
              <h3>{details.formTitle}</h3>
              <p>Direct CA Review · Transparent Indicative Fee</p>
            </div>

            <AccountaxCallbackForm
              selectedService={selectedService}
              onServiceChange={onSelectService}
              megaMenu={config.header.megaMenu}
            />
          </div>
        </div>
      </div>

      {/* 3 Floating Highlight Feature Pillars (Yellow Highlight Card in Center) */}
      <div className="at-pillars-container">
        <div className="at-pillars-grid">
          {/* Pillar 1 */}
          <div className="at-pillar-card">
            <div className="at-pillar-icon">
              <TrendingUp size={24} color="#f59e0b" />
            </div>
            <h3 className="at-pillar-title">Saving Strategies</h3>
            <p className="at-pillar-desc">
              Legitimate tax structuring and advance tax projections maximizing input tax credits under statutory rules.
            </p>
            <a href="#services" className="at-pillar-link">
              Read More <ArrowRight size={13} />
            </a>
          </div>

          {/* Pillar 2 (Featured Vibrant Gold Card) */}
          <div className="at-pillar-card at-pillar-featured">
            <div className="at-pillar-icon at-pillar-icon-dark">
              <Scale size={24} color="#0f172a" />
            </div>
            <h3 className="at-pillar-title" style={{ color: "#0f172a" }}>Competitive Price</h3>
            <p className="at-pillar-desc" style={{ color: "#334155" }}>
              Transparent professional fee schedule with itemized government charges and zero hidden cost surprises.
            </p>
            <a href="#services" className="at-pillar-link" style={{ color: "#0f172a" }}>
              Read More <ArrowRight size={13} />
            </a>
          </div>

          {/* Pillar 3 */}
          <div className="at-pillar-card">
            <div className="at-pillar-icon">
              <Headphones size={24} color="#f59e0b" />
            </div>
            <h3 className="at-pillar-title">24/7 CA Support</h3>
            <p className="at-pillar-desc">
              Dedicated qualified Chartered Accountant assigned to monitor every return, notice reply, and compliance deadline.
            </p>
            <a href="#contact" className="at-pillar-link">
              Read More <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 2. ABOUT US & EXPERIENCE CREDENTIALS MATRIX ───────────────────────────────

function AccountaxAboutSection({ config }: { config: WebsiteConfig }) {
  return (
    <section className="at-about-section" id="about">
      <div className="at-about-inner">
        {/* Left Mosaic Photo Grid with 20+ Years Badge */}
        <div className="at-about-mosaic">
          <div className="at-mosaic-img-top">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80"
              alt="Accountax Partner Team"
            />
          </div>
          <div className="at-mosaic-bottom-row">
            <div className="at-experience-badge">
              <div className="at-exp-icon">
                <PieChart size={28} color="#f59e0b" />
              </div>
              <div className="at-exp-number">20+</div>
              <div className="at-exp-text">Years Of Experience</div>
            </div>
            <div className="at-mosaic-img-small">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80"
                alt="Audit Review"
              />
            </div>
          </div>
        </div>

        {/* Right Content & Credential Checkmarks with Progress Bars */}
        <div className="at-about-content">
          <span className="at-sec-tag">ABOUT ACCOUNTAX</span>
          <h2 className="at-sec-title" style={{ textAlign: "left", margin: "8px 0 16px" }}>
            We Have 20 Years Of Experience In Accounting & Tax Service
          </h2>
          <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.7, margin: "0 0 20px" }}>
            Our practice is built on uncompromising statutory rigor, strict adherence to ICAI accounting standards, and a deep dedication to our clients' financial growth and regulatory compliance.
          </p>

          <div className="at-about-two-col">
            <div className="at-about-bullets">
              <div className="at-bullet-item">
                <span className="at-bullet-dot" />
                <span>High Standards of Integrity</span>
              </div>
              <div className="at-bullet-item">
                <span className="at-bullet-dot" />
                <span>Best Accounting Service</span>
              </div>
              <div className="at-bullet-item">
                <span className="at-bullet-dot" />
                <span>Quality Control</span>
              </div>
              <div className="at-bullet-item">
                <span className="at-bullet-dot" />
                <span>Professional Team</span>
              </div>
              <div className="at-bullet-item">
                <span className="at-bullet-dot" />
                <span>24/7 Customer Support</span>
              </div>
            </div>

            <div className="at-about-mini-img">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80"
                alt="Consulting team"
              />
            </div>
          </div>

          {/* Progress Bars as in design */}
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
                <span>Saving Strategies</span>
                <span style={{ color: "#f59e0b" }}>95%</span>
              </div>
              <div className="at-progress-track">
                <div className="at-progress-fill" style={{ width: "95%" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
                <span>Tax Planning</span>
                <span style={{ color: "#f59e0b" }}>98%</span>
              </div>
              <div className="at-progress-track">
                <div className="at-progress-fill" style={{ width: "98%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 3. SERVICES SECTION (Exact 3 Cards with Photo Headers + Dark Center Card) ──

function AccountaxServicesSection({
  props,
  config,
  onSelectService,
}: {
  props: any;
  config: WebsiteConfig;
  onSelectService: (service: string) => void;
}) {
  const visibleIds = Array.isArray(props.visibleServiceIds) ? props.visibleServiceIds : null;
  const filteredServices =
    visibleIds !== null && visibleIds.length > 0
      ? SHARED_SERVICES.filter((s) => visibleIds.includes(s.id))
      : visibleIds !== null && visibleIds.length === 0
      ? []
      : SHARED_SERVICES;

  const cardImages = [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  ];

  return (
    <>
      <AccountaxAboutSection config={config} />

      <section className="at-services-section" id="services">
        <div className="at-services-header">
          <div>
            <span className="at-sec-tag">OUR SERVICES</span>
            <h2 className="at-sec-title" style={{ textAlign: "left", margin: "6px 0 0" }}>
              {props.title || "What Service We Offer"}
            </h2>
          </div>
          <div style={{ maxWidth: 460 }}>
            <p style={{ fontSize: 13.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
              {props.subtitle ||
                "Providing statutory accounting, direct corporate taxation, statutory audits, and structured advisory solutions across industries."}
            </p>
          </div>
          <div>
            <a href="#contact" className="at-btn-gold" style={{ padding: "10px 22px", fontSize: 13 }}>
              ALL SERVICES
            </a>
          </div>
        </div>

        {/* 3-Column Service Offer Cards with Top Images and Yellow Drop Circles */}
        <div className="at-services-grid">
          {filteredServices.slice(0, 3).map((srv, idx) => {
            const isDarkCard = idx === 1; // Middle card is deep black as shown in the screenshot
            const imgUrl = cardImages[idx % cardImages.length];

            return (
              <div
                key={srv.id}
                className={`at-service-card-v2 ${isDarkCard ? "at-card-dark" : "at-card-light"}`}
                onClick={() => onSelectService(srv.title)}
              >
                <div className="at-card-img-wrap">
                  <img src={imgUrl} alt={srv.title} />
                </div>

                <div className="at-card-body">
                  <div className="at-card-icon-tag">
                    <PieChart size={20} color="#0f172a" />
                  </div>
                  <h3 className="at-card-title">{srv.title}</h3>
                  <p className="at-card-desc">{srv.description}</p>
                </div>

                <div className="at-card-circle-action">
                  <div className="at-circle-btn">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SPLIT FEATURE SECTION: "We Provide High-Quality Accounting & Tax Service" with Circular Counters */}
      <section className="at-split-feature-section">
        <div className="at-split-feature-inner">
          {/* Left Dark Content */}
          <div className="at-split-feat-left">
            <span className="at-sec-tag" style={{ color: "#f59e0b" }}>WHY CHOOSE US</span>
            <h2 className="at-feat-title">
              We Provide High-Quality Accounting & Tax Service
            </h2>
            <p className="at-feat-desc">
              From day-to-day statutory ledger maintenance to high-stake tax audits and structuring, we combine deep industry experience with cutting-edge tech.
            </p>

            <div className="at-feat-boxes">
              <div className="at-feat-box">
                <div className="at-feat-icon-sq">
                  <PieChart size={20} color="#0f172a" />
                </div>
                <div>
                  <h4>Best Accounting Service</h4>
                  <p>Guaranteed error-free reconciliation and full compliance with ICAI standards.</p>
                </div>
              </div>

              <div className="at-feat-box">
                <div className="at-feat-icon-sq">
                  <TrendingUp size={20} color="#0f172a" />
                </div>
                <div>
                  <h4>Business Strategy & Growth</h4>
                  <p>Proactive cash flow forecasting, MIS reports, and tax-efficient planning.</p>
                </div>
              </div>
            </div>

            <div className="at-feat-actions">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectService("Company Incorporation");
                }}
                className="at-btn-gold"
                style={{ padding: "12px 24px" }}
              >
                START CONSULTATION
              </a>
              <a href="#case-studies" className="at-feat-link">
                → VIEW PROJECTS
              </a>
            </div>
          </div>

          {/* Right Image with Circular Progress Overlays */}
          <div className="at-split-feat-right">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80"
              alt="Corporate Consultation Team"
              className="at-feat-cover-img"
            />

            {/* Circular Metric Overlay 1: 69% Projects Work */}
            <div className="at-gauge-card at-gauge-left">
              <div className="at-gauge-circle">
                <span>69%</span>
              </div>
              <div className="at-gauge-text">
                <strong>Projects Work</strong>
                <p>Delivered on schedule with 100% compliance record</p>
              </div>
            </div>

            {/* Circular Metric Overlay 2: 65% Expert Team */}
            <div className="at-gauge-card at-gauge-right">
              <div className="at-gauge-circle">
                <span>65%</span>
              </div>
              <div className="at-gauge-text">
                <strong>Expert Team</strong>
                <p>Qualified Chartered Accountants and CS partners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CASE STUDIES / PROJECTS SECTION ("Project We Have Done") */}
      <section className="at-case-studies-section" id="case-studies">
        <div className="at-case-header">
          <span className="at-sec-tag">CASE STUDIES</span>
          <h2 className="at-sec-title" style={{ margin: "6px 0 8px" }}>
            Project We Have Done
          </h2>
          <p style={{ fontSize: 13.5, color: "#64748b", maxWidth: 540, margin: "0 auto" }}>
            Real-world tax planning, statutory audits, and financial structuring completed for our corporate clients.
          </p>
        </div>

        <div className="at-case-grid">
          {/* Card 1 (Yellow Header Block) */}
          <div className="at-case-card">
            <div className="at-case-img">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                alt="Tax Management"
              />
            </div>
            <div className="at-case-banner at-case-banner-yellow">
              <div className="at-case-icon">
                <FileText size={18} color="#0f172a" />
              </div>
              <div>
                <h3>Tax Management</h3>
                <span>Tax Planning</span>
              </div>
            </div>
            <div className="at-case-body">
              <p>Comprehensive corporate restructuring and multi-state GST input tax reconciliation saving over 18% in annual liabilities.</p>
              <a href="#contact" className="at-case-link">
                READ MORE →
              </a>
            </div>
          </div>

          {/* Card 2 (Black Header Block) */}
          <div className="at-case-card">
            <div className="at-case-img">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
                alt="Business Plan"
              />
            </div>
            <div className="at-case-banner at-case-banner-dark">
              <div className="at-case-icon">
                <TrendingUp size={18} color="#f59e0b" />
              </div>
              <div>
                <h3>Business Plan</h3>
                <span>Growth Strategy</span>
              </div>
            </div>
            <div className="at-case-body">
              <p>Financial modeling, cash-flow stress testing, and Series A investor-ready due diligence report preparation.</p>
              <a href="#contact" className="at-case-link">
                READ MORE →
              </a>
            </div>
          </div>

          {/* Card 3 (Yellow Header Block) */}
          <div className="at-case-card">
            <div className="at-case-img">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
                alt="Company Budgeting"
              />
            </div>
            <div className="at-case-banner at-case-banner-yellow">
              <div className="at-case-icon">
                <Scale size={18} color="#0f172a" />
              </div>
              <div>
                <h3>Company Budgeting</h3>
                <span>Bookkeeping</span>
              </div>
            </div>
            <div className="at-case-body">
              <p>End-to-end cloud bookkeeping migration, monthly MIS dashboard automation, and vendor TDS statutory controls.</p>
              <a href="#contact" className="at-case-link">
                READ MORE →
              </a>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <p style={{ fontSize: 13, color: "#94a3b8" }}>
            Want to see how we can assist your business? <a href="#contact" style={{ color: "#f59e0b", fontWeight: 700 }}>Request a consultation</a>
          </p>
        </div>
      </section>

      {/* Specialized Advisory Desks / Practice Visual Gallery */}
      <PracticeGallerySection
        tiles={props.galleryTiles}
        title={props.galleryTitle || "Specialized Advisory Desks"}
        tagline={props.galleryTagline || "FULL PRACTICE SPECTRUM"}
        subtitle={props.gallerySubtitle || "Specialized desks for company incorporation, GST compliance, startup India, and tax audits."}
        variant="apex"
        onSelectService={onSelectService}
      />
    </>
  );
}

// ─── 4. STATUTORY DUE DATES TAX CALENDAR SECTION ───────────────────────────────

function AccountaxTaxCalendarSection({ props }: { props: any; config: WebsiteConfig }) {
  const [selectedAuth, setSelectedAuth] = useState<string>("All");

  const datesToDisplay = SHARED_TAX_DATES.filter(
    (d) => selectedAuth === "All" || d.authority === selectedAuth
  );

  return (
    <section className="at-calendar-section" id="tax-calendar">
      <div className="at-calendar-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          <div>
            <span className="at-sec-tag">STATUTORY DUE DATES</span>
            <h2 className="at-sec-title" style={{ textAlign: "left", margin: "6px 0 4px" }}>
              {props.title || "Upcoming Statutory Compliance Calendar"}
            </h2>
            <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>
              {props.subtitle || "Track every filing deadline across GSTN, CBDT, and MCA authorities."}
            </p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {["All", "GSTN", "CBDT", "MCA"].map((auth) => (
              <button
                key={auth}
                onClick={() => setSelectedAuth(auth)}
                className={`at-filter-btn ${selectedAuth === auth ? "active" : ""}`}
              >
                {auth}
              </button>
            ))}
          </div>
        </div>

        <div className="at-calendar-grid">
          {datesToDisplay.map((item, idx) => (
            <div key={idx} className="at-cal-card">
              <div className="at-cal-date-badge">
                <span className="at-cal-day">{item.date.split(" ")[0]}</span>
                <span className="at-cal-month">{item.date.split(" ")[1]}</span>
                <span className="at-cal-year">{item.date.split(" ")[2]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div className="at-cal-title">{item.title}</div>
                <div className="at-cal-meta">
                  <span>{item.form}</span> · <strong style={{ color: "#f59e0b" }}>{item.authority}</strong> ({item.category})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 5. TESTIMONIALS SECTION ("What They Say About Accountax") ────────────────

function AccountaxTestimonialsSection({ props }: { props: any; config: WebsiteConfig }) {
  return (
    <section className="at-testimonials-section" id="testimonials">
      <div className="at-testimonials-backdrop">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
          alt="Corporate Testimonials Background"
          className="at-testi-bg-img"
        />
        <div className="at-testi-overlay" />
      </div>

      <div className="at-testimonials-content">
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span className="at-sec-tag" style={{ color: "#f59e0b" }}>TESTIMONIALS</span>
          <h2 className="at-sec-title" style={{ margin: "6px 0 8px", color: "#ffffff" }}>
            {props.title || "What They Say About Accountax"}
          </h2>
          <p style={{ fontSize: 13.5, color: "#94a3b8", maxWidth: 600, margin: "0 auto" }}>
            {props.subtitle || "Trusted endorsements from enterprise leaders and fast-scaling startup founders across India."}
          </p>
        </div>

        <div className="at-testimonials-grid">
          {SHARED_CLIENT_REVIEWS.slice(0, 3).map((rev) => (
            <div key={rev.id} className="at-testimonial-card-white">
              <p className="at-quote-text">"{rev.statement}"</p>
              <div className="at-quote-author-row">
                <div className="at-author-info">
                  <div className="at-author-avatar-img">
                    {rev.clientInitials}
                  </div>
                  <div>
                    <div className="at-author-name">Client {rev.clientInitials}</div>
                    <div className="at-author-role">{rev.businessSector}</div>
                  </div>
                </div>
                <div className="at-quote-mark">“</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 6. LATEST BLOG & ARTICLES / INSIGHTS SECTION ────────────────────────────

function AccountaxBlogSection() {
  const articles = [
    {
      id: 1,
      category: "STRATEGY",
      title: "Optimizing Direct Tax Strategy Under New Regime",
      desc: "Comparative assessment of Section 115BAC exemptions vs deductions for growing corporate businesses.",
      date: "September 2026",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      category: "TAX PLANNING",
      title: "GSTR-2B Input Tax Credit Reconciliation Best Practices",
      desc: "Preventing statutory notices and blocked credit through automated supplier GSTIN ledger matching.",
      date: "August 2026",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      category: "FINANCIAL",
      title: "Key Steps for Seamless Statutory Company Incorporation",
      desc: "Essential SPICe+ Part A/B compliance checklist and post-incorporation 180-day commencement filings.",
      date: "August 2026",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section className="at-blog-section" id="insights">
      <div className="at-blog-inner">
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span className="at-sec-tag">OUR BLOG</span>
          <h2 className="at-sec-title" style={{ margin: "6px 0 8px" }}>
            Latest Blog & Articles
          </h2>
          <p style={{ fontSize: 13.5, color: "#64748b", maxWidth: 540, margin: "0 auto" }}>
            Actionable compliance insights, tax analysis, and statutory updates published by our chartered accountants.
          </p>
        </div>

        <div className="at-blog-grid">
          {articles.map((art) => (
            <div key={art.id} className="at-blog-card">
              <div className="at-blog-img-wrap">
                <img src={art.image} alt={art.title} />
                <span className="at-blog-category-badge">{art.category}</span>
              </div>
              <div className="at-blog-body">
                <h3 className="at-blog-card-title">{art.title}</h3>
                <p className="at-blog-card-desc">{art.desc}</p>
                <a href="#contact" className="at-blog-read-more">
                  READ MORE →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 7. CALL TO ACTION SECTION ────────────────────────────────────────────────

function AccountaxCtaSection({ props }: { props: any; config: WebsiteConfig }) {
  const btnHref = sanitizeLink(props.buttonLink || props.ctaLink, "#contact");
  const btnAttrs = getLinkAttributes(btnHref);

  return (
    <>
      <AccountaxBlogSection />
      <section className="at-cta-banner">
        <div className="at-cta-inner">
          <div style={{ maxWidth: 700 }}>
            <span className="at-sec-tag" style={{ color: "#f59e0b" }}>START TODAY</span>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: "#ffffff", margin: "8px 0 12px", letterSpacing: "-0.02em" }}>
              {props.headline || "We Provide High-Quality Accounting & Tax Service"}
            </h2>
            <p style={{ fontSize: 14, color: "#cbd5e1", margin: 0, lineHeight: 1.6 }}>
              {props.subheadline || "Contact our senior chartered accountants today for confidential statutory audit and tax advisory."}
            </p>
          </div>
          <div>
            <a href={btnHref} {...btnAttrs} className="at-btn-gold" style={{ padding: "14px 28px", fontSize: 14 }}>
              {props.buttonText || props.ctaText || "Start Consultation"} <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── 7. CONTACT & CONSULTATION SECTION ────────────────────────────────────────

function AccountaxContactSection({
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
    <section className="at-contact-section" id="contact">
      <div className="at-contact-inner">
        <div className="at-contact-left">
          <span className="at-sec-tag">OFFICE DESK</span>
          <h2 className="at-sec-title" style={{ textAlign: "left", margin: "6px 0 14px" }}>
            {props.title || "Get In Touch With Our Practice"}
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: "0 0 28px" }}>
            {props.subtitle || "Connect directly with our partners for statutory audits, company setup, and direct taxation assessments."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="at-contact-item">
              <div className="at-contact-icon">
                <MapPin size={18} color="#f59e0b" />
              </div>
              <div>
                <strong style={{ display: "block", fontSize: 12, textTransform: "uppercase", color: "#64748b" }}>Registered Office</strong>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{config.branding.address || SHARED_FIRM_CONTACT.primaryOffice}</span>
              </div>
            </div>

            <div className="at-contact-item">
              <div className="at-contact-icon">
                <Phone size={18} color="#f59e0b" />
              </div>
              <div>
                <strong style={{ display: "block", fontSize: 12, textTransform: "uppercase", color: "#64748b" }}>Telephone</strong>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{config.branding.phone || SHARED_FIRM_CONTACT.phone}</span>
              </div>
            </div>

            <div className="at-contact-item">
              <div className="at-contact-icon">
                <Mail size={18} color="#f59e0b" />
              </div>
              <div>
                <strong style={{ display: "block", fontSize: 12, textTransform: "uppercase", color: "#64748b" }}>Official Email</strong>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{config.branding.email || SHARED_FIRM_CONTACT.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Consultation Form */}
        <div className="at-contact-right">
          <div className="at-contact-form-card">
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 6px", color: "#0f172a" }}>
              Request Callback & Advisory
            </h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px" }}>
              Submit your compliance inquiry. Senior partner will respond within 24 hours.
            </p>

            <AccountaxCallbackForm
              selectedService={selectedService}
              onServiceChange={onSelectService}
              megaMenu={config.header.megaMenu}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 8. CALCULATORS SECTION ───────────────────────────────────────────────────

function AccountaxCalculatorsSection({ props }: { props: any; config: WebsiteConfig }) {
  return (
    <section className="at-calculators-section" id="calculators">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <span className="at-sec-tag">CALCULATORS</span>
        <h2 className="at-sec-title" style={{ textAlign: "left", margin: "6px 0 10px" }}>
          {props.title || "Calculators (coming soon)"}
        </h2>
        <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 28px" }}>
          {props.subtitle || "Preliminary estimation tools for statutory and financial planning (in development)."}
        </p>

        <div className="at-calc-grid">
          {[
            { title: "GST Input Tax Credit & Liability", desc: "Interactive computation of output liabilities against eligible ITC credits." },
            { title: "Section 115BAC Regime Comparison", desc: "Detailed tax estimation comparing Old vs New Income Tax slabs." },
            { title: "Advance Tax Schedule Estimator", desc: "Quarterly installment estimation based on projected business turnovers." },
          ].map((c, i) => (
            <div key={i} className="at-calc-card">
              <Calculator size={24} color="#f59e0b" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px", color: "#0f172a" }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 18px", lineHeight: 1.5 }}>{c.desc}</p>
              <button className="at-btn-disabled" disabled>
                Coming Soon
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAST CALLBACK FORM (Shared Logic & CRM Lead Submission) ───────────────────

function AccountaxCallbackForm({
  selectedService,
  onServiceChange,
  megaMenu,
}: {
  selectedService: string;
  onServiceChange: (service: string) => void;
  megaMenu?: MegaMenuConfig;
}) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) return;

    const leadId = `lead_${Date.now()}`;
    const nowIso = new Date().toISOString();
    const newLead = {
      id: leadId,
      name: formData.name.trim(),
      phone: formData.mobile.trim(),
      email: formData.email.trim() || "no-email@portal.local",
      serviceInterest: selectedService,
      city: formData.city.trim() || "India",
      source: "Accountax Elite Form",
      submittedAt: nowIso,
      status: "new",
      notes: `Lead from Accountax Template for ${selectedService}`,
    };

    try {
      const MGMT_KEY = "activedesk_website_mgmt_dashboard_v1";
      const existingRaw = localStorage.getItem(MGMT_KEY);
      const dashboardData = existingRaw ? JSON.parse(existingRaw) : {};
      const existingLeads = Array.isArray(dashboardData.leads) ? dashboardData.leads : [];
      dashboardData.leads = [newLead, ...existingLeads];
      localStorage.setItem(MGMT_KEY, JSON.stringify(dashboardData));
    } catch (err) {
      console.error("Failed to save lead", err);
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("activedesk_lead_created", { detail: newLead }));
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "28px 16px" }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "#fef3c7",
            color: "#d97706",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          <CheckCircle2 size={28} />
        </div>
        <h4 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px", color: "#0f172a" }}>
          Inquiry Received!
        </h4>
        <p style={{ fontSize: 12.5, color: "#64748b", margin: "0 0 16px" }}>
          Our senior Chartered Accountant will review and reach out at <strong>{formData.mobile}</strong>.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", mobile: "", email: "", city: "" });
          }}
          className="at-btn-gold"
          style={{ width: "100%", padding: "10px 16px", fontSize: 13 }}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  const menuConfig = megaMenu || DEFAULT_MEGA_MENU_CONFIG;
  const catalogOptions =
    menuConfig?.categories && menuConfig.categories.length > 0
      ? Array.from(new Set(menuConfig.categories.flatMap((cat) => (cat.items || []).map((it) => it.label))))
      : Object.keys(SERVICE_DETAILS_CATALOG);

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 4 }}>
          YOUR NAME *
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Rahul Sharma"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="at-input"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 4 }}>
            PHONE NUMBER *
          </label>
          <input
            type="tel"
            required
            placeholder="10-digit mobile"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            className="at-input"
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 4 }}>
            CITY / STATE
          </label>
          <input
            type="text"
            placeholder="e.g. Mumbai"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="at-input"
          />
        </div>
      </div>

      <div>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 4 }}>
          SERVICE REQUIRED
        </label>
        <select
          value={selectedService}
          onChange={(e) => onServiceChange(e.target.value)}
          className="at-input"
          style={{ cursor: "pointer" }}
        >
          {catalogOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="at-btn-gold" style={{ width: "100%", padding: "12px", marginTop: 4, fontSize: 13.5 }}>
        Request Free CA Consultation <ArrowRight size={14} />
      </button>
    </form>
  );
}
