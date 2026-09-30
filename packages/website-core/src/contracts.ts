import { TemplateId } from "./types";

export interface TemplateSectionDefinition {
  id: string; // e.g. "hero", "services", "tax-calendar"
  type: string; // matching SectionType
  label: string; // display name e.g. "Hero Banner"
  description?: string; // e.g. "Headline, CTA, Badge & Imagery"
  editorKey: string; // matching editor component key
  required?: boolean;
  defaultEnabled?: boolean;
  defaultProps?: Record<string, unknown>;
}

export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  tagline: string;
  description: string;
  category: "Corporate" | "Modern" | "Classic" | "Minimal";
  previewImageUrl?: string;
  defaultTheme: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    surfaceColor: string;
    textColor: string;
    fontFamily: string;
    borderRadius: "none" | "sm" | "md" | "lg" | "full";
  };
  features: string[];
  sections?: TemplateSectionDefinition[];
}

export interface SectionContract<TProps = Record<string, unknown>> {
  type: string;
  name: string;
  description: string;
  defaultProps: TProps;
}
