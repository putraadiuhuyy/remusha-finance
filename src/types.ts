export interface FinancialDetailItem {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface MonthlyRecord {
  month: string;
  shortMonth: string;
  monthIndex: number;
  pemasukan: number;
  pengeluaran: number;
  surplus: number;
  saldoKumulatif: number;
  pemasukanDetails?: FinancialDetailItem[];
  pengeluaranDetails?: FinancialDetailItem[];
}

export interface YearFinancialData {
  year: number;
  totalPemasukan: number;
  growthPemasukan: string;
  totalPengeluaran: number;
  growthPengeluaran: string;
  saldoKumulatif: number;
  months: MonthlyRecord[];
}

export interface Transaction {
  id: string;
  date: string;
  type: 'pemasukan' | 'pengeluaran';
  category: string;
  amount: number;
  sourceOrRecipient: string;
  description: string;
  status: 'diverifikasi' | 'pending';
}

export interface SheetTransaction {
  id?: number | string;
  tanggal: string;
  keterangan: string;
  pemasukan: number;
  pengeluaran: number;
  saldo: number;
  pj: string;
  created_at?: string;
}

export type UserRole = 'admin' | 'bendahara' | 'viewer';

export interface AppUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  roleLabel: string;
  avatar?: string;
}

export type NavTab = 'beranda' | 'transaksi' | 'rekap' | 'pengaturan';
