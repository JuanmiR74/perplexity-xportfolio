import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
export type AuthUser = { id: string; email?: string | null } | null;
const AuthContext = createContext<any>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading] = useState(false);
  const value = useMemo(() => ({ user, loading, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuthContext() { return useContext(AuthContext); }
