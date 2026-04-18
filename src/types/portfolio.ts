export type ContractMode = 'individual' | 'roboadvisor';
export type PriceStatus = 'fresh' | 'recent' | 'stale' | 'unavailable';

export type AllocationItem = {
  category: string;
  weightPct: number;
};

export type ThreeDimensionalClassification = {
  assetType: AllocationItem[];
  sectors: AllocationItem[];
  geography: AllocationItem[];
};

export type FundPosition = {
  id: string;
  userId: string;
  isin: string;
  fundName: string;
  managementCompany: string | null;
  platformEntity: string;
  contractMode: ContractMode;
  roboAdvisorId?: string | null;
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
  metadata?: Record<string, unknown>;
};

export type RoboSubFund = {
  isin: string;
  fundName?: string;
  shares?: number;
  weightPct?: number;
  xray?: ThreeDimensionalClassification;
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
