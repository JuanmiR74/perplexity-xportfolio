import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { usePortfolio } from '../../hooks/usePortfolio';

type Slice = {
  name: string;
  value: number;
};

const COLORS = ['#01696f', '#437a22', '#006494', '#d19900', '#a13544', '#7a39bb'];

function aggregateByKey(
  funds: Array<{
    marketValue: number | null;
    xray: {
      assetType: Array<{ name: string; weight: number }>;
      sectors: Array<{ name: string; weight: number }>;
      geography: Array<{ name: string; weight: number }>;
    };
  }>,
  dimension: 'assetType' | 'sectors' | 'geography'
): Slice[] {
  const map = new Map<string, number>();

  funds.forEach((fund) => {
    const base = fund.marketValue ?? 0;
    fund.xray[dimension].forEach((item) => {
      const current = map.get(item.name) ?? 0;
      map.set(item.name, current + base * (item.weight / 100));
    });
  });

  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
}

function ChartBlock({ title, data }: { title: string; data: Slice[] }) {
  return (
    <article className="panel">
      <div className="panel-header">
        <div>
          <h2>{title}</h2>
          <p>Distribución agregada de la cartera.</p>
        </div>
      </div>

      <div className="chart-box">
        {data.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                innerRadius={70}
                outerRadius={105}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => value.toFixed(2)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-row">Sin datos X-Ray todavía.</div>
        )}
      </div>

      <div className="legend-list">
        {data.slice(0, 8).map((item, index) => (
          <div className="legend-item" key={item.name}>
            <span
              className="legend-dot"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span>{item.name}</span>
            <strong>{item.value.toFixed(2)} €</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

export function XRayPanel() {
  const { data } = usePortfolio();

  const assetTypeData = useMemo(
    () => aggregateByKey(data?.funds ?? [], 'assetType'),
    [data?.funds]
  );

  const sectorsData = useMemo(
    () => aggregateByKey(data?.funds ?? [], 'sectors'),
    [data?.funds]
  );

  const geographyData = useMemo(
    () => aggregateByKey(data?.funds ?? [], 'geography'),
    [data?.funds]
  );

  return (
    <section className="xray-grid">
      <ChartBlock title="X-Ray · Tipo de activo" data={assetTypeData} />
      <ChartBlock title="X-Ray · Sectores" data={sectorsData} />
      <ChartBlock title="X-Ray · Geografía" data={geographyData} />
    </section>
  );
}
