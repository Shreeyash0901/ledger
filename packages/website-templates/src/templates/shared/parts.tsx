import React, { useRef, useState } from "react";
import "./parts.css";
import { WebsiteConfig, sanitizeLink, getLinkAttributes, DEFAULT_MEGA_MENU_CONFIG } from "website-core";
import { CheckCircle2, ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import { SHARED_SERVICES, SHARED_FIRM_CONTACT } from "../../fixtures/sharedData";
import { SocialIcon } from "../../components/SocialIcon";
import { TemplateServicesDropdown } from "../../components/TemplateServicesDropdown";

// ─── Shell state: selected service, form highlight, services menu ───────────────

export function useShell(formId: string) {
  const [selectedService, setSelectedService] = useState("Company Incorporation");
  const [formHighlight, setFormHighlight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const timer = useRef<any>(null);

  const menu = {
    isOpen: menuOpen,
    open: () => {
      if (timer.current) clearTimeout(timer.current);
      setMenuOpen(true);
    },
    closeSoon: () => {
      timer.current = setTimeout(() => setMenuOpen(false), 200);
    },
    close: () => setMenuOpen(false),
    toggle: () => setMenuOpen((p) => !p),
  };

  const select = (title: string) => {
    setSelectedService(title);
    setMenuOpen(false);
    setFormHighlight(true);
    setTimeout(() => setFormHighlight(false), 1800);
    const el = document.getElementById(formId) || document.getElementById("contact");
    if (el && typeof el.scrollIntoView === "function") el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return { selectedService, select, formHighlight, menu };
}

// ─── Nav items with services dropdown ───────────────────────────────────────────

export function NavItems({
  config,
  fallback,
  linkClass,
  menu,
  onSelect,
  variant,
}: {
  config: WebsiteConfig;
  fallback: [string, string][];
  linkClass: string;
  menu: ReturnType<typeof useShell>["menu"];
  onSelect: (s: string) => void;
  variant?: "corporate" | "fintech" | "classic" | "minimal" | "accountax" | "ledger";
}) {
  const links = (config.header.navLinks || []).filter((l) => l.enabled);
  const items: [string, string][] = links.length ? links.map((l) => [l.label, l.url]) : fallback;

  return (
    <>
      {items.map(([label, url], i) => {
        const safe = sanitizeLink(url, "#");
        if (!label.toLowerCase().includes("service")) {
          return (
            <a key={i} href={safe} {...getLinkAttributes(safe)} className={linkClass}>
              {label}
            </a>
          );
        }
        return (
          <div key={i} className="tf-nav-services" onMouseEnter={menu.open} onMouseLeave={menu.closeSoon}>
            <a
              href={safe}
              className={linkClass}
              aria-expanded={menu.isOpen}
              onClick={(e) => {
                e.preventDefault();
                menu.toggle();
              }}
            >
              {label}
              <ChevronDown size={14} style={{ marginLeft: 4, transform: menu.isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
            </a>
            <TemplateServicesDropdown
              isOpen={menu.isOpen}
              onClose={menu.close}
              onSelectService={onSelect}
              variant={variant || (config.templateId === "ledger" ? "ledger" : "corporate")}
              megaMenu={config.header.megaMenu}
              onMouseEnter={menu.open}
              onMouseLeave={menu.closeSoon}
            />
          </div>
        );
      })}
    </>
  );
}

// ─── Lead form (same storage contract as Accountax / Lumen) ─────────────────────

export function LeadForm({
  config,
  selectedService,
  onServiceChange,
  source,
  submitLabel = "Request a free consultation",
}: {
  config: WebsiteConfig;
  selectedService: string;
  onServiceChange: (s: string) => void;
  source: string;
  submitLabel?: string;
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
      source,
      submittedAt: new Date().toISOString(),
      status: "new",
      notes: `Lead from ${source} for ${selectedService}`,
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
      <div className="tf-done" role="status">
        <CheckCircle2 size={32} />
        <h4>Request received</h4>
        <p>A chartered accountant will call <strong>{data.mobile}</strong> within 24 hours.</p>
        <button type="button" className="tf-link-btn" onClick={() => { setDone(false); setData({ name: "", mobile: "", city: "" }); }}>
          Send another request
        </button>
      </div>
    );
  }

  const menu = config.header.megaMenu || DEFAULT_MEGA_MENU_CONFIG;
  const options: string[] = Array.from(
    new Set(
      menu?.categories?.length
        ? menu.categories.flatMap((c) => (c.items || []).map((i) => i.label))
        : SHARED_SERVICES.map((s) => s.title)
    )
  );
  if (!options.includes(selectedService)) options.unshift(selectedService);

  return (
    <form onSubmit={submit} className="tf-form">
      <label className="tf-field">
        <span>Your name</span>
        <input required value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Rahul Sharma" />
      </label>
      <div className="tf-row">
        <label className="tf-field">
          <span>Phone</span>
          <input required type="tel" value={data.mobile} onChange={(e) => setData({ ...data, mobile: e.target.value })} placeholder="10-digit mobile" />
        </label>
        <label className="tf-field">
          <span>City</span>
          <input value={data.city} onChange={(e) => setData({ ...data, city: e.target.value })} placeholder="Nagpur" />
        </label>
      </div>
      <label className="tf-field">
        <span>What do you need?</span>
        <select value={selectedService} onChange={(e) => onServiceChange(e.target.value)}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </label>
      <button type="submit" className="tf-submit">{submitLabel}</button>
    </form>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────────

export function SiteFooter({ config }: { config: WebsiteConfig }) {
  const firm = config.branding.firmName || "Your CA Firm";
  const groups = (config.footer.quickLinkGroups || []).filter((g) => g.title && g.links?.length > 0);
  const socials = config.footer.socialLinks || [];
  return (
    <footer className="tf-footer">
      <div className="tf-footer-grid">
        <div>
          <div className="tf-footer-brand">{firm}</div>
          <p>{config.branding.tagline || "Accounting, tax and compliance handled by chartered accountants."}</p>
          <div className="tf-footer-contact">
            <span><MapPin size={14} /> {config.branding.address || SHARED_FIRM_CONTACT.primaryOffice}</span>
            <span><Phone size={14} /> {config.branding.phone || SHARED_FIRM_CONTACT.phone}</span>
            <span><Mail size={14} /> {config.branding.email || SHARED_FIRM_CONTACT.email}</span>
          </div>
          {socials.length > 0 && (
            <div className="tf-socials">
              {socials.map((s, i) => (
                <a key={i} href={sanitizeLink(s.url, "#")} {...getLinkAttributes(sanitizeLink(s.url, "#"))} aria-label={s.platform}>
                  <SocialIcon platform={s.platform} size={15} />
                </a>
              ))}
            </div>
          )}
        </div>
        {(groups.length
          ? groups.map((g) => ({ title: g.title, links: g.links.filter((l) => l.label && l.url).map((l) => [l.label, l.url] as [string, string]) }))
          : [
              { title: "Services", links: [["Incorporation", "#services"], ["GST", "#services"], ["Income tax", "#services"], ["Audit", "#services"]] as [string, string][] },
              { title: "Firm", links: [["Due dates", "#tax-calendar"], ["Reviews", "#testimonials"], ["Contact", "#contact"]] as [string, string][] },
            ]
        ).map((g) => (
          <div key={g.title}>
            <h4>{g.title}</h4>
            <ul>
              {g.links.map(([label, url]) => (
                <li key={label}><a href={sanitizeLink(url, "#")} {...getLinkAttributes(sanitizeLink(url, "#"))}>{label}</a></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4>Office hours</h4>
          <p>Monday to Saturday<br />9:30 AM to 6:30 PM IST</p>
        </div>
      </div>
      {config.footer.icaiDisclaimer && (
        <p className="tf-disclaimer">
          {config.footer.disclaimerText ||
            "In accordance with the Chartered Accountants Act, 1949 and ICAI guidelines, this website provides factual information about the firm's practice areas. It is not an advertisement, solicitation or invitation to offer work."}
        </p>
      )}
      <div className="tf-footer-bottom">{config.footer.copyrightText || `© ${new Date().getFullYear()} ${firm}. All rights reserved.`}</div>
    </footer>
  );
}
