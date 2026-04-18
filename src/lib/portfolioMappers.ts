import type { FundPosition, RoboAdvisor, ThreeDimensionalClassification } from '../types/portfolio';
export function mapFundPosition(row: any): FundPosition { return row as FundPosition; }
export function mapRoboAdvisor(row: any): RoboAdvisor { return row as RoboAdvisor; }
export function mapClassification(row: any): ThreeDimensionalClassification { return row as ThreeDimensionalClassification; }
