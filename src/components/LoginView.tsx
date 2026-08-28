import React, { useState } from 'react';
import { 
  LogIn, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  X,
  Shield, 
  Coins, 
  Loader2, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AppUser, UserRole } from '../types';

interface LoginViewProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AppUser) => void;
}

export const DEFAULT_USERS: { [key: string]: AppUser & { password: string; description: string } } = {
  admin: {
    id: 'usr_admin',
    username: 'adminremusha',
    name: 'Admin Remusha',
    password: 'remusha0405',
    role: 'admin',
    roleLabel: 'Admin Remusha',
    description: 'Akses Penuh: Input, Edit, Hapus, Rekap Keuangan & Pengaturan.'
  },
  bendahara: {
    id: 'usr_bendahara',
    username: 'bendahara',
    name: 'Bendahara',
    password: 'remusha0405',
    role: 'bendahara',
    roleLabel: 'Bendahara',
    description: 'Akses Keuangan: Pencatatan Kas & Transaksi.'
  },
  viewer: {
    id: 'usr_viewer',
    username: 'viewer',
    name: 'Viewer',
    password: 'viewer',
    role: 'viewer',
    roleLabel: 'Viewer',
    description: 'Akses Publik: Melihat ringkasan saldo & rekap kas terbuka.'
  }
};

const LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfYOLZ7e9lvJ-cMzhGg05GNrj_ipiPoYC6gAgb4EDcAVsEoqU1_ayxPtS4xwkZoab9FrMPQnlRV1E7jbLeuwiOxS5kHphVKGIT0aul8ATbcFnaxSwAMsdgQ38KzRodVUoVAD4Y2-nXCpwDMioLv1pyqr4cuyGtsmsswZTxvThRgBaZZ3_wLmj6YN9LDOb5xZdvFghW3mUjc5z5dd8CYgJxDZ1Z_WoDBu5xLayvw8bZIFUG8oLVEMHvYg';

export const LoginView: React.FC<LoginViewProps> = ({ isOpen, onClose, onLogin }) => {
  // Login Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Authenticate user against Supabase DB or Fallback
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const trimmedUser = username.trim().toLowerCase();

    if (!trimmedUser) {
      setError('Masukkan username atau akun Anda.');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError('Masukkan password untuk login.');
      setIsLoading(false);
      return;
    }

    try {
      let loggedInUser: AppUser | null = null;

      // 1. Check Supabase Database
      if (isSupabaseConfigured) {
        const { data: dbUser } = await supabase
          .from('users')
          .select('*')
          .eq('username', trimmedUser)
          .maybeSingle();

        if (dbUser) {
          if (dbUser.password && dbUser.password !== password) {
            setError('Password yang Anda masukkan salah.');
            setIsLoading(false);
            return;
          }

          loggedInUser = {
            id: String(dbUser.id),
            name: dbUser.name || (dbUser.role === 'admin' ? 'Admin Remusha' : dbUser.role === 'bendahara' ? 'Bendahara' : 'Viewer'),
            username: dbUser.username,
            role: dbUser.role as UserRole,
            roleLabel: dbUser.role_label || (dbUser.role === 'admin' ? 'Admin Remusha' : dbUser.role === 'bendahara' ? 'Bendahara' : 'Viewer')
          };
        }
      }

      // 2. Fallback to Default Users if not found in Supabase
      if (!loggedInUser) {
        const defaultMatch = Object.values(DEFAULT_USERS).find(
          u => u.username.toLowerCase() === trimmedUser || 
               (trimmedUser === 'admin' && u.username === 'adminremusha') ||
               (trimmedUser === 'jamaah' && u.username === 'viewer')
        );

        if (defaultMatch) {
          if (defaultMatch.password && defaultMatch.password !== password) {
            setError('Password yang Anda masukkan salah.');
            setIsLoading(false);
            return;
          }
          loggedInUser = defaultMatch;
        } else {
          // Check local registered users in localStorage
          const localStored = localStorage.getItem('remusha_local_users');
          if (localStored) {
            const localUsers: any[] = JSON.parse(localStored);
            const found = localUsers.find(u => u.username.toLowerCase() === trimmedUser);
            if (found) {
              if (found.password !== password) {
                setError('Password yang Anda masukkan salah.');
                setIsLoading(false);
                return;
              }
              loggedInUser = found;
            }
          }
        }
      }

      if (loggedInUser) {
        setSuccess(`Login berhasil sebagai ${loggedInUser.roleLabel}!`);
        setTimeout(() => {
          onLogin(loggedInUser);
          onClose();
        }, 500);
      } else {
        setError('Akun tidak ditemukan. Pastikan username dan password benar.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Terjadi kendala saat menghubungkan ke database.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuickAccount = (userKey: 'admin' | 'bendahara') => {
    setUsername(DEFAULT_USERS[userKey].username);
    setPassword('');
    setError(null);
  };

  return (
    <div 
      id="login-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="login-modal-content"
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#e1e3e4] text-center relative z-10 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-14 h-14 bg-[#006948]/10 rounded-2xl flex items-center justify-center mb-2.5 shadow-inner">
            <img 
              src={LOGO_URL} 
              alt="REMUSHA Logo" 
              className="w-10 h-10 rounded-xl object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#006948] tracking-tight">Login Pengurus</h2>
          <p className="text-xs text-[#585f6c] mt-0.5">
            Masuk untuk mengakses fitur pencatatan dan pengelolaan kas
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-semibold mb-4 border border-red-200 text-left flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-semibold mb-4 border border-emerald-200 text-left flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-left mb-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#191c1d] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#006948]" />
              <span>Username</span>
            </label>
            <input 
              type="text" 
              placeholder="adminremusha / bendahara"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006948] transition-all"
              autoFocus
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
                placeholder="Masukkan password akun"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006948] transition-all"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
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
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            <span>{isLoading ? 'Memverifikasi...' : 'Masuk Sekarang'}</span>
          </button>
        </form>

        {/* Quick Fill Helper */}
        <div className="pt-3 border-t border-[#e1e3e4]">
          <p className="text-[11px] text-[#585f6c] mb-2 font-medium">Pilih akun pengurus untuk mengisi username:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSelectQuickAccount('admin')}
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl text-left transition-all text-xs flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-[#006948] shrink-0" />
              <div className="overflow-hidden">
                <div className="font-bold text-[#191c1d] truncate">Admin</div>
                <div className="text-[10px] text-[#585f6c] truncate">adminremusha</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleSelectQuickAccount('bendahara')}
              className="p-2.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-xl text-left transition-all text-xs flex items-center gap-2 cursor-pointer"
            >
              <Coins className="w-4 h-4 text-amber-700 shrink-0" />
              <div className="overflow-hidden">
                <div className="font-bold text-[#191c1d] truncate">Bendahara</div>
                <div className="text-[10px] text-[#585f6c] truncate">bendahara</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
