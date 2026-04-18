import { toast } from 'sonner';
import { usePortfolio } from '../../hooks/usePortfolio';
import { formatCurrency, formatPercent } from '../../lib/utils';
import { FundForm } from './FundForm';
import { RoboAdvisorForm } from '../robo/RoboAdvisorForm';

export function FundsTable() {
  const { data, refreshMany } = usePortfolio();

  const handleRefreshAll = async () => {
    const isins = data?.funds.map((fund) => fund.isin) ?? [];
    if (!isins.length) return toast.info('No hay fondos que refrescar');

    try {
      await refreshMany.mutateAsync(isins);
      toast.success('Refresco lanzado');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo refrescar');
    }
  };

  return (
    <div className="table-wrap">
      <div className="stack-block">
        <FundForm />
        <RoboAdvisorForm />
      </div>

      <div className="toolbar">
        <button
          className="btn btn-ghost"
          onClick={() => void handleRefreshAll()}
          disabled={refreshMany.isPending}
        >
          Refrescar cartera
        </button>
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
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {data?.funds.length ? (
            data.funds.map((fund) => (
              <tr key={fund.id}>
                <td>{fund.isin}</td>
                <td>{fund.fundName}</td>
                <td>{fund.platformEntity}</td>
                <td>{fund.contractMode}</td>
                <td>{fund.shares}</td>
                <td>{formatCurrency(fund.investedAmount)}</td>
                <td>{fund.latestNav ?? '—'}</td>
                <td>{fund.latestNavDate ?? '—'}</td>
                <td>{formatCurrency(fund.marketValue)}</td>
                <td>{formatPercent(fund.returnPct)}</td>
                <td>{fund.priceStatus}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={11} className="empty-cell">
                Todavía no hay fondos cargados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
