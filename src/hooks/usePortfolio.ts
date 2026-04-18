import { useQuery } from '@tanstack/react-query';
import { loadPortfolio } from '../services/portfolioService';

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: loadPortfolio,
  });
}
