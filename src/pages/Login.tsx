import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export default function LoginPage() {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = useMemo(() => {
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
    return from || '/';
  }, [location.state]);

  useEffect(() => {
    if (!loading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, navigate, redirectTo, user]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      toast.error('Introduce un email válido');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSubmitting(true);

    try {
      if (mode === 'signin') {
        const result = await signIn(email.trim(), password);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        toast.success('Sesión iniciada');
        navigate(redirectTo, { replace: true });
        return;
      }

      const result = await signUp(email.trim(), password);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Cuenta creada. Ya puedes entrar con tus credenciales.');
      setMode('signin');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-top">
          <p className="eyebrow">FondoRadar</p>
          <h1>{mode === 'signin' ? 'Accede a tu cartera' : 'Crea tu cuenta'}</h1>
          <p className="auth-copy">
            Autenticación con Supabase, datos aislados por usuario y dashboard privado.
          </p>
        </div>

        <div className="auth-switch">
          <button
            type="button"
            className={`auth-switch__button ${mode === 'signin' ? 'is-active' : ''}`}
            onClick={() => setMode('signin')}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={`auth-switch__button ${mode === 'signup' ? 'is-active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Registrarse
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </label>

          <label>
            <span>Contraseña</span>
            <input
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </label>

          <div className="form-actions">
            <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>
              {submitting
                ? 'Procesando...'
                : mode === 'signin'
                ? 'Entrar'
                : 'Crear cuenta'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
