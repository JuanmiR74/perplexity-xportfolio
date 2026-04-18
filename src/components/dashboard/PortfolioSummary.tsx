type Summary = {
  totalValue: number;
  investedValue: number;
  pnl: number;
  pnlPercent: number;
  assetCount: number;
  cashBalance: number;
  annualReturn: number;
};

export default function PortfolioSummary({ summary }: { summary: Summary }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-xl border bg-white p-4">Valor total: {summary.totalValue}</div>
      <div className="rounded-xl border bg-white p-4">Invertido: {summary.investedValue}</div>
      <div className="rounded-xl border bg-white p-4">P/L: {summary.pnl}</div>
      <div className="rounded-xl border bg-white p-4">Activos: {summary.assetCount}</div>
    </div>
  );
}
