import React, { useState } from "react";
import "./pulse.css";
import { WebsiteConfig, SectionConfig, sanitizeLink, getLinkAttributes } from "website-core";
import { ArrowRight, Check, Phone, Mail, MapPin, Clock } from "lucide-react";
import { SHARED_SERVICES, SHARED_TAX_DATES, SHARED_CLIENT_REVIEWS, SHARED_FIRM_CONTACT } from "../../fixtures/sharedData";
import { useShell, NavItems, LeadForm, SiteFooter } from "../shared/parts";
import { PracticeGallerySection } from "../../components/PracticeGallerySection";

export interface PulseTemplateProps {
  config: WebsiteConfig;
}

type Shell = ReturnType<typeof useShell>;

export function PulseTemplate({ config }: PulseTemplateProps) {
  const page = config.pages[0];
  const shell = useShell("pl-contact-form");
  const firm = config.branding.firmName || "Pulse CA";

  return (
    <div className="pulse-root">
      <header className="pl-header">
        <div className="pl-header-inner">
          <a href="#home" className="pl-brand">
            {config.branding.logoUrl ? (
              <img src={config.branding.logoUrl} alt={firm} style={{ maxHeight: 32 }} />
            ) : (
              <>
                <span className="pl-dot" aria-hidden />
                {firm}
              </>
            )}
          </a>
          <nav className="pl-nav" aria-label="Main">
            <NavItems
              config={config}
              linkClass="pl-nav-link"
              menu={shell.menu}
              onSelect={shell.select}
              fallback={[["Services", "#services"], ["Deadlines", "#tax-calendar"], ["Reviews", "#testimonials"], ["Contact", "#contact"]]}
            />
          </nav>
          {config.header.headerCta?.enabled !== false && (
            <a href="#contact" className="pl-btn pl-btn-sm" onClick={(e) => { e.preventDefault(); shell.select(shell.selectedService); }}>
              {config.header.headerCta?.label || "Get started"}
            </a>
          )}
        </div>
      </header>

      <main>
        {page?.sections
          .filter((s) => s.enabled)
          .sort((a, b) => a.order - b.order)
          .map((sec) => <Router key={sec.id} sec={sec} config={config} shell={shell} />)}
      </main>

      <SiteFooter config={config} />
    </div>
  );
}

function Router({ sec, config, shell }: { sec: SectionConfig; config: WebsiteConfig; shell: Shell }) {
  const p = sec.props;
  switch (sec.type) {
    case "hero": return <Hero p={p} shell={shell} />;
    case "services": return <Services p={p} shell={shell} />;
    case "tax-calendar": return <Deadlines p={p} />;
    case "testimonials": return <Reviews p={p} />;
    case "cta": return <Cta p={p} />;
    case "contact": return <Contact p={p} config={config} shell={shell} />;
    default: return null;
  }
}

// ─── Hero: centered statement + tracker mock built from due dates ───────────────

const STATUS = [
  { label: "Filed", cls: "ok" },
  { label: "In review", cls: "warn" },
  { label: "Upcoming", cls: "idle" },
  { label: "Upcoming", cls: "idle" },
];

const SAMPLE_COMPLIANCE_ITEMS = [
  { title: "Statutory Tax Audit Review", form: "Form 3CA / 3CD", authority: "CBDT", date: "30 SEP" },
  { title: "TDS / TCS Deposit Verification", form: "Challan ITNS 281", authority: "CBDT", date: "07 OCT" },
  { title: "Monthly Outward Supply Filing", form: "GSTR-1 Outward", authority: "GSTN", date: "11 OCT" },
  { title: "Monthly Summary Tax Settlement", form: "GSTR-3B Summary", authority: "GSTN", date: "20 OCT" },
];

