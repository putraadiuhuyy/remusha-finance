import React, { useState } from 'react';
import { Printer, FileText, Download, CheckCircle, Shield, Award, Sparkles } from 'lucide-react';
import { YearFinancialData } from '../types';
import { formatRupiah, formatNumberOnly } from '../data/financialData';

interface ReportsViewProps {
  data: YearFinancialData;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ data }) => {
  const [printStatus, setPrintStatus] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const quarters = [
    { name: 'Kuartal I (Jan - Mar)', income: 28000000, expense: 16500000, surplus: 11500000 },
    { name: 'Kuartal II (Apr - Jun)', income: 31600000, expense: 20200000, surplus: 11400000 },
    { name: 'Kuartal III (Jul - Sep)', income: 30750000, expense: 18650000, surplus: 12100000 },
    { name: 'Kuartal IV (Okt - Des)', income: 35100000, expense: 28850000, surplus: 6250000 },
  ];

  return (
    <div id="reports-view" className="space-y-6 animate-fade-in">
      {/* Header & Export Actions */}
      <div className="bg-white p-5 lg:p-6 rounded-2xl border border-[#e1e3e4] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#191c1d]">Laporan Keuangan & Akuntabilitas</h2>
          <p className="text-xs text-[#585f6c] mt-0.5">Laporan resmi pertanggungjawaban kas takmir masjid periode {data.year}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-[#006948] hover:bg-[#005137] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Official Audit Statement Card */}
      <div className="bg-[#f8f9fa] border-2 border-dashed border-[#bccac0] rounded-2xl p-6 relative">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#006948]/10 text-[#006948] rounded-2xl">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-base text-[#191c1d]">Pernyataan Transparansi & Akuntabilitas</h3>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                WTP (Wajar Tanpa Pengecualian)
              </span>
            </div>
            <p className="text-xs text-[#585f6c] leading-relaxed mb-3">
              Laporan keuangan ini disusun berdasarkan pembukuan kas riil harian dan telah diperiksa bersama oleh Dewan Kemakmuran Masjid (DKM), Badan Pengawas Keuangan Remusha, dan disahkan dalam musyawarah umum jamaah.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-[#3d4a42]">
              <div><strong>Ketua DKM:</strong> Ust. H. Muhammad Rasyid</div>
              <div><strong>Bendahara:</strong> Adi Pamungkas, S.E.</div>
              <div><strong>Tanggal Pengesahan:</strong> 31 Desember {data.year}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quarterly Performance Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#e1e3e4] shadow-xs">
        <h3 className="font-bold text-lg text-[#191c1d] mb-1">Kinerja Kuartalan {data.year}</h3>
        <p className="text-xs text-[#585f6c] mb-4">Evaluasi arus kas masuk, pengeluaran, dan surplus per triwulan</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quarters.map((q, idx) => (
            <div key={idx} className="p-4 bg-[#f8f9fa] rounded-xl border border-[#edeeef]">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-[#191c1d]">{q.name}</span>
                <span className="text-xs font-semibold text-[#006948] bg-emerald-50 px-2 py-0.5 rounded">
                  Surplus +{formatNumberOnly(q.surplus)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#e1e3e4]">
                <div>
                  <span className="text-[#585f6c] block">Penerimaan:</span>
                  <span className="font-semibold text-[#006948]">{formatRupiah(q.income)}</span>
                </div>
                <div>
                  <span className="text-[#585f6c] block">Pengeluaran:</span>
                  <span className="font-semibold text-[#ba1a1a]">{formatRupiah(q.expense)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
