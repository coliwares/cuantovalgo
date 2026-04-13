# Rate Limiting en /api/insight

## ✅ Implementado

**Límite:** 3 requests por minuto por IP

**Estado:** ACTIVO en producción

---

## 🎯 Objetivo

Proteger la API de Claude (que tiene costo por token) contra:
- Abuso accidental (usuarios refrescando la página múltiples veces)
- Abuso intencional (scraping, automatización)
- Consumo excesivo de API key

---

## 🔧 Implementación

### Algoritmo

**Fixed Window Counter** con ventanas de 60 segundos:

```typescript
// Estructura en memoria
Map<IP, { count: number, resetAt: number }>

// Lógica
1. Extraer IP del request (x-forwarded-for o x-real-ip)
2. Si no existe registro o expiró → crear nueva ventana
3. Si count >= 3 → retornar 429
4. Si count < 3 → incrementar y permitir
5. Cleanup periódico (1% de probabilidad por request)
```

### Headers de respuesta

Todas las respuestas incluyen:

```http
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1713000000000
```

Respuestas 429 incluyen además:

```http
Retry-After: 45
```

### Ejemplo de uso

```typescript
// Request 1: 200 OK
{
  "insight": "...",
  "cached": false
}
// Headers: X-RateLimit-Remaining: 2

// Request 2: 200 OK
// Headers: X-RateLimit-Remaining: 1

// Request 3: 200 OK
// Headers: X-RateLimit-Remaining: 0

// Request 4: 429 Too Many Requests
{
  "error": "Demasiadas solicitudes. Intenta de nuevo en un momento.",
  "retry_after": 45
}
// Headers: Retry-After: 45
```

---

## 📊 Comportamiento

### Requests normales

- Usuario típico hace 1-2 requests por sesión
- Rate limit NO afecta a usuarios normales
- Solo protege contra abuso

### Requests cacheadas

**IMPORTANTE:** Las respuestas cacheadas también consumen rate limit.

**Razón:** Evitar que alguien haga 1000 requests/min de la misma consulta para saturar el servidor.

### Ventana de tiempo

- Duración: 60 segundos exactos
- Reset: automático cuando expira `resetAt`
- No hay "sliding window" (es fixed window)

---

## 🧪 Tests

### E2E con Playwright

Archivo: `tests/rate-limit.spec.ts`

**Casos cubiertos:**
1. ✅ Permite 3 requests en 1 minuto
2. ✅ Bloquea el 4to request con 429
3. ✅ Resetea después de 1 minuto
4. ✅ Respuestas cacheadas consumen rate limit

### Correr los tests

```bash
# Levantar dev server
npm run dev

# En otra terminal
npx playwright test tests/rate-limit.spec.ts

# Ver reporte
npx playwright show-report
```

**NOTA:** El test 3 (`resetea después de 1 minuto`) toma 61 segundos.

---

## 🚀 Producción

### Vercel (Serverless)

**Limitación conocida:** El Map en memoria se resetea cuando:
- La función serverless se recicla (cold start)
- Hay múltiples instancias de la función (load balancing)

**Impacto:** Un usuario podría hacer >3 req/min si sus requests van a diferentes instancias.

**Es suficiente para MVP:** Sí. Previene la mayoría del abuso.

### Escalar en Fase 2

Si se requiere rate limiting más robusto:

**Opción 1: Vercel KV (Redis)**
```typescript
import { kv } from '@vercel/kv';

const key = `ratelimit:${ip}`;
const count = await kv.incr(key);
if (count === 1) await kv.expire(key, 60);
if (count > 3) return 429;
```

**Opción 2: Upstash Redis**
```typescript
import { Ratelimit } from '@upstash/ratelimit';
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(3, '60s'),
});
```

**Costo:** ~$0.20/mes (100k requests)

---

## 📋 Checklist

- [x] Implementado en `/api/insight/route.ts`
- [x] Headers de rate limit en todas las respuestas
- [x] 429 Too Many Requests cuando se excede
- [x] Cleanup automático de entradas viejas
- [x] Tests E2E con Playwright
- [x] TypeScript sin errores
- [x] Build exitoso
- [x] Documentación creada
- [x] Marcado como completado en BACKLOG.md

---

## 🔍 Debugging

### Ver requests en producción

```bash
# Desde Vercel dashboard → Functions → /api/insight
# Ver logs en tiempo real
```

### Simular rate limit en local

```bash
# Terminal 1: levantar servidor
npm run dev

# Terminal 2: hacer 4 requests rápidos
for i in {1..4}; do
  curl -X POST http://localhost:3000/api/insight \
    -H "Content-Type: application/json" \
    -d '{
      "role": "frontend",
      "seniority": "senior",
      "location": "chile_local",
      "p25": 2200000,
      "p50": 2800000,
      "p75": 3800000,
      "currency": "CLP"
    }'
  echo "\n---"
done
```

El 4to debe retornar 429.

---

## 🎉 Estado

**Rate limiting está ACTIVO y FUNCIONANDO.**

Protege la API de Claude contra abuso mientras permite uso normal sin fricción.
