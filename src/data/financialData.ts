import { YearFinancialData, Transaction, MonthlyRecord, WeeklyRecord } from '../types';

const MONTH_META: { month: string; shortMonth: string }[] = [
  { month: 'Januari', shortMonth: 'Jan' },
  { month: 'Februari', shortMonth: 'Feb' },
  { month: 'Maret', shortMonth: 'Mar' },
  { month: 'April', shortMonth: 'Apr' },
  { month: 'Mei', shortMonth: 'Mei' },
  { month: 'Juni', shortMonth: 'Jun' },
  { month: 'Juli', shortMonth: 'Jul' },
  { month: 'Agustus', shortMonth: 'Agt' },
  { month: 'September', shortMonth: 'Sep' },
  { month: 'Oktober', shortMonth: 'Okt' },
  { month: 'November', shortMonth: 'Nov' },
  { month: 'Desember', shortMonth: 'Des' },
];

// Membagi satu bulan menjadi blok mingguan 7 hari (1-7, 8-14, dst),
// minggu terakhir bisa lebih pendek mengikuti jumlah hari di bulan tersebut.
function buildWeeksForMonth(year: number, monthNumber: number, shortMonth: string): WeeklyRecord[] {
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const weeks: WeeklyRecord[] = [];
  let start = 1;
  let idx = 1;

  while (start <= daysInMonth) {
    const end = Math.min(start + 6, daysInMonth);
    weeks.push({
      weekIndex: idx,
      label: `Minggu ${idx}`,
      dateRange: start === end ? `${start} ${shortMonth}` : `${start}-${end} ${shortMonth}`,
      pemasukan: 0,
      pengeluaran: 0,
      surplus: 0,
      saldoKumulatif: 0,
      pemasukanDetails: [],
      pengeluaranDetails: []
    });
    start = end + 1;
    idx++;
  }

  return weeks;
}

function buildEmptyMonths(year: number): MonthlyRecord[] {
  return MONTH_META.map((meta, i) => {
    const monthNumber = i + 1;
    return {
      month: meta.month,
      shortMonth: meta.shortMonth,
      monthIndex: monthNumber,
      pemasukan: 0,
      pengeluaran: 0,
      surplus: 0,
      saldoKumulatif: 0,
      pemasukanDetails: [],
      pengeluaranDetails: [],
      weeks: buildWeeksForMonth(year, monthNumber, meta.shortMonth)
    };
  });
}

export const financialData2027: YearFinancialData = {
  year: 2027,
  totalPemasukan: 0,
  growthPemasukan: '0% dari 2026',
  totalPengeluaran: 0,
  growthPengeluaran: '0% dari 2026',
  saldoKumulatif: 0,
  months: buildEmptyMonths(2027)
};

export const financialData2026: YearFinancialData = {
  year: 2026,
  totalPemasukan: 0,
  growthPemasukan: '0% dari 2025',
  totalPengeluaran: 0,
  growthPengeluaran: '0% dari 2025',
  saldoKumulatif: 0,
  months: buildEmptyMonths(2026)
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