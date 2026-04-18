import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts';
import { getNavForIsin } from './provider.ts';

type RefreshRequest = {
  isins?: string[];
};

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !anonKey) {
      return new Response(JSON.stringify({ error: 'Missing Supabase env vars' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabaseUserClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseUserClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = (await req.json()) as RefreshRequest;
    const requestedIsins = [...new Set((body.isins ?? []).map((v) => String(v).trim()).filter(Boolean))];

    if (!requestedIsins.length) {
      return new Response(JSON.stringify({ error: 'No ISINs provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: rows, error: rowsError } = await supabaseAdmin
      .from('fund_positions')
      .select('*')
      .eq('user_id', user.id)
      .in('isin', requestedIsins);

    if (rowsError) {
      return new Response(JSON.stringify({ error: rowsError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const results = [];

    for (const row of rows ?? []) {
      const provider = await getNavForIsin(row.isin);

      const shares = Number(row.shares ?? 0);
      const investedAmount = Number(row.invested_amount ?? 0);

      const marketValue =
        provider.nav !== null ? Number((shares * provider.nav).toFixed(2)) : null;

      const returnAmount =
        marketValue !== null ? Number((marketValue - investedAmount).toFixed(2)) : null;

      const returnPct =
        marketValue !== null && investedAmount > 0
          ? Number((((marketValue - investedAmount) / investedAmount) * 100).toFixed(4))
          : null;

      const updatePayload = {
        latest_nav: provider.nav,
        latest_nav_date: provider.navDate,
        market_value: marketValue,
        return_amount: returnAmount,
        return_pct: returnPct,
        price_source: provider.priceSource,
        price_status: provider.priceStatus,
        source_meta_json: provider.meta ?? {},
      };

      const { error: updateError } = await supabaseAdmin
        .from('fund_positions')
        .update(updatePayload)
        .eq('id', row.id)
        .eq('user_id', user.id);

      results.push({
        id: row.id,
        isin: row.isin,
        updated: !updateError,
        error: updateError?.message ?? null,
        payload: updatePayload,
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        userId: user.id,
        requested: requestedIsins.length,
        matched: (rows ?? []).length,
        results,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
