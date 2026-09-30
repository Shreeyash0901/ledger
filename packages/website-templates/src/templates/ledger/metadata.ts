import { TemplateMetadata } from "website-core";

export const LEDGER_METADATA: TemplateMetadata = {
  id: "ledger",
  name: "Ledger Classic",
  tagline: "Editorial Fraunces Serif & Ultramarine CA Advisory Template",
  description: "Editorial Fraunces serif typography and deep ultramarine palette with expandable index service rows and tabular calendar.",
  category: "Classic",
  defaultTheme: {
    primaryColor: "#2338e8",
    accentColor: "#0b1b4d",
    backgroundColor: "#ffffff",
    surfaceColor: "#eef0f7",
    textColor: "#0b1b4d",
    fontFamily: "Fraunces",
    borderRadius: "sm",
  },
  features: [
    "Editorial split hero with consultation panel",
    "Expandable service index accordion rows",
    "Filterable tax calendar data table",
    "Interactive single-quote review carousel",
  ],
  sections: [
    { id: "hero", type: "hero", label: "Hero Banner", description: "Oversized typography with hero form panel", editorKey: "hero", required: true, defaultEnabled: true },
    { id: "services", type: "services", label: "Services", description: "Expandable index service rows", editorKey: "services", defaultEnabled: true },
    { id: "tax-calendar", type: "tax-calendar", label: "Due Dates", description: "Statutory filing dates table", editorKey: "tax-calendar", defaultEnabled: true },
    { id: "calculators", type: "calculators", label: "Calculators", description: "Financial and tax estimators", editorKey: "calculators", defaultEnabled: true },
    { id: "about", type: "about", label: "About Firm", description: "Practice background, credentials, and ethos", editorKey: "about", defaultEnabled: true },
    { id: "testimonials", type: "testimonials", label: "Client Reviews", description: "Step-through client quote review", editorKey: "testimonials", defaultEnabled: true },
    { id: "cta", type: "cta", label: "Call to Action", description: "Full-width call to action section", editorKey: "cta", defaultEnabled: true },
    { id: "contact", type: "contact", label: "Contact", description: "Office contact details and callback form", editorKey: "contact", required: true, defaultEnabled: true },
  ],
};
