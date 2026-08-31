import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PlusCircle, Loader2, Calculator, CheckCircle2, AlertCircle, Sparkles, Edit3 } from 'lucide-react';
import { SheetTransaction } from '../types';

interface TransactionFormProps {
  lastBalance: number;
  editItem?: SheetTransaction | null;
  onSuccess: (tx?: SheetTransaction) => void;
  onCancel?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  lastBalance,
  editItem = null,
  onSuccess,
  onCancel
}) => {
  const isEditMode = !!editItem;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: '',
    pemasukan: '',
    pengeluaran: '',
    saldo: '',
    pj: ''
  });

  const [autoCalculateSaldo, setAutoCalculateSaldo] = useState(!isEditMode);

  // Populate data if in Edit Mode
  useEffect(() => {
    if (editItem) {
      setFormData({
        tanggal: editItem.tanggal || new Date().toISOString().split('T')[0],
        keterangan: editItem.keterangan || '',
        pemasukan: editItem.pemasukan ? editItem.pemasukan.toString() : '',
        pengeluaran: editItem.pengeluaran ? editItem.pengeluaran.toString() : '',
        saldo: editItem.saldo ? editItem.saldo.toString() : '',
        pj: editItem.pj || ''
      });
      setAutoCalculateSaldo(false);
    } else {
      setFormData({
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: '',
        pemasukan: '',
        pengeluaran: '',
        saldo: '',
        pj: ''
      });
      setAutoCalculateSaldo(true);
    }
  }, [editItem]);

  // Auto calculate suggested saldo based on last balance + pemasukan - pengeluaran (only for new transactions)
  useEffect(() => {
    if (autoCalculateSaldo && !isEditMode) {
      const pemasukanNum = Number(formData.pemasukan) || 0;
      const pengeluaranNum = Number(formData.pengeluaran) || 0;
      const calculated = lastBalance + pemasukanNum - pengeluaranNum;
      setFormData(prev => ({ ...prev, saldo: calculated.toString() }));
    }
  }, [formData.pemasukan, formData.pengeluaran, lastBalance, autoCalculateSaldo, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'saldo') {
      setAutoCalculateSaldo(false);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const txData: SheetTransaction = {
      tanggal: formData.tanggal,
      keterangan: formData.keterangan.trim(),
      pemasukan: Number(formData.pemasukan) || 0,
      pengeluaran: Number(formData.pengeluaran) || 0,
      saldo: Number(formData.saldo) || 0,
      pj: formData.pj.trim()
    };

    if (isEditMode && editItem?.id) {
      txData.id = editItem.id;
    }

    if (!txData.keterangan) {
      setError('Keterangan / Nama kegiatan wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    if (!txData.pj) {
      setError('Penanggung Jawab (PJ) wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isSupabaseConfigured) {
        if (isEditMode && editItem?.id) {
          // UPDATE operation in Supabase
          const { error: updateError } = await supabase
            .from('transactions')
            .update({
              tanggal: txData.tanggal,
              keterangan: txData.keterangan,
              pemasukan: txData.pemasukan,
              pengeluaran: txData.pengeluaran,
              saldo: txData.saldo,
              pj: txData.pj,
            })
            .eq('id', editItem.id);

          if (updateError) {
            console.warn('Supabase update warning, updating local storage:', updateError);
            updateLocalStorage(txData);
          } else {
            setSuccess('Perubahan transaksi berhasil disimpan ke Supabase!');
          }
        } else {
          // INSERT operation in Supabase
          const { data, error: submitError } = await supabase
            .from('transactions')
            .insert([
              {
                tanggal: txData.tanggal,
                keterangan: txData.keterangan,
                pemasukan: txData.pemasukan,
                pengeluaran: txData.pengeluaran,
                saldo: txData.saldo,
                pj: txData.pj,
              }
            ])
            .select();

          if (submitError) {
            console.warn('Supabase insert warning, saving locally as fallback:', submitError);
            saveToLocalStorage(txData);
          } else {
            setSuccess('Data transaksi baru berhasil disimpan ke Supabase!');
            if (data && data[0]) {
              txData.id = data[0].id;
            }
          }
        }
      } else {
        if (isEditMode) {
          updateLocalStorage(txData);
          setSuccess('Perubahan transaksi berhasil disimpan secara lokal!');
        } else {
          saveToLocalStorage(txData);
          setSuccess('Data berhasil disimpan secara lokal!');
        }
      }

      onSuccess(txData);

      if (!isEditMode) {
        setFormData({
          tanggal: new Date().toISOString().split('T')[0],
          keterangan: '',
          pemasukan: '',
          pengeluaran: '',
          saldo: '',
          pj: ''
        });
        setAutoCalculateSaldo(true);
      }

      setTimeout(() => setSuccess(null), 3500);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      if (isEditMode) {
        updateLocalStorage(txData);
      } else {
        saveToLocalStorage(txData);
      }
      setSuccess('Data berhasil disimpan ke memori.');
      onSuccess(txData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveToLocalStorage = (item: SheetTransaction) => {
    try {
      const stored = localStorage.getItem('remusha_local_transactions');
      const list: SheetTransaction[] = stored ? JSON.parse(stored) : [];
      item.id = Date.now();
      list.push(item);
      localStorage.setItem('remusha_local_transactions', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const updateLocalStorage = (item: SheetTransaction) => {
    try {
      const stored = localStorage.getItem('remusha_local_transactions');
      let list: SheetTransaction[] = stored ? JSON.parse(stored) : [];
      list = list.map(t => (t.id === item.id ? item : t));
      localStorage.setItem('remusha_local_transactions', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to update localStorage', e);
    }
  };

  return (
    <div
      id="transaction-form-card"
      className="bg-white p-5 lg:p-7 rounded-2xl border border-[#006948]/20 shadow-sm mb-6 transition-all duration-300 animate-fade-in"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-[#e1e3e4]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#006948]/10 text-[#006948] rounded-lg">
              {isEditMode ? <Edit3 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </span>
            <h3 className="text-lg font-bold text-[#191c1d]">
              {isEditMode ? 'Edit Data Transaksi Kas' : 'Form Input Transaksi Kas'}
            </h3>
          </div>
          <p className="text-xs text-[#585f6c] mt-1">
            {isEditMode
              ? 'Perbarui informasi transaksi dan simpan perubahan'
              : 'Data akan diurutkan dari tanggal yang lebih lama ke yang terbaru di buku kas'}
          </p>
        </div>

        {!isEditMode && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoCalculateSaldo(!autoCalculateSaldo)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${autoCalculateSaldo
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-xs'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{autoCalculateSaldo ? 'Hitung Saldo Otomatis: ON' : 'Saldo Manual'}</span>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs font-medium mb-4 border border-red-200 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl text-xs font-medium mb-4 border border-emerald-200 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Tanggal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#191c1d]">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006948] transition-all"
            />
          </div>

          {/* Nama / Keterangan */}
          <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
            <label className="text-xs font-bold text-[#191c1d]">
              Nama / Keterangan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              required
              placeholder="Contoh: Akhsan / Pembelian Konsumsi"
              className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006948] transition-all"
            />
          </div>

          {/* Pemasukan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#006948]">
              Pemasukan (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rp</span>
              <input
                type="number"
                name="pemasukan"
                value={formData.pemasukan}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm font-semibold text-[#006948] focus:outline-none focus:ring-2 focus:ring-[#006948] transition-all"
              />
            </div>
          </div>

          {/* Pengeluaran */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#ba1a1a]">
              Pengeluaran (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rp</span>
              <input
                type="number"
                name="pengeluaran"
                value={formData.pengeluaran}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm font-semibold text-[#ba1a1a] focus:outline-none focus:ring-2 focus:ring-[#ba1a1a] transition-all"
              />
            </div>
          </div>

          {/* Saldo */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#191c1d]">
                Saldo (Rp)
              </label>
              {autoCalculateSaldo && (
                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                  Otomatis
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rp</span>
              <input
                type="number"
                name="saldo"
                value={formData.saldo}
                onChange={handleChange}
                placeholder="0"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm font-bold text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#006948] transition-all"
              />
            </div>
          </div>

          {/* PJ */}
          <div className="space-y-1.5 lg:col-span-3">
            <label className="text-xs font-bold text-[#191c1d]">
              Penanggung Jawab (PJ) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pj"
              value={formData.pj}
              onChange={handleChange}
              required
              placeholder="Contoh: Nur Akhsan"
              className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006948] transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-semibold text-[#585f6c] hover:text-[#191c1d] hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
            >
              Batal
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#006948] hover:bg-[#005137] text-white font-bold rounded-xl text-sm transition-all duration-200 flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isEditMode ? 'Menyimpan Perubahan...' : 'Menyimpan...'}</span>
              </>
            ) : (
              <>
                {isEditMode ? <Edit3 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                <span>{isEditMode ? 'Simpan Perubahan' : 'Simpan Transaksi'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
