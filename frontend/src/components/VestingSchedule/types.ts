export interface VestingEvent {
  _id: string;
  vestDate: string;
  grantedQty: number;
  vestedQty: number;
  grantDate?: string;
}

export interface IRsuData {
  grantAmount: number;
  grantDate: string;
  stockPrice: number;
  totalUnits: number;
  vestingSchedule: VestingEvent[];
}
