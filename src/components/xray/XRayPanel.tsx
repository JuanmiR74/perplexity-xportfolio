import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { usePortfolio } from '../../hooks/usePortfolio';

const COLORS = ['#01696f', '#5591c7', '#e8af34', '#6daa45', '#d163a7', '#bb653b'];

export function XRayPanel() {
  const { data } = usePortfolio();
  const geography = aggregate(data?.funds ?? [], 'geography');

  return (
    <div className="xray-grid">
      <article className="section-subcard chart-card">
        <h3>Geografía</h3>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={geography} dataKey="value" nameKey="name" outerRadius={90}>
                {geography.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="section-subcard">
        <h3>Dimensiones v1</h3>
        <p className="muted">
          La pestaña X-Ray queda conectada a los datos persistidos y lista para
          ampliar con filtros y más gráficos.
        </p>
      </article>
    </div>
  );
}

function aggregate(funds: any[], key: 'geography' | 'sectors' | 'assetType') {
  const map = new Map<string, number>();

  for (const fund of funds) {
    const base = fund.marketValue ?? fund.investedAmount ?? 0;
    for (const item of fund.xray?.[key] ?? []) {
      map.set(item.category, (map.get(item.category) ?? 0) + (base * item.weightPct) / 100);
    }
  }

  return Array.from(map.entries()).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2)),
  }));
}
