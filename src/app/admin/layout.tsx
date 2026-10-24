'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Ticket, Activity, Users, Settings, LogOut as LogOutIcon, Sparkles, User, ChevronDown, UserCog } from 'lucide-react';
import { useVendorStore } from '../../lib/store';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logoutMerchant } = useVendorStore();
  
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { href: '/admin', icon: Activity, label: 'Overview' },
    { href: '/admin/tickets', icon: Ticket, label: 'Support Tickets' },
    { href: '/admin/users', icon: Users, label: 'Manage Users' },
    { href: '/admin/settings', icon: Settings, label: 'Platform Settings' },
  ];

  const handleLogout = () => {
    logoutMerchant();
    router.push('/');
  };

  return (
    <div className="flex flex-col h-screen bg-bg-primary font-sans text-text-primary overflow-hidden">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between vendor-navbar px-4 md:px-6 shadow-xs border-b border-border-brand/40 shrink-0 backdrop-blur-md">
        
        {/* Left Column: Logo & Badge */}
        <div className="flex-1 flex items-center gap-3">
          <Link href="/admin" className="flex items-center hover:opacity-90 active:scale-[0.98] transition-all duration-200 shrink-0">
            <img src="/logo.png?v=3" alt="BokSpot Logo" className="h-8 md:h-9 object-contain" />
          </Link>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-2xs select-none hidden md:inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>Super Admin</span>
          </span>
        </div>

        {/* Center Column: Navigation Links (Compact Executive Pill Dock) */}
        <div className="hidden lg:flex flex-none justify-center">
          <nav className="p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] shadow-inner relative flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-tight hover:scale-[1.01] active:scale-[0.98] relative z-10 transition-colors flex items-center justify-center gap-1.5 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeAdminNavIndicator"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#ff7b47] shadow-[0_2px_10px_rgba(255,99,37,0.35)] -z-10"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <item.icon size={13} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Column: Profile Dropdown */}
        <div className="flex-1 flex items-center justify-end gap-3">
          <div className="relative animate-fade-in" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl border border-white/20 hover:border-white/35 bg-white/10 hover:bg-white/15 px-3 py-1.5 text-xs font-bold text-white transition-all cursor-pointer select-none shadow-xs"
              aria-label="Toggle profile menu"
              title="Admin Profile Settings"
            >
              <div className="h-5 w-5 rounded-lg bg-white/20 flex items-center justify-center shrink-0 shadow-2xs">
                <Shield size={11} strokeWidth={2.5} className="text-white" />
              </div>
              <span className="text-[12px]">System Admin</span>
              <ChevronDown className={`h-3 w-3 text-white/80 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-bg-secondary rounded-2xl shadow-2xl border border-border-brand z-50 overflow-hidden animate-fade-in text-left profile-dropdown-card">
                {/* Profile Header */}
                <div className="px-5 py-3.5 flex flex-col items-center min-w-0 text-center bg-bg-secondary">
                  <div className="relative mb-2">
                    <div className="h-12 w-12 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center text-xl font-bold">
                      A
                    </div>
                    <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs">
                      <Shield size={9} className="text-indigo-500" />
                    </div>
                  </div>
                  <span className="font-extrabold text-sm truncate max-w-full text-text-primary capitalize">
                    System Admin
                  </span>
                  <span className="text-[10px] text-indigo-400 mt-0.5 font-black uppercase tracking-widest truncate max-w-full">
                    Console Root
                  </span>
                  
                  <Link 
                    href="/admin/settings" 
                    onClick={() => setProfileOpen(false)}
                    className="mt-3 px-3.5 py-1.5 flex items-center justify-center gap-1.5 rounded-xl border border-border-brand text-xs font-semibold text-text-secondary hover:bg-white/5 transition-colors w-full"
                  >
                    <UserCog className="h-3.5 w-3.5" />
                    <span>Manage Account</span>
                  </Link>
                </div>

                <div className="border-t border-border-brand py-1">
                  <button 
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-5 py-2 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOutIcon className="h-4 w-4 text-red-400 shrink-0" />
                    <span className="text-xs font-semibold text-red-400">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 relative custom-scrollbar">
        {/* Subtle Background Gradients */}
        <div className="absolute top-[-30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#0a3161]/8 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#ff6325]/5 blur-[100px] pointer-events-none" />
        
        {/* Clean Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-[0.02]" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
