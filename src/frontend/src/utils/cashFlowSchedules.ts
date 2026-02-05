/**
 * Cash flow schedule utilities for calculator pages
 */

export interface CashFlowRow {
  label: string;
  amount: number;
  runningBalance?: number;
}

/**
 * Generates monthly period labels (Month 1, Month 2, etc.)
 */
export function generateMonthlyLabels(count: number, startMonth: number = 1): string[] {
  return Array.from({ length: count }, (_, i) => `Month ${startMonth + i}`);
}

/**
 * Generates yearly period labels (Year 1, Year 2, etc.)
 */
export function generateYearlyLabels(count: number, startYear: number = 1): string[] {
  return Array.from({ length: count }, (_, i) => `Year ${startYear + i}`);
}

/**
 * Calculates running balance for a cash flow schedule
 */
export function calculateRunningBalance(cashFlows: { amount: number }[]): number[] {
  const balances: number[] = [];
  let balance = 0;
  
  for (const cf of cashFlows) {
    balance += cf.amount;
    balances.push(balance);
  }
  
  return balances;
}

/**
 * Creates a simple two-row schedule (initial investment and maturity)
 */
export function createSimpleTwoRowSchedule(
  initialAmount: number,
  maturityAmount: number,
  initialLabel: string = 'Start',
  maturityLabel: string = 'Maturity'
): CashFlowRow[] {
  return [
    { label: initialLabel, amount: -initialAmount },
    { label: maturityLabel, amount: maturityAmount },
  ];
}

/**
 * Creates a monthly contribution schedule
 */
export function createMonthlyContributionSchedule(
  monthlyAmount: number,
  months: number,
  includeMaturity: boolean = false,
  maturityValue?: number
): CashFlowRow[] {
  const rows: CashFlowRow[] = [];
  
  for (let i = 1; i <= months; i++) {
    rows.push({
      label: `Month ${i}`,
      amount: -monthlyAmount,
    });
  }
  
  if (includeMaturity && maturityValue !== undefined) {
    rows.push({
      label: 'Maturity',
      amount: maturityValue,
    });
  }
  
  return rows;
}

/**
 * Creates a yearly contribution schedule
 */
export function createYearlyContributionSchedule(
  yearlyAmount: number,
  years: number,
  includeMaturity: boolean = false,
  maturityValue?: number
): CashFlowRow[] {
  const rows: CashFlowRow[] = [];
  
  for (let i = 1; i <= years; i++) {
    rows.push({
      label: `Year ${i}`,
      amount: -yearlyAmount,
    });
  }
  
  if (includeMaturity && maturityValue !== undefined) {
    rows.push({
      label: 'Maturity',
      amount: maturityValue,
    });
  }
  
  return rows;
}
