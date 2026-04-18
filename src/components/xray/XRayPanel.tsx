export function XRayPanel() {
  return (
    <div className="xray-grid">
      <article className="section-subcard">
        <h3>Dimensiones</h3>
        <p className="muted">Gráficos por tipo de fondo, sector y geografía.</p>
      </article>
      <article className="section-subcard">
        <h3>Filtros</h3>
        <p className="muted">Entidad, modalidad, estado del precio y rango de rentabilidad.</p>
      </article>
      <article className="section-subcard">
        <h3>Análisis</h3>
        <p className="muted">Distribución ponderada por valor de mercado o aportado si no hay NAV vigente.</p>
      </article>
    </div>
  );
}
