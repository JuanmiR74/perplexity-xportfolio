import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFundPosition,
  createRoboAdvisor,
  loadPortfolio,
  refreshFundsByIsin,
  updateFundPosition,
} from '../services/portfolioService';
import { useAuth } from './useAuth';
import type { FundPosition, RoboAdvisor } from '../types/portfolio';

export function usePortfolio() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['portfolio', user?.id],
    queryFn: () => loadPortfolio(user!.id),
    enabled: Boolean(user?.id),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['portfolio', user?.id] });

  const addFund = useMutation({
    mutationFn: async (payload: Omit<FundPosition, 'id' | 'userId'>) => {
      if (!user) throw new Error('Usuario no autenticado');
      return createFundPosition({ ...payload, userId: user.id });
    },
    onSuccess: invalidate,
  });

  const editFund = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<FundPosition>;
    }) => updateFundPosition(id, updates),
    onSuccess: invalidate,
  });

  const addRobo = useMutation({
    mutationFn: async (payload: Omit<RoboAdvisor, 'id' | 'userId'>) => {
      if (!user) throw new Error('Usuario no autenticado');
      return createRoboAdvisor({ ...payload, userId: user.id });
    },
    onSuccess: invalidate,
  });

  const refreshMany = useMutation({
    mutationFn: async (isins: string[]) => refreshFundsByIsin(isins),
    onSuccess: invalidate,
  });

  return {
    ...query,
    addFund,
    editFund,
    addRobo,
    refreshMany,
  };
}
