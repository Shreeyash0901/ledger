import React, { useState, useRef } from "react";
import {
  WebsiteConfig,
  SectionConfig,
  sanitizeLink,
  getLinkAttributes,
  isSafeLink,
  DEFAULT_MEGA_MENU_CONFIG,
  MegaMenuConfig,
  MegaMenuCategory,
  MegaMenuItem,
} from "website-core";
import {
  Check,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Globe,
  Search,
  ArrowRight,
  Star,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  FileText,
  Building2,
  Award,
  Users,
  TrendingUp,
  Send,
  Calendar,
  Lock,
  MessageCircle,
  Briefcase,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Layers,
  FileCheck,
  Building,
  Scale,
  Headphones,
} from "lucide-react";
import {
  SHARED_SERVICES,
  SHARED_TAX_DATES,
  SHARED_CLIENT_REVIEWS,
  SHARED_FIRM_CONTACT,
  SharedServiceItem,
  DEFAULT_PRACTICE_GALLERY_TILES,
  PracticeGalleryTile,
} from "../../fixtures/sharedData";
import { SocialIcon } from "../../components/SocialIcon";

export interface EasyFilingsTemplateProps {
  config: WebsiteConfig;
}

interface EasyServiceDisplayItem {
  id: string;
  title: string;
  category: string;
  rating: number;
  reviewCount: number;
  price: string;
  priceSub: string;
  badge?: string;
  scopeList: string[];
}

const EASY_SERVICE_META: Record<
  string,
  {
    rating: number;
    reviewCount: number;
    price: string;
    priceSub: string;
    badge?: string;
  }
> = {
  "company-incorporation": {
    rating: 4.9,
    reviewCount: 1420,
    price: "From ₹4,999",
    priceSub: "+ Govt fees as applicable",
    badge: "Most Popular",
  },
  "gst-compliance": {
    rating: 4.8,
    reviewCount: 2310,
    price: "From ₹999/mo",
    priceSub: "Monthly or Annual retainer",
    badge: "Essential",
  },
  "income-tax": {
    rating: 4.9,
    reviewCount: 3120,
    price: "From ₹1,499",
    priceSub: "Per filing / FY",
  },
  "statutory-audit": {
    rating: 4.9,
    reviewCount: 1150,
    price: "From ₹5,999/yr",
    priceSub: "Comprehensive Package",
  },
  "startup-advisory": {
    rating: 5.0,
    reviewCount: 1640,
    price: "From ₹999",
    priceSub: "One-time processing",
    badge: "Govt Subsidies",
  },
  "bookkeeping-reporting": {
    rating: 4.9,
    reviewCount: 890,
    price: "From ₹2,999/mo",
    priceSub: "Dedicated Accountant",
  },
};

const DEFAULT_EASY_SERVICES: EasyServiceDisplayItem[] = [
  {
    id: "company-incorporation",
    title: "Pvt Ltd Company Registration",
    category: "Company Registration",
    rating: 4.9,
    reviewCount: 1420,
    price: "From ₹4,999",
    priceSub: "+ Govt fees as applicable",
    badge: "Most Popular",
    scopeList: [
      "2 Digital Signature Certificates (DSC)",
      "SPICe+ Part A & B MCA Name Approval",
      "PAN, TAN, EPFO, ESIC & Bank Account Assistance",
    ],
  },
  {
    id: "llp-registration",
    title: "LLP Registration",
    category: "Company Registration",
    rating: 4.9,
    reviewCount: 980,
    price: "From ₹3,999",
    priceSub: "+ Stamp duty & ROC fees",
    scopeList: [
      "Partner DPIN & Class 3 DSC Issuance",
      "FiLLiP Form MCA Portal Filing",
      "Form 3 LLP Agreement Drafting & Submission",
    ],
  },
  {
    id: "gst-compliance",
    title: "GST Registration & Monthly Filing",
    category: "GST & Indirect Tax",
    rating: 4.8,
    reviewCount: 2310,
    price: "From ₹999/mo",
    priceSub: "Monthly or Annual retainer",
    badge: "Essential",
    scopeList: [
      "New GSTIN Application & ARN Tracking",
      "Monthly GSTR-1 & GSTR-3B Periodic Return",
      "GSTR-2B Automated ITC Reconciliation",
    ],
  },
  {
    id: "income-tax",
    title: "Income Tax & ITR Filing",
    category: "Income Tax & TDS",
    rating: 4.9,
    reviewCount: 3120,
    price: "From ₹1,499",
    priceSub: "Per filing / FY",
    scopeList: [
      "ITR-1 to ITR-6 Corporate & Individual Filing",
      "AIS, TIS & Form 26AS Tax Credit Matching",
      "Advance Tax Projections & Notice Advisory",
    ],
  },
  {
    id: "trademark-ip",
    title: "Trademark & Brand Protection",
    category: "Intellectual Property",
    rating: 4.8,
    reviewCount: 750,
    price: "From ₹2,499",
    priceSub: "+ Govt statutory fees",
    scopeList: [
      "Public TM Registry Availability Search",
      "Class Classification (NICE 1 to 45)",
      "Form TM-A Filing & Examination Advisory",
    ],
  },
  {
    id: "startup-advisory",
    title: "MSME Udyam & Startup India",
    category: "Company Registration",
    rating: 5.0,
    reviewCount: 1640,
    price: "From ₹999",
    priceSub: "One-time processing",
    badge: "Govt Subsidies",
    scopeList: [
      "Instant Udyam Registration Certificate",
      "DPIIT Startup India Recognition Filing",
      "Collateral-Free MSME Credit Eligibility",
    ],
  },
  {
    id: "bookkeeping-reporting",
    title: "Accounting & Monthly Bookkeeping",
    category: "Annual Compliance",
    rating: 4.9,
    reviewCount: 890,
    price: "From ₹2,999/mo",
    priceSub: "Dedicated Accountant",
    scopeList: [
      "Cloud Ledger (Tally / Zoho / QuickBooks)",
      "Monthly Balance Sheet & P&L Statement",
      "Vendor TDS & Payroll Reconciliation",
    ],
  },
  {
    id: "statutory-audit",
    title: "ROC Annual Filing & Compliance",
    category: "Annual Compliance",
    rating: 4.9,
    reviewCount: 1150,
    price: "From ₹5,999/yr",
    priceSub: "Comprehensive Package",
    scopeList: [
      "Form AOC-4 Financial Statements Filing",
      "Form MGT-7 Annual Return Submission",
      "Director DIR-3 KYC & Statutory Minutes",
    ],
  },
];

const PRACTICE_GALLERY_TILES = [
  {
    title: "Company Incorporation",
    subtitle: "Pvt Ltd, OPC, LLP & Section 8",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "GST Compliance Hub",
    subtitle: "Monthly returns, refunds & reconciliation",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Startup India Desk",
    subtitle: "DPIIT recognition & seed funding advisory",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Direct Tax Advisory",
    subtitle: "Corporate ITR, capital gains & scrutiny",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Trademark & IP Rights",
    subtitle: "Brand name, logo & copyright protection",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Statutory Audit Desk",
    subtitle: "Companies Act & Tax Audit assurance",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Virtual CFO Services",
    subtitle: "MIS, cash flow & financial controls",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "MSME & Export Licenses",
    subtitle: "Udyam, IEC & RCMC registrations",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
  },
];

