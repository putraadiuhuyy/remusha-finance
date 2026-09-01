import React from 'react';
import { X, ArrowDown, ArrowUp, Calendar, CheckCircle2 } from 'lucide-react';
import { WeeklyRecord } from '../types';
import { formatRupiah } from '../data/financialData';

interface WeekDetailModalProps {
  week: WeeklyRecord | null;
  monthLabel: string;
  year: number;
  onClose: () => void;
}

export const WeekDetailModal: React.FC<WeekDetailModalProps> = ({ week, monthLabel, year, onClose }) => {
  if (!week) return null;

  return (
    <div
      id="week-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="week-detail-modal-content"
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e1e3e4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#e1e3e4] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#006948]/10 text-[#006948] rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#191c1d] leading-tight">
                Rincian Kas {week.label} — {monthLabel} {year}
              </h3>
              <p className="text-xs text-[#585f6c]">
                Laporan detail pemasukan dan pengeluaran {week.dateRange}
              </p>
            </div>
          </div>
          <button
            id="close-week-modal-btn"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Top 3 Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#edeeef]">
              <span className="text-xs font-medium text-[#585f6c] block mb-1">Pemasukan</span>
              <span className="text-lg font-bold text-[#006948] block">{formatRupiah(week.pemasukan)}</span>
            </div>
            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#edeeef]">
              <span className="text-xs font-medium text-[#585f6c] block mb-1">Pengeluaran</span>
              <span className="text-lg font-bold text-[#ba1a1a] block">{formatRupiah(week.pengeluaran)}</span>
            </div>
            <div className="bg-[#006948]/10 p-4 rounded-xl border border-[#006948]/20">
              <span className="text-xs font-medium text-[#006948] block mb-1">Surplus Bersih</span>
              <span className="text-lg font-bold text-[#006948] block">+{formatRupiah(week.surplus)}</span>
            </div>
          </div>

          {/* Breakdown Items: Pemasukan */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#006948]/10 text-[#006948] rounded-md">
                <ArrowDown className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#191c1d]">Rincian Pemasukan</h4>
            </div>

            <div className="bg-[#fcfdfd] border border-[#e1e3e4] rounded-xl divide-y divide-[#e1e3e4]/60 overflow-hidden">
              {week.pemasukanDetails && week.pemasukanDetails.length > 0 ? (
                week.pemasukanDetails.map((item) => (
                  <div key={item.id} className="p-3 sm:p-4 flex items-center justify-between gap-3 text-sm hover:bg-[#f8f9fa] transition-colors">
                    <div>
                      <p className="font-semibold text-[#191c1d]">{item.category}</p>
                      <p className="text-xs text-[#585f6c]">{item.description}</p>
                      <span className="text-[11px] text-gray-400 font-mono mt-0.5 inline-block">{item.date}</span>
                    </div>
                    <span className="font-bold text-[#006948] whitespace-nowrap">
                      +{formatRupiah(item.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-xs text-gray-500 text-center">
                  Total akumulasi penerimaan donasi minggu ini: {formatRupiah(week.pemasukan)}
                </div>
              )}
            </div>
          </div>

          {/* Breakdown Items: Pengeluaran */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-[#ffdad6] text-[#ba1a1a] rounded-md">
                <ArrowUp className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#191c1d]">Rincian Pengeluaran & Operasional</h4>
            </div>

            <div className="bg-[#fcfdfd] border border-[#e1e3e4] rounded-xl divide-y divide-[#e1e3e4]/60 overflow-hidden">
              {week.pengeluaranDetails && week.pengeluaranDetails.length > 0 ? (
                week.pengeluaranDetails.map((item) => (
                  <div key={item.id} className="p-3 sm:p-4 flex items-center justify-between gap-3 text-sm hover:bg-[#f8f9fa] transition-colors">
                    <div>
                      <p className="font-semibold text-[#191c1d]">{item.category}</p>
                      <p className="text-xs text-[#585f6c]">{item.description}</p>
                      <span className="text-[11px] text-gray-400 font-mono mt-0.5 inline-block">{item.date}</span>
                    </div>
                    <span className="font-bold text-[#ba1a1a] whitespace-nowrap">
                      -{formatRupiah(item.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-xs text-gray-500 text-center">
                  Total akumulasi beban operasional minggu ini: {formatRupiah(week.pengeluaran)}
                </div>
              )}
            </div>
          </div>

          {/* Cumulative Balance Highlight */}
          <div className="bg-[#edeeef] p-4 rounded-xl flex items-center justify-between border border-[#bccac0]/50">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#006948]" />
              <div>
                <span className="text-xs font-semibold text-[#191c1d] block">Saldo Kumulatif Kas Masjid</span>
                <span className="text-[11px] text-[#585f6c]">Posisi akhir per {week.dateRange}</span>
              </div>
            </div>
            <span className="text-base sm:text-lg font-extrabold text-[#191c1d]">
              {formatRupiah(week.saldoKumulatif)}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#f8f9fa] border-t border-[#e1e3e4] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold bg-[#006948] text-white hover:bg-[#005137] rounded-xl transition-colors shadow-xs"
          >
            Tutup Rincian
          </button>
        </div>
      </div>
    </div>
  );
};