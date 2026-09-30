import React from "react";
import { WebsiteConfig } from "website-core";
import { getTemplateComponent } from "../registry";
import "../templates/apex-corporate/apex.css";
import "../templates/fintech-modern/fintech.css";
import "../templates/trust-classic/trust.css";
import "../templates/minimal-studio/minimal.css";
import "../templates/easy-filings/easy-filings.css";
import "../templates/accountax/accountax.css";
import "../templates/fortax/fortax.css";
import "../templates/lumen/lumen.css";
import "../templates/shared/parts.css";
import "../templates/pulse/pulse.css";
import "../templates/ledger/ledger.css";
import "./animations.css";

export interface WebsiteRendererProps {
  config: WebsiteConfig;
  activePageSlug?: string;
  activePageId?: string;
  onNavigatePage?: (pageSlug: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function WebsiteRenderer({
  config,
  activePageSlug,
  activePageId,
  onNavigatePage,
  className,
  style,
}: WebsiteRendererProps) {
  const TemplateComponent = getTemplateComponent(config.templateId);

  // Resolve active page by slug or id, defaulting to first page (home)
  const resolvedPage = React.useMemo(() => {
    if (!config.pages || config.pages.length === 0) return undefined;
    if (activePageSlug) {
      const match = config.pages.find(
        (p) => p.slug?.toLowerCase() === activePageSlug.toLowerCase() || (p.slug === "home" && activePageSlug === "")
      );
      if (match) return match;
    }
    if (activePageId) {
      const match = config.pages.find((p) => p.id === activePageId);
      if (match) return match;
    }
    return config.pages[0];
  }, [config.pages, activePageSlug, activePageId]);

  // If a subpage is explicitly selected, construct a page-focused WebsiteConfig
  const effectiveConfig = React.useMemo(() => {
    if (!resolvedPage || resolvedPage === config.pages[0]) {
      return config;
    }
    // Swap the active page to the front so all templates render this page's sections
    return {
      ...config,
      pages: [resolvedPage, ...config.pages.filter((p) => p.id !== resolvedPage.id)],
    };
  }, [config, resolvedPage]);

  // Intercept navigation link clicks inside iframe or canvas to route between pages seamlessly
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest("a");
    if (!target) return;

    const href = target.getAttribute("href");
    if (!href) return;

    // Check if it's an internal route or anchor link
    if (href.startsWith("#") || href.startsWith("/")) {
      const cleanSlug = href.replace(/^[#/]+/, "").toLowerCase();
      if (!cleanSlug || cleanSlug === "home") {
        // Navigating to Home
        if (typeof window !== "undefined") {
          try {
            if (window.parent && window.parent !== window) {
              window.parent.postMessage(
                { type: "ACTIVEDESK_PAGE_NAVIGATED", payload: { pageSlug: "home" } },
                "*"
              );
            }
          } catch {}
        }
        if (onNavigatePage) {
          e.preventDefault();
          onNavigatePage("home");
        }
        return;
      }

      // Check if matches any configured page
      const matchingPage = config.pages?.find(
        (p) =>
          p.slug?.toLowerCase() === cleanSlug ||
          p.title?.toLowerCase().replace(/\s+/g, "-") === cleanSlug
      );

      if (matchingPage) {
        e.preventDefault();
        if (typeof window !== "undefined") {
          try {
            if (window.parent && window.parent !== window) {
              window.parent.postMessage(
                { type: "ACTIVEDESK_PAGE_NAVIGATED", payload: { pageSlug: matchingPage.slug, pageId: matchingPage.id } },
                "*"
              );
            }
          } catch {}
        }
        if (onNavigatePage) {
          onNavigatePage(matchingPage.slug);
        } else {
          // In standalone preview, scroll to top smooth
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      }
    }
  };

  // Resolve font family to variable with robust system fallback
  const getFontFamilyStack = (font?: string) => {
    switch (font) {
      case "Playfair Display":
        return "var(--font-playfair, 'Playfair Display'), Georgia, 'Times New Roman', serif";
      case "Inter":
        return "var(--font-inter, 'Inter'), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      case "Plus Jakarta Sans":
        return "var(--font-plus-jakarta, 'Plus Jakarta Sans'), system-ui, sans-serif";
      case "Space Grotesk":
      default:
        return "var(--font-space-grotesk, 'Space Grotesk'), system-ui, sans-serif";
    }
  };

  const headingFont = config.theme.headingFontFamily || config.theme.fontFamily || "Space Grotesk";
  const bodyFont = config.theme.bodyFontFamily || config.theme.fontFamily || "Space Grotesk";

  const animationsEnabled = config.theme.animationsEnabled ?? true;
  const animationStyle = config.theme.animationStyle || "fade-up";
  const animationSpeed = config.theme.animationSpeed || "normal";
  const cardHoverEffect = config.theme.cardHoverEffect ?? true;
  const scrollAnimations = config.theme.scrollAnimations ?? true;
  const glassmorphism = config.theme.glassmorphism ?? true;
  const glowingBadges = config.theme.glowingBadges ?? true;
  const scrollProgressBar = config.theme.scrollProgressBar ?? false;

  const [scrollProgress, setScrollProgress] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Setup Scroll Progress Indicator
  React.useEffect(() => {
    if (!scrollProgressBar || typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollEl = containerRef.current?.closest(".wb-preview-scroll-container") || document.documentElement;
      const scrollTop = scrollEl === document.documentElement ? window.scrollY : (scrollEl as HTMLElement).scrollTop;
      const scrollHeight = scrollEl === document.documentElement 
        ? document.documentElement.scrollHeight - window.innerHeight
        : (scrollEl as HTMLElement).scrollHeight - (scrollEl as HTMLElement).clientHeight;

      if (scrollHeight > 0) {
        const progress = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollProgressBar]);

  // Setup Scroll Reveal Intersection Observer
  React.useEffect(() => {
    if (!scrollAnimations || !animationsEnabled || typeof window === "undefined") {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const elementsToReveal = container.querySelectorAll<HTMLElement>(
      "section, .apex-service-card, .fintech-card, .trust-practice-card, .minimal-service-item, .easy-card, .accountax-card, .fortax-card, .lm-tile, .lm-tl-item, .lm-quote-lead, .lm-quote-small, .lm-calc, .apex-calc-card, .apex-due-card, .apex-testimonial-card, .fintech-stat-card, .trust-testimonial-card, .easy-calc-card, .accountax-testimonial, .fortax-feature-card, .pl-card, .pl-review, .pl-tab-panel, .lg-index li, .lg-card, .lg-hero-panel"
    );

    elementsToReveal.forEach((el, index) => {
      el.classList.add("wb-reveal-on-scroll");

      // Hero section or first section is always visible immediately for instant perceived speed
      if (index === 0 || el.tagName.toLowerCase() === "header" || el.classList.contains("apex-hero") || el.classList.contains("fintech-hero") || el.classList.contains("trust-hero") || el.classList.contains("minimal-hero") || el.classList.contains("easy-hero") || el.classList.contains("accountax-hero") || el.classList.contains("fortax-hero") || el.classList.contains("lm-hero") || el.classList.contains("pl-hero") || el.classList.contains("lg-hero")) {
        el.classList.add("wb-in-view");
      }
    });

    if (!("IntersectionObserver" in window)) {
      elementsToReveal.forEach((el) => el.classList.add("wb-in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("wb-in-view");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -20px 0px",
        threshold: 0.05,
      }
    );

    elementsToReveal.forEach((el) => observer.observe(el));

    // Also run an immediate viewport check in case observer delay occurs inside iframes
    const checkInitialInView = () => {
      elementsToReveal.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("wb-in-view");
        }
      });
    };
    checkInitialInView();

    window.addEventListener("scroll", checkInitialInView, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkInitialInView);
    };
  }, [scrollAnimations, animationsEnabled, effectiveConfig]);

  const getAnimDuration = (speed?: string) => {
    switch (speed) {
      case "fast":
        return "0.35s";
      case "slow":
        return "0.95s";
      case "normal":
      default:
        return "0.6s";
    }
  };

  // Apply scoped CSS custom properties to ensure template isolation
  const scopedStyle: React.CSSProperties = {
    "--wb-primary": config.theme.primaryColor,
    "--wb-accent": config.theme.accentColor,
    "--wb-bg": config.theme.backgroundColor,
    "--wb-surface": config.theme.surfaceColor,
    "--wb-text": config.theme.textColor,
    "--wb-font": getFontFamilyStack(bodyFont),
    "--wb-font-body": getFontFamilyStack(bodyFont),
    "--wb-font-heading": getFontFamilyStack(headingFont),
    "--wb-anim-duration": getAnimDuration(animationSpeed),
    ...style,
  } as React.CSSProperties;

  const animClasses = [
    "wb-isolated-canvas",
    animationsEnabled && animationStyle !== "none" ? "wb-anim-enabled" : "",
    animationsEnabled && animationStyle ? `wb-anim-style-${animationStyle}` : "",
    scrollAnimations ? "wb-scroll-anim-enabled" : "",
    cardHoverEffect ? "wb-hover-enabled" : "",
    glassmorphism ? "wb-glass-enabled" : "",
    glowingBadges ? "wb-glow-enabled" : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className={animClasses}
      style={scopedStyle}
      onClick={handleContainerClick}
    >
      {scrollProgressBar && (
        <div
          className="wb-scroll-progress-bar"
          style={{ width: `${scrollProgress}%` }}
        />
      )}
      <TemplateComponent config={effectiveConfig} />
    </div>
  );
}
