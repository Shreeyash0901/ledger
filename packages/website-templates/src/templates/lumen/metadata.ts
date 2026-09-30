import { TemplateMetadata } from "website-core";

export const LUMEN_METADATA: TemplateMetadata = {
  id: "lumen",
  name: "Lumen Modern",
  tagline: "Fresh teal and coral CA template with a floating nav, bento services and a deadline timeline",
  description:
    "Modern, airy design with a gradient hero, live upcoming-deadline chips, bento-grid practice areas, a due-date timeline and a single-quote testimonial layout.",
  category: "Modern",
  defaultTheme: {
    primaryColor: "#0b4f55",
    accentColor: "#ff6a4d",
    backgroundColor: "#fafbfa",
    surfaceColor: "#edf3f2",
    textColor: "#0e1b1f",
    fontFamily: "Bricolage Grotesque",
    borderRadius: "lg",
  },
  features: [
    "Floating glass pill navigation",
    "Hero with upcoming filing deadlines",
    "Bento-grid services",
    "Due-date timeline with authority filter",
  ],
  sections: [
    { id: "hero", type: "hero", label: "Hero Banner", description: "Headline, deadline chips and callback form", editorKey: "hero", required: true, defaultEnabled: true },
    { id: "services", type: "services", label: "Services", description: "Bento grid of practice areas", editorKey: "services", defaultEnabled: true },
    { id: "tax-calendar", type: "tax-calendar", label: "Due Dates", description: "GST, CBDT and MCA deadline timeline", editorKey: "tax-calendar", defaultEnabled: true },
    { id: "testimonials", type: "testimonials", label: "Client Reviews", description: "One featured quote plus two supporting", editorKey: "testimonials", defaultEnabled: true },
    { id: "cta", type: "cta", label: "Call to Action", description: "Book-a-call banner", editorKey: "cta", defaultEnabled: true },
    { id: "contact", type: "contact", label: "Contact", description: "Office details and lead form", editorKey: "contact", required: true, defaultEnabled: true },
  ],
};
