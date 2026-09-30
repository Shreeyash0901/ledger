import React from "react";
import { WebsiteConfig, TemplateId, TemplateMetadata } from "website-core";
import { ApexCorporateTemplate } from "./templates/apex-corporate";
import { APEX_CORPORATE_METADATA } from "./templates/apex-corporate/metadata";
import { FinTechModernTemplate } from "./templates/fintech-modern";
import { FINTECH_MODERN_METADATA } from "./templates/fintech-modern/metadata";
import { TrustClassicTemplate } from "./templates/trust-classic";
import { TRUST_CLASSIC_METADATA } from "./templates/trust-classic/metadata";
import { MinimalStudioTemplate } from "./templates/minimal-studio";
import { MINIMAL_STUDIO_METADATA } from "./templates/minimal-studio/metadata";
import { EasyFilingsTemplate } from "./templates/easy-filings";
import { EASY_FILINGS_METADATA } from "./templates/easy-filings/metadata";
import { AccountaxTemplate } from "./templates/accountax";
import { ACCOUNTAX_METADATA } from "./templates/accountax/metadata";
import { FortaxTemplate } from "./templates/fortax";
import { FORTAX_METADATA } from "./templates/fortax/metadata";
import { LumenTemplate } from "./templates/lumen";
import { LUMEN_METADATA } from "./templates/lumen/metadata";
import { PulseTemplate } from "./templates/pulse";
import { PULSE_METADATA } from "./templates/pulse/metadata";
import { LedgerTemplate } from "./templates/ledger";
import { LEDGER_METADATA } from "./templates/ledger/metadata";
import { KineticTemplate } from "./templates/kinetic";
import { KINETIC_METADATA } from "./templates/kinetic/metadata";

export interface TemplateRegistryEntry {
  id: TemplateId;
  metadata: TemplateMetadata;
  component: React.ComponentType<{ config: WebsiteConfig }>;
}

export const TEMPLATE_REGISTRY: Record<string, TemplateRegistryEntry> = {
  "apex-corporate": {
    id: "apex-corporate",
    metadata: APEX_CORPORATE_METADATA,
    component: ApexCorporateTemplate,
  },
  "fintech-modern": {
    id: "fintech-modern",
    metadata: FINTECH_MODERN_METADATA,
    component: FinTechModernTemplate,
  },
  "trust-classic": {
    id: "trust-classic",
    metadata: TRUST_CLASSIC_METADATA,
    component: TrustClassicTemplate,
  },
  "minimal-studio": {
    id: "minimal-studio",
    metadata: MINIMAL_STUDIO_METADATA,
    component: MinimalStudioTemplate,
  },
  "easy-filings": {
    id: "easy-filings",
    metadata: EASY_FILINGS_METADATA,
    component: EasyFilingsTemplate,
  },
  "accountax": {
    id: "accountax",
    metadata: ACCOUNTAX_METADATA,
    component: AccountaxTemplate,
  },
  "fortax": {
    id: "fortax",
    metadata: FORTAX_METADATA,
    component: FortaxTemplate,
  },
  "lumen": {
    id: "lumen",
    metadata: LUMEN_METADATA,
    component: LumenTemplate,
  },
  "pulse": {
    id: "pulse",
    metadata: PULSE_METADATA,
    component: PulseTemplate,
  },
  "ledger": {
    id: "ledger",
    metadata: LEDGER_METADATA,
    component: LedgerTemplate,
  },
  "kinetic": {
    id: "kinetic",
    metadata: KINETIC_METADATA,
    component: KineticTemplate,
  },
};

export function getAllTemplatesMetadata(): TemplateMetadata[] {
  return Object.values(TEMPLATE_REGISTRY).map((entry) => entry.metadata);
}

export function getTemplateMetadata(templateId: TemplateId): TemplateMetadata | undefined {
  return TEMPLATE_REGISTRY[templateId]?.metadata;
}

export function getTemplateSections(templateId: TemplateId) {
  const meta = getTemplateMetadata(templateId);
  return meta?.sections || [];
}

export function getTemplateComponent(templateId: TemplateId): React.ComponentType<{ config: WebsiteConfig }> {
  return TEMPLATE_REGISTRY[templateId]?.component || ApexCorporateTemplate;
}

