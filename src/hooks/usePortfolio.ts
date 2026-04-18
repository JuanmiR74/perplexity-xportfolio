import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
export function usePortfolio() { const { user } = useAuth(); return useQuery({ queryKey: ['portfolio', user?.id ?? 'guest'], queryFn: async () => [], enabled: !!user }); }
