interface RefreshRequest {
  isins: string[];
}

type RefreshResult = {
  isin: string;
  status: 'fresh' | 'recent' | 'stale' | 'unavailable';
  nav: number | null;
  navDate: string | null;
  source: string | null;
};

Deno.serve(async (req) => {
  const body = (await req.json()) as RefreshRequest;
  const results: RefreshResult[] = body.isins.map((isin) => ({
    isin,
    status: 'unavailable',
    nav: null,
    navDate: null,
    source: null,
  }));

  return new Response(JSON.stringify({ results }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
