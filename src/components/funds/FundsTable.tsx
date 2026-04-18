export function FundsTable() {
  return (
    <div className="table-wrap">
      <div className="toolbar">
        <button className="btn btn-primary">Añadir fondo</button>
        <button className="btn btn-secondary">Añadir roboadvisor</button>
        <button className="btn btn-ghost">Refrescar cartera</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ISIN</th>
            <th>Nombre</th>
            <th>Entidad</th>
            <th>Modalidad</th>
            <th>Participaciones</th>
            <th>Aportado</th>
            <th>NAV</th>
            <th>Fecha NAV</th>
            <th>Valor actual</th>
            <th>Rent. %</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={11} className="empty-cell">Todavía no hay fondos cargados.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
