# Perplexity XPortfolio

App personal/familiar para seguimiento de cartera con fondos de inversión y roboadvisors.

## Stack
- React + Vite + TypeScript
- Supabase Auth + Postgres + RLS
- Recharts para X-Ray
- Vercel para despliegue

## Configuración
1. Copia `.env.example` a `.env`
2. Rellena `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. Ejecuta `npm install`
4. Ejecuta `npm run dev`

## SQL
Ejecuta `supabase/schema.sql` en el SQL Editor de Supabase.
