import { YearFinancialData, Transaction } from '../types';

const emptyMonths = [
  { month: 'Januari', shortMonth: 'Jan', monthIndex: 1, pemasukan: 0, pengeluaran: 0, surplus: 0, saldoKumulatif: 0, pemasukanDetails: [], pengeluaranDetails: [] },
  { month: 'Februari', shortMonth: 'Feb', monthIndex: 2, pemasukan: 0, pengeluaran: 0, surplus: 0, saldoKumulatif: 0, pemasukanDetails: [], pengeluaranDetails: [] },
  { month: 'Maret', shortMonth: 'Mar', monthIndex: 3, pemasukan: 0, pengeluaran: 0, surplus: 0, saldoKumulatif: 0, pemasukanDetails: [], pengeluaranDetails: [] },
  { month: 'April', shortMonth: 'Apr', monthIndex: 4, pemasukan: 0, pengeluaran: 0, surplus: 0, saldoKumulatif: 0, pemasukanDetails: [], pengeluaranDetails: [] },
  { month: 'Mei', shortMonth: 'Mei', monthIndex: 5, pemasukan: 0, pengeluaran: 0, surplus: 0, saldoKumulatif: 0, pemasukanDetails: [], pengeluaranDetails: [] },
  { month: 'Juni', shortMonth: 'Jun', monthIndex: 6, pemasukan: 0, pengeluaran: 0, surplus: 0, saldoKumulatif: 0, pemasukanDetails: [], pengeluaranDetails: [] },
  { month: 'Juli', shortMonth: 'Jul', monthIndex: 7, pemasukan: 0, pengeluaran: 0, surplus: 0, saldoKumulatif: 0, pemasukanDetails: [], pengeluaranDetails: [] },
  { month: 'Agustus', shortMonth: 'Agt', monthIndex: 8, pemasukan: 0, pengeluaran: 0, surplus: 0, saldoKumulatif: 0, pemasukanDetails: [], pengeluaranDetails: [] },
  { month: 'September', shortMonth: 'Sep', monthIndex: 9, pemasukan: 0, pengeluaran: 0, surplus: 0, saldoKumulatif: 0, pemasukanDetails: [], pengeluaranDetails: [] },
  { month: 'Oktober', shortMonth: 'Okt', monthIndex: 10, pemasukan: 0, pengeluaran: 0, surplus: 0, saldoKumulatif: 0, pemasukanDetails: [], pengeluaranDetails: [] },
  { month: 'November', shortMonth: 'Nov', monthIndex: 11, pemasukan: 0, pengeluaran: 0, surplus: 0, saldoKumulatif: 0, pemasukanDetails: [], pengeluaranDetails: [] },
  { month: 'Desember', shortMonth: 'Des', monthIndex: 12, pemasukan: 0, pengeluaran: 0, surplus: 0, saldoKumulatif: 0, pemasukanDetails: [], pengeluaranDetails: [] },
];

export const financialData2027: YearFinancialData = {
  year: 2027,
  totalPemasukan: 0,
  growthPemasukan: '0% dari 2026',
  totalPengeluaran: 0,
  growthPengeluaran: '0% dari 2026',
  saldoKumulatif: 0,
  months: JSON.parse(JSON.stringify(emptyMonths))
};

export const financialData2026: YearFinancialData = {
  year: 2026,
  totalPemasukan: 0,
  growthPemasukan: '0% dari 2025',
  totalPengeluaran: 0,
  growthPengeluaran: '0% dari 2025',
  saldoKumulatif: 0,
  months: JSON.parse(JSON.stringify(emptyMonths))
};

export const sampleRecentTransactions: Transaction[] = [];

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('Rp', 'Rp ');
}

export function formatNumberOnly(amount: number): string {
  return new Intl.NumberFormat('id-ID').format(amount);
}
