/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, ShieldCheck, RefreshCw, LogIn } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { SummaryCards } from './components/SummaryCards';
import { BarChartArea } from './components/BarChartArea';
import { MonthlyTable } from './components/MonthlyTable';
import { MonthDetailModal } from './components/MonthDetailModal';
import { DashboardView } from './components/DashboardView';
import { TransactionView } from './components/TransactionView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { LogoutModal } from './components/LogoutModal';
import { Footer } from './components/Footer';
import { financialData2024, financialData2023 } from './data/financialData';
import { NavTab, MonthlyRecord } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('rekap');
  const [selectedYear, setSelectedYear] = useState<2024 | 2023>(2024);
  const [selectedMonth, setSelectedMonth] = useState<MonthlyRecord | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const currentYearData = selectedYear === 2024 ? financialData2024 : financialData2023;

  if (isLoggedOut) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-[#e1e3e4] text-center animate-fade-in">
          <div className="w-16 h-16 bg-[#006948]/10 text-[#006948] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#006948]">REMUSHA Finance</h2>
          <p className="text-xs text-[#585f6c] mt-1 mb-6">Portal Transparansi Kas &amp; Keuangan Masjid</p>
          
          <div className="bg-[#f8f9fa] p-4 rounded-xl text-left text-xs text-[#585f6c] mb-6 space-y-1.5 border border-[#edeeef]">
            <p className="font-semibold text-[#191c1d]">Akses Jamaah Terbuka:</p>
            <p>• Rekap kas penerimaan &amp; pengeluaran</p>
            <p>• Grafik tren surplus &amp; saldo bulanan</p>
            <p>• Laporan pertanggungjawaban takmir</p>
          </div>

          <button
            onClick={() => setIsLoggedOut(false)}
            className="w-full py-3 bg-[#006948] hover:bg-[#005137] text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Sebagai Viewer (Mode Lihat)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex flex-col antialiased">
      {/* Navigation Sidebar (Desktop & Mobile) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogoutClick={() => setIsLogoutModalOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main 
        id="main-canvas"
        className="md:ml-64 pt-20 md:pt-6 px-4 md:px-8 pb-8 max-w-[1200px] mx-auto w-full flex-grow flex flex-col"
      >
        {/* Render Tab Contents */}
        {activeTab === 'rekap' && (
          <div id="rekap-keuangan-screen" className="animate-fade-in flex-grow flex flex-col">
            {/* Header Area */}
            <header className="mb-6 flex justify-between items-end flex-wrap gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#191c1d] tracking-tight mb-1">
                  Rekap Keuangan Tahunan
                </h2>
                
                {/* Mode Lihat Badge */}
                <div className="inline-flex items-center gap-1.5 bg-[#edeeef] px-2.5 py-1 rounded-md border border-[#bccac0]/40 mt-1">
                  <Eye className="w-3.5 h-3.5 text-[#585f6c]" />
                  <span className="text-xs font-semibold text-[#585f6c]">Mode Lihat</span>
                </div>

                <p className="text-sm text-[#585f6c] mt-1.5 font-normal">
                  Ringkasan aktivitas finansial periode {selectedYear}
                </p>
              </div>

              {/* Year Toggle Controls */}
              <div 
                id="year-selector"
                className="flex items-center bg-[#f3f4f5] rounded-xl p-1 border border-[#e1e3e4]"
              >
                <button
                  id="btn-year-2024"
                  onClick={() => setSelectedYear(2024)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                    selectedYear === 2024
                      ? 'bg-white shadow-xs text-[#191c1d]'
                      : 'text-[#585f6c] hover:text-[#191c1d]'
                  }`}
                >
                  2024
                </button>
                <button
                  id="btn-year-2023"
                  onClick={() => setSelectedYear(2023)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                    selectedYear === 2023
                      ? 'bg-white shadow-xs text-[#191c1d]'
                      : 'text-[#585f6c] hover:text-[#191c1d]'
                  }`}
                >
                  2023
                </button>
              </div>
            </header>

            {/* 1. Summary Cards (Bento 3 columns) */}
            <SummaryCards
              data={currentYearData}
              onCardClick={(type) => {
                // If user clicks summary card, jump to month breakdown or open latest month
                const latestMonth = currentYearData.months[currentYearData.months.length - 1];
                setSelectedMonth(latestMonth);
              }}
            />

            {/* 2. Bar Chart Area */}
            <BarChartArea
              months={currentYearData.months}
              onSelectMonth={(month) => setSelectedMonth(month)}
            />

            {/* 3. Monthly Table */}
            <MonthlyTable
              data={currentYearData}
              onSelectMonth={(month) => setSelectedMonth(month)}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            data={currentYearData}
            onNavigateToRekap={() => setActiveTab('rekap')}
          />
        )}

        {activeTab === 'transaksi' && (
          <TransactionView />
        )}

        {activeTab === 'laporan' && (
          <ReportsView data={currentYearData} />
        )}

        {activeTab === 'pengaturan' && (
          <SettingsView />
        )}

        {/* Global Footer */}
        <Footer />
      </main>

      {/* Month Detail Modal */}
      <MonthDetailModal
        month={selectedMonth}
        year={selectedYear}
        onClose={() => setSelectedMonth(null)}
      />

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          setIsLoggedOut(true);
        }}
      />
    </div>
  );
}
