import { test, expect } from '@playwright/test';

test.describe('Flujo completo calculadora', () => {
  test('debe completar el wizard y ver resultado para QA senior', async ({ page }) => {
    // Ir a la landing
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('¿Estás bien pagado?');

    // Click en CTA
    await page.click('[data-testid="cta-calcular"]');
    await expect(page).toHaveURL('/calculadora');

    // Paso 1: Seleccionar cargo
    await page.selectOption('[data-testid="role-select"]', 'qa');
    await page.click('[data-testid="next-btn"]');

    // Paso 2: Seleccionar seniority
    await page.click('[data-testid="seniority-senior"]');
    await page.click('[data-testid="next-btn"]');

    // Paso 3: Años de experiencia
    await page.fill('[data-testid="years-exp"]', '5');
    await page.click('[data-testid="next-btn"]');

    // Paso 4: Ubicación
    await page.click('[data-testid="location-chile-local"]');
    await page.click('[data-testid="next-btn"]');

    // Paso 5: Sueldo actual
    await page.fill('[data-testid="current-salary"]', '1800000');
    await page.click('[data-testid="ver-resultado"]');

    // Verificar resultado
    await expect(page).toHaveURL(/\/calculadora\/resultado/);
    await expect(page.locator('[data-testid="salary-range"]')).toBeVisible();
    await expect(page.locator('[data-testid="percentile-bar"]')).toBeVisible();
    await expect(page.locator('[data-testid="insight-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="disclaimer"]')).toBeVisible();
  });

  test('debe mostrar error si faltan campos requeridos', async ({ page }) => {
    await page.goto('/calculadora');

    // Intentar avanzar sin seleccionar rol
    await page.click('[data-testid="next-btn"]');

    // Debe mostrar error y no avanzar
    await expect(page.locator('[data-testid="role-error"]')).toBeVisible();
    await expect(page.locator('text=Paso 1 de 5')).toBeVisible();
  });

  test('debe funcionar sin ingresar sueldo', async ({ page }) => {
    await page.goto('/calculadora');

    // Completar formulario sin sueldo
    await page.selectOption('[data-testid="role-select"]', 'frontend');
    await page.click('[data-testid="next-btn"]');

    await page.click('[data-testid="seniority-semi"]');
    await page.click('[data-testid="next-btn"]');

    await page.fill('[data-testid="years-exp"]', '3');
    await page.click('[data-testid="next-btn"]');

    await page.click('[data-testid="location-chile-local"]');
    await page.click('[data-testid="next-btn"]');

    // Skip salary
    await page.click('[data-testid="ver-resultado"]');

    // Debe mostrar rango pero NO percentile bar
    await expect(page.locator('[data-testid="salary-range"]')).toBeVisible();
    await expect(page.locator('[data-testid="percentile-bar"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="insight-card"]')).toBeVisible();
  });
});

test.describe('Mobile responsive', () => {
  test('debe funcionar en móvil', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone SE

    await page.goto('/calculadora');

    await expect(page.locator('[data-testid="role-select"]')).toBeVisible();
    await expect(page.locator('[data-testid="next-btn"]')).toBeInViewport();

    // Completar un paso
    await page.selectOption('[data-testid="role-select"]', 'backend');
    await page.click('[data-testid="next-btn"]');

    await expect(page.locator('[data-testid="seniority-junior"]')).toBeVisible();
  });
});
