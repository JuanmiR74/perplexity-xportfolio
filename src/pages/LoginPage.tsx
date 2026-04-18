import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  return (
    <div className='min-h-screen bg-slate-50 p-6'>
      <div className='mx-auto max-w-md rounded-3xl border bg-white p-8 shadow-sm'>
        <h1 className='text-3xl font-bold'>Accede a tu cartera</h1>
        <div className='mt-6 grid gap-3'>
          <Button onClick={() => signIn()}>Entrar</Button>
          <Button variant='secondary' onClick={() => signUp()}>Crear cuenta</Button>
        </div>
      </div>
    </div>
  );
}
