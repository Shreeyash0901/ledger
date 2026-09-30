import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { ALL_SERVICE_NAMES, submitTemplateLead } from "../fixtures/serviceCatalog";
import { MegaMenuConfig } from "website-core";

export interface TemplateConsultationFormProps {
  selectedService: string;
  onServiceChange: (service: string) => void;
  variant?: "corporate" | "fintech" | "classic" | "minimal";
  megaMenu?: MegaMenuConfig;
  sourceTemplate?: string;
  isHighlighted?: boolean;
  formHighlight?: boolean;
  formTitle?: string;
  formSubtitle?: string;
}

export function TemplateConsultationForm({
  selectedService,
  onServiceChange,
  variant = "corporate",
  megaMenu,
  sourceTemplate = "practice-template",
  isHighlighted = false,
  formHighlight = false,
  formTitle,
  formSubtitle,
}: TemplateConsultationFormProps) {
  const activeHighlight = isHighlighted || formHighlight;
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    requirement: "",
  });

  const availableServiceOptions = React.useMemo(() => {
    if (megaMenu?.categories && megaMenu.categories.length > 0) {
      const names = megaMenu.categories.flatMap((cat) => (cat.items || []).map((it) => it.label));
      if (names.length > 0) {
        return Array.from(new Set(names));
      }
    }
    return ALL_SERVICE_NAMES;
  }, [megaMenu]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) {
      return;
    }

    await submitTemplateLead({
      name: formData.name,
      phone: formData.mobile,
      email: formData.email,
      serviceInterest: selectedService,
      city: formData.city,
      notes: formData.requirement,
      sourceTemplate,
    });

    setSubmitted(true);
  };

  const isCustomService = !availableServiceOptions.includes(selectedService);

  // Variant-specific styles
  const isDark = variant === "fintech";
  const bgCard = isDark ? "rgba(15, 23, 42, 0.85)" : "#ffffff";
  const borderCard = isDark
    ? activeHighlight ? "#38bdf8" : "rgba(255, 255, 255, 0.12)"
    : activeHighlight ? "var(--wb-primary, #0f6e56)" : "rgba(0, 0, 0, 0.1)";
  const textColor = isDark ? "#ffffff" : "#0f172a";
  const mutedText = isDark ? "#94a3b8" : "#64748b";
  const inputBg = isDark ? "rgba(2, 6, 23, 0.6)" : "#f8fafc";
  const inputBorder = isDark ? "rgba(255, 255, 255, 0.15)" : "#e2e8f0";
  const inputColor = isDark ? "#ffffff" : "#0f172a";

  const btnBg =
    variant === "fintech"
      ? "linear-gradient(135deg, var(--wb-primary, #0284c7), #38bdf8)"
      : variant === "classic"
      ? "var(--wb-accent, #b45309)"
      : variant === "minimal"
      ? "#18181b"
      : "var(--wb-primary, #0f6e56)";

  if (submitted) {
    return (
      <div
        id="consultation-form-card"
        style={{
          background: bgCard,
          border: `1px solid ${borderCard}`,
          borderRadius: variant === "minimal" ? 0 : variant === "classic" ? 4 : 12,
          padding: "32px 24px",
          textAlign: "center",
          boxShadow: isDark
            ? "0 10px 30px rgba(0,0,0,0.4)"
            : "0 10px 25px -5px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: isDark ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5",
            color: "#10b981",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          <CheckCircle2 size={32} />
        </div>
        <h4 style={{ margin: "0 0 8px", fontSize: 18, color: textColor, fontWeight: 700 }}>
          Thank You! We'll Call You Soon
        </h4>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: textColor, opacity: 0.9, lineHeight: 1.5 }}>
          Thank you, <strong>{formData.name}</strong>. We have received your inquiry for{" "}
          <strong>{selectedService}</strong>.
        </p>
        <p style={{ margin: "0 0 16px", fontSize: 12, color: mutedText, lineHeight: 1.5 }}>
          Our designated Chartered Accountant will reach out to <strong>{formData.mobile}</strong>{" "}
          shortly to discuss your scope and answer any questions.
        </p>
        <div
          style={{
            background: isDark ? "rgba(255, 255, 255, 0.05)" : "#f8fafc",
            border: `1px solid ${inputBorder}`,
            borderRadius: 6,
            padding: "8px 12px",
            fontSize: 11.5,
            color: isDark ? "#38bdf8" : "var(--wb-primary, #0f6e56)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginBottom: 18,
          }}
        >
          <ShieldCheck size={15} style={{ flexShrink: 0 }} />
          <span>Professional Consultation • Zero Advance Payment</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", mobile: "", email: "", city: "", requirement: "" });
          }}
          style={{
            background: "transparent",
            border: `1px solid ${inputBorder}`,
            color: textColor,
            padding: "8px 16px",
            fontSize: 12,
            fontWeight: 600,
            borderRadius: variant === "minimal" ? 0 : 6,
            cursor: "pointer",
            width: "100%",
          }}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div
      id="consultation-form-card"
      style={{
        background: bgCard,
        border: `1px solid ${borderCard}`,
        borderRadius: variant === "minimal" ? 0 : variant === "classic" ? 4 : 12,
        padding: "24px 22px",
        boxShadow: isDark
          ? "0 10px 30px rgba(0,0,0,0.4)"
          : "0 10px 25px -5px rgba(0,0,0,0.06)",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <h3
          style={{
            margin: "0 0 4px",
            fontSize: 16,
            fontWeight: 700,
            color: textColor,
            fontFamily: variant === "classic" ? "Playfair Display, serif" : "inherit",
          }}
        >
          {formTitle || "Request Expert CA Consultation"}
        </h3>
        <p style={{ margin: 0, fontSize: 11.5, color: mutedText }}>
          {formSubtitle || "Select your required statutory or business service for direct partner advisory."}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Full Name */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: textColor, marginBottom: 4 }}>
            Full Name <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: 12.5,
              background: inputBg,
              border: `1px solid ${inputBorder}`,
              borderRadius: variant === "minimal" ? 0 : 6,
              color: inputColor,
              outline: "none",
            }}
          />
        </div>

        {/* Mobile & Email Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: textColor, marginBottom: 4 }}>
              Mobile Number <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="10-digit mobile"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: 12.5,
                background: inputBg,
                border: `1px solid ${inputBorder}`,
                borderRadius: variant === "minimal" ? 0 : 6,
                color: inputColor,
                outline: "none",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: textColor, marginBottom: 4 }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: 12.5,
                background: inputBg,
                border: `1px solid ${inputBorder}`,
                borderRadius: variant === "minimal" ? 0 : 6,
                color: inputColor,
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Service Required Dropdown */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: textColor, marginBottom: 4 }}>
            Service Area of Interest <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <select
            value={selectedService}
            onChange={(e) => onServiceChange(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: 12.5,
              background: inputBg,
              border: `1px solid ${inputBorder}`,
              borderRadius: variant === "minimal" ? 0 : 6,
              color: inputColor,
              outline: "none",
              cursor: "pointer",
            }}
          >
            {isCustomService && <option value={selectedService}>{selectedService}</option>}
            {availableServiceOptions.map((name) => (
              <option key={name} value={name} style={{ background: isDark ? "#0f172a" : "#ffffff", color: isDark ? "#fff" : "#000" }}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* City & Requirement */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 10 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: textColor, marginBottom: 4 }}>
              City / State
            </label>
            <input
              type="text"
              placeholder="e.g. Mumbai, Delhi"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: 12.5,
                background: inputBg,
                border: `1px solid ${inputBorder}`,
                borderRadius: variant === "minimal" ? 0 : 6,
                color: inputColor,
                outline: "none",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: textColor, marginBottom: 4 }}>
              Brief Requirement
            </label>
            <input
              type="text"
              placeholder="e.g. Need new filing setup"
              value={formData.requirement}
              onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: 12.5,
                background: inputBg,
                border: `1px solid ${inputBorder}`,
                borderRadius: variant === "minimal" ? 0 : 6,
                color: inputColor,
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            background: btnBg,
            color: "#ffffff",
            border: "none",
            borderRadius: variant === "minimal" ? 0 : variant === "classic" ? 3 : 8,
            padding: "10px 16px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginTop: 4,
            boxShadow: isDark
              ? "0 4px 14px rgba(56, 189, 248, 0.25)"
              : "0 2px 6px rgba(0, 0, 0, 0.12)",
          }}
        >
          <span>Get Free Expert Callback</span>
          <ArrowRight size={14} />
        </button>

        <div style={{ fontSize: 10.5, color: mutedText, textAlign: "center", marginTop: 2 }}>
          🔒 Confidential client data. No spam, reviewed by a Chartered Accountant.
        </div>
      </form>
    </div>
  );
}
