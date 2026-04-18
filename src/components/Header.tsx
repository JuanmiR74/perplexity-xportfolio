import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo cerrar sesión');
    }
  };

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <path
                d="M10 32L19 23L26 28L38 14"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M31 14H38V21"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <strong>FondoRadar</strong>
            <p>Panel privado</p>
          </div>
        </div>

        <div className="header-user">
          <div className="header-user__meta">
            <span>Sesión iniciada</span>
            <strong>{user?.email ?? 'Usuario'}</strong>
          </div>

          <button className="btn btn-secondary" type="button" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
