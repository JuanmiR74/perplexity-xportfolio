import { ArrowUpRight, Landmark, PieChart, ShieldCheck, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const positions = [
  { name: 'Indexa Capital', type: 'Roboadvisor', value: '42.350 €', allocation: '48%', change: '+1,8%' },
  { name: 'Vanguard Global Stock', type: 'Fondo indexado', value: '18.420 €', allocation: '21%', change: '+0,9%' },
  { name: 'MyInvestor Cartera Ahorro', type: 'Liquidez', value: '9.860 €', allocation: '11%', change: '+0,1%' },
  { name: 'Finizens', type: 'Roboadvisor', value: '16.940 €', allocation: '20%', change: '+1,2%' },
];

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <div className='app-shell'>
      <header className='sticky top-0 z-20 border-b bg-background/85 backdrop-blur'>
        <div className='container flex h-16 items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-card'>
              <Wallet className='h-5 w-5' />
            </div>
            <div>
              <p className='text-sm font-semibold tracking-tight'>FondoRadar</p>
              <p className='text-xs text-muted-foreground'>Vista consolidada de patrimonio</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='hidden text-right sm:block'>
              <p className='text-sm font-medium'>{user?.email ?? 'Usuario'}</p>
              <p className='text-xs text-muted-foreground'>Cuenta autenticada</p>
            </div>
            <Button variant='outline' onClick={() => signOut()}>
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className='container py-8 md:py-10'>
        <section className='relative overflow-hidden rounded-[28px] border bg-hero-grid bg-hero-grid p-6 shadow-soft md:p-10'>
          <div className='absolute inset-0 bg-gradient-to-br from-white/65 via-white/40 to-transparent dark:from-slate-950/40 dark:via-slate-950/10 dark:to-transparent' />
          <div className='relative page-header'>
            <div className='max-w-2xl space-y-3'>
              <span className='inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground'>
                <ShieldCheck className='h-3.5 w-3.5 text-primary' />
                Snapshot manual · arquitectura v1
              </span>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tight md:text-5xl'>Tu patrimonio en una sola pantalla</h1>
                <p className='max-w-xl text-sm leading-6 text-muted-foreground md:text-base'>
                  Un panel limpio para consolidar fondos, roboadvisors y liquidez, con una lectura clara del total invertido,
                  distribución y evolución de cada bloque.
                </p>
              </div>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Button size='lg'>Actualizar posiciones</Button>
              <Button size='lg' variant='secondary'>Añadir fondo</Button>
            </div>
          </div>
        </section>

        <section className='mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          <article className='metric-card'>
            <p className='metric-label'>Patrimonio total</p>
            <p className='metric-value'>87.570 €</p>
            <p className='mt-2 text-sm text-emerald-600'>+2.140 € este mes</p>
          </article>
          <article className='metric-card'>
            <p className='metric-label'>Fondos monitorizados</p>
            <p className='metric-value'>14</p>
            <p className='mt-2 text-sm text-muted-foreground'>9 fondos · 2 carteras · 3 cuentas</p>
          </article>
          <article className='metric-card'>
            <p className='metric-label'>Rentabilidad YTD</p>
            <p className='metric-value'>+6,4%</p>
            <p className='mt-2 text-sm text-emerald-600'>Perfil equilibrado</p>
          </article>
          <article className='metric-card'>
            <p className='metric-label'>Nivel de diversificación</p>
            <p className='metric-value'>Alta</p>
            <p className='mt-2 text-sm text-muted-foreground'>Exposición global por activo y región</p>
          </article>
        </section>

        <section className='mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]'>
          <article className='section-card'>
            <div className='page-header'>
              <div>
                <h2 className='section-title'>Posiciones principales</h2>
                <p className='section-subtitle'>Lectura rápida del peso de cada bloque patrimonial</p>
              </div>
              <Button variant='ghost'>Ver detalle completo</Button>
            </div>
            <div className='mt-6 space-y-3'>
              {positions.map((item) => (
                <div key={item.name} className='flex flex-col gap-4 rounded-2xl border bg-background/70 p-4 md:flex-row md:items-center md:justify-between'>
                  <div className='space-y-1'>
                    <p className='font-semibold'>{item.name}</p>
                    <p className='text-sm text-muted-foreground'>{item.type}</p>
                  </div>
                  <div className='flex items-center gap-8'>
                    <div>
                      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Valor</p>
                      <p className='font-semibold'>{item.value}</p>
                    </div>
                    <div>
                      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Peso</p>
                      <p className='font-semibold'>{item.allocation}</p>
                    </div>
                    <div>
                      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Cambio</p>
                      <p className='font-semibold text-emerald-600'>{item.change}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className='section-card'>
            <div>
              <h2 className='section-title'>Distribución objetivo</h2>
              <p className='section-subtitle'>Diseño preparado para añadir el X-Ray real después</p>
            </div>
            <div className='mt-6 space-y-4'>
              {[
                ['Renta variable', '58%'],
                ['Renta fija', '24%'],
                ['Liquidez', '11%'],
                ['Alternativos', '7%'],
              ].map(([label, value]) => (
                <div key={label} className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>{label}</span>
                    <span className='font-semibold'>{value}</span>
                  </div>
                  <div className='h-2 rounded-full bg-secondary'>
                    <div className='h-2 rounded-full bg-primary' style={{ width: value }} />
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-8 grid gap-3 sm:grid-cols-2'>
              <div className='rounded-2xl border bg-background/70 p-4'>
                <div className='mb-2 flex items-center gap-2'>
                  <PieChart className='h-4 w-4 text-primary' />
                  <p className='text-sm font-medium'>Exposición</p>
                </div>
                <p className='text-sm text-muted-foreground'>Listo para conectar Morningstar, ETF data o tu motor manual.</p>
              </div>
              <div className='rounded-2xl border bg-background/70 p-4'>
                <div className='mb-2 flex items-center gap-2'>
                  <Landmark className='h-4 w-4 text-primary' />
                  <p className='text-sm font-medium'>Cuentas</p>
                </div>
                <p className='text-sm text-muted-foreground'>Bloque preparado para custodios, brokers y liquidez.</p>
              </div>
            </div>
          </article>
        </section>

        <section className='mt-8 grid gap-6 lg:grid-cols-3'>
          <article className='section-card lg:col-span-2'>
            <div className='page-header'>
              <div>
                <h2 className='section-title'>Próximos pasos de producto</h2>
                <p className='section-subtitle'>Base visual lista para evolucionar a una app operativa</p>
              </div>
            </div>
            <div className='mt-6 grid gap-4 md:grid-cols-3'>
              {[
                'Alta y edición de posiciones con validación',
                'Cálculo consolidado de coste, valor y plusvalía',
                'X-Ray por activo, región, sector y divisa',
              ].map((text) => (
                <div key={text} className='rounded-2xl border bg-background/70 p-4'>
                  <div className='mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                    <ArrowUpRight className='h-4 w-4' />
                  </div>
                  <p className='text-sm font-medium leading-6'>{text}</p>
                </div>
              ))}
            </div>
          </article>

          <article className='section-card'>
            <h2 className='section-title'>Estado del sistema</h2>
            <p className='section-subtitle mt-1'>Vista preparada para entorno real</p>
            <div className='mt-6 space-y-4'>
              <div className='rounded-2xl border bg-background/70 p-4'>
                <p className='text-sm text-muted-foreground'>Auth</p>
                <p className='mt-1 font-semibold text-emerald-600'>Operativa</p>
              </div>
              <div className='rounded-2xl border bg-background/70 p-4'>
                <p className='text-sm text-muted-foreground'>Tema visual</p>
                <p className='mt-1 font-semibold'>Aplicado</p>
              </div>
              <div className='rounded-2xl border bg-background/70 p-4'>
                <p className='text-sm text-muted-foreground'>Datos reales</p>
                <p className='mt-1 font-semibold text-amber-600'>Pendiente de integrar</p>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
