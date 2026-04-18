import { safeNumber } from './utils';
import type {
  FundPosition,
  RoboAdvisor,
  ThreeDimensionalClassification,
} from '../types/portfolio';

function normalizeXray(value: any): ThreeDimensionalClassification {
  return {
    assetType: Array.isArray(value?.assetType) ? value.assetType : [],
    sectors: Array.isArray(value?.sectors) ? value.sectors : [],
    geography: Array.isArray(value?.geography) ? value.geography : [],
  };
}

export function rowToFundPosition(row: any): FundPosition {
  return {
    id: row.id,
    userId: row.user_id,
    isin: row.isin,
    fundName: row.fund_name,
    managementCompany: row.management_company,
    platformEntity: row.platform_entity,
    contractMode: row.contract_mode,
    roboAdvisorId: row.robo_advisor_id,
    shares: safeNumber(row.shares),
    investedAmount: safeNumber(row.invested_amount),
    latestNav: row.latest_nav === null ? null : safeNumber(row.latest_nav),
    latestNavDate: row.latest_nav_date,
    marketValue: row.market_value === null ? null : safeNumber(row.market_value),
    returnAmount: row.return_amount === null ? null : safeNumber(row.return_amount),
    returnPct: row.return_pct === null ? null : safeNumber(row.return_pct),
    priceStatus: row.price_status,
    priceSource: row.price_source,
    xray: normalizeXray(row.xray_json),
    metadata: row.source_meta_json || {},
  };
}

export function fundPositionToRow(position: Omit<FundPosition, 'id'> | FundPosition) {
  return {
    user_id: position.userId,
    isin: position.isin,
    fund_name: position.fundName,
    management_company: position.managementCompany,
    platform_entity: position.platformEntity,
    contract_mode: position.contractMode,
    robo_advisor_id: position.roboAdvisorId ?? null,
    shares: position.shares,
    invested_amount: position.investedAmount,
    latest_nav: position.latestNav,
    latest_nav_date: position.latestNavDate,
    market_value: position.marketValue,
    return_amount: position.returnAmount,
    return_pct: position.returnPct,
    price_status: position.priceStatus,
    price_source: position.priceSource,
    xray_json: position.xray,
    source_meta_json: position.metadata ?? {},
  };
}

export function rowToRoboAdvisor(row: any): RoboAdvisor {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    entity: row.entity,
    investedValue: safeNumber(row.invested_value),
    totalValue: safeNumber(row.total_value),
    lastUpdated: row.last_updated,
    subFunds: Array.isArray(row.sub_funds) ? row.sub_funds : [],
  };
}

export function roboAdvisorToRow(robo: Omit<RoboAdvisor, 'id'> | RoboAdvisor) {
  return {
    user_id: robo.userId,
    name: robo.name,
    entity: robo.entity,
    invested_value: robo.investedValue,
    total_value: robo.totalValue,
    last_updated: robo.lastUpdated,
    sub_funds: robo.subFunds,
  };
}
