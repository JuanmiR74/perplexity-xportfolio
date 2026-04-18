import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { user, signIn, signUp, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const action = mode === 'login' ? signIn : signUp;
    const result = await action(email, password);

    if (result.error) {
      setError(result.error);
    }

    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">FondoRadar</h1>
          <p className="text-sm text-slate-500">
            {mode === 'login' ? 'Entra en tu cuenta' : 'Crea tu cuenta'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === 'login' ? 'bg-white shadow-sm' : 'text-slate-600'}`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === 'register' ? 'bg-white shadow-sm' : 'text-slate-600'}`}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? 'Procesando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </main>
  );
}
