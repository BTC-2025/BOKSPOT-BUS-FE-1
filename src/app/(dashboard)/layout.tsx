'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Calendar, BookOpen, Settings, QrCode, 
  Package, Menu, X, Bell, LogOut, Stethoscope, Dumbbell, Bed, 
  Scissors, Utensils, ShieldAlert, Check, Trash2, Info,
  ChevronDown, Building, Building2, Film, Sparkles, LogOut as LogOutIcon, Laptop, User,
  Sun, Moon, Users, Mail, Search, UserCog, MapPin, Clock, ShieldCheck, MessageSquare, Calculator, Ticket, CheckCircle, Headset
} from 'lucide-react';
import { UtilityDrawer } from '@/components/UtilityDrawer';
import { LocationSelectorModal } from '@/components/LocationSelectorModal';
import { useState, useEffect, useRef } from 'react';
import { useVendorStore, PRESET_MERCHANTS } from '@/lib/store'; 
import { getArchetypeConfig } from '@/lib/businessDictionary';
import OnboardingWizard from './components/OnboardingWizard';
import { getVerticalFromCategory } from '@/lib/categoryUtils';

const staticNavItems = [
  { href: '/home/verify-code', icon: QrCode, label: 'Verify Code' },
  { href: '/workspace/hotel-staff-roster', icon: Users, label: 'Staff Management' },
  { href: '/tracks/customer-directory', icon: User, label: 'Customer Directory' },
  { href: '/workspace/settings', icon: Settings, label: 'Settings' },
  { href: '/workspace/contact-us', icon: Mail, label: 'Contact Us' },
];

