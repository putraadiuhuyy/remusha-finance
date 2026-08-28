import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LogIn, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Coins,
  Users
} from 'lucide-react';
import { AppUser } from '../types';

interface LoginViewProps {
  onLogin: (user: AppUser) => void;
}

// Pre-configured Default Users
export const DEFAULT_USERS: { [key: string]: AppUser & { password: string; description: string } } = {
  admin: {
    id: 'usr_admin',
    username: 'admin',
    name: 'Ust. H. Ahmad Fauzi',
    password: 'admin',
    role: 'admin',
    roleLabel: 'Ketua Takmir / Administrator',
    description: 'Akses Penuh: Input, Edit, Hapus, Rekap Keuangan & Pengaturan.'
  },
  bendahara: {
    id: 'usr_bendahara',
    username: 'bendahara',
    name: 'H. Syarifuddin, SE',
    password: 'bendahara',
    role: 'bendahara',
    roleLabel: 'Bendahara Kas',
    description: 'Akses Keuangan: Pencatatan Infaq, Pengeluaran & Sinkronisasi.'
  },
  viewer: {
    id: 'usr_viewer',
    username: 'jamaah',
    name: 'Jamaah Masjid',
    password: '',
    role: 'viewer',
    roleLabel: 'Jamaah (Mode Transparansi)',
    description: 'Akses Publik: Melihat ringkasan saldo, grafik & laporan terbuka.'
  }
};

const LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfYOLZ7e9lvJ-cMzhGg05GNrj_ipiPoYC6gAgb4EDcAVsEoqU1_ayxPtS4xwkZoab9FrMPQnlRV1E7jbLeuwiOxS5kHphVKGIT0aul8ATbcFnaxSwAMsdgQ38KzRodVUoVAD4Y2-nXCpwDMioLv1pyqr4cuyGtsmsswZTxvThRgBaZZ3_wLmj6YN9LDOb5xZdvFghW3mUjc5z5dd8CYgJxDZ1Z_WoDBu5xLayvw8bZIFUG8oLVEMHvYg';

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      
      // Check if matches admin
      if ((trimmedUser === 'admin' || trimmedUser === 'admin@remusha.id') && password === 'admin') {
        onLogin(DEFAULT_USERS.admin);
        setIsLoading(false);
        return;
      }
      
      // Check if matches bendahara
      if ((trimmedUser === 'bendahara' || trimmedUser === 'bendahara@remusha.id') && password === 'bendahara') {
        onLogin(DEFAULT_USERS.bendahara);
        setIsLoading(false);
        return;
      }

      // Check if generic login
      if (trimmedUser && password) {
        // Allow custom user login as Takmir
        const customUser: AppUser = {
          id: 'usr_' + Date.now(),
          username: trimmedUser,
          name: username,
          role: 'admin',
          roleLabel: 'Pengurus Takmir'
        };
        onLogin(customUser);
        setIsLoading(false);
        return;
      }

      setError('Username atau password tidak valid. Silakan gunakan tombol Akses Cepat di bawah.');
      setIsLoading(false);
    }, 400);
  };

  const handleQuickLogin = (userKey: 'admin' | 'bendahara' | 'viewer') => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin(DEFAULT_USERS[userKey]);
      setIsLoading(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#063c2b] via-[#005137] to-[#003423] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-white/40 text-center animate-fade-in relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[#006948]/10 rounded-2xl flex items-center justify-center mb-3 shadow-inner">
            <img 
              src={LOGO_URL} 
              alt="REMUSHA Logo" 
              className="w-12 h-12 rounded-xl object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#006948] tracking-tight">REMUSHA Finance</h2>
          <p className="text-xs text-[#585f6c] mt-1 font-medium">Sistem Transparansi Keuangan &amp; Kas Masjid</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-semibold mb-4 border border-red-200 text-left animate-fade-in">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleCustomLogin} className="space-y-3.5 text-left mb-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#191c1d] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#006948]" />
              <span>Username / Email</span>
            </label>
            <input 
              type="text" 
              placeholder="Contoh: admin atau bendahara"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006948] transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#191c1d] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#006948]" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006948] transition-all"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-[#006948] hover:bg-[#005137] text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoading ? 'Memproses...' : 'Masuk ke Aplikasi'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-[#e1e3e4]"></div>
          <span className="shrink mx-3 text-[11px] font-bold text-[#585f6c] uppercase tracking-wider">
            Atau Akses Cepat (1-Klik)
          </span>
          <div className="flex-grow border-t border-[#e1e3e4]"></div>
        </div>

        {/* 3 Quick Role Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          
          {/* 1. Admin */}
          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className="p-3 bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-2xl text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="p-1.5 bg-[#006948] text-white rounded-lg">
                <Shield className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-200/60 px-1.5 py-0.5 rounded">
                Admin
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#191c1d] group-hover:text-[#006948]">Ketua Takmir</h4>
              <p className="text-[10px] text-[#585f6c] mt-0.5 leading-tight">Akses Penuh</p>
            </div>
          </button>

          {/* 2. Bendahara */}
          <button
            type="button"
            onClick={() => handleQuickLogin('bendahara')}
            className="p-3 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/80 rounded-2xl text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="p-1.5 bg-amber-600 text-white rounded-lg">
                <Coins className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] font-mono text-amber-800 font-bold bg-amber-200/60 px-1.5 py-0.5 rounded">
                Finance
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#191c1d] group-hover:text-amber-800">Bendahara</h4>
              <p className="text-[10px] text-[#585f6c] mt-0.5 leading-tight">Input &amp; Mutasi</p>
            </div>
          </button>

          {/* 3. Jamaah / Viewer */}
          <button
            type="button"
            onClick={() => handleQuickLogin('viewer')}
            className="p-3 bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/80 rounded-2xl text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="p-1.5 bg-blue-600 text-white rounded-lg">
                <Users className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] font-mono text-blue-800 font-bold bg-blue-200/60 px-1.5 py-0.5 rounded">
                Viewer
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#191c1d] group-hover:text-blue-800">Jamaah</h4>
              <p className="text-[10px] text-[#585f6c] mt-0.5 leading-tight">Mode Pantau</p>
            </div>
          </button>

        </div>

        {/* Footer info */}
        <p className="text-[11px] text-[#585f6c] mt-5">
          🔒 Sistem Otentikasi Keuangan Terpadu Masjid Remusha
        </p>

      </div>
    </div>
  );
};
