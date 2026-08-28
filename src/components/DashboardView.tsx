import React from 'react';
import { 
  Building2, 
  Users, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  HeartHandshake, 
  CalendarCheck,
  ShieldCheck
} from 'lucide-react';
import { YearFinancialData } from '../types';
import { formatRupiah } from '../data/financialData';

interface DashboardViewProps {
  data: YearFinancialData;
  onNavigateToRekap: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ data, onNavigateToRekap }) => {
  const fundAllocations = [
    { name: 'Kas Operasional & Utilitas', amount: 18450000, target: 20000000, color: 'bg-emerald-500', desc: 'Listrik, air, kebersihan, honor marbot' },
    { name: 'Kas Santunan Yatim & Dhuafa', amount: 12800000, target: 15000000, color: 'bg-teal-500', desc: 'Penyaluran ZIS & sembako bulanan' },
    { name: 'Kas Pemeliharaan & Renovasi', amount: 7500000, target: 10000000, color: 'bg-blue-500', desc: 'Pengadaan karpet shaf & kanopi' },
    { name: 'Kas Pendidikan TPQ & Remaja', amount: 2500000, target: 5000000, color: 'bg-indigo-500', desc: 'Insentif guru ngaji & gebyar santri' },
  ];

  const upcomingEvents = [
    { title: 'Kajian Rutin Ahad Subuh', date: 'Ahad Ini, 05:30 WIB', speaker: 'Ustadz Hilman Fauzi', location: 'Ruang Utama Masjid' },
    { title: 'Penyaluran Santunan Yatim', date: 'Jumat Depan, 16:00 WIB', speaker: 'Tim Sosial Remusha', location: 'Teras Serbaguna' },
    { title: 'Kerja Bakti Bersih Kubah & Karpet', date: 'Ahad Depan, 07:00 WIB', speaker: 'Seluruh Jamaah & Remaja', location: 'Area Masjid' },
  ];

  return (
    <div id="dashboard-view" className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#006948] to-[#00855d] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Transparansi Kas Masjid Terverifikasi</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-2">
            Selamat Datang di Portal Keuangan REMUSHA
          </h2>
          <p className="text-sm text-emerald-100/90 leading-relaxed mb-4">
            Akses publik untuk memantau pengelolaan infaq, sedekah, zakat, dan operasional masjid secara akuntabel dan amanah.
          </p>
          <button
            onClick={onNavigateToRekap}
            className="bg-white text-[#006948] hover:bg-emerald-50 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm inline-flex items-center gap-1.5"
          >
            <span>Lihat Rekap Tahunan 2024</span>
            <TrendingUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e1e3e4] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#585f6c]">Total Kas Aktif</span>
            <Building2 className="w-4 h-4 text-[#006948]" />
          </div>
          <p className="text-xl font-bold text-[#191c1d]">{formatRupiah(data.saldoKumulatif)}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Surplus tahun berjalan</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e1e3e4] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#585f6c]">Total Penerimaan</span>
            <TrendingUp className="w-4 h-4 text-[#006948]" />
          </div>
          <p className="text-xl font-bold text-[#006948]">{formatRupiah(data.totalPemasukan)}</p>
          <span className="text-[11px] text-[#585f6c]">{data.growthPemasukan}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e1e3e4] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#585f6c]">Realisasi Pengeluaran</span>
            <Clock className="w-4 h-4 text-[#ba1a1a]" />
          </div>
          <p className="text-xl font-bold text-[#ba1a1a]">{formatRupiah(data.totalPengeluaran)}</p>
          <span className="text-[11px] text-[#585f6c]">{data.growthPengeluaran}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e1e3e4] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#585f6c]">Jamaah Aktif Infaq</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-[#191c1d]">450+ KK</p>
          <span className="text-[11px] text-[#585f6c]">Wilayah RW 01 - RW 06</span>
        </div>
      </div>

      {/* Fund Allocations & Mosque Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Fund Allocations */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#e1e3e4] shadow-xs">
          <h3 className="font-bold text-lg text-[#191c1d] mb-1">Pos Alokasi Dana Kas</h3>
          <p className="text-xs text-[#585f6c] mb-5">Distribusi saldo kas berdasarkan peruntukan amanah jamaah</p>

          <div className="space-y-4">
            {fundAllocations.map((fund, idx) => {
              const percent = Math.min(100, Math.round((fund.amount / data.saldoKumulatif) * 100));
              return (
                <div key={idx} className="p-3.5 bg-[#f8f9fa] rounded-xl border border-[#edeeef]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-[#191c1d]">{fund.name}</span>
                    <span className="font-bold text-sm text-[#006948]">{formatRupiah(fund.amount)}</span>
                  </div>
                  <p className="text-xs text-[#585f6c] mb-2.5">{fund.desc}</p>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-[#e1e3e4] h-2 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full ${fund.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#585f6c] mt-1">
                    <span>Porsi: {percent}% dari kas</span>
                    <span>Status: Aman & Tersedia</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mosque Agenda */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e1e3e4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#191c1d]">Agenda & Kegiatan</h3>
              <CalendarCheck className="w-5 h-5 text-[#006948]" />
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((evt, idx) => (
                <div key={idx} className="p-3.5 border border-[#e1e3e4] rounded-xl hover:bg-[#f8f9fa] transition-colors">
                  <span className="text-xs font-semibold text-[#006948] block mb-0.5">{evt.date}</span>
                  <h4 className="font-bold text-sm text-[#191c1d]">{evt.title}</h4>
                  <div className="flex items-center justify-between text-xs text-[#585f6c] mt-2">
                    <span>{evt.speaker}</span>
                    <span className="bg-[#f3f4f5] px-2 py-0.5 rounded text-[11px]">{evt.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#f8f9fa] rounded-xl border border-[#edeeef] text-xs text-[#585f6c]">
            💡 <strong className="text-[#191c1d]">Catatan Takmir:</strong> Laporan pertanggungjawaban fisik dan kuitansi dapat diakses di kantor sekretariat masjid setiap hari kerja.
          </div>
        </div>
      </div>
    </div>
  );
};
