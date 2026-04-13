/**
 * Script para verificar la conexión a Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Leer variables de entorno desde .env.local
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ Archivo .env.local no encontrado');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');

  for (const line of envLines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

console.log('🔍 Verificando configuración de Supabase...\n');

if (!supabaseUrl || supabaseUrl.includes('tu_')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL no está configurada');
  console.log('💡 Obtén la URL desde: https://supabase.com/dashboard/project/_/settings/api\n');
  process.exit(1);
}

if (!supabaseServiceKey || supabaseServiceKey.includes('tu_')) {
  console.error('❌ SUPABASE_SERVICE_KEY no está configurada');
  console.log('💡 Obtén la SERVICE KEY (no la anon key) desde:');
  console.log('   https://supabase.com/dashboard/project/_/settings/api');
  console.log('   Debe comenzar con "eyJ..." y es MUY LARGA\n');
  process.exit(1);
}

console.log('✓ URL configurada:', supabaseUrl);
console.log('✓ Service key configurada\n');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkConnection() {
  try {
    console.log('🔌 Verificando conexión...');

    // Intentar leer de salary_benchmarks
    const { data, error } = await supabase
      .from('salary_benchmarks')
      .select('id')
      .limit(1);

    if (error) {
      if (error.message.includes('does not exist')) {
        console.error('❌ La tabla "salary_benchmarks" NO existe');
        console.log('\n💡 Necesitas crear las tablas primero:');
        console.log('   1. Ve a: https://supabase.com/dashboard/project/_/sql/new');
        console.log('   2. Copia el contenido de: scripts/create-tables.sql');
        console.log('   3. Ejecuta el SQL');
        console.log('   4. Vuelve a ejecutar este script\n');
        process.exit(1);
      }

      throw error;
    }

    console.log('✅ Conexión exitosa!');
    console.log('✅ Tabla salary_benchmarks existe');

    // Verificar si ya hay datos
    const { count } = await supabase
      .from('salary_benchmarks')
      .select('*', { count: 'exact', head: true });

    if (count && count > 0) {
      console.log(`✅ Ya hay ${count} registros en la tabla\n`);
      console.log('¿Quieres reemplazarlos con el seed data?');
      console.log('Ejecuta: npm run seed\n');
    } else {
      console.log('📊 La tabla está vacía');
      console.log('✨ Listo para cargar seed data!');
      console.log('\nEjecuta: npm run seed\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkConnection();
