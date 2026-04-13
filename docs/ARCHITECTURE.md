# ARCHITECTURE.md — Decisiones Técnicas

## Stack MVP (Fase 1 — $0)

| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR para SEO, Vercel deploy trivial |
| Hosting | Vercel (free tier) | CI/CD automático desde GitHub |
| DB + Auth | Supabase (free tier) | Postgres managed + Edge Functions + Storage |
| IA | Claude API (Anthropic) | Insights accionables de calidad |
| Cache | Supabase KV / Next cache | Cache rangos por rol+nivel (TTL 24h) |
| Testing | Playwright | Flujos críticos del form |
| Analytics | Vercel Analytics (free) | Comportamiento sin configurar nada |

## Principios de arquitectura

- **Sin overengineering**: no microservicios, no queues, no Redis en MVP
- **SSR donde importa**: resultado de calculadora = SSR para SEO + velocidad
- **Edge functions para IA**: latencia baja en Claude API call
- **Cache agresivo de rangos**: los rangos salariales no cambian por hora

## Base de datos (Supabase / Postgres)

### Tablas

```sql
-- Dataset principal (seed manual + data validada)
CREATE TABLE salary_benchmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  seniority TEXT NOT NULL,
  location TEXT NOT NULL,
  p10 INTEGER,
  p25 INTEGER NOT NULL,
  p50 INTEGER NOT NULL,
  p75 INTEGER NOT NULL,
  p90 INTEGER,
  currency TEXT DEFAULT 'CLP',
  sample_size INTEGER DEFAULT 0,
  source TEXT DEFAULT 'seed',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role, seniority, location)
);

-- Submissions anónimas del crowdsourcing
CREATE TABLE salary_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  seniority TEXT NOT NULL,
  location TEXT NOT NULL,
  salary INTEGER NOT NULL,
  currency TEXT DEFAULT 'CLP',
  years_exp INTEGER,
  company_type TEXT,
  fingerprint TEXT,  -- SHA256 del IP+UA para deduplicar
  status TEXT DEFAULT 'pending',  -- pending | approved | rejected
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Log de consultas (analytics anónimo)
CREATE TABLE query_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT,
  seniority TEXT,
  location TEXT,
  has_salary BOOLEAN,
  result_percentile INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security

```sql
-- salary_benchmarks: lectura pública, escritura solo service key
ALTER TABLE salary_benchmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON salary_benchmarks FOR SELECT USING (true);

-- salary_submissions: inserción pública, lectura solo service key
ALTER TABLE salary_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert" ON salary_submissions FOR INSERT WITH CHECK (true);
```

## API Routes

### GET /api/salary-range

```typescript
// Query params: role, seniority, location
// Response:
{
  p25: number,
  p50: number,
  p75: number,
  sample_size: number,
  currency: string,
  has_data: boolean
}
```

### POST /api/insight

```typescript
// Body: { role, seniority, location, salary?, percentile?, p50 }
// Response:
{
  insight: string,  // 2-3 oraciones accionables
  cached: boolean
}
```

### POST /api/submit-salary

```typescript
// Body: { role, seniority, location, salary, currency, years_exp?, company_type? }
// Response: { success: boolean }
```

## Caching Strategy

```typescript
// En Next.js App Router:
// Rangos salariales: cache 24h (cambian poco)
export const revalidate = 86400; // 24h

// Insights IA: cache por (role + seniority + location + percentile_bucket)
// percentile_bucket: 'bajo' | 'mercado' | 'alto'
// Esto reduce llamadas Claude ~80%
```

## Manejo de outliers (crowdsourcing)

```typescript
// Rechazar submissions fuera de ±2.5 IQR del rango existente
function isOutlier(salary: number, p25: number, p75: number): boolean {
  const iqr = p75 - p25;
  const lower = p25 - 2.5 * iqr;
  const upper = p75 + 2.5 * iqr;
  return salary < lower || salary > upper;
}
```

## Seguridad

- Rate limiting en `/api/insight`: 3 req/min por IP (Next.js middleware)
- Fingerprint en submissions: SHA256(IP + UserAgent) para detectar duplicados
- ANTHROPIC_API_KEY solo en servidor (nunca cliente)
- Supabase anon key en cliente (solo lectura pública)
- Service key solo en Edge Functions

## Deployment

```
GitHub main branch
      │
      ▼ (auto-deploy)
   Vercel
      │
      ├── Preview: PR branches
      └── Production: main

Supabase: proyecto separado prod / dev
```

## Variables de entorno

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...        # Solo server-side
ANTHROPIC_API_KEY=sk-ant-...       # Solo server-side
NEXT_PUBLIC_APP_URL=https://cuantovalgo.cl
```

## Escalamiento Fase 2 (solo si hay tracción)

- Cloudflare Workers para cache de rangos (KV)
- Supabase Edge Functions para batch update de benchmarks
- Stripe para pagos (paywall)
- No migrar de Vercel hasta 100k req/mes
