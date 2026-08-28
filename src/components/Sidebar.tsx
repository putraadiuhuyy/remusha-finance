import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  FileSpreadsheet, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Eye,
  Shield,
  Coins,
  Users,
  Building2
} from 'lucide-react';
import { NavTab, AppUser } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onLogoutClick: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  currentUser?: AppUser | null;
}

const LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfYOLZ7e9lvJ-cMzhGg05GNrj_ipiPoYC6gAgb4EDcAVsEoqU1_ayxPtS4xwkZoab9FrMPQnlRV1E7jbLeuwiOxS5kHphVKGIT0aul8ATbcFnaxSwAMsdgQ38KzRodVUoVAD4Y2-nXCpwDMioLv1pyqr4cuyGtsmsswZTxvThRgBaZZ3_wLmj6YN9LDOb5xZdvFghW3mUjc5z5dd8CYgJxDZ1Z_WoDBu5xLayvw8bZIFUG8oLVEMHvYg';

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogoutClick,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  currentUser
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'beranda', label: 'Beranda', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'transaksi', label: 'Transaksi', icon: <Wallet className="w-5 h-5" /> },
    { id: 'rekap', label: 'Rekap Keuangan', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { id: 'pengaturan', label: 'Pengaturan', icon: <Settings className="w-5 h-5" /> },
  ];

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-3 h-3 text-emerald-700" />;
      case 'bendahara':
        return <Coins className="w-3 h-3 text-amber-700" />;
      default:
        return <Users className="w-3 h-3 text-blue-700" />;
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'bendahara':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <nav id="mobile-top-nav" className="md:hidden fixed top-0 left-0 w-full z-40 flex justify-between items-center px-4 h-16 bg-white border-b border-[#e1e3e4] shadow-xs">
        <div className="flex items-center gap-2.5">
          <img 
            src={LOGO_URL} 
            alt="REMUSHA Finance Logo" 
            className="h-8 w-8 rounded-lg object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span className="font-bold text-[#006948] text-base leading-tight">REMUSHA Finance</span>
            <span className="text-[11px] text-[#585f6c]">{currentUser?.name || 'Viewer'}</span>
          </div>
        </div>
        <button 
          id="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#006948] hover:bg-[#f3f4f5] rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-drawer-backdrop"
          className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            id="mobile-drawer-content"
            className="w-72 bg-white h-full p-5 flex flex-col shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#edeeef] mb-4">
              <div className="flex items-center gap-3">
                <img src={LOGO_URL} alt="REMUSHA Logo" className="h-9 w-9 rounded-lg" />
                <div>
                  <h1 className="font-extrabold text-[#006948] text-base leading-tight">REMUSHA<br />Finance</h1>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${getRoleBadge(currentUser?.role)}`}>
                    {getRoleIcon(currentUser?.role)}
                    <span>{currentUser?.roleLabel || 'Viewer'}</span>
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1.5 flex-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-btn-${item.id}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#dce2f3] text-[#151c27] font-bold shadow-xs'
                        : 'text-[#3d4a42] hover:bg-[#f3f4f5] hover:text-[#006948]'
                    }`}
                  >
                    <span className={isActive ? 'text-[#006948]' : 'text-[#585f6c]'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#edeeef]">
              <button
                id="mobile-logout-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogoutClick();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-xl transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Ganti Akun / Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop / Tablet Sidebar */}
      <aside 
        id="desktop-sidebar"
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen p-4 z-40 border-r border-[#bccac0]/40 bg-white w-64 shadow-xs"
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-5 px-2">
          <img 
            src={LOGO_URL} 
            alt="REMUSHA Finance Logo" 
            className="h-10 w-10 rounded-xl object-cover shadow-xs" 
          />
          <div>
            <h1 className="text-xl font-black text-[#006948] tracking-tight leading-tight">
              REMUSHA<br />Finance
            </h1>
            <p className="text-[11px] text-[#585f6c] font-medium mt-0.5">
              Portal Kas Masjid
            </p>
          </div>
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="mb-4 p-3 bg-[#f8f9fa] rounded-2xl border border-[#e1e3e4] text-left">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-7 h-7 rounded-full bg-[#006948] text-white flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-[#191c1d] truncate">{currentUser.name}</h4>
                <p className="text-[10px] text-[#585f6c] truncate">@{currentUser.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getRoleBadge(currentUser.role)}`}>
                {getRoleIcon(currentUser.role)}
                <span>{currentUser.roleLabel}</span>
              </span>
            </div>
          </div>
        )}

        {/* Navigation items */}
        <nav className="flex flex-col gap-1.5 flex-grow">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`desktop-nav-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#dce2f3] text-[#151c27] font-bold scale-[0.98] shadow-xs'
                    : 'text-[#3d4a42] hover:bg-[#f3f4f5] hover:text-[#006948]'
                }`}
              >
                <span className={`transition-colors ${isActive ? 'text-[#006948]' : 'text-[#585f6c] group-hover:text-[#006948]'}`}>
                  {item.icon}
                </span>
                <span className="tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-3 border-t border-[#edeeef] flex flex-col gap-2">
          <div className="bg-[#f8f9fa] rounded-lg p-2.5 flex items-center gap-2 border border-[#edeeef]">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[11px] text-[#585f6c] font-medium">Kas Terbuka Transparan</span>
          </div>

          <button
            id="desktop-logout-btn"
            onClick={onLogoutClick}
            className="flex items-center gap-3 text-[#585f6c] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/30 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Ganti Akun / Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
