import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet, 
  RefreshCw, 
  Database, 
  HardDrive, 
  Trash2, 
  UserCheck, 
  Calendar,
  Table as TableIcon,
  Download,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SheetTransaction, AppUser } from '../types';
import { TransactionForm } from './TransactionForm';
import { formatRupiah } from '../data/financialData';

// Initial default seed data (empty for fresh start)
const defaultTransactions: SheetTransaction[] = [];

interface TransactionViewProps {
  currentUser?: AppUser | null;
}

export const TransactionView: React.FC<TransactionViewProps> = ({ currentUser }) => {
  const isViewer = currentUser?.role === 'viewer';
  const [transactions, setTransactions] = useState<SheetTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [usingDatabase, setUsingDatabase] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Fetch transactions ordered by date ASCENDING (tanggal yang lebih lama di atas)
  const fetchTransactions = async () => {
    setLoading(true);
    setDbError(null);

    try {
      if (isSupabaseConfigured) {
        // Query Supabase sorted chronologically ASCENDING
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('tanggal', { ascending: true })
          .order('id', { ascending: true });

        if (error) {
          console.warn('Supabase fetch failed, checking local storage:', error.message);
          setDbError(error.message);
          loadLocalData();
        } else if (data && data.length > 0) {
          setTransactions(data);
          setUsingDatabase(true);
        } else {
          loadLocalData();
          setUsingDatabase(true);
        }
      } else {
        loadLocalData();
      }
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      loadLocalData();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalData = () => {
    try {
      const stored = localStorage.getItem('remusha_local_transactions');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.sort((a: SheetTransaction, b: SheetTransaction) => 
          new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
        );
        setTransactions(parsed);
      } else {
        setTransactions(defaultTransactions);
        localStorage.setItem('remusha_local_transactions', JSON.stringify(defaultTransactions));
      }
    } catch (e) {
      setTransactions(defaultTransactions);
    }
    setUsingDatabase(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Delete transaction handler
  const handleDelete = async (id?: number | string) => {
    if (isViewer) {
      alert('Mode Viewer hanya memiliki izin membaca.');
      return;
    }
    if (!id) return;
    if (!window.confirm('Apakah Anda yakin ingin menghapus baris transaksi ini?')) return;

    try {
      if (isSupabaseConfigured && usingDatabase) {
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (error) throw error;
      }

      // Update local state
      const updated = transactions.filter(t => t.id !== id);
      setTransactions(updated);
      localStorage.setItem('remusha_local_transactions', JSON.stringify(updated));
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  // Filter transactions
  const filtered = transactions.filter(tx => {
    const term = searchTerm.toLowerCase();
    return (
      tx.keterangan.toLowerCase().includes(term) ||
      tx.pj.toLowerCase().includes(term) ||
      tx.tanggal.includes(term)
    );
  });

  // Calculate Running Summary
  const totalPemasukan = transactions.reduce((sum, t) => sum + (Number(t.pemasukan) || 0), 0);
  const totalPengeluaran = transactions.reduce((sum, t) => sum + (Number(t.pengeluaran) || 0), 0);
  const currentSaldo = transactions.length > 0 ? (transactions[transactions.length - 1].saldo || (totalPemasukan - totalPengeluaran)) : 0;

  // Last known balance for form auto-calculation
  const lastBalance = transactions.length > 0 ? Number(transactions[transactions.length - 1].saldo) || 0 : 0;

  // Export CSV
  const exportCSV = () => {
    const headers = ['No', 'Tanggal', 'Nama/Keterangan', 'Pemasukan', 'Pengeluaran', 'Saldo', 'PJ'];
    const rows = filtered.map((tx, idx) => [
      idx + 1,
      tx.tanggal,
      `"${tx.keterangan.replace(/"/g, '""')}"`,
      tx.pemasukan,
      tx.pengeluaran,
      tx.saldo,
      `"${tx.pj.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Remusha_Buku_Kas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="transaction-view" className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e1e3e4] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#006948] flex items-center justify-center">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#585f6c]">Total Pemasukan</span>
            <h4 className="text-lg font-bold text-[#006948] mt-0.5">{formatRupiah(totalPemasukan)}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e1e3e4] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#ba1a1a] flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#585f6c]">Total Pengeluaran</span>
            <h4 className="text-lg font-bold text-[#ba1a1a] mt-0.5">{formatRupiah(totalPengeluaran)}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e1e3e4] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#585f6c]">Saldo Kas Terkini</span>
            <h4 className="text-lg font-extrabold text-[#191c1d] mt-0.5">{formatRupiah(currentSaldo)}</h4>
          </div>
        </div>
      </div>

      {/* Header & Action Controls */}
      <div className="bg-white p-5 lg:p-6 rounded-2xl border border-[#e1e3e4] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <TableIcon className="w-5 h-5 text-[#006948]" />
              <h2 className="text-xl font-bold text-[#191c1d]">Tabel Kas Transaksi (Buku Besar)</h2>
            </div>
            <p className="text-xs text-[#585f6c] mt-1">
              Urutan kronologis sesuai tanggal (tanggal lama di atas)
            </p>
          </div>

          {/* Database / Storage status & Action Buttons */}
          <div className="flex items-center flex-wrap gap-2.5">
            {isViewer ? (
              <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-800 font-semibold px-3 py-1.5 rounded-xl border border-blue-200">
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Mode Viewer</span>
              </span>
            ) : usingDatabase ? (
              <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 font-semibold px-3 py-1.5 rounded-xl border border-emerald-200">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tersambung Supabase</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-800 font-semibold px-3 py-1.5 rounded-xl border border-amber-200" title="Data tersimpan di browser">
                <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                <span>Penyimpanan Lokal Aktif</span>
              </span>
            )}

            <button
              onClick={fetchTransactions}
              title="Segarkan Data"
              className="p-2 text-gray-500 hover:text-[#006948] hover:bg-gray-100 rounded-xl transition-all border border-[#e1e3e4] cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={exportCSV}
              title="Unduh format CSV / Excel"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#191c1d] bg-[#f8f9fa] hover:bg-gray-200 border border-[#e1e3e4] rounded-xl transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {!isViewer && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#006948] hover:bg-[#005137] rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{showForm ? 'Tutup Form' : 'Tambah Data Baru'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Cari transaksi berdasarkan nama kegiatan, penanggung jawab, atau tanggal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006948] transition-all"
          />
        </div>
      </div>

      {/* Embedded Input Form (Admin / Bendahara only) */}
      {!isViewer && showForm && (
        <TransactionForm
          lastBalance={lastBalance}
          onSuccess={() => {
            fetchTransactions();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Spreadsheet Format Table */}
      <div className="bg-white rounded-2xl border border-[#e1e3e4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#1e5138] text-white font-bold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-16 border-r border-[#19432e]">No</th>
                <th className="py-3.5 px-4 border-r border-[#19432e] min-w-[120px]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 opacity-80" />
                    <span>Tanggal</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 border-r border-[#19432e] min-w-[240px]">Nama / Keterangan</th>
                <th className="py-3.5 px-4 text-right border-r border-[#19432e] min-w-[140px]">Pemasukan</th>
                <th className="py-3.5 px-4 text-right border-r border-[#19432e] min-w-[140px]">Pengeluaran</th>
                <th className="py-3.5 px-4 text-right border-r border-[#19432e] min-w-[140px]">Saldo</th>
                <th className="py-3.5 px-4 border-r border-[#19432e] min-w-[130px]">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 opacity-80" />
                    <span>PJ</span>
                  </div>
                </th>
                {!isViewer && <th className="py-3.5 px-3 text-center w-14">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e3e4] text-[#191c1d] text-xs md:text-sm font-normal">
              {loading ? (
                <tr>
                  <td colSpan={isViewer ? 7 : 8} className="py-12 text-center text-[#585f6c]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#006948]" />
                      <p className="font-medium">Memuat data kas transaksi...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((tx, index) => {
                  const pemasukanNum = Number(tx.pemasukan) || 0;
                  const pengeluaranNum = Number(tx.pengeluaran) || 0;
                  const saldoNum = Number(tx.saldo) || 0;

                  return (
                    <tr 
                      key={tx.id || index}
                      className="hover:bg-emerald-50/40 transition-colors group"
                    >
                      {/* 1. No */}
                      <td className="py-3 px-4 text-center font-mono font-medium text-[#585f6c] border-r border-[#e1e3e4]">
                        {index + 1}
                      </td>

                      {/* 2. Tanggal */}
                      <td className="py-3 px-4 font-medium whitespace-nowrap text-[#191c1d] border-r border-[#e1e3e4]">
                        {tx.tanggal}
                      </td>

                      {/* 3. Nama / Keterangan */}
                      <td className="py-3 px-4 font-semibold text-[#191c1d] border-r border-[#e1e3e4]">
                        {tx.keterangan}
                      </td>

                      {/* 4. Pemasukan */}
                      <td className="py-3 px-4 text-right font-semibold text-[#006948] whitespace-nowrap border-r border-[#e1e3e4]">
                        {pemasukanNum > 0 ? formatRupiah(pemasukanNum) : '-'}
                      </td>

                      {/* 5. Pengeluaran */}
                      <td className="py-3 px-4 text-right font-semibold text-[#ba1a1a] whitespace-nowrap border-r border-[#e1e3e4]">
                        {pengeluaranNum > 0 ? formatRupiah(pengeluaranNum) : '-'}
                      </td>

                      {/* 6. Saldo */}
                      <td className="py-3 px-4 text-right font-bold text-[#191c1d] whitespace-nowrap bg-[#fbfcfb] border-r border-[#e1e3e4]">
                        {formatRupiah(saldoNum)}
                      </td>

                      {/* 7. PJ */}
                      <td className="py-3 px-4 text-[#585f6c] font-medium whitespace-nowrap border-r border-[#e1e3e4]">
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                          {tx.pj || '-'}
                        </span>
                      </td>

                      {/* 8. Aksi */}
                      {!isViewer && (
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleDelete(tx.id)}
                            title="Hapus baris"
                            className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isViewer ? 7 : 8} className="py-12 text-center text-[#585f6c]">
                    <p className="font-medium text-sm">Tidak ada baris data transaksi yang cocok.</p>
                    {!isViewer && (
                      <button
                        onClick={() => setShowForm(true)}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#006948] hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Klik di sini untuk input data pertama</span>
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Stats */}
        <div className="bg-[#f8f9fa] px-6 py-3.5 border-t border-[#e1e3e4] flex flex-col sm:flex-row items-center justify-between text-xs text-[#585f6c] gap-2">
          <span>Menampilkan {filtered.length} transaksi (Urutan tanggal lama ke baru)</span>
          <div className="flex items-center gap-4">
            <span className="font-medium">Total Pemasukan: <strong className="text-[#006948]">{formatRupiah(totalPemasukan)}</strong></span>
            <span className="font-medium">Total Pengeluaran: <strong className="text-[#ba1a1a]">{formatRupiah(totalPengeluaran)}</strong></span>
          </div>
        </div>
      </div>

    </div>
  );
};
