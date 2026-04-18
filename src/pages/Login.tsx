import { Button } from '@/components/ui/button';

export default function Login() {
  return (
    <div className='min-h-screen bg-slate-50 text-slate-900'>
      <div className='grid min-h-screen lg:grid-cols-2'>
        <section className='flex items-center justify-center p-6 lg:p-10'>
          <div className='w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm'>
            <div className='mb-8'>
              <p className='text-sm font-semibold text-blue-600'>FondoRadar</p>
              <h1 className='mt-2 text-3xl font-bold tracking-tight'>Accede a tu cartera</h1>
              <p className='mt-2 text-sm text-slate-600'>Una vista clara de fondos, liquidez y roboadvisors en un panel moderno.</p>
            </div>
            <form className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium'>Email</label>
                <input className='h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none ring-0 focus:border-blue-500' type='email' placeholder='tu@email.com' />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>Contraseña</label>
                <input className='h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none ring-0 focus:border-blue-500' type='password' placeholder='••••••••' />
              </div>
              <div className='flex gap-3 pt-2'>
                <Button className='w-full'>Entrar</Button>
                <Button className='w-full' variant='secondary'>Crear cuenta</Button>
              </div>
            </form>
          </div>
        </section>
        <aside className='hidden items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 p-10 text-white lg:flex'>
          <div className='max-w-lg'>
            <p className='text-sm font-medium uppercase tracking-[0.2em] text-blue-200'>Resumen inteligente</p>
            <h2 className='mt-4 text-5xl font-bold tracking-tight'>Diseño limpio, lectura rápida y control real.</h2>
            <p className='mt-6 text-lg text-blue-100'>La base visual está pensada para escalar a métricas, X-Ray y operaciones reales sin perder claridad.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
