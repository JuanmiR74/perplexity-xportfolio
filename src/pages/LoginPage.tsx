import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className='min-h-screen bg-slate-50 p-6'>
      <div className='mx-auto max-w-md rounded-3xl border bg-white p-8 shadow-sm'>
        <h1 className='text-3xl font-bold'>Accede a tu cartera</h1>

        <div className='mt-6 grid gap-4'>
          <input
            className='h-11 rounded-xl border border-slate-200 px-4'
            type='email'
            placeholder='tu@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className='h-11 rounded-xl border border-slate-200 px-4'
            type='password'
            placeholder='Contraseña'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button onClick={() => signIn(email, password)}>Entrar</Button>
          <Button variant='secondary' onClick={() => signUp(email, password)}>
            Crear cuenta
          </Button>
        </div>
      </div>
    </div>
  );
}
