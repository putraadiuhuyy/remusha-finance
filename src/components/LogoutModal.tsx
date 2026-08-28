import React from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div 
      id="logout-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="logout-modal-content"
        className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#e1e3e4]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-2xl">
            <LogOut className="w-6 h-6" />
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-[#191c1d] mb-1">
          Keluar dari Sesi?
        </h3>
        <p className="text-xs text-[#585f6c] leading-relaxed mb-6">
          Anda akan keluar dari sesi tampilan viewer portal keuangan REMUSHA. Anda dapat masuk kembali kapan saja untuk memantau kas masjid.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#f3f4f5] hover:bg-[#edeeef] text-[#191c1d] font-semibold rounded-xl text-sm transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-semibold rounded-xl text-sm transition-colors shadow-xs"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
};
