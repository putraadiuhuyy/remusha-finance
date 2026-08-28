-- ==============================================================================
-- REMUSHA FINANCE: Skrip Pembuatan Tabel Database Supabase
-- Tabel Transaksi Kas Masjid (Sesuai Format Spreadsheet Google Sheets)
-- ==============================================================================

-- 1. Buat Tabel Transactions jika belum ada
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

-- 2. Index untuk mengoptimalkan urutan tanggal terlama di atas (ASC)
CREATE INDEX IF NOT EXISTS idx_transactions_tanggal_asc ON transactions (tanggal ASC, id ASC);

-- 3. Setup Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Izinkan publik untuk membaca data (SELECT)
DROP POLICY IF EXISTS "Allow public select" ON transactions;
CREATE POLICY "Allow public select" 
ON transactions FOR SELECT 
USING (true);

-- Izinkan publik untuk menambah data (INSERT)
DROP POLICY IF EXISTS "Allow public insert" ON transactions;
CREATE POLICY "Allow public insert" 
ON transactions FOR INSERT 
WITH CHECK (true);

-- Izinkan publik untuk mengubah data (UPDATE)
DROP POLICY IF EXISTS "Allow public update" ON transactions;
CREATE POLICY "Allow public update" 
ON transactions FOR UPDATE 
USING (true);

-- Izinkan publik untuk menghapus data (DELETE)
DROP POLICY IF EXISTS "Allow public delete" ON transactions;
CREATE POLICY "Allow public delete" 
ON transactions FOR DELETE 
USING (true);

-- 4. (Opsional) Masukkan Data Awal Uji Coba Sesuai Urutan Tanggal
INSERT INTO transactions (tanggal, keterangan, pemasukan, pengeluaran, saldo, pj)
VALUES 
  ('2024-01-05', 'Saldo Awal Tahun & Infaq Kotak Utama', 5000000, 0, 5000000, 'Ust. Ahmad'),
  ('2024-01-12', 'Operasional Listrik & Air Masjid', 0, 750000, 4250000, 'H. Syarif'),
  ('2024-01-19', 'Infaq Jumat Berkah', 3200000, 0, 7450000, 'Ust. Ahmad'),
  ('2024-01-26', 'Honor Kebersihan & Marbot', 0, 1500000, 5950000, 'H. Syarif')
ON CONFLICT DO NOTHING;
