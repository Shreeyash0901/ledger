export interface SharedServiceItem {
  id: string;
  title: string;
  category: "Taxation" | "Corporate & MCA" | "Audit & Assurance" | "Advisory";
  description: string;
  scopeList: string[];
}

export interface SharedTaxDueDate {
  date: string;
  title: string;
  form: string;
  authority: "GSTN" | "CBDT" | "MCA" | "EPFO";
  category: "Monthly" | "Annual" | "Statutory";
}

export interface SharedClientReview {
  id: string;
  clientInitials: string;
  businessSector: string;
  engagementType: string;
  statement: string;
  location: string;
}

export interface SharedFirmContact {
  primaryOffice: string;
  email: string;
  phone: string;
  workingHours: string;
  icaiRegistration: string;
}

export interface PracticeGalleryTile {
  id?: string;
  title: string;
  subtitle: string;
  image: string;
}

export const DEFAULT_PRACTICE_GALLERY_TILES: PracticeGalleryTile[] = [
  {
    id: "tile-1",
    title: "Company Incorporation",
    subtitle: "Pvt Ltd, OPC, LLP & Section 8",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tile-2",
    title: "GST Compliance Hub",
    subtitle: "Monthly returns, refunds & reconciliation",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tile-3",
    title: "Startup India Desk",
    subtitle: "DPIIT recognition & seed funding advisory",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tile-4",
    title: "Direct Tax Advisory",
    subtitle: "Corporate ITR, capital gains & scrutiny",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tile-5",
    title: "Trademark & IP Rights",
    subtitle: "Brand name, logo & copyright protection",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tile-6",
    title: "Statutory Audit Desk",
    subtitle: "Companies Act & Tax Audit assurance",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tile-7",
    title: "Virtual CFO Services",
    subtitle: "MIS, cash flow & financial controls",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tile-8",
    title: "MSME & Export Licenses",
    subtitle: "Udyam, IEC & RCMC registrations",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
  },
];

// ─── STANDARD PROFESSIONAL GUIDELINES ON FIXTURE DATA ───────────
// In accordance with standard professional practice and ICAI Code of Ethics:
// 1. No superlative claims (e.g., "Top CA", "Best in India", "100% Tax Savings").
// 2. Client statements must reflect factual engagement scopes (no commercial solicitation or promotional ratings).
// 3. Informational scope of services without comparative fee undercutting claims.
// 4. Includes a standard professional disclaimer on practice areas.
// ────────────────────────────────────────────────────────────────

export const SHARED_SERVICES: SharedServiceItem[] = [
  {
    id: "gst-compliance",
    title: "GST Compliance & Filings",
    category: "Taxation",
    description: "Monthly & quarterly GSTR-1 and GSTR-3B filings, input tax credit reconciliations, LUT processing, and departmental representation.",
    scopeList: ["GSTR-1 & GSTR-3B Periodic Filing", "GSTR-2B Automated ITC Reconciliation", "GST LUT for Export Services", "Notice Response & Scrutiny Support"],
  },
  {
    id: "income-tax",
    title: "Direct Tax & ITR Assessments",
    category: "Taxation",
    description: "Corporate and individual income tax returns, TDS/TCS quarterly statements, Advance Tax scheduling, and assessment hearings.",
    scopeList: ["ITR-1 through ITR-6 Preparation", "TDS Quarterly Filing (Form 24Q / 26Q)", "Advance Tax Estimation Computations", "Section 143/148 Notice Advisory"],
  },
  {
    id: "statutory-audit",
    title: "Audit & Statutory Assurance",
    category: "Audit & Assurance",
    description: "Statutory audits under Companies Act 2013, Tax Audits under Section 44AB, internal control evaluations, and management reporting.",
    scopeList: ["Section 44AB Tax Audit & Form 3CD", "Companies Act 2013 Statutory Audit", "Internal Financial Controls (IFC) Review", "Stock & Fixed Assets Verification"],
  },
  {
    id: "company-incorporation",
    title: "Corporate Secretarial & MCA",
    category: "Corporate & MCA",
    description: "Pvt Ltd, LLP, and Section 8 incorporations, annual ROC filings (AOC-4, MGT-7), Director KYC, and secretarial documentation.",
    scopeList: ["Company & LLP Formation", "Annual ROC Filing (AOC-4 / MGT-7)", "DIR-3 KYC Compliance", "Share Allotment & Capital Restructuring"],
  },
  {
    id: "startup-advisory",
    title: "Startup & Regulatory Registrations",
    category: "Advisory",
    description: "DPIIT recognition under Startup India, MSME Udyam registration, IEC licenses for foreign trade, and trademark documentation.",
    scopeList: ["DPIIT Startup India Certification", "MSME / Udyam Registration", "Import Export Code (IEC) Issuance", "Trademark Classification Filing"],
  },
  {
    id: "bookkeeping-reporting",
    title: "Accounting & MIS Reporting",
    category: "Advisory",
    description: "Structured cloud bookkeeping, monthly balance sheet reviews, cash flow forecasting, and compliance health reports.",
    scopeList: ["Cloud Accounting Setup", "Periodic Management Accounts", "Payroll Processing & TDS Deduction", "Vendor & Customer Ledger Audits"],
  },
];

