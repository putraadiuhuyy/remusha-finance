import React from 'react';
import { ArrowDown, ArrowUp, Landmark, PiggyBank } from 'lucide-react';
import { YearFinancialData } from '../types';
import { formatRupiah } from '../data/financialData';

interface SummaryCardsProps {
  data: YearFinancialData;
  onCardClick?: (type: 'pemasukan' | 'pengeluaran' | 'saldo') => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ data, onCardClick }) => {
  return (
    <div id="summary-cards-container" className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
      {/* 1. Total Pemasukan */}
      <div 
        id="card-total-pemasukan"
        onClick={() => onCardClick?.('pemasukan')}
        className="bg-white p-5 lg:p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(5,150,105,0.08)] transition-all duration-300 border border-[#e1e3e4]/60 flex flex-col justify-between cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 bg-[#006948]/10 text-[#006948] rounded-xl group-hover:scale-105 transition-transform">
            <ArrowDown className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-semibold text-[#585f6c] bg-[#edeeef] px-2.5 py-1 rounded-full">
            {data.growthPemasukan}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-[#3d4a42] mb-1">Total Pemasukan</p>
          <h3 className="text-2xl lg:text-[28px] font-bold text-[#006948] tracking-tight">
            {formatRupiah(data.totalPemasukan)}
          </h3>
        </div>
      </div>

      {/* 2. Total Pengeluaran */}
      <div 
        id="card-total-pengeluaran"
        onClick={() => onCardClick?.('pengeluaran')}
        className="bg-white p-5 lg:p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(186,26,26,0.08)] transition-all duration-300 border border-[#e1e3e4]/60 flex flex-col justify-between cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 bg-[#ffdad6] text-[#ba1a1a] rounded-xl group-hover:scale-105 transition-transform">
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-semibold text-[#585f6c] bg-[#edeeef] px-2.5 py-1 rounded-full">
            {data.growthPengeluaran}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-[#3d4a42] mb-1">Total Pengeluaran</p>
          <h3 className="text-2xl lg:text-[28px] font-bold text-[#ba1a1a] tracking-tight">
            {formatRupiah(data.totalPengeluaran)}
          </h3>
        </div>
      </div>

      {/* 3. Saldo Akhir Kumulatif */}
      <div 
        id="card-saldo-kumulatif"
        onClick={() => onCardClick?.('saldo')}
        className="bg-[#006948] text-white p-5 lg:p-6 rounded-2xl shadow-[0_4px_16px_rgba(0,105,72,0.25)] flex flex-col justify-between relative overflow-hidden cursor-pointer group"
      >
        {/* Subtle Watermark Landmark Icon in Background */}
        <div className="absolute top-2 right-2 p-2 opacity-15 pointer-events-none transition-transform group-hover:scale-110 duration-300">
          <Landmark className="w-24 h-24 stroke-[1.2]" />
        </div>

        <div className="relative z-10 mb-4">
          <div className="p-2.5 bg-white/20 rounded-xl inline-block text-white backdrop-blur-xs">
            <PiggyBank className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm font-medium text-[#f5fff7]/90 mb-1">Saldo Akhir Kumulatif</p>
          <h3 className="text-2xl lg:text-[28px] font-bold text-white tracking-tight">
            {formatRupiah(data.saldoKumulatif)}
          </h3>
        </div>
      </div>
    </div>
  );
};
