'use client';

import { useVendorStore } from '@/lib/store';
import { getArchetypeConfig } from '@/lib/businessDictionary';
import {
  Users, User, Activity, CheckCircle2, ChevronRight, Phone,
  Stethoscope, FileText, IndianRupee, Clock,
  ArrowUpRight, TrendingUp, Calendar, MapPin, ChevronLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LiveResourceMap from '@/app/components/LiveResourceMap';

const DEFAULT_CAROUSEL_IMAGES = {
  ResourceBooking: [
    'https://images.unsplash.com/photo-1574629810360-7efbb49fec90?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518605368461-1ee7c515a4c9?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1536122985607-4fea00b8d5a8?q=80&w=1200&auto=format&fit=crop'
  ],
  HealthcareBooking: [
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop'
  ],
  ServiceBooking: [
    'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop'
  ]
};

export default function DashboardPage() {
  const router = useRouter();
  const { currentMerchant, staffAccounts, bookings, loginRole, currentStaff, checkInBooking, completeBooking } = useVendorStore();
  const baseConfig = getArchetypeConfig(currentMerchant?.archetype || 'Service');
  const archetypeConfig = { ...baseConfig, ...(currentMerchant?.customDictionary || {}) };
  const activeModules = currentMerchant?.activeModules || ['bookings', 'staff', 'customers', 'map'];
  const showMap = !currentMerchant?.isCustomized || activeModules.includes('map');

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('This Week');
  const [liveBookings, setLiveBookings] = useState<any[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  // ── Live Bookings Poller ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(`/api/v1/bookings/sync?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const all: any = await res.json();
        const dataArr = all?.data || all;
        if (!cancelled) setLiveBookings(Array.isArray(dataArr) ? dataArr : []);
      } catch {}
    };
    poll();
    const id = setInterval(poll, 3000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  useEffect(() => { setMounted(true); }, []);

  if (!currentMerchant || !mounted) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="h-16 w-16 rounded-full border-4 border-[#8b6508] border-t-transparent animate-spin" />
          <p className="text-[#8b6508] font-bold tracking-widest uppercase text-xs">Initializing Secure Network...</p>
        </div>
      </div>
    );
  }

  let merchantBookings = bookings.filter(
    b => b.merchantName.toLowerCase() === currentMerchant.merchantName.toLowerCase()
  );
  const staffList = staffAccounts.filter(s => s.merchantId === currentMerchant.id);
  const isStaffView = loginRole === 'staff';

  if (isStaffView && currentStaff) {
    merchantBookings = merchantBookings.filter(b =>
      b.assignedDoctorId === currentStaff.id || b.refereeAssigned === currentStaff.name
    );
  }

  // Merge live bookings (from backend) with local bookings for this merchant
  const liveForMerchant = (Array.isArray(liveBookings) ? liveBookings : []).filter(b =>
    (b.merchantId === currentMerchant.id || b.merchantName?.toLowerCase() === currentMerchant.merchantName?.toLowerCase()) &&
    (b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'CHECKED_IN' || b.status === 'CANCELLED')
  );
  const localActive = merchantBookings.filter(b =>
    (b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'CHECKED_IN' || b.status === 'CANCELLED') &&
    !liveForMerchant.find((lb: any) => lb.ref === b.ref)
  );
  const activeBookings = [...liveForMerchant, ...localActive];

  const completedBookings = liveForMerchant.filter(b => b.status === 'COMPLETED');
  const totalRevenue = liveForMerchant.reduce((sum, b) => 
    (b.status === 'COMPLETED' || b.status === 'CONFIRMED' || b.status === 'CHECKED_IN') ? sum + (b.amount || 0) : sum, 0
  );

  const pendingBookings = liveForMerchant.filter(b => b.status === 'PENDING').length;
  
  // Calculate unique active customers
  const uniqueCustomers = new Set(activeBookings.map(b => b.customerPhone || b.customerName)).size;
  const occupancy = uniqueCustomers; // Replaces previous mock percentage

  // Calculate active staff (staff assigned to active bookings)
  const activeStaffIds = new Set(activeBookings.map(b => b.assignedDoctorId).filter(Boolean));
  const metric3 = activeStaffIds.size > 0 ? activeStaffIds.size : 1; // Default to 1 if no staff explicitly assigned yet

  // Calculate actual weekly trend
  const daysMap = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
  liveForMerchant.forEach(b => {
    const d = new Date(b.bookedAt || b.date);
    if (!isNaN(d.getTime())) {
      const day = d.getDay();
      const adjustedDay = day === 0 ? 6 : day - 1;
      daysMap[adjustedDay]++;
    }
  });
  const weeklyData = daysMap;
  const maxWeekly = Math.max(...weeklyData, 1);
  const carouselImages = DEFAULT_CAROUSEL_IMAGES[currentMerchant.archetype as keyof typeof DEFAULT_CAROUSEL_IMAGES] || DEFAULT_CAROUSEL_IMAGES.ServiceBooking;

  const getBookingType = (serviceName: string, fallback?: string) => {
    const name = (serviceName || '').toLowerCase();
    if (name.includes('room') || name.includes('hotel') || name.includes('suite')) return 'Hotel Booking';
    if (name.includes('cricket') || name.includes('ground 1')) return 'Cricket Ground Booking';
    if (name.includes('football') || name.includes('turf')) return 'Football Turf Booking';
    if (name.includes('ground')) return 'Cricket Ground Booking';
    if (name.includes('hair') || name.includes('spa')) return 'Salon Booking';
    if (name.includes('table') || name.includes('dine')) return 'Restaurant Booking';
    return fallback || 'Service Booking';
  };

  const getCategoryName = (serviceName: string, originalCat: string) => {
    if (originalCat && originalCat !== 'Category') return originalCat;
    const name = (serviceName || '').toLowerCase();
    if (name.includes('room')) return 'Deluxe Room';
    if (name.includes('ground')) return 'Shed A';
    return 'General';
  };

  const handleAccept = async (booking: any) => {
    setAcceptingId(booking.id);
    try {
      await fetch('/api/v1/bookings/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...booking, status: 'CONFIRMED' }),
      });
      setLiveBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'CONFIRMED' } : b));
    } catch {}
    setAcceptingId(null);
  };

  // ── STAFF VIEW ──────────────────────────────────────────────────────────────
  if (isStaffView) {
    return (
      <div className="space-y-8 animate-fade-in pb-12 font-sans max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-[30%] bg-gradient-to-l from-blue-50 to-transparent pointer-events-none" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="h-24 w-24 rounded-3xl bg-blue-600 p-1 shadow-lg shadow-blue-600/30">
              <div className="h-full w-full rounded-2xl bg-white flex items-center justify-center font-black text-4xl text-blue-600 uppercase border-2 border-transparent">
                {currentStaff?.name.charAt(0)}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{`${archetypeConfig.staffPrefix || ''} ${currentStaff?.name || ''}`}</h1>
              <p className="text-sm text-blue-600 font-bold uppercase tracking-widest mt-1">{currentStaff?.roleTitle}</p>
              <div className="flex items-center gap-3 mt-3 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={14} /> Active Shift</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center min-w-[120px]">
              <h3 className="text-3xl font-black text-slate-900">{activeBookings.length}</h3>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Pending</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 text-center min-w-[120px]">
              <h3 className="text-3xl font-black text-blue-700">{completedBookings.length}</h3>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">Completed</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" /> {archetypeConfig.bookingHeaderTitle || 'Tasks Today'}
            </h2>
          </div>
          <div className="space-y-4">
            {activeBookings.map((booking, index) => (
              <div key={booking.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col md:flex-row items-center gap-6 group cursor-pointer">
                <div className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-slate-100 pr-6">
                  <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{booking.time?.split(' ')[0]}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{booking.time?.split(' ')[1]}</span>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{booking.teamName || booking.customerName}</h3>
                    {index === 0 && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest animate-pulse">Up Next</span>}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1"><User size={12} /> ID: {booking.ref}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Phone size={12} /> {booking.customerPhone}</span>
                    <span>•</span>
                    <span className="text-[#8b6508] font-bold">{booking.serviceName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {booking.status === 'CONFIRMED' && (
                    <button onClick={e => { e.stopPropagation(); checkInBooking(booking.id); }} className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs uppercase tracking-widest transition-all">Start</button>
                  )}
                  {booking.status === 'CHECKED_IN' && (
                    <button onClick={e => { e.stopPropagation(); completeBooking(booking.id); }} className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2">
                      <CheckCircle2 size={16} /> Finish
                    </button>
                  )}
                  <button className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── OWNER COMMAND CENTER VIEW ──────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-12 font-sans animate-fade-in max-w-7xl mx-auto">

      {/* 1. Premium Command Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#0f1624] border border-slate-200/80 dark:border-white/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#ff6325]/15 via-[#0a3161]/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#0a3161] dark:text-white">
              {currentMerchant.merchantName}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ff6325]/10 text-[#ff6325] text-[11px] font-black border border-[#ff6325]/30">
              {currentMerchant.category || 'Verified Partner'}
            </span>
          </div>
          <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Live System Active</span>
            <span>•</span>
            <span>Welcome back to {archetypeConfig.dashboardTitle || 'Admin Console'}</span>
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 self-start sm:self-auto">
          <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Merchant ID</p>
            <p className="text-xs font-black text-[#0a3161] dark:text-[#ff6325]">{currentMerchant.id || 'M-2025'}</p>
          </div>
        </div>
      </div>

      {/* 2. Finance KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm relative overflow-hidden group hover:border-[#ff6325]/50 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <IndianRupee size={20} />
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 px-2.5 py-1 rounded-full">
              <TrendingUp size={12} /> +12.5%
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Today's Revenue</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">₹{totalRevenue.toLocaleString()}</h3>
        </div>

        <div className="bg-white dark:bg-[#0f1624] rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm relative overflow-hidden group hover:border-[#ff6325]/50 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Calendar size={20} />
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 px-2.5 py-1 rounded-full">
              <ArrowUpRight size={12} /> +4.2%
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{archetypeConfig.metric1Title || 'Total Bookings'}</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{liveForMerchant.length}</h3>
        </div>

        <div className="bg-white dark:bg-[#0f1624] rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm relative overflow-hidden group hover:border-[#ff6325]/50 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#ff6325] to-[#e04e13] flex items-center justify-center text-white shadow-md shadow-[#ff6325]/30">
              <Users size={20} />
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#ff6325] dark:text-[#ff986e] bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800/40 px-2.5 py-1 rounded-full">
              <ArrowUpRight size={12} /> High
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{archetypeConfig.metric2Title || 'Active Customers'}</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{occupancy}</h3>
        </div>

        <div className="bg-white dark:bg-[#0f1624] rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm relative overflow-hidden group hover:border-[#ff6325]/50 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Activity size={20} />
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 px-2.5 py-1 rounded-full">
              <TrendingUp size={12} /> Peak
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{archetypeConfig.activeStaffLabel || 'Live Capacity'}</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{metric3}</h3>
        </div>
      </div>

      {/* 3. Statistics Trend */}
      <div className="bg-white dark:bg-[#0f1624] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-white/5 px-6 sm:px-8 py-5 bg-slate-50/50 dark:bg-white/[0.02]">
          <div>
            <h2 className="text-lg font-black text-[#0a3161] dark:text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-[#ff6325]" />
              {archetypeConfig.trendTitle || 'Booking Statistics & Trends'}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 mt-3 sm:mt-0 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            {['Today', 'This Week', 'This Month'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-[#ff6325] text-white shadow-sm font-black' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-[#0a3161] dark:hover:text-white'
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4">
            {weeklyData.map((val, idx) => {
              const hp = (val / maxWeekly) * 100;
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              return (
                <div key={idx} className="h-full flex flex-col items-center gap-3 flex-1 group">
                  <div className="w-full relative flex justify-center items-end h-full">
                    <div className="w-full max-w-[60px] bg-slate-100 dark:bg-white/5 rounded-t-xl relative group-hover:bg-[#ff6325]/20 transition-colors" style={{ height: `${hp}%` }}>
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#0a3161] to-[#ff6325] rounded-t-xl group-hover:brightness-110 transition-all shadow-[0_0_15px_rgba(255,99,37,0.35)]" style={{ height: `${hp * 0.7}%` }} />
                    </div>
                    <div className="absolute -top-10 bg-[#0a3161] text-white shadow-xl text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-[#ff6325]/30">
                      {val} Bookings
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0a3161]" />
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-400 dark:text-slate-500 group-hover:text-[#ff6325] transition-colors">{days[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Live Booking Queue with Accept button */}
      <div className="bg-white dark:bg-[#0f1624] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 px-6 sm:px-8 py-5 bg-slate-50/50 dark:bg-white/[0.02]">
          <h2 className="text-lg font-black text-[#0a3161] dark:text-white flex items-center gap-2">
            <FileText size={18} className="text-[#ff6325]" />
            {archetypeConfig.liveQueueTitle || 'Live Booking Queue'}
            {liveForMerchant.filter(b => b.status === 'PENDING').length > 0 && (
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-[#ff6325]/15 text-[#ff6325] border border-[#ff6325]/30 text-[10px] font-black animate-pulse">
                {liveForMerchant.filter(b => b.status === 'PENDING').length} New
              </span>
            )}
          </h2>
          <button onClick={() => router.push('/tracks/bookings')} className="text-xs font-bold text-[#ff6325] hover:opacity-80 flex items-center gap-1 transition-colors">
            View All <ChevronRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
                <th className="py-4 px-6 sm:px-8 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Customer Details</th>
                <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Service / Ref</th>
                <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Time & Date</th>
                <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Assigned To</th>
                <th className="py-4 px-6 sm:px-8 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 text-right">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {activeBookings.length > 0 ? (
                activeBookings.slice(0, 8).map(booking => {
                  const doc = staffList.find(d => d.id === booking.assignedDoctorId);
                  const isPending = booking.status === 'PENDING';
                  
                  const formatDate = (iso: string) => {
                    if (!iso) return '';
                    try {
                      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                    } catch { return iso; }
                  };
                  
                  const formatDateTime = (iso: string) => {
                    if (!iso) return '';
                    try {
                      return new Date(iso).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
                    } catch { return iso; }
                  };

                  return (
                    <tr key={booking.id} className={`hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group ${isPending ? 'bg-orange-50/40 dark:bg-[#ff6325]/10' : ''}`}>
                      <td className="py-4 px-6 sm:px-8">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-bold text-sm ${isPending ? 'bg-[#ff6325]/15 text-[#ff6325] border border-[#ff6325]/30' : 'bg-[#0a3161]/15 text-[#0a3161] dark:text-[#ff6325] border border-[#0a3161]/30'}`}>
                            {(booking.teamName || booking.customerName || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{booking.teamName || booking.customerName || 'N/A'}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
                              {booking.customerPhone && <span className="block">{booking.customerPhone}</span>}
                              {booking.customerEmail && <span className="block">{booking.customerEmail}</span>}
                              <span className="block truncate max-w-xs">{booking.customerAddress || '123 Test St, Chennai, 600001'}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-[11px] font-black uppercase tracking-wider text-[#ff6325] mb-0.5">
                          {getBookingType(booking.serviceName, currentMerchant.category)} &bull; {getCategoryName(booking.serviceName, booking.category)}
                        </p>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{booking.serviceName}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Ref: #{booking.ref}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-2">
                          <Clock size={14} className="text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{formatDate(booking.date)}</p>
                            <p className="text-[11px] font-bold text-[#ff6325] mt-0.5">{booking.time}</p>
                            {booking.bookedAt && (
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Placed: {formatDateTime(booking.bookedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {doc ? (
                          <div className="flex items-center gap-2">
                            <Stethoscope size={14} className="text-[#ff6325]" />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{archetypeConfig.staffPrefix || ''}{doc.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-6 sm:px-8 text-right">
                        {isPending ? (
                          <button
                            disabled={acceptingId === booking.id}
                            onClick={() => handleAccept(booking)}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                              acceptingId === booking.id
                                ? 'bg-gray-100 text-gray-400 cursor-wait'
                                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/30 hover:scale-105 active:scale-95'
                            }`}
                          >
                            {acceptingId === booking.id ? (
                              <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Accepting...</>
                            ) : (
                              <>✓ Accept</>
                            )}
                          </button>
                        ) : booking.status === 'CANCELLED' ? (
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-red-50 text-red-700 border-red-200">
                            Cancelled
                          </span>
                        ) : (
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                            booking.status === 'CHECKED_IN'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {booking.status === 'CHECKED_IN' ? 'In Progress' : 'Confirmed'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <CheckCircle2 size={32} className="text-slate-300 mb-3" />
                      <p className="text-sm font-bold text-slate-600">All Clear</p>
                      <p className="text-xs mt-1">No pending bookings right now.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Live Map */}
      {showMap && (
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 px-6 sm:px-8 py-5 bg-slate-50/50 dark:bg-white/[0.02]">
            <h2 className="text-lg font-black text-[#0a3161] dark:text-white flex items-center gap-2">
              <MapPin size={18} className="text-[#ff6325]" />
              Facility & Resource Map
            </h2>
          </div>
          <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-black/20">
            <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-inner">
              <LiveResourceMap />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
