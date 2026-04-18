const metrics = [
  ['Invertido total', '€ 0,00'],
  ['Valor actual', '€ 0,00'],
  ['Ganancia / pérdida', '€ 0,00'],
  ['Rentabilidad', '0,00 %'],
  ['Fondos', '0'],
  ['Última actualización', 'Sin datos'],
];

export function PortfolioSummary() {
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
