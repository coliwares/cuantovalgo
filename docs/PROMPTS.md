# PROMPTS.md — Prompts del Insight Engine

## Principios de los prompts

1. **Corto y accionable**: máx 3 oraciones, sin relleno
2. **Específico al perfil**: nombrar el rol, nivel, contexto
3. **Con números**: "podrías pedir entre X y Y"
4. **Sin alarmismo ni sobreoptimismo**: tono neutro y directo
5. **Cache por bucket**: bajo / mercado / sobre (no por sueldo exacto)

---

## Prompt principal — Insight salarial

```typescript
const systemPrompt = `Eres un experto en mercado laboral tech de Chile con 10 años de experiencia.
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
}) {
  const { role, seniority, location, salary, percentile, p25, p50, p75, currency } = context;
  
  const formatSalary = (n: number) => 
    currency === 'CLP' 
      ? `$${n.toLocaleString('es-CL')} CLP` 
      : `USD ${n.toLocaleString('en-US')}`;

  if (salary && percentile !== undefined) {
    // Usuario ingresó su sueldo
    if (percentile < 35) {
      return `Perfil: ${seniority} ${role} en ${location}.
Sueldo actual: ${formatSalary(salary)} (percentil ${percentile}%).
Mediana del mercado: ${formatSalary(p50)}. Rango típico: ${formatSalary(p25)} a ${formatSalary(p75)}.

Este profesional está bajo mercado. Genera un insight accionable para negociar un aumento.`;
    } else if (percentile > 65) {
      return `Perfil: ${seniority} ${role} en ${location}.
Sueldo actual: ${formatSalary(salary)} (percentil ${percentile}%).
Mediana del mercado: ${formatSalary(p50)}.

Este profesional está sobre la mediana. Genera un insight sobre cómo mantener y capitalizar esta posición.`;
    } else {
      return `Perfil: ${seniority} ${role} en ${location}.
Sueldo actual: ${formatSalary(salary)} (percentil ${percentile}%).
Mediana del mercado: ${formatSalary(p50)}.

Este profesional está en el mercado. Genera un insight sobre cuándo y cómo pedir más.`;
    }
  } else {
    // Usuario no ingresó sueldo → insight general del mercado para su perfil
    return `Perfil: ${seniority} ${role} en ${location}.
Rango de mercado: ${formatSalary(p25)} (p25) — ${formatSalary(p50)} (mediana) — ${formatSalary(p75)} (p75).

Genera un insight accionable sobre qué debería esperar ganar y cómo negociar en una oferta o pedido de aumento.`;
  }
}
```

## Ejemplos de outputs esperados

### Caso: QA Semi-senior bajo mercado (percentil 28%)

> "Estás ganando un 25% menos que la mediana para QA semi-senior en Chile. El rango real para tu nivel está entre $1.200.000 y $2.100.000 CLP. Antes de tu próxima evaluación, prepara un log de impacto con bugs críticos que encontraste y pide una revisión salarial con ese respaldo."

### Caso: Frontend Senior en mercado (percentil 52%)

> "Estás en la mediana del mercado para Frontend Senior en Chile, lo que es una buena posición pero con margen real de mejora. Los seniors en el percentil 75 están ganando cerca de $3.800.000 CLP, generalmente en fintechs o empresas con producto propio. Si llevas más de 18 meses sin aumento, ya tienes argumento para pedir entre $200.000 y $400.000 más."

### Caso: Backend Junior sobre mercado (percentil 78%)

> "Estás pagado por encima de la mediana para Backend Junior en Chile, lo que es una señal de que tu empresa te valora bien. Foco ahora: construir el portafolio técnico para hacer el salto a semi-senior en los próximos 12-18 meses, donde el salto de sueldo puede ser de $600.000 a $800.000 CLP adicionales."

### Caso: Sin sueldo (solo perfil — Product Senior)

> "Product Seniors en Chile local están en el rango de $2.500.000 a $4.500.000 CLP, con la mediana cerca de $3.300.000. Si te están ofreciendo menos de $2.800.000, hay espacio para negociar citando datos de mercado. Para roles con ownership de producto real, el número debería estar más cerca del p75."

---

## Prompt para script de negociación (Fase 2 — PAGO)

```typescript
const negotiationPrompt = `Genera un script de negociación salarial para este profesional.
Perfil: ${role} ${seniority} con ${years_exp} años de experiencia.
Sueldo actual: ${currentSalary}. Meta: ${targetSalary}.
Empresa tipo: ${companyType}.

El script debe incluir:
1. Apertura (cómo iniciar la conversación)
2. Argumentos con datos (mencionar el rango de mercado)
3. Manejo de la objeción "no hay presupuesto"
4. Cierre (qué aceptar, qué no)

Tono: directo, confiado, profesional. En español.
Largo: máximo 300 palabras.`;
```

## Cache key strategy

```typescript
// Para evitar llamadas innecesarias a Claude
function getInsightCacheKey(context: InsightContext): string {
  const bucket = context.percentile < 35 ? 'bajo' 
    : context.percentile > 65 ? 'alto' 
    : 'mercado';
  
  const salaryBucket = context.salary 
    ? `_${bucket}` 
    : '_sinSueldo';
  
  return `insight_${context.role}_${context.seniority}_${context.location}${salaryBucket}`;
}
// TTL: 24 horas — los insights no cambian por hora
```
