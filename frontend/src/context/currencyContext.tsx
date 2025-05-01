import { createContext, useContext, useState, ReactNode } from "react";

type Currency = "USD" | "INR";

interface CurrencyContextType {
  currency: Currency;
  isUSD: boolean;
  symbol: "$" | "₹";
  toggleCurrency: () => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>("INR");

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "INR" ? "USD" : "INR"));
  };

  const isUSD = currency === "USD";
  const symbol = isUSD ? "$" : "₹";

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        isUSD,
        symbol,
        toggleCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
