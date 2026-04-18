import { usePortfolio } from '../../hooks/usePortfolio';
import { formatCurrency, formatPercent } from '../../lib/utils';

export function PortfolioSummary() {
  const { data } = usePortfolio();

  const metrics = [
    ['Invertido total', formatCurrency(data?.summary.investedTotal ?? 0)],
    ['Valor actual', formatCurrency(data?.summary.marketValueTotal ?? 0)],
    ['Ganancia / pérdida', formatCurrency(data?.summary.gainLoss ?? 0)],
    ['Rentabilidad', formatPercent(data?.summary.gainLossPct)],
    ['Fondos', `${data?.summary.fundsCount ?? 0}`],
    ['Sin precio', `${data?.summary.unavailableCount ?? 0}`],
    ['Última actualización', data?.summary.lastUpdated ?? 'Sin datos'],
  ];

  return (
    <section className="summary-grid">
      {metrics.map(([label, value]) => (
        <article className="metric-card" key={label}>
          <span className="metric-label">{label}</span>
          <strong className="metric-value">{value}</strong>
        </article>
      ))}
    </section>
  );
}
