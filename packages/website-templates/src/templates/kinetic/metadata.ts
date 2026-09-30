import { TemplateMetadata } from "website-core";

export const KINETIC_METADATA: TemplateMetadata = {
  id: "kinetic",
  name: "Kinetic Animated",
  tagline: "Pine green animated CA template with a growth-chart hero, counters and scroll reveals",
  description:
    "Professional animated design: word-by-word headline, drawing growth chart, animated stat counters, compliance marquee, spotlight service cards, process steps, auto-rotating reviews and a scroll progress bar.",
  category: "Modern",
  defaultTheme: {
    primaryColor: "#0f3d2e",
    accentColor: "#12a150",
    backgroundColor: "#f7f8f5",
    surfaceColor: "#ddf5e6",
    textColor: "#0b1a14",
    fontFamily: "Outfit",
    borderRadius: "lg",
  },
  features: [
    "Animated growth-chart hero",
    "Count-up stats and compliance marquee",
    "Scroll reveals and spotlight cards",
    "Auto-rotating reviews with progress",
  ],
  sections: [
    { id: "hero", type: "hero", label: "Hero Banner", description: "Animated headline, chart and stats", editorKey: "hero", required: true, defaultEnabled: true },
    { id: "services", type: "services", label: "Services and Process", description: "Spotlight cards plus four-step process", editorKey: "services", defaultEnabled: true },
    { id: "tax-calendar", type: "tax-calendar", label: "Due Dates", description: "Filterable statutory deadlines", editorKey: "tax-calendar", defaultEnabled: true },
    { id: "testimonials", type: "testimonials", label: "Client Reviews", description: "Auto-rotating client quotes", editorKey: "testimonials", defaultEnabled: true },
    { id: "cta", type: "cta", label: "Call to Action", description: "Animated-border banner", editorKey: "cta", defaultEnabled: true },
    { id: "contact", type: "contact", label: "Contact", description: "Office details and lead form", editorKey: "contact", required: true, defaultEnabled: true },
  ],
};
