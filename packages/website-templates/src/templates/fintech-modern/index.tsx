import React, { useState, useRef } from "react";
import { WebsiteConfig, SectionConfig, sanitizeLink, getLinkAttributes, isSafeLink } from "website-core";
import {
  Zap,
  TrendingUp,
  ShieldCheck,
  Calendar,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  Calculator,
  Activity,
  CheckCircle2,
  Lock,
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

export interface FinTechModernProps {
  config: WebsiteConfig;
}

export function FintechModernTemplate({ config }: FinTechModernProps) {
  const page = config.pages[0];
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("GST Registration & Return Filing");
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
    <div className="fintech-container">
      {/* Optional Topbar */}
      {config.header.showTopInfoBar !== false && (
        <div style={{ background: "rgba(15, 23, 42, 0.95)", color: "#94a3b8", fontSize: 11, padding: "6px 32px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span>Statutory Compliance & Financial Intelligence Desk</span>
          <div style={{ display: "flex", gap: 16 }}>
            <span>{config.branding.phone || SHARED_FIRM_CONTACT.phone}</span>
            <span>{config.branding.registrationNumber || SHARED_FIRM_CONTACT.icaiRegistration}</span>
          </div>
        </div>
      )}

      {/* 1. Glass Header */}
      <header className="fintech-header">
        <div className="fintech-brand">
          {config.branding.logoUrl ? (
            <img
              src={config.branding.logoUrl}
              alt={config.branding.firmName}
              style={{ maxHeight: 36, maxWidth: 160, objectFit: "contain", borderRadius: 4 }}
            />
          ) : (
            <div className="fintech-logo-icon">
              <Zap size={22} />
            </div>
          )}
          <div>
            <div className="fintech-brand-name">{config.branding.firmName}</div>
            <div className="fintech-brand-tagline">{config.branding.tagline}</div>
          </div>
        </div>

        {activeNavLinks.length > 0 ? (
          <nav className="fintech-nav">
            {activeNavLinks.map((link, idx) => {
              const safeUrl = sanitizeLink(link.url, "#");
              const attrs = getLinkAttributes(safeUrl);
              const isServices = link.label.toLowerCase().includes("service");
              if (isServices) {
                return (
                  <div
                    key={idx}
                    className="fintech-nav-services-wrapper"
                    style={{ position: "relative", display: "inline-block" }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <a
                      href={safeUrl}
                      {...attrs}
                      className="fintech-nav-link"
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
                      variant="fintech"
                      megaMenu={config.header.megaMenu}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                  </div>
                );
              }
              return (
                <a key={idx} href={safeUrl} {...attrs} className="fintech-nav-link">
                  {link.label}
                </a>
              );
            })}
          </nav>
        ) : (
          <nav className="fintech-nav">
            <a href="#services" className="fintech-nav-link">Solutions</a>
            <div
              className="fintech-nav-services-wrapper"
              style={{ position: "relative", display: "inline-block" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href="#services"
                className="fintech-nav-link"
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
                variant="fintech"
                megaMenu={config.header.megaMenu}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </div>
            <a href="#contact" className="fintech-nav-link">Contact</a>
          </nav>
        )}

        <div className="fintech-header-actions">
          {config.header.headerCta?.enabled && config.header.headerCta.label && (
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleSelectService(selectedService);
              }}
              style={{
                background: "var(--wb-accent, #1d9e75)",
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
              className="fintech-btn-whatsapp"
            >
              <MessageCircle size={14} /> Quick Chat
            </a>
          )}
          {config.header.showClientPortalBtn && (
            <a href="#portal" className="fintech-btn-portal">
              Client Portal <ExternalLink size={12} />
            </a>
          )}
        </div>
      </header>

      {/* 2. Dynamic Sections Router */}
      <main style={{ flex: 1 }}>
        {page?.sections
          .filter((s) => s.enabled)
          .sort((a, b) => a.order - b.order)
          .map((sec) => (
            <FintechSectionRouter
              key={sec.id}
              sec={sec}
              config={config}
              selectedService={selectedService}
              onSelectService={handleSelectService}
              formHighlight={formHighlight}
            />
          ))}
      </main>

      {/* 3. Modern Dark Footer */}
      <footer className="fintech-footer">
        <div className="fintech-footer-top" style={{ display: "grid", gridTemplateColumns: quickLinkGroups.length > 0 ? "2fr 1fr 1fr" : "1fr", gap: 32 }}>
          <div>
            <div style={{ color: "#fff", fontSize: 17, fontWeight: 800 }}>
              {config.branding.firmName}
            </div>
            <div style={{ fontSize: 12, marginTop: 4, color: "#94a3b8", maxWidth: 360 }}>
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
                      color: "#94a3b8",
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
                      style={{ color: "#94a3b8", textDecoration: "none" }}
                    >
                      {lnk.label}
                    </a>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {config.footer.icaiDisclaimer && (
          <div className="fintech-disclaimer">
            {config.footer.disclaimerText || "Standard Professional Disclaimer: In accordance with the Chartered Accountants Act, 1949 and guidelines issued by the regulatory council, this website is designed solely for providing informational facts about the firm and its areas of practice. It does not constitute an advertisement, personal communication, solicitation, or invitation to offer work."}
          </div>
        )}

        <div className="fintech-footer-bottom">
          {config.footer.copyrightText || `© ${new Date().getFullYear()} ${config.branding.firmName}. All rights reserved.`}
        </div>
      </footer>
    </div>
  );
}

function FintechSectionRouter({
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
      return <FintechSplitHero props={sec.props} config={config} />;
    case "services":
      return <FintechServicesSection props={sec.props} onSelectService={onSelectService} />;
    case "tax-calendar":
      return <FintechCalendarSection props={sec.props} />;
    case "calculators":
      return <FintechCalculatorsSection props={sec.props} />;
    case "testimonials":
      return <FintechReviewsSection props={sec.props} />;
    case "cta":
      return <FintechStickyCta props={sec.props} />;
    case "contact":
      return (
        <FintechContactSection
          props={sec.props}
          config={config}
          selectedService={selectedService || "GST Registration & Return Filing"}
          onSelectService={onSelectService || (() => {})}
          formHighlight={!!formHighlight}
        />
      );
    default:
      return null;
  }
}

function FintechSplitHero({ props, config }: { props: any; config: WebsiteConfig }) {
  const primaryHref = sanitizeLink(props.primaryCtaLink, "#services");
  const secondaryHref = sanitizeLink(props.secondaryCtaLink, "#contact");
  const primaryAttrs = getLinkAttributes(primaryHref);
  const secondaryAttrs = getLinkAttributes(secondaryHref);

  const heroImage = props.heroImageUrl || props.imageUrl;

  if (heroImage) {
    return (
      <section
        className="fintech-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.92)), url("${heroImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "#ffffff",
          padding: "96px 32px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div
            className="fintech-hero-pill"
            style={{
              background: "rgba(2, 132, 199, 0.2)",
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 18,
            }}
          >
            <Activity size={13} /> Statutory & Advisory Desk
          </div>
          <h1
            className="fintech-hero-title"
            style={{
              color: "#ffffff",
              fontSize: 42,
              lineHeight: 1.2,
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              marginBottom: 18,
            }}
          >
            {props.headline || "Tax, Audit & Corporate Compliance Advisory"}
          </h1>
          <p
            className="fintech-hero-sub"
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: 17,
              maxWidth: 720,
              margin: "0 auto 28px",
            }}
          >
            {props.subheadline || "Direct tax, GST compliance, company formation, and statutory assurance for businesses and startups."}
          </p>
          <div className="fintech-hero-ctas" style={{ justifyContent: "center" }}>
            <a
              href={primaryHref}
              {...primaryAttrs}
              className="fintech-cta-primary"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
              }}
            >
              {props.primaryCtaText || "Explore Practice Areas"} <ArrowRight size={15} />
            </a>
            <a
              href={secondaryHref}
              {...secondaryAttrs}
              className="fintech-cta-secondary"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(4px)",
              }}
            >
              {props.secondaryCtaText || "Calculators (coming soon)"}
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="fintech-hero">
      <div className="fintech-hero-grid">
        {/* Left Copy */}
        <div>
          <div className="fintech-hero-pill">
            <Activity size={13} /> Statutory & Advisory Desk
          </div>
          <h1 className="fintech-hero-title">
            {props.headline || "Tax, Audit & Corporate Compliance Advisory"}
          </h1>
          <p className="fintech-hero-sub">
            {props.subheadline || "Direct tax, GST compliance, company formation, and statutory assurance for businesses and startups."}
          </p>
          <div className="fintech-hero-ctas">
            <a
              href={primaryHref}
              {...primaryAttrs}
              className="fintech-cta-primary"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              {props.primaryCtaText || "Explore Practice Areas"} <ArrowRight size={15} />
            </a>
            <a
              href={secondaryHref}
              {...secondaryAttrs}
              className="fintech-cta-secondary"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            >
              {props.secondaryCtaText || "Calculators (coming soon)"}
            </a>
          </div>
        </div>

        {/* Right Dashboard Mock Card */}
        <div className="fintech-hero-card">
          <div className="fintech-card-header">
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Statutory Milestone Overview</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{config.branding.firmName}</div>
            </div>
            <div className="fintech-stat-pill">
              <ShieldCheck size={13} /> {config.branding.registrationNumber || SHARED_FIRM_CONTACT.icaiRegistration}
            </div>
          </div>

          <div className="fintech-card-rows">
            <div className="fintech-card-row">
              <span style={{ fontWeight: 600 }}>Next Milestone</span>
              <span style={{ color: "#059669", fontWeight: 700 }}>20 OCT · GSTR-3B</span>
            </div>
            <div className="fintech-card-row">
              <span style={{ fontWeight: 600 }}>Direct Tax Schedule</span>
              <span style={{ color: "#0284c7", fontWeight: 700 }}>15 DEC · Advance Tax Q3</span>
            </div>
            <div className="fintech-card-row">
              <span style={{ fontWeight: 600 }}>Core Practice</span>
              <span style={{ color: "#475569", fontWeight: 700 }}>GST · Tax · Audit · MCA</span>
            </div>
          </div>
          <div style={{ padding: "8px 16px 12px", fontSize: 10, color: "#94a3b8", fontStyle: "italic", textAlign: "right" }}>
            * Sample dates for reference. Verify extensions on official portal.
          </div>
        </div>
      </div>
    </section>
  );
}

function FintechServicesSection({
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
      <section className="fintech-services" id="services">
        <div className="fintech-sec-header">
          <h2 className="fintech-sec-title">{props.title || "Specialized Advisory Domains"}</h2>
          <p className="fintech-sec-sub">{props.subtitle || "Structured statutory compliance and advisory services for businesses"}</p>
        </div>
        {filteredServices.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 16px", color: "#64748b", fontSize: 13, fontStyle: "italic" }}>
            No services selected in builder settings.
          </div>
        ) : (
          <div className="fintech-services-grid">
            {filteredServices.map((srv) => (
              <div key={srv.id} className="fintech-service-card">
                <div className="fintech-service-icon">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="fintech-service-title">{srv.title}</h3>
                <p className="fintech-service-desc">{srv.description}</p>
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 14 }}>
                  <span
                    onClick={() => onSelectService && onSelectService(srv.title)}
                    style={{ fontSize: 12, fontWeight: 700, color: "var(--wb-primary, #0284c7)", display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}
                  >
                    Review Scope <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Specialized Advisory Desks / Visual Photo Gallery */}
      <PracticeGallerySection
        tiles={props.galleryTiles}
        title={props.galleryTitle || "Specialized Advisory Desks"}
        tagline={props.galleryTagline || "FINTECH & ADVISORY DESKS"}
        subtitle={props.gallerySubtitle || "High-velocity statutory consulting, capital governance, and tax intelligence."}
        variant="fintech"
        onSelectService={onSelectService}
      />
    </>
  );
}

function FintechCalculatorsSection({ props }: { props: any }) {
  return (
    <section className="fintech-calculators" id="calculators">
      <div className="fintech-sec-header">
        <h2 className="fintech-sec-title">{props.title || "Calculators (coming soon)"}</h2>
        <p className="fintech-sec-sub">{props.subtitle || "Preliminary estimation tools for statutory and financial planning (in development)"}</p>
      </div>
      <div className="fintech-calc-grid">
        {[
          { title: "GST Input Tax Credit & Net Tax", desc: "Interactive computation of output liabilities against eligible ITC credits." },
          { title: "Section 115BAC Regime Comparison", desc: "Detailed tax estimation comparing Old vs New Income Tax slabs." },
          { title: "Startup TDS / TCS Deductions", desc: "Section-wise TDS rate estimator for contractor and vendor payouts." },
        ].map((c, i) => (
          <div key={i} className="fintech-calc-card">
            <div>
              <Calculator size={26} style={{ color: "var(--wb-primary, #0284c7)", marginBottom: 14 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>{c.desc}</p>
            </div>
            <button
              className="fintech-calc-btn"
              style={{ cursor: "not-allowed", opacity: 0.8 }}
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

function FintechCalendarSection({ props }: { props: any }) {
  return (
    <section className="fintech-calendar" id="tax-calendar">
      <div className="fintech-sec-header">
        <h2 className="fintech-sec-title">{props.title || "Statutory Timeline Monitor"}</h2>
        <p className="fintech-sec-sub">{props.subtitle || "Factual due dates for upcoming filing milestones"}</p>
      </div>
      <div className="fintech-calendar-grid">
        {SHARED_TAX_DATES.map((d, i) => (
          <div key={i} className="fintech-cal-card">
            <div className="fintech-cal-date">
              {d.date.split(" ").map((part, idx) => (
                <div key={idx}>{part}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>{d.title}</div>
              <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>{d.form}</div>
              <div style={{ fontSize: 10, color: "var(--wb-primary, #0284c7)", fontWeight: 700, marginTop: 4 }}>
                {d.authority} Compliance
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, fontSize: 11, color: "#64748b", fontStyle: "italic", textAlign: "right", maxWidth: 1200, margin: "14px auto 0" }}>
        * Sample statutory due dates for reference. Please verify specific notification extensions on the respective official government portal.
      </div>
    </section>
  );
}

function FintechReviewsSection({ props }: { props: any }) {
  return (
    <section id="about" style={{ padding: "64px 36px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
      <div className="fintech-sec-header">
        <h2 className="fintech-sec-title">{props.title || "Engagement Feedback"}</h2>
        <p className="fintech-sec-sub">{props.subtitle || "Factual feedback on professional services rendered across sectors"}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
        {SHARED_CLIENT_REVIEWS.map((r) => (
          <div key={r.id} style={{ padding: 24, borderRadius: 14, background: "#f8fafc", border: "1px solid rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <p style={{ fontSize: 13, color: "#334155", fontStyle: "italic", lineHeight: 1.6, margin: "0 0 20px" }}>
              "{r.statement}"
            </p>
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 14 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>Client Initials: {r.clientInitials}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{r.businessSector} · {r.location}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FintechStickyCta({ props }: { props: any }) {
  const btnHref = sanitizeLink(props.buttonLink, "#contact");
  const btnAttrs = getLinkAttributes(btnHref);

  return (
    <section className="fintech-sticky-cta">
      <div className="fintech-sticky-inner">
        <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 12px" }}>
          {props.headline || "Statutory Compliance & Advisory Consultations"}
        </h2>
        <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 24px", lineHeight: 1.6 }}>
          Schedule an introductory meeting to assess statutory audit readiness and tax planning workflows.
        </p>
        <a
          href={btnHref}
          {...btnAttrs}
          style={{
            background: "linear-gradient(135deg, var(--wb-primary, #0284c7), #38bdf8)",
            color: "#ffffff",
            border: "none",
            padding: "13px 28px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 18px rgba(56, 189, 248, 0.3)",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {props.buttonText || "Schedule Consultation"}
        </a>
      </div>
    </section>
  );
}

function FintechContactSection({
  props,
  config,
  selectedService,
  onSelectService,
  formHighlight,
}: {
  props: any;
  config: WebsiteConfig;
  selectedService: string;
  onSelectService: (service: string) => void;
  formHighlight: boolean;
}) {
  return (
    <section style={{ padding: "72px 36px", background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }} id="contact">
      <div className="fintech-sec-header">
        <h2 className="fintech-sec-title">{props?.title || "Contact & Advisory Consultation"}</h2>
        <p className="fintech-sec-sub">{props?.subtitle || "Direct communication channels and compliance advisory scheduling"}</p>
      </div>
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* Left: Office details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: 28, borderRadius: 14, background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 16px", color: "#0f172a" }}>Principal Office & Channels</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 13 }}>
              <div>
                <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#0284c7" }}>OFFICE LOCATION</strong>
                <div style={{ color: "#475569", marginTop: 3 }}>{config.branding.address || SHARED_FIRM_CONTACT.primaryOffice}</div>
              </div>
              <div>
                <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#0284c7" }}>TELEPHONE</strong>
                <div style={{ color: "#475569", marginTop: 3 }}>{config.branding.phone || SHARED_FIRM_CONTACT.phone}</div>
              </div>
              <div>
                <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#0284c7" }}>OFFICIAL EMAIL</strong>
                <div style={{ color: "#475569", marginTop: 3 }}>{config.branding.email || SHARED_FIRM_CONTACT.email}</div>
              </div>
              <div>
                <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#0284c7" }}>DESK PROTOCOL</strong>
                <div style={{ color: "#475569", marginTop: 3 }}>{config.branding.workingHours || SHARED_FIRM_CONTACT.workingHours}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Consultation Form with Service Dropdown */}
        <div>
          <TemplateConsultationForm
            selectedService={selectedService}
            onServiceChange={onSelectService}
            variant="fintech"
            megaMenu={config.header.megaMenu}
            sourceTemplate="Fintech Modern"
            isHighlighted={formHighlight}
          />
        </div>
      </div>
    </section>
  );
}

export { FintechModernTemplate as FinTechModernTemplate };

