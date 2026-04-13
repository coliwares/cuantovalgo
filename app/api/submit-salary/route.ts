import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// Función para detectar outliers (valores muy fuera de rango)
function isOutlier(salary: number, p25: number, p75: number): boolean {
  if (!p25 || !p75) return false; // Si no hay datos de referencia, aceptar

  const iqr = p75 - p25;
  const lower = p25 - 2.5 * iqr;
  const upper = p75 + 2.5 * iqr;

  return salary < lower || salary > upper;
}

// Crear fingerprint único del usuario (anónimo)
function createFingerprint(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  // Hash del IP + User Agent para anonimizar
  return crypto
    .createHash('sha256')
    .update(`${ip}-${userAgent}`)
    .digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, seniority, location, salary, currency, years_exp, company_type } = body;

    // Validación básica
    if (!role || !seniority || !location || !salary || !currency) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    if (salary <= 0) {
      return NextResponse.json(
        { error: 'El sueldo debe ser mayor a 0' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Obtener el benchmark existente para validar outliers
    const { data: benchmark } = await supabase
      .from('salary_benchmarks')
      .select('p25, p75')
      .eq('role', role)
      .eq('seniority', seniority)
      .eq('location', location)
      .single();

    // Validar outliers extremos
    if (benchmark && isOutlier(salary, benchmark.p25, benchmark.p75)) {
      return NextResponse.json(
        {
          error: 'El sueldo ingresado está muy fuera del rango esperado. Por favor verifica que sea correcto.',
          isOutlier: true
        },
        { status: 400 }
      );
    }

    // Crear fingerprint para evitar duplicados
    const fingerprint = createFingerprint(request);

    // Verificar si ya existe una submission reciente con el mismo fingerprint
    const { data: existing } = await supabase
      .from('salary_submissions')
      .select('id')
      .eq('fingerprint', fingerprint)
      .eq('role', role)
      .eq('seniority', seniority)
      .eq('location', location)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Últimas 24h
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Ya contribuiste datos similares recientemente. Gracias por tu aporte!' },
        { status: 400 }
      );
    }

    // Insertar en la base de datos
    const { error: insertError } = await supabase
      .from('salary_submissions')
      .insert({
        role,
        seniority,
        location,
        salary,
        currency,
        years_exp: years_exp || null,
        company_type: company_type || null,
        fingerprint,
        status: 'pending', // Requerirá revisión manual o automática
      });

    if (insertError) {
      console.error('Error inserting submission:', insertError);
      return NextResponse.json(
        { error: 'Error al guardar los datos. Intenta nuevamente.' },
        { status: 500 }
      );
    }

    // También registrar en el query_log para analytics
    const { error: logError } = await supabase
      .from('query_log')
      .insert({
        role,
        seniority,
        location,
        has_salary: true,
        result_percentile: null, // No calculamos percentil en la submission
      });

    if (logError) {
      console.error('Error logging query:', logError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Gracias por tu contribución! Tus datos ayudarán a mejorar el benchmark.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in submit-salary:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
