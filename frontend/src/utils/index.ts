import dayjs from "dayjs";

export const textInputRegex =
  /^(?!\s+$)[~!\s@#$%^&*()_+=[\]{}|;':",./<>?a-zA-Z0-9-]+$/;

export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const NumberRegex = /^[1-9]\d*$/;

export const isRunningStandalone = () => {
  return window.matchMedia("(display-mode: standalone)").matches;
};

export const isAppRunningOnIos16 = (): boolean => {
  const userAgent = window?.navigator.userAgent || "";
  return userAgent.includes("iPhone OS 16");
};

export const isStandAloneAndRunningOnIos16 = () =>
  isRunningStandalone() && isAppRunningOnIos16();

export const getInitials = (str: string = "") => {
  if (!str) return "RS";

  const initials = str
    .split(" ")
    .map(
      (name, index, arr) => (index === 0 || index === arr.length - 1) && name[0]
    )
    .filter((initial) => initial)
    .join("");

  return initials.toUpperCase() || "RS";
};

export const capitalizeFirstLetter = (name: string = ""): string => {
  if (!name) return name;

  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const formatNumber = (
  num: number,
  isUSD: boolean,
  showDecimals: boolean = true
) => {
  const options = showDecimals
    ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    : {};

  return new Intl.NumberFormat(isUSD ? "en-US" : "en-IN", options).format(num);
};

export function formatCompactNumber(value: number, isUSD: boolean): string {
  const absValue = Math.abs(value);
  const formatter = (num: number, suffix: string) =>
    `${num.toFixed(num % 1 === 0 ? 1 : 2).replace(/\.0+$/, ".0")} ${suffix}`;

  if (!isUSD) {
    if (absValue >= 1e7) return formatter(value / 1e7, "Cr"); // Crore
    if (absValue >= 1e5) return formatter(value / 1e5, "L"); // Lakh
    if (absValue >= 1e3) return formatter(value / 1e3, "K"); // Thousand
    return value.toFixed(2);
  }

  if (absValue >= 1e9) return formatter(value / 1e9, "B"); // Billion
  if (absValue >= 1e6) return formatter(value / 1e6, "M"); // Million
  if (absValue >= 1e3) return formatter(value / 1e3, "K"); // Thousand
  return value.toFixed(2);
}

export const getUnitsInPipeline = (
  unitsByYear: Record<number, number>
): string => {
  const currentYear = dayjs().year();
  const nextYear = currentYear + 1;
  const yearAfterNext = currentYear + 2;

  const get = (year: number) => unitsByYear[year] || 0;

  // Current year has data
  if (get(currentYear) > 0) {
    return `${currentYear}: ${get(currentYear)}, ${nextYear}: ${get(nextYear)}`;
  }

  // No data in current year – show next two years
  const yearsToShow = [nextYear, yearAfterNext]
    .filter((y) => get(y) > 0)
    .map((y) => `${y}: ${get(y)}`);

  return yearsToShow.join(", ") || "No upcoming units";
};
