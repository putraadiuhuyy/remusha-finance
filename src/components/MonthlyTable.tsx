import React, { useState } from 'react';
import { Download, ChevronDown, ChevronUp, Eye, Check } from 'lucide-react';
import { MonthlyRecord, YearFinancialData } from '../types';
import { formatNumberOnly } from '../data/financialData';

interface MonthlyTableProps {
  data: YearFinancialData;
  onSelectMonth: (month: MonthlyRecord) => void;
}

export const MonthlyTable: React.FC<MonthlyTableProps> = ({ data, onSelectMonth }) => {
  // Mode: compact (matching screenshot) vs expanded (showing all 12 months)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleDownloadCSV = () => {
    const headers = ['Bulan', 'Pemasukan (Rp)', 'Pengeluaran (Rp)', 'Surplus / Defisit (Rp)', 'Saldo Kumulatif (Rp)'];
    const rows = data.months.map((m) => [
      m.month,
      m.pemasukan,
      m.pengeluaran,
      m.surplus,
      m.saldoKumulatif,
    ]);
    const totalRow = [
      `Total ${data.year}`,
      data.totalPemasukan,
      data.totalPengeluaran,
      data.totalPemasukan - data.totalPengeluaran,
      data.saldoKumulatif
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(',')),
      totalRow.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap-keuangan-remusha-${data.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  // If in compact mode, we display Jan, Feb, Mar, Apr, Mei, the "Juni - November" collapsed row, and Desember
  const janToMay = data.months.filter(m => m.monthIndex >= 1 && m.monthIndex <= 5);
  const juneToNov = data.months.filter(m => m.monthIndex >= 6 && m.monthIndex <= 11);
  const december = data.months.find(m => m.monthIndex === 12);

  // Calculate cumulative surplus for Jun-Nov
  const interimEndingBalance = juneToNov.length > 0 ? juneToNov[juneToNov.length - 1].saldoKumulatif : 35000000;

  return (
    <div 
      id="monthly-table-card"
      className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#e1e3e4]/60 overflow-hidden mb-6"
    >
      {/* Table Header Controls */}
      <div className="p-5 lg:p-6 border-b border-[#e1e3e4]/60 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-[#fcfdfd]">
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-[#191c1d] tracking-tight">
            Rincian Bulanan
          </h3>
          <p className="text-xs text-[#585f6c] mt-0.5">
            Tabel arus kas dan mutasi saldo tahun {data.year}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Toggle Compact / All Months */}
          <button
            id="toggle-view-compact-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-xs font-medium text-[#585f6c] hover:text-[#006948] bg-[#f3f4f5] hover:bg-[#edeeef] px-3 py-1.5 rounded-full transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Tampilan Ringkas (Default)</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Buka Semua 12 Bulan</span>
              </>
            )}
          </button>

          {/* Download CSV Button */}
          <button
            id="download-csv-btn"
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#006948] hover:text-[#005137] bg-[#006948]/10 hover:bg-[#006948]/20 px-3.5 py-1.5 rounded-full transition-all duration-200"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Tersimpan!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#f8f9fa] text-[#585f6c] font-semibold border-b border-[#e1e3e4]/60 text-xs">
              <th className="py-3 px-4 lg:px-6 font-semibold whitespace-nowrap">Bulan</th>
              <th className="py-3 px-4 lg:px-6 font-semibold text-right whitespace-nowrap">Pemasukan (Rp)</th>
              <th className="py-3 px-4 lg:px-6 font-semibold text-right whitespace-nowrap">Pengeluaran (Rp)</th>
              <th className="py-3 px-4 lg:px-6 font-semibold text-right whitespace-nowrap">Surplus / Defisit (Rp)</th>
              <th className="py-3 px-4 lg:px-6 font-semibold text-right whitespace-nowrap">Saldo Kumulatif (Rp)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e4]/40 text-[#191c1d]">
            {!isExpanded ? (
              <>
                {/* Jan - Mei */}
                {janToMay.map((m, idx) => {
                  const isAlternate = idx % 2 === 1;
                  return (
                    <tr 
                      key={m.month}
                      id={`table-row-${m.shortMonth.toLowerCase()}`}
                      onClick={() => onSelectMonth(m)}
                      className={`hover:bg-[#f8f9fa] transition-colors cursor-pointer group ${
                        isAlternate ? 'bg-[#f3f4f5]/40' : 'bg-white'
                      }`}
                    >
                      <td className="py-3.5 px-4 lg:px-6 font-medium text-[#191c1d] flex items-center gap-2">
                        <span>{m.month}</span>
                        <span className="opacity-0 group-hover:opacity-100 text-[#006948] transition-opacity">
                          <Eye className="w-3.5 h-3.5" />
                        </span>
                      </td>
                      <td className="py-3.5 px-4 lg:px-6 text-right font-medium text-[#006948]">
                        {formatNumberOnly(m.pemasukan)}
                      </td>
                      <td className="py-3.5 px-4 lg:px-6 text-right font-medium text-[#ba1a1a]">
                        {formatNumberOnly(m.pengeluaran)}
                      </td>
                      <td className="py-3.5 px-4 lg:px-6 text-right font-medium text-[#006948]">
                        +{formatNumberOnly(m.surplus)}
                      </td>
                      <td className="py-3.5 px-4 lg:px-6 text-right font-semibold text-[#191c1d]">
                        {formatNumberOnly(m.saldoKumulatif)}
                      </td>
                    </tr>
                  );
                })}

                {/* Collapsed Juni - November Row */}
                <tr 
                  id="table-row-juni-november-collapsed"
                  onClick={() => setIsExpanded(true)}
                  className="bg-[#f3f4f5]/60 hover:bg-[#edeeef] transition-colors cursor-pointer border-y border-[#bccac0]/30"
                  title="Klik untuk membuka rincian bulan Juni hingga November"
                >
                  <td className="py-3.5 px-4 lg:px-6 font-medium text-[#191c1d] flex items-center gap-2">
                    <span>Juni - November</span>
                    <span className="text-xs bg-[#006948]/10 text-[#006948] px-2 py-0.5 rounded-md font-semibold">
                      Buka Rincian
                    </span>
                  </td>
                  <td colSpan={3} className="py-3.5 px-4 lg:px-6 text-center text-[#585f6c] text-xs italic">
                    Data direkap untuk tampilan ringkas
                  </td>
                  <td className="py-3.5 px-4 lg:px-6 text-right font-semibold text-[#191c1d]">
                    {formatNumberOnly(interimEndingBalance)}
                  </td>
                </tr>

                {/* Desember */}
                {december && (
                  <tr 
                    id="table-row-des"
                    onClick={() => onSelectMonth(december)}
                    className="hover:bg-[#f8f9fa] transition-colors cursor-pointer group bg-white"
                  >
                    <td className="py-3.5 px-4 lg:px-6 font-semibold text-[#191c1d] flex items-center gap-2">
                      <span>{december.month}</span>
                      <span className="opacity-0 group-hover:opacity-100 text-[#006948] transition-opacity">
                        <Eye className="w-3.5 h-3.5" />
                      </span>
                    </td>
                    <td className="py-3.5 px-4 lg:px-6 text-right font-medium text-[#006948]">
                      {formatNumberOnly(december.pemasukan)}
                    </td>
                    <td className="py-3.5 px-4 lg:px-6 text-right font-medium text-[#ba1a1a]">
                      {formatNumberOnly(december.pengeluaran)}
                    </td>
                    <td className="py-3.5 px-4 lg:px-6 text-right font-medium text-[#006948]">
                      +{formatNumberOnly(december.surplus)}
                    </td>
                    <td className="py-3.5 px-4 lg:px-6 text-right font-bold text-[#191c1d]">
                      {formatNumberOnly(december.saldoKumulatif)}
                    </td>
                  </tr>
                )}
              </>
            ) : (
              /* All 12 months rendered individually when expanded */
              data.months.map((m, idx) => {
                const isAlternate = idx % 2 === 1;
                return (
                  <tr 
                    key={m.month}
                    id={`table-row-expanded-${m.shortMonth.toLowerCase()}`}
                    onClick={() => onSelectMonth(m)}
                    className={`hover:bg-[#f8f9fa] transition-colors cursor-pointer group ${
                      isAlternate ? 'bg-[#f3f4f5]/40' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-4 lg:px-6 font-medium text-[#191c1d] flex items-center gap-2">
                      <span>{m.month}</span>
                      <span className="opacity-0 group-hover:opacity-100 text-[#006948] transition-opacity">
                        <Eye className="w-3.5 h-3.5" />
                      </span>
                    </td>
                    <td className="py-3 px-4 lg:px-6 text-right font-medium text-[#006948]">
                      {formatNumberOnly(m.pemasukan)}
                    </td>
                    <td className="py-3 px-4 lg:px-6 text-right font-medium text-[#ba1a1a]">
                      {formatNumberOnly(m.pengeluaran)}
                    </td>
                    <td className="py-3 px-4 lg:px-6 text-right font-medium text-[#006948]">
                      +{formatNumberOnly(m.surplus)}
                    </td>
                    <td className="py-3 px-4 lg:px-6 text-right font-semibold text-[#191c1d]">
                      {formatNumberOnly(m.saldoKumulatif)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {/* Footer Total Row */}
          <tfoot className="bg-[#edeeef] font-bold text-xs sm:text-sm border-t-2 border-[#bccac0]">
            <tr id="table-footer-total-row">
              <td className="py-4 px-4 lg:px-6 text-[#191c1d]">Total {data.year}</td>
              <td className="py-4 px-4 lg:px-6 text-right text-[#006948]">
                {formatNumberOnly(data.totalPemasukan)}
              </td>
              <td className="py-4 px-4 lg:px-6 text-right text-[#ba1a1a]">
                {formatNumberOnly(data.totalPengeluaran)}
              </td>
              <td className="py-4 px-4 lg:px-6 text-right text-[#006948]">
                +{formatNumberOnly(data.totalPemasukan - data.totalPengeluaran)}
              </td>
              <td className="py-4 px-4 lg:px-6 text-right text-[#191c1d]">
                {formatNumberOnly(data.saldoKumulatif)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
