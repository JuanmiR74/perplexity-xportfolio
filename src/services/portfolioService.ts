export async function refreshFundsByIsin(isins: string[]) {
  return { ok: true, isins };
}

export async function loadPortfolio() {
  return {
    summary: null,
    funds: [],
    roboAdvisors: [],
  };
}
