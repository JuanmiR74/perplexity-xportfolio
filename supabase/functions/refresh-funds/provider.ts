export type ProviderResult = {
  isin: string;
  nav: number | null;
  navDate: string | null;
  priceSource: string | null;
  priceStatus: 'available' | 'unavailable' | 'stale' | 'unknown';
  meta?: Record<string, unknown>;
};

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function deterministicMockNav(isin: string) {
  const hash = hashString(isin);
  const euros = 8 + (hash % 190);
  const cents = (hash % 100) / 100;
  return Number((euros + cents).toFixed(4));
}

async function resolveMockNav(isin: string): Promise<ProviderResult> {
  return {
    isin,
    nav: deterministicMockNav(isin),
    navDate: new Date().toISOString().slice(0, 10),
    priceSource: 'mock',
    priceStatus: 'available',
    meta: {
      mode: 'mock',
      note: 'Deterministic mock NAV for end-to-end testing',
    },
  };
}

async function resolveNavFromProvider(isin: string): Promise<ProviderResult> {
  const mode = Deno.env.get('FUNDS_PROVIDER_MODE') ?? 'mock';

  if (mode === 'mock') {
    return resolveMockNav(isin);
  }

  return {
    isin,
    nav: null,
    navDate: null,
    priceSource: mode,
    priceStatus: 'unavailable',
    meta: {
      mode,
      note: 'Provider not yet implemented in this adapter',
    },
  };
}

export async function getNavForIsin(isin: string): Promise<ProviderResult> {
  try {
    return await resolveNavFromProvider(isin);
  } catch (error) {
    return {
      isin,
      nav: null,
      navDate: null,
      priceSource: null,
      priceStatus: 'unavailable',
      meta: {
        error: error instanceof Error ? error.message : 'Unknown provider error',
      },
    };
  }
}
