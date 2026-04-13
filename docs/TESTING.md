# TESTING.md — Estrategia de QA

## Filosofía de testing MVP

> "Testear lo que duele si se rompe" — no cobertura 100%, sí flujos críticos.

**Playwright** para E2E de flujos core.
**Tests manuales** para edge cases.
**Sin unit tests** en MVP (overhead innecesario ahora).

---

## Flujos críticos a testear (E2E Playwright)

### Test 1 — Flujo completo con sueldo

```typescript
// tests/flujo-completo.spec.ts
import { test, expect } from '@playwright/test';

test('flujo completo QA senior con sueldo', async ({ page }) => {
  await page.goto('/calculadora');
  
  // Paso 1: Cargo
  await page.selectOption('[data-testid="role-select"]', 'qa');
  await page.click('[data-testid="next-btn"]');
  
  // Paso 2: Seniority
  await page.click('[data-testid="seniority-senior"]');
  await page.click('[data-testid="next-btn"]');
  
  // Paso 3: Años experiencia
  await page.fill('[data-testid="years-exp"]', '5');
  await page.click('[data-testid="next-btn"]');
  
  // Paso 4: Ubicación
  await page.click('[data-testid="location-chile-local"]');
  await page.click('[data-testid="next-btn"]');
  
  // Paso 5: Sueldo actual
  await page.fill('[data-testid="current-salary"]', '1800000');
  await page.click('[data-testid="ver-resultado"]');
  
  // Verificar resultado
  await expect(page.locator('[data-testid="salary-range"]')).toBeVisible();
  await expect(page.locator('[data-testid="percentile-bar"]')).toBeVisible();
  await expect(page.locator('[data-testid="insight-card"]')).toBeVisible();
  await expect(page.locator('[data-testid="disclaimer"]')).toBeVisible();
});
```

### Test 2 — Flujo sin sueldo

```typescript
test('flujo sin sueldo debe mostrar rango sin percentil', async ({ page }) => {
  await page.goto('/calculadora');
  // ... completar form sin campo sueldo
  
  await expect(page.locator('[data-testid="salary-range"]')).toBeVisible();
  await expect(page.locator('[data-testid="percentile-bar"]')).not.toBeVisible();
  await expect(page.locator('[data-testid="no-salary-insight"]')).toBeVisible();
});
```

### Test 3 — Validación del form

```typescript
test('no avanza sin campos requeridos', async ({ page }) => {
  await page.goto('/calculadora');
  await page.click('[data-testid="next-btn"]'); // sin seleccionar rol
  
  await expect(page.locator('[data-testid="role-error"]')).toBeVisible();
  await expect(page).toHaveURL('/calculadora'); // no avanzó
});
```

### Test 4 — Mobile responsive

```typescript
test('funciona en mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 }); // iPhone SE
  await page.goto('/calculadora');
  
  await expect(page.locator('[data-testid="role-select"]')).toBeVisible();
  await expect(page.locator('[data-testid="next-btn"]')).toBeInViewport();
});
```

---

## Checklist de QA Manual (pre-launch)

### Form

- [ ] Todos los roles del dropdown funcionan
- [ ] Todos los niveles de seniority seleccionables
- [ ] Slider de años funciona en mobile
- [ ] Campo sueldo acepta solo números
- [ ] Campo sueldo muestra separador de miles (1.800.000)
- [ ] No avanza si faltan campos requeridos
- [ ] Mensajes de error claros y visibles
- [ ] "Atrás" en wizard no pierde datos previos

### Resultado

- [ ] Rango p25/p50/p75 visible siempre
- [ ] Percentile bar anima correctamente con sueldo
- [ ] Badge de estado (bajo/mercado/sobre) correcto según percentil
- [ ] Insight IA aparece (máx 5 segundos de carga)
- [ ] Estado de loading mientras carga el insight
- [ ] Disclaimer visible sin scroll en móvil
- [ ] N° de reportes mostrado

### Edge Cases

- [ ] Rol sin suficiente data → mensaje "datos limitados, estimación basada en roles similares"
- [ ] Sueldo = 0 → validar, no procesar
- [ ] Sueldo muy alto (outlier obvio, ej 50M CLP) → aceptar pero mostrar nota
- [ ] Combinación junior + 10 años → mostrar advertencia de inconsistencia
- [ ] Ubicación remoto USD → montos en USD, no CLP
- [ ] Sin internet → error claro, no pantalla en blanco

### Performance

- [ ] Tiempo a primer contenido (LCP) < 2 segundos
- [ ] Insight IA < 4 segundos
- [ ] No layout shift al cargar resultados (CLS)
- [ ] Funciona en 3G simulado (Lighthouse)

### Compartir

- [ ] OG image se genera correctamente
- [ ] Preview en WhatsApp muestra datos del resultado
- [ ] Preview en Twitter/X correcto
- [ ] URL de resultado es compartible y carga el mismo resultado

### Crowdsourcing

- [ ] Form de contribución funciona
- [ ] Envío exitoso muestra confirmación
- [ ] Duplicado (mismo fingerprint) muestra mensaje apropiado
- [ ] Datos guardados en Supabase correctamente

---

## Riesgos técnicos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Claude API timeout | Media | Alto | Timeout de 8s → mostrar insight genérico predefinido |
| Supabase down | Baja | Alto | Cache de rangos en Next.js (revalidate 24h) |
| Rate limit Claude API | Media | Medio | Cache de insights por bucket (ver PROMPTS.md) |
| Supabase free tier límites | Baja | Bajo | 500MB storage, 50k MAU → suficiente para MVP |
| Datos incorrectos en seed | Media | Alto | Revisión manual antes de launch + disclaimer |
| Spam en crowdsourcing | Media | Medio | Fingerprint + validación de rango |

---

## Script de configuración Playwright

```bash
npm install -D @playwright/test
npx playwright install chromium

# playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
  },
});
```

```bash
# Correr tests
npx playwright test

# Ver reporte
npx playwright show-report
```
