export interface VestingEvent {
  _id: string;
  vestDate: string;
  grantedQty: number;
  vestedQty: number;
  grantDate?: string;
}

export interface IRsuData {
  _id: string;
  grantAmount: number;
  grantDate: string;
  stockPrice: number;
  totalUnits: number;
  vestedUnits: number;
  vestingSchedule: VestingEvent[];
}
