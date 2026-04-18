type Summary = { totalValue: number; investedValue: number; pnl: number; pnlPercent: number; assetCount: number; cashBalance: number; annualReturn: number };
export default function PortfolioSummary({ summary }: { summary: Summary }) { return <div>{summary.totalValue}</div>; }
