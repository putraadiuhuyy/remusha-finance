import React, { useState } from 'react';
import { Settings, Shield, Bell, Lock, Smartphone, Globe, Check, LogIn, AlertCircle } from 'lucide-react';
import { AppUser } from '../types';

interface SettingsViewProps {
  currentUser?: AppUser | null;
  onLoginClick?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, onLoginClick }) => {
  const isAdminOrBendahara = currentUser?.role === 'admin' || currentUser?.role === 'bendahara';

  const [currencyFormat, setCurrencyFormat] = useState('IDR');
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [reportDigest, setReportDigest] = useState('monthly');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Jika bukan Admin atau Bendahara, tampilkan Layar Terkunci
  if (!isAdminOrBendahara) {
    return (
      <div id="settings-locked-view" className="space-y-6 animate-fade-in max-w-2xl mx-auto py-8">
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#e1e3e4] shadow-sm text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-5 border border-amber-200 shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200 mb-3">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Akses Dibatasi</span>
          </div>

          <h2 className="text-2xl font-bold text-[#191c1d] mb-2">
            Halaman Pengaturan Terkunci
          </h2>

          <p className="text-sm text-[#585f6c] leading-relaxed max-w-md mb-6">
            Halaman Pengaturan hanya dapat diakses oleh <strong>Admin</strong> atau <strong>Bendahara</strong> REMUSHA untuk mengelola konfigurasi sistem dan preferensi portal.
          </p>

          <div className="w-full bg-[#f8f9fa] border border-[#e1e3e4] rounded-2xl p-4 mb-6 text-left text-xs space-y-2">
            <div className="flex justify-between items-center text-[#585f6c]">
              <span>Status Login Saat Ini:</span>
              <span className="font-semibold text-gray-800 bg-gray-200/80 px-2 py-0.5 rounded">
                {currentUser?.roleLabel || 'Viewer (Publik)'}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#585f6c]">
              <span>Hak Akses Dibutuhkan:</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Admin / Bendahara
              </span>
            </div>
          </div>

          {onLoginClick && (
            <button
              id="btn-login-to-settings"
              onClick={onLoginClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#006948] hover:bg-[#005137] text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Login Admin / Bendahara</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="settings-view" className="space-y-6 animate-fade-in max-w-4xl">
      <div className="bg-white p-5 lg:p-6 rounded-2xl border border-[#e1e3e4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#191c1d]">Pengaturan Akun & Sistem</h2>
          <p className="text-xs text-[#585f6c] mt-0.5">Kelola preferensi portal kas dan konfigurasi laporan REMUSHA</p>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Akses Terverifikasi: {currentUser?.roleLabel}</span>
        </div>
      </div>

      {/* Role & Access Info */}
      <div className="bg-white p-6 rounded-2xl border border-[#e1e3e4] shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-[#006948]/10 text-[#006948] rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#191c1d]">Tingkat Akses Pengguna</h3>
            <p className="text-xs text-[#585f6c]">Peran aktif saat ini dalam sistem REMUSHA</p>
          </div>
        </div>

        <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#edeeef] space-y-2.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-[#585f6c]">Status Peran:</span>
            <span className="font-bold text-[#006948] bg-emerald-100 px-2.5 py-0.5 rounded-full text-xs">
              {currentUser?.name} ({currentUser?.roleLabel})
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#585f6c]">Izin Akses:</span>
            <span className="font-medium text-[#191c1d]">Melihat Rekap Kas, Laporan & Buku Transaksi</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#585f6c]">Izin Tambah, Edit & Hapus:</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Diizinkan (Aktif)
            </span>
          </div>
        </div>
      </div>

      {/* Display & Notification Preferences */}
      <div className="bg-white p-6 rounded-2xl border border-[#e1e3e4] shadow-xs space-y-5">
        <h3 className="font-bold text-base text-[#191c1d] pb-2 border-b border-[#e1e3e4]">
          Preferensi Tampilan & Laporan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">Format Mata Uang</label>
            <select
              value={currencyFormat}
              onChange={(e) => setCurrencyFormat(e.target.value)}
              className="w-full p-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006948]"
            >
              <option value="IDR">Rupiah Indonesia (Rp / IDR)</option>
              <option value="SHORT">Format Singkat (cth: 125,4M)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191c1d] mb-1.5">Frekuensi Rekapitulasi</label>
            <select
              value={reportDigest}
              onChange={(e) => setReportDigest(e.target.value)}
              className="w-full p-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006948]"
            >
              <option value="monthly">Bulanan (Standar Rekap)</option>
              <option value="quarterly">Kuartalan (Triwulan)</option>
              <option value="yearly">Tahunan Saja</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.checked)}
              className="w-4 h-4 text-[#006948] rounded focus:ring-[#006948]"
            >
            </input>
            <span className="text-sm text-[#191c1d]">Terima ringkasan mutasi keuangan via email</span>
          </label>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-[#006948] hover:bg-[#005137] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-xs cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <span>Simpan Pengaturan</span>
            )}
          </button>

          {savedSuccess && (
            <span className="text-xs font-semibold text-[#006948] animate-fade-in">
              Preferensi berhasil diperbarui.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
