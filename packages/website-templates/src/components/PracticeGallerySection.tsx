import React from "react";
import { PracticeGalleryTile, DEFAULT_PRACTICE_GALLERY_TILES } from "../fixtures/sharedData";

export interface PracticeGallerySectionProps {
  tiles?: PracticeGalleryTile[];
  title?: string;
  tagline?: string;
  subtitle?: string;
  variant?: "apex" | "fintech" | "classic" | "minimal" | "easy-filings";
  onSelectService?: (serviceName: string) => void;
}

export function PracticeGallerySection({
  tiles,
  title = "Specialized Advisory Desks",
  tagline = "FULL PRACTICE SPECTRUM",
  subtitle = "Built for modern startups, established enterprises, and global investors entering India.",
  variant = "easy-filings",
  onSelectService,
}: PracticeGallerySectionProps) {
  const displayTiles = Array.isArray(tiles) && tiles.length > 0 ? tiles : DEFAULT_PRACTICE_GALLERY_TILES;

  const getVariantStyles = () => {
    switch (variant) {
      case "apex":
        return {
          sectionBg: "var(--wb-surface, #f9fafb)",
          borderColor: "rgba(0,0,0,0.06)",
          tagColor: "var(--wb-primary, #0f6e56)",
          titleFont: "var(--wb-font, 'Space Grotesk', sans-serif)",
          titleColor: "var(--wb-text, #111827)",
          cardRadius: "10px",
          cardHeight: "180px",
          overlayBg: "linear-gradient(180deg, rgba(15, 110, 86, 0.15) 0%, rgba(15, 23, 42, 0.90) 100%)",
          subColor: "#cbd5e1",
        };
      case "fintech":
        return {
          sectionBg: "rgba(15, 23, 42, 0.03)",
          borderColor: "rgba(255,255,255,0.08)",
          tagColor: "var(--wb-primary, #0284c7)",
          titleFont: "var(--wb-font, 'Inter', sans-serif)",
          titleColor: "var(--wb-text, #0f172a)",
          cardRadius: "12px",
          cardHeight: "185px",
          overlayBg: "linear-gradient(180deg, rgba(2, 132, 199, 0.1) 0%, rgba(15, 23, 42, 0.92) 100%)",
          subColor: "#94a3b8",
        };
      case "classic":
        return {
          sectionBg: "#f8fafc",
          borderColor: "#e2e8f0",
          tagColor: "var(--wb-accent, #b45309)",
          titleFont: "var(--wb-font, 'Playfair Display', Georgia, serif)",
          titleColor: "var(--wb-primary, #1e3a8a)",
          cardRadius: "4px",
          cardHeight: "180px",
          overlayBg: "linear-gradient(180deg, rgba(30, 58, 138, 0.15) 0%, rgba(15, 23, 42, 0.92) 100%)",
          subColor: "#cbd5e1",
        };
      case "minimal":
        return {
          sectionBg: "#fafafa",
          borderColor: "rgba(0,0,0,0.06)",
          tagColor: "#71717a",
          titleFont: "var(--wb-font, 'Plus Jakarta Sans', sans-serif)",
          titleColor: "var(--wb-text, #09090b)",
          cardRadius: "8px",
          cardHeight: "180px",
          overlayBg: "linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(9, 9, 11, 0.92) 100%)",
          subColor: "#a1a1aa",
        };
      case "easy-filings":
      default:
        return {
          sectionBg: "#f8fafc",
          borderColor: "#e2e8f0",
          tagColor: "#0f766e",
          titleFont: "var(--wb-font-heading, 'Space Grotesk', sans-serif)",
          titleColor: "#0f172a",
          cardRadius: "10px",
          cardHeight: "180px",
          overlayBg: "linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.88) 100%)",
          subColor: "#94a3b8",
        };
    }
  };

  const st = getVariantStyles();

  return (
    <section
      className="practice-gallery-section"
      style={{
        padding: "56px 24px",
        background: st.sectionBg,
        borderTop: `1px solid ${st.borderColor}`,
        borderBottom: `1px solid ${st.borderColor}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto 28px", textAlign: "center" }}>
        {tagline && (
          <span
            style={{
              display: "inline-block",
              fontSize: "10.5px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: st.tagColor,
              marginBottom: 6,
              fontFamily: "var(--mono, monospace)",
            }}
          >
            {tagline}
          </span>
        )}
        <h2
          style={{
            fontSize: "26px",
            fontWeight: 800,
            margin: "0 0 8px",
            color: st.titleColor,
            fontFamily: st.titleFont,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: "13.5px",
              color: "#64748b",
              margin: 0,
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div
        className="practice-gallery-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {displayTiles.map((tile, idx) => (
          <div
            key={tile.id || idx}
            className="practice-gallery-card"
            style={{
              height: st.cardHeight,
              borderRadius: st.cardRadius,
              overflow: "hidden",
              position: "relative",
              backgroundImage: `url(${tile.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onClick={() => onSelectService && onSelectService(tile.title)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.14)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: st.overlayBg,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "16px",
                color: "#ffffff",
              }}
            >
              <h4
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  margin: "0 0 3px",
                  fontFamily: st.titleFont,
                  color: "#ffffff",
                }}
              >
                {tile.title}
              </h4>
              <p
                style={{
                  fontSize: "11px",
                  color: st.subColor,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {tile.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
