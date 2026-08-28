import React, { useState } from 'react';
import { MonthlyRecord } from '../types';
import { formatRupiah } from '../data/financialData';

interface BarChartAreaProps {
  months: MonthlyRecord[];
  onSelectMonth: (month: MonthlyRecord) => void;
}

export const BarChartArea: React.FC<BarChartAreaProps> = ({ months, onSelectMonth }) => {
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyRecord | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Maximum value for scaling (16M gives room for 15.2M April)
  const maxScaleValue = 16000000;

  const handleMouseEnter = (month: MonthlyRecord, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredMonth(month);
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoveredMonth(null);
    setTooltipPos(null);
  };

  return (
    <div 
      id="chart-card-container"
      className="bg-white p-5 lg:p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#e1e3e4]/60 mb-6 relative"
    >
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-[#191c1d] tracking-tight">
            Pemasukan vs Pengeluaran
          </h3>
          <p className="text-xs text-[#585f6c] mt-0.5">
            Perbandingan arus kas bulanan sepanjang tahun
          </p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 bg-[#f8f9fa] px-3.5 py-1.5 rounded-full border border-[#edeeef] self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#006948] block"></span>
            <span className="text-xs font-medium text-[#3d4a42]">Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ba1a1a] block"></span>
            <span className="text-xs font-medium text-[#3d4a42]">Pengeluaran</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative pt-6 pb-2 pl-8 md:pl-10 pr-2">
        {/* Y Axis Labels */}
        <div className="absolute left-0 top-6 bottom-10 flex flex-col justify-between text-[#585f6c] font-semibold text-[11px] select-none pr-2 text-right w-8 md:w-10">
          <span>15M</span>
          <span>10M</span>
          <span>5M</span>
          <span>0</span>
        </div>

        {/* Grid Lines */}
        <div className="absolute left-8 md:left-10 right-2 top-6 bottom-10 flex flex-col justify-between pointer-events-none">
          <div className="border-t border-dashed border-[#bccac0]/40 w-full"></div>
          <div className="border-t border-dashed border-[#bccac0]/40 w-full"></div>
          <div className="border-t border-dashed border-[#bccac0]/40 w-full"></div>
          <div className="border-t border-[#bccac0] w-full"></div>
        </div>

        {/* Chart Bars (Jan-Des) */}
        <div className="flex items-end justify-between gap-1 sm:gap-2 md:gap-3 h-56 relative z-10">
          {months.map((m) => {
            const incomeHeightPercent = Math.min(100, Math.max(8, (m.pemasukan / maxScaleValue) * 100));
            const expenseHeightPercent = Math.min(100, Math.max(8, (m.pengeluaran / maxScaleValue) * 100));
            const isHovered = hoveredMonth?.shortMonth === m.shortMonth;
            const isDecember = m.shortMonth === 'Des';

            return (
              <div 
                key={m.shortMonth}
                id={`chart-bar-col-${m.shortMonth.toLowerCase()}`}
                onClick={() => onSelectMonth(m)}
                onMouseEnter={(e) => handleMouseEnter(m, e)}
                onMouseLeave={handleMouseLeave}
                className={`flex-1 flex flex-col items-center h-full justify-end group cursor-pointer transition-all duration-200 ${
                  isHovered ? 'scale-105' : 'hover:opacity-100'
                }`}
              >
                {/* Bar Pair */}
                <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-44 pb-1">
                  {/* Income Bar (Green) */}
                  <div
                    style={{ height: `${incomeHeightPercent}%` }}
                    className={`w-full max-w-[18px] sm:max-w-[22px] md:max-w-[26px] bg-[#006948] rounded-t-sm transition-all duration-300 shadow-xs ${
                      isHovered ? 'brightness-110 shadow-md ring-2 ring-[#006948]/30' : 'group-hover:brightness-110'
                    }`}
                  />
                  {/* Expense Bar (Red) */}
                  <div
                    style={{ height: `${expenseHeightPercent}%` }}
                    className={`w-full max-w-[18px] sm:max-w-[22px] md:max-w-[26px] bg-[#ba1a1a] rounded-t-sm transition-all duration-300 shadow-xs ${
                      isHovered ? 'brightness-110 shadow-md ring-2 ring-[#ba1a1a]/30' : 'group-hover:brightness-110'
                    }`}
                  />
                </div>

                {/* X Axis Label */}
                <div className="h-6 flex items-center justify-center">
                  <span 
                    className={`text-[11px] sm:text-xs transition-colors ${
                      isDecember 
                        ? 'font-bold text-[#191c1d]' 
                        : isHovered 
                          ? 'text-[#006948] font-bold' 
                          : 'text-[#585f6c] font-medium'
                    }`}
                  >
                    {m.shortMonth}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredMonth && tooltipPos && (
        <div 
          id="chart-hover-tooltip"
          className="fixed z-50 bg-[#191c1d] text-white text-xs rounded-xl p-3 shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2 border border-white/10 w-48 animate-fade-in"
          style={{ 
            left: `${tooltipPos.x}px`, 
            top: `${tooltipPos.y}px` 
          }}
        >
          <div className="font-bold text-sm text-emerald-300 pb-1.5 border-b border-white/10 mb-2 flex justify-between items-center">
            <span>{hoveredMonth.month}</span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300 font-normal">Bulan ke-{hoveredMonth.monthIndex}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#006948]"></span> Pemasukan:
              </span>
              <span className="font-semibold text-emerald-400">{formatRupiah(hoveredMonth.pemasukan)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span> Pengeluaran:
              </span>
              <span className="font-semibold text-red-400">{formatRupiah(hoveredMonth.pengeluaran)}</span>
            </div>
            <div className="pt-1.5 border-t border-white/10 flex justify-between items-center">
              <span className="text-gray-300">Surplus:</span>
              <span className={`font-bold ${hoveredMonth.surplus >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                {hoveredMonth.surplus >= 0 ? '+' : ''}{formatRupiah(hoveredMonth.surplus)}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-gray-400 text-center italic bg-white/5 py-0.5 rounded">
            Klik batang untuk melihat detail
          </div>
        </div>
      )}
    </div>
  );
};
