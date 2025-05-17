import { useMemo } from "react";

export type SalaryBreakdown = {
  annually: {
    earnings: {
      basic: number;
      hra: number;
      specialAllowance: number;
    };
    deductions: {
      pfEEContribution: number;
      professionalTax: number;
      incomeTax: number;
    };
  };
  monthly: {
    earnings: {
      basic: number;
      hra: number;
      specialAllowance: number;
    };
    deductions: {
      pfEEContribution: number;
      professionalTax: number;
      incomeTax: number;
    };
  };
  annualEmployerPf: number;
};

export function useSalaryComponents(baseSalary: number | null) {
  return useMemo(() => {
    if (!baseSalary || isNaN(baseSalary)) return null;

    const BASIC_SALARY_PERCENTAGE = 0.45;
    const HRA_PERCENTAGE = 0.18;
    const SPECIAL_ALLOWANCE_PERCENTAGE = 0.316;
    const PF_PERCENTAGE = 0.12;
    const PROFESSIONAL_TAX = 200;
    const INCOME_TAX_PERCENTAGE = 0.1352;

    const annualBasic = +(baseSalary * BASIC_SALARY_PERCENTAGE).toFixed(2);
    const annualHRA = +(baseSalary * HRA_PERCENTAGE).toFixed(2);
    const annualSpecialAllowance = +(
      baseSalary * SPECIAL_ALLOWANCE_PERCENTAGE
    ).toFixed(2);
    const annualEmployerPf = +(annualBasic * PF_PERCENTAGE).toFixed(2);

    const monthlyBasic = +(annualBasic / 12).toFixed(2);
    const monthlyHRA = +(annualHRA / 12).toFixed(2);
    const monthlySpecialAllowance = +(annualSpecialAllowance / 12).toFixed(2);
    const monthlyPfEE = +((annualBasic * PF_PERCENTAGE) / 12).toFixed(2);
    const monthlyIncomeTax = +(
      (baseSalary * INCOME_TAX_PERCENTAGE) /
      12
    ).toFixed(2);

    return {
      annually: {
        earnings: {
          basic: annualBasic,
          hra: annualHRA,
          specialAllowance: annualSpecialAllowance,
        },
        deductions: {
          pfEEContribution: monthlyPfEE * 12,
          professionalTax: PROFESSIONAL_TAX * 12,
          incomeTax: monthlyIncomeTax * 12,
        },
      },
      monthly: {
        earnings: {
          basic: monthlyBasic,
          hra: monthlyHRA,
          specialAllowance: monthlySpecialAllowance,
        },
        deductions: {
          pfEEContribution: monthlyPfEE,
          professionalTax: PROFESSIONAL_TAX,
          incomeTax: monthlyIncomeTax,
        },
      },
      annualEmployerPf,
    };
  }, [baseSalary]);
}
