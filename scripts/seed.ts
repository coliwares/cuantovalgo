/**
 * Script para cargar seed data a Supabase
 *
 * Uso:
 * 1. Configurar variables de entorno en .env.local
 * 2. Ejecutar: npx ts-node scripts/seed.ts
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

// Leer seed data
const seedDataPath = path.join(process.cwd(), 'data', 'seed-salaries.json');
const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey.includes('tu_')) {
  console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY');
  console.error('💡 Configúralas en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('🌱 Iniciando seed de datos...');

  try {
    // Verificar si la tabla existe
    const { data: existing, error: selectError } = await supabase
      .from('salary_benchmarks')
      .select('id')
      .limit(1);

    if (selectError) {
      console.error('❌ Error al verificar tabla:', selectError.message);
      console.log('💡 Asegúrate de que la tabla salary_benchmarks existe en Supabase');
      console.log('💡 Puedes crear las tablas usando el SQL en docs/ARCHITECTURE.md');
      process.exit(1);
    }

    // Limpiar datos existentes (opcional)
    console.log('🗑️  Limpiando datos existentes...');
    const { error: deleteError } = await supabase
      .from('salary_benchmarks')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.warn('⚠️  Warning al limpiar:', deleteError.message);
    }

    // Insertar seed data
    console.log(`📥 Insertando ${seedData.length} registros...`);

    const { data, error } = await supabase
      .from('salary_benchmarks')
      .insert(seedData)
      .select();

    if (error) {
      console.error('❌ Error al insertar datos:', error.message);
      process.exit(1);
    }

    console.log(`✅ Se insertaron ${data?.length || 0} registros exitosamente`);
    console.log('🎉 Seed completado!');
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
}

seed();
