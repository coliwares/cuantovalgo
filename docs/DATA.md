# DATA.md — Estrategia de Datos

## El problema core: el chicken-egg del data

Sin datos no hay producto. Sin producto no hay datos.

**Solución MVP:** Seed manual con datos validados de fuentes públicas + disclaimer transparente.
**Solución Fase 2:** Crowdsourcing activo que hace crecer el dataset solo.

## Fuentes para el seed inicial

| Fuente | Confiabilidad | Uso |
|---|---|---|
| Glassdoor CL | Media | Referencia de rangos generales |
| LinkedIn Salary | Media | Validación de tendencias |
| Howdy.com / Nearshore reports | Alta | Benchmarks USD verificados |
| INE Chile (encuesta ocupacional) | Alta | Rangos macro por sector |
| Comunidades Slack/Discord tech CL | Alta | Datos cualitativos + validación |
| Reportes salariales (Hays, Michael Page CL) | Alta | Rangos por rol específico |

## Dataset Seed — Roles Tech Chile 2025

> Valores en CLP mensual bruto / USD mensual según ubicación
> p25 = percentil 25, p50 = mediana, p75 = percentil 75

### Chile Local (CLP mensual bruto)

```json
[
  { "role": "frontend", "seniority": "junior", "location": "chile_local",
    "p25": 900000, "p50": 1200000, "p75": 1600000, "sample_size": 0, "source": "seed" },
  { "role": "frontend", "seniority": "semi", "location": "chile_local",
    "p25": 1500000, "p50": 1900000, "p75": 2500000, "sample_size": 0, "source": "seed" },
  { "role": "frontend", "seniority": "senior", "location": "chile_local",
    "p25": 2200000, "p50": 2800000, "p75": 3800000, "sample_size": 0, "source": "seed" },
  { "role": "frontend", "seniority": "lead", "location": "chile_local",
    "p25": 3000000, "p50": 4000000, "p75": 5500000, "sample_size": 0, "source": "seed" },

  { "role": "backend", "seniority": "junior", "location": "chile_local",
    "p25": 950000, "p50": 1300000, "p75": 1700000, "sample_size": 0, "source": "seed" },
  { "role": "backend", "seniority": "semi", "location": "chile_local",
    "p25": 1600000, "p50": 2100000, "p75": 2700000, "sample_size": 0, "source": "seed" },
  { "role": "backend", "seniority": "senior", "location": "chile_local",
    "p25": 2400000, "p50": 3100000, "p75": 4200000, "sample_size": 0, "source": "seed" },

  { "role": "fullstack", "seniority": "junior", "location": "chile_local",
    "p25": 900000, "p50": 1250000, "p75": 1650000, "sample_size": 0, "source": "seed" },
  { "role": "fullstack", "seniority": "semi", "location": "chile_local",
    "p25": 1500000, "p50": 2000000, "p75": 2600000, "sample_size": 0, "source": "seed" },
  { "role": "fullstack", "seniority": "senior", "location": "chile_local",
    "p25": 2300000, "p50": 2900000, "p75": 4000000, "sample_size": 0, "source": "seed" },

  { "role": "qa", "seniority": "junior", "location": "chile_local",
    "p25": 800000, "p50": 1050000, "p75": 1350000, "sample_size": 0, "source": "seed" },
  { "role": "qa", "seniority": "semi", "location": "chile_local",
    "p25": 1200000, "p50": 1600000, "p75": 2100000, "sample_size": 0, "source": "seed" },
  { "role": "qa", "seniority": "senior", "location": "chile_local",
    "p25": 1800000, "p50": 2300000, "p75": 3100000, "sample_size": 0, "source": "seed" },

  { "role": "product", "seniority": "junior", "location": "chile_local",
    "p25": 1000000, "p50": 1400000, "p75": 1800000, "sample_size": 0, "source": "seed" },
  { "role": "product", "seniority": "semi", "location": "chile_local",
    "p25": 1700000, "p50": 2200000, "p75": 2900000, "sample_size": 0, "source": "seed" },
  { "role": "product", "seniority": "senior", "location": "chile_local",
    "p25": 2500000, "p50": 3300000, "p75": 4500000, "sample_size": 0, "source": "seed" },

  { "role": "design", "seniority": "junior", "location": "chile_local",
    "p25": 800000, "p50": 1100000, "p75": 1500000, "sample_size": 0, "source": "seed" },
  { "role": "design", "seniority": "semi", "location": "chile_local",
    "p25": 1300000, "p50": 1700000, "p75": 2300000, "sample_size": 0, "source": "seed" },
  { "role": "design", "seniority": "senior", "location": "chile_local",
    "p25": 2000000, "p50": 2600000, "p75": 3500000, "sample_size": 0, "source": "seed" },

  { "role": "devops", "seniority": "semi", "location": "chile_local",
    "p25": 1800000, "p50": 2400000, "p75": 3200000, "sample_size": 0, "source": "seed" },
  { "role": "devops", "seniority": "senior", "location": "chile_local",
    "p25": 2700000, "p50": 3500000, "p75": 4800000, "sample_size": 0, "source": "seed" },

  { "role": "data", "seniority": "semi", "location": "chile_local",
    "p25": 1700000, "p50": 2300000, "p75": 3100000, "sample_size": 0, "source": "seed" },
  { "role": "data", "seniority": "senior", "location": "chile_local",
    "p25": 2600000, "p50": 3400000, "p75": 4600000, "sample_size": 0, "source": "seed" }
]
```

