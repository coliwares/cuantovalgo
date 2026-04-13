# 🚀 Guía de Configuración Supabase

## Estado actual
- ✅ URL configurada: `https://yrurznfquhacwypeoucu.supabase.co`
- ✅ Anon Key configurada
- ⏳ **Service Role Key pendiente**

---

## Paso 1: Obtener Service Role Key

### 1.1 Ir a la configuración de API

Abre esta URL en tu navegador:
```
https://supabase.com/dashboard/project/yrurznfquhacwypeoucu/settings/api
```

### 1.2 Copiar el Service Role Key

En la página, busca la sección **"Project API keys"** y encontrarás:

```
┌─────────────────────────────────────────┐
│ Project API keys                        │
├─────────────────────────────────────────┤
│                                         │
│ anon / public                           │
│ eyJhbGc... (ya configurada ✓)           │
│                                         │
│ service_role (secret)                   │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │  <-- ¡COPIA ESTA!
│ ⚠️ Esta key tiene ACCESO TOTAL          │
│                                         │
└─────────────────────────────────────────┘
```

**IMPORTANTE:** 
- ⚠️ Esta key es SECRETA y tiene acceso administrativo
- 🔒 NUNCA la expongas al cliente
- 📝 Solo se usa en el servidor (scripts, API routes)

### 1.3 Actualizar .env.local

Abre el archivo `.env.local` y reemplaza la línea:

```env
# Antes:
SUPABASE_SERVICE_KEY=tu_service_key_aqui

# Después:
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [tu key completa aquí]
```

La key es MUY larga (varios cientos de caracteres), cópiala completa.

---

## Paso 2: Crear las tablas

### 2.1 Ir al SQL Editor

Abre:
```
https://supabase.com/dashboard/project/yrurznfquhacwypeoucu/sql/new
```

### 2.2 Copiar el SQL

Abre el archivo `scripts/create-tables.sql` y copia TODO su contenido.

O usa este atajo:

```bash
# En tu terminal:
cat scripts/create-tables.sql
```

### 2.3 Ejecutar el SQL

1. Pega el SQL en el editor de Supabase
2. Click en **"Run"** (esquina inferior derecha)
3. Deberías ver: ✅ Success. No rows returned

Esto crea 3 tablas:
- `salary_benchmarks` (datos validados)
- `salary_submissions` (crowdsourcing)
- `query_log` (analytics)

---

## Paso 3: Verificar la conexión

Una vez configurado el Service Role Key:

```bash
npm run check-supabase
```

Deberías ver:
```
✓ URL configurada: https://yrurznfquhacwypeoucu.supabase.co
✓ Service key configurada

🔌 Verificando conexión...
✅ Conexión exitosa!
✅ Tabla salary_benchmarks existe
📊 La tabla está vacía
✨ Listo para cargar seed data!

Ejecuta: npm run seed
```

---

## Paso 4: Cargar seed data

```bash
npm run seed
```

Esto cargará 29 combinaciones de:
- 8 roles tech
- 4 niveles de seniority
- 3 ubicaciones (Chile local/remoto, LATAM)

Deberías ver:
```
🌱 Iniciando seed de datos...
🗑️ Limpiando datos existentes...
📥 Insertando 29 registros...
✅ Se insertaron 29 registros exitosamente
🎉 Seed completado!
```

---

## Verificación final

Revisa que los datos están cargados:

```bash
npm run check-supabase
```

Debería mostrar:
```
✅ Ya hay 29 registros en la tabla
```

También puedes ver los datos directamente en Supabase:
```
https://supabase.com/dashboard/project/yrurznfquhacwypeoucu/editor
```

Click en `salary_benchmarks` y deberías ver los 29 registros.

---

## ¿Problemas?

### Error: "La tabla no existe"
→ Ejecuta el SQL de `scripts/create-tables.sql` en el SQL Editor

### Error: "Service key inválida"
→ Verifica que copiaste la key completa (empieza con `eyJ`)

### Error: "Permisos insuficientes"
→ Asegúrate de usar la **service_role** key, NO la anon key

---

## Siguiente paso

Una vez completado, actualiza tu API route para leer desde Supabase:

1. Abre `app/api/salary-range/route.ts`
2. Descomenta el código de Supabase
3. Comenta/elimina la lectura del JSON local

¡Listo! Tu app ahora usa datos reales de Supabase 🎉
