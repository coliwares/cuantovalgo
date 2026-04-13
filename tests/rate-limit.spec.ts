import { test, expect } from '@playwright/test';

test.describe('Rate Limiting en /api/insight', () => {
  const testPayload = {
    role: 'frontend',
    seniority: 'senior',
    location: 'chile_local',
    salary: 2500000,
    percentile: 45,
    p25: 2200000,
    p50: 2800000,
    p75: 3800000,
    currency: 'CLP',
  };

  test('permite 3 requests en 1 minuto', async ({ request }) => {
    // Request 1
    const res1 = await request.post('http://localhost:3000/api/insight', {
      data: testPayload,
    });
    expect(res1.status()).toBe(200);
    expect(res1.headers()['x-ratelimit-limit']).toBe('3');
    expect(res1.headers()['x-ratelimit-remaining']).toBe('2');

    // Request 2
    const res2 = await request.post('http://localhost:3000/api/insight', {
      data: testPayload,
    });
    expect(res2.status()).toBe(200);
    expect(res2.headers()['x-ratelimit-remaining']).toBe('1');

    // Request 3
    const res3 = await request.post('http://localhost:3000/api/insight', {
      data: testPayload,
    });
    expect(res3.status()).toBe(200);
    expect(res3.headers()['x-ratelimit-remaining']).toBe('0');
  });

  test('bloquea el 4to request con 429', async ({ request }) => {
    // Hacer 3 requests permitidos
    for (let i = 0; i < 3; i++) {
      await request.post('http://localhost:3000/api/insight', {
        data: testPayload,
      });
    }

    // 4to request debe ser bloqueado
    const res4 = await request.post('http://localhost:3000/api/insight', {
      data: testPayload,
    });

    expect(res4.status()).toBe(429);
    expect(res4.headers()['x-ratelimit-remaining']).toBe('0');
    expect(res4.headers()['retry-after']).toBeDefined();

    const body = await res4.json();
    expect(body.error).toContain('Demasiadas solicitudes');
    expect(body.retry_after).toBeGreaterThan(0);
  });

  test('resetea el contador después de 1 minuto', async ({ request }) => {
    // Hacer 3 requests para agotar el límite
    for (let i = 0; i < 3; i++) {
      await request.post('http://localhost:3000/api/insight', {
        data: testPayload,
      });
    }

    // Verificar que está bloqueado
    const blocked = await request.post('http://localhost:3000/api/insight', {
      data: testPayload,
    });
    expect(blocked.status()).toBe(429);

    // Esperar 61 segundos (1 minuto + margen)
    await new Promise((resolve) => setTimeout(resolve, 61000));

    // Debe permitir nuevamente
    const afterReset = await request.post('http://localhost:3000/api/insight', {
      data: testPayload,
    });
    expect(afterReset.status()).toBe(200);
    expect(afterReset.headers()['x-ratelimit-remaining']).toBe('2');
  });

  test('respuestas cacheadas también consumen rate limit', async ({ request }) => {
    // Primera request (generará insight y lo cacheará)
    const res1 = await request.post('http://localhost:3000/api/insight', {
      data: testPayload,
    });
    expect(res1.status()).toBe(200);
    expect(res1.headers()['x-ratelimit-remaining']).toBe('2');

    // Segunda request (debe retornar del cache pero consumir rate limit)
    const res2 = await request.post('http://localhost:3000/api/insight', {
      data: testPayload,
    });
    expect(res2.status()).toBe(200);
    expect(res2.headers()['x-ratelimit-remaining']).toBe('1');

    const body2 = await res2.json();
    expect(body2.cached).toBe(true);
  });
});
