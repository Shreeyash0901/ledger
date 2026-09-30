import React, { useState, useRef } from "react";
import "./lumen.css";
import {
  WebsiteConfig,
  SectionConfig,
  sanitizeLink,
  getLinkAttributes,
  DEFAULT_MEGA_MENU_CONFIG,
  MegaMenuConfig,
} from "website-core";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calculator,
  ShieldCheck,
  FileCheck,
  Receipt,
  Landmark,
  Rocket,
  BookOpen,
  Building2,
} from "lucide-react";
import {
  SHARED_SERVICES,
  SHARED_TAX_DATES,
  SHARED_CLIENT_REVIEWS,
  SHARED_FIRM_CONTACT,
} from "../../fixtures/sharedData";
import { SocialIcon } from "../../components/SocialIcon";
import { TemplateServicesDropdown } from "../../components/TemplateServicesDropdown";
import { PracticeGallerySection } from "../../components/PracticeGallerySection";

export interface LumenTemplateProps {
  config: WebsiteConfig;
}

const SERVICE_ICONS = [Building2, Receipt, FileCheck, Landmark, ShieldCheck, BookOpen, Rocket];

// ─── MAIN TEMPLATE ─────────────────────────────────────────────────────────────

export function LumenTemplate({ config }: LumenTemplateProps) {
  const page = config.pages[0];
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Company Incorporation");
  const [formHighlight, setFormHighlight] = useState(false);
  const closeTimerRef = useRef<any>(null);

  const openMenu = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsServicesOpen(true);
  };
  const closeMenuSoon = () => {
    closeTimerRef.current = setTimeout(() => setIsServicesOpen(false), 200);
  };

  const handleSelectService = (title: string) => {
    setSelectedService(title);
    setIsServicesOpen(false);
    setFormHighlight(true);
    setTimeout(() => setFormHighlight(false), 1800);
    const target = document.getElementById("lm-hero-form") || document.getElementById("contact");
    if (target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const navLinks = (config.header.navLinks || []).filter((l) => l.enabled);
  const quickLinkGroups = (config.footer.quickLinkGroups || []).filter((g) => g.title && g.links?.length > 0);
  const socialLinks = config.footer.socialLinks || [];
  const firm = config.branding.firmName || "Lumen & Associates";

  const renderNavItem = (label: string, url: string, key: number) => {
    const safeUrl = sanitizeLink(url, "#");
    if (label.toLowerCase().includes("service")) {
      return (
        <div key={key} className="lm-nav-services accountax-nav-services-wrapper" onMouseEnter={openMenu} onMouseLeave={closeMenuSoon}>
          <a
            href={safeUrl}
            className="lm-nav-link"
            aria-expanded={isServicesOpen}
            onClick={(e) => {
              e.preventDefault();
              setIsServicesOpen((p) => !p);
            }}
          >
            {label}
            <ChevronDown size={14} className={isServicesOpen ? "lm-chev open" : "lm-chev"} />
          </a>
          <TemplateServicesDropdown
            isOpen={isServicesOpen}
            onClose={() => setIsServicesOpen(false)}
            onSelectService={handleSelectService}
            variant="accountax"
            megaMenu={config.header.megaMenu}
            onMouseEnter={openMenu}
            onMouseLeave={closeMenuSoon}
          />
        </div>
      );
    }
    return (
      <a key={key} href={safeUrl} {...getLinkAttributes(safeUrl)} className="lm-nav-link">
        {label}
      </a>
    );
  };

  return (
    <div className="lumen-root">
      {/* Floating pill navigation */}
      <header className="lm-header">
        <div className="lm-header-pill">
          <a href="#home" className="lm-brand">
            {config.branding.logoUrl ? (
              <img src={config.branding.logoUrl} alt={firm} style={{ maxHeight: 32, objectFit: "contain" }} />
            ) : (
              <>
                <span className="lm-brand-mark" aria-hidden />
                <span className="lm-brand-name">{firm}</span>
              </>
            )}
          </a>

          <nav className="lm-nav" aria-label="Main">
            {navLinks.length > 0
              ? navLinks.map((l, i) => renderNavItem(l.label, l.url, i))
              : [
                  renderNavItem("Services", "#services", 0),
                  renderNavItem("Due dates", "#tax-calendar", 1),
                  renderNavItem("Reviews", "#testimonials", 2),
                  renderNavItem("Contact", "#contact", 3),
                ]}
          </nav>

          {config.header.headerCta?.enabled !== false && (
            <a
              href="#contact"
              className="lm-btn lm-btn-coral lm-btn-sm"
              onClick={(e) => {
                e.preventDefault();
                handleSelectService(selectedService);
              }}
            >
              {config.header.headerCta?.label || "Talk to a CA"}
            </a>
          )}
        </div>
      </header>

      <main>
        {page?.sections
          .filter((s) => s.enabled)
          .sort((a, b) => a.order - b.order)
          .map((sec) => (
            <SectionRouter
              key={sec.id}
              sec={sec}
              config={config}
              selectedService={selectedService}
              onSelectService={handleSelectService}
              formHighlight={formHighlight}
            />
          ))}
      </main>

      <footer className="lm-footer">
        <div className="lm-footer-grid">
          <div>
            <div className="lm-footer-brand">{firm}</div>
            <p className="lm-footer-about">
              {config.branding.tagline || "Accounting, tax and compliance for growing businesses, handled by chartered accountants."}
            </p>
            <div className="lm-footer-contact">
              <span><MapPin size={14} /> {config.branding.address || SHARED_FIRM_CONTACT.primaryOffice}</span>
              <span><Phone size={14} /> {config.branding.phone || SHARED_FIRM_CONTACT.phone}</span>
              <span><Mail size={14} /> {config.branding.email || SHARED_FIRM_CONTACT.email}</span>
            </div>
            {socialLinks.length > 0 && (
              <div className="lm-socials">
                {socialLinks.map((s, i) => (
                  <a key={i} href={sanitizeLink(s.url, "#")} {...getLinkAttributes(sanitizeLink(s.url, "#"))} aria-label={s.platform}>
                    <SocialIcon platform={s.platform} size={15} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {quickLinkGroups.length > 0 ? (
            quickLinkGroups.map((g, gi) => (
              <div key={gi}>
                <h4 className="lm-footer-h">{g.title}</h4>
                <ul className="lm-footer-links">
                  {g.links.filter((l) => l.label && l.url).map((l, li) => (
                    <li key={li}>
                      <a href={sanitizeLink(l.url, "#")} {...getLinkAttributes(sanitizeLink(l.url, "#"))}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <>
              <div>
                <h4 className="lm-footer-h">Services</h4>
                <ul className="lm-footer-links">
                  <li><a href="#services">Company incorporation</a></li>
                  <li><a href="#services">GST registration and returns</a></li>
                  <li><a href="#services">Income tax and ITR</a></li>
                  <li><a href="#services">Audit and assurance</a></li>
                </ul>
              </div>
              <div>
                <h4 className="lm-footer-h">Firm</h4>
                <ul className="lm-footer-links">
                  <li><a href="#tax-calendar">Due dates</a></li>
                  <li><a href="#testimonials">Client reviews</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
            </>
          )}

          <div>
            <h4 className="lm-footer-h">Office hours</h4>
            <p className="lm-footer-about">Monday to Saturday<br />9:30 AM to 6:30 PM IST</p>
          </div>
        </div>

        {config.footer.icaiDisclaimer && (
          <p className="lm-disclaimer">
            {config.footer.disclaimerText ||
              "In accordance with the Chartered Accountants Act, 1949 and ICAI guidelines, this website provides factual information about the firm's practice areas. It is not an advertisement, solicitation or invitation to offer work."}
          </p>
        )}
        <div className="lm-footer-bottom">
          {config.footer.copyrightText || `© ${new Date().getFullYear()} ${firm}. All rights reserved.`}
        </div>
      </footer>
    </div>
  );
}

// ─── SECTION ROUTER ────────────────────────────────────────────────────────────

interface RouterProps {
  sec: SectionConfig;
  config: WebsiteConfig;
  selectedService: string;
  onSelectService: (s: string) => void;
  formHighlight: boolean;
}

function SectionRouter({ sec, config, selectedService, onSelectService, formHighlight }: RouterProps) {
  switch (sec.type) {
    case "hero":
      return <HeroSection props={sec.props} config={config} selectedService={selectedService} onSelectService={onSelectService} formHighlight={formHighlight} />;
    case "services":
      return <ServicesSection props={sec.props} onSelectService={onSelectService} />;
    case "tax-calendar":
      return <CalendarSection props={sec.props} />;
    case "testimonials":
      return <TestimonialsSection props={sec.props} />;
    case "cta":
      return <CtaSection props={sec.props} />;
    case "contact":
      return <ContactSection props={sec.props} config={config} selectedService={selectedService} onSelectService={onSelectService} />;
    case "calculators":
      return <CalculatorsSection props={sec.props} />;
    default:
      return null;
  }
}

// ─── HERO: big statement + live "next due" strip + floating form ───────────────

function HeroSection({
  props,
  config,
  selectedService,
  onSelectService,
  formHighlight,
}: {
  props: any;
  config: WebsiteConfig;
  selectedService: string;
  onSelectService: (s: string) => void;
  formHighlight: boolean;
}) {
  const heroImage = props?.heroImageUrl || props?.imageUrl;
  const upcoming = SHARED_TAX_DATES.slice(0, 3);

  return (
    <section className="lm-hero" id="home">
      <div className="lm-hero-mesh" aria-hidden style={heroImage ? { backgroundImage: `url("${heroImage}")` } : undefined} />
      <div className="lm-hero-inner">
        <div className="lm-hero-copy">
          <p className="lm-hero-kicker">Chartered accountants for founders and finance teams</p>
          <h1 className="lm-hero-title">
            {props?.headline || "Taxes filed, books closed and deadlines never missed."}
          </h1>
          <p className="lm-hero-sub">
            {props?.subheadline ||
              "A dedicated CA reviews every return before it goes to the portal. You get fixed fees, clear timelines and a person who picks up the phone."}
          </p>
          <div className="lm-hero-actions">
            <a
              href="#contact"
              className="lm-btn lm-btn-coral"
              onClick={(e) => {
                e.preventDefault();
                onSelectService(selectedService);
              }}
            >
              {props?.primaryCtaText || "Book a free consultation"}
              <ArrowUpRight size={16} />
            </a>
            <a href="#services" className="lm-btn lm-btn-ghost">
              {props?.secondaryCtaText || "See what we handle"}
            </a>
          </div>

          <div className="lm-due-strip" aria-label="Upcoming deadlines">
            <span className="lm-due-label">Coming up</span>
            {upcoming.map((d, i) => (
              <a key={i} href="#tax-calendar" className="lm-due-chip">
                <b>{d.date.split(" ").slice(0, 2).join(" ")}</b>
                <span>{d.form}</span>
              </a>
            ))}
          </div>
        </div>

        <div id="lm-hero-form" className={`lm-form-card ${formHighlight ? "lm-pulse" : ""}`}>
          <h2 className="lm-form-title">Get a call back today</h2>
          <p className="lm-form-sub">Tell us what you need. A CA replies within 24 hours.</p>
          <CallbackForm selectedService={selectedService} onServiceChange={onSelectService} megaMenu={config.header.megaMenu} />
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES: bento grid ──────────────────────────────────────────────────────

function ServicesSection({ props, onSelectService }: { props: any; onSelectService: (s: string) => void }) {
  const visibleIds = Array.isArray(props?.visibleServiceIds) ? props.visibleServiceIds : null;
  const list =
    visibleIds !== null
      ? SHARED_SERVICES.filter((s) => visibleIds.includes(s.id))
      : SHARED_SERVICES;

  return (
    <>
      <section className="lm-section" id="services">
        <div id="about" />
        <div className="lm-container">
          <div className="lm-section-head">
            <h2 className="lm-h2">{props?.title || "Everything your business needs filed, audited or registered"}</h2>
            <p className="lm-lede">
              {props?.subtitle || "Pick a service to see the fee range and timeline, then request a call. No hidden charges."}
            </p>
          </div>

          <div className="lm-bento">
            {list.slice(0, 6).map((srv, i) => {
              const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
              return (
                <button
                  key={srv.id}
                  type="button"
                  className={`lm-tile lm-tile-${i + 1}`}
                  onClick={() => onSelectService(srv.title)}
                >
                  <span className="lm-tile-icon"><Icon size={20} /></span>
                  <span className="lm-tile-title">{srv.title}</span>
                  <span className="lm-tile-desc">{srv.description}</span>
                  <span className="lm-tile-go" aria-hidden><ArrowUpRight size={18} /></span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Specialized Advisory Desks / Practice Visual Gallery */}
      <PracticeGallerySection
        tiles={props?.galleryTiles}
        title={props?.galleryTitle || "Specialized Advisory Desks"}
        tagline={props?.galleryTagline || "FULL PRACTICE SPECTRUM"}
        subtitle={props?.gallerySubtitle || "Specialized desks for company incorporation, GST compliance, startup India, and tax audits."}
        variant="apex"
        onSelectService={onSelectService}
      />
    </>
  );
}

// ─── DUE DATES: timeline list with authority filter ────────────────────────────

function CalendarSection({ props }: { props: any }) {
  const [auth, setAuth] = useState("All");
  const items = SHARED_TAX_DATES.filter((d) => auth === "All" || d.authority === auth);

  return (
    <section className="lm-section lm-section-tint" id="tax-calendar">
      <div className="lm-container">
        <div className="lm-section-head lm-row">
          <div>
            <h2 className="lm-h2">{props?.title || "Deadlines on the horizon"}</h2>
            <p className="lm-lede">{props?.subtitle || "GST, income tax and MCA filings in one place."}</p>
          </div>
          <div className="lm-seg" role="tablist">
            {["All", "GSTN", "CBDT", "MCA"].map((a) => (
              <button key={a} role="tab" aria-selected={auth === a} className={auth === a ? "on" : ""} onClick={() => setAuth(a)}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <ol className="lm-timeline">
          {items.map((d, i) => (
            <li key={i} className="lm-tl-item">
              <div className="lm-tl-date">
                <b>{d.date.split(" ")[0]}</b>
                <span>{d.date.split(" ").slice(1).join(" ")}</span>
              </div>
              <div className="lm-tl-body">
                <div className="lm-tl-title">{d.title}</div>
                <div className="lm-tl-meta">{d.form} · {d.authority} · {d.category}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS: one large quote, two supporting ─────────────────────────────

function TestimonialsSection({ props }: { props: any }) {
  const [lead, ...rest] = SHARED_CLIENT_REVIEWS.slice(0, 3);
  if (!lead) return null;
  return (
    <section className="lm-section" id="testimonials">
      <div className="lm-container">
        <div className="lm-section-head">
          <h2 className="lm-h2">{props?.title || "What clients say after their first filing season"}</h2>
        </div>
        <div className="lm-quotes">
          <figure className="lm-quote-lead">
            <blockquote>{lead.statement}</blockquote>
            <figcaption>
              <span className="lm-avatar">{lead.clientInitials}</span>
              <span>Client {lead.clientInitials}<small>{lead.businessSector}</small></span>
            </figcaption>
          </figure>
          <div className="lm-quote-side">
            {rest.map((r) => (
              <figure key={r.id} className="lm-quote-small">
                <blockquote>{r.statement}</blockquote>
                <figcaption>
                  <span className="lm-avatar">{r.clientInitials}</span>
                  <span>Client {r.clientInitials}<small>{r.businessSector}</small></span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ───────────────────────────────────────────────────────────────────────

function CtaSection({ props }: { props: any }) {
  const href = sanitizeLink(props?.buttonLink || props?.ctaLink, "#contact");
  return (
    <section className="lm-cta">
      <div className="lm-cta-inner">
        <h2>{props?.headline || "Not sure what you need? Start with a 20-minute call."}</h2>
        <p>{props?.subheadline || "We will look at your situation and tell you what to file, by when, and what it costs."}</p>
        <a href={href} {...getLinkAttributes(href)} className="lm-btn lm-btn-coral">
          {props?.buttonText || props?.ctaText || "Book a call"} <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}

// ─── CONTACT ───────────────────────────────────────────────────────────────────

function ContactSection({
  props,
  config,
  selectedService,
  onSelectService,
}: {
  props: any;
  config: WebsiteConfig;
  selectedService: string;
  onSelectService: (s: string) => void;
}) {
  const rows = [
    { Icon: MapPin, label: "Office", value: config.branding.address || SHARED_FIRM_CONTACT.primaryOffice },
    { Icon: Phone, label: "Phone", value: config.branding.phone || SHARED_FIRM_CONTACT.phone },
    { Icon: Mail, label: "Email", value: config.branding.email || SHARED_FIRM_CONTACT.email },
    { Icon: Clock, label: "Hours", value: "Mon to Sat, 9:30 AM to 6:30 PM" },
  ];
  return (
    <section className="lm-section lm-section-tint" id="contact">
      <div className="lm-container lm-contact">
        <div>
          <h2 className="lm-h2">{props?.title || "Talk to a partner directly"}</h2>
          <p className="lm-lede">{props?.subtitle || "Audits, incorporation, GST or tax. Tell us where you are stuck."}</p>
          <ul className="lm-contact-list">
            {rows.map(({ Icon, label, value }) => (
              <li key={label}>
                <span className="lm-contact-icon"><Icon size={18} /></span>
                <span><small>{label}</small>{value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lm-form-card lm-form-card-flat">
          <h3 className="lm-form-title">Request a callback</h3>
          <CallbackForm selectedService={selectedService} onServiceChange={onSelectService} megaMenu={config.header.megaMenu} />
        </div>
      </div>
    </section>
  );
}

// ─── CALCULATORS (placeholder, keeps router parity) ────────────────────────────

function CalculatorsSection({ props }: { props: any }) {
  const items = [
    ["GST liability and ITC", "Output tax against eligible input credit."],
    ["Old vs new tax regime", "See which slab set costs you less."],
    ["Advance tax schedule", "Quarterly instalments from projected income."],
  ];
  return (
    <section className="lm-section" id="calculators">
      <div className="lm-container">
        <div className="lm-section-head">
          <h2 className="lm-h2">{props?.title || "Calculators"}</h2>
          <p className="lm-lede">{props?.subtitle || "Estimation tools are on the way."}</p>
        </div>
        <div className="lm-calc-grid">
          {items.map(([t, d]) => (
            <div key={t} className="lm-calc">
              <Calculator size={22} />
              <h3>{t}</h3>
              <p>{d}</p>
              <button disabled className="lm-btn lm-btn-ghost lm-btn-sm">Coming soon</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CALLBACK FORM (same lead storage contract as Accountax) ───────────────────

function CallbackForm({
  selectedService,
  onServiceChange,
  megaMenu,
}: {
  selectedService: string;
  onServiceChange: (s: string) => void;
  megaMenu?: MegaMenuConfig;
}) {
  const [data, setData] = useState({ name: "", mobile: "", city: "" });
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name.trim() || !data.mobile.trim()) return;

    const lead = {
      id: `lead_${Date.now()}`,
      name: data.name.trim(),
      phone: data.mobile.trim(),
      email: "no-email@portal.local",
      serviceInterest: selectedService,
      city: data.city.trim() || "India",
      source: "Lumen Form",
      submittedAt: new Date().toISOString(),
      status: "new",
      notes: `Lead from Lumen Template for ${selectedService}`,
    };

    try {
      const KEY = "activedesk_website_mgmt_dashboard_v1";
      const raw = localStorage.getItem(KEY);
      const dash = raw ? JSON.parse(raw) : {};
      dash.leads = [lead, ...(Array.isArray(dash.leads) ? dash.leads : [])];
      localStorage.setItem(KEY, JSON.stringify(dash));
    } catch (err) {
      console.error("Failed to save lead", err);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("activedesk_lead_created", { detail: lead }));
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="lm-done" role="status">
        <CheckCircle2 size={32} />
        <h4>Request received</h4>
        <p>A chartered accountant will call <strong>{data.mobile}</strong> within 24 hours.</p>
        <button
          type="button"
          className="lm-btn lm-btn-ghost lm-btn-sm"
          onClick={() => {
            setDone(false);
            setData({ name: "", mobile: "", city: "" });
          }}
        >
          Send another request
        </button>
      </div>
    );
  }

  const menu = megaMenu || DEFAULT_MEGA_MENU_CONFIG;
  const options: string[] = Array.from(
    new Set(
      menu?.categories?.length
        ? menu.categories.flatMap((c) => (c.items || []).map((i) => i.label))
        : SHARED_SERVICES.map((s) => s.title)
    )
  );
  if (!options.includes(selectedService)) options.unshift(selectedService);

  return (
    <form onSubmit={submit} className="lm-form">
      <label className="lm-field">
        <span>Your name</span>
        <input required value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Rahul Sharma" />
      </label>
      <div className="lm-field-row">
        <label className="lm-field">
          <span>Phone</span>
          <input required type="tel" value={data.mobile} onChange={(e) => setData({ ...data, mobile: e.target.value })} placeholder="10-digit mobile" />
        </label>
        <label className="lm-field">
          <span>City</span>
          <input value={data.city} onChange={(e) => setData({ ...data, city: e.target.value })} placeholder="Nagpur" />
        </label>
      </div>
      <label className="lm-field">
        <span>What do you need?</span>
        <select value={selectedService} onChange={(e) => onServiceChange(e.target.value)}>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="lm-btn lm-btn-coral lm-btn-block">
        Request a free consultation <ArrowUpRight size={16} />
      </button>
    </form>
  );
}
