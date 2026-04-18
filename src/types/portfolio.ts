export type PriceStatus = 'available' | 'unavailable' | 'stale' | 'unknown';

export type ContractMode = 'individual' | 'joint' | 'company';

export type XRaySlice = {
  name: string;
  weight: number;
};

export type ThreeDimensionalClassification = {
  assetType: XRaySlice[];
  sectors: XRaySlice[];
  geography: XRaySlice[];
};

export type FundPosition = {
  id: string;
  userId: string;
  isin: string;
  fundName: string;
  managementCompany: string | null;
  platformEntity: string;
  contractMode: ContractMode;
  roboAdvisorId: string | null;
  shares: number;
  investedAmount: number;
  latestNav: number | null;
  latestNavDate: string | null;
  marketValue: number | null;
  returnAmount: number | null;
  returnPct: number | null;
  priceStatus: PriceStatus;
  priceSource: string | null;
  xray: ThreeDimensionalClassification;
  metadata: Record<string, unknown>;
};

export type RoboSubFund = {
  isin?: string;
  name: string;
  weight?: number;
  amount?: number;
};

export type RoboAdvisor = {
  id: string;
  userId: string;
  name: string;
  entity: string;
  investedValue: number;
  totalValue: number;
  lastUpdated: string | null;
  subFunds: RoboSubFund[];
};

export type PortfolioSummary = {
  investedTotal: number;
  marketValueTotal: number;
  gainLoss: number;
  gainLossPct: number | null;
  fundsCount: number;
  unavailableCount: number;
  lastUpdated: string | null;
};
