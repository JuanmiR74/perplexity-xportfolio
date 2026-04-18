import Header from '../components/Header';
import PortfolioSummary from '../components/dashboard/PortfolioSummary';

export default function DashboardPage() {
  const summary = {
    totalValue: 0,
    investedValue: 0,
    pnl: 0,
    pnlPercent: 0,
    assetCount: 0,
    cashBalance: 0,
    annualReturn: 0,
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <section className="mx-auto max-w-6xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-slate-600">Resumen inicial del portfolio.</p>
        </div>
        <PortfolioSummary summary={summary} />
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-slate-500">
          Aún no hay datos cargados.
        </div>
      </section>
    </main>
  );
}
