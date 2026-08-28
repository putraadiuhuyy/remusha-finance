import { YearFinancialData, Transaction } from '../types';

export const financialData2024: YearFinancialData = {
  year: 2024,
  totalPemasukan: 125450000,
  growthPemasukan: '+12% dari 2023',
  totalPengeluaran: 84200000,
  growthPengeluaran: '-5% dari 2023',
  saldoKumulatif: 41250000,
  months: [
    {
      month: 'Januari',
      shortMonth: 'Jan',
      monthIndex: 1,
      pemasukan: 8500000,
      pengeluaran: 5200000,
      surplus: 3300000,
      saldoKumulatif: 3300000,
      pemasukanDetails: [
        { id: 'in-1', category: 'Infaq Kotak Jumat', amount: 5200000, description: 'Perolehan 4 kali shalat Jumat', date: '2024-01-26' },
        { id: 'in-2', category: 'Donasi Transfer / QRIS', amount: 2300000, description: 'Infaq jamaah via rekening BSI', date: '2024-01-20' },
        { id: 'in-3', category: 'Zakat & Sedekah Subuh', amount: 1000000, description: 'Kotak sedekah subuh harian', date: '2024-01-31' },
      ],
      pengeluaranDetails: [
        { id: 'out-1', category: 'Operasional Listrik & Air', amount: 1800000, description: 'Tagihan PLN & PDAM Masjid', date: '2024-01-10' },
        { id: 'out-2', category: 'Honor Marbot & Imam Rawatib', amount: 2500000, description: 'Kafalah bulanan petugas masjid', date: '2024-01-25' },
        { id: 'out-3', category: 'Kebersihan & Sanitasi', amount: 900000, description: 'Pembelian sabun, pewangi karpet & alat', date: '2024-01-15' },
      ]
    },
    {
      month: 'Februari',
      shortMonth: 'Feb',
      monthIndex: 2,
      pemasukan: 12000000,
      pengeluaran: 4500000,
      surplus: 7500000,
      saldoKumulatif: 10800000,
      pemasukanDetails: [
        { id: 'in-4', category: 'Infaq Kotak Jumat', amount: 6400000, description: 'Perolehan 4 kali shalat Jumat', date: '2024-02-23' },
        { id: 'in-5', category: 'Wakaf Pembebasan Tanah Parkir', amount: 4000000, description: 'Hamba Allah (Transfer)', date: '2024-02-12' },
        { id: 'in-6', category: 'Donasi Kajian Rutin', amount: 1600000, description: 'Kajian Ahad Pagi', date: '2024-02-18' },
      ],
      pengeluaranDetails: [
        { id: 'out-4', category: 'Operasional Listrik & Air', amount: 1650000, description: 'Tagihan PLN & PDAM Masjid', date: '2024-02-09' },
        { id: 'out-5', category: 'Honor Marbot & Imam Rawatib', amount: 2500000, description: 'Kafalah bulanan petugas masjid', date: '2024-02-25' },
        { id: 'out-6', category: 'Konsumsi Kajian Akbar', amount: 350000, description: 'Snack & air mineral jamaah', date: '2024-02-18' },
      ]
    },
    {
      month: 'Maret',
      shortMonth: 'Mar',
      monthIndex: 3,
      pemasukan: 7500000,
      pengeluaran: 6800000,
      surplus: 700000,
      saldoKumulatif: 11500000,
      pemasukanDetails: [
        { id: 'in-7', category: 'Infaq Kotak Jumat', amount: 4800000, description: 'Perolehan 5 kali shalat Jumat', date: '2024-03-29' },
        { id: 'in-8', category: 'Infaq Sambut Ramadhan', amount: 2700000, description: 'Persiapan semarak Ramadhan 1445H', date: '2024-03-10' },
      ],
      pengeluaranDetails: [
        { id: 'out-7', category: 'Persiapan Ramadhan & Cat Ulang', amount: 2500000, description: 'Pengecatan teras & perbaikan sound system', date: '2024-03-05' },
        { id: 'out-8', category: 'Honor Marbot & Petugas', amount: 2500000, description: 'Kafalah bulanan', date: '2024-03-25' },
        { id: 'out-9', category: 'Operasional Listrik & Kebersihan', amount: 1800000, description: 'Tagihan utilitas & cuci karpet', date: '2024-03-12' },
      ]
    },
    {
      month: 'April',
      shortMonth: 'Apr',
      monthIndex: 4,
      pemasukan: 15200000,
      pengeluaran: 8900000,
      surplus: 6300000,
      saldoKumulatif: 17800000,
      pemasukanDetails: [
        { id: 'in-10', category: 'Zakat Fitrah & Mal Ramadhan', amount: 6500000, description: 'Penerimaan ZIS Ramadhan 1445H', date: '2024-04-08' },
        { id: 'in-11', category: 'Infaq Buka Puasa Bersama (Ifthar)', amount: 4200000, description: 'Donasi takjil harian dari jamaah', date: '2024-04-05' },
        { id: 'in-12', category: 'Infaq Shalat Idul Fitri & Kotak Jumat', amount: 4500000, description: 'Perolehan shalat Ied & Jumat', date: '2024-04-10' },
      ],
      pengeluaranDetails: [
        { id: 'out-10', category: 'Penyaluran Santunan Yatim & Dhuafa', amount: 3500000, description: 'Paket sembako & santunan lebaran', date: '2024-04-07' },
        { id: 'out-11', category: 'Penyediaan Ifthar & Takjil Ramadhan', amount: 2400000, description: 'Konsumsi buka bersama 30 hari', date: '2024-04-09' },
        { id: 'out-12', category: 'Honor Imam Tarawih & Marbot', amount: 3000000, description: 'Kafalah Ramadhan & lebaran', date: '2024-04-12' },
      ]
    },
    {
      month: 'Mei',
      shortMonth: 'Mei',
      monthIndex: 5,
      pemasukan: 6000000,
      pengeluaran: 3500000,
      surplus: 2500000,
      saldoKumulatif: 20300000,
      pemasukanDetails: [
        { id: 'in-13', category: 'Infaq Kotak Jumat', amount: 4300000, description: 'Perolehan 4 kali shalat Jumat', date: '2024-05-24' },
        { id: 'in-14', category: 'Infaq Majelis Taklim Ibu-Ibu', amount: 1700000, description: 'Pengajian pekanan muslimah', date: '2024-05-19' },
      ],
      pengeluaranDetails: [
        { id: 'out-13', category: 'Operasional Listrik & Air', amount: 1000000, description: 'Tagihan PLN pasca Ramadhan', date: '2024-05-08' },
        { id: 'out-14', category: 'Honor Marbot & Imam', amount: 2500000, description: 'Kafalah bulanan', date: '2024-05-25' },
      ]
    },
    {
      month: 'Juni',
      shortMonth: 'Jun',
      monthIndex: 6,
      pemasukan: 10400000,
      pengeluaran: 7800000,
      surplus: 2600000,
      saldoKumulatif: 22900000,
      pemasukanDetails: [
        { id: 'in-15', category: 'Infaq Shalat Idul Adha & Kotak Jumat', amount: 6200000, description: 'Perolehan Qurban & Shalat Jumat', date: '2024-06-17' },
        { id: 'in-16', category: 'Donasi Operasional Qurban', amount: 4200000, description: 'Biaya kebersihan & operasional panitia', date: '2024-06-16' },
      ],
      pengeluaranDetails: [
        { id: 'out-15', category: 'Operasional Qurban & Plastik Ramah Lingkungan', amount: 3800000, description: 'Konsumsi relawan & perlengkapan', date: '2024-06-18' },
        { id: 'out-16', category: 'Honor Marbot & Petugas', amount: 2500000, description: 'Kafalah bulanan', date: '2024-06-25' },
        { id: 'out-17', category: 'Listrik & Air', amount: 1500000, description: 'Tagihan utilitas', date: '2024-06-10' },
      ]
    },
    {
      month: 'Juli',
      shortMonth: 'Jul',
      monthIndex: 7,
      pemasukan: 9800000,
      pengeluaran: 6200000,
      surplus: 3600000,
      saldoKumulatif: 26500000,
      pemasukanDetails: [
        { id: 'in-17', category: 'Infaq Kotak Jumat', amount: 5600000, description: 'Perolehan 4 kali shalat Jumat', date: '2024-07-26' },
        { id: 'in-18', category: 'Pemberdayaan Santri TPQ', amount: 4200000, description: 'Iuran santri & donatur TPQ', date: '2024-07-15' },
      ],
      pengeluaranDetails: [
        { id: 'out-18', category: 'Insentif Guru Ngaji TPQ', amount: 2200000, description: 'Honor 4 ustadz/ustadzah', date: '2024-07-20' },
        { id: 'out-19', category: 'Honor Marbot & Petugas', amount: 2500000, description: 'Kafalah bulanan', date: '2024-07-25' },
        { id: 'out-20', category: 'Utilitas & Perlengkapan Belajar', amount: 1500000, description: 'Buku iqro, spidol & listrik', date: '2024-07-12' },
      ]
    },
    {
      month: 'Agustus',
      shortMonth: 'Agt',
      monthIndex: 8,
      pemasukan: 8650000,
      pengeluaran: 7650000,
      surplus: 1000000,
      saldoKumulatif: 27500000,
      pemasukanDetails: [
        { id: 'in-19', category: 'Infaq Kotak Jumat', amount: 5150000, description: 'Perolehan 5 kali shalat Jumat', date: '2024-08-30' },
        { id: 'in-20', category: 'Infaq Gebyar Kemerdekaan Masjid', amount: 3500000, description: 'Lomba islami santri TPQ', date: '2024-08-16' },
      ],
      pengeluaranDetails: [
        { id: 'out-21', category: 'Hadiah & Konsumsi Semarak 17 Agustus', amount: 3450000, description: 'Hadiah lomba adzan & hafalan Quran', date: '2024-08-17' },
        { id: 'out-22', category: 'Honor Marbot & Listrik', amount: 4200000, description: 'Kafalah & tagihan PLN', date: '2024-08-25' },
      ]
    },
    {
      month: 'September',
      shortMonth: 'Sep',
      monthIndex: 9,
      pemasukan: 12300000,
      pengeluaran: 4800000,
      surplus: 7500000,
      saldoKumulatif: 35000000,
      pemasukanDetails: [
        { id: 'in-21', category: 'Infaq Peringatan Maulid Nabi', amount: 6800000, description: 'Donasi peringatan Maulid Nabi SAW', date: '2024-09-14' },
        { id: 'in-22', category: 'Infaq Kotak Jumat & Transfer', amount: 5500000, description: 'Perolehan 4 kali shalat Jumat', date: '2024-09-27' },
      ],
      pengeluaranDetails: [
        { id: 'out-23', category: 'Penyelenggaraan Tabligh Akbar Maulid', amount: 2300000, description: 'Penceramah, sound & snack', date: '2024-09-16' },
        { id: 'out-24', category: 'Honor Marbot & Operasional', amount: 2500000, description: 'Kafalah bulanan', date: '2024-09-25' },
      ]
    },
    {
      month: 'Oktober',
      shortMonth: 'Okt',
      monthIndex: 10,
      pemasukan: 7800000,
      pengeluaran: 6500000,
      surplus: 1300000,
      saldoKumulatif: 36300000,
      pemasukanDetails: [
        { id: 'in-23', category: 'Infaq Kotak Jumat', amount: 5300000, description: 'Perolehan 4 kali shalat Jumat', date: '2024-10-25' },
        { id: 'in-24', category: 'Donasi Parkir & Kas Mandiri', amount: 2500000, description: 'Kotak sedekah harian', date: '2024-10-31' },
      ],
      pengeluaranDetails: [
        { id: 'out-25', category: 'Perbaikan Kanopi & Genteng Bocor', amount: 2300000, description: 'Tukang & material penambal bocor', date: '2024-10-18' },
        { id: 'out-26', category: 'Honor Marbot & Operasional Listrik', amount: 4200000, description: 'Kafalah & utilitas', date: '2024-10-25' },
      ]
    },
    {
      month: 'November',
      shortMonth: 'Nov',
      monthIndex: 11,
      pemasukan: 10500000,
      pengeluaran: 9800000,
      surplus: 700000,
      saldoKumulatif: 35000000,
      pemasukanDetails: [
        { id: 'in-25', category: 'Infaq Kotak Jumat', amount: 5800000, description: 'Perolehan 5 kali shalat Jumat', date: '2024-11-29' },
        { id: 'in-26', category: 'Donasi Pengadaan Karpet Baru', amount: 4700000, description: 'Hamba Allah & jamaah subuh', date: '2024-11-15' },
      ],
      pengeluaranDetails: [
        { id: 'out-27', category: 'Uang Muka Karpet Shaf Utama', amount: 5500000, description: 'DP karpet tebal 14mm', date: '2024-11-18' },
        { id: 'out-28', category: 'Honor Marbot & Operasional', amount: 4300000, description: 'Kafalah & pemeliharaan AC', date: '2024-11-25' },
      ]
    },
    {
      month: 'Desember',
      shortMonth: 'Des',
      monthIndex: 12,
      pemasukan: 14800000,
      pengeluaran: 8550000,
      surplus: 6250000,
      saldoKumulatif: 41250000,
      pemasukanDetails: [
        { id: 'in-27', category: 'Infaq Kotak Jumat & Akhir Tahun', amount: 7800000, description: 'Perolehan 4 kali shalat Jumat', date: '2024-12-27' },
        { id: 'in-28', category: 'Donasi Mabit & Muhasabah Tahun Baru', amount: 4500000, description: 'Donatur konsumsi mabit santri & pemuda', date: '2024-12-28' },
        { id: 'in-29', category: 'Zakat Penghasilan Akhir Tahun', amount: 2500000, description: 'Jamaah warga sekitar', date: '2024-12-30' },
      ],
      pengeluaranDetails: [
        { id: 'out-29', category: 'Pelunasan Karpet & Sound Mixer', amount: 4150000, description: 'Pelunasan karpet & mic nirkabel', date: '2024-12-20' },
        { id: 'out-30', category: 'Konsumsi Mabit & Kajian Akhir Tahun', amount: 1900000, description: 'Makan malam & sarapan 120 jamaah', date: '2024-12-31' },
        { id: 'out-31', category: 'Honor Marbot & Utilitas Listrik/Air', amount: 2500000, description: 'Kafalah & tagihan listrik', date: '2024-12-25' },
      ]
    }
  ]
};

