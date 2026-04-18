import { PortfolioSummary } from '../components/dashboard/PortfolioSummary';
import { FundForm } from '../components/funds/FundForm';
import { FundsTable } from '../components/funds/FundsTable';
import { RoboAdvisorForm } from '../components/robo/RoboAdvisorForm';
import { XRayPanel } from '../components/xray/XRayPanel';

export default function DashboardPage() {
  return (
    <main className="dashboard-shell">
      <section className="hero-block">
        <div>
          <p className="eyebrow">FondoRadar</p>
          <h1>Control manual de cartera con auth y Supabase</h1>
          <p className="hero-copy">
            Base v1 orientada a fondos y roboadvisors, con refresco manual de precios y
            estructura preparada para crecer.
          </p>
        </div>
      </section>

      <PortfolioSummary />

      <section className="two-col">
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Nuevo fondo</h2>
              <p>Alta manual de posiciones para el usuario autenticado.</p>
            </div>
          </div>
          <FundForm />
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Nuevo roboadvisor</h2>
              <p>Alta manual del contenedor gestionado.</p>
            </div>
          </div>
          <RoboAdvisorForm />
        </article>
      </section>

      <FundsTable />
      <XRayPanel />
    </main>
  );
}