function Hero({ p, shell }: { p: any; shell: Shell }) {
  const rows = SAMPLE_COMPLIANCE_ITEMS;
  return (
    <section className="pl-hero" id="home">
      <div className="pl-hero-glow" aria-hidden />
      <div className="pl-hero-inner">
        <p className="pl-pill"><span className="pl-pill-dot" /> Chartered accountants, on your side</p>
        <h1>{p?.headline || "Compliance that runs quietly in the background."}</h1>
        <p className="pl-hero-sub">
          {p?.subheadline || "We track every filing, chase every document and review every return, so deadlines stop being a source of stress."}
        </p>
        <div className="pl-hero-actions">
          <a href="#contact" className="pl-btn" onClick={(e) => { e.preventDefault(); shell.select(shell.selectedService); }}>
            {p?.primaryCtaText || "Book a free consultation"} <ArrowRight size={16} />
          </a>
          <a href="#services" className="pl-btn pl-btn-light">{p?.secondaryCtaText || "Explore services"}</a>
        </div>

        <div className="pl-tracker" aria-label="Sample compliance tracker">
          <div className="pl-tracker-bar">
            <span /><span /><span />
            <b>Compliance tracker</b>
            <em>Sample view</em>
          </div>
          {rows.map((d, i) => {
            const s = STATUS[i % STATUS.length];
            return (
              <div className="pl-tracker-row" key={i}>
                <div className="pl-tracker-main">
                  <strong>{d.title}</strong>
                  <span>{d.form} · {d.authority}</span>
                </div>
                <span className="pl-tracker-date">{d.date}</span>
                <span className={`pl-status ${s.cls}`}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Services: vertical tabs + detail panel ─────────────────────────────────────

function Services({ p, shell }: { p: any; shell: Shell }) {
  const ids = Array.isArray(p?.visibleServiceIds) ? p.visibleServiceIds : null;
  const list = ids !== null ? SHARED_SERVICES.filter((s) => ids.includes(s.id)) : SHARED_SERVICES;
  const [active, setActive] = useState(0);
  if (!list.length) return null;
  const cur = list[Math.min(active, list.length - 1)];

  return (
    <section className="pl-section" id="services">
      <div className="pl-wrap">
        <div className="pl-head">
          <h2>{p?.title || "One firm for every filing"}</h2>
          <p>{p?.subtitle || "Choose a service to see how we handle it."}</p>
        </div>
        <div className="pl-tabs">
          <div className="pl-tab-list" role="tablist" aria-orientation="vertical">
            {list.map((s, i) => (
              <button key={s.id} role="tab" aria-selected={i === active} className={i === active ? "on" : ""} onClick={() => setActive(i)}>
                {s.title}
              </button>
            ))}
          </div>
          <div className="pl-tab-panel" role="tabpanel" key={cur.id}>
            <h3>{cur.title}</h3>
            <p>{cur.description}</p>
            <ul>
              <li><Check size={16} /> Reviewed by a chartered accountant before filing</li>
              <li><Check size={16} /> Fixed fee quoted upfront</li>
              <li><Check size={16} /> Status updates until it is closed</li>
            </ul>
            <button className="pl-btn" onClick={() => shell.select(cur.title)}>Get a quote <ArrowRight size={16} /></button>
          </div>
        </div>

        {/* Specialized Advisory Desks / Practice Visual Gallery */}
        <PracticeGallerySection
          tiles={p?.galleryTiles}
          title={p?.galleryTitle || "Specialized Advisory Desks"}
          tagline={p?.galleryTagline || "FULL PRACTICE SPECTRUM"}
          subtitle={p?.gallerySubtitle || "Specialized desks for company incorporation, GST compliance, startup India, and tax audits."}
          variant="apex"
          onSelectService={shell.select}
        />
      </div>
    </section>
  );
}

// ─── Deadlines: cards with authority chips ──────────────────────────────────────

function Deadlines({ p }: { p: any }) {
  const [auth, setAuth] = useState("All");
  const rows = SHARED_TAX_DATES.filter((d) => auth === "All" || d.authority === auth);
  return (
    <section className="pl-section pl-tint" id="tax-calendar">
      <div className="pl-wrap">
        <div className="pl-head">
          <h2>{p?.title || "Never miss a due date"}</h2>
          <div className="pl-chips">
            {["All", "GSTN", "CBDT", "MCA"].map((a) => (
              <button key={a} className={auth === a ? "on" : ""} onClick={() => setAuth(a)}>{a}</button>
            ))}
          </div>
        </div>
        <div className="pl-cards">
          {rows.map((d, i) => (
            <article key={i} className="pl-card">
              <span className={`pl-auth pl-auth-${d.authority.toLowerCase()}`}>{d.authority}</span>
              <h3>{d.title}</h3>
              <p>{d.form} · {d.category}</p>
              <time>{d.date}</time>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Reviews: horizontal snap scroller ──────────────────────────────────────────

function Reviews({ p }: { p: any }) {
  return (
    <section className="pl-section" id="testimonials">
      <div className="pl-wrap">
        <div className="pl-head"><h2>{p?.title || "Loved by busy founders"}</h2></div>
      </div>
      <div className="pl-scroller" tabIndex={0} aria-label="Client reviews">
        {SHARED_CLIENT_REVIEWS.slice(0, 6).map((r) => (
          <figure key={r.id} className="pl-review">
            <blockquote>{r.statement}</blockquote>
            <figcaption>
              <span className="pl-avatar">{r.clientInitials}</span>
              <span><strong>Client {r.clientInitials}</strong><small>{r.businessSector}</small></span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Cta({ p }: { p: any }) {
  const href = sanitizeLink(p?.buttonLink || p?.ctaLink, "#contact");
  return (
    <section className="pl-cta-wrap">
      <div className="pl-cta">
        <h2>{p?.headline || "Ready to hand off the paperwork?"}</h2>
        <p>{p?.subheadline || "Tell us what you need and we will reply within a working day."}</p>
        <a href={href} {...getLinkAttributes(href)} className="pl-btn pl-btn-white">{p?.buttonText || p?.ctaText || "Talk to a CA"} <ArrowRight size={16} /></a>
      </div>
    </section>
  );
}

function Contact({ p, config, shell }: { p: any; config: WebsiteConfig; shell: Shell }) {
  const chips = [
    [Phone, config.branding.phone || SHARED_FIRM_CONTACT.phone],
    [Mail, config.branding.email || SHARED_FIRM_CONTACT.email],
    [MapPin, config.branding.address || SHARED_FIRM_CONTACT.primaryOffice],
    [Clock, "Mon to Sat, 9:30 to 6:30"],
  ] as const;
  return (
    <section className="pl-section pl-tint" id="contact">
      <div id="about" style={{ display: "none" }} aria-hidden="true" />
      <div className="pl-wrap pl-contact">
        <div className="pl-head pl-center">
          <h2>{p?.title || "Let's talk"}</h2>
          <p>{p?.subtitle || "Share a few details and a partner will call you."}</p>
        </div>
        <div className="pl-chip-row">
          {chips.map(([Icon, t], i) => <span key={i} className="pl-info-chip"><Icon size={15} /> {t}</span>)}
        </div>
        <div id="pl-contact-form" className={`pl-form-card ${shell.formHighlight ? "pl-pulse" : ""}`}>
          <LeadForm config={config} selectedService={shell.selectedService} onServiceChange={shell.select} source="Pulse Form" />
        </div>
      </div>
    </section>
  );
}