const FAQS_LIST = [
  {
    q: "How do I start working with you?",
    a: "Tell us what you need through the callback enquiry form, or call us. We will have a short conversation to understand your business, confirm exactly which registrations and filings apply to you, and send a written quotation. No work begins, and no payment is asked for, until you approve that quotation.",
  },
  {
    q: "Do you work with clients outside your city?",
    a: "Yes, absolutely. Over 80% of our clients operate across different states in India and globally. Our entire workflow—document submission, digital signature processing, government fee challans, and portal filing—is 100% cloud-based and paperless.",
  },
  {
    q: "Will I have one person to talk to?",
    a: "Yes. Every client is assigned a dedicated Chartered Accountant or Compliance Lead who acts as your direct point of contact. You won't have to explain your situation to different call center representatives each time.",
  },
  {
    q: "How are your fees calculated?",
    a: "Our fees are quoted upfront in writing. Professional charges, government portal fees, and statutory stamp duty are clearly itemized before initiating any process. There are no hidden or surprise charges.",
  },
  {
    q: "Do I have to pay in advance?",
    a: "Initial discovery and requirement assessment are completely free. Once you approve the engagement scope, government fees (such as MCA filing or stamp duty) are paid at the time of portal submission, with milestone-based professional fee settlement.",
  },
  {
    q: "What happens if my application is rejected or queried?",
    a: "If a government department or registrar issues a resubmission query (e.g. MCA RUN name clarification or GST field verification), our team handles the response drafting and resubmission at no additional professional cost.",
  },
  {
    q: "How will I know when something is due?",
    a: "We maintain an automated compliance calendar for every active client. You will receive proactive email and WhatsApp reminders 15 days, 7 days, and 48 hours before any statutory deadline (GSTR-3B, TDS deposit, advance tax, or ROC annual filing).",
  },
  {
    q: "Can you take over filings another accountant was doing?",
    a: "Yes. We handle smooth transitions. We will obtain your prior filings, review pending status on the government portals, reconcile books, and initiate fresh filings without any disruption to your business.",
  },
];

function getMegaMenuIcon(name?: string) {
  switch (name) {
    case "FileText":
      return <FileText size={12} />;
    case "Scale":
      return <Scale size={12} />;
    case "Building2":
      return <Building2 size={12} />;
    case "Award":
      return <Award size={12} />;
    case "Sparkles":
      return <Sparkles size={12} />;
    case "FileCheck":
      return <FileCheck size={12} />;
    case "Users":
      return <Users size={12} />;
    case "ShieldCheck":
      return <ShieldCheck size={12} />;
    case "TrendingUp":
      return <TrendingUp size={12} />;
    case "Briefcase":
      return <Briefcase size={12} />;
    default:
      return <FileText size={12} />;
  }
}

export interface ServiceLandingDetail {
  id: string;
  serviceTitle: string;
  tagline: string;
  badge: string;
  description: string;
  bulletPoints: string[];
  professionalFee: string;
  governmentFee: string;
  completedIn: string;
  estimatedValue: number;
  formTitle: string;
}

export const SERVICE_DETAILS_CATALOG: Record<string, ServiceLandingDetail> = {
  "GST LUT Filing": {
    id: "gst-lut-filing",
    serviceTitle: "GST LUT Filing",
    tagline: "Export Without Paying IGST",
    badge: "Filed in 1-3 working days",
    description:
      "A Letter of Undertaking lets you export goods or services without paying IGST upfront, instead of paying and claiming a refund months later.",
    bulletPoints: [
      "No IGST blocked in refunds",
      "Valid for the financial year",
      "Filed on the GST portal",
      "Annual renewal tracked",
    ],
    professionalFee: "Rs. 999 - 1,999",
    governmentFee: "Nil",
    completedIn: "1 to 3 working days",
    estimatedValue: 1499,
    formTitle: "Get started with GST LUT Filing for Exporters",
  },
  "GST Registration": {
    id: "gst-registration",
    serviceTitle: "GST Registration",
    tagline: "Get Your GSTIN Online with CA Guidance",
    badge: "Filed in 3-7 working days",
    description:
      "Obtain your official 15-digit GST identification number smoothly with zero errors, full document verification, and ARN tracking.",
    bulletPoints: [
      "Guaranteed ARN generation within 24h",
      "Aadhaar OTP or biometric verification support",
      "HSN / SAC code mapping included",
      "No risk of rejection from officer queries",
    ],
    professionalFee: "Rs. 999 - 1,499",
    governmentFee: "Nil",
    completedIn: "3 to 7 working days",
    estimatedValue: 1299,
    formTitle: "Get started with GST Registration",
  },
  "GST Return Filing": {
    id: "gst-return-filing",
    serviceTitle: "GST Return Filing",
    tagline: "On-Time GSTR-1 & 3B Periodic Compliance",
    badge: "Monthly Retainer from ₹999",
    description:
      "Automated monthly & quarterly filing with 100% GSTR-2B input tax credit reconciliation to prevent penalties and blocked credits.",
    bulletPoints: [
      "Maximized ITC claim through 2B matching",
      "Zero late fee and interest penalties",
      "Direct CA review before portal upload",
      "Automatic statutory compliance alerts",
    ],
    professionalFee: "Rs. 999 - 2,499 / mo",
    governmentFee: "Nil",
    completedIn: "1 to 2 working days",
    estimatedValue: 1999,
    formTitle: "Get started with GST Return Filing",
  },
  "GST Annual Return (GSTR-9)": {
    id: "gst-annual-return",
    serviceTitle: "GST Annual Return (GSTR-9)",
    tagline: "Comprehensive Financial Year Tax Audit & Filing",
    badge: "Handled by Senior CAs",
    description:
      "Thorough reconciliation of turnover, outward supplies, and eligible ITC across all 12 monthly returns against annual financial statements.",
    bulletPoints: [
      "In-depth turnover & ITC mismatch audits",
      "Reversal & DRC-03 voluntary payment advisory",
      "Form GSTR-9C reconciliation certification",
      "Protection against future audit scrutiny notices",
    ],
    professionalFee: "Rs. 4,999 - 9,999",
    governmentFee: "Nil",
    completedIn: "3 to 5 working days",
    estimatedValue: 5999,
    formTitle: "Get started with GSTR-9 Annual Return",
  },
  "GST Notice Advisory": {
    id: "gst-notice-advisory",
    serviceTitle: "GST Notice Advisory",
    tagline: "Expert Reply Drafting for ASMT-10 & DRC-01",
    badge: "Urgent 24-48h Assistance",
    description:
      "Professional drafting and legal representation for departmental scrutiny notices, ITC mismatches, and show-cause orders.",
    bulletPoints: [
      "Detailed analysis of notice allegations",
      "Evidence gathering and legal citations",
      "ASMT-11 formal response filing",
      "Personal hearing representation assistance",
    ],
    professionalFee: "Rs. 2,499 - 5,999",
    governmentFee: "Nil",
    completedIn: "2 to 3 working days",
    estimatedValue: 3499,
    formTitle: "Get started with GST Notice Reply",
  },
  "Pvt Ltd Company Registration": {
    id: "pvt-ltd-company-registration",
    serviceTitle: "Private Limited Company Registration",
    tagline: "Incorporate with MCA & Startup India Support",
    badge: "Completed in 7-10 working days",
    description:
      "End-to-end incorporation including name reservation, MOA/AOA drafting, 2 DSCs, DINs, PAN, TAN, EPFO, ESIC, and zero-balance bank account.",
    bulletPoints: [
      "SPICe+ Part A & Part B MCA portal filing",
      "Includes 2 Class-3 Digital Signatures (DSC)",
      "Lifetime valid Certificate of Incorporation",
      "Free post-incorporation advisory session",
    ],
    professionalFee: "Rs. 4,999 - 7,999",
    governmentFee: "ROC Stamp Duty at Actuals",
    completedIn: "7 to 10 working days",
    estimatedValue: 6999,
    formTitle: "Get started with Pvt Ltd Incorporation",
  },
  "LLP Registration": {
    id: "llp-registration",
    serviceTitle: "Limited Liability Partnership (LLP)",
    tagline: "Low-Compliance Corporate Structure",
    badge: "Completed in 7-10 working days",
    description:
      "Register an LLP with limited liability protection and zero mandatory statutory audit requirements for small turnovers.",
    bulletPoints: [
      "FiLLiP filing on MCA V3 portal",
      "Form 3 LLP Agreement drafting & stamping",
      "2 Partner DPINs & Class-3 DSCs included",
      "PAN & TAN allotment upon approval",
    ],
    professionalFee: "Rs. 3,999 - 5,999",
    governmentFee: "Stamp Duty at Actuals",
    completedIn: "7 to 10 working days",
    estimatedValue: 4999,
    formTitle: "Get started with LLP Registration",
  },
  "One Person Company (OPC)": {
    id: "opc-registration",
    serviceTitle: "One Person Company (OPC)",
    tagline: "Sole Founder with 100% Limited Liability",
    badge: "Completed in 7-10 working days",
    description:
      "Retain 100% ownership of your business while enjoying full corporate status, separate legal entity status, and corporate tax benefits.",
    bulletPoints: [
      "Single promoter + nominee structure setup",
      "DSC, DIN, PAN & TAN allotment",
      "Seamless conversion to Pvt Ltd as you scale",
      "Bank account opening resolution assistance",
    ],
    professionalFee: "Rs. 4,499 - 6,999",
    governmentFee: "ROC Stamp Duty at Actuals",
    completedIn: "7 to 10 working days",
    estimatedValue: 5499,
    formTitle: "Get started with One Person Company",
  },
  "Income Tax & ITR Filing": {
    id: "income-tax-filing",
    serviceTitle: "Income Tax & ITR Filing",
    tagline: "Maximum Tax Savings with CA Verification",
    badge: "Filing within 24 hours",
    description:
      "Accurate filing for individuals, freelancers, professionals, and corporate entities with comprehensive AIS/TIS and 26AS matching.",
    bulletPoints: [
      "ITR-1 through ITR-6 covered",
      "Capital gains & crypto transactions verified",
      "Maximized Chapter VI-A deductions & refunds",
      "Fast refund processing tracking",
    ],
    professionalFee: "Rs. 1,499 - 3,499",
    governmentFee: "Nil",
    completedIn: "1 to 2 working days",
    estimatedValue: 1999,
    formTitle: "Get started with Income Tax Filing",
  },
  "Trademark Registration": {
    id: "trademark-registration",
    serviceTitle: "Trademark Registration",
    tagline: "Protect Your Brand Name & Logo Across India",
    badge: "Get ™ within 24 hours",
    description:
      "Comprehensive registry search, NICE class classification, application drafting, and submission on the IP India portal.",
    bulletPoints: [
      "Pre-filing trademark conflict search report",
      "Use ™ symbol immediately upon application",
      "Complete examination report tracking",
      "10 years statutory brand protection",
    ],
    professionalFee: "Rs. 1,999 - 2,999",
    governmentFee: "₹4,500 (Individual/MSME) / ₹9,000 (Others)",
    completedIn: "1 working day (for filing)",
    estimatedValue: 2499,
    formTitle: "Get started with Trademark Registration",
  },
  "MSME Udyam Registration": {
    id: "msme-udyam-registration",
    serviceTitle: "MSME Udyam Registration",
    tagline: "Unlock Government Subsidies & Priority Lending",
    badge: "Instant 24h Certificate",
    description:
      "Official Ministry of MSME registration certificate with lifetime validity to unlock lower loan interest, tender exemptions, and MSME protection.",
    bulletPoints: [
      "Protection under 45-day MSME payment rule (43B(h))",
      "50% discount on Trademark and Patent fees",
      "Collateral-free CGTMSE bank credit eligibility",
      "Lifetime validity with zero renewal fee",
    ],
    professionalFee: "Rs. 999 - 1,499",
    governmentFee: "Nil",
    completedIn: "1 working day",
    estimatedValue: 999,
    formTitle: "Get started with MSME Udyam Registration",
  },
  "ROC Annual Filing & Compliance": {
    id: "roc-annual-filing",
    serviceTitle: "ROC Annual Filing & Compliance",
    tagline: "Year-Round Corporate Governance & MCA Filings",
    badge: "Comprehensive Annual Package",
    description:
      "Full statutory compliance package for private limited companies: Form AOC-4, MGT-7, director KYC, statutory register maintenance, and AGM minutes.",
    bulletPoints: [
      "Avoid severe late fees of ₹100 per day",
      "Director DIR-3 KYC filing included",
      "Board meeting minutes & secretarial documentation",
      "Dedicated compliance manager assigned",
    ],
    professionalFee: "Rs. 5,999 - 9,999 / yr",
    governmentFee: "ROC filing fees at actuals",
    completedIn: "3 to 5 working days",
    estimatedValue: 6999,
    formTitle: "Get started with ROC Annual Compliance",
  },
  "Accounting & Monthly Bookkeeping": {
    id: "accounting-bookkeeping",
    serviceTitle: "Accounting & Monthly Bookkeeping",
    tagline: "Cloud-Based Books Maintained by Expert Accountants",
    badge: "Monthly Retainer from ₹2,999",
    description:
      "Monthly ledger reconciliation, bank reconciliations, vendor payables, receivables tracking, and real-time MIS reporting on Zoho, Tally, or QuickBooks.",
    bulletPoints: [
      "Monthly P&L, Balance Sheet, and Cash Flow statement",
      "Vendor TDS and GST credit reconciliation",
      "Real-time cloud accounting software setup",
      "Dedicated senior accountant for daily entries",
    ],
    professionalFee: "Rs. 2,999 - 5,999 / mo",
    governmentFee: "Nil",
    completedIn: "Ongoing Monthly Retainer",
    estimatedValue: 3999,
    formTitle: "Get started with Monthly Bookkeeping",
  },
};

