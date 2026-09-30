import React, { useState, useRef } from "react";
import { WebsiteConfig, SectionConfig, sanitizeLink, getLinkAttributes, isSafeLink } from "website-core";
import {
  Building2,
  ShieldCheck,
  Calendar,
  PhoneCall,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Clock,
  ArrowRight,
  Calculator,
  Mail,
  MapPin,
  FileText,
  ChevronDown,
} from "lucide-react";
import {
  SHARED_SERVICES,
  SHARED_TAX_DATES,
  SHARED_CLIENT_REVIEWS,
  SHARED_FIRM_CONTACT,
} from "../../fixtures/sharedData";

import { SocialIcon } from "../../components/SocialIcon";
import { TemplateServicesDropdown } from "../../components/TemplateServicesDropdown";
import { TemplateConsultationForm } from "../../components/TemplateConsultationForm";
import { PracticeGallerySection } from "../../components/PracticeGallerySection";

export interface TemplateComponentProps {
  config: WebsiteConfig;
}

export function ApexCorporateTemplate({ config }: TemplateComponentProps) {
  const page = config.pages[0];
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Private Limited Company Registration");
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
    const target = document.getElementById("contact") || document.getElementById("consultation-form-card");
    if (target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const activeNavLinks = (config.header.navLinks || []).filter((l) => l.enabled !== false && l.label && l.url);
  const quickLinkGroups = (config.footer.quickLinkGroups || []).filter(
    (g) => g.title && g.links && g.links.some((l) => l.label && l.url)
  );
  const socialLinks = (config.footer.socialLinks || []).filter((s) => s.platform && s.url && isSafeLink(s.url));

  return (
    <div className="apex-container">
      {/* 1. Top Bar */}
      {config.header.showTopInfoBar !== false && (
        <div className="apex-topbar">
          <div className="apex-topbar-left">
            <Clock size={12} />
            <span>Statutory Compliance & Tax Advisory Desk</span>
          </div>
          <div className="apex-topbar-right">
            <span>{config.branding.phone || SHARED_FIRM_CONTACT.phone}</span>
            <span>{config.branding.registrationNumber || SHARED_FIRM_CONTACT.icaiRegistration}</span>
          </div>
        </div>
      )}

      {/* 2. Header */}
      <header className="apex-header">
        <div className="apex-brand">
          {config.branding.logoUrl ? (
            <img
              src={config.branding.logoUrl}
              alt={config.branding.firmName}
              style={{ maxHeight: 36, maxWidth: 160, objectFit: "contain", borderRadius: 4 }}
            />
          ) : (
            <div className="apex-logo-icon">
              <Building2 size={20} />
            </div>
          )}
          <div>
            <div className="apex-brand-name">{config.branding.firmName}</div>
            <div className="apex-brand-tagline">{config.branding.tagline}</div>
          </div>
        </div>

        {activeNavLinks.length > 0 ? (
          <nav className="apex-nav">
            {activeNavLinks.map((link, idx) => {
              const safeUrl = sanitizeLink(link.url, "#");
              const attrs = getLinkAttributes(safeUrl);
              const isServices = link.label.toLowerCase().includes("service");
              if (isServices) {
                return (
                  <div
                    key={idx}
                    className="apex-nav-services-wrapper"
                    style={{ position: "relative", display: "inline-block" }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <a
                      href={safeUrl}
                      {...attrs}
                      className="apex-nav-link"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsServicesOpen((prev) => !prev);
                      }}
                      style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}
                    >
                      {link.label}
                      <ChevronDown
                        size={12}
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
                      variant="corporate"
                      megaMenu={config.header.megaMenu}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                  </div>
                );
              }
              return (
                <a key={idx} href={safeUrl} {...attrs} className="apex-nav-link">
                  {link.label}
                </a>
              );
            })}
          </nav>
        ) : (
          <nav className="apex-nav">
            <a href="#services" className="apex-nav-link">Practice Areas</a>
            <div
              className="apex-nav-services-wrapper"
              style={{ position: "relative", display: "inline-block" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href="#services"
                className="apex-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  setIsServicesOpen((prev) => !prev);
                }}
                style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}
              >
                Services
                <ChevronDown
                  size={12}
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
                variant="corporate"
                megaMenu={config.header.megaMenu}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </div>
            <a href="#contact" className="apex-nav-link">Contact</a>
          </nav>
        )}

        <div className="apex-header-actions">
          {config.header.headerCta?.enabled && config.header.headerCta.label && (
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleSelectService(selectedService);
              }}
              className="apex-btn-primary-action"
              style={{
                background: "var(--wb-primary, #0f6e56)",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 12.5,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
              }}
            >
              {config.header.headerCta.label}
            </a>
          )}
          {config.header.showWhatsAppBtn && (
            <a
              href="https://wa.me/910000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="apex-btn-whatsapp"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          )}
          {config.header.showClientPortalBtn && (
            <a href="#portal" className="apex-btn-portal">
              Client Portal <ExternalLink size={12} />
            </a>
          )}
        </div>
      </header>

      {/* 3. Sections dynamically rendered based on order and isVisible */}
      <main style={{ flex: 1 }}>
        {page?.sections
          .filter((s) => s.enabled)
          .sort((a, b) => a.order - b.order)
          .map((sec) => (
            <ApexSectionRouter
              key={sec.id}
              sec={sec}
              config={config}
              selectedService={selectedService}
              onSelectService={handleSelectService}
              formHighlight={formHighlight}
            />
          ))}
      </main>

      {/* 4. Footer */}
      <footer className="apex-footer">
        <div className="apex-footer-top" style={{ display: "grid", gridTemplateColumns: quickLinkGroups.length > 0 ? "2fr 1fr 1fr" : "1fr", gap: 32 }}>
          <div>
            <div style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>
              {config.branding.firmName}
            </div>
            <div style={{ fontSize: 11.5, marginTop: 4, color: "#9ca3af", maxWidth: 360 }}>
              {config.branding.tagline}
            </div>
            {socialLinks.length > 0 && (
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                {socialLinks.map((s, idx) => (
                  <a
                    key={idx}
                    href={sanitizeLink(s.url, "#")}
                    {...getLinkAttributes(sanitizeLink(s.url, "#"))}
                    aria-label={s.platform}
                    style={{
                      color: "#9ca3af",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: "rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <SocialIcon platform={s.platform} size={15} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {quickLinkGroups.map((grp, gIdx) => (
            <div key={gIdx}>
              <div style={{ color: "#ffffff", fontSize: 13, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {grp.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                {grp.links
                  .filter((lnk) => lnk.label && lnk.url)
                  .map((lnk, lIdx) => (
                    <a
                      key={lIdx}
                      href={sanitizeLink(lnk.url, "#")}
                      {...getLinkAttributes(sanitizeLink(lnk.url, "#"))}
                      style={{ color: "#9ca3af", textDecoration: "none" }}
                    >
                      {lnk.label}
                    </a>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {config.footer.icaiDisclaimer && (
          <div className="apex-icai-notice">
            {config.footer.disclaimerText || "Standard Professional Disclaimer: In accordance with the Chartered Accountants Act, 1949 and guidelines issued by the regulatory council, this website is designed solely for providing informational facts about the firm and its areas of practice. It does not constitute an advertisement, personal communication, solicitation, or invitation to offer work."}
          </div>
        )}

        <div className="apex-footer-bottom">
          {config.footer.copyrightText || `© ${new Date().getFullYear()} ${config.branding.firmName}. All rights reserved.`}
        </div>
      </footer>
    </div>
  );
}

function ApexSectionRouter({
  sec,
  config,
  selectedService,
  onSelectService,
  formHighlight,
}: {
  sec: SectionConfig;
  config: WebsiteConfig;
  selectedService?: string;
  onSelectService?: (service: string) => void;
  formHighlight?: boolean;
}) {
  switch (sec.type) {
    case "hero":
      return <ApexHeroSection props={sec.props} />;
    case "services":
      return <ApexServicesSection props={sec.props} onSelectService={onSelectService} />;
    case "tax-calendar":
      return <ApexTaxCalendarSection props={sec.props} />;
    case "calculators":
      return <ApexCalculatorsSection props={sec.props} />;
    case "testimonials":
      return <ApexTestimonialsSection props={sec.props} />;
    case "cta":
      return <ApexCtaSection props={sec.props} />;
    case "contact":
      return (
        <ApexContactSection
          props={sec.props}
          config={config}
          selectedService={selectedService || "Private Limited Company Registration"}
          onSelectService={onSelectService || (() => {})}
          formHighlight={!!formHighlight}
        />
      );
    default:
      return null;
  }
}

function ApexHeroSection({ props }: { props: any }) {
  const primaryHref = sanitizeLink(props.primaryCtaLink, "#services");
  const secondaryHref = sanitizeLink(props.secondaryCtaLink, "#contact");
  const primaryAttrs = getLinkAttributes(primaryHref);
  const secondaryAttrs = getLinkAttributes(secondaryHref);
  const heroImage = props.heroImageUrl || props.imageUrl;

  return (
    <section
      className="apex-hero"
      style={
        heroImage
          ? {
              backgroundImage: `linear-gradient(rgba(10, 25, 20, 0.78), rgba(10, 25, 20, 0.88)), url("${heroImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              color: "#ffffff",
              padding: "96px 32px",
            }
          : {}
      }
    >
      <div className="apex-hero-inner" style={{ maxWidth: 900, margin: "0 auto" }}>
        <span
          className="apex-hero-badge"
          style={
            heroImage
              ? {
                  background: "rgba(255, 255, 255, 0.16)",
                  color: "#ffffff",
                  backdropFilter: "blur(4px)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                }
              : {}
          }
        >
          Chartered Accountancy Practice
        </span>
        <h1
          className="apex-hero-title"
          style={
            heroImage
              ? {
                  color: "#ffffff",
                  fontSize: 42,
                  lineHeight: 1.2,
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
                  marginBottom: 18,
                }
              : {}
          }
        >
          {props.headline || "Comprehensive Tax, Statutory Audit & Corporate Secretarial Services"}
        </h1>
        <p
          className="apex-hero-sub"
          style={
            heroImage
              ? {
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: 17,
                  lineHeight: 1.6,
                  maxWidth: 720,
                  margin: "0 auto 28px",
                  textShadow: "0 1px 6px rgba(0, 0, 0, 0.3)",
                }
              : {}
          }
        >
          {props.subheadline || "Delivering structured statutory assurance, GST compliance, and regulatory governance for enterprises across India."}
        </p>
        <div className="apex-hero-ctas" style={{ justifyContent: "center" }}>
          <a
            href={primaryHref}
            {...primaryAttrs}
            className="apex-cta-primary"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: heroImage ? "var(--wb-primary, #0f6e56)" : undefined,
              boxShadow: heroImage ? "0 4px 14px rgba(0, 0, 0, 0.3)" : undefined,
            }}
          >
            {props.primaryCtaText || "Schedule Consultation"} <ArrowRight size={14} />
          </a>
          <a
            href={secondaryHref}
            {...secondaryAttrs}
            className="apex-cta-secondary"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              background: heroImage ? "rgba(255, 255, 255, 0.15)" : undefined,
              color: heroImage ? "#ffffff" : undefined,
              border: heroImage ? "1px solid rgba(255, 255, 255, 0.3)" : undefined,
              backdropFilter: heroImage ? "blur(4px)" : undefined,
            }}
          >
            {props.secondaryCtaText || "Review Practice Areas"}
          </a>
        </div>
      </div>
    </section>
  );
}

function ApexServicesSection({
  props,
  onSelectService,
}: {
  props: any;
  onSelectService?: (service: string) => void;
}) {
  const visibleIds = Array.isArray(props.visibleServiceIds) ? props.visibleServiceIds : null;
  const filteredServices = visibleIds !== null && visibleIds.length > 0
    ? SHARED_SERVICES.filter((s) => visibleIds.includes(s.id))
    : visibleIds !== null && visibleIds.length === 0
    ? []
    : SHARED_SERVICES;

  return (
    <>
      <section className="apex-services" id="services">
        <div className="apex-sec-header">
          <h2 className="apex-sec-title">{props.title || "Areas of Practice"}</h2>
          <p className="apex-sec-sub">{props.subtitle || "Statutory compliance and financial advisory services structured under professional standards"}</p>
        </div>
        {filteredServices.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 16px", color: "#6b7280", fontSize: 13, fontStyle: "italic" }}>
            No services selected in builder settings.
          </div>
        ) : (
          <div className="apex-services-grid">
            {filteredServices.map((srv) => (
              <div key={srv.id} className="apex-service-card">
                <div className="apex-service-icon">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="apex-service-title">{srv.title}</h3>
                <p className="apex-service-desc">{srv.description}</p>
                <ul className="apex-scope-list">
                  {srv.scopeList.map((item, i) => (
                    <li key={i} className="apex-scope-item">
                      <CheckCircle2 size={12} style={{ color: "var(--wb-primary, #0f6e56)" }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Specialized Advisory Desks / Practice Visual Gallery */}
      <PracticeGallerySection
        tiles={props.galleryTiles}
        title={props.galleryTitle || "Specialized Advisory Desks"}
        tagline={props.galleryTagline || "FULL PRACTICE SPECTRUM"}
        subtitle={props.gallerySubtitle || "Built for modern startups, established enterprises, and global investors entering India."}
        variant="apex"
        onSelectService={onSelectService}
      />
    </>
  );
}

function ApexTaxCalendarSection({ props }: { props: any }) {
  return (
    <section className="apex-calendar" id="tax-calendar">
      <div className="apex-calendar-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 className="apex-sec-title" style={{ textAlign: "left" }}>
              {props.title || "Statutory Due Date Calendar"}
            </h2>
            <p className="apex-sec-sub" style={{ textAlign: "left" }}>
              {props.subtitle || "Upcoming filing milestones across Income Tax, GST, and MCA statutory authorities"}
            </p>
          </div>
          <span style={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>FY 2026-27 Reference</span>
        </div>
        <div className="apex-calendar-grid">
          {SHARED_TAX_DATES.map((d, i) => (
            <div key={i} className="apex-calendar-card">
              <div className="apex-date-chip">
                {d.date.split(" ").map((part, idx) => (
                  <div key={idx}>{part}</div>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{d.title}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{d.form}</div>
                <div style={{ fontSize: 9.5, color: "var(--wb-primary, #0f6e56)", fontWeight: 700, marginTop: 4 }}>
                  Authority: {d.authority}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 11, color: "#6b7280", fontStyle: "italic", textAlign: "right" }}>
          * Sample statutory due dates for reference. Please verify specific notification extensions on the respective official government portal.
        </div>
      </div>
    </section>
  );
}

function ApexCalculatorsSection({ props }: { props: any }) {
  return (
    <section className="apex-calculators" id="calculators">
      <div className="apex-sec-header">
        <h2 className="apex-sec-title">{props.title || "Calculators (coming soon)"}</h2>
        <p className="apex-sec-sub">{props.subtitle || "Interactive preliminary estimation tools for statutory and financial planning (in development)"}</p>
      </div>
      <div className="apex-calc-grid">
        {[
          { title: "GST Rate & Liability Estimator", desc: "Compute CGST, SGST, and IGST breakdowns for goods and professional services." },
          { title: "Income Tax Slabs (Old vs New)", desc: "Comparative assessment of tax liabilities under Section 115BAC." },
          { title: "Advance Tax Installment Schedule", desc: "Quarterly estimation based on projected business turnovers." },
        ].map((c, i) => (
          <div key={i} className="apex-calc-card">
            <div>
              <Calculator size={22} style={{ color: "var(--wb-primary, #0f6e56)", marginBottom: 12 }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px" }}>{c.title}</h3>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 16px" }}>{c.desc}</p>
            </div>
            <button
              style={{
                background: "transparent",
                border: "1px solid rgba(0,0,0,0.12)",
                padding: "8px 12px",
                borderRadius: 5,
                fontSize: 11.5,
                fontWeight: 600,
                color: "var(--wb-primary, #0f6e56)",
                cursor: "not-allowed",
                opacity: 0.8,
              }}
              disabled
            >
              Coming Soon
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ApexTestimonialsSection({ props }: { props: any }) {
  return (
    <section className="apex-testimonials" id="about">
      <div className="apex-sec-header">
        <h2 className="apex-sec-title">{props.title || "Engagement Experience"}</h2>
        <p className="apex-sec-sub">{props.subtitle || "Factual feedback on professional services rendered across sectors"}</p>
      </div>
      <div className="apex-reviews-grid">
        {SHARED_CLIENT_REVIEWS.map((r) => (
          <div key={r.id} className="apex-review-card">
            <p style={{ fontSize: 12.5, color: "#374151", fontStyle: "italic", lineHeight: 1.6, margin: "0 0 18px" }}>
              "{r.statement}"
            </p>
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Client Initials: {r.clientInitials}</div>
              <div style={{ fontSize: 10.5, color: "#6b7280", marginTop: 2 }}>{r.businessSector} · {r.location}</div>
              <div style={{ fontSize: 10, color: "var(--wb-primary, #0f6e56)", fontWeight: 600, marginTop: 4 }}>
                Scope: {r.engagementType}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ApexCtaSection({ props }: { props: any }) {
  const btnHref = sanitizeLink(props.buttonLink, "#contact");
  const btnAttrs = getLinkAttributes(btnHref);

  return (
    <section style={{ padding: "48px 32px", background: "var(--wb-primary, #0f6e56)", color: "#ffffff", textAlign: "center" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 12px" }}>
          {props.headline || "Require Professional Statutory & Tax Advisory?"}
        </h2>
        <p style={{ fontSize: 13, opacity: 0.9, margin: "0 0 24px", lineHeight: 1.6 }}>
          Reach out to schedule an introductory consultation with our chartered accountancy team.
        </p>
        <a
          href={btnHref}
          {...btnAttrs}
          style={{
            background: "#ffffff",
            color: "var(--wb-primary, #0f6e56)",
            border: "none",
            padding: "12px 24px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {props.buttonText || "Contact Advisory Desk"}
        </a>
      </div>
    </section>
  );
}

function ApexContactSection({
  props,
  config,
  selectedService,
  onSelectService,
  formHighlight,
}: {
  props: any;
  config?: WebsiteConfig;
  selectedService: string;
  onSelectService: (service: string) => void;
  formHighlight: boolean;
}) {
  return (
    <section className="apex-contact" id="contact" style={{ padding: "64px 32px" }}>
      <div className="apex-sec-header">
        <h2 className="apex-sec-title">{props?.title || "Contact & Consultation Desk"}</h2>
        <p className="apex-sec-sub">{props?.subtitle || "Official communication channels and statutory consultation scheduling"}</p>
      </div>
      <div
        className="apex-contact-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: 32,
          alignItems: "start",
          maxWidth: 1160,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="apex-contact-info">
            <div className="apex-contact-item">
              <MapPin size={18} style={{ color: "var(--wb-primary, #0f6e56)", flexShrink: 0 }} />
              <div>
                <strong>Principal Office:</strong>
                <div>{config?.branding?.address || SHARED_FIRM_CONTACT.primaryOffice}</div>
              </div>
            </div>
            <div className="apex-contact-item">
              <Mail size={18} style={{ color: "var(--wb-primary, #0f6e56)", flexShrink: 0 }} />
              <div>
                <strong>Email:</strong>
                <div>{config?.branding?.email || SHARED_FIRM_CONTACT.email}</div>
              </div>
            </div>
            <div className="apex-contact-item">
              <PhoneCall size={18} style={{ color: "var(--wb-primary, #0f6e56)", flexShrink: 0 }} />
              <div>
                <strong>Telephone:</strong>
                <div>{config?.branding?.phone || SHARED_FIRM_CONTACT.phone}</div>
              </div>
            </div>
          </div>

          <div style={{ padding: 22, background: "var(--wb-surface, #f9fafb)", borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)" }}>
            <h3 style={{ fontSize: 13.5, fontWeight: 700, margin: "0 0 8px", color: "var(--wb-text, #111827)" }}>Inquiry Protocol</h3>
            <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5, margin: 0 }}>
              Official communication hours: {config?.branding?.workingHours || SHARED_FIRM_CONTACT.workingHours}. Meetings at the firm's office require prior scheduling in accordance with compliance desk protocols.
            </p>
          </div>
        </div>

        <div>
          <TemplateConsultationForm
            selectedService={selectedService}
            onServiceChange={onSelectService}
            variant="corporate"
            megaMenu={config?.header?.megaMenu}
            sourceTemplate="Apex Corporate"
            isHighlighted={formHighlight}
          />
        </div>
      </div>
    </section>
  );
}
