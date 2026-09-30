import React, { useState } from "react";
import "./ledger.css";
import { WebsiteConfig, SectionConfig, sanitizeLink, getLinkAttributes } from "website-core";
import { ArrowRight, ArrowLeft, Plus, Phone, Mail, MapPin, Clock, Calculator, ShieldCheck, Award, FileCheck, CheckCircle2 } from "lucide-react";
import { SHARED_SERVICES, SHARED_TAX_DATES, SHARED_CLIENT_REVIEWS, SHARED_FIRM_CONTACT } from "../../fixtures/sharedData";
import { useShell, NavItems, LeadForm, SiteFooter } from "../shared/parts";
import { PracticeGallerySection } from "../../components/PracticeGallerySection";

export interface LedgerTemplateProps {
  config: WebsiteConfig;
}

export function LedgerTemplate({ config }: LedgerTemplateProps) {
  const page = config.pages[0];
  const shell = useShell("lg-hero-form");
  const firm = config.branding.firmName || "Ledger & Co.";

  return (
    <div className="ledger-root">
      <header className="lg-header">
        <div className="lg-header-inner">
          <a href="#home" className="lg-brand">
            {config.branding.logoUrl ? (
              <img src={config.branding.logoUrl} alt={firm} style={{ maxHeight: 34 }} />
            ) : (
              firm
            )}
          </a>
          <nav className="lg-nav" aria-label="Main">
            <NavItems
              config={config}
              linkClass="lg-nav-link"
              menu={shell.menu}
              onSelect={shell.select}
              variant="ledger"
              fallback={[
                ["Services", "#services"],
                ["Tax Calendar", "#tax-calendar"],
                ["Calculators", "#calculators"],
                ["About", "#about"],
                ["Clients", "#testimonials"],
                ["Contact", "#contact"],
              ]}
            />
          </nav>
          {config.header.headerCta?.enabled !== false && (
            <a href="#contact" className="lg-cta-link" onClick={(e) => { e.preventDefault(); shell.select(shell.selectedService); }}>
              {config.header.headerCta?.label || "Book a call"} <ArrowRight size={15} />
            </a>
          )}
        </div>
      </header>

      <main>
        {page?.sections
          .filter((s) => s.enabled)
          .sort((a, b) => a.order - b.order)
          .map((sec) => (
            <Router key={sec.id} sec={sec} config={config} shell={shell} />
          ))}
      </main>

      <SiteFooter config={config} />
    </div>
  );
}

type Shell = ReturnType<typeof useShell>;

function Router({ sec, config, shell }: { sec: SectionConfig; config: WebsiteConfig; shell: Shell }) {
  const p = sec.props;
  switch (sec.type) {
    case "hero": return <Hero p={p} config={config} shell={shell} />;
    case "services": return <Services p={p} shell={shell} />;
    case "tax-calendar": return <Calendar p={p} />;
    case "calculators": return <Calculators p={p} />;
    case "about": return <About p={p} config={config} />;
    case "testimonials": return <Quotes p={p} />;
    case "cta": return <Cta p={p} />;
    case "contact": return <Contact p={p} config={config} shell={shell} />;
    default: return null;
  }
}

// ─── Hero: oversized serif headline left, ultramarine form panel right ──────────

