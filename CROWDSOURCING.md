# 🤝 Feature: Formulario de Crowdsourcing

**Fecha:** 2026-04-12  
**Estado:** ✅ Implementado y funcional

---

## 📋 Overview

Sistema de contribución anónima de datos salariales que permite a los usuarios ayudar a mejorar la precisión del benchmark compartiendo su información salarial.

---

## ✅ Componentes Implementados

### 1. CrowdsourcingForm Component
**Ubicación:** `components/CrowdsourcingForm.tsx`

**Features:**
- ✅ Diseño colapsable (cerrado por default)
- ✅ Formulario con validación
- ✅ Estados: idle, submitting, success, error
- ✅ Animaciones suaves
- ✅ Diseño dark/neón coherente
- ✅ 100% mobile responsive

**Campos:**
- **Sueldo** (requerido) - Número con formato según currency
- **Años de experiencia** (opcional) - 0-30 años
- **Tipo de empresa** (opcional) - Startup, Fintech, Corp, Agencia, Consultora, Otro

**Props:**
```typescript
interface CrowdsourcingFormProps {
  role: string;
  seniority: string;
  location: string;
  currency: 'CLP' | 'USD';
}
```

---

### 2. API Route: /api/submit-salary
**Ubicación:** `app/api/submit-salary/route.ts`

**Features:**
- ✅ Validación de datos requeridos
- ✅ Detección de outliers extremos
- ✅ Fingerprinting anónimo (IP + User Agent hashed)
- ✅ Prevención de duplicados (24h)
- ✅ Inserción en `salary_submissions` con status 'pending'
- ✅ Logging en `query_log` para analytics
- ✅ Manejo de errores robusto

**Validaciones:**
```typescript
// 1. Campos requeridos
if (!role || !seniority || !location || !salary || !currency)

// 2. Sueldo positivo
if (salary <= 0)

// 3. Outlier detection (±2.5 IQR)
if (salary < p25 - 2.5*IQR || salary > p75 + 2.5*IQR)

// 4. Duplicados recientes
if (exists submission with same fingerprint in last 24h)
```

**Fingerprint:**
```typescript
SHA256(IP + UserAgent) // Completamente anónimo
```

---

### 3. Integración en Página de Resultado
**Ubicación:** `app/calculadora/resultado/page.tsx`

**Posición:** Entre InsightCard y Disclaimer

**Flujo:**
```
Resultado
  ├─ Rango de mercado
  ├─ Insight IA
  ├─ 🆕 Formulario Crowdsourcing ← Aquí
  ├─ Disclaimer
  └─ CTAs
```

---

## 🎨 UX Design

### Estado Cerrado (Default)
```
┌─────────────────────────────────────────┐
│              🤝                         │
│  ¿Quieres mejorar estos datos?         │
│  Contribuye tu sueldo anónimamente...   │
│                                         │
│  [Contribuir mis datos →]               │
│                                         │
│  100% anónimo · Sin registro            │
└─────────────────────────────────────────┘
```

### Estado Abierto (Formulario)
```
┌─────────────────────────────────────────┐
│  Contribuye tus datos              ✕    │
│                                         │
│  Tu sueldo bruto mensual *              │
│  [$ 1500000              ]              │
│                                         │
│  Años de experiencia (opcional)         │
│  [5                      ]              │
│                                         │
│  Tipo de empresa (opcional)             │
│  [Fintech ▼             ]              │
│                                         │
│  ℹ️ 100% anónimo: No guardamos IP...   │
│                                         │
│  [Cancelar]  [Contribuir]               │
└─────────────────────────────────────────┘
```

### Estado Éxito
```
┌─────────────────────────────────────────┐
│              🎉                         │
│          ¡Gracias!                      │
│  Tu contribución ayudará a mejorar...   │
└─────────────────────────────────────────┘
```

---

## 🔒 Privacidad y Seguridad

### Datos Guardados
```sql
salary_submissions {
  id: UUID,
  role: string,
  seniority: string,
  location: string,
  salary: integer,
  currency: string,
  years_exp: integer | null,
  company_type: string | null,
  fingerprint: string (SHA256),  ← Hashed
  status: 'pending',
  created_at: timestamp
}
```

