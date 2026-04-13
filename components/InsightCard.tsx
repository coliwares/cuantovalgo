'use client';

import { useEffect, useState } from 'react';

interface InsightCardProps {
  role: string;
  seniority: string;
  location: string;
  salary?: number;
  percentile?: number;
  p25: number;
  p50: number;
  p75: number;
  currency: 'CLP' | 'USD';
}

export default function InsightCard(props: InsightCardProps) {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchInsight() {
      try {
        setLoading(true);
        const response = await fetch('/api/insight', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(props),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch insight');
        }

        const data = await response.json();
        setInsight(data.insight);
      } catch (err) {
        console.error('Error fetching insight:', err);
        setError(true);
        // Fallback genérico
        setInsight(
          'Basándote en estos datos de mercado, evalúa si tu compensación actual está alineada con tu experiencia y responsabilidades. Si llevas más de 12-18 meses sin ajuste salarial, considera iniciar una conversación sobre tu evolución.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchInsight();
  }, [props]);

  return (
    <div data-testid="insight-card" className="glass-card rounded-2xl p-8 border-2 border-neon/30">
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">🤖</div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-xl mb-3">Insight IA personalizado</h3>
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-700 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-gray-700 rounded animate-pulse w-4/6" />
            </div>
          ) : (
            <p className="text-gray-300 leading-relaxed text-lg">{insight}</p>
          )}
        </div>
      </div>
      {error && (
        <p className="text-xs text-gray-500 mt-3">
          ⚠️ No pudimos generar un insight personalizado, mostrando recomendación general.
        </p>
      )}
    </div>
  );
}
