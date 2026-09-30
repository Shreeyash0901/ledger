import React, { useState, useRef } from "react";
import { WebsiteConfig, SectionConfig, sanitizeLink, getLinkAttributes, isSafeLink } from "website-core";
import {
  ExternalLink,
  MessageCircle,
  ArrowRight,
  Calculator,
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

export interface MinimalStudioProps {
  config: WebsiteConfig;
}

export function MinimalStudioTemplate({ config }: MinimalStudioProps) {
  const page = config.pages[0];
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Corporate Tax Return (ITR-6) Filing");
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

  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
    setIsServicesOpen(false);
    setFormHighlight(true);
    setTimeout(() => setFormHighlight(false), 1500);

    const contactEl = document.getElementById("contact");
    if (contactEl && typeof contactEl.scrollIntoView === "function") {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeNavLinks = (config.header.navLinks || []).filter((l) => l.enabled !== false && l.label && l.url);
  const quickLinkGroups = (config.footer.quickLinkGroups || []).filter(
    (g) => g.title && g.links && g.links.some((l) => l.label && l.url)
  );
  const socialLinks = (config.footer.socialLinks || []).filter((s) => s.platform && s.url && isSafeLink(s.url));

  return (
    <div className="minimal-container">
      {/* Optional Topbar */}
      {config.header.showTopInfoBar !== false && (
        <div style={{ borderBottom: "1px solid #e4e4e7", padding: "6px 20px", fontSize: 11, color: "#71717a", display: "flex", justifyContent: "space-between" }}>
          <span>Chartered Accountancy & Advisory</span>
          <span>{config.branding.registrationNumber || SHARED_FIRM_CONTACT.icaiRegistration}</span>
        </div>
      )}

      {/* 1. Understated Minimal Header */}
      <header className="minimal-header">
        <div className="minimal-brand">
          {config.branding.logoUrl ? (
            <img
              src={config.branding.logoUrl}
              alt={config.branding.firmName}
              style={{ maxHeight: 32, maxWidth: 140, objectFit: "contain", borderRadius: 2 }}
            />
          ) : (
            <span className="minimal-brand-name">{config.branding.firmName}</span>
          )}
          <span className="minimal-brand-reg">
            {config.branding.registrationNumber || SHARED_FIRM_CONTACT.icaiRegistration}
          </span>
        </div>

        {activeNavLinks.length > 0 ? (
          <nav className="minimal-nav">
            {activeNavLinks.map((link, idx) => {
              const safeUrl = sanitizeLink(link.url, "#");
              const attrs = getLinkAttributes(safeUrl);
              const isServices = link.label.toLowerCase().includes("service");
              if (isServices) {
                return (
                  <div
                    key={idx}
                    className="minimal-nav-services-wrapper"
                    style={{ position: "relative", display: "inline-block" }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <a
                      href={safeUrl}
                      {...attrs}
                      className="minimal-nav-link"
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
                      variant="minimal"
                      megaMenu={config.header.megaMenu}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                  </div>
                );
              }
              return (
                <a key={idx} href={safeUrl} {...attrs} className="minimal-nav-link">
                  {link.label}
                </a>
              );
            })}
          </nav>
        ) : (
          <nav className="minimal-nav">
            <div
              className="minimal-nav-services-wrapper"
              style={{ position: "relative", display: "inline-block" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href="#services"
                className="minimal-nav-link"
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
                variant="minimal"
                megaMenu={config.header.megaMenu}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </div>
            <a href="#services" className="minimal-nav-link">Scope</a>
            <a href="#contact" className="minimal-nav-link">Communication</a>
          </nav>
        )}

        <div className="minimal-header-actions">
          {config.header.headerCta?.enabled && config.header.headerCta.label && (
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleSelectService(selectedService);
              }}
              className="minimal-btn-portal"
              style={{
                background: "var(--wb-primary, #18181b)",
                color: "#ffffff",
                borderColor: "var(--wb-primary, #18181b)",
                textDecoration: "none",
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
              className="minimal-nav-link"
              style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 600 }}
            >
              <MessageCircle size={13} /> Chat
            </a>
          )}
          {config.header.showClientPortalBtn && (
            <a href="#portal" className="minimal-btn-portal">
              Client Portal ↗
            </a>
          )}
        </div>
      </header>

      {/* 2. Single Narrow Column Content Wrapper */}
      <main className="minimal-content-wrapper">
        {page?.sections
          .filter((s) => s.enabled)
          .sort((a, b) => a.order - b.order)
          .map((sec) => (
            <MinimalSectionRouter
              key={sec.id}
              sec={sec}
              config={config}
              selectedService={selectedService}
              onSelectService={handleSelectService}
              formHighlight={formHighlight}
            />
          ))}
      </main>

      {/* 3. Understated Minimal Footer */}
      <footer className="minimal-footer">
        <div className="minimal-footer-inner">
          <div className="minimal-footer-meta" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{config.branding.firmName}</div>
              <div style={{ fontSize: 11.5, color: "#71717a", marginTop: 2 }}>{config.branding.tagline}</div>
              <div style={{ fontSize: 11, color: "#a1a1aa", marginTop: 4 }}>
                {config.branding.phone || SHARED_FIRM_CONTACT.phone} · {config.branding.email || SHARED_FIRM_CONTACT.email}
              </div>

              {socialLinks.length > 0 && (
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  {socialLinks.map((s, idx) => (
                    <a
                      key={idx}
                      href={sanitizeLink(s.url, "#")}
                      {...getLinkAttributes(sanitizeLink(s.url, "#"))}
                      aria-label={s.platform}
                      style={{
                        color: "#71717a",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        borderRadius: 4,
                        border: "1px solid #e4e4e7",
                      }}
                    >
                      <SocialIcon platform={s.platform} size={13} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {quickLinkGroups.map((grp, gIdx) => (
              <div key={gIdx} style={{ fontSize: 11.5 }}>
                <div style={{ fontWeight: 600, color: "#18181b", marginBottom: 8 }}>{grp.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {grp.links
                    .filter((lnk) => lnk.label && lnk.url)
                    .map((lnk, lIdx) => (
                      <a
                        key={lIdx}
                        href={sanitizeLink(lnk.url, "#")}
                        {...getLinkAttributes(sanitizeLink(lnk.url, "#"))}
                        style={{ color: "#71717a", textDecoration: "none" }}
                      >
                        {lnk.label}
                      </a>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {config.footer.icaiDisclaimer && (
            <div className="minimal-disclaimer">
              {config.footer.disclaimerText || "Standard Professional Disclaimer: In accordance with the Chartered Accountants Act, 1949 and guidelines issued by the regulatory council, this website is designed solely for providing informational facts about the firm and its areas of practice. It does not constitute an advertisement, personal communication, solicitation, or invitation to offer work."}
            </div>
          )}

          <div style={{ fontSize: 11, color: "#a1a1aa", textAlign: "center", marginTop: 16 }}>
            {config.footer.copyrightText || `© ${new Date().getFullYear()} ${config.branding.firmName}. All rights reserved.`}
          </div>
        </div>
      </footer>
    </div>
  );
}

function MinimalSectionRouter({
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
      return <MinimalHeroSection props={sec.props} config={config} />;
    case "services":
      return <MinimalServicesSection props={sec.props} onSelectService={onSelectService} />;
    case "tax-calendar":
      return <MinimalCalendarSection props={sec.props} />;
    case "calculators":
      return <MinimalCalculatorsSection props={sec.props} />;
    case "testimonials":
      return <MinimalReviewsSection props={sec.props} />;
    case "cta":
      return <MinimalCtaSection props={sec.props} />;
    case "contact":
      return (
        <MinimalContactSection
          config={config}
          selectedService={selectedService}
          onSelectService={onSelectService}
          formHighlight={formHighlight}
        />
      );
    default:
      return null;
  }
}

function MinimalHeroSection({ props, config }: { props: any; config: WebsiteConfig }) {
  const primaryHref = sanitizeLink(props.primaryCtaLink, "#services");
  const secondaryHref = sanitizeLink(props.secondaryCtaLink, "#contact");
  const primaryAttrs = getLinkAttributes(primaryHref);
  const secondaryAttrs = getLinkAttributes(secondaryHref);
  const heroImage = props.heroImageUrl || props.imageUrl;

  return (
    <section
      className="minimal-hero"
      style={
        heroImage
          ? {
              backgroundImage: `linear-gradient(rgba(24, 24, 27, 0.82), rgba(24, 24, 27, 0.92)), url("${heroImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              color: "#ffffff",
              padding: "96px 32px",
            }
          : {}
      }
    >
      <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
        <div
          className="minimal-hero-kicker"
          style={heroImage ? { color: "#a1a1aa" } : {}}
        >
          {config.branding.tagline || "Chartered Accountancy & Advisory"}
        </div>
        <h1
          className="minimal-hero-title"
          style={
            heroImage
              ? {
                  color: "#ffffff",
                  fontSize: 40,
                  lineHeight: 1.25,
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  marginBottom: 18,
                }
              : {}
          }
        >
          {props.headline || "Statutory audit, tax structuring & business advisory."}
        </h1>
        <p
          className="minimal-hero-sub"
          style={
            heroImage
              ? {
                  color: "rgba(255, 255, 255, 0.88)",
                  fontSize: 17,
                  maxWidth: 700,
                  margin: "0 auto 28px",
                }
              : {}
          }
        >
          {props.subheadline || "Independent professional practice supporting enterprises across corporate tax, GST compliance, cross-border structuring and statutory reporting."}
        </p>
        <div className="minimal-hero-ctas" style={{ justifyContent: "center" }}>
          <a
            href={primaryHref}
            {...primaryAttrs}
            className="minimal-cta-primary"
            style={{
              textDecoration: "none",
              display: "inline-block",
              background: heroImage ? "#ffffff" : undefined,
              color: heroImage ? "#18181b" : undefined,
              boxShadow: heroImage ? "0 4px 14px rgba(0,0,0,0.3)" : undefined,
            }}
          >
            {props.primaryCtaText || "Explore Scope"}
          </a>
          <a
            href={secondaryHref}
            {...secondaryAttrs}
            className="minimal-cta-secondary"
            style={{
              textDecoration: "none",
              display: "inline-block",
              background: heroImage ? "rgba(255, 255, 255, 0.12)" : undefined,
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

function MinimalServicesSection({
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
      <section id="services">
        <div className="minimal-sec-label">01 / Practice Areas</div>
        <h2 className="minimal-sec-heading">{props.title || "Advisory Scopes & Services"}</h2>
        {props.subtitle && (
          <p style={{ fontSize: 13, color: "#71717a", margin: "-12px 0 20px" }}>{props.subtitle}</p>
        )}
        {filteredServices.length === 0 ? (
          <div style={{ padding: "24px 0", color: "#71717a", fontSize: 13, fontStyle: "italic" }}>
            No services selected in builder settings.
          </div>
        ) : (
          <div className="minimal-services-list">
            {filteredServices.map((srv, idx) => (
              <div key={srv.id} className="minimal-service-item">
                <span className="minimal-service-num">0{idx + 1}</span>
                <div className="minimal-service-content">
                  <h3 className="minimal-service-title">{srv.title}</h3>
                  <p className="minimal-service-desc">{srv.description}</p>
                  <div className="minimal-service-scopes">
                    {srv.scopeList.map((scope, sIdx) => (
                      <span key={sIdx} className="minimal-scope-badge">
                        {scope}
                      </span>
                    ))}
                  </div>
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
        tagline={props.galleryTagline || "STUDIO PRACTICE SPECTRUM"}
        subtitle={props.gallerySubtitle || "Bespoke corporate incorporation, assurance, and tax advisory desks."}
        variant="minimal"
        onSelectService={onSelectService}
      />
    </>
  );
}

function MinimalCalendarSection({ props }: { props: any }) {
  return (
    <section id="tax-calendar">
      <div className="minimal-sec-label">02 / Statutory Milestones</div>
      <h2 className="minimal-sec-heading">{props.title || "Upcoming Due Dates"}</h2>
      <table className="minimal-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Filing Title</th>
            <th>Form</th>
            <th>Authority</th>
          </tr>
        </thead>
        <tbody>
          {SHARED_TAX_DATES.map((d, idx) => (
            <tr key={idx}>
              <td style={{ fontFamily: "monospace", fontWeight: 700, whiteSpace: "nowrap" }}>{d.date}</td>
              <td style={{ fontWeight: 600 }}>{d.title}</td>
              <td style={{ color: "#71717a", fontFamily: "monospace", fontSize: 12 }}>{d.form}</td>
              <td style={{ color: "#71717a", fontSize: 12 }}>{d.authority}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 14, fontSize: 11, color: "#71717a", fontStyle: "italic" }}>
        * Sample statutory due dates for reference. Please verify specific extensions on official portals.
      </div>
    </section>
  );
}

function MinimalCalculatorsSection({ props }: { props: any }) {
  return (
    <section id="calculators">
      <div className="minimal-sec-label">03 / Tools & Estimators</div>
      <h2 className="minimal-sec-heading">{props.title || "Calculators (coming soon)"}</h2>
      <div className="minimal-calc-grid">
        {[
          { title: "GST Rate & ITC Breakdown", desc: "Interactive computation tool for output liabilities." },
          { title: "Old vs New Slab Analysis", desc: "Comparative assessment under Section 115BAC." },
          { title: "Advance Tax Calendar", desc: "Turnover-based quarterly payment estimation." },
        ].map((c, idx) => (
          <div key={idx} className="minimal-calc-card">
            <div>
              <Calculator size={18} style={{ color: "#71717a", marginBottom: 8 }} />
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 6px" }}>{c.title}</h3>
              <p style={{ fontSize: 12, color: "#71717a", margin: "0 0 16px", lineHeight: 1.5 }}>{c.desc}</p>
            </div>
            <button
              style={{
                background: "transparent",
                border: "1px solid #e4e4e7",
                padding: "6px 10px",
                fontSize: 11,
                fontFamily: "monospace",
                cursor: "not-allowed",
                opacity: 0.6,
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

function MinimalReviewsSection({ props }: { props: any }) {
  return (
    <section id="about">
      <div className="minimal-sec-label">04 / Engagement Feedback</div>
      <h2 className="minimal-sec-heading">{props.title || "Factual Client Commentary"}</h2>
      <div className="minimal-quotes">
        {SHARED_CLIENT_REVIEWS.map((r) => (
          <div key={r.id} className="minimal-quote-block">
            <p className="minimal-quote-text">"{r.statement}"</p>
            <div className="minimal-quote-cite">
              Client {r.clientInitials} · {r.businessSector} ({r.location})
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MinimalCtaSection({ props }: { props: any }) {
  const btnHref = sanitizeLink(props.buttonLink, "#contact");
  const btnAttrs = getLinkAttributes(btnHref);

  return (
    <section style={{ padding: "40px 0", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
        {props.headline || "Formal Practice Consultations"}
      </h2>
      <p style={{ fontSize: 14, color: "#52525b", margin: "0 0 20px" }}>
        Direct communications regarding statutory audits, taxation advisory, and company formation inquiries.
      </p>
      <a
        href={btnHref}
        {...btnAttrs}
        className="minimal-cta-primary"
        style={{ textDecoration: "none", display: "inline-block" }}
      >
        {props.buttonText || "Contact Practice Desk"}
      </a>
    </section>
  );
}

function MinimalContactSection({
  config,
  selectedService,
  onSelectService,
  formHighlight,
}: {
  config: WebsiteConfig;
  selectedService: string;
  onSelectService: (serviceName: string) => void;
  formHighlight: boolean;
}) {
  return (
    <section id="contact" style={{ padding: "48px 0", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
      <div className="minimal-sec-label">05 / Communication & Inquiries</div>
      <h2 className="minimal-sec-heading" style={{ marginBottom: 8 }}>Practice Desk</h2>
      <p style={{ fontSize: 13.5, color: "#71717a", margin: "0 0 32px", maxWidth: 560 }}>
        Statutory correspondence, taxation advisory and formal corporate filings. Choose your practice domain to initiate contact.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 40, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, fontSize: 13 }}>
          <div>
            <strong style={{ display: "block", fontSize: 11, fontFamily: "monospace", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              REGISTERED OFFICE
            </strong>
            <span style={{ color: "#27272a", lineHeight: 1.6 }}>{config.branding.address || SHARED_FIRM_CONTACT.primaryOffice}</span>
          </div>
          <div>
            <strong style={{ display: "block", fontSize: 11, fontFamily: "monospace", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              DIRECT COMMUNICATION
            </strong>
            <div style={{ color: "#27272a", display: "flex", flexDirection: "column", gap: 4 }}>
              <span>Tel: {config.branding.phone || SHARED_FIRM_CONTACT.phone}</span>
              <span>Email: {config.branding.email || SHARED_FIRM_CONTACT.email}</span>
            </div>
          </div>
          <div>
            <strong style={{ display: "block", fontSize: 11, fontFamily: "monospace", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              REGISTRATION
            </strong>
            <span style={{ color: "#27272a" }}>
              ICAI FRN: {config.branding.registrationNumber || SHARED_FIRM_CONTACT.icaiRegistration}
            </span>
          </div>
          <div>
            <strong style={{ display: "block", fontSize: 11, fontFamily: "monospace", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              DESK HOURS
            </strong>
            <span style={{ color: "#27272a" }}>Monday – Friday, 9:30 AM – 6:30 PM IST</span>
          </div>
        </div>

        <div>
          <TemplateConsultationForm
            selectedService={selectedService}
            onServiceChange={onSelectService}
            formHighlight={formHighlight}
            variant="minimal"
            megaMenu={config.header.megaMenu}
            formTitle="Initiate Practice Inquiry"
            formSubtitle="Select your service area. Our senior compliance associates will review and reach out directly."
          />
        </div>
      </div>
    </section>
  );
}
