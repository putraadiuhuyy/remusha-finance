import React from 'react';
import { ShieldCheck, HeartHandshake, BookOpen, ChevronRight, TrendingUp } from 'lucide-react';

interface BerandaViewProps {
  onNavigateToRekap: () => void;
}

export const BerandaView: React.FC<BerandaViewProps> = ({ onNavigateToRekap }) => {
  return (
    <div id="beranda-view" className="space-y-12 animate-fade-in pb-12">
      {/* Hero Section */}
      <div className="relative bg-[#006948] overflow-hidden rounded-3xl mt-4">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 px-6 py-16 md:py-24 md:px-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-4 py-1.5 rounded-full text-sm font-semibold text-emerald-50 backdrop-blur-md mb-6 border border-white/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Portal Keuangan Masjid Terbuka</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-3xl leading-tight">
            Transparansi Kas Masjid Untuk Kepercayaan Umat
          </h1>
          
          <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-medium">
            Platform modern pengelolaan keuangan REMUSHA. Membangun kepercayaan melalui laporan keuangan yang terbuka, akurat, dan dapat diakses oleh seluruh jamaah kapan saja.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onNavigateToRekap}
              className="bg-white text-[#006948] hover:bg-emerald-50 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg shadow-black/10 inline-flex items-center justify-center gap-2"
            >
              <span>Lihat Transparansi Kas</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-[#e1e3e4] shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-emerald-100 text-[#006948] rounded-2xl flex items-center justify-center mb-6">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-[#191c1d] mb-3">Pencatatan Rapi</h3>
          <p className="text-[#585f6c] leading-relaxed text-sm">
            Setiap infaq, sedekah, dan pengeluaran dicatat secara rinci dan terstruktur untuk memudahkan pelacakan arus kas.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#e1e3e4] shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-[#191c1d] mb-3">Laporan Real-time</h3>
          <p className="text-[#585f6c] leading-relaxed text-sm">
            Data keuangan selalu terbarui dan dapat diakses langsung oleh jamaah melalui portal ini dari mana saja.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#e1e3e4] shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-6">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-[#191c1d] mb-3">Akuntabel & Amanah</h3>
          <p className="text-[#585f6c] leading-relaxed text-sm">
            Membangun kepercayaan jamaah dengan sistem tata kelola keuangan yang transparan, dapat dipertanggungjawabkan dan diaudit.
          </p>
        </div>
      </div>

      {/* About/CTA Section */}
      <div className="bg-[#f8f9fa] border border-[#e1e3e4] p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold text-[#191c1d] mb-4">Amanah Dari Jamaah, Untuk Umat</h2>
          <p className="text-[#585f6c] leading-relaxed text-sm">
            Sistem ini disiapkan untuk mempermudah operasional kepengurusan di masa depan (2027 dan seterusnya). Kami berkomitmen menjaga seluruh amanah dari para donatur dan jamaah demi kemakmuran masjid.
          </p>
        </div>
        <div className="shrink-0">
          <button
            onClick={onNavigateToRekap}
            className="bg-[#191c1d] text-white hover:bg-[#3d4a42] px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 inline-flex items-center gap-2"
          >
            Buka Rekap Keuangan
          </button>
        </div>
      </div>
    </div>
  );
};