export const SHARED_TAX_DATES: SharedTaxDueDate[] = [
  {
    date: "30 SEP 2026",
    title: "Tax Audit Report Filing",
    form: "Form 3CA / 3CB-3CD",
    authority: "CBDT",
    category: "Statutory",
  },
  {
    date: "07 OCT 2026",
    title: "TDS / TCS Deposit Challan",
    form: "Challan ITNS 281",
    authority: "CBDT",
    category: "Monthly",
  },
  {
    date: "11 OCT 2026",
    title: "GSTR-1 Monthly Return",
    form: "Outward Supplies Return",
    authority: "GSTN",
    category: "Monthly",
  },
  {
    date: "20 OCT 2026",
    title: "GSTR-3B Summary Return",
    form: "Monthly Tax Settlement",
    authority: "GSTN",
    category: "Monthly",
  },
  {
    date: "31 OCT 2026",
    title: "Quarterly TDS Return (Q2)",
    form: "Form 24Q / 26Q",
    authority: "CBDT",
    category: "Monthly",
  },
  {
    date: "30 NOV 2026",
    title: "ROC Annual Return Submission",
    form: "Form AOC-4 & MGT-7",
    authority: "MCA",
    category: "Annual",
  },
];

export const SHARED_CLIENT_REVIEWS: SharedClientReview[] = [
  {
    id: "rev-1",
    clientInitials: "M.T.",
    businessSector: "Wholesale & Distribution",
    engagementType: "GST & Tax Audit",
    statement: "Timely statutory audit completion and accurate monthly GST reconciliations have maintained complete compliance continuity for our business across fiscal years.",
    location: "Mumbai, Maharashtra",
  },
  {
    id: "rev-2",
    clientInitials: "A.S.",
    businessSector: "SaaS & Technology Startup",
    engagementType: "Corporate Advisory",
    statement: "End-to-end guidance during our company incorporation, DPIIT recognition, and regular secretarial compliance filing with transparent timelines.",
    location: "Bengaluru, Karnataka",
  },
  {
    id: "rev-3",
    clientInitials: "R.K.",
    businessSector: "Engineering & Manufacturing",
    engagementType: "Direct Tax Advisory",
    statement: "Objective scrutiny assessment representation and diligent advance tax projections handled with professional rigor and domain expertise.",
    location: "Ahmedabad, Gujarat",
  },
];

export const SHARED_FIRM_CONTACT: SharedFirmContact = {
  primaryOffice: "101, Sample Business Hub, Financial District, Mumbai 400001",
  email: "office@example-cafirm.com",
  phone: "+91 00000 00000",
  workingHours: "Monday to Saturday: 10:00 AM – 6:30 PM",
  icaiRegistration: "Firm Reg. No. XXXXXX",
};
