import type { SalaryBenchmark } from '@/types';

export function calculatePercentile(
  salary: number,
  p25: number,
  p50: number,
  p75: number
): number {
  // Estimación simple de percentil usando interpolación lineal
  if (salary <= p25) {
    // Entre 0 y 25
    const ratio = salary / p25;
    return Math.max(0, Math.min(25, ratio * 25));
  } else if (salary <= p50) {
    // Entre 25 y 50
    const ratio = (salary - p25) / (p50 - p25);
    return 25 + ratio * 25;
  } else if (salary <= p75) {
    // Entre 50 y 75
    const ratio = (salary - p50) / (p75 - p50);
    return 50 + ratio * 25;
  } else {
    // Sobre 75
    const ratio = (salary - p75) / (p75 - p50);
    return Math.min(99, 75 + ratio * 25);
  }
}

export function getRecommendation(
  percentile: number
): 'bajo' | 'mercado' | 'sobre' {
  if (percentile < 35) return 'bajo';
  if (percentile > 65) return 'sobre';
  return 'mercado';
}

export function formatSalary(amount: number, currency: 'CLP' | 'USD'): string {
  if (currency === 'CLP') {
    return `$${amount.toLocaleString('es-CL')} CLP`;
  }
  return `USD ${amount.toLocaleString('en-US')}`;
}
