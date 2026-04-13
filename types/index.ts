export interface SalaryBenchmark {
  role: string;
  seniority: 'junior' | 'semi' | 'senior' | 'lead';
  location: 'chile_local' | 'chile_remoto_usd' | 'latam_remoto_usd';
  p25: number;
  p50: number;
  p75: number;
  currency: 'CLP' | 'USD';
  sample_size: number;
}

export interface UserInput {
  role: string;
  seniority: string;
  yearsExp: number;
  location: string;
  currentSalary?: number;
}

export interface SalaryResult {
  benchmark: SalaryBenchmark;
  userPercentile?: number;
  recommendation: 'bajo' | 'mercado' | 'sobre';
  hasData: boolean;
}
