/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { LoginView, DEFAULT_USERS } from './components/LoginView';
import { Footer } from './components/Footer';
import { financialData2024, financialData2023 } from './data/financialData';
import { NavTab, MonthlyRecord, AppUser } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('rekap');
  const [selectedYear, setSelectedYear] = useState<2024 | 2023>(2024);
  const [selectedMonth, setSelectedMonth] = useState<MonthlyRecord | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const stored = localStorage.getItem('remusha_current_user');
      return stored ? JSON.parse(stored) : DEFAULT_USERS.admin; // Default start logged in as Admin for easy testing, or can be null
    } catch (e) {
      return DEFAULT_USERS.admin;
    }
  });

  const currentYearData = selectedYear === 2024 ? financialData2024 : financialData2023;

  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('remusha_current_user', JSON.stringify(user));
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('remusha_current_user');
    } catch (e) {}
    setIsLogoutModalOpen(false);
  };

  // If not logged in, render the Login Screen
  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
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
        currentUser={currentUser}
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
                
                {/* Mode Role Badge */}
                <div className="inline-flex items-center gap-1.5 bg-[#edeeef] px-2.5 py-1 rounded-md border border-[#bccac0]/40 mt-1">
                  <Eye className="w-3.5 h-3.5 text-[#585f6c]" />
                  <span className="text-xs font-semibold text-[#585f6c]">
                    Login Sebagai: <strong>{currentUser.roleLabel}</strong>
                  </span>
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
          <TransactionView currentUser={currentUser} />
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
        onConfirm={handleLogout}
      />
    </div>
  );
}
