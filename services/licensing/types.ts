// services/licensing/types.ts

export interface LicensePlan {
  id: string;
  name: string;
  description: string;
  defaultPrice: number;
  isActive: boolean;

  // Usage Rights
  commercialUse: boolean;
  streamingAllowed: boolean;
  radioAllowed: boolean;
  tvAllowed: boolean;
  monetizationAllowed: boolean;

  // Distribution Limits
  maxStreams: number | null;        // null = unlimited
  maxDistribution: number | null;   // null = unlimited
  territory: string | null;         // null = worldwide

  // Exclusivity
  isExclusive: boolean;

  // Deliverables
  includesStems: boolean;
  includesWav: boolean;
  includesMp3: boolean;

  createdAt: string; // ISO string
}

export interface LicensePlanFormData {
  name: string;
  description: string;
  defaultPrice: string; // string for <input> binding
  isActive: boolean;

  commercialUse: boolean;
  streamingAllowed: boolean;
  radioAllowed: boolean;
  tvAllowed: boolean;
  monetizationAllowed: boolean;

  maxStreams: string;
  maxDistribution: string;
  territory: string;

  isExclusive: boolean;

  includesStems: boolean;
  includesWav: boolean;
  includesMp3: boolean;
}
