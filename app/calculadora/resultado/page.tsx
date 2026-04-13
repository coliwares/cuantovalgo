import { Suspense } from 'react';
import Link from 'next/link';
import PercentileBar from '@/components/PercentileBar';
import InsightCard from '@/components/InsightCard';
import CrowdsourcingForm from '@/components/CrowdsourcingForm';
import { calculatePercentile, getRecommendation, formatSalary } from '@/lib/salary-calculator';

async function getSalaryData(params: {
  role: string;
  seniority: string;
  location: string;
  salary?: string;
}) {
  const { role, seniority, location, salary } = params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/salary-range?role=${role}&seniority=${seniority}&location=${location}`,
    { next: { revalidate: 86400 } }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch salary data');
  }

  return response.json();
}

async function ResultContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const role = params.role as string;
  const seniority = params.seniority as string;
  const location = params.location as string;
  const salary = params.salary ? parseInt(params.salary as string) : undefined;

  if (!role || !seniority || !location) {
    return (
      <div className="text-center">
        <p className="text-red-400">Parámetros inválidos</p>
        <Link href="/calculadora" className="text-neon hover:underline">
          Volver al formulario
        </Link>
      </div>
    );
  }

  const data = await getSalaryData({ role, seniority, location, salary: salary?.toString() });

  if (!data.has_data) {
    return (
      <div className="max-w-2xl mx-auto glass-card rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Datos limitados para esta combinación
        </h2>
        <p className="text-gray-400 mb-6">
          Aún no tenemos suficientes datos para {role} {seniority} en {location}.
        </p>
        <Link
          href="/calculadora"
          className="inline-block bg-neon text-black font-bold px-6 py-3 rounded-lg hover:bg-neon-dim"
        >
          Probar otra búsqueda
        </Link>
      </div>
    );
  }

  const { p25, p50, p75, currency } = data;
  let percentile: number | undefined;
  let recommendation: 'bajo' | 'mercado' | 'sobre' = 'mercado';

  if (salary) {
    percentile = calculatePercentile(salary, p25, p50, p75);
    recommendation = getRecommendation(percentile);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Rango de mercado */}
      <div className="glass-card rounded-2xl p-8 md:p-10" data-testid="salary-range">
        <h2 className="text-3xl font-bold text-white mb-8">Rango de mercado</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-white/5 rounded-xl border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Percentil 25</div>
            <div className="text-3xl font-bold text-white">
              {formatSalary(p25, currency)}
            </div>
          </div>
          <div className="text-center p-6 bg-neon/10 rounded-xl border-2 border-neon">
            <div className="text-sm text-gray-400 mb-2">Mediana (p50)</div>
            <div className="text-3xl font-bold neon-text">
              {formatSalary(p50, currency)}
            </div>
          </div>
          <div className="text-center p-6 bg-white/5 rounded-xl border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Percentil 75</div>
            <div className="text-3xl font-bold text-white">
              {formatSalary(p75, currency)}
            </div>
          </div>
        </div>

        {salary && percentile !== undefined && (
          <div className="mt-10">
            <div className="mb-6 p-6 bg-white/5 rounded-xl border border-gray-800">
              <p className="text-sm text-gray-400 mb-1">Tu sueldo actual</p>
              <p className="text-3xl font-bold text-white">
                {formatSalary(salary, currency)}
              </p>
            </div>
            <PercentileBar percentile={percentile} recommendation={recommendation} />
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500">
          <p>
            📊 Basado en {data.sample_size || 'datos seed'} reportes para {role} {seniority} en{' '}
            {location}
          </p>
        </div>
      </div>

      {/* Insight IA */}
      <InsightCard
        role={role}
        seniority={seniority}
        location={location}
        salary={salary}
        percentile={percentile}
        p25={p25}
        p50={p50}
        p75={p75}
        currency={currency}
      />

      {/* Formulario Crowdsourcing */}
      <CrowdsourcingForm
        role={role}
        seniority={seniority}
        location={location}
        currency={currency}
      />

      {/* Disclaimer */}
      <div
        className="glass-card rounded-xl p-6 border border-yellow-500/30"
        data-testid="disclaimer"
      >
        <p className="text-sm text-yellow-400">
          ⚠️ <strong>Importante:</strong> Los datos son estimaciones basadas en reportes
          disponibles y pueden no reflejar exactamente tu mercado local. Úsalos como
          referencia, no como valor definitivo.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-6 space-x-6">
        <Link
          href="/calculadora"
          className="inline-block text-neon hover:underline font-semibold"
        >
          ← Nueva búsqueda
        </Link>
        <Link href="/" className="inline-block text-gray-400 hover:text-white">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default function ResultadoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <main className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-8 text-gray-400 hover:text-neon transition-colors">
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl md:text-6xl font-black mb-2">
            Tu <span className="neon-text">Resultado</span>
          </h1>
        </div>
        <Suspense
          fallback={
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-pulse space-y-6">
                <div className="h-64 bg-gray-900 rounded-2xl" />
                <div className="h-32 bg-gray-900 rounded-2xl" />
              </div>
            </div>
          }
        >
          <ResultContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
