import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { usePortfolio } from '../../hooks/usePortfolio';

export function RoboAdvisorForm() {
  const { addRobo } = usePortfolio();
  const [name, setName] = useState('');
  const [entity, setEntity] = useState('');
  const [investedValue, setInvestedValue] = useState('');
  const [totalValue, setTotalValue] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await addRobo.mutateAsync({
        name: name.trim(),
        entity: entity.trim(),
        investedValue: Number(investedValue),
        totalValue: Number(totalValue),
        lastUpdated: null,
        subFunds: [],
      });

      toast.success('Roboadvisor guardado');
      setName('');
      setEntity('');
      setInvestedValue('');
      setTotalValue('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar');
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        <span>Nombre</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="MyInvestor Metal"
          required
        />
      </label>

      <label>
        <span>Entidad</span>
        <input
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
          placeholder="MyInvestor"
          required
        />
      </label>

      <label>
        <span>Invertido</span>
        <input
          type="number"
          step="0.01"
          value={investedValue}
          onChange={(e) => setInvestedValue(e.target.value)}
          required
        />
      </label>

      <label>
        <span>Valor actual</span>
        <input
          type="number"
          step="0.01"
          value={totalValue}
          onChange={(e) => setTotalValue(e.target.value)}
          required
        />
      </label>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={addRobo.isPending}>
          {addRobo.isPending ? 'Guardando...' : 'Guardar roboadvisor'}
        </button>
      </div>
    </form>
  );
}
