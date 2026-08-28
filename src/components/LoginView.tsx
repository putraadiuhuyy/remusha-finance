import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
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
  Users,
  Database,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AppUser, UserRole } from '../types';

interface LoginViewProps {
  onLogin: (user: AppUser) => void;
}

// Default Fallback Users
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
  const [activeMode, setActiveMode] = useState<'login' | 'register'>('login');
  
  // Login Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Register Form State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('bendahara');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Authenticate user against Supabase DB
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const trimmedUser = username.trim().toLowerCase();

    if (!trimmedUser) {
      setError('Masukkan username atau email Anda.');
      setIsLoading(false);
      return;
    }

    try {
      let loggedInUser: AppUser | null = null;

      // 1. Check Supabase Database
      if (isSupabaseConfigured) {
        const { data: dbUser, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('username', trimmedUser)
          .maybeSingle();

        if (dbUser) {
          // If password is required and doesn't match
          if (dbUser.password && dbUser.password !== password) {
            setError('Password yang Anda masukkan salah.');
            setIsLoading(false);
            return;
          }

          loggedInUser = {
            id: String(dbUser.id),
            name: dbUser.name,
            username: dbUser.username,
            role: dbUser.role as UserRole,
            roleLabel: dbUser.role_label || (dbUser.role === 'admin' ? 'Ketua Takmir' : 'Pengurus Kas')
          };
        }
      }

      // 2. Fallback to Local/Default Users if not found in Supabase
      if (!loggedInUser) {
        const defaultMatch = Object.values(DEFAULT_USERS).find(
          u => u.username.toLowerCase() === trimmedUser
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
        onLogin(loggedInUser);
      } else {
        setError('Akun tidak ditemukan di database. Silakan gunakan tombol Akses Cepat atau daftar akun baru.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Terjadi kendala saat menghubungkan ke database.');
    } finally {
      setIsLoading(false);
    }
  };

  // Register new user into Supabase DB
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const cleanUsername = regUsername.trim().toLowerCase();
    const cleanName = regName.trim();

    if (!cleanName || !cleanUsername || !regPassword) {
      setError('Semua kolom pendaftaran wajib diisi.');
      setIsLoading(false);
      return;
    }

    const roleLabelMap: Record<UserRole, string> = {
      admin: 'Ketua Takmir / Administrator',
      bendahara: 'Bendahara Kas',
      viewer: 'Jamaah (Mode Transparansi)'
    };

    const newUserObj = {
      name: cleanName,
      username: cleanUsername,
      password: regPassword,
      role: regRole,
      role_label: roleLabelMap[regRole]
    };

    try {
      if (isSupabaseConfigured) {
        const { data, error: insertError } = await supabase
          .from('users')
          .insert([newUserObj])
          .select();

        if (insertError) {
          if (insertError.code === '23505') {
            throw new Error('Username sudah terdaftar di database.');
          }
          console.warn('Supabase register notice, saving locally:', insertError);
        }
      }

      // Save also to local storage
      const localStored = localStorage.getItem('remusha_local_users');
      const localUsers = localStored ? JSON.parse(localStored) : [];
      localUsers.push(newUserObj);
      localStorage.setItem('remusha_local_users', JSON.stringify(localUsers));

      setSuccess('Pendaftaran berhasil! Akun telah tersimpan di database.');
      
      // Auto login after 1.5s
      setTimeout(() => {
        onLogin({
          id: 'usr_' + Date.now(),
          name: cleanName,
          username: cleanUsername,
          role: regRole,
          roleLabel: roleLabelMap[regRole]
        });
      }, 1200);

    } catch (err: any) {
      setError(err.message || 'Gagal mendaftarkan pengguna baru.');
    } finally {
      setIsLoading(false);
    }
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
      {/* Background Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-white/40 text-center animate-fade-in relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-5">
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
          <p className="text-xs text-[#585f6c] mt-1 font-medium flex items-center gap-1.5 justify-center">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Database Authentication Supabase Aktif</span>
          </p>
        </div>

        {/* Tab Switcher: Login vs Daftar Akun */}
        <div className="flex items-center bg-[#f0f2f1] p-1 rounded-2xl mb-5 border border-[#e1e3e4]">
          <button
            type="button"
            onClick={() => { setActiveMode('login'); setError(null); setSuccess(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeMode === 'login' 
                ? 'bg-white text-[#006948] shadow-xs' 
                : 'text-[#585f6c] hover:text-[#191c1d]'
            }`}
          >
            Masuk (Login)
          </button>
          <button
            type="button"
            onClick={() => { setActiveMode('register'); setError(null); setSuccess(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeMode === 'register' 
                ? 'bg-white text-[#006948] shadow-xs' 
                : 'text-[#585f6c] hover:text-[#191c1d]'
            }`}
          >
            Daftar Takmir Baru
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs font-semibold mb-4 border border-red-200 text-left flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl text-xs font-semibold mb-4 border border-emerald-200 text-left flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* FORM 1: LOGIN */}
        {activeMode === 'login' ? (
          <>
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-left mb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#191c1d] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#006948]" />
                  <span>Username / Akun Database</span>
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
                    placeholder="Masukkan password akun"
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
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                <span>{isLoading ? 'Memverifikasi...' : 'Masuk Melalui Database'}</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-2 items-center mb-4">
              <div className="flex-grow border-t border-[#e1e3e4]"></div>
              <span className="shrink mx-3 text-[11px] font-bold text-[#585f6c] uppercase tracking-wider">
                Akses Cepat Akun Default
              </span>
              <div className="flex-grow border-t border-[#e1e3e4]"></div>
            </div>

            {/* 3 Quick Role Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Admin */}
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
                  <p className="text-[10px] text-[#585f6c] mt-0.5 leading-tight">user: admin</p>
                </div>
              </button>

              {/* Bendahara */}
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
                  <p className="text-[10px] text-[#585f6c] mt-0.5 leading-tight">user: bendahara</p>
                </div>
              </button>

              {/* Jamaah */}
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
          </>
        ) : (
          /* FORM 2: REGISTER */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-left mb-4 animate-fade-in">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#191c1d]">Nama Lengkap Pengurus</label>
              <input 
                type="text" 
                placeholder="Contoh: Ust. Salman Al-Farisi"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006948] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#191c1d]">Username Baru (Huruf Kecil)</label>
              <input 
                type="text" 
                placeholder="Contoh: salman"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006948] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#191c1d]">Password</label>
              <input 
                type="password" 
                placeholder="Buat password akun"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006948] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#191c1d]">Peran / Hak Akses</label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006948] transition-all font-medium"
              >
                <option value="admin">Ketua Takmir (Admin - Akses Penuh)</option>
                <option value="bendahara">Bendahara (Finance - Input Kas)</option>
                <option value="viewer">Jamaah (Viewer - Hanya Lihat)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 bg-[#006948] hover:bg-[#005137] text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              <span>{isLoading ? 'Mendaftarkan...' : 'Simpan User ke Database'}</span>
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="text-[11px] text-[#585f6c] mt-5">
          🔒 Terenkripsi &amp; Terhubung dengan Database Supabase
        </p>

      </div>
    </div>
  );
};