function Hero({ p, config, shell }: { p: any; config: WebsiteConfig; shell: Shell }) {
  const heroImg = p?.imageUrl || "/hero-advisory.jpg";
  return (
    <section className="lg-hero" id="home">
      <div
        className="lg-hero-copy"
        style={
          heroImg
            ? {
                backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.45) 60%, rgba(255, 255, 255, 0.65) 100%), url(${heroImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <h1>{p?.headline || "The accounting firm that answers before the notice arrives."}</h1>
        <p>
          {p?.subheadline ||
            "Statutory audit, GST, income tax and company law, signed off by chartered accountants who know your file."}
        </p>
        <div className="lg-hero-links">
          <a href="#services" className="lg-arrow-link">{p?.secondaryCtaText || "Browse services"} <ArrowRight size={16} /></a>
          <a href="#tax-calendar" className="lg-arrow-link">Check due dates <ArrowRight size={16} /></a>
        </div>
      </div>
      <aside id="lg-hero-form" className={`lg-hero-panel ${shell.formHighlight ? "lg-flash" : ""}`}>
        <h2>Start with a conversation</h2>
        <p>Free, 20 minutes, no obligation.</p>
        <LeadForm config={config} selectedService={shell.selectedService} onServiceChange={shell.select} source="Ledger Form" submitLabel="Request a call back" />
      </aside>
    </section>
  );
}

// ─── Services: expandable index rows ────────────────────────────────────────────

function Services({ p, shell }: { p: any; shell: Shell }) {
  const [open, setOpen] = useState<string | null>(null);
  const ids = Array.isArray(p?.visibleServiceIds) ? p.visibleServiceIds : null;
  const list = ids !== null ? SHARED_SERVICES.filter((s) => ids.includes(s.id)) : SHARED_SERVICES;

  return (
    <section className="lg-section" id="services">
      <div className="lg-wrap">
        <h2 className="lg-h2">{p?.title || "What we do"}</h2>
        <ul className="lg-index">
          {list.map((s) => {
            const isOpen = open === s.id;
            return (
              <li key={s.id} className={isOpen ? "open" : ""}>
                <button type="button" className="lg-index-row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : s.id)}>
                  <span className="lg-index-title">{s.title}</span>
                  <span className="lg-index-plus"><Plus size={22} /></span>
                </button>
                <div className="lg-index-body">
                  <div>
                    <p>{s.description}</p>
                    <button type="button" className="lg-solid-btn" onClick={() => shell.select(s.title)}>
                      Ask about {s.title.toLowerCase()} <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Specialized Advisory Desks / Practice Visual Gallery */}
        <PracticeGallerySection
          tiles={p?.galleryTiles}
          title={p?.galleryTitle || "Specialized Advisory Desks"}
          tagline={p?.galleryTagline || "FULL PRACTICE SPECTRUM"}
          subtitle={p?.gallerySubtitle || "Specialized desks for company incorporation, GST compliance, startup India, and tax audits."}
          variant="classic"
          onSelectService={shell.select}
        />
      </div>
    </section>
  );
}

// ─── Calendar: table ────────────────────────────────────────────────────────────

function Calendar({ p }: { p: any }) {
  const [auth, setAuth] = useState("All");
  const rows = SHARED_TAX_DATES.filter((d) => auth === "All" || d.authority === auth);
  return (
    <section className="lg-section lg-tint" id="tax-calendar">
      <div className="lg-wrap">
        <div className="lg-head-row">
          <h2 className="lg-h2">{p?.title || "Filing dates"}</h2>
          <div className="lg-filters">
            {["All", "GSTN", "CBDT", "MCA"].map((a) => (
              <button key={a} className={auth === a ? "on" : ""} onClick={() => setAuth(a)}>{a}</button>
            ))}
          </div>
        </div>
        <div className="lg-table-wrap">
          <table className="lg-table">
            <thead><tr><th>Due</th><th>Filing</th><th>Form</th><th>Authority</th></tr></thead>
            <tbody>
              {rows.map((d, i) => (
                <tr key={i}>
                  <td className="lg-date">{d.date}</td>
                  <td>{d.title}</td>
                  <td>{d.form}</td>
                  <td>{d.authority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── Calculators ────────────────────────────────────────────────────────────

function Calculators({ p }: { p: any }) {
  const [gstAmount, setGstAmount] = useState<number>(50000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [income, setIncome] = useState<number>(1200000);

  const gstTax = Math.round((gstAmount * gstRate) / 100);
  const gstTotal = gstAmount + gstTax;

  // New regime simplified tax computation (FY 2026-27 standard slab)
  const calcNewRegime = (inc: number) => {
    if (inc <= 300000) return 0;
    if (inc <= 700000) return Math.round((inc - 300000) * 0.05);
    if (inc <= 1000000) return Math.round(20000 + (inc - 700000) * 0.10);
    if (inc <= 1200000) return Math.round(50000 + (inc - 1000000) * 0.15);
    if (inc <= 1500000) return Math.round(80000 + (inc - 1200000) * 0.20);
    return Math.round(140000 + (inc - 1500000) * 0.30);
  };
  const estTax = calcNewRegime(income);

  return (
    <section className="lg-section lg-tint" id="calculators">
      <div className="lg-wrap">
        <h2 className="lg-h2">{p?.title || "Financial & Tax Calculators"}</h2>
        <p className="lg-subhead">{p?.subtitle || "Instant estimations for GST liability, tax regime planning, and compliance."}</p>

        <div className="lg-calc-grid">
          {/* GST Calculator */}
          <div className="lg-calc-card">
            <div className="lg-calc-head">
              <Calculator size={22} className="lg-calc-icon" />
              <h3>GST Liability Estimator</h3>
            </div>
            <div className="lg-calc-body">
              <label className="lg-calc-field">
                <span>Net Transaction Amount (₹)</span>
                <input
                  type="number"
                  value={gstAmount}
                  onChange={(e) => setGstAmount(Math.max(0, Number(e.target.value)))}
                />
              </label>
              <label className="lg-calc-field">
                <span>GST Slab Rate</span>
                <select value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))}>
                  <option value={5}>5% (Essential items / transport)</option>
                  <option value={12}>12% (Standard goods / software)</option>
                  <option value={18}>18% (Professional advisory & IT)</option>
                  <option value={28}>28% (Luxury & sin goods)</option>
                </select>
              </label>
              <div className="lg-calc-results">
                <div><span>GST Tax:</span> <strong>₹{gstTax.toLocaleString("en-IN")}</strong></div>
                <div><span>Total Invoice:</span> <strong>₹{gstTotal.toLocaleString("en-IN")}</strong></div>
              </div>
            </div>
          </div>

          {/* Tax Regime Calculator */}
          <div className="lg-calc-card">
            <div className="lg-calc-head">
              <Calculator size={22} className="lg-calc-icon" />
              <h3>New Regime Tax Estimator (Sec 115BAC)</h3>
            </div>
            <div className="lg-calc-body">
              <label className="lg-calc-field">
                <span>Annual Taxable Income (₹)</span>
                <input
                  type="number"
                  value={income}
                  step={50000}
                  onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
                />
              </label>
              <div className="lg-calc-results" style={{ marginTop: 24 }}>
                <div><span>Estimated Tax Liability:</span> <strong>₹{estTax.toLocaleString("en-IN")}</strong></div>
                <div><span>Effective Surcharge & Cess:</span> <span>Inclusive of 4% standard cess</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────

function About({ p, config }: { p?: any; config: WebsiteConfig }) {
  const firm = config.branding.firmName || "Ledger & Co.";
  return (
    <section className="lg-section" id="about">
      <div className="lg-wrap lg-about-wrap">
        <div className="lg-about-header">
          <span className="lg-tag">About the Practice</span>
          <h2 className="lg-h2">{p?.title || `Excellence in Statutory Audit, Tax & Corporate Governance`}</h2>
          <p className="lg-about-lede">
            {p?.description ||
              `${firm} is a premier Chartered Accountancy firm delivering rigorous statutory compliance, taxation strategy, startup advisory, and corporate structuring. Founded with the conviction that timely compliance drives enterprise resilience.`}
          </p>
        </div>

        <div className="lg-about-grid">
          <div className="lg-about-card">
            <ShieldCheck size={28} className="lg-about-icon" />
            <h3>ICAI Standards of Practice</h3>
            <p>Every assignment is supervised by certified Chartered Accountants adhering to the highest ethical and statutory benchmarks.</p>
          </div>
          <div className="lg-about-card">
            <Award size={28} className="lg-about-icon" />
            <h3>Multi-Disciplinary Advisory</h3>
            <p>From company incorporation and ROC filings to cross-border transfer pricing and FEMA compliance desks.</p>
          </div>
          <div className="lg-about-card">
            <FileCheck size={28} className="lg-about-icon" />
            <h3>Zero-Delay Filing Assurance</h3>
            <p>Proactive compliance monitoring to safeguard your business against statutory penalties, late fees, and scrutiny notices.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Quotes: one at a time with prev/next ───────────────────────────────────────

function Quotes({ p }: { p: any }) {
  const list = SHARED_CLIENT_REVIEWS.slice(0, 5);
  const [i, setI] = useState(0);
  if (!list.length) return null;
  const r = list[i];
  return (
    <section className="lg-section" id="testimonials">
      <div className="lg-wrap lg-quote-wrap">
        <h2 className="lg-h2">{p?.title || "In their words"}</h2>
        <blockquote className="lg-quote" key={r.id}>{r.statement}</blockquote>
        <div className="lg-quote-foot">
          <div>
            <strong>Client {r.clientInitials}</strong>
            <span>{r.businessSector}</span>
          </div>
          <div className="lg-stepper">
            <button aria-label="Previous review" onClick={() => setI((i - 1 + list.length) % list.length)}><ArrowLeft size={18} /></button>
            <span>{i + 1} / {list.length}</span>
            <button aria-label="Next review" onClick={() => setI((i + 1) % list.length)}><ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Cta({ p }: { p: any }) {
  const href = sanitizeLink(p?.buttonLink || p?.ctaLink, "#contact");
  return (
    <section className="lg-cta">
      <div className="lg-wrap">
        <h2>{p?.headline || "Bring us the messy file."}</h2>
        <a href={href} {...getLinkAttributes(href)} className="lg-cta-btn">{p?.buttonText || p?.ctaText || "Book a call"} <ArrowRight size={18} /></a>
      </div>
    </section>
  );
}

function Contact({ p, config, shell }: { p: any; config: WebsiteConfig; shell: Shell }) {
  const rows = [
    [MapPin, config.branding.address || SHARED_FIRM_CONTACT.primaryOffice],
    [Phone, config.branding.phone || SHARED_FIRM_CONTACT.phone],
    [Mail, config.branding.email || SHARED_FIRM_CONTACT.email],
    [Clock, "Mon to Sat, 9:30 AM to 6:30 PM"],
  ] as const;
  return (
    <section className="lg-section" id="contact">
      <div className="lg-wrap lg-contact">
        <div>
          <h2 className="lg-h2">{p?.title || "Visit or call the office"}</h2>
          <ul className="lg-contact-list">
            {rows.map(([Icon, text], i) => (
              <li key={i}><Icon size={18} /> <span>{text}</span></li>
            ))}
          </ul>
        </div>
        <div className="lg-contact-form">
          <LeadForm config={config} selectedService={shell.selectedService} onServiceChange={shell.select} source="Ledger Form" />
        </div>
      </div>
    </section>
  );
}
