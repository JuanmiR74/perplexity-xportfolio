import type { ReactNode } from 'react';
import { LogOut, Radar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <Radar size={20} />
          <div>
            <strong>FondoRadar</strong>
            <p>Seguimiento manual de fondos y roboadvisors</p>
          </div>
        </div>
        <div className="topbar-actions">
          <span className="muted">{user?.email}</span>
          <button className="btn btn-ghost" onClick={() => void signOut()}>
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </header>
      <main className="dashboard-grid">{children}</main>
    </div>
  );
}
