import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { SalaryBenchmark } from '@/types';

// Marcar como ruta dinámica
export const dynamic = 'force-dynamic';

// Cache de 24 horas
export const revalidate = 86400;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');
    const seniority = searchParams.get('seniority');
    const location = searchParams.get('location');

    if (!role || !seniority || !location) {
      return NextResponse.json(
        { error: 'Faltan parámetros: role, seniority, location' },
        { status: 400 }
      );
    }

    // Buscar en Supabase
    const supabase = createServerClient();

    const { data: benchmark, error } = await supabase
      .from('salary_benchmarks')
      .select('*')
      .eq('role', role)
      .eq('seniority', seniority)
      .eq('location', location)
      .single();

    if (error || !benchmark) {
      return NextResponse.json(
        {
          p25: 0,
          p50: 0,
          p75: 0,
          sample_size: 0,
          currency: 'CLP',
          has_data: false,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        p25: benchmark.p25,
        p50: benchmark.p50,
        p75: benchmark.p75,
        sample_size: benchmark.sample_size,
        currency: benchmark.currency,
        has_data: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching salary range:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
