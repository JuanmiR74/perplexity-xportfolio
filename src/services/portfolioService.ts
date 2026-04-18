import type { FundPosition, RoboAdvisor } from '../types/portfolio';
export async function getPortfolio(): Promise<{ funds: FundPosition[]; roboAdvisors: RoboAdvisor[] }> { return { funds: [], roboAdvisors: [] }; }
