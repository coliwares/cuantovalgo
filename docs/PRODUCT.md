# PRODUCT.md — Visión y Requerimientos

## Problema

Los profesionales tech en Chile no saben si están bien pagados.
- Glassdoor tiene datos globales poco relevantes para Chile
- LinkedIn Salary no es granular localmente
- No existe herramienta en español, enfocada en CL/LATAM, con acción concreta

## Propuesta de Valor

> "En 30 segundos, descubre si estás bien pagado — y qué hacer al respecto."

### Para el usuario
- Rango de mercado real para su rol/nivel en Chile
- Percentil concreto (ej: "estás en el 42%")
- Recomendación accionable generada por IA
- Guía para negociar si está bajo mercado

## Público objetivo (MVP)

**Primario:**
- Desarrolladores Frontend, Backend, Fullstack
- QA Engineers
- Product Managers / Owners
- UX/UI Designers

**Secundario:**
- Personas en transición laboral
- Profesionales tech evaluando oferta de trabajo

**Geografía MVP:**
- Chile (local CLP)
- Chile remoto (USD)
- LATAM remoto (USD)

## Flujo UX Core

```
Landing
  └─► "Descubre si estás bien pagado en 30 segundos" [CTA]
        └─► Form Wizard (5 inputs max)
              1. Cargo (dropdown: Frontend, Backend, QA, Product, Design, DevOps, Data)
              2. Seniority (Junior / Semi-Senior / Senior / Lead)
              3. Años de experiencia (slider: 0-15+)
              4. Ubicación (Chile local / Chile remoto USD / LATAM remoto USD)
              5. Sueldo actual (input opcional — CLP o USD)
              └─► [Ver mi resultado →]
                    └─► Resultado
                          ├─ 💰 Rango mercado (p25 - p75)
                          ├─ 📊 Barra percentil visual
                          ├─ 🤖 Insight IA accionable (FREE)
                          └─ 🔒 Análisis completo + Plan negociación (PAGO)
```

## Principios de diseño

1. **30 segundos real** — el form no puede tomar más
2. **Transparencia** — "basado en X reportes para este perfil"
3. **Acción primero** — cada resultado termina con "qué hacer"
4. **Mobile first** — la mayoría llegará por celular (viral social)
5. **Sin registro para resultado básico** — fricción mínima

## Inputs del form

| Campo | Tipo | Opciones | Requerido |
|---|---|---|---|
| Cargo | Dropdown | Frontend, Backend, Fullstack, QA, Product, Design, DevOps, Data, Otro | ✅ |
| Seniority | Radio/pills | Junior (0-2), Semi (2-4), Senior (4-8), Lead (8+) | ✅ |
| Años experiencia | Slider/número | 0-15+ | ✅ |
| Ubicación | Radio | Chile local, Chile remoto USD, LATAM remoto USD | ✅ |
| Sueldo actual | Número | CLP o USD según ubicación | ❌ opcional |

## Outputs del resultado

### Tier FREE
- Rango mercado: p25 — p75
- Mediana: p50
- Percentil del usuario (si ingresó sueldo)
- Badge: Bajo / En mercado / Sobre mercado
- Insight IA (1 párrafo, accionable)
- N° de reportes que respaldan el dato

### Tier PAGO ($2.990 CLP)
- Análisis detallado por empresa tipo (startup vs fintech vs corp)
- Evolución salarial esperada (1-2 años)
- Script de negociación personalizado
- Comparación con mercado remoto USD
- PDF descargable

## Métricas de éxito MVP

| Métrica | Target semana 4 |
|---|---|
| Usuarios únicos | 500+ |
| Formularios completados | 200+ |
| Submissions crowdsourcing | 50+ |
| Tasa de completación form | >70% |
| Conversión a pago | >3% (si se activa) |

## Riesgos de producto

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Dataset insuficiente al inicio | Alta | Seed manual + disclaimer transparente |
| Datos irreales por usuarios | Media | Outlier detection, rangos estadísticos |
| Expectativas infladas | Media | Contexto claro: "estimación basada en reportes disponibles" |
| Comparación con mercado global | Baja | Filtro por ubicación obligatorio |
