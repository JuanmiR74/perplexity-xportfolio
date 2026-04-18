export type Fund = { id: string; name: string; isin: string; };
export type FundPosition = { id: string; fundId: string; name: string; isin: string; shares: number; buyPrice: number; currentPrice: number; investedValue: number; currentValue: number; pnl: number; pnlPercent: number; };
export type RoboAdvisor = { id: string; name: string; totalValue: number; investedValue: number; pnl: number; pnlPercent: number; cashBalance: number; annualReturn: number; };
export type ThreeDimensionalClassification = { geography: string; sectors: string; assetClassPro: string; };
