import { createServerClient } from '@/lib/supabase';
import seedData from '@/data/seed-salaries.json';
import type { SalaryBenchmark } from '@/types';

export interface SalaryRangeResponse {
  p25: number;
  p50: number;
  p75: number;
  sample_size: number;
  currency: 'CLP' | 'USD';
  has_data: boolean;
}

/**
 * Obtiene el rango salarial para una combinación de rol/seniority/location
 * Esta función puede ser llamada tanto desde API routes como desde Server Components
 */
export async function getSalaryRange(
  role: string,
  seniority: string,
  location: string
): Promise<SalaryRangeResponse> {
  try {
    // Intentar leer desde Supabase primero
    const supabase = createServerClient();

    const { data: benchmark, error } = await supabase
      .from('salary_benchmarks')
      .select('*')
      .eq('role', role)
      .eq('seniority', seniority)
      .eq('location', location)
      .single();

    if (!error && benchmark) {
      return {
        p25: benchmark.p25,
        p50: benchmark.p50,
        p75: benchmark.p75,
        sample_size: benchmark.sample_size || 0,
        currency: benchmark.currency as 'CLP' | 'USD',
        has_data: true,
      };
    }

    // Si falla Supabase, intentar con datos locales (fallback)
    console.log('Supabase failed, using local seed data');
    const localBenchmark = seedData.find(
      (item) =>
        item.role === role &&
        item.seniority === seniority &&
        item.location === location
    ) as SalaryBenchmark | undefined;

    if (localBenchmark) {
      return {
        p25: localBenchmark.p25,
        p50: localBenchmark.p50,
        p75: localBenchmark.p75,
        sample_size: localBenchmark.sample_size || 0,
        currency: localBenchmark.currency as 'CLP' | 'USD',
        has_data: true,
      };
    }

    // No se encontraron datos
    return {
      p25: 0,
      p50: 0,
      p75: 0,
      sample_size: 0,
      currency: 'CLP',
      has_data: false,
    };
  } catch (error) {
    console.error('Error fetching salary range:', error);

    // Fallback a datos locales en caso de error
    const localBenchmark = seedData.find(
      (item) =>
        item.role === role &&
        item.seniority === seniority &&
        item.location === location
    ) as SalaryBenchmark | undefined;

    if (localBenchmark) {
      return {
        p25: localBenchmark.p25,
        p50: localBenchmark.p50,
        p75: localBenchmark.p75,
        sample_size: localBenchmark.sample_size || 0,
        currency: localBenchmark.currency as 'CLP' | 'USD',
        has_data: true,
      };
    }

    return {
      p25: 0,
      p50: 0,
      p75: 0,
      sample_size: 0,
      currency: 'CLP',
      has_data: false,
    };
  }
}
