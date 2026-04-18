import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { usePortfolio } from '../../hooks/usePortfolio';

export function FundForm() {
  const { addFund } = usePortfolio();
  const [form, setForm] = useState({
    isin: '',
    fundName: '',
    managementCompany: '',
    platformEntity: '',
    contractMode: 'individual' as const,
    shares: '',
    investedAmount: '',
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await addFund.mutateAsync({
        isin: form.isin.trim(),
        fundName: form.fundName.trim() || form.isin.trim(),
        managementCompany: form.managementCompany.trim() || null,
        platformEntity: form.platformEntity.trim(),
        contractMode: form.contractMode,
        roboAdvisorId: null,
        shares: Number(form.shares),
        investedAmount: Number(form.investedAmount),
        latestNav: null,
        latestNavDate: null,
        marketValue: null,
        returnAmount: null,
        returnPct: null,
        priceStatus: 'unavailable',
        priceSource: null,
        xray: { assetType: [], sectors: [], geography: [] },
        metadata: {},
      });

      toast.success('Fondo añadido');
      setForm({
        isin: '',
        fundName: '',
        managementCompany: '',
        platformEntity: '',
        contractMode: 'individual',
        shares: '',
        investedAmount: '',
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo añadir el fondo');
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        <span>ISIN</span>
        <input
          value={form.isin}
          onChange={(e) => setForm({ ...form, isin: e.target.value })}
          required
        />
      </label>

      <label>
        <span>Nombre</span>
        <input
          value={form.fundName}
          onChange={(e) => setForm({ ...form, fundName: e.target.value })}
        />
      </label>

      <label>
        <span>Gestora</span>
        <input
          value={form.managementCompany}
          onChange={(e) => setForm({ ...form, managementCompany: e.target.value })}
        />
      </label>

      <label>
        <span>Entidad</span>
        <input
          value={form.platformEntity}
          onChange={(e) => setForm({ ...form, platformEntity: e.target.value })}
          required
        />
      </label>

      <label>
        <span>Participaciones</span>
        <input
          type="number"
          step="0.0001"
          value={form.shares}
          onChange={(e) => setForm({ ...form, shares: e.target.value })}
          required
        />
      </label>

      <label>
        <span>Aportado</span>
        <input
          type="number"
          step="0.01"
          value={form.investedAmount}
          onChange={(e) => setForm({ ...form, investedAmount: e.target.value })}
          required
        />
      </label>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={addFund.isPending}>
          {addFund.isPending ? 'Guardando...' : 'Guardar fondo'}
        </button>
      </div>
    </form>
  );
}
