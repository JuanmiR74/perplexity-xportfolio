import { AppShell } from '../components/layout/AppShell';
import { PortfolioSummary } from '../components/dashboard/PortfolioSummary';
import { FundsTable } from '../components/funds/FundsTable';
import { XRayPanel } from '../components/xray/XRayPanel';

export function DashboardPage() {
  return (
    <AppShell>
      <PortfolioSummary />
      <section className="tabs-panel">
        <div className="section-card">
          <h2>Fondos</h2>
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
