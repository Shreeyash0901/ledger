export interface ServiceItemDef {
  title: string;
  description?: string;
  badge?: string;
  popular?: boolean;
  estimatedValue?: number;
}

export interface ServiceCategoryDef {
  title: string;
  items: ServiceItemDef[];
}

export const STANDARD_SERVICES_CATALOG: ServiceCategoryDef[] = [
  {
    title: "Company Registration & MCA",
    items: [
      { title: "Private Limited Company Registration", popular: true, estimatedValue: 6999 },
      { title: "LLP Registration", estimatedValue: 5999 },
      { title: "One Person Company (OPC)", estimatedValue: 5499 },
      { title: "Company Annual ROC Compliances", estimatedValue: 7999 },
    ],
  },
  {
    title: "Taxation & GST",
    items: [
      { title: "GST Registration & Return Filing", popular: true, estimatedValue: 2499 },
      { title: "Income Tax & ITR Filing", popular: true, estimatedValue: 1999 },
      { title: "TDS / TCS Quarterly Filing", estimatedValue: 2999 },
      { title: "Tax Notice & Assessment Advisory", estimatedValue: 4999 },
    ],
  },
  {
    title: "Audit & Assurance",
    items: [
      { title: "Statutory Audit under Companies Act", estimatedValue: 14999 },
      { title: "Tax Audit under Section 44AB", estimatedValue: 9999 },
      { title: "Internal Financial Controls Review", estimatedValue: 11999 },
    ],
  },
  {
    title: "Advisory & Compliance",
    items: [
      { title: "MSME Udyam & Startup India", estimatedValue: 1499 },
      { title: "Trademark & Brand Protection", popular: true, estimatedValue: 3499 },
      { title: "Accounting & Monthly Bookkeeping", estimatedValue: 3999 },
      { title: "Virtual CFO & MIS Advisory", estimatedValue: 8999 },
    ],
  },
];

export const ALL_SERVICE_NAMES: string[] = STANDARD_SERVICES_CATALOG.flatMap((cat) =>
  cat.items.map((it) => it.title)
);

export async function submitTemplateLead(data: {
  name: string;
  phone: string;
  email?: string;
  serviceInterest: string;
  city?: string;
  notes?: string;
  sourceTemplate?: string;
}) {
  const generatedCode = `LD-2627-${Math.floor(10000 + Math.random() * 90000)}`;
  const leadId = `lead-${Date.now()}`;
  const nowIso = new Date().toISOString();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const newLead = {
    id: leadId,
    leadCode: generatedCode,
    name: data.name.trim(),
    country: data.city?.trim() || "India",
    phone: data.phone.trim(),
    email: data.email?.trim() || null,
    serviceInterest: data.serviceInterest,
    stage: "NEW_LEAD" as const,
    source: `Website - ${data.sourceTemplate || "Service Form"}`,
    value: 4999,
    ownerName: "Unassigned",
    followUpDate: tomorrow,
    notes: data.notes?.trim()
      ? `Website inquiry for ${data.serviceInterest}. City: ${data.city || "Not specified"}. Note: ${data.notes.trim()}`
      : `Website inquiry for ${data.serviceInterest}. City: ${data.city || "Not specified"}`,
    createdAt: nowIso,
  };

  if (typeof window !== "undefined") {
    const payload = JSON.stringify(newLead);
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    }).catch(() => {});

    if (window.location.port !== "3001") {
      fetch("http://localhost:3001/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: payload,
      }).catch(() => {});
    }

    try {
      const CRM_KEY = "activedesk_crm_leads_v1";
      const existingRaw = localStorage.getItem(CRM_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [newLead, ...existing.filter((item: any) => item.id !== newLead.id)];
      localStorage.setItem(CRM_KEY, JSON.stringify(updated));
    } catch {}

    try {
      const MGMT_KEY = "activedesk_website_mgmt_dashboard_v1";
      const existingRaw = localStorage.getItem(MGMT_KEY);
      const dashboardData = existingRaw ? JSON.parse(existingRaw) : {};
      const existingLeads = Array.isArray(dashboardData.leads) ? dashboardData.leads : [];
      dashboardData.leads = [
        {
          id: leadId,
          name: newLead.name,
          email: newLead.email,
          phone: newLead.phone,
          service: newLead.serviceInterest,
          submittedAt: nowIso,
          status: "new",
          notes: newLead.notes,
          city: data.city?.trim() || "India",
        },
        ...existingLeads,
      ];
      localStorage.setItem(MGMT_KEY, JSON.stringify(dashboardData));
    } catch {}

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("activedesk_lead_created", { detail: newLead }));

    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "ACTIVEDESK_LEAD_SUBMITTED",
            payload: newLead,
          },
          "*"
        );
      }
    } catch {}
  }

  return newLead;
}
