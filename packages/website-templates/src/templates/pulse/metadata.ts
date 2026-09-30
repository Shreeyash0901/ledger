import { TemplateMetadata } from "website-core";

export const PULSE_METADATA: TemplateMetadata = {
  id: "pulse",
  name: "Pulse Modern",
  tagline: "Dynamic Violet & Lavender Tax & Compliance Template",
  description: "Dynamic violet and lavender palette with compliance tracker widgets, vertical service tabs, and fast lead generation.",
  category: "Modern",
  defaultTheme: {
    primaryColor: "#5b3df5",
    accentColor: "#16a877",
    backgroundColor: "#ffffff",
    surfaceColor: "#f5f3ff",
    textColor: "#1c1633",
    fontFamily: "Sora",
    borderRadius: "lg",
  },
  features: [
    "Interactive compliance tracker preview",
    "Vertical service tabbed panels",
    "Authority chip deadlines filter",
    "Horizontal review snap scroller",
  ],
  sections: [
    { id: "hero", type: "hero", label: "Hero Banner", description: "Headline and sample compliance tracker", editorKey: "hero", required: true, defaultEnabled: true },
    { id: "services", type: "services", label: "Services", description: "Vertical tabs with service detail panel", editorKey: "services", defaultEnabled: true },
    { id: "tax-calendar", type: "tax-calendar", label: "Due Dates", description: "Deadline cards with authority chips", editorKey: "tax-calendar", defaultEnabled: true },
    { id: "testimonials", type: "testimonials", label: "Client Reviews", description: "Horizontal review snap scroller", editorKey: "testimonials", defaultEnabled: true },
    { id: "cta", type: "cta", label: "Call to Action", description: "High-contrast action banner", editorKey: "cta", defaultEnabled: true },
    { id: "contact", type: "contact", label: "Contact", description: "Contact info chips and quick lead form", editorKey: "contact", required: true, defaultEnabled: true },
  ],
};
