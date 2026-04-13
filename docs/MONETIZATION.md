# MONETIZATION.md — Modelo de Negocio

## Principio MVP

> "No cobrar hasta tener 200+ usuarios que usaron el producto."

Validar primero. Monetizar cuando el dolor está confirmado.

## Modelo Freemium

### Tier FREE (siempre gratis)

| Feature | Disponible |
|---|---|
| Cálculo de rango de mercado | ✅ |
| Percentil vs mercado | ✅ |
| Insight IA básico (1 párrafo) | ✅ |
| Comparación p25/p50/p75 | ✅ |
| Contribuir sueldo anónimo | ✅ |

### Tier PAID — Informe completo ($2.990 CLP / ~$3 USD)

| Feature | Disponible |
|---|---|
| Análisis por tipo de empresa (startup/fintech/corp) | 🔒 |
| Evolución salarial proyectada (1-2 años) | 🔒 |
| Comparación local vs remoto USD | 🔒 |
| Script de negociación personalizado | 🔒 |
| PDF descargable del análisis | 🔒 |

### Tier PAID — Plan negociación ($4.990 CLP)

| Feature | Disponible |
|---|---|
| Todo lo anterior | 🔒 |
| Script de negociación paso a paso | 🔒 |
| Manejo de objeciones ("no hay presupuesto") | 🔒 |
| Email template para pedir reunión | 🔒 |
| Checklist de preparación pre-reunión | 🔒 |

### Tier SUSCRIPCIÓN — Tracking ($990 CLP/mes)

| Feature | Disponible |
|---|---|
| Alerta cuando el mercado cambia para tu perfil | 🔒 |
| Comparación semestral de tu evolución vs mercado | 🔒 |
| Dashboard personal de carrera | 🔒 |

---

## Cuándo activar el paywall

**No activar hasta:**
- [ ] 200+ usuarios completaron el flujo
- [ ] 50+ submissions de crowdsourcing
- [ ] Feedback cualitativo positivo del insight IA
- [ ] Tasa de completación del form > 65%

**Señal de que está listo:** usuarios comparten el resultado en redes sin que se les pida.

---

## Implementación técnica del paywall (Fase 2)

### Stack de pagos: Stripe

```typescript
// Flujo de pago:
// 1. Usuario hace clic en "Ver análisis completo"
// 2. Modal con opciones ($2.990 / $4.990)
// 3. Stripe Checkout (hosted) → mínima fricción
// 4. Webhook de Stripe → guardar access token en Supabase
// 5. Usuario ve contenido desbloqueado

// En Supabase: tabla purchases
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE,  -- Stripe session ID
  plan TEXT,               -- 'informe' | 'negociacion' | 'tracking'
  amount INTEGER,          -- en CLP
  query_hash TEXT,         -- hash de la consulta (rol+nivel+ubicación)
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ   -- null para compras únicas
);
```

### UX del paywall

```
Resultado FREE visible:
┌─────────────────────────────────────────┐
│ 💰 Rango: $1.800.000 — $3.100.000 CLP  │
│ 📊 Percentil: 45%                       │
│ 🤖 "Estás levemente bajo mercado..."    │
└─────────────────────────────────────────┘

Sección paywall (blur + CTA):
┌─────────────────────────────────────────┐
│ 🔒 [borroso] Por empresa tipo...        │
│ 🔒 [borroso] Proyección 2026...         │
│                                         │
│ [Ver análisis completo — $2.990 CLP]    │
│ [Script de negociación — $4.990 CLP]    │
└─────────────────────────────────────────┘
```

---

## Proyección de ingresos (conservadora)

| Mes | Usuarios | Conv. | Ticket | Ingreso |
|---|---|---|---|---|
| 1 | 500 | 0% | — | $0 |
| 2 | 1.000 | 2% | $2.990 | ~$59.800 CLP |
| 3 | 2.000 | 3% | $3.500 avg | ~$210.000 CLP |
| 4 | 4.000 | 4% | $3.500 avg | ~$560.000 CLP |

> Nota: son estimaciones optimistas. El producto se valida con real money cuando 20+ personas pagan sin que se les insista.

## Alternativas de monetización a explorar

| Modelo | Potencial | Esfuerzo | Cuando explorar |
|---|---|---|---|
| B2B: empresas RRHH | Alto | Alto | Mes 4+ si hay tracción |
| Branded reports (headhunters) | Medio | Medio | Mes 3+ |
| Afiliados (plataformas trabajo) | Bajo | Bajo | Mes 2 |
| Patrocinio newsletter | Bajo-Medio | Bajo | Si hay lista > 1.000 |

## ROI del stack tecnológico

| Servicio | Costo actual | Tipping point para pagar |
|---|---|---|
| Vercel (free) | $0 | >100k req/mes → Pro $20/mes |
| Supabase (free) | $0 | >500MB / 50k MAU → Pro $25/mes |
| Claude API | ~$0.02/insight | >5.000 insights/mes → ~$100/mes |
| Dominio .cl | ~$10.000 CLP/año | Desde el inicio |
| **Total Fase 1** | **~$10.000 CLP/año** | |

> El producto necesita generar ~$10.000 CLP/mes para cubrir los primeros costos variables (Claude API a escala). Eso equivale a 3-4 compras de informe/mes.
