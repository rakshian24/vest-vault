import { useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { IRsuData } from "../components/VestingSchedule/types";

export interface RsuSummary {
  unvestedUnits: number;
  annualIncome: number;
  nextVestingDate: string;
  unitsByYear: Record<number, number>;
}

export function useRsuSummary(
  rsus: IRsuData[],
  currentStockPrice: number,
  referenceDate: Dayjs = dayjs()
): RsuSummary {
  return useMemo(() => {
    let unvestedUnits = 0;
    let annualIncome = 0;
    let nextVestDate: Dayjs | null = null;
    const unitsByYear: Record<number, number> = {};

    rsus.forEach((grant) => {
      grant.vestingSchedule.forEach((event) => {
        const vestDate = dayjs(event.vestDate);

        if (vestDate.isAfter(referenceDate)) {
          unvestedUnits += event.grantedQty;

          const year = vestDate.year();
          unitsByYear[year] = (unitsByYear[year] || 0) + event.grantedQty;

          if (!nextVestDate || vestDate.isBefore(nextVestDate)) {
            nextVestDate = vestDate;
          }

          const monthsDiff =
            (vestDate.year() - referenceDate.year()) * 12 +
            (vestDate.month() - referenceDate.month());

          if (monthsDiff >= 0 && monthsDiff < 12) {
            annualIncome += event.grantedQty * currentStockPrice;
          }
        }
      });
    });

    return {
      unvestedUnits,
      annualIncome: Math.round(annualIncome),
      nextVestingDate: nextVestDate
        ? (nextVestDate as Dayjs).format("DD MMM YYYY")
        : "N/A",
      unitsByYear,
    };
  }, [rsus, currentStockPrice, referenceDate]);
}
