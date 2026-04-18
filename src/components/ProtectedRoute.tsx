import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <p className="eyebrow">FondoRadar</p>
          <h1>Verificando sesión…</h1>
          <p className="auth-copy">Esperando a Supabase Auth para restaurar la sesión.</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
