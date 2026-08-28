import React from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { SheetTransaction } from '../types';
import { formatRupiah } from '../data/financialData';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  transaction: SheetTransaction | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onConfirm,
  isDeleting = false
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div 
      id="delete-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="delete-modal-content"
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#e1e3e4] relative z-10 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          disabled={isDeleting}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="p-3 bg-red-100 text-[#ba1a1a] rounded-2xl shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#191c1d]">
              Hapus Baris Transaksi?
            </h3>
            <p className="text-xs text-[#585f6c]">
              Tindakan ini akan menghapus data dari pembukuan kas.
            </p>
          </div>
        </div>

        {/* Detail Box */}
        <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-[#edeeef] text-xs space-y-2 mb-6 text-left">
          <div className="flex justify-between">
            <span className="text-[#585f6c]">Tanggal:</span>
            <span className="font-semibold text-[#191c1d]">{transaction.tanggal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#585f6c]">Keterangan:</span>
            <span className="font-bold text-[#191c1d] text-right max-w-[200px] truncate">{transaction.keterangan}</span>
          </div>
          {transaction.pemasukan > 0 && (
            <div className="flex justify-between">
              <span className="text-[#585f6c]">Pemasukan:</span>
              <span className="font-bold text-[#006948]">{formatRupiah(transaction.pemasukan)}</span>
            </div>
          )}
          {transaction.pengeluaran > 0 && (
            <div className="flex justify-between">
              <span className="text-[#585f6c]">Pengeluaran:</span>
              <span className="font-bold text-[#ba1a1a]">{formatRupiah(transaction.pengeluaran)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[#585f6c]">Penanggung Jawab:</span>
            <span className="font-medium text-[#191c1d]">{transaction.pj || '-'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 bg-[#f3f4f5] hover:bg-[#edeeef] text-[#191c1d] font-bold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
