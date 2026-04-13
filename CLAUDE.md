# cuantovalgo.cl

Calculadora de valor de mercado salarial para profesionales tech en Chile/LATAM.
El usuario ingresa cargo + nivel + sueldo → obtiene rango de mercado, percentil e insight IA accionable en 30 segundos.

## Docs de referencia
@docs/PRODUCT.md      → visión, flujo UX, métricas de éxito
@docs/ARCHITECTURE.md → stack, schema Supabase, API routes, caching
@docs/DATA.md         → seed dataset completo (30+ combinaciones rol/nivel/ubicación)
@docs/BACKLOG.md      → tareas priorizadas P0→P3, sprints 1-3
@docs/PROMPTS.md      → prompts Claude API para el insight engine
@docs/TESTING.md      → tests Playwright, QA checklist
@docs/MONETIZATION.md → modelo freemium, paywall, pricing

## Stack
- Next.js 14 App Router + TypeScript
- Supabase (Postgres + Edge Functions)
- Tailwind CSS
- Claude API `claude-sonnet-4-20250514` → insights IA
- Vercel deploy
- Playwright → E2E tests

## Estructura de carpetas

```
cuantovalgo/
├── CLAUDE.md
├── docs/                         ← docs del proyecto (referenciar con @)
├── app/
│   ├── page.tsx                  ← landing (Server Component)
│   ├── calculadora/
│   │   ├── page.tsx              ← form wizard entry
│   │   └── resultado/
│   │       └── page.tsx          ← resultado: percentil + insight
│   └── api/
│       ├── salary-range/route.ts ← GET rangos desde Supabase
│       └── insight/route.ts      ← POST → Claude API
├── components/
│   ├── SalaryForm.tsx            ← wizard 5 pasos (Client Component)
│   ├── PercentileBar.tsx         ← barra animada (Client Component)
│   ├── InsightCard.tsx           ← card insight IA
│   └── PaywallModal.tsx          ← bloqueo features pago
├── lib/
│   ├── supabase.ts               ← createServerClient / createBrowserClient
│   └── salary-calculator.ts      ← calculatePercentile, getRecommendation
├── types/
│   └── index.ts                  ← SalaryBenchmark, UserInput, SalaryResult
└── data/
    └── seed-salaries.json        ← dataset inicial manual
```

## Comandos

```bash
npm run dev                  # desarrollo local puerto 3000
npm run build                # build producción
npm run typecheck            # npx tsc --noEmit
npx supabase start           # DB local
npx playwright test          # E2E tests
npx ts-node scripts/seed.ts  # cargar seed data a Supabase
```

Antes de considerar algo listo: `npm run typecheck` + `npm run build` sin errores.

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=           # solo server-side, nunca al cliente
ANTHROPIC_API_KEY=              # solo server-side, nunca al cliente
NEXT_PUBLIC_APP_URL=https://cuantovalgo.cl
```

## Tipos principales (types/index.ts)

```typescript
interface SalaryBenchmark {
  role: string;
  seniority: 'junior' | 'semi' | 'senior' | 'lead';
  location: 'chile_local' | 'chile_remoto_usd' | 'latam_remoto_usd';
  p25: number; p50: number; p75: number;
  currency: 'CLP' | 'USD';
  sample_size: number;
}

interface UserInput {
  role: string;
  seniority: string;
  yearsExp: number;
  location: string;
  currentSalary?: number;
}

interface SalaryResult {
  benchmark: SalaryBenchmark;
  userPercentile?: number;
  recommendation: 'bajo' | 'mercado' | 'sobre';
  hasData: boolean;
}
```

## Reglas de código

**TypeScript:** Sin `any`. Tipos siempre explícitos. Interfaces en `types/index.ts`.

**Componentes:**
- Server Components por defecto. `'use client'` solo si necesita estado o efectos.
- Máx ~100 líneas por componente. Si crece, dividir.
- Todo elemento interactivo lleva `data-testid` para Playwright.

**API routes:** Siempre try/catch. Rate limiting en `/api/insight` (3 req/min por IP). Cache de rangos `revalidate = 86400`. Cache de insights por bucket `bajo|mercado|sobre`.

**Naming:** Componentes PascalCase · utilidades kebab-case · variables camelCase · constantes UPPER_SNAKE_CASE.

**Estilos:** Solo Tailwind. Mobile first. Sin CSS custom salvo animaciones puntuales.

## Claude API — cómo usarla

```typescript
// app/api/insight/route.ts
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 200,
    system: SYSTEM_PROMPT,  // ver docs/PROMPTS.md
    messages: [{ role: 'user', content: userPrompt }]
  })
});
const data = await response.json();
const insight = data.content[0].text;
```

El insight debe ser 2-3 oraciones, directo y accionable. Ver ejemplos y prompts en `@docs/PROMPTS.md`.

## Supabase — tablas

- `salary_benchmarks`: dataset validado. UNIQUE `(role, seniority, location)`. Lectura pública.
- `salary_submissions`: crowdsourcing anónimo. Status `pending|approved|rejected`. Inserción pública.
- `query_log`: analytics anónimo.

RLS activo. `SUPABASE_SERVICE_KEY` solo en server. Anon key en cliente (solo lectura pública).

## NO hacer

- No usar `any` en TypeScript
- No exponer service key ni API key al cliente
- No hardcodear salarios en componentes (usar `data/` o Supabase)
- No crear abstracciones hasta que el patrón se repita 3+ veces
- No ignorar loading y error states en UI
- No escalar infra sin tracción validada → ver `@docs/MONETIZATION.md`

## Estado del proyecto

Fase: 🟢 MVP — construir rápido, validar, iterar.
Próxima tarea: ver `@docs/BACKLOG.md` sección P0.
