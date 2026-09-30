import React, { useState, useRef } from "react";
import { WebsiteConfig, SectionConfig, sanitizeLink, getLinkAttributes, isSafeLink } from "website-core";
import {
  Shield,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  MessageCircle,
  Building,
  Mail,
  PhoneCall,
  MapPin,
  CheckCircle,
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

export interface TrustClassicProps {
  config: WebsiteConfig;
}

export function TrustClassicTemplate({ config }: TrustClassicProps) {
  const page = config.pages[0];
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Statutory Audit under Companies Act");
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
    <div className="trust-container">
      {/* 1. Traditional Topbar */}
      {config.header.showTopInfoBar !== false && (
        <div className="trust-topbar">
          <div className="trust-topbar-left">
            <Clock size={12} />
            <span>Statutory Audit & Direct Taxation Practice</span>
          </div>
          <div className="trust-topbar-right">
            <span>{config.branding.phone || SHARED_FIRM_CONTACT.phone}</span>
            <span>{config.branding.registrationNumber || SHARED_FIRM_CONTACT.icaiRegistration}</span>
          </div>
        </div>
      )}

      {/* 2. Traditional Header */}
      <header className="trust-header">
        <div className="trust-brand">
          {config.branding.logoUrl ? (
            <img
              src={config.branding.logoUrl}
              alt={config.branding.firmName}
              style={{ maxHeight: 38, maxWidth: 160, objectFit: "contain", borderRadius: 4 }}
            />
          ) : (
            <div className="trust-logo-seal">
              <Building size={22} />
            </div>
          )}
          <div>
            <div className="trust-brand-name">{config.branding.firmName}</div>
            <div className="trust-brand-tagline">{config.branding.tagline}</div>
          </div>
        </div>

        {activeNavLinks.length > 0 ? (
          <nav className="trust-nav">
            {activeNavLinks.map((link, idx) => {
              const safeUrl = sanitizeLink(link.url, "#");
              const attrs = getLinkAttributes(safeUrl);
              const isServices = link.label.toLowerCase().includes("service");
              if (isServices) {
                return (
                  <div
                    key={idx}
                    className="trust-nav-services-wrapper"
                    style={{ position: "relative", display: "inline-block" }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <a
                      href={safeUrl}
                      {...attrs}
                      className="trust-nav-link"
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
                      variant="classic"
                      megaMenu={config.header.megaMenu}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                  </div>
                );
              }
              return (
                <a key={idx} href={safeUrl} {...attrs} className="trust-nav-link">
                  {link.label}
                </a>
              );
            })}
          </nav>
        ) : (
          <nav className="trust-nav">
            <a href="#services" className="trust-nav-link">Practice Areas</a>
            <div
              className="trust-nav-services-wrapper"
              style={{ position: "relative", display: "inline-block" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href="#services"
                className="trust-nav-link"
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
                variant="classic"
                megaMenu={config.header.megaMenu}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </div>
            <a href="#contact" className="trust-nav-link">Office Desk</a>
          </nav>
        )}

        <div className="trust-header-actions">
          {config.header.headerCta?.enabled && config.header.headerCta.label && (
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleSelectService(selectedService);
              }}
              className="trust-btn-portal"
              style={{
                background: "var(--wb-primary, #1e3a8a)",
                color: "#ffffff",
                borderColor: "var(--wb-primary, #1e3a8a)",
                fontWeight: 600,
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
              className="trust-btn-portal"
              style={{ borderColor: "var(--wb-accent, #b45309)", color: "var(--wb-accent, #b45309)" }}
            >
              <MessageCircle size={13} /> Office Desk
            </a>
          )}
          {config.header.showClientPortalBtn && (
            <a href="#portal" className="trust-btn-portal">
              Client Portal <ExternalLink size={12} />
            </a>
          )}
        </div>
      </header>

      {/* 3. Dynamic Sections Router */}
      <main style={{ flex: 1 }}>
        {page?.sections
          .filter((s) => s.enabled)
          .sort((a, b) => a.order - b.order)
          .map((sec) => (
            <TrustSectionRouter
              key={sec.id}
              sec={sec}
              config={config}
              selectedService={selectedService}
              onSelectService={handleSelectService}
              formHighlight={formHighlight}
            />
          ))}
      </main>

      {/* 4. Understated Footer */}
      <footer className="trust-footer">
        <div className="trust-footer-top" style={{ display: "grid", gridTemplateColumns: quickLinkGroups.length > 0 ? "2fr 1fr 1fr" : "1fr", gap: 32 }}>
          <div>
            <div style={{ color: "#ffffff", fontSize: 18, fontWeight: 700, fontFamily: "Playfair Display, serif" }}>
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
          <div className="trust-disclaimer">
            {config.footer.disclaimerText || "Standard Professional Disclaimer: In accordance with the Chartered Accountants Act, 1949 and guidelines issued by the regulatory council, this website is designed solely for providing informational facts about the firm and its areas of practice. It does not constitute an advertisement, personal communication, solicitation, or invitation to offer work."}
          </div>
        )}

        <div className="trust-footer-bottom">
          {config.footer.copyrightText || `© ${new Date().getFullYear()} ${config.branding.firmName}. All rights reserved.`}
        </div>
      </footer>
    </div>
  );
}

function TrustSectionRouter({
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
      return <TrustCenteredHero props={sec.props} />;
    case "services":
      return <TrustTwoColumnSection props={sec.props} config={config} onSelectService={onSelectService} />;
    case "tax-calendar":
      return <TrustStandaloneTaxCalendarSection props={sec.props} />;
    case "calculators":
      return <TrustCalculatorsSection props={sec.props} />;
    case "testimonials":
      return <TrustQuotationsSection props={sec.props} />;
    case "cta":
      return <TrustConsultationBanner props={sec.props} />;
    case "contact":
      return (
        <TrustContactSection
          props={sec.props}
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

function TrustCenteredHero({ props }: { props: any }) {
  const primaryHref = sanitizeLink(props.primaryCtaLink, "#services");
  const secondaryHref = sanitizeLink(props.secondaryCtaLink, "#contact");
  const primaryAttrs = getLinkAttributes(primaryHref);
  const secondaryAttrs = getLinkAttributes(secondaryHref);
  const heroImage = props.heroImageUrl || props.imageUrl;

  return (
    <section
      className="trust-hero"
      style={
        heroImage
          ? {
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.92)), url("${heroImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              color: "#ffffff",
              padding: "96px 32px",
            }
          : {}
      }
    >
      <div className="trust-hero-inner" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="trust-ornament" style={{ justifyContent: "center" }}>
          <span className="trust-ornament-line" style={heroImage ? { background: "rgba(255,255,255,0.4)" } : {}}></span>
          <span style={heroImage ? { color: "#93c5fd" } : {}}>Chartered Accountancy & Audit Practice</span>
          <span className="trust-ornament-line" style={heroImage ? { background: "rgba(255,255,255,0.4)" } : {}}></span>
        </div>
        <h1
          className="trust-hero-title"
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
          {props.headline || "Statutory Assurance, Direct Taxation & Corporate Governance"}
        </h1>
        <p
          className="trust-hero-sub"
          style={
            heroImage
              ? {
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 17,
                  maxWidth: 720,
                  margin: "0 auto 28px",
                }
              : {}
          }
        >
          {props.subheadline || "Dedicated to upholding statutory integrity, structured tax planning, and thorough audit examinations for corporations, institutions, and family enterprises."}
        </p>
        <div className="trust-hero-ctas" style={{ justifyContent: "center" }}>
          <a
            href={primaryHref}
            {...primaryAttrs}
            className="trust-cta-primary"
            style={{
              textDecoration: "none",
              display: "inline-block",
              background: heroImage ? "var(--wb-primary, #1e3a8a)" : undefined,
              boxShadow: heroImage ? "0 4px 14px rgba(0,0,0,0.3)" : undefined,
            }}
          >
            {props.primaryCtaText || "Practice Overview"}
          </a>
          <a
            href={secondaryHref}
            {...secondaryAttrs}
            className="trust-cta-secondary"
            style={{
              textDecoration: "none",
              display: "inline-block",
              background: heroImage ? "rgba(255,255,255,0.15)" : undefined,
              color: heroImage ? "#ffffff" : undefined,
              border: heroImage ? "1px solid rgba(255,255,255,0.35)" : undefined,
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

function TrustTwoColumnSection({
  props,
  config,
  onSelectService,
}: {
  props?: any;
  config: WebsiteConfig;
  onSelectService?: (service: string) => void;
}) {
  const visibleIds = Array.isArray(props?.visibleServiceIds) ? props.visibleServiceIds : null;
  const filteredServices = visibleIds !== null && visibleIds.length > 0
    ? SHARED_SERVICES.filter((s) => visibleIds.includes(s.id))
    : visibleIds !== null && visibleIds.length === 0
    ? []
    : SHARED_SERVICES;

  return (
    <>
      <div className="trust-twocol-section" id="services">
        {/* Left Main Column: Assurance & Practice Areas */}
        <div className="trust-main-col">
          <div>
            <h2 className="trust-sec-heading">{props?.title || "Practice Areas & Professional Scopes"}</h2>
            <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 24px", fontFamily: "system-ui, sans-serif" }}>
              {props?.subtitle || "Comprehensive statutory advisory domains rendered under strict regulatory standards."}
            </p>

            {filteredServices.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 16px", color: "#64748b", fontSize: 13, fontStyle: "italic" }}>
                No services selected in builder settings.
              </div>
            ) : (
              <div className="trust-services-list">
                {filteredServices.map((s) => (
                  <div key={s.id} className="trust-service-row">
                    <h3 className="trust-service-row-title">{s.title}</h3>
                    <p className="trust-service-row-desc">{s.description}</p>
                    <div className="trust-service-scopes">
                      {s.scopeList.map((scope, idx) => (
                        <span key={idx} className="trust-scope-tag">
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Column: Tax Calendar & Contact Overview */}
        <div className="trust-sidebar-col">
          {/* Statutory Due Dates Card (only if tax-calendar section is enabled) */}
          {config.pages[0]?.sections.some((s) => s.type === "tax-calendar" && s.enabled) && (
            <div className="trust-sidebar-card" id="tax-calendar">
              <h3 className="trust-sidebar-title">
                <Calendar size={15} /> Statutory Due Dates
              </h3>
              <div>
                {SHARED_TAX_DATES.map((d, i) => (
                  <div key={i} className="trust-sidebar-date-item">
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--wb-primary, #1e3a8a)" }}>
                      {d.date}
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2 }}>{d.title}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>
                      {d.form} · {d.authority}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 10.5, color: "#64748b", fontStyle: "italic" }}>
                * Sample dates for reference. Please verify extensions on the official portal.
              </div>
            </div>
          )}

          {/* Practice Desk Contact Card (only if contact section is enabled) */}
          {config.pages[0]?.sections.some((s) => s.type === "contact" && s.enabled) && (
            <div className="trust-sidebar-card" id="contact">
              <h3 className="trust-sidebar-title">
                <Shield size={15} /> Professional Desk
              </h3>
              <div style={{ fontSize: 12.5, display: "flex", flexDirection: "column", gap: 12, fontFamily: "system-ui, sans-serif" }}>
                <div>
                  <strong style={{ display: "block", color: "var(--wb-primary, #1e3a8a)", fontSize: 11.5 }}>OFFICE ADDRESS</strong>
                  <span style={{ color: "#475569" }}>{config.branding.address || SHARED_FIRM_CONTACT.primaryOffice}</span>
                </div>
                <div>
                  <strong style={{ display: "block", color: "var(--wb-primary, #1e3a8a)", fontSize: 11.5 }}>TELEPHONE</strong>
                  <span style={{ color: "#475569" }}>{config.branding.phone || SHARED_FIRM_CONTACT.phone}</span>
                </div>
                <div>
                  <strong style={{ display: "block", color: "var(--wb-primary, #1e3a8a)", fontSize: 11.5 }}>EMAIL</strong>
                  <span style={{ color: "#475569" }}>{config.branding.email || SHARED_FIRM_CONTACT.email}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Specialized Advisory Desks / Visual Photo Gallery */}
      <PracticeGallerySection
        tiles={props?.galleryTiles}
        title={props?.galleryTitle || "Specialized Advisory Desks"}
        tagline={props?.galleryTagline || "ASSURANCE & COMPLIANCE PRACTICE"}
        subtitle={props?.gallerySubtitle || "Specialized desks for corporate incorporation, statutory audit, taxation, and regulatory governance."}
        variant="classic"
        onSelectService={onSelectService}
      />
    </>
  );
}

function TrustStandaloneTaxCalendarSection({ props }: { props?: any }) {
  return (
    <section className="trust-twocol-section" id="tax-calendar" style={{ paddingTop: 32, paddingBottom: 32 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h2 className="trust-sec-heading">{props?.title || "Statutory Due Dates & Compliance Calendar"}</h2>
        <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 24px", fontFamily: "system-ui, sans-serif" }}>
          {props?.subtitle || "Key upcoming deadlines across GST, Income Tax, TDS, and MCA authorities."}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {SHARED_TAX_DATES.map((d, i) => (
            <div key={i} className="trust-sidebar-date-item" style={{ background: "#ffffff", padding: "16px 20px", border: "1px solid rgba(0,0,0,0.08)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--wb-primary, #1e3a8a)" }}>
                {d.date}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 4 }}>{d.title}</div>
              <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>
                {d.form} · {d.authority} ({d.category})
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustQuotationsSection({ props }: { props: any }) {
  return (
    <section id="about" style={{ padding: "56px 40px", background: "var(--wb-surface, #f8fafc)", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 className="trust-sec-heading">{props.title || "Professional Experience Statements"}</h2>
        <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 28px", fontFamily: "system-ui, sans-serif" }}>
          Factual commentary on audit, compliance, and corporate advisory engagements.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {SHARED_CLIENT_REVIEWS.map((r) => (
            <div key={r.id} className="trust-quote-card">
              <p className="trust-quote-text">"{r.statement}"</p>
              <div className="trust-quote-meta">
                <strong>Client {r.clientInitials}</strong> · {r.businessSector}
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{r.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustCalculatorsSection({ props }: { props: any }) {
  return (
    <section style={{ padding: "56px 40px", background: "#ffffff", borderTop: "1px solid rgba(0,0,0,0.06)" }} id="calculators">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 className="trust-sec-heading">{props.title || "Calculators (coming soon)"}</h2>
        <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 28px", fontFamily: "system-ui, sans-serif" }}>
          Preliminary reference estimators for tax planning and regime evaluation (in development).
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { title: "GST Input Tax Credit & Liability", desc: "Estimator for output liability against eligible ITC credits." },
            { title: "Section 115BAC Regime Comparison", desc: "Comparison between Old vs New Income Tax slab computations." },
            { title: "Quarterly Advance Tax Schedule", desc: "Turnover-based quarterly payment computation estimator." },
          ].map((c, i) => (
            <div key={i} style={{ padding: 22, border: "1px solid rgba(0,0,0,0.08)", background: "#fafafa" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px", color: "var(--wb-primary, #1e3a8a)" }}>{c.title}</h3>
              <p style={{ fontSize: 12.5, color: "#64748b", margin: "0 0 16px", fontFamily: "system-ui, sans-serif" }}>{c.desc}</p>
              <button
                style={{
                  background: "transparent",
                  border: "1px solid rgba(0,0,0,0.15)",
                  padding: "6px 12px",
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: "not-allowed",
                  opacity: 0.7,
                  fontFamily: "system-ui, sans-serif",
                }}
                disabled
              >
                Coming Soon
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustConsultationBanner({ props }: { props: any }) {
  const btnHref = sanitizeLink(props.buttonLink, "#contact");
  const btnAttrs = getLinkAttributes(btnHref);

  return (
    <section style={{ padding: "48px 40px", background: "var(--wb-primary, #1e3a8a)", color: "#ffffff", textAlign: "center" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 10px", fontFamily: "Playfair Display, serif" }}>
          {props.headline || "Statutory Audit & Tax Advisory Inquiries"}
        </h2>
        <p style={{ fontSize: 13.5, color: "#cbd5e1", margin: "0 0 22px", fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
          For formal statutory audits, transfer pricing analysis, or direct taxation assessments, contact the practice office.
        </p>
        <a
          href={btnHref}
          {...btnAttrs}
          style={{
            background: "var(--wb-accent, #b45309)",
            color: "#ffffff",
            border: "none",
            padding: "11px 24px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            borderRadius: 3,
            fontFamily: "system-ui, sans-serif",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {props.buttonText || "Contact Practice Desk"}
        </a>
      </div>
    </section>
  );
}

function TrustContactSection({
  props,
  config,
  selectedService,
  onSelectService,
  formHighlight,
}: {
  props?: any;
  config: WebsiteConfig;
  selectedService: string;
  onSelectService: (serviceName: string) => void;
  formHighlight: boolean;
}) {
  return (
    <section className="trust-twocol-section" id="contact" style={{ paddingTop: 40, paddingBottom: 48 }}>
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: 32,
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 36, alignItems: "start" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--wb-accent, #b45309)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              <Shield size={14} /> Official Desk
            </div>
            <h2 className="trust-sec-heading" style={{ fontSize: 24, marginBottom: 8, color: "var(--wb-primary, #1e3a8a)" }}>
              {props?.title || "Professional Inquiries & Consultation"}
            </h2>
            <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 24px", lineHeight: 1.6 }}>
              {props?.subtitle || "Official communications channels for corporate, tax, and statutory engagements. Select your practice area to connect with our senior partners."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 13, borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 20 }}>
              <div>
                <strong style={{ display: "block", color: "var(--wb-primary, #1e3a8a)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                  Office Address
                </strong>
                <span style={{ color: "#475569", lineHeight: 1.5 }}>
                  {config.branding.address || SHARED_FIRM_CONTACT.primaryOffice}
                </span>
              </div>
              <div>
                <strong style={{ display: "block", color: "var(--wb-primary, #1e3a8a)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                  Direct Telephone
                </strong>
                <span style={{ color: "#475569" }}>
                  {config.branding.phone || SHARED_FIRM_CONTACT.phone}
                </span>
              </div>
              <div>
                <strong style={{ display: "block", color: "var(--wb-primary, #1e3a8a)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                  Official Email
                </strong>
                <span style={{ color: "#475569" }}>
                  {config.branding.email || SHARED_FIRM_CONTACT.email}
                </span>
              </div>
              <div>
                <strong style={{ display: "block", color: "var(--wb-primary, #1e3a8a)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                  Operating Hours
                </strong>
                <span style={{ color: "#475569" }}>
                  Mon – Sat: 9:30 AM – 6:30 PM (IST)
                </span>
              </div>
            </div>
          </div>

          <div>
            <TemplateConsultationForm
              selectedService={selectedService}
              onServiceChange={onSelectService}
              formHighlight={formHighlight}
              variant="classic"
              megaMenu={config.header.megaMenu}
              formTitle="Request Statutory Advisory"
              formSubtitle="Select your service area. Our senior compliance associates will review and reach out directly."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
