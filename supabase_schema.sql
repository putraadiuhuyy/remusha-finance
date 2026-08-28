-- ==============================================================================
-- REMUSHA FINANCE: Skrip Pembuatan Tabel Database Supabase
-- 1. Tabel Transaksi Kas Masjid (Format Google Sheets)
-- 2. Tabel Pengguna / Users (Autentikasi & Role Manajemen)
-- ==============================================================================

-- ==============================================================================
-- 1. TABEL PENGGUNA (USERS) UNTUK LOGIN
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer', -- 'admin', 'bendahara', 'viewer'
  role_label TEXT NOT NULL DEFAULT 'Anggota Remusha (Viewer)',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setup RLS untuk tabel users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select users" ON users;
CREATE POLICY "Allow public select users" 
ON users FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow public insert users" ON users;
CREATE POLICY "Allow public insert users" 
ON users FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update users" ON users;
CREATE POLICY "Allow public update users" 
ON users FOR UPDATE 
USING (true);

DROP POLICY IF EXISTS "Allow public delete users" ON users;
CREATE POLICY "Allow public delete users" 
ON users FOR DELETE 
USING (true);

-- Masukkan data akun awal ke database Supabase
INSERT INTO users (username, password, name, role, role_label)
VALUES 
  ('adminremusha', 'remusha0405', 'Putra Adi', 'admin', 'Administrator'),
  ('bendahara', 'remusha0405', 'Bendahara', 'bendahara', 'Bendahara'),
  ('viewer', 'viewer', 'Viewer', 'viewer', 'Viewer')
ON CONFLICT (username) DO UPDATE 
SET password = EXCLUDED.password, name = EXCLUDED.name, role = EXCLUDED.role, role_label = EXCLUDED.role_label;


-- ==============================================================================
-- 2. TABEL TRANSAKSI KAS (TRANSACTIONS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  tanggal DATE NOT NULL,
  keterangan TEXT NOT NULL,
  pemasukan NUMERIC(15, 2) DEFAULT 0,
  pengeluaran NUMERIC(15, 2) DEFAULT 0,
  saldo NUMERIC(15, 2) DEFAULT 0,
  pj TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk mengoptimalkan urutan tanggal terlama di atas (ASC)
CREATE INDEX IF NOT EXISTS idx_transactions_tanggal_asc ON transactions (tanggal ASC, id ASC);

-- Setup Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select" ON transactions;
CREATE POLICY "Allow public select" 
ON transactions FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow public insert" ON transactions;
CREATE POLICY "Allow public insert" 
ON transactions FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update" ON transactions;
CREATE POLICY "Allow public update" 
ON transactions FOR UPDATE 
USING (true);

DROP POLICY IF EXISTS "Allow public delete" ON transactions;
CREATE POLICY "Allow public delete" 
ON transactions FOR DELETE 
USING (true);

-- Data Awal Uji Coba Sesuai Urutan Tanggal
INSERT INTO transactions (tanggal, keterangan, pemasukan, pengeluaran, saldo, pj)
VALUES 
  ('2024-01-05', 'Saldo Awal Tahun & Infaq Kotak Utama', 5000000, 0, 5000000, 'Ust. Ahmad'),
  ('2024-01-12', 'Operasional Listrik & Air Masjid', 0, 750000, 4250000, 'H. Syarif'),
  ('2024-01-19', 'Infaq Jumat Berkah', 3200000, 0, 7450000, 'Ust. Ahmad'),
  ('2024-01-26', 'Honor Kebersihan & Marbot', 0, 1500000, 5950000, 'H. Syarif')
ON CONFLICT DO NOTHING;