export const financialData2023: YearFinancialData = {
  year: 2023,
  totalPemasukan: 112000000,
  growthPemasukan: '+8% dari 2022',
  totalPengeluaran: 88600000,
  growthPengeluaran: '+4% dari 2022',
  saldoKumulatif: 23400000,
  months: [
    { month: 'Januari', shortMonth: 'Jan', monthIndex: 1, pemasukan: 7200000, pengeluaran: 5800000, surplus: 1400000, saldoKumulatif: 1400000 },
    { month: 'Februari', shortMonth: 'Feb', monthIndex: 2, pemasukan: 8100000, pengeluaran: 6200000, surplus: 1900000, saldoKumulatif: 3300000 },
    { month: 'Maret', shortMonth: 'Mar', monthIndex: 3, pemasukan: 13500000, pengeluaran: 8900000, surplus: 4600000, saldoKumulatif: 7900000 },
    { month: 'April', shortMonth: 'Apr', monthIndex: 4, pemasukan: 16800000, pengeluaran: 11200000, surplus: 5600000, saldoKumulatif: 13500000 },
    { month: 'Mei', shortMonth: 'Mei', monthIndex: 5, pemasukan: 6800000, pengeluaran: 5400000, surplus: 1400000, saldoKumulatif: 14900000 },
    { month: 'Juni', shortMonth: 'Jun', monthIndex: 6, pemasukan: 9200000, pengeluaran: 7800000, surplus: 1400000, saldoKumulatif: 16300000 },
    { month: 'Juli', shortMonth: 'Jul', monthIndex: 7, pemasukan: 8500000, pengeluaran: 6900000, surplus: 1600000, saldoKumulatif: 17900000 },
    { month: 'Agustus', shortMonth: 'Agt', monthIndex: 8, pemasukan: 7900000, pengeluaran: 7100000, surplus: 800000, saldoKumulatif: 18700000 },
    { month: 'September', shortMonth: 'Sep', monthIndex: 9, pemasukan: 8400000, pengeluaran: 6500000, surplus: 1900000, saldoKumulatif: 20600000 },
    { month: 'Oktober', shortMonth: 'Okt', monthIndex: 10, pemasukan: 7600000, pengeluaran: 6800000, surplus: 800000, saldoKumulatif: 21400000 },
    { month: 'November', shortMonth: 'Nov', monthIndex: 11, pemasukan: 8200000, pengeluaran: 7500000, surplus: 700000, saldoKumulatif: 22100000 },
    { month: 'Desember', shortMonth: 'Des', monthIndex: 12, pemasukan: 9800000, pengeluaran: 8500000, surplus: 1300000, saldoKumulatif: 23400000 },
  ]
};

