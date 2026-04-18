import { supabase } from '../lib/supabase';
import {
  fundPositionToRow,
  roboAdvisorToRow,
  rowToFundPosition,
  rowToRoboAdvisor,
} from '../lib/portfolioMappers';
import { safeNumber } from '../lib/utils';
import type { FundPosition, RoboAdvisor } from '../types/portfolio';

export type PortfolioPayload = {
  funds: FundPosition[];
  roboAdvisors: RoboAdvisor[];
  summary: {
    investedTotal: number;
    marketValueTotal: number;
    gainLoss: number;
    gainLossPct: number | null;
    fundsCount: number;
    unavailableCount: number;
    lastUpdated: string | null;
  };
};

export async function loadPortfolio(userId: string): Promise<PortfolioPayload> {
  const [{ data: fundRows, error: fundError }, { data: roboRows, error: roboError }] =
    await Promise.all([
      supabase
        .from('fund_positions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('robo_advisors')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
    ]);

  if (fundError) throw fundError;
  if (roboError) throw roboError;

  const funds = (fundRows ?? []).map(rowToFundPosition);
  const roboAdvisors = (roboRows ?? []).map(rowToRoboAdvisor);

  const investedTotal = funds.reduce((sum, item) => sum + safeNumber(item.investedAmount), 0);
  const marketValueTotal = funds.reduce((sum, item) => sum + safeNumber(item.marketValue), 0);
  const gainLoss = marketValueTotal - investedTotal;
  const gainLossPct = investedTotal > 0 ? (gainLoss / investedTotal) * 100 : null;
  const unavailableCount = funds.filter((item) => item.priceStatus === 'unavailable').length;
  const lastUpdated = funds.map((item) => item.latestNavDate).filter(Boolean).sort().at(-1) ?? null;

  return {
    funds,
    roboAdvisors,
    summary: {
      investedTotal,
      marketValueTotal,
      gainLoss,
      gainLossPct,
      fundsCount: funds.length,
      unavailableCount,
      lastUpdated,
    },
  };
}

export async function createFundPosition(input: Omit<FundPosition, 'id'>) {
  const payload = fundPositionToRow(input);
  const { data, error } = await supabase
    .from('fund_positions')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return rowToFundPosition(data);
}

export async function updateFundPosition(id: string, input: Partial<FundPosition>) {
  const { data: current, error: currentError } = await supabase
    .from('fund_positions')
    .select('*')
    .eq('id', id)
    .single();

  if (currentError) throw currentError;

  const merged = { ...rowToFundPosition(current), ...input };
  const payload = fundPositionToRow(merged);

  const { data, error } = await supabase
    .from('fund_positions')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return rowToFundPosition(data);
}

export async function createRoboAdvisor(input: Omit<RoboAdvisor, 'id'>) {
  const payload = roboAdvisorToRow(input);
  const { data, error } = await supabase
    .from('robo_advisors')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return rowToRoboAdvisor(data);
}

export async function refreshFundsByIsin(isins: string[]) {
  const { data, error } = await supabase.functions.invoke('refresh-funds', {
    body: { isins },
  });

  if (error) throw error;
  return data;
}
