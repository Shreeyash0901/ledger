import React, { useEffect, useRef, useState } from "react";
import "./kinetic.css";
import { WebsiteConfig, SectionConfig, sanitizeLink, getLinkAttributes } from "website-core";
import { ArrowUpRight, Check, Phone, Mail, MapPin, Clock, ShieldCheck, FileCheck2 } from "lucide-react";
import { SHARED_SERVICES, SHARED_TAX_DATES, SHARED_CLIENT_REVIEWS, SHARED_FIRM_CONTACT } from "../../fixtures/sharedData";
import { useShell, NavItems, LeadForm, SiteFooter } from "../shared/parts";

import { PracticeGallerySection } from "../../components/PracticeGallerySection";

export interface KineticTemplateProps {
  config: WebsiteConfig;
}

type Shell = ReturnType<typeof useShell>;

// ─── Animation helpers ──────────────────────────────────────────────────────────

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || prefersReduced()) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`kn-reveal ${seen ? "in" : ""} ${className}`} style={{ ["--d" as any]: `${delay}ms` }}>
      {children}
    </div>
  );
}

function CountUp({ to, suffix = "", duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (prefersReduced()) { setVal(to); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);
  return <span ref={ref}>{val.toLocaleString("en-IN")}{suffix}</span>;
}

// ─── Main ───────────────────────────────────────────────────────────────────────

export function KineticTemplate({ config }: KineticTemplateProps) {
  const page = config.pages[0];
  const shell = useShell("kn-hero-form");
  const firm = config.branding.firmName || "Kinetic CA";
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
      setScrolled(h.scrollTop > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="kinetic-root">
      <div className="kn-progress" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden />
      <header className={`kn-header ${scrolled ? "scrolled" : ""}`}>
        <div className="kn-header-inner">
          <a href="#home" className="kn-brand">
            {config.branding.logoUrl ? <img src={config.branding.logoUrl} alt={firm} style={{ maxHeight: 32 }} /> : (<><span className="kn-logo" aria-hidden />{firm}</>)}
          </a>
          <nav className="kn-nav" aria-label="Main">
            <NavItems
              config={config}
              linkClass="kn-nav-link"
              menu={shell.menu}
              onSelect={shell.select}
              fallback={[["Services", "#services"], ["Process", "#process"], ["Due dates", "#tax-calendar"], ["Reviews", "#testimonials"], ["Contact", "#contact"]]}
            />
          </nav>
          {config.header.headerCta?.enabled !== false && (
            <a href="#contact" className="kn-btn kn-btn-sm" onClick={(e) => { e.preventDefault(); shell.select(shell.selectedService); }}>
              {config.header.headerCta?.label || "Free consultation"}
            </a>
          )}
        </div>
      </header>

      <main>
        {page?.sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order).map((sec) => (
          <Router key={sec.id} sec={sec} config={config} shell={shell} />
        ))}
      </main>

      <SiteFooter config={config} />
    </div>
  );
}

function Router({ sec, config, shell }: { sec: SectionConfig; config: WebsiteConfig; shell: Shell }) {
  const p = sec.props;
  switch (sec.type) {
    case "hero": return <Hero p={p} config={config} shell={shell} />;
    case "services": return <Services p={p} shell={shell} />;
    case "tax-calendar": return <Calendar p={p} />;
    case "testimonials": return <Reviews p={p} />;
    case "cta": return <Cta p={p} />;
    case "contact": return <Contact p={p} config={config} shell={shell} />;
    default: return null;
  }
}

// ─── Hero: word-by-word headline + animated growth chart ────────────────────────

const BARS = [38, 52, 44, 68, 60, 82, 96];
const MARQUEE = ["GST Returns", "Income Tax", "Company Law", "Statutory Audit", "TDS", "Bookkeeping", "Startup India", "FEMA", "Payroll"];

