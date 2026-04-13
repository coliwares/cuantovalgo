import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Eres un experto en mercado laboral tech de Chile con 10 años de experiencia.
Tu tarea: generar insights salariales cortos, directos y accionables.

REGLAS ESTRICTAS:
- Máximo 3 oraciones
- Sin introducciones ni despedidas
- Siempre terminar con una acción concreta
- Usar números específicos del contexto dado
- Tono: directo, como un colega senior que te da consejo honesto
- Idioma: español chileno informal pero profesional`;

function buildInsightPrompt(context: {
  role: string;
  seniority: string;
  location: string;
  salary?: number;
  percentile?: number;
  p25: number;
  p50: number;
  p75: number;
  currency: string;
}): string {
  const { role, seniority, location, salary, percentile, p25, p50, p75, currency } = context;

  const formatSalary = (n: number) =>
    currency === 'CLP' ? `$${n.toLocaleString('es-CL')} CLP` : `USD ${n.toLocaleString('en-US')}`;

  if (salary && percentile !== undefined) {
    if (percentile < 35) {
      return `Perfil: ${seniority} ${role} en ${location}.
Sueldo actual: ${formatSalary(salary)} (percentil ${Math.round(percentile)}%).
Mediana del mercado: ${formatSalary(p50)}. Rango típico: ${formatSalary(p25)} a ${formatSalary(p75)}.

Este profesional está bajo mercado. Genera un insight accionable para negociar un aumento.`;
    } else if (percentile > 65) {
      return `Perfil: ${seniority} ${role} en ${location}.
Sueldo actual: ${formatSalary(salary)} (percentil ${Math.round(percentile)}%).
Mediana del mercado: ${formatSalary(p50)}.

Este profesional está sobre la mediana. Genera un insight sobre cómo mantener y capitalizar esta posición.`;
    } else {
      return `Perfil: ${seniority} ${role} en ${location}.
Sueldo actual: ${formatSalary(salary)} (percentil ${Math.round(percentile)}%).
Mediana del mercado: ${formatSalary(p50)}.

Este profesional está en el mercado. Genera un insight sobre cuándo y cómo pedir más.`;
    }
  } else {
    return `Perfil: ${seniority} ${role} en ${location}.
Rango de mercado: ${formatSalary(p25)} (p25) — ${formatSalary(p50)} (mediana) — ${formatSalary(p75)} (p75).

Genera un insight accionable sobre qué debería esperar ganar y cómo negociar en una oferta o pedido de aumento.`;
  }
}

function getCacheKey(context: {
  role: string;
  seniority: string;
  location: string;
  percentile?: number;
  salary?: number;
}): string {
  const bucket = context.salary
    ? context.percentile! < 35
      ? 'bajo'
      : context.percentile! > 65
      ? 'alto'
      : 'mercado'
    : 'sinSueldo';

  return `${context.role}_${context.seniority}_${context.location}_${bucket}`;
}

// Cache simple en memoria (en producción usar Redis o similar)
const insightCache = new Map<string, { insight: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, seniority, location, salary, percentile, p25, p50, p75, currency } = body;

    if (!role || !seniority || !location || !p25 || !p50 || !p75) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
    }

    // Revisar cache
    const cacheKey = getCacheKey({ role, seniority, location, percentile, salary });
    const cached = insightCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ insight: cached.insight, cached: true });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Fallback si no hay API key configurada
      const fallbackInsight = getFallbackInsight({ role, seniority, percentile, p50, currency });
      return NextResponse.json({ insight: fallbackInsight, cached: false });
    }

    // Llamada a Claude API
    const userPrompt = buildInsightPrompt({
      role,
      seniority,
      location,
      salary,
      percentile,
      p25,
      p50,
      p75,
      currency,
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    const insight = data.content[0].text;

    // Guardar en cache
    insightCache.set(cacheKey, { insight, timestamp: Date.now() });

    return NextResponse.json({ insight, cached: false });
  } catch (error) {
    console.error('Error generating insight:', error);

    // Fallback en caso de error
    const fallbackInsight =
      'Basándote en estos datos de mercado, evalúa si tu compensación actual está alineada con tu experiencia. Si llevas más de 12-18 meses sin ajuste, considera iniciar una conversación sobre tu evolución salarial.';

    return NextResponse.json({ insight: fallbackInsight, cached: false });
  }
}

function getFallbackInsight(context: {
  role: string;
  seniority: string;
  percentile?: number;
  p50: number;
  currency: string;
}): string {
  const { role, seniority, percentile, p50, currency } = context;
  const formatSalary = (n: number) =>
    currency === 'CLP' ? `$${n.toLocaleString('es-CL')} CLP` : `USD ${n.toLocaleString('en-US')}`;

  if (percentile !== undefined) {
    if (percentile < 35) {
      return `Estás bajo la mediana del mercado para ${role} ${seniority}. La mediana es ${formatSalary(p50)}. Considera preparar un caso de negociación con evidencia de tu impacto y los rangos de mercado actuales para tu próxima evaluación.`;
    } else if (percentile > 65) {
      return `Estás sobre la mediana del mercado para ${role} ${seniority}, lo cual es una buena posición. Enfócate en mantener tu valor agregado visible y considera cuándo es el momento correcto para negociar más responsabilidades o un aumento adicional.`;
    } else {
      return `Estás en la mediana del mercado para ${role} ${seniority}. Hay espacio para crecer hacia el percentil 75. Si llevas más de 18 meses sin aumento, es momento de preparar tu caso con evidencia concreta de impacto.`;
    }
  } else {
    return `Para ${role} ${seniority}, la mediana de mercado está en ${formatSalary(p50)}. Si estás evaluando una oferta o negociando, usa este rango como referencia y ajusta según tu experiencia específica y el tipo de empresa.`;
  }
}
