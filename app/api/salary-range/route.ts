import { NextRequest, NextResponse } from 'next/server';
import { getSalaryRange } from '@/lib/salary-data';

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

    const data = await getSalaryRange(role, seniority, location);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error in salary-range API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
