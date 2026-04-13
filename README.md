# Cuantovalgo.cl

Calculadora de valor de mercado salarial para profesionales tech en Chile/LATAM.

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Abrir http://localhost:3000
```

## Configuración

Copia `.env.example` a `.env.local` y configura:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_KEY=tu_service_key_aqui
ANTHROPIC_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Comandos

```bash
npm run dev          # Desarrollo local puerto 3000
npm run build        # Build producción
npm run typecheck    # Verificar tipos TypeScript
npm run lint         # Linter
npx playwright test  # E2E tests
```

## Estructura

```
cuantovalgo/
├── app/                 # Next.js App Router
│   ├── page.tsx        # Landing
│   ├── calculadora/    # Wizard + resultado
│   └── api/            # API routes
├── components/          # Componentes React
├── lib/                # Utilidades
├── types/              # TypeScript interfaces
├── data/               # Seed data
└── docs/               # Documentación del proyecto
```

## Docs

- Ver `CLAUDE.md` para reglas de código y convenciones
- Ver `docs/` para specs completas del producto

## Estado actual

✅ Setup base completado
✅ Form wizard funcional
✅ Página de resultado
✅ API routes básicas
⏳ Conexión Supabase pendiente
⏳ Claude API insights pendiente de configurar
⏳ Tests E2E pendientes

## Licencia

Privado - 2026
