import { useMemo } from 'react';
import { toast } from 'sonner';
import { usePortfolio } from '../../hooks/usePortfolio';
import { formatCurrency, formatPercent } from '../../lib/utils';

export function FundsTable() {
  const { data, isLoading, refreshMany } = usePortfolio();

  const refreshableIsins = useMemo(
    () =>
      (data?.funds ?? [])
        .map((fund) => fund.isin)
        .filter((isin): isin is string => Boolean(isin)),
    [data?.funds]
  );

  const handleRefresh = async () => {
    if (!refreshableIsins.length) {
      toast.message('No hay ISIN para refrescar');
      return;
    }

    try {
      await refreshMany.mutateAsync(refreshableIsins);
      toast.success('Refresco lanzado');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al refrescar');
    }
  };

  if (isLoading) {
    return <div className="panel">Cargando fondos...</div>;
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Fondos</h2>
          <p>Posiciones manuales del usuario autenticado.</p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={handleRefresh}
          disabled={refreshMany.isPending}
          type="button"
        >
          {refreshMany.isPending ? 'Refrescando...' : 'Refrescar precios'}
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fondo</th>
              <th>ISIN</th>
              <th>Entidad</th>
              <th>Participaciones</th>
              <th>Invertido</th>
              <th>VL</th>
              <th>Valor</th>
              <th>Rent.</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {(data?.funds ?? []).map((fund) => (
              <tr key={fund.id}>
                <td>
                  <div className="cell-main">
                    <strong>{fund.fundName}</strong>
                    <span>{fund.managementCompany || 'Sin gestora'}</span>
                  </div>
                </td>
                <td>{fund.isin}</td>
                <td>{fund.platformEntity}</td>
                <td>{fund.shares}</td>
                <td>{formatCurrency(fund.investedAmount)}</td>
                <td>{fund.latestNav !== null ? formatCurrency(fund.latestNav) : '—'}</td>
                <td>{formatCurrency(fund.marketValue)}</td>
                <td>{formatPercent(fund.returnPct)}</td>
                <td>
                  <span className={`status-badge status-${fund.priceStatus || 'unknown'}`}>
                    {fund.priceStatus || 'unknown'}
                  </span>
                </td>
              </tr>
            ))}

            {!data?.funds?.length && (
              <tr>
                <td colSpan={9}>
                  <div className="empty-row">Todavía no hay fondos cargados.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