export function getServiceDetails(title: string): ServiceLandingDetail {
  if (!title) {
    return SERVICE_DETAILS_CATALOG["GST LUT Filing"];
  }
  const clean = title.trim().toLowerCase();
  for (const [key, val] of Object.entries(SERVICE_DETAILS_CATALOG)) {
    const k = key.toLowerCase();
    if (clean === k || clean.includes(k) || k.includes(clean)) {
      return val;
    }
  }
  return {
    id: clean.replace(/[^a-z0-9]+/g, "-"),
    serviceTitle: title,
    tagline: "Professional Advisory & CA Assistance",
    badge: "Filed in 2-4 working days",
    description: `Complete CA-assisted ${title} with statutory document verification, error-free portal submission, and guaranteed on-time departmental follow-up.`,
    bulletPoints: [
      `100% online paperless processing for ${title}`,
      "Dedicated Chartered Accountant assigned",
      "Official acknowledgement & ARN provided",
      "Transparent fixed fees with no hidden costs",
    ],
    professionalFee: "Rs. 1,499 - 2,999",
    governmentFee: "At Actuals",
    completedIn: "2 to 4 working days",
    estimatedValue: 1999,
    formTitle: `Get started with ${title}`,
  };
}

export function EasyFilingsTemplate({ config }: EasyFilingsTemplateProps) {
  const page = config.pages[0];

  const [selectedService, setSelectedService] = useState<string>("GST LUT Filing");
  const [formHighlight, setFormHighlight] = useState<boolean>(false);

  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
    if (typeof document !== "undefined") {
      const card = document.getElementById("hero-callback-card") || document.getElementById("home");
      if (card && typeof card.scrollIntoView === "function") {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    setFormHighlight(true);
    setTimeout(() => {
      setFormHighlight(false);
    }, 900);
  };

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleServicesMouseEnter = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setIsMegaMenuOpen(true);
  };

  const handleServicesMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 250);
  };

  const megaMenuConfig: MegaMenuConfig = config.header.megaMenu || DEFAULT_MEGA_MENU_CONFIG;
  const isMegaMenuEnabled = megaMenuConfig.enabled !== false;

  const activeNavLinks = (config.header.navLinks || []).filter(
    (l) => l.enabled !== false && l.label && l.url
  );
  const quickLinkGroups = (config.footer.quickLinkGroups || []).filter(
    (g) => g.title && g.links && g.links.some((l) => l.label && l.url)
  );
  const socialLinks = (config.footer.socialLinks || []).filter(
    (s) => s.platform && s.url && isSafeLink(s.url)
  );

  return (
    <div className="ef-container">
      {/* 1. Top Notice / Ticker Updates Bar */}
      {config.header.showTopInfoBar !== false && (
        <div className="ef-ticker-bar">
          <div className="ef-ticker-content">
            <span className="ef-ticker-badge">
              <Sparkles size={13} style={{ color: "#d97706" }} />
              Latest Updates:
            </span>
            <span>
              Reversal of ITC under Rule 37A: What businesses need to know •
              Section 43B(h): What the 45-day MSME payment rule means for you •
              The statutory due dates every Indian business should have in its
              calendar
            </span>
            <a href="#tax-calendar" className="ef-ticker-link">
              View all
            </a>
          </div>
        </div>
      )}

      {/* 2. Sub-Topbar (Dark Navy Strip) */}
      <div className="ef-sub-topbar">
        <div className="ef-sub-topbar-left">
          <a
            href={`tel:${config.branding.phone || "+91 9800000000"}`}
            className="ef-sub-topbar-item"
          >
            <Phone size={12} />
            <span>{config.branding.phone || "+91 9800000000"}</span>
          </a>
          <a
            href={`mailto:${config.branding.email || "info@example.com"}`}
            className="ef-sub-topbar-item"
          >
            <Mail size={12} />
            <span>{config.branding.email || "info@example.com"}</span>
          </a>
          <span className="ef-sub-topbar-item" style={{ color: "#64748b" }}>
            <Clock size={12} />
            <span>
              {config.branding.workingHours || "Monday to Saturday, 10:00 AM to 7:00 PM"}
            </span>
          </span>
        </div>
        <div className="ef-sub-topbar-right">
          <a href="#contact" className="ef-sub-link">
            Become a Partner
          </a>
          <a href="#contact" className="ef-sub-link">
            Client login
          </a>
        </div>
      </div>

      {/* 3. Sticky Main Header */}
      <header className="ef-header">
        <a href="#home" className="ef-brand">
          {config.branding.logoUrl ? (
            <img
              src={config.branding.logoUrl}
              alt={config.branding.firmName}
              style={{ maxHeight: 38, objectFit: "contain", borderRadius: 6 }}
            />
          ) : (
            <div className="ef-logo-mark">
              <Check size={22} strokeWidth={3.5} />
            </div>
          )}
          <div className="ef-brand-text">
            <span className="ef-brand-name">
              {config.branding.firmName || "Easy Filings"}
            </span>
            <span className="ef-brand-tagline">
              {config.branding.tagline ||
                "Chartered Accountants | Tax, Compliance & Business Advisory"}
            </span>
          </div>
        </a>

        {activeNavLinks.length > 0 ? (
          <nav className="ef-nav">
            {activeNavLinks.map((link, idx) => {
              const safeUrl = sanitizeLink(link.url, "#");
              const attrs = getLinkAttributes(safeUrl);
              const isServicesLink = link.label.toLowerCase().includes("service");
              if (isServicesLink) {
                return (
                  <div
                    key={idx}
                    className="ef-nav-services-wrapper"
                    onMouseEnter={handleServicesMouseEnter}
                    onMouseLeave={handleServicesMouseLeave}
                  >
                    <a
                      href={safeUrl}
                      {...attrs}
                      className="ef-nav-link ef-nav-link-dropdown"
                      onClick={() => setIsMegaMenuOpen((prev) => !prev)}
                    >
                      {link.label}
                      <ChevronDown
                        size={12}
                        style={{
                          transition: "transform 0.2s ease",
                          transform: isMegaMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </a>
                  </div>
                );
              }
              return (
                <a key={idx} href={safeUrl} {...attrs} className="ef-nav-link">
                  {link.label}
                </a>
              );
            })}
          </nav>
        ) : (
          <nav className="ef-nav">
            <a href="#home" className="ef-nav-link">Home</a>
            <div
              className="ef-nav-services-wrapper"
              onMouseEnter={handleServicesMouseEnter}
              onMouseLeave={handleServicesMouseLeave}
            >
              <a
                href="#services"
                className="ef-nav-link ef-nav-link-dropdown"
                onClick={() => setIsMegaMenuOpen((prev) => !prev)}
              >
                Services
                <ChevronDown
                  size={12}
                  style={{
                    transition: "transform 0.2s ease",
                    transform: isMegaMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </a>
            </div>
            <a href="#services" className="ef-nav-link">Packages</a>
            <a href="#tax-calendar" className="ef-nav-link">Compliance Calendar</a>
            <a href="#tax-calendar" className="ef-nav-link">Tax Updates</a>
            <a href="#contact" className="ef-nav-link">Contact</a>
          </nav>
        )}

        <div className="ef-header-actions">
          <button className="ef-icon-btn" aria-label="Search">
            <Search size={16} />
          </button>
          <div className="ef-lang-badge">
            <Globe size={13} />
            <span>EN</span>
          </div>

          {config.header.headerCta?.enabled !== false && (
            <button
              type="button"
              onClick={() => handleSelectService(selectedService)}
              className="ef-btn-primary"
              style={{ cursor: "pointer", border: "none" }}
            >
              {config.header.headerCta?.label || "Free consultation"}
            </button>
          )}
        </div>

        {/* Services Mega Dropdown Menu */}
        {isMegaMenuOpen && isMegaMenuEnabled && (
          <div
            className="ef-mega-menu"
            onMouseEnter={handleServicesMouseEnter}
            onMouseLeave={handleServicesMouseLeave}
            role="region"
            aria-label="Services Menu"
          >
            <div className="ef-mega-grid">
              {(megaMenuConfig.categories || []).map((cat, cIdx) => (
                <div key={cat.id || cIdx} className="ef-mega-col">
                  <div className="ef-mega-col-header">
                    <span className="ef-mega-col-icon">
                      {getMegaMenuIcon(cat.icon)}
                    </span>
                    <span>{cat.title}</span>
                  </div>
                  <ul className="ef-mega-list">
                    {(cat.items || []).map((item, iIdx) => (
                      <li key={item.id || iIdx} className="ef-mega-item">
                        <a
                          href="#home"
                          className="ef-mega-link"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsMegaMenuOpen(false);
                            handleSelectService(item.label);
                          }}
                        >
                          <span>{item.label}</span>
                          {item.popular && (
                            <span className="ef-mega-badge-popular">Popular</span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                  {cat.viewAllText && (
                    <a
                      href="#home"
                      className="ef-mega-view-all"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMegaMenuOpen(false);
                        handleSelectService(cat.title);
                      }}
                    >
                      {cat.viewAllText}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {(megaMenuConfig.bottomNotice || megaMenuConfig.bottomLinkText) && (
              <div className="ef-mega-footer">
                <span>
                  {megaMenuConfig.bottomNotice ||
                    "Every service includes document review, departmental follow-up and a tracked compliance calendar."}
                </span>
                {megaMenuConfig.bottomLinkText && (
                  <a
                    href="#home"
                    className="ef-mega-footer-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMegaMenuOpen(false);
                      handleSelectService("GST Registration");
                    }}
                  >
                    {megaMenuConfig.bottomLinkText}
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* 4. Main Body: Dynamic Sections Rendered Based on Order & Visibility */}
      <main style={{ flex: 1 }}>
        {page?.sections
          .filter((s) => s.enabled)
          .sort((a, b) => a.order - b.order)
          .map((sec) => (
            <EasyFilingsSectionRouter
              key={sec.id}
              sec={sec}
              config={config}
              selectedService={selectedService}
              onSelectService={handleSelectService}
              formHighlight={formHighlight}
            />
          ))}
      </main>

      {/* 5. Pre-Footer Skyline CTA */}
      <section className="ef-skyline-cta">
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <h2>Ready to hand over your compliance and concentrate on growth?</h2>
          <p>
            Join 50,000+ businesses who trust our Chartered Accountants for
            seamless company incorporation, verified tax filings, and year-round peace of mind.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <a href="#contact" className="ef-btn-primary" style={{ padding: "12px 24px", fontSize: 14 }}>
              Get a Free Consultation <ArrowRight size={15} />
            </a>
            <a href="#services" className="ef-btn-secondary" style={{ padding: "12px 24px", fontSize: 14 }}>
              Explore Services
            </a>
          </div>
          <div className="ef-skyline-trust">
            <span>✓ Reviewed by a Chartered Accountant</span>
            <span>✓ Fixed fees quoted in writing</span>
            <span>✓ Deadlines tracked for you</span>
          </div>
        </div>
      </section>

      {/* 6. Newsletter Subscription Bar */}
      <div className="ef-newsletter-bar">
        <div className="ef-newsletter-inner">
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", marginBottom: 4 }}>
              Tax and compliance updates, without the noise
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              Due dates, rate changes and departmental notifications that actually affect your business. No more than twice a month.
            </div>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* 7. Mega Footer */}
      <footer className="ef-footer">
        <div className="ef-footer-top">
          {/* Col 1: Brand & Office Info */}
          <div className="ef-footer-col">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div className="ef-logo-mark" style={{ width: 32, height: 32, fontSize: 16 }}>
                <Check size={18} strokeWidth={3.5} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
                {config.branding.firmName || "Easy Filings"}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, margin: "0 0 16px" }}>
              {config.branding.tagline ||
                "Chartered Accountants | Tax, Compliance & Business Advisory"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "#94a3b8" }}>
              <div style={{ display: "flex", gap: 8 }}>
                <Building size={14} style={{ color: "#10b981", flexShrink: 0, marginTop: 2 }} />
                <span>
                  {config.branding.address ||
                    "2nd Floor, Chamber Building, 12 Council House Street, Kolkata, West Bengal, 700001"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Phone size={14} style={{ color: "#10b981", flexShrink: 0, marginTop: 2 }} />
                <span>{config.branding.phone || "+91 9800000000"}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Mail size={14} style={{ color: "#10b981", flexShrink: 0, marginTop: 2 }} />
                <span>{config.branding.email || "info@example.com"}</span>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
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
                      width: 30,
                      height: 30,
                      borderRadius: 6,
                      background: "rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <SocialIcon platform={s.platform} size={14} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Col 2 & 3: Custom Quick Link Groups or Defaults */}
          {quickLinkGroups.length > 0 ? (
            quickLinkGroups.map((grp, gIdx) => (
              <div key={gIdx} className="ef-footer-col">
                <h5>{grp.title}</h5>
                <ul className="ef-footer-links">
                  {grp.links
                    .filter((l) => l.label && l.url)
                    .map((lnk, lIdx) => (
                      <li key={lIdx}>
                        <a
                          href={sanitizeLink(lnk.url, "#")}
                          {...getLinkAttributes(sanitizeLink(lnk.url, "#"))}
                        >
                          {lnk.label}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))
          ) : (
            <>
              {/* Default Col 2: Popular Services */}
              <div className="ef-footer-col">
                <h5>Popular Services</h5>
                <ul className="ef-footer-links">
                  <li><a href="#services">Accounting & Bookkeeping</a></li>
                  <li><a href="#services">Private Limited Company Registration</a></li>
                  <li><a href="#services">GST Registration</a></li>
                  <li><a href="#services">Income Tax Return Filing</a></li>
                  <li><a href="#services">MSME / Udyam Registration</a></li>
                  <li><a href="#services">Trademark Registration</a></li>
                  <li><a href="#services">LLP Registration</a></li>
                  <li><a href="#services">GST Return Filing</a></li>
                </ul>
              </div>

              {/* Default Col 3: Company */}
              <div className="ef-footer-col">
                <h5>Company</h5>
                <ul className="ef-footer-links">
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#about">Our Team</a></li>
                  <li><a href="#contact">Branches</a></li>
                  <li><a href="#contact">Careers</a></li>
                  <li><a href="#contact">Become a Partner</a></li>
                  <li><a href="#contact">Contact Us</a></li>
                </ul>
              </div>
            </>
          )}

          {/* Col 4: Resources */}
          <div className="ef-footer-col">
            <h5>Resources</h5>
            <ul className="ef-footer-links">
              <li><a href="#tax-calendar">Compliance Calendar</a></li>
              <li><a href="#tax-calendar">Tax & GST Updates</a></li>
              <li><a href="#tax-calendar">Regulatory Circulars</a></li>
              <li><a href="#services">All Practice Areas</a></li>
              <li><a href="#contact">Consult a CA</a></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        {config.footer.icaiDisclaimer && (
          <div className="ef-footer-disclaimer">
            {config.footer.disclaimerText ||
              "The content on this website is general information about tax and compliance requirements in India and is not advice on your particular circumstances. Fees shown are indicative; government fees are as prescribed by the relevant authority from time to time. In accordance with the Chartered Accountants Act, 1949 and ICAI ethical standards, this portal is maintained for client convenience and informational transparency."}
          </div>
        )}

        {/* Footer Bottom Bar */}
        <div className="ef-footer-bottom">
          <div>
            {config.footer.copyrightText ||
              `© ${new Date().getFullYear()} ${config.branding.firmName || "Easy Filings"}. All rights reserved.`}
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="#privacy" style={{ color: "#64748b", textDecoration: "none" }}>Privacy Policy</a>
            <a href="#terms" style={{ color: "#64748b", textDecoration: "none" }}>Terms of Service</a>
            <a href="#refund" style={{ color: "#64748b", textDecoration: "none" }}>Refund Policy</a>
            <a href="#disclaimer" style={{ color: "#64748b", textDecoration: "none" }}>Disclaimer</a>
          </div>
        </div>
      </footer>

      {/* 8. Floating WhatsApp Quick Chat Widget */}
      {config.header.showWhatsAppBtn !== false && (
        <a
          href={`https://wa.me/${(config.branding.phone || "919800000000").replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ef-whatsapp-widget"
        >
          <MessageCircle size={18} />
          <span>Chat with us</span>
        </a>
      )}
    </div>
  );
}

// ─── Section Router ─────────────────────────────────────────────────────────

function EasyFilingsSectionRouter({
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
      return (
        <EasyFilingsHeroSection
          props={sec.props}
          config={config}
          selectedService={selectedService}
          onSelectService={onSelectService}
          formHighlight={formHighlight}
        />
      );
    case "services":
      return (
        <EasyFilingsServicesSection
          props={sec.props}
          config={config}
          onSelectService={onSelectService}
        />
      );
    case "tax-calendar":
      return <EasyFilingsTaxCalendarSection props={sec.props} config={config} />;
    case "testimonials":
      return <EasyFilingsTestimonialsSection props={sec.props} config={config} />;
    case "cta":
      return <EasyFilingsCtaSection props={sec.props} config={config} />;
    case "contact":
      return <EasyFilingsContactSection props={sec.props} config={config} />;
    case "calculators":
      return <EasyFilingsCalculatorsSection props={sec.props} config={config} />;
    default:
      return null;
  }
}

// ─── 1. Hero Section With Floating Callback Form + Stats + Quality Badges ───

function EasyFilingsHeroSection({
  props,
  config,
  selectedService,
  onSelectService,
  formHighlight,
}: {
  props: any;
  config: WebsiteConfig;
  selectedService: string;
  onSelectService: (serviceName: string) => void;
  formHighlight: boolean;
}) {
  const heroImage = props?.heroImageUrl || props?.imageUrl;
  const details = getServiceDetails(selectedService);

  return (
    <section
      className="ef-hero"
      id="home"
      style={
        heroImage
          ? {
              backgroundImage: `linear-gradient(rgba(9, 30, 43, 0.82), rgba(9, 30, 43, 0.92)), url("${heroImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
    >
      <div className="ef-hero-bg-overlay" />
      <div className="ef-hero-inner">
        {/* Left Column: Dynamic Service Headline, Subheadline, Bullets & Pricing Strip */}
        <div className="ef-hero-content">
          <div className="ef-hero-pill">
            <Clock size={13} style={{ color: "#34d399", marginRight: 4 }} />
            <span>{details.badge}</span>
          </div>

          <h1 className="ef-hero-title">
            {props?.headline && props.headline !== "Register your company in 10 days" && selectedService === "GST LUT Filing"
              ? props.headline
              : `${details.serviceTitle} — ${details.tagline}`}
          </h1>

          <p className="ef-hero-sub">
            {props?.subheadline && !props.subheadline.includes("Private Limited, LLP or OPC") && selectedService === "GST LUT Filing"
              ? props.subheadline
              : details.description}
          </p>

          {/* 4 Checkmark Bullets from Screenshot */}
          <div className="ef-hero-check-list">
            {details.bulletPoints.map((pt, idx) => (
              <div key={idx} className="ef-hero-check-item">
                <CheckCircle2 size={16} className="ef-hero-check-icon" />
                <span>{pt}</span>
              </div>
            ))}
          </div>

          {/* 3-Column Pricing Strip from Screenshot */}
          <div className="ef-pricing-strip">
            <div>
              <div className="ef-pricing-col-label">PROFESSIONAL FEE</div>
              <div className="ef-pricing-col-val">{details.professionalFee}</div>
            </div>
            <div>
              <div className="ef-pricing-col-label">GOVERNMENT FEE</div>
              <div className="ef-pricing-col-val">{details.governmentFee}</div>
            </div>
            <div>
              <div className="ef-pricing-col-label">COMPLETED IN</div>
              <div className="ef-pricing-col-val">{details.completedIn}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Callback Request Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            id="hero-callback-card"
            className={`ef-form-card ${formHighlight ? "ef-form-highlight-pulse" : ""}`}
          >
            <div className="ef-form-header">
              <h3>{details.formTitle}</h3>
              <p>Free consultation. No advance payment.</p>
            </div>
            <CallbackForm
              selectedService={selectedService}
              onServiceChange={onSelectService}
              estimatedValue={details.estimatedValue}
              megaMenu={config.header.megaMenu}
            />
          </div>
        </div>
      </div>

      {/* Pill Navigation Bar at the bottom of hero */}
      <div className="ef-pill-nav-bar" style={{ margin: "44px -32px -64px", borderBottom: "none" }}>
        <div className="ef-pill-nav-inner">
          {["Overview", "Benefits", "Eligibility", "Documents", "Process", "Fees", "FAQs"].map((pill, pIdx) => (
            <a
              key={pIdx}
              href={pill === "FAQs" ? "#faqs" : "#services"}
              className={`ef-pill-btn ${pIdx === 0 ? "active" : ""}`}
            >
              {pill}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallbackForm({
  selectedService,
  onServiceChange,
  estimatedValue,
  megaMenu,
}: {
  selectedService: string;
  onServiceChange: (service: string) => void;
  estimatedValue?: number;
  megaMenu?: MegaMenuConfig;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [createdLead, setCreatedLead] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    requirement: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) {
      return;
    }

    const generatedCode = `LD-2627-${Math.floor(10000 + Math.random() * 90000)}`;
    const leadId = `lead-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    const newLead = {
      id: leadId,
      leadCode: generatedCode,
      name: formData.name.trim(),
      country: formData.city.trim() || "India",
      phone: formData.mobile.trim(),
      email: formData.email.trim() || null,
      serviceInterest: selectedService,
      stage: "NEW_LEAD" as const,
      source: "Website Service Form",
      value: estimatedValue || 1499,
      ownerName: "Unassigned",
      followUpDate: tomorrow,
      notes: formData.requirement.trim()
        ? `Website inquiry for ${selectedService}. City: ${formData.city || "Not specified"}. Note: ${formData.requirement.trim()}`
        : `Website inquiry for ${selectedService}. City: ${formData.city || "Not specified"}`,
      createdAt: nowIso,
    };

    // 1. Sync to API endpoints (cross-origin supported for ActiveDesk Leads Pipeline)
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
    }

    // 2. Save to activedesk_crm_leads_v1 (ActiveDesk Lead Pipeline storage key)
    try {
      const CRM_KEY = "activedesk_crm_leads_v1";
      const existingRaw = localStorage.getItem(CRM_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [newLead, ...existing.filter((item: any) => item.id !== newLead.id)];
      localStorage.setItem(CRM_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save to CRM leads storage", err);
    }

    // 2. Also save to activedesk_website_mgmt_dashboard_v1 (Website Management dashboard leads)
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
          city: formData.city.trim() || "India",
        },
        ...existingLeads,
      ];
      localStorage.setItem(MGMT_KEY, JSON.stringify(dashboardData));
    } catch (err) {
      console.error("Failed to save to website mgmt leads storage", err);
    }

    // 3. Dispatch storage and custom events for reactive update
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("activedesk_lead_created", { detail: newLead }));

      // 4. Notify parent window if in iframe (visual customizer or preview)
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

    setCreatedLead(newLead);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "28px 16px" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#ecfdf5",
            color: "#059669",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          <CheckCircle2 size={34} />
        </div>
        <h4 style={{ margin: "0 0 8px", fontSize: 19, color: "#0f172a", fontWeight: 700 }}>
          Thank You! We'll Call You Soon
        </h4>
        <p style={{ margin: "0 0 10px", fontSize: 13.5, color: "#334155", lineHeight: 1.5 }}>
          Thank you, <strong>{formData.name}</strong>. We have received your requirement for <strong>{selectedService}</strong>.
        </p>
        <p style={{ margin: "0 0 18px", fontSize: 12.5, color: "#64748b", lineHeight: 1.5 }}>
          Our dedicated Chartered Accountant will call you on <strong>{formData.mobile}</strong> shortly to discuss your requirement and guide you with the next steps.
        </p>
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 12,
            color: "#00635a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginBottom: 18,
          }}
        >
          <ShieldCheck size={16} style={{ color: "#10b981", flexShrink: 0 }} />
          <span>Free Consultation • Zero Advance Payment Required</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: "",
              mobile: "",
              email: "",
              city: "",
              requirement: "",
            });
          }}
          className="ef-btn-secondary"
          style={{
            width: "100%",
            padding: "10px 16px",
            fontSize: 13,
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  const menuConfig = megaMenu || DEFAULT_MEGA_MENU_CONFIG;
  const catalogOptions =
    menuConfig?.categories && menuConfig.categories.length > 0
      ? Array.from(new Set(menuConfig.categories.flatMap((cat) => (cat.items || []).map((it) => it.label))))
      : Object.keys(SERVICE_DETAILS_CATALOG);

  const isCustomService = !catalogOptions.includes(selectedService);

  return (
    <form onSubmit={handleSubmit} className="ef-form-body">
      <div className="ef-form-group">
        <label className="ef-form-label">
          Your Name <span className="req">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Full name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="ef-input"
        />
      </div>

      <div className="ef-form-row">
        <div className="ef-form-group">
          <label className="ef-form-label">
            Mobile Number <span className="req">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="10-digit mobile number"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            className="ef-input"
          />
        </div>
        <div className="ef-form-group">
          <label className="ef-form-label">Email Address</label>
          <input
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="ef-input"
          />
        </div>
      </div>

      <div className="ef-form-row">
        <div className="ef-form-group">
          <label className="ef-form-label">City</label>
          <input
            type="text"
            placeholder="e.g. Mumbai, Surat"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="ef-input"
          />
        </div>
        <div className="ef-form-group">
          <label className="ef-form-label">Service Required</label>
          <select
            value={selectedService}
            onChange={(e) => onServiceChange(e.target.value)}
            className="ef-select"
          >
            {isCustomService && (
              <option value={selectedService}>
                {selectedService}
              </option>
            )}
            {catalogOptions.map((sName) => (
              <option key={sName} value={sName}>
                {sName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ef-form-group">
        <label className="ef-form-label">Tell us about your requirement</label>
        <textarea
          rows={3}
          placeholder="Briefly describe what you need"
          value={formData.requirement}
          onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
          className="ef-textarea"
        />
      </div>

      <button type="submit" className="ef-form-submit">
        Request a Callback
      </button>

      <div className="ef-form-trust">
        <ShieldCheck size={14} style={{ color: "#10b981" }} />
        <span>Your details stay confidential. No advance payment required.</span>
      </div>
    </form>
  );
}

// ─── 2. Filterable Practice Area Directory + Quality Badges + Photo Grid ────

function EasyFilingsServicesSection({
  props,
  config,
  onSelectService,
}: {
  props: any;
  config: WebsiteConfig;
  onSelectService?: (serviceName: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("All");

  const visibleIds = Array.isArray(props.visibleServiceIds)
    ? props.visibleServiceIds
    : null;

  const baseServices =
    visibleIds !== null && visibleIds.length > 0
      ? SHARED_SERVICES.filter((s) => visibleIds.includes(s.id))
      : visibleIds !== null && visibleIds.length === 0
      ? []
      : SHARED_SERVICES;

  const displayServices = baseServices.map((s) => {
    const meta = EASY_SERVICE_META[s.id] || {
      rating: 4.9,
      reviewCount: 950,
      price: "From ₹2,999",
      priceSub: "Transparent Pricing",
    };
    return {
      ...s,
      ...meta,
    };
  });

  const availableCategories = [
    "All",
    ...Array.from(new Set(displayServices.map((s) => s.category))),
  ];

  const filteredServices = displayServices.filter((s) =>
    activeCategory === "All" ? true : s.category === activeCategory
  );

  return (
    <>
      {/* 4 Quality Assurance Badges Strip */}
      <div className="ef-quality-strip">
        <div className="ef-quality-grid">
          <div className="ef-quality-item">
            <div className="ef-quality-icon">
              <Award size={16} />
            </div>
            <div className="ef-quality-text">ISO 9001:2015 Certified Process</div>
          </div>
          <div className="ef-quality-item">
            <div className="ef-quality-icon">
              <CheckCircle2 size={16} />
            </div>
            <div className="ef-quality-text">100% Online Paperless Process</div>
          </div>
          <div className="ef-quality-item">
            <div className="ef-quality-icon">
              <ShieldCheck size={16} />
            </div>
            <div className="ef-quality-text">Transparent Fixed Fees — No Hidden Charges</div>
          </div>
          <div className="ef-quality-item">
            <div className="ef-quality-icon">
              <Users size={16} />
            </div>
            <div className="ef-quality-text">Dedicated Chartered Accountant Support</div>
          </div>
        </div>
      </div>

      <section className="ef-services-section" id="services">
        <div className="ef-sec-header">
          <span className="ef-sec-tag">PRACTICE AREAS & PACKAGES</span>
          <h2 className="ef-sec-title">
            {props.title || "Every registration, filing and compliance your business needs"}
          </h2>
          <p className="ef-sec-sub">
            {props.subtitle ||
              "From founding your company to monthly GST and statutory tax filings, our advisory desk handles every statutory milestone."}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="ef-filter-tabs">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`ef-filter-pill ${activeCategory === cat ? "active" : ""}`}
            >
              {cat === "All" ? "All Services" : cat}
            </button>
          ))}
        </div>

        {filteredServices.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b", fontStyle: "italic" }}>
            No services match the selected filter.
          </div>
        ) : (
          <div className="ef-services-grid">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="ef-service-card"
                onClick={() => onSelectService && onSelectService(srv.title)}
                style={{ cursor: "pointer" }}
              >
                {srv.badge && <span className="ef-card-badge">{srv.badge}</span>}
                <div>
                  <div className="ef-card-icon">
                    <Building2 size={18} />
                  </div>
                  <h3 className="ef-service-title">{srv.title}</h3>
                  <div className="ef-service-rating">
                    <Star size={12} fill="#d97706" color="#d97706" />
                    <span>{srv.rating}</span>
                    <span className="count">({srv.reviewCount.toLocaleString()})</span>
                  </div>

                  <ul className="ef-scope-list">
                    {srv.scopeList.map((item, idx) => (
                      <li key={idx} className="ef-scope-item">
                        <Check size={13} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="ef-card-footer">
                  <div>
                    <div className="ef-price-tag">{srv.price}</div>
                    <span className="ef-price-sub">{srv.priceSub}</span>
                  </div>
                  <a
                    href="#home"
                    className="ef-card-link"
                    onClick={(e) => {
                      if (onSelectService) {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelectService(srv.title);
                      }
                    }}
                  >
                    Get started <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Practice Visual Gallery (Configurable Photo Tiles) */}
      <section className="ef-gallery-section">
        <div className="ef-sec-header" style={{ marginBottom: 28 }}>
          <span className="ef-sec-tag">{props.galleryTagline || "FULL PRACTICE SPECTRUM"}</span>
          <h2 className="ef-sec-title">{props.galleryTitle || "Specialized Advisory Desks"}</h2>
          <p className="ef-sec-sub">
            {props.gallerySubtitle || "Built for modern startups, established enterprises, and global investors entering India."}
          </p>
        </div>

        <div className="ef-gallery-grid">
          {(Array.isArray(props.galleryTiles) && props.galleryTiles.length > 0 ? props.galleryTiles : DEFAULT_PRACTICE_GALLERY_TILES).map((tile: PracticeGalleryTile, idx: number) => (
            <div
              key={tile.id || idx}
              className="ef-gallery-card"
              style={{ backgroundImage: `url(${tile.image})` }}
              onClick={() => onSelectService && onSelectService(tile.title)}
            >
              <div className="ef-gallery-overlay">
                <h4 className="ef-gallery-title">{tile.title}</h4>
                <p className="ef-gallery-sub">{tile.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ─── 3. Compliance Due Date Calendar Section ────────────────────────────────

function EasyFilingsTaxCalendarSection({
  props,
  config,
}: {
  props: any;
  config: WebsiteConfig;
}) {
  const [selectedAuth, setSelectedAuth] = useState<string>("All");

  const datesToDisplay = SHARED_TAX_DATES.filter(
    (d) => selectedAuth === "All" || d.authority === selectedAuth
  );

  return (
    <section className="ef-calendar-section" id="tax-calendar">
      <div className="ef-calendar-inner">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <span className="ef-sec-tag">STATUTORY DUE DATES</span>
            <h2 className="ef-sec-title" style={{ textAlign: "left", margin: "4px 0" }}>
              {props.title || "Upcoming Compliance & Filing Deadlines"}
            </h2>
            <p className="ef-sec-sub" style={{ textAlign: "left" }}>
              {props.subtitle ||
                "Never miss a statutory filing date across MCA, GSTN, and CBDT authorities."}
            </p>
          </div>

          {/* Authority Chips */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["All", "GSTN", "CBDT", "MCA"].map((auth) => (
              <button
                key={auth}
                onClick={() => setSelectedAuth(auth)}
                className={`ef-filter-pill ${selectedAuth === auth ? "active" : ""}`}
                style={{ padding: "5px 12px", fontSize: 11 }}
              >
                {auth === "All" ? "All Authorities" : auth}
              </button>
            ))}
          </div>
        </div>

        <div className="ef-calendar-grid">
          {datesToDisplay.map((item, idx) => {
            const parts = item.date.split(" ");
            const day = parts[0] || "15";
            const month = parts[1] || "OCT";
            return (
              <div key={idx} className="ef-calendar-card">
                <div className="ef-date-badge">
                  <span className="day">{day}</span>
                  <span className="month">{month}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>
                    {item.form}
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      marginTop: 6,
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "#f0fdf9",
                      color: "#0f766e",
                      border: "1px solid #ccfbf1",
                    }}
                  >
                    Authority: {item.authority}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 11.5,
            color: "#64748b",
            fontStyle: "italic",
            textAlign: "right",
          }}
        >
          * Official statutory calendar for reference. Extensions notified by CBIC/CBDT/MCA are automatically updated.
        </div>
      </div>
    </section>
  );
}

// ─── 4. Testimonials Section ("What our clients say") ────────────────────────

function EasyFilingsTestimonialsSection({
  props,
  config,
}: {
  props: any;
  config: WebsiteConfig;
}) {
  return (
    <section className="ef-testimonials-section" id="testimonials">
      <div className="ef-sec-header">
        <span className="ef-sec-tag">CLIENT TESTIMONIALS</span>
        <h2 className="ef-sec-title">{props.title || "What our clients say"}</h2>
        <p className="ef-sec-sub">
          {props.subtitle ||
            "Hear from founders and enterprises across India who trust us with their compliance."}
        </p>
      </div>

      <div className="ef-testimonials-grid">
        {SHARED_CLIENT_REVIEWS.map((rev) => (
          <div key={rev.id} className="ef-testimonial-card">
            <div>
              <div className="ef-stars">★★★★★</div>
              <p className="ef-quote">"{rev.statement}"</p>
            </div>
            <div className="ef-author">
              <div className="ef-author-avatar">{rev.clientInitials}</div>
              <div>
                <div className="ef-author-name">{rev.businessSector}</div>
                <div className="ef-author-role">
                  {rev.engagementType} • {rev.location}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 5. CTA Section With Value Props & 4-Step Process ───────────────────────

function EasyFilingsCtaSection({
  props,
  config,
}: {
  props: any;
  config: WebsiteConfig;
}) {
  const ctaLink = sanitizeLink(props.ctaLink, "#contact");
  const ctaAttrs = getLinkAttributes(ctaLink);

  return (
    <>
      {/* Mid-Page Callout Banner */}
      <div className="ef-callout-banner">
        <div className="ef-callout-text">
          {props.headline ||
            "Need urgent filing assistance before the deadline? Speak with our principal CA now."}
        </div>
        <a
          href={ctaLink}
          {...ctaAttrs}
          className="ef-btn-primary"
          style={{
            background: "#ffffff",
            color: "#00635a",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {props.buttonText || props.ctaText || "Get Immediate Assistance"} <ArrowRight size={14} />
        </a>
      </div>

      {/* "What makes working with us different" (6 Cards) */}
      <section className="ef-diff-section" id="about">
        <div className="ef-sec-header">
          <span className="ef-sec-tag">WHY EASY FILINGS</span>
          <h2 className="ef-sec-title">What makes working with us different</h2>
          <p className="ef-sec-sub">
            Built for entrepreneurs who want compliance done right the first time.
          </p>
        </div>

        <div className="ef-diff-grid">
          <div className="ef-diff-card">
            <div className="ef-diff-icon">
              <Users size={20} />
            </div>
            <h4 className="ef-diff-title">Dedicated CA & CS Team</h4>
            <p className="ef-diff-desc">
              You get assigned real qualified Chartered Accountants, not call center telemarketers.
            </p>
          </div>

          <div className="ef-diff-card">
            <div className="ef-diff-icon">
              <FileCheck size={20} />
            </div>
            <h4 className="ef-diff-title">100% Digital Workflow</h4>
            <p className="ef-diff-desc">
              Upload documents securely from your phone or laptop with real-time status tracking.
            </p>
          </div>

          <div className="ef-diff-card">
            <div className="ef-diff-icon">
              <ShieldCheck size={20} />
            </div>
            <h4 className="ef-diff-title">Zero Hidden Fees</h4>
            <p className="ef-diff-desc">
              All government fees, professional charges, and stamp duties are itemized in writing upfront.
            </p>
          </div>

          <div className="ef-diff-card">
            <div className="ef-diff-icon">
              <Clock size={20} />
            </div>
            <h4 className="ef-diff-title">Guaranteed Timeline</h4>
            <p className="ef-diff-desc">
              Structured SLAs with milestone-based turnaround for every filing and registration.
            </p>
          </div>

          <div className="ef-diff-card">
            <div className="ef-diff-icon">
              <Headphones size={20} />
            </div>
            <h4 className="ef-diff-title">Post-Incorporation Support</h4>
            <p className="ef-diff-desc">
              Free consultation on bank account opening, GST threshold, and initial ROC compliance.
            </p>
          </div>

          <div className="ef-diff-card">
            <div className="ef-diff-icon">
              <Lock size={20} />
            </div>
            <h4 className="ef-diff-title">Bank-Grade Confidentiality</h4>
            <p className="ef-diff-desc">
              End-to-end 256-bit encryption for all financial records and director identity documents.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="ef-steps-section">
        <div className="ef-sec-header">
          <span className="ef-sec-tag">STRUCTURED WORKFLOW</span>
          <h2 className="ef-sec-title">How we work with you in 4 simple steps</h2>
          <p className="ef-sec-sub">
            From initial advisory to verified certificate delivery in a streamlined process.
          </p>
        </div>

        <div className="ef-steps-grid">
          <div className="ef-step-card">
            <div className="ef-step-number">01</div>
            <h4 className="ef-step-title">Select Your Service</h4>
            <p className="ef-step-desc">
              Choose the compliance or registration service you need and submit your basic enquiry.
            </p>
          </div>

          <div className="ef-step-card">
            <div className="ef-step-number">02</div>
            <h4 className="ef-step-title">Consult with an Expert</h4>
            <p className="ef-step-desc">
              Our Chartered Accountant reviews your details and explains the exact roadmap and documents needed.
            </p>
          </div>

          <div className="ef-step-card">
            <div className="ef-step-number">03</div>
            <h4 className="ef-step-title">Document Verification</h4>
            <p className="ef-step-desc">
              Upload scanned copies via our secure portal. We verify and prepare statutory forms within 24 hours.
            </p>
          </div>

          <div className="ef-step-card">
            <div className="ef-step-number">04</div>
            <h4 className="ef-step-title">Filing & Certification</h4>
            <p className="ef-step-desc">
              We execute the filing with government portals (MCA/GSTN/CBDT) and deliver your verified certificates.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── 6. Contact Section With Signature FAQ Accordion & Office Details ───────

function EasyFilingsContactSection({
  props,
  config,
}: {
  props: any;
  config: WebsiteConfig;
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <section className="ef-faq-section" id="contact">
      <div className="ef-sec-header" style={{ marginBottom: 40 }}>
        <span className="ef-sec-tag">COMMON QUESTIONS</span>
        <h2 className="ef-sec-title">{props.title || "Before you get in touch"}</h2>
        <p className="ef-sec-sub">
          {props.subtitle ||
            "The questions we are asked most often, answered plainly. If yours is not here, ask us — we would rather tell you now than have you find out later."}
        </p>
      </div>

      <div className="ef-faq-inner">
        {/* Left Card: Enquiry Prompt */}
        <div className="ef-faq-left-card">
          <h4>Still not sure what applies to you?</h4>
          <p>
            Fifteen minutes with one of our chartered accountants, at no charge,
            and you will know exactly where you stand.
          </p>
          <a
            href="#home"
            className="ef-btn-primary"
            style={{ width: "100%", justifyContent: "center", marginBottom: 12 }}
          >
            Ask your question <ArrowRight size={14} />
          </a>

          <div className="ef-faq-phone-badge">
            <Phone size={15} style={{ color: "#00635a" }} />
            <span>{config.branding.phone || "+91 9800000000"}</span>
          </div>

          <div className="ef-faq-badges">
            <div className="ef-faq-badge-item">
              <CheckCircle2 size={14} />
              <span>Within 1 working day response</span>
            </div>
            <div className="ef-faq-badge-item">
              <CheckCircle2 size={14} />
              <span>No advance payment to talk to us</span>
            </div>
            <div className="ef-faq-badge-item">
              <CheckCircle2 size={14} />
              <span>Answered by a qualified professional</span>
            </div>
          </div>
        </div>

        {/* Right Accordion: 8 Expandable Questions */}
        <div className="ef-accordion-list">
          {FAQS_LIST.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`ef-accordion-item ${isOpen ? "open" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="ef-accordion-trigger"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp size={16} style={{ color: "#00635a" }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: "#64748b" }} />
                  )}
                </button>
                {isOpen && <div className="ef-accordion-body">{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 7. Financial & Tax Calculators Section ─────────────────────────────────

function EasyFilingsCalculatorsSection({
  props,
  config,
}: {
  props: any;
  config: WebsiteConfig;
}) {
  return (
    <section className="ef-services-section" id="calculators" style={{ background: "#f8fafc" }}>
      <div className="ef-sec-header">
        <span className="ef-sec-tag">TAX ESTIMATION TOOLS</span>
        <h2 className="ef-sec-title">
          {props.title || "Financial & Tax Calculators"}
        </h2>
        <p className="ef-sec-sub">
          {props.subtitle ||
            "Evaluate your GST liabilities, compare Old vs New Tax Regime, and project statutory TDS."}
        </p>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        <div className="ef-service-card">
          <div className="ef-card-icon">
            <Scale size={20} />
          </div>
          <h3 className="ef-service-title">GST Input Credit Calculator</h3>
          <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.5, margin: "0 0 16px" }}>
            Compute net tax payable after setting off eligible CGST, SGST, and IGST input credits under Rule 37A.
          </p>
          <a href="#contact" className="ef-btn-primary" style={{ justifyContent: "center" }}>
            Launch Tool
          </a>
        </div>

        <div className="ef-service-card">
          <div className="ef-card-icon">
            <FileText size={20} />
          </div>
          <h3 className="ef-service-title">Old vs New Regime Comparator</h3>
          <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.5, margin: "0 0 16px" }}>
            Compare effective personal income tax rates across Section 115BAC deductions and standard exemptions.
          </p>
          <a href="#contact" className="ef-btn-primary" style={{ justifyContent: "center" }}>
            Launch Tool
          </a>
        </div>

        <div className="ef-service-card">
          <div className="ef-card-icon">
            <TrendingUp size={20} />
          </div>
          <h3 className="ef-service-title">Advance Tax Estimator</h3>
          <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.5, margin: "0 0 16px" }}>
            Calculate quarterly installment obligations (15%, 45%, 75%, 100%) to prevent Section 234B/C interest.
          </p>
          <a href="#contact" className="ef-btn-primary" style={{ justifyContent: "center" }}>
            Launch Tool
          </a>
        </div>
      </div>
    </section>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  if (subscribed) {
    return (
      <div style={{ color: "#10b981", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
        <CheckCircle2 size={16} /> Subscribed to compliance digests!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="ef-newsletter-input-group">
      <input
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="ef-newsletter-input"
      />
      <button type="submit" className="ef-btn-primary">
        Subscribe
      </button>
    </form>
  );
}
