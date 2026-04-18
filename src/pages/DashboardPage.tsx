import { AppShell } from '../components/layout/AppShell';
import { PortfolioSummary } from '../components/dashboard/PortfolioSummary';
import { FundsTable } from '../components/funds/FundsTable';
import { XRayPanel } from '../components/xray/XRayPanel';
import { usePortfolio } from '../hooks/usePortfolio';

export function DashboardPage() {
  const { isLoading, error } = usePortfolio();

  return (
    <AppShell>
      <PortfolioSummary />

      {isLoading && (
        <div className="section-card">
          <p>Cargando cartera...</p>
        </div>
      )}

      {error && (
        <div className="section-card">
          <p>No se pudieron cargar los datos.</p>
        </div>
      )}

      <section className="tabs-panel">
        <div className="section-card">
          <h2>Fondos y roboadvisors</h2>
          <FundsTable />
        </div>

        <div className="section-card">
          <h2>X-Ray</h2>
          <XRayPanel />
        </div>
      </section>
    </AppShell>
  );
}
