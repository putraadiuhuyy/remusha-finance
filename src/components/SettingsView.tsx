import React, { useState } from 'react';
import { Settings, Shield, Bell, Lock, Smartphone, Globe, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [currencyFormat, setCurrencyFormat] = useState('IDR');
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [reportDigest, setReportDigest] = useState('monthly');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div id="settings-view" className="space-y-6 animate-fade-in max-w-4xl">
      <div className="bg-white p-5 lg:p-6 rounded-2xl border border-[#e1e3e4] shadow-xs">
        <h2 className="text-xl font-bold text-[#191c1d]">Pengaturan Akun & Tampilan</h2>
        <p className="text-xs text-[#585f6c] mt-0.5">Kelola hak akses viewer, preferensi notifikasi, dan tampilan data</p>
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

        <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#edeeef] space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-[#585f6c]">Status Peran:</span>
            <span className="font-bold text-[#006948] bg-emerald-100 px-2.5 py-0.5 rounded-full text-xs">
              Mosque Member (Viewer)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#585f6c]">Izin Akses:</span>
            <span className="font-medium text-[#191c1d]">Melihat Rekap Kas, Laporan & Buku Transaksi</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#585f6c]">Izin Edit & Rekonsiliasi:</span>
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Hanya Admin / Bendahara</span>
          </div>
        </div>
      </div>

      {/* Display & Notification Preferences */}
      <div className="bg-white p-6 rounded-2xl border border-[#e1e3e4] shadow-xs space-y-5">
        <h3 className="font-bold text-base text-[#191c1d] pb-2 border-b border-[#e1e3e4]">
          Preferensi Tampilan & Notifikasi
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
            />
            <span className="text-sm text-[#191c1d]">Terima ringkasan mutasi keuangan via email</span>
          </label>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-[#006948] hover:bg-[#005137] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-xs"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Pengaturan Disimpan!</span>
              </>
            ) : (
              <span>Simpan Perubahan</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