function Hero({ p, config, shell }: { p: any; config: WebsiteConfig; shell: Shell }) {
  const headline: string = p?.headline || "Financial clarity for businesses that mean to grow.";
  const stats = p?.stats || [
    { value: 1200, suffix: "+", label: "Returns filed" },
    { value: 350, suffix: "+", label: "Active clients" },
    { value: 15, suffix: "", label: "Years of practice" },
  ];

  return (
    <>
      <section className="kn-hero" id="home">
        <div className="kn-blob kn-blob-a" aria-hidden />
        <div className="kn-blob kn-blob-b" aria-hidden />
        <div className="kn-hero-inner">
          <div className="kn-hero-copy">
            <p className="kn-badge"><ShieldCheck size={15} /> ICAI-registered chartered accountants</p>
            <h1 className="kn-h1" aria-label={headline}>
              {headline.split(" ").map((w, i) => (
                <span key={i} className="kn-word" style={{ ["--i" as any]: i }} aria-hidden>{w}&nbsp;</span>
              ))}
            </h1>
            <p className="kn-hero-sub">{p?.subheadline || "Audit, tax and compliance handled end to end, with every return reviewed by a CA before it is filed."}</p>
            <div className="kn-hero-actions">
              <a href="#contact" className="kn-btn" onClick={(e) => { e.preventDefault(); shell.select(shell.selectedService); }}>
                {p?.primaryCtaText || "Book a free consultation"} <ArrowUpRight size={17} />
              </a>
              <a href="#process" className="kn-btn kn-btn-ghost">{p?.secondaryCtaText || "How we work"}</a>
            </div>
          </div>

          <div className="kn-hero-visual" aria-hidden>
            <svg viewBox="0 0 440 320" className="kn-chart">
              <defs>
                <linearGradient id="knBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#3ddc97" /><stop offset="1" stopColor="#12a150" />
                </linearGradient>
              </defs>
              {[60, 120, 180, 240].map((y) => <line key={y} x1="20" x2="420" y1={y} y2={y} className="kn-gl" />)}
              {BARS.map((h, i) => (
                <rect key={i} x={40 + i * 55} y={280 - h * 2.4} width="34" height={h * 2.4} rx="9" fill="url(#knBar)" className="kn-bar" style={{ ["--i" as any]: i }} />
              ))}
              <path d="M57 200 L112 168 L167 182 L222 126 L277 144 L332 92 L387 52" className="kn-line" />
              <circle cx="387" cy="52" r="7" className="kn-dot" />
            </svg>
            <div className="kn-float kn-float-a"><Check size={16} /> GSTR-3B filed</div>
            <div className="kn-float kn-float-b"><FileCheck2 size={16} /> ITC matched</div>
          </div>
        </div>

        <div className="kn-stats">
          {stats.map((s: any, i: number) => (
            <div key={i} className="kn-stat">
              <b><CountUp to={s.value} suffix={s.suffix} /></b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="kn-marquee" aria-hidden>
        <div className="kn-marquee-track">
          {[...MARQUEE, ...MARQUEE].map((m, i) => <span key={i}>{m}</span>)}
        </div>
      </div>
    </>
  );
}

// ─── Services (spotlight cards) + process steps ─────────────────────────────────

const STEPS = [
  ["Discuss", "A short call to understand your business and what you need filed."],
  ["Share documents", "Upload securely. We tell you exactly what is missing."],
  ["CA review and filing", "A chartered accountant reviews, files and confirms."],
  ["Track and support", "Reminders for the next deadline and help with any notice."],
];

function Services({ p, shell }: { p: any; shell: Shell }) {
  const ids = Array.isArray(p?.visibleServiceIds) ? p.visibleServiceIds : null;
  const list = ids !== null ? SHARED_SERVICES.filter((s) => ids.includes(s.id)) : SHARED_SERVICES;

  const spot = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <>
      <section className="kn-section" id="services">
        <div className="kn-wrap">
          <Reveal>
            <h2 className="kn-h2">{p?.title || "Services built around your compliance calendar"}</h2>
            <p className="kn-lede">{p?.subtitle || "Select a service and we will pre-fill your consultation request."}</p>
          </Reveal>
          <div className="kn-grid">
            {list.slice(0, 6).map((s, i) => (
              <Reveal key={s.id} delay={i * 70}>
                <button type="button" className="kn-card" onMouseMove={spot} onClick={() => shell.select(s.title)}>
                  <span className="kn-card-title">{s.title}</span>
                  <span className="kn-card-desc">{s.description}</span>
                  <span className="kn-card-go">Get a quote <ArrowUpRight size={16} /></span>
                </button>
              </Reveal>
            ))}
          </div>

          <PracticeGallerySection
            tiles={p?.galleryTiles}
            title={p?.galleryTitle || "Specialized Advisory Desks"}
            tagline={p?.galleryTagline || "FULL PRACTICE SPECTRUM"}
            subtitle={p?.gallerySubtitle || "Specialized desks for company incorporation, GST compliance, startup India, and tax audits."}
            variant="fintech"
            onSelectService={shell.select}
          />
        </div>
      </section>

      <section className="kn-section kn-dark" id="process">
        <div className="kn-wrap">
          <Reveal><h2 className="kn-h2">Four steps from first call to filed return</h2></Reveal>
          <ol className="kn-steps">
            {STEPS.map(([t, d], i) => (
              <li key={t}>
                <Reveal delay={i * 140}>
                  <span className="kn-step-n">{i + 1}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

// ─── Calendar ───────────────────────────────────────────────────────────────────

function Calendar({ p }: { p: any }) {
  const [auth, setAuth] = useState("All");
  const rows = SHARED_TAX_DATES.filter((d) => auth === "All" || d.authority === auth);
  return (
    <section className="kn-section" id="tax-calendar">
      <div className="kn-wrap">
        <Reveal>
          <div className="kn-row">
            <h2 className="kn-h2">{p?.title || "Upcoming statutory deadlines"}</h2>
            <div className="kn-tabs" role="tablist">
              {["All", "GSTN", "CBDT", "MCA"].map((a) => (
                <button key={a} role="tab" aria-selected={auth === a} className={auth === a ? "on" : ""} onClick={() => setAuth(a)}>{a}</button>
              ))}
            </div>
          </div>
        </Reveal>
        <ul className="kn-dates" key={auth}>
          {rows.map((d, i) => (
            <li key={i} style={{ ["--i" as any]: i }}>
              <time><b>{d.date.split(" ")[0]}</b>{d.date.split(" ").slice(1).join(" ")}</time>
              <div><strong>{d.title}</strong><span>{d.form} · {d.authority} · {d.category}</span></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── Reviews: auto-rotating with progress bar ───────────────────────────────────

function Reviews({ p }: { p: any }) {
  const list = SHARED_CLIENT_REVIEWS.slice(0, 4);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || prefersReduced() || list.length < 2) return;
    const t = setTimeout(() => setI((n) => (n + 1) % list.length), 6000);
    return () => clearTimeout(t);
  }, [i, paused, list.length]);
  if (!list.length) return null;
  const r = list[i];

  return (
    <section className="kn-section kn-tint" id="testimonials">
      <div className="kn-wrap kn-review-wrap" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <Reveal><h2 className="kn-h2">{p?.title || "Clients who stopped worrying about deadlines"}</h2></Reveal>
        <figure className="kn-review" key={r.id}>
          <blockquote>{r.statement}</blockquote>
          <figcaption><span className="kn-avatar">{r.clientInitials}</span><span><strong>Client {r.clientInitials}</strong><small>{r.businessSector}</small></span></figcaption>
        </figure>
        <div className="kn-dots">
          {list.map((x, n) => (
            <button key={x.id} aria-label={`Review ${n + 1}`} className={n === i ? "on" : ""} onClick={() => setI(n)}>
              <span style={n === i && !paused && !prefersReduced() ? { animation: "knFill 6s linear forwards" } : undefined} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta({ p }: { p: any }) {
  const href = sanitizeLink(p?.buttonLink || p?.ctaLink, "#contact");
  return (
    <section className="kn-cta-wrap">
      <Reveal>
        <div className="kn-cta">
          <div className="kn-cta-in">
            <h2>{p?.headline || "Let a CA take the next filing off your plate."}</h2>
            <a href={href} {...getLinkAttributes(href)} className="kn-btn">{p?.buttonText || p?.ctaText || "Talk to a CA"} <ArrowUpRight size={17} /></a>
          </div>
        </div>
      </Reveal>
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
    <section className="kn-section" id="contact">
      <div id="about" style={{ display: "none" }} aria-hidden="true" />
      <div className="kn-wrap kn-contact">
        <Reveal>
          <h2 className="kn-h2">{p?.title || "Talk to a partner"}</h2>
          <ul className="kn-contact-list">
            {rows.map(([Icon, t], i) => <li key={i}><span><Icon size={18} /></span>{t}</li>)}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <div id="kn-hero-form" className={`kn-form-card ${shell.formHighlight ? "kn-pulse" : ""}`}>
            <h3>Request a callback</h3>
            <LeadForm config={config} selectedService={shell.selectedService} onServiceChange={shell.select} source="Kinetic Form" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