### NO Guardamos
- ❌ Dirección IP real
- ❌ Email
- ❌ Nombre
- ❌ Teléfono
- ❌ Ningún dato personal identificable

### Fingerprint
```typescript
// Ejemplo
IP: 192.168.1.1
UserAgent: Mozilla/5.0...
↓
SHA256("192.168.1.1-Mozilla/5.0...")
↓
Fingerprint: "a3f5c8d9e2b4..."  ← Solo esto se guarda
```

**Propósito:** Prevenir duplicados, NO identificar usuarios

---

## 🧪 Tests

**Ubicación:** `tests/crowdsourcing.spec.ts`

**Test Cases:**
1. ✅ Mostrar y abrir formulario
2. ✅ Validar campos requeridos
3. ✅ Completar y enviar formulario
4. ✅ Cerrar formulario (cancelar)

**Ejecutar:**
```bash
npm test tests/crowdsourcing.spec.ts
```

---

## 📊 Analytics

Cada submission exitosa también se registra en `query_log`:

```sql
INSERT INTO query_log {
  role: string,
  seniority: string,
  location: string,
  has_salary: true,
  result_percentile: null
}
```

**Métricas disponibles:**
- Total de contributions
- Contributions por rol
- Contributions por ubicación
- Contributions por día/semana

---

## 🚀 Flujo Completo

```
Usuario ve resultado
    ↓
Click "Contribuir mis datos"
    ↓
Formulario se expande
    ↓
Usuario llena datos
    ↓
Click "Contribuir"
    ↓
POST /api/submit-salary
    ↓
Validaciones:
  - Campos requeridos ✓
  - Sueldo > 0 ✓
  - No es outlier extremo ✓
  - No hay duplicado reciente ✓
    ↓
INSERT salary_submissions (status: pending)
    ↓
INSERT query_log
    ↓
Response 200 OK
    ↓
Mensaje "¡Gracias!"
    ↓
Auto-cerrar después de 3s
```

---

## 🔄 Próximos Pasos (Fase 2)

### Moderación
- [ ] Dashboard admin para revisar submissions
- [ ] Aprobar/rechazar contributions
- [ ] Actualizar benchmarks con datos aprobados

### Analytics
- [ ] Dashboard de contributions
- [ ] Gráficos de tendencias
- [ ] Detección automática de outliers

### Gamificación
- [ ] Badge "Contributor" para usuarios
- [ ] Acceso premium gratis por contribuir
- [ ] Leaderboard anónimo de contributions

---

## 📝 Código Relevante

### Crear Fingerprint
```typescript
import crypto from 'crypto';

function createFingerprint(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return crypto
    .createHash('sha256')
    .update(`${ip}-${userAgent}`)
    .digest('hex');
}
```

### Detectar Outliers
```typescript
function isOutlier(salary: number, p25: number, p75: number): boolean {
  const iqr = p75 - p25;
  const lower = p25 - 2.5 * iqr;
  const upper = p75 + 2.5 * iqr;
  return salary < lower || salary > upper;
}
```

### Prevenir Duplicados
```typescript
const { data: existing } = await supabase
  .from('salary_submissions')
  .select('id')
  .eq('fingerprint', fingerprint)
  .eq('role', role)
  .eq('seniority', seniority)
  .eq('location', location)
  .gte('created_at', last24Hours)
  .single();

if (existing) {
  return error('Ya contribuiste datos similares recientemente');
}
```

---

## ✅ Checklist de Implementación

- [x] Componente CrowdsourcingForm creado
- [x] API route /api/submit-salary creada
- [x] Integrado en página de resultado
- [x] Validación de campos
- [x] Detección de outliers
- [x] Fingerprinting anónimo
- [x] Prevención de duplicados
- [x] Estados de carga
- [x] Manejo de errores
- [x] Tests E2E
- [x] TypeScript sin errores
- [x] Build exitoso
- [x] Diseño responsive
- [x] Documentación completa

---

## 🎉 Feature Completado

El formulario de crowdsourcing está **100% funcional** y listo para producción.

**Beneficios:**
- 🤝 Usuarios contribuyen a mejorar datos
- 📊 Dataset crece orgánicamente
- 🔒 100% anónimo y seguro
- 🎨 Diseño coherente con el resto del sitio
- 🚀 Performance optimizado

**Próximo deploy:** Incluir en el siguiente push a producción.
