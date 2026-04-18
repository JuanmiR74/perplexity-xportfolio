import type { Fund } from '../../types/portfolio';
import { toast } from 'sonner';
export default function FundsTable({ funds }: { funds: Fund[] }) { const totalByIsin = (fund: Fund, isin: string) => 0; const rows = funds.map((fund: Fund) => fund); return <div>{rows.length}</div>; }
