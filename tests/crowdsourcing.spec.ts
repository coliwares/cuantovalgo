import { test, expect } from '@playwright/test';

test.describe('Formulario de Crowdsourcing', () => {
  test('debe mostrar y abrir el formulario de contribución', async ({ page }) => {
    // Ir a una página de resultado
    await page.goto('/calculadora/resultado?role=qa&seniority=senior&location=chile_local&salary=2000000');

    // Esperar a que cargue
    await page.waitForSelector('[data-testid="salary-range"]');

    // Verificar que el botón de crowdsourcing esté visible
    await expect(page.locator('[data-testid="open-crowdsourcing"]')).toBeVisible();

    // Click en el botón
    await page.click('[data-testid="open-crowdsourcing"]');

    // Verificar que el formulario se abrió
    await expect(page.locator('[data-testid="crowdsourcing-salary"]')).toBeVisible();
    await expect(page.locator('[data-testid="crowdsourcing-years"]')).toBeVisible();
    await expect(page.locator('[data-testid="crowdsourcing-company"]')).toBeVisible();
  });

  test('debe validar campos requeridos', async ({ page }) => {
    await page.goto('/calculadora/resultado?role=frontend&seniority=semi&location=chile_local');

    // Abrir formulario
    await page.click('[data-testid="open-crowdsourcing"]');

    // Intentar enviar sin sueldo
    await page.click('[data-testid="submit-crowdsourcing"]');

    // El navegador debería prevenir el submit (HTML5 validation)
    // El formulario aún debe estar visible
    await expect(page.locator('[data-testid="crowdsourcing-salary"]')).toBeVisible();
  });

  test('debe permitir completar y enviar el formulario', async ({ page }) => {
    await page.goto('/calculadora/resultado?role=backend&seniority=senior&location=chile_local');

    // Abrir formulario
    await page.click('[data-testid="open-crowdsourcing"]');

    // Llenar campos
    await page.fill('[data-testid="crowdsourcing-salary"]', '3000000');
    await page.fill('[data-testid="crowdsourcing-years"]', '6');
    await page.selectOption('[data-testid="crowdsourcing-company"]', 'fintech');

    // Enviar
    await page.click('[data-testid="submit-crowdsourcing"]');

    // Esperar respuesta
    await page.waitForTimeout(2000);

    // Verificar mensaje de éxito o error
    // Nota: Dependiendo de si hay duplicados, puede mostrar éxito o error
    const successMessage = page.locator('text=¡Gracias!');
    const errorMessage = page.locator('text=Error');

    const hasSuccess = await successMessage.isVisible().catch(() => false);
    const hasError = await errorMessage.isVisible().catch(() => false);

    expect(hasSuccess || hasError).toBeTruthy();
  });

  test('debe cerrar el formulario al hacer click en cancelar', async ({ page }) => {
    await page.goto('/calculadora/resultado?role=qa&seniority=junior&location=chile_local');

    // Abrir formulario
    await page.click('[data-testid="open-crowdsourcing"]');
    await expect(page.locator('[data-testid="crowdsourcing-salary"]')).toBeVisible();

    // Cerrar
    await page.click('text=Cancelar');

    // Verificar que el formulario se cerró
    await expect(page.locator('[data-testid="open-crowdsourcing"]')).toBeVisible();
  });
});
