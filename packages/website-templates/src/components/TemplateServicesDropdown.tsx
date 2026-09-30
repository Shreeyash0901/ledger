import React from "react";
import {
  ArrowRight,
  Sparkles,
  Building2,
  Scale,
  FileText,
  Award,
  FileCheck,
  Users,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { MegaMenuConfig, DEFAULT_MEGA_MENU_CONFIG } from "website-core";

export interface TemplateServicesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceTitle: string) => void;
  variant?: "corporate" | "fintech" | "classic" | "minimal" | "accountax" | "ledger";
  megaMenu?: MegaMenuConfig;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function getIconComponent(name?: string, color?: string) {
  const iconProps = { size: 13, style: { color, flexShrink: 0 } };
  switch (name) {
    case "FileText":
      return <FileText {...iconProps} />;
    case "Scale":
      return <Scale {...iconProps} />;
    case "Building2":
      return <Building2 {...iconProps} />;
    case "Award":
      return <Award {...iconProps} />;
    case "Sparkles":
      return <Sparkles {...iconProps} />;
    case "FileCheck":
      return <FileCheck {...iconProps} />;
    case "Users":
      return <Users {...iconProps} />;
    case "ShieldCheck":
      return <ShieldCheck {...iconProps} />;
    case "TrendingUp":
      return <TrendingUp {...iconProps} />;
    case "Briefcase":
      return <Briefcase {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
}

export function TemplateServicesDropdown({
  isOpen,
  onClose,
  onSelectService,
  variant = "corporate",
  megaMenu,
  onMouseEnter,
  onMouseLeave,
}: TemplateServicesDropdownProps) {
  if (!isOpen) return null;

  const menuConfig: MegaMenuConfig = megaMenu || DEFAULT_MEGA_MENU_CONFIG;
  if (menuConfig.enabled === false) return null;

  const categories = menuConfig.categories || [];
  const isDark = variant === "fintech" || variant === "accountax";
  const isClassic = variant === "classic";
  const isMinimal = variant === "minimal";
  const isAccountax = variant === "accountax";
  const isLedger = variant === "ledger";

  const numCategories = categories.length;
  // Calculate dynamic columns based on number of categories (2 columns for small, 4 columns for large)
  const gridColumns = numCategories <= 4 ? "repeat(2, 1fr)" : "repeat(4, 1fr)";
  const menuWidth = numCategories <= 4 ? 640 : 1080;

  const bgMenu = isAccountax ? "#090e17" : isDark ? "rgba(15, 23, 42, 0.98)" : "#ffffff";
  const borderMenu = isAccountax
    ? "rgba(245, 158, 11, 0.3)"
    : isDark
    ? "rgba(255, 255, 255, 0.14)"
    : isLedger
    ? "#0b1b4d"
    : isClassic
    ? "var(--wb-primary, #1e3a8a)"
    : isMinimal
    ? "#18181b"
    : "rgba(0, 0, 0, 0.1)";

  const titleColor = isAccountax
    ? "#f59e0b"
    : isDark
    ? "#38bdf8"
    : isLedger
    ? "#2338e8"
    : isClassic
    ? "var(--wb-accent, #b45309)"
    : isMinimal
    ? "#71717a"
    : "var(--wb-primary, #0f6e56)";

  const itemColor = isAccountax ? "#cbd5e1" : isDark ? "#cbd5e1" : isLedger ? "#0b1b4d" : "#1e293b";
  const hoverBg = isAccountax
    ? "rgba(245, 158, 11, 0.12)"
    : isDark
    ? "rgba(56, 189, 248, 0.12)"
    : isLedger
    ? "#eef0f7"
    : isClassic
    ? "rgba(30, 58, 138, 0.06)"
    : isMinimal
    ? "#f4f4f5"
    : "rgba(15, 110, 86, 0.08)";

  const hoverColor = isLedger ? "#2338e8" : !isDark ? "var(--wb-primary, #0f6e56)" : undefined;

  const actionText = menuConfig.bottomLinkText || "Book Consultation";
  const actionNotice =
    menuConfig.bottomNotice ||
    "All services include verified Chartered Accountant review & filing assurance";

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        left: "50%",
        transform: "translateX(-50%)",
        width: menuWidth,
        maxWidth: "94vw",
        maxHeight: "82vh",
        overflowY: "auto",
        background: bgMenu,
        backdropFilter: isDark ? "blur(18px)" : undefined,
        border: isLedger ? "2px solid #0b1b4d" : `${isClassic ? 2 : 1}px solid ${borderMenu}`,
        borderRadius: isMinimal ? 0 : isClassic || isLedger ? 6 : 12,
        boxShadow: isDark
          ? "0 24px 55px -10px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.15)"
          : isLedger
          ? "6px 6px 0px #0b1b4d"
          : "0 20px 50px -10px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0,0,0,0.04)",
        padding: "22px 24px",
        zIndex: 1000,
        display: "grid",
        gridTemplateColumns: gridColumns,
        gap: "20px 24px",
        textAlign: "left",
      }}
      role="menu"
      aria-label="Services Menu"
    >
      {categories.map((cat, cIdx) => (
        <div key={cat.id || cIdx} style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: titleColor,
              marginBottom: 8,
              paddingBottom: 4,
              borderBottom: isClassic ? "1px solid rgba(0,0,0,0.08)" : undefined,
              fontFamily: isMinimal ? "monospace" : isClassic ? "Playfair Display, serif" : "inherit",
            }}
          >
            {getIconComponent(cat.icon, titleColor)}
            <span>{cat.title}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
            {(cat.items || []).map((item, iIdx) => (
              <a
                key={item.id || iIdx}
                href={item.url || "#contact"}
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  onSelectService(item.label);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "5px 8px",
                  borderRadius: isMinimal ? 0 : 5,
                  fontSize: 12,
                  fontWeight: 500,
                  color: itemColor,
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = hoverBg;
                  if (hoverColor) e.currentTarget.style.color = hoverColor;
                  else if (!isDark) e.currentTarget.style.color = "var(--wb-primary, #0f6e56)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = itemColor;
                }}
              >
                <span>{item.label}</span>
                {item.popular && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "1.5px 5.5px",
                      borderRadius: 99,
                      background: isDark ? "rgba(16, 185, 129, 0.2)" : "#ecfdf5",
                      color: "#10b981",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Popular
                  </span>
                )}
              </a>
            ))}
          </div>

          {cat.viewAllText && (
            <a
              href={cat.viewAllUrl || "#services"}
              onClick={(e) => {
                e.preventDefault();
                onClose();
                onSelectService(cat.title);
              }}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: titleColor,
                textDecoration: "none",
                marginTop: 6,
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                cursor: "pointer",
              }}
            >
              {cat.viewAllText}
            </a>
          )}
        </div>
      ))}

      {/* Footer bar of dropdown */}
      {(actionNotice || actionText) && (
        <div
          style={{
            gridColumn: "1 / -1",
            borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9",
            paddingTop: 12,
            marginTop: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 11.5,
            color: isDark ? "#94a3b8" : "#64748b",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span>{actionNotice}</span>
          {actionText && (
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                const firstItem = categories[0]?.items?.[0]?.label || "Private Limited Company Registration";
                onSelectService(firstItem);
              }}
              style={{
                color: titleColor,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
              }}
            >
              {actionText} <ArrowRight size={12} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