### Chile Remoto USD (mensual)

```json
[
  { "role": "frontend", "seniority": "semi", "location": "chile_remoto_usd",
    "p25": 2000, "p50": 2800, "p75": 3800, "currency": "USD", "source": "seed" },
  { "role": "frontend", "seniority": "senior", "location": "chile_remoto_usd",
    "p25": 3200, "p50": 4500, "p75": 6500, "currency": "USD", "source": "seed" },
  { "role": "backend", "seniority": "semi", "location": "chile_remoto_usd",
    "p25": 2200, "p50": 3000, "p75": 4200, "currency": "USD", "source": "seed" },
  { "role": "backend", "seniority": "senior", "location": "chile_remoto_usd",
    "p25": 3500, "p50": 5000, "p75": 7000, "currency": "USD", "source": "seed" },
  { "role": "qa", "seniority": "semi", "location": "chile_remoto_usd",
    "p25": 1500, "p50": 2200, "p75": 3000, "currency": "USD", "source": "seed" },
  { "role": "qa", "seniority": "senior", "location": "chile_remoto_usd",
    "p25": 2500, "p50": 3500, "p75": 5000, "currency": "USD", "source": "seed" }
]
```

## Estrategia de Crowdsourcing

### Flujo de captura

1. Después de ver resultado → "Contribuye tu sueldo anónimo y mejora los datos para todos"
2. Form simple: mismo form de consulta + checkbox "confirmar que es real"
3. Guardado en `salary_submissions` con status `pending`
4. Revisión manual inicial (Fase 1) → automática (Fase 2)

### Mecánica anti-fraude

```typescript
// Deduplicación por fingerprint
const fingerprint = await crypto.subtle.digest(
  'SHA-256',
  new TextEncoder().encode(`${ip}-${userAgent}`)
);

// Rechazo de outliers estadísticos
// Si salary < p25 * 0.5 || salary > p75 * 2 → status = 'rejected'
```

### Incentivo para contribuir

- "Ayuda a hacer los datos más precisos para todos"
- Badge: "Datos verificados por la comunidad"
- Futuro: acceso premium gratis por contribuir (Fase 2)

## Disclaimer (OBLIGATORIO en UI)

> ⚠️ "Los datos son estimaciones basadas en reportes disponibles y pueden no reflejar exactamente tu mercado local. Úsalos como referencia, no como valor definitivo."

Este disclaimer reduce expectativas irreales y aumenta confianza.

## Roadmap de datos

| Fase | Acción | Resultado |
|---|---|---|
| MVP | Seed manual (este archivo) | 30+ combinaciones role/nivel/ubicación |
| Mes 2 | Crowdsourcing activo | +50 submissions reales |
| Mes 3 | Validación y merge al benchmark | Dataset más preciso |
| Mes 4+ | Partnerships con comunidades tech CL | Escala orgánica |
