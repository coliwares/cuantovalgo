-- Script SQL para crear las tablas en Supabase
-- Ejecutar esto en el SQL Editor de Supabase

-- Dataset principal (seed manual + data validada)
CREATE TABLE IF NOT EXISTS salary_benchmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  seniority TEXT NOT NULL,
  location TEXT NOT NULL,
  p10 INTEGER,
  p25 INTEGER NOT NULL,
  p50 INTEGER NOT NULL,
  p75 INTEGER NOT NULL,
  p90 INTEGER,
  currency TEXT DEFAULT 'CLP',
  sample_size INTEGER DEFAULT 0,
  source TEXT DEFAULT 'seed',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role, seniority, location)
);

-- Submissions anónimas del crowdsourcing
CREATE TABLE IF NOT EXISTS salary_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  seniority TEXT NOT NULL,
  location TEXT NOT NULL,
  salary INTEGER NOT NULL,
  currency TEXT DEFAULT 'CLP',
  years_exp INTEGER,
  company_type TEXT,
  fingerprint TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Log de consultas (analytics anónimo)
CREATE TABLE IF NOT EXISTS query_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT,
  seniority TEXT,
  location TEXT,
  has_salary BOOLEAN,
  result_percentile INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE salary_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE query_log ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- salary_benchmarks: lectura pública, escritura solo service key
DROP POLICY IF EXISTS "public_read_benchmarks" ON salary_benchmarks;
CREATE POLICY "public_read_benchmarks" ON salary_benchmarks FOR SELECT USING (true);

-- salary_submissions: inserción pública, lectura solo service key
DROP POLICY IF EXISTS "public_insert_submissions" ON salary_submissions;
CREATE POLICY "public_insert_submissions" ON salary_submissions FOR INSERT WITH CHECK (true);

-- query_log: inserción pública
DROP POLICY IF EXISTS "public_insert_query_log" ON query_log;
CREATE POLICY "public_insert_query_log" ON query_log FOR INSERT WITH CHECK (true);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_benchmarks_role_seniority_location
  ON salary_benchmarks(role, seniority, location);

CREATE INDEX IF NOT EXISTS idx_submissions_status
  ON salary_submissions(status);

CREATE INDEX IF NOT EXISTS idx_query_log_created
  ON query_log(created_at DESC);