interface NotificationItem {
  id: string;
  text: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentMerchant, logoutMerchant, switchStore, loginRole, theme, setTheme, supervisorId, bookings, services, updateMerchantProfile } = useVendorStore();
  const [utilityDrawerOpen, setUtilityDrawerOpen] = useState(false);
  const [activeUtilityTab, setActiveUtilityTab] = useState<'calendar' | 'calc' | 'tasks' | 'contacts' | null>(null);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [city, setCity] = useState('Chennai');
  const [status, setStatus] = useState<'idle' | 'detecting' | 'detected' | 'error'>('idle');
  const locationRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Spotlight Search State
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  


  // Profile Menu state
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Vendor Info state
  const [vendorInfoOpen, setVendorInfoOpen] = useState(false);
  const vendorInfoRef = useRef<HTMLDivElement>(null);

  // Stateful Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const storedCity = localStorage.getItem('bus-selected-city');
      if (storedCity) setCity(storedCity);
    }
    if (useVendorStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }
    const unsub = useVendorStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return () => unsub();
  }, []);

  // Pre-populate notifications based on merchant category
  useEffect(() => {
    if (currentMerchant) {
      const getMockNotifications = (): NotificationItem[] => {
        switch (getVerticalFromCategory(currentMerchant.category)) {
          case 'Dental':
            return [
              { id: '1', text: 'Aditya Sen checked in at clinic waiting room.', time: '10 mins ago', read: false, type: 'success' },
              { id: '2', text: 'New orthodontic braces scan request received from Meera Deshmukh.', time: '1 hour ago', read: false, type: 'info' },
              { id: '3', text: 'Dr. Apollo updated orthodontic scan files for Varun Nair.', time: '1 day ago', read: true, type: 'info' }
            ];
          case 'Fitness':
            return [
              { id: '1', text: 'Karan Mehra completed Kettlebell Romanian Deadlifts set logs.', time: '15 mins ago', read: false, type: 'success' },
              { id: '2', text: 'Sanjana Roy submitted macro constraints update request.', time: '2 hours ago', read: false, type: 'info' },
              { id: '3', text: 'ZenFit daily class grid updated for Yoga Vinyasa.', time: '1 day ago', read: true, type: 'info' }
            ];
          case 'Salon':
            return [
              { id: '1', text: 'Vikram Singh assigned as stylist to Rohan Sharma.', time: '5 mins ago', read: false, type: 'info' },
              { id: '2', text: 'Deepika Iyer haircut & wash invoice completed successfully.', time: '3 hours ago', read: false, type: 'success' },
              { id: '3', text: 'Weekly aesthetic treatment products stock restocked.', time: '2 days ago', read: true, type: 'info' }
            ];
          case 'Dining':
            return [
              { id: '1', text: 'Peanut allergy warning flagged for guest Anil Vasudevan (Table 4).', time: '12 mins ago', read: false, type: 'warning' },
              { id: '2', text: 'Pre-ordered risotto courses verified by Kitchen Head.', time: '40 mins ago', read: false, type: 'success' },
              { id: '3', text: 'Candlelight package booking confirmed for Prakash Raj (Table 12).', time: '5 hours ago', read: true, type: 'info' }
            ];
          default:
            return [];
        }
      };
      setNotifications(getMockNotifications());
    }
  }, [currentMerchant]);

  // Click outside to close notifications, store switcher, and profile popovers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      
      if (vendorInfoRef.current && !vendorInfoRef.current.contains(event.target as Node)) {
        setVendorInfoOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setLocationDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Poll NestJS backend to retrieve synchronized customer bookings in real-time
  useEffect(() => {
    if (!currentMerchant) return;

    const fetchSyncBookings = async () => {
      try {
        const res = await fetch('/api/v1/bookings/sync');
        if (!res.ok) return;
        const raw = await res.json();
        const data = Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
        if (data.length > 0) {
          const currentBookings = useVendorStore.getState().bookings;
          let changed = false;
          const merged = [...currentBookings];

          data.forEach((syncB: any) => {
            const index = merged.findIndex((b) => b.ref === syncB.ref || b.id === syncB.id);
            if (index === -1) {
              merged.unshift({
                ...syncB,
                merchantName: syncB.merchantName || currentMerchant.merchantName,
                merchantId: syncB.merchantId || currentMerchant.id,
                status: syncB.status === 'CONFIRMED' ? 'CONFIRMED' : (syncB.status || 'PENDING'),
              });
              changed = true;
            } else {
              // Update if status changed or data differs
              if (merged[index].status !== syncB.status) {
                merged[index] = { ...merged[index], ...syncB };
                changed = true;
              }
            }
          });

          if (changed) {
            useVendorStore.setState({ bookings: merged });
          }
        }
      } catch (err) {
        console.error('Error fetching sync bookings:', err);
      }
    };

    fetchSyncBookings();
    const interval = setInterval(fetchSyncBookings, 3000);
    return () => clearInterval(interval);
  }, [currentMerchant]);

  useEffect(() => {
    if (isMounted && hasHydrated && !currentMerchant) {
      window.location.href = '/';
    }
  }, [currentMerchant, isMounted, hasHydrated]);

  // Keypress listener for spotlight search toggling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen(prev => !prev);
        setSearchQuery('');
        setSpotlightIndex(0);
      }
      if (e.key === 'Escape') {
        setSpotlightOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isMounted || !hasHydrated || !currentMerchant) {
    return (
      <div className="min-h-screen bg-[#070a13] flex items-center justify-center">
        <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] animate-pulse">Checking credentials...</div>
      </div>
    );
  }

  const baseConfig = getArchetypeConfig(currentMerchant?.archetype || 'Service');
  const archetypeConfig = { ...baseConfig, ...(currentMerchant?.customDictionary || {}) };



  
  const allStores = currentMerchant 
    ? loginRole === 'supervisor'
      ? [currentMerchant]
      : [
          ...PRESET_MERCHANTS,
          ...Array.from(new Set(useVendorStore.getState().bookings
            .map(b => b.merchantName)))
            .map((name) => {
              const matchedPreset = PRESET_MERCHANTS.find(pm => pm.merchantName === name);
              if (matchedPreset) return matchedPreset;
              const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              // Find the category for this booking
              const bookingCat = useVendorStore.getState().bookings.find(b => b.merchantName === name)?.category || currentMerchant.category;
              return {
                id: `mer-${slug}`,
                username: currentMerchant.username,
                merchantName: name,
                category: bookingCat,
                logoLetter: name.charAt(0),
                aboutText: `Welcome to ${name}. We provide professional bookings and top-tier services.`
              };
            })
            .filter(m => !PRESET_MERCHANTS.some(pm => pm.merchantName === m.merchantName))
        ]
    : [];

  const CategoryIcon = archetypeConfig.servicesIcon;

  const handleLogout = () => {
    logoutMerchant();
    window.location.href = '/';
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(
      notifications.filter(n => n.id !== id)
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(n => ({ ...n, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getBnxMailId = () => {
    if (!currentMerchant) return '';
    const originalEmail = currentMerchant.email || '';
    if (loginRole === 'supervisor') {
      const supName = supervisorId || 'SUPERVISOR';
      // Clean up the email. Instead of T102/arena5@bnxmail.com, just show the actual corporate mail
      return originalEmail; 
    }
    return originalEmail;
  };

  const searchPages = [
    { label: 'Dashboard Home', href: '/home/dashboard-home', description: 'Main overview & logs', type: 'page', icon: LayoutDashboard },
    { label: 'Verify Code', href: '/home/verify-code', description: 'Check-in ticket codes', type: 'page', icon: QrCode },
    { label: 'Staff Management', href: '/workspace/hotel-staff-roster', description: 'Manage employee assignments', type: 'page', icon: Users },
    { label: 'Customer Directory', href: '/tracks/customer-directory', description: 'Diner database', type: 'page', icon: User },
    { label: 'Business Settings', href: '/workspace/settings', description: 'Working hours & profile details', type: 'page', icon: Settings },
    { label: 'Contact Us', href: '/workspace/contact-us', description: 'Support helpdesk & tickets', type: 'page', icon: Headset },
  ];

  const searchResults = searchQuery.trim() === '' ? [] : [
    ...searchPages.filter(p => p.label.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())),
    ...services
      .filter(s => s.merchant.toLowerCase() === currentMerchant?.merchantName.toLowerCase() && s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(s => ({
        label: s.name,
        href: '/workspace/my-services',
        description: `Listing · ₹${s.price} · ${s.duration} mins`,
        type: 'service',
        icon: Package
      })),
    ...bookings
      .filter(b => b.merchantName.toLowerCase() === currentMerchant?.merchantName.toLowerCase() && (
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.customerEmail || "").toLowerCase().includes(searchQuery.toLowerCase())
      ))
      .map(b => ({
        label: `${b.customerName} (${b.ref})`,
        href: '/tracks/bookings',
        description: `Booking · ${b.serviceName} · ${b.date} ${b.time}`,
        type: 'booking',
        icon: BookOpen
      }))
  ];  const getDynamicNavItems = () => {
    const isOwner = loginRole !== 'staff';
    const accessLink = isOwner ? { href: '/workspace/hotel-staff-roster', icon: Users, label: archetypeConfig.staffRosterLabel } : null;

    // HOME TAB (Dashboard & Quick Check-in)
    if (pathname === '/home/dashboard-home' || pathname === '/home/verify-code') {
      return [
        { href: '/home/dashboard-home', icon: LayoutDashboard, label: 'Dashboard Home' },
        { href: '/home/verify-code', icon: QrCode, label: archetypeConfig.scanLabel },
      ];
    } 
    // TRACKS TAB (Records & Patients)
    else if (pathname.startsWith('/tracks/bookings') || pathname === '/tracks/customer-directory') {
      return [
        { href: '/tracks/bookings', icon: BookOpen, label: archetypeConfig.bookingTitle },
        { href: '/tracks/customer-directory', icon: User, label: archetypeConfig.customerDirLabel },
      ];
    } 
    // WORKSPACE TAB (Management, Schedules, Settings)
    else {
      const currentArch = (currentMerchant?.archetype || '').toLowerCase();
      const isHotel = currentArch === 'hotel' || currentArch === 'accommodation' || (currentMerchant?.category?.toLowerCase() || '').includes('hotel') || (currentMerchant?.category?.toLowerCase() || '').includes('room');
      const items = [
        { href: '/workspace/my-services', icon: Package, label: 'My Services' }
      ];
      if (isHotel) {
        items.push({ href: '/workspace/hotel-room-matrix', icon: Building2, label: 'Room Grid' });
      }
      if (accessLink) items.push(accessLink);
      return items;
    }
  };

  let navItems = getDynamicNavItems();
  // Filter navItems based on activeModules if customized
  if (currentMerchant?.isCustomized) {
    const active = currentMerchant.activeModules || [];
    navItems = navItems.filter(item => {
      if (item.label === archetypeConfig.bookingTitle && !active.includes('bookings')) return false;
      if (item.label === archetypeConfig.staffTitle && !active.includes('staff')) return false;
      if (item.label === archetypeConfig.customerDirLabel && !active.includes('customers')) return false;
      if (item.label === 'My Services' && !active.includes('map')) return false;
      return true;
    });
  }
  const themeClass = archetypeConfig.themeClass;

  return (
    <>
      {currentMerchant?.isCustomized === false && !currentMerchant.id.startsWith('m-') && <OnboardingWizard />}
      <div className={`flex h-screen flex-col overflow-hidden bg-bg-primary text-text-primary ${themeClass}`}>
      {/* Top Header (100% width across the top) */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between vendor-navbar backdrop-blur-md pl-6 pr-0 shadow-md border-b border-border-brand/40 shrink-0">
        {/* Left Column: Logo & Location */}
        <div className="flex-1 flex items-center gap-6">
          <Link href="/home/dashboard-home" className="flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shrink-0">
            <img src="/logo.png?v=3" alt="BokSpot Logo" className="h-10 lg:h-12 object-contain" />
          </Link>
          
          <div className="relative hidden lg:inline-block">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/25 hover:border-white/40 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shadow-md text-xs font-bold tracking-wide"
            >
              <MapPin size={14} className={status === 'detecting' ? 'animate-bounce' : ''} />
              <span className="!text-white">{isMounted ? (city || 'Select Location') : 'Chennai'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200" style={{ transform: isLocationModalOpen ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          </div>
        </div>

        {/* Center Column: Floating Navigation Menu */}
        <div className="hidden lg:flex flex-none justify-center">
          <nav className="custom-nav-capsule shadow-lg relative">
            <Link
              href="/home/dashboard-home"
              className={`w-20 text-center py-1 text-[13px] font-extrabold tracking-wide hover:scale-[1.02] active:scale-[0.98] relative z-10 custom-nav-link ${
                (pathname === '/home/dashboard-home' || pathname === '/home/verify-code')
                  ? 'custom-nav-link-active'
                  : 'custom-nav-link-inactive'
              }`}
            >
              {(pathname === '/home/dashboard-home' || pathname === '/home/verify-code') && (
                <motion.div
                  layoutId="activeNavIndicatorAdmin"
                  className="absolute inset-0 rounded-full bg-[#ff6325] border border-white/30 shadow-[0_0_16px_rgba(255,99,37,0.45)] backdrop-blur-md -z-10 custom-nav-active-bg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              Home
            </Link>
            <Link
              href="/workspace/my-services"
              className={`w-28 text-center py-1 text-[13px] font-extrabold tracking-wide hover:scale-[1.02] active:scale-[0.98] relative z-10 custom-nav-link ${
                (!['/home/dashboard-home', '/home/verify-code'].includes(pathname) && !pathname.startsWith('/tracks/bookings') && pathname !== '/tracks/customer-directory')
                  ? 'custom-nav-link-active'
                  : 'custom-nav-link-inactive'
              }`}
            >
              {(!['/home/dashboard-home', '/home/verify-code'].includes(pathname) && !pathname.startsWith('/tracks/bookings') && pathname !== '/tracks/customer-directory') && (
                <motion.div
                  layoutId="activeNavIndicatorAdmin"
                  className="absolute inset-0 rounded-full bg-[#ff6325] border border-white/30 shadow-[0_0_16px_rgba(255,99,37,0.45)] backdrop-blur-md -z-10 custom-nav-active-bg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              Workspace
            </Link>
            <Link
              href="/tracks/bookings"
              className={`w-24 text-center py-1 text-[13px] font-extrabold tracking-wide hover:scale-[1.02] active:scale-[0.98] relative z-10 custom-nav-link ${
                (pathname.startsWith('/tracks/bookings') || pathname === '/tracks/customer-directory')
                  ? 'custom-nav-link-active'
                  : 'custom-nav-link-inactive'
              }`}
            >
              {(pathname.startsWith('/tracks/bookings') || pathname === '/tracks/customer-directory') && (
                <motion.div
                  layoutId="activeNavIndicatorAdmin"
                  className="absolute inset-0 rounded-full bg-[#ff6325] border border-white/30 shadow-[0_0_16px_rgba(255,99,37,0.45)] backdrop-blur-md -z-10 custom-nav-active-bg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              Tracks
            </Link>
          </nav>
        </div>

        {/* Right Column: Actions (Search, Notification, Profile, Utility) */}
        <div className="flex-1 flex items-center justify-end gap-3.5 pl-4 lg:pl-6">
          {/* Spotlight Search Toggle Button */}
          <button
            onClick={() => setSpotlightOpen(true)}
            className="rounded-xl p-2 border border-white/25 hover:border-white/40 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1.5 pr-3 shadow-md"
            title="Search Console (⌘K)"
          >
            <Search className="h-3.5 w-3.5 text-white" />
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-white select-none hidden md:inline">Spotlight</span>
          </button>

          {/* Stateful Notifications Popover */}
          <div className="relative" ref={popoverRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center justify-center rounded-xl p-2 border border-white/25 hover:border-white/40 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shadow-md"
            >
              <Bell className="h-3.5 w-3.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#8b6508]" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 rounded-xl border border-border-brand bg-bg-tertiary p-4 shadow-2xl z-50 space-y-3 animate-fade-in notification-dropdown-card">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="rounded bg-[#8b6508]/10 text-[#fceea7] text-[9px] font-black px-1.5 py-0.5">{unreadCount} new</span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[10px] text-[#fceea7] hover:text-[#8b6508] font-bold transition-colors cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`group flex items-start gap-2.5 p-2.5 rounded-lg border transition-all ${
                          n.read 
                            ? 'border-transparent bg-transparent opacity-60' 
                            : 'border-white/5 bg-white/[0.01]'
                        }`}
                      >
                        <div className={`mt-0.5 p-1 rounded bg-white/5 ${
                          n.type === 'warning' ? 'text-amber-400' : n.type === 'success' ? 'text-emerald-400' : 'text-[#fceea7]'
                        }`}>
                          <Info size={11} />
                        </div>
                        
                        <div className="flex-1 space-y-0.5">
                          <p className="text-[10.5px] text-slate-200 leading-snug font-medium">{n.text}</p>
                          <span className="text-[9px] text-slate-500 block font-semibold">{n.time}</span>
                        </div>

                        <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.read && (
                            <button 
                              onClick={() => markAsRead(n.id)}
                              className="text-slate-500 hover:text-[#8b6508] transition-colors cursor-pointer"
                              title="Mark read"
                            >
                              <Check size={11} />
                            </button>
                          )}
                          <button 
                            onClick={() => deleteNotification(n.id)}
                            className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete notification"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs font-semibold">
                      No notifications found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative border-l border-white/10 pl-4 animate-fade-in" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-full border border-white/25 hover:border-white/40 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 text-xs font-bold text-white hover:text-white transition-all cursor-pointer select-none shadow-md"
              aria-label="Toggle profile menu"
              title="Partner Profile Settings"
            >
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#ff6325] to-[#ea580c] flex items-center justify-center shrink-0 shadow-sm overflow-hidden text-white font-black text-[11px] border border-white/30">
                {currentMerchant?.logoUrl ? (
                  <img src={currentMerchant.logoUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{(loginRole === 'supervisor' ? supervisorId : currentMerchant?.username || 'P').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span>{loginRole === 'supervisor' ? (supervisorId || 'Supervisor') : (currentMerchant.username || 'Partner')}</span>
              <ChevronDown className={`h-3 w-3 text-white transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-[320px] bg-bg-secondary rounded-2xl shadow-2xl border border-border-brand z-50 overflow-hidden animate-fade-in text-left profile-dropdown-card">
                {/* Google Style Profile Header */}
                <div className="px-6 py-4 flex flex-col items-center min-w-0 text-center bg-bg-secondary">
                  <div className="relative mb-2">
                    <div className="h-14 w-14 rounded-full bg-[#0a3161] text-white flex items-center justify-center text-2xl font-bold overflow-hidden shadow-sm">
                      {currentMerchant?.logoUrl ? (
                        <img src={currentMerchant.logoUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        (currentMerchant.username || 'P').charAt(0).toUpperCase()
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && currentMerchant) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const MAX_SIZE = 200;
                                let width = img.width;
                                let height = img.height;
                                if (width > height) {
                                  if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
                                } else {
                                  if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                                }
                                canvas.width = width;
                                canvas.height = height;
                                const ctx = canvas.getContext('2d');
                                ctx?.drawImage(img, 0, 0, width, height);
                                const compressed = canvas.toDataURL('image/jpeg', 0.6);
                                updateMerchantProfile(currentMerchant.id, {
                                  ...currentMerchant,
                                  logoUrl: compressed
                                });
                              };
                              img.src = reader.result as string;
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                    </label>
                  </div>
                  <span className="font-extrabold text-[15px] truncate max-w-full text-black dark:text-white capitalize">
                    {currentMerchant.username || 'Partner'}
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5 truncate max-w-full" title={getBnxMailId()}>
                    {getBnxMailId()}
                  </span>
                  
                  <Link 
                    href="/workspace/settings" 
                    onClick={() => setProfileOpen(false)}
                    className="mt-3 px-4 py-1.5 flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <UserCog className="h-4 w-4" />
                    <span>Manage your account</span>
                  </Link>
                </div>

                {/* Theme Selector */}
                <div className="border-t border-border-brand px-6 py-2.5 bg-slate-50/50 dark:bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Appearance</span>
                    <span className="text-[11px] font-extrabold capitalize text-[#8b6508] dark:text-[#d4af37]">{theme || 'System'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-white !text-slate-900 shadow-sm'
                          : '!text-slate-600 dark:!text-slate-400 hover:!text-slate-900 dark:hover:!text-white'
                      }`}
                    >
                      <Sun size={13} className={theme === 'light' ? '!text-amber-500' : ''} /> Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-slate-900 !text-white shadow-sm'
                          : '!text-slate-600 dark:!text-slate-400 hover:!text-slate-900 dark:hover:!text-white'
                      }`}
                    >
                      <Moon size={13} className={theme === 'dark' ? '!text-blue-400' : ''} /> Dark
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('system')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        theme === 'system'
                          ? 'bg-white dark:bg-slate-900 !text-slate-900 dark:!text-white shadow-sm'
                          : '!text-slate-600 dark:!text-slate-400 hover:!text-slate-900 dark:hover:!text-white'
                      }`}
                    >
                      <Laptop size={13} /> Auto
                    </button>
                  </div>
                </div>

                <div className="border-t border-border-brand py-1">
                  <button className="w-full flex items-center gap-4 px-6 py-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left cursor-pointer">
                    <User className="h-5 w-5 text-slate-500 shrink-0" />
                    <span className="text-[13px] font-semibold !text-slate-700 dark:!text-slate-200">Add another account</span>
                  </button>
                </div>

                <div className="border-t border-border-brand py-1">
                  <button 
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-4 px-6 py-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOutIcon className="h-5 w-5 text-red-500 shrink-0" />
                    <span className="text-[13px] font-semibold text-red-500">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Utility Drawer Button Box (50px wide column to align with right sidebar) */}
          <div className="w-[50px] shrink-0 h-full flex items-center justify-center border-l border-white/10">
            <button
              onClick={() => setUtilityDrawerOpen(!utilityDrawerOpen)}
              className={`relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#5a4409] hover:bg-[#72560c] border border-[#fceea7]/30 transition-all cursor-pointer shadow-md ${
                utilityDrawerOpen
                  ? 'opacity-100 scale-105 shadow-[0_0_10px_rgba(252,238,167,0.3)]'
                  : 'opacity-85 hover:opacity-100 hover:scale-105'
              }`}
              title="Bokspot Utilities"
            >
              <img src="/utility-icon.png?v=3" alt="Utilities" className="w-[22px] h-[22px] object-contain" />
            </button>
          </div>
        </div>
      </header>

      {/* New Horizontal Navigation Bar */}
      <div className={`bg-white/95 dark:bg-[#0f1624]/95 backdrop-blur-md flex items-center px-6 py-2.5 shrink-0 shadow-sm border-b border-border-brand/40 relative z-40 transition-all duration-300 ${
        utilityDrawerOpen ? (activeUtilityTab ? 'lg:pr-[370px]' : 'lg:pr-[50px]') : ''
      }`}>
        {/* Left side subscription link */}
        <div className="flex-1 hidden md:flex items-center justify-start pl-2">
          <Link
            href="/workspace/subscription"
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#0a3161] dark:text-[#ff6325] hover:opacity-80 transition-opacity"
          >
            <CheckCircle className="h-[14px] w-[14px] text-[#ff6325]" />
            Subscription
          </Link>
        </div>
        
        <div className="flex-auto overflow-x-auto custom-scrollbar flex justify-center">
          <nav className="flex items-center gap-2 md:gap-3 mx-auto px-1 w-max">
            {navItems.map((item) => {
              const active = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs uppercase tracking-wider font-extrabold transition-all whitespace-nowrap ${
                  active 
                    ? 'bg-[#0a3161] dark:bg-[#ff6325] !text-white shadow-md' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-[#ff6325] dark:hover:text-[#ff6325] hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon className={`h-4 w-4 ${active ? '!text-white' : 'text-slate-500 group-hover:text-[#ff6325]'}`} />
                <span className={active ? '!text-white' : ''}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        </div>
        
        {/* Right side icons and links */}
        <div className="flex-1 hidden md:flex items-center justify-end gap-5 pl-4 pr-2 relative">
          <Link
            href="/workspace/contact-us"
            className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#ff6325] dark:hover:text-[#ff6325] transition-colors"
            title="Support"
          >
            <Headset className="h-[15px] w-[15px] text-[#ff6325]" />
            Support
          </Link>
          <Link
            href="/workspace/settings"
            className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#946c07] dark:hover:text-[#d4af37] transition-colors"
            title="Settings"
          >
            <Settings className="h-[15px] w-[15px]" />
            Settings
          </Link>
        </div>
      </div>

      {/* Main Body Section */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content Workspace */}
        <main className={`flex-1 overflow-y-auto bg-bg-primary p-6 lg:p-8 custom-scrollbar transition-all duration-300 flex flex-col justify-between ${
          utilityDrawerOpen ? (activeUtilityTab ? 'lg:pr-[370px]' : 'lg:pr-[50px]') : ''
        }`}>
          <div className="flex-1 pb-8">
            {children}
          </div>
          {/* Footer containing About Us */}
          <footer className="mt-auto pt-6 border-t border-border-brand/40 text-text-secondary select-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-text-primary">About BokSpot Platform</span>
                <p className="text-[11px] text-text-secondary/70 leading-relaxed max-w-xl">
                  BokSpot Console provides next-generation merchant management systems designed to simplify booking experiences, optimize staff shifts, manage user calendars, and build robust customer CRM pipelines with absolute ease and performance. Developed by Beta Softnet.
                </p>
              </div>
              <div className="flex flex-col md:items-end justify-end space-y-1 text-[10px] text-text-secondary/50 font-mono">
                <p>Platform Version 2.4.0 • Secured Console</p>
                <p>© 2026 BokSpot. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <UtilityDrawer isOpen={utilityDrawerOpen} onClose={() => setUtilityDrawerOpen(false)} isVendor={true} activeTab={activeUtilityTab} setActiveTab={setActiveUtilityTab} />

      {/* Apple Spotlight Search Overlay Modal */}
      {spotlightOpen && (
        <div className="fixed inset-0 z-50 bg-slate-500/ backdrop-blur-sm flex justify-center items-start pt-[10vh]">
          {/* Backdrop Click Dismiss */}
          <div className="fixed inset-0 -z-10" onClick={() => setSpotlightOpen(false)} />
          
          <div className="max-w-2xl w-full mx-4 bg-bg-secondary border border-border-brand rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in">
            {/* Search Input Box */}
            <div className="flex items-center gap-3.5 px-5 py-4 border-b border-border-brand/50 bg-bg-tertiary">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tools, bookings, services, staff..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSpotlightIndex(0);
                }}
                className="bg-transparent border-none outline-none text-sm text-text-primary placeholder-slate-500 w-full"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSpotlightIndex(prev => Math.min(prev + 1, (searchQuery.trim() === '' ? searchPages.length : searchResults.length) - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSpotlightIndex(prev => Math.max(prev - 1, 0));
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const list = searchQuery.trim() === '' ? searchPages : searchResults;
                    const selected = list[spotlightIndex];
                    if (selected) {
                      setSpotlightOpen(false);
                      window.location.href = selected.href;
                    }
                  } else if (e.key === 'Escape') {
                    setSpotlightOpen(false);
                  }
                }}
              />
              <button 
                onClick={() => setSpotlightOpen(false)}
                className="rounded-lg p-1 hover:bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results / Suggestions list */}
            <div className="max-h-[380px] overflow-y-auto p-2 custom-scrollbar">
              {searchQuery.trim() === '' ? (
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2">Quick suggestions</div>
                  <div className="space-y-0.5">
                    {searchPages.map((item, idx) => {
                      const active = idx === spotlightIndex;
                      return (
                        <div
                          key={item.href}
                          onClick={() => {
                            setSpotlightOpen(false);
                            window.location.href = item.href;
                          }}
                          onMouseEnter={() => setSpotlightIndex(idx)}
                          className={`flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-colors ${
                            active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-secondary hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <item.icon className={`h-4.5 w-4.5 ${active ? 'text-primary' : 'text-slate-400'}`} />
                          <div className="flex-1 text-left">
                            <span className="text-xs font-bold block">{item.label}</span>
                            <span className="text-[10px] text-slate-500 block">{item.description}</span>
                          </div>
                          <span className="text-[9px] uppercase font-bold text-slate-600 bg-white/5 px-2 py-0.5 rounded">Menu Option</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-2">Search results ({searchResults.length})</div>
                  <div className="space-y-0.5">
                    {searchResults.map((item, idx) => {
                      const active = idx === spotlightIndex;
                      return (
                        <div
                          key={item.label + idx}
                          onClick={() => {
                            setSpotlightOpen(false);
                            window.location.href = item.href;
                          }}
                          onMouseEnter={() => setSpotlightIndex(idx)}
                          className={`flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-colors ${
                            active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-secondary hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <item.icon className={`h-4.5 w-4.5 ${active ? 'text-primary' : 'text-slate-400'}`} />
                          <div className="flex-1 text-left">
                            <span className="text-xs font-bold block">{item.label}</span>
                            <span className="text-[10px] text-slate-500 block">{item.description}</span>
                          </div>
                          <span className="text-[9px] uppercase font-bold text-slate-600 bg-white/5 px-2 py-0.5 rounded capitalize">{item.type}</span>
                        </div>
                      );
                    })}
                    {searchResults.length === 0 && (
                      <div className="text-center py-10 text-slate-500 text-xs">
                        No results found for &ldquo;{searchQuery}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Keyboard Help Footer */}
            <div className="bg-bg-tertiary border-t border-border-brand/40 px-4.5 py-2.5 flex items-center justify-between text-[9px] text-slate-500 font-mono">
              <div className="flex gap-4">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <span>Spotlight Console Search</span>
            </div>
          </div>
        </div>
      )}
      
      <LocationSelectorModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)}
        city={city}
        setCity={setCity}
        setStatus={setStatus}
      />
    </div>
    </>
  );
}
