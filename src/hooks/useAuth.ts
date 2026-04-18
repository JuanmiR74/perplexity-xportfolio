import { useAuthContext } from '../contexts/AuthContext';
export function useAuth() {
  const ctx = useAuthContext();
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return { user: ctx.user, loading: ctx.loading, signIn: async (email: string, password: string) => ({ user: { id: 'local', email }, error: null as string | null }), signUp: async (email: string, password: string) => ({ user: { id: 'local', email }, error: null as string | null }), signOut: async () => {} };
}
