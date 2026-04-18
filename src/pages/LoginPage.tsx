import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
        toast.success('Sesión iniciada');
        navigate('/');
      } else {
        await signUp(email, password);
        toast.success('Cuenta creada. Revisa tu email si tienes confirmación activada.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error de autenticación');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div>
          <p className="eyebrow">FondoRadar</p>
          <h1>Controla tu cartera de fondos</h1>
          <p className="muted">Acceso personal o familiar con autenticación segura.</p>
        </div>
        <div className="auth-switch">
          <button className={mode === 'signin' ? 'active' : ''} onClick={() => setMode('signin')}>Entrar</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Crear cuenta</button>
        </div>
        <form onSubmit={onSubmit} className="form-stack">
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Contraseña
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          </label>
          <button className="btn btn-primary" disabled={busy} type="submit">
            {busy ? 'Procesando...' : mode === 'signin' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
      </section>
    </main>
  );
}