export const sampleRecentTransactions: Transaction[] = [
  {
    id: 'TRX-2024-12-001',
    date: '2024-12-31',
    type: 'pengeluaran',
    category: 'Konsumsi & Kegiatan',
    amount: 1900000,
    sourceOrRecipient: 'Dapur Berkah Jamaah',
    description: 'Konsumsi Mabit & Muhasabah Akhir Tahun untuk 120 peserta',
    status: 'diverifikasi'
  },
  {
    id: 'TRX-2024-12-002',
    date: '2024-12-30',
    type: 'pemasukan',
    category: 'Zakat Mal',
    amount: 2500000,
    sourceOrRecipient: 'Hamba Allah (Transfer BSI)',
    description: 'Zakat Penghasilan Akhir Tahun 1446H',
    status: 'diverifikasi'
  },
  {
    id: 'TRX-2024-12-003',
    date: '2024-12-28',
    type: 'pemasukan',
    category: 'Infaq Program Khusus',
    amount: 4500000,
    sourceOrRecipient: 'Komunitas Pemuda Remusha',
    description: 'Donasi Mabit & Pembinaan Pemuda Masjid',
    status: 'diverifikasi'
  },
  {
    id: 'TRX-2024-12-004',
    date: '2024-12-27',
    type: 'pemasukan',
    category: 'Infaq Kotak Jumat',
    amount: 3200000,
    sourceOrRecipient: 'Kotak Infaq Shalat Jumat Pekan ke-4',
    description: 'Penghitungan terbuka disaksikan 3 saksi takmir',
    status: 'diverifikasi'
  },
  {
    id: 'TRX-2024-12-005',
    date: '2024-12-25',
    type: 'pengeluaran',
    category: 'Honor & Kafalah',
    amount: 2500000,
    sourceOrRecipient: 'Ustadz Ahmad & Tim Marbot',
    description: 'Kafalah bulanan Imam Rawatib, Muadzin, dan Kebersihan',
    status: 'diverifikasi'
  },
  {
    id: 'TRX-2024-12-006',
    date: '2024-12-20',
    type: 'pengeluaran',
    category: 'Pemeliharaan Fasilitas',
    amount: 4150000,
    sourceOrRecipient: 'CV Berkah Audio & Karpet',
    description: 'Pelunasan Karpet Shaf Depan dan 2 unit Mic Nirkabel',
    status: 'diverifikasi'
  }
];

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
