'use client';

import { useVendorStore } from '@/lib/store';
import { getArchetypeConfig } from '@/lib/businessDictionary';
import { getArchetypeFromCategory } from '@/lib/archetypes';
import {
  Users, User, Activity, CheckCircle2, ChevronRight, Phone,
  Stethoscope, FileText, IndianRupee, Clock,
  ArrowUpRight, TrendingUp, Calendar, MapPin, Zap,
  Check, AlertCircle, Sparkles, Plus, QrCode, Building2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { currentMerchant, staffAccounts, bookings, loginRole, currentStaff, checkInBooking, completeBooking, switchVertical } = useVendorStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('This Week');
  const [liveBookings, setLiveBookings] = useState<any[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  // Real-time interactive slot matrix state
  const [resourceSlots, setResourceSlots] = useState<{ id: string; name: string; type: string; status: 'Available' | 'Occupied' | 'Hold'; currentSlot: string; customer?: string }[]>([
    { id: '1', name: 'Turf A (5-a-side)', type: 'Pitch', status: 'Occupied', currentSlot: '10:00 - 11:00 AM', customer: 'Chennai Strikers' },
    { id: '2', name: 'Turf B (7-a-side)', type: 'Pitch', status: 'Available', currentSlot: '11:00 - 12:00 PM' },
    { id: '3', name: 'Turf C (Box Cricket)', type: 'Pitch', status: 'Available', currentSlot: '11:00 - 12:00 PM' },
    { id: '4', name: 'Suite 201 (Pool View)', type: 'Suite', status: 'Occupied', currentSlot: 'Check-out: 12:00 PM', customer: 'Arun Kumar' },
    { id: '5', name: 'Villa Deluxe 104', type: 'Villa', status: 'Available', currentSlot: 'Ready for Check-in' },
    { id: '6', name: 'Cabana 02 (Day-pass)', type: 'Lounge', status: 'Hold', currentSlot: 'Holding for Walk-in' },
  ]);

  // ── Live Bookings Poller ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        let res = await fetch(`/api/v1/bookings/sync?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) {
          res = await fetch(`http://localhost:9000/api/v1/bookings/sync?t=${Date.now()}`, { cache: 'no-store' });
        }
        if (res.ok) {
          const all: any = await res.json();
          const dataArr = all?.data || all;
          if (!cancelled) setLiveBookings(Array.isArray(dataArr) ? dataArr : []);
        }
      } catch (err) {
        try {
          const resDirect = await fetch(`http://localhost:9000/api/v1/bookings/sync?t=${Date.now()}`, { cache: 'no-store' });
          if (resDirect.ok) {
            const allDirect = await resDirect.json();
            const dataArrDirect = allDirect?.data || allDirect;
            if (!cancelled) setLiveBookings(Array.isArray(dataArrDirect) ? dataArrDirect : []);
          }
        } catch {}
      }
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
          <div className="h-14 w-14 rounded-full border-4 border-[#ff6325] border-t-transparent animate-spin" />
          <p className="text-[#0a3161] dark:text-[#ff6325] font-black tracking-widest uppercase text-xs">Initializing Executive Console...</p>
        </div>
      </div>
    );
  }

  // Active Branch Resolution
  const effectiveBranches = (currentMerchant.branches && currentMerchant.branches.length > 0)
    ? currentMerchant.branches
    : [
        {
          id: 'branch-resort-stay',
          name: 'Suites & Stays',
          city: currentMerchant.city || 'Chennai',
          category: 'Resort Booking',
          businessType: 'Stay & Rooms',
          address: 'East Coast Road, Chennai',
          gstStatus: 'WITH_GST' as const,
          gstNumber: currentMerchant.gstNumber || '33AAAAA0000A1Z5'
        },
        {
          id: 'branch-resort-turf',
          name: 'Sports Turf',
          city: currentMerchant.city || 'Chennai',
          category: 'Football Turf',
          businessType: 'Sports Facility',
          address: 'East Coast Road (Arena Annex), Chennai',
          gstStatus: 'WITH_GST' as const,
          gstNumber: currentMerchant.gstNumber || '33AAAAA0000A1Z5'
        }
      ];

  const activeBranch = effectiveBranches.find(b => b.id === (currentMerchant.activeBranchId || effectiveBranches[0].id)) || effectiveBranches[0];
  const isTurfBranch = (activeBranch.category?.toLowerCase().includes('turf') || activeBranch.name?.toLowerCase().includes('turf'));

  // Active Category & Archetype aligned with active branch
  const activeBranchCategory = activeBranch.category || (isTurfBranch ? 'Football Turf' : (currentMerchant.category || 'Resort Booking'));
  const curArch = (getArchetypeFromCategory(activeBranchCategory) || 'ACCOMMODATION');

  const baseConfig = getArchetypeConfig(activeBranchCategory || currentMerchant?.archetype || 'Service');
  const archetypeConfig = { ...baseConfig, ...(currentMerchant?.customDictionary || {}) };

  const isValidForMerchant = (b: any) => {
    const bCategory = (b.category || '').toLowerCase().trim();
    const bServiceName = (b.serviceName || '').toLowerCase();
    const bArch = getArchetypeFromCategory(bCategory);

    // Branch Isolation Check
    if (isTurfBranch) {
      if (bCategory.includes('room') || bCategory.includes('hotel') || bCategory.includes('resort') || bCategory.includes('suite')) return false;
      if (/suite|deluxe|villa|cottage|room/i.test(bServiceName)) return false;
    } else {
      if (bCategory.includes('turf') || bCategory.includes('football') || bCategory.includes('cricket') || bCategory.includes('pitch')) return false;
      if (/turf|pitch|ground|court/i.test(bServiceName)) return false;
    }

    if (curArch && bArch && curArch !== bArch) return false;
    return true;
  };

  let merchantBookings = bookings.filter(
    b => b.merchantName.toLowerCase() === currentMerchant.merchantName.toLowerCase() && isValidForMerchant(b)
  );
  const staffList = staffAccounts.filter(s => s.merchantId === currentMerchant.id);
  const isStaffView = loginRole === 'staff';

  if (isStaffView && currentStaff) {
    merchantBookings = merchantBookings.filter(b =>
      b.assignedDoctorId === currentStaff.id || b.refereeAssigned === currentStaff.name
    );
  }

  // Merge live bookings (from backend) with local bookings for this merchant
  const curMerchantName = (currentMerchant.merchantName || '').toLowerCase().trim();
  const curMerchantId = String(currentMerchant.id || '').trim();
  const curUsername = String(currentMerchant.username || '').toLowerCase().trim();

  const isMatchingMerchant = (b: any) => {
    const bId = String(b.merchantId || '').trim();
    const bName = (b.merchantName || '').toLowerCase().trim();
    const bUser = String(b.username || '').toLowerCase().trim();

    const matchesIdOrName = (curMerchantId && bId && curMerchantId === bId) ||
      (curMerchantName && bName && (curMerchantName === bName || bName.includes(curMerchantName) || curMerchantName.includes(bName))) ||
      (curUsername && bUser && curUsername === bUser);

    return matchesIdOrName && isValidForMerchant(b);
  };

  const liveForMerchant = (Array.isArray(liveBookings) ? liveBookings : []).filter(b =>
    isMatchingMerchant(b) &&
    (b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'CHECKED_IN' || b.status === 'CANCELLED' || b.status === 'COMPLETED')
  );

  const localActive = merchantBookings.filter(b =>
    (b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'CHECKED_IN' || b.status === 'CANCELLED' || b.status === 'COMPLETED') &&
    !liveForMerchant.find((lb: any) => lb.ref === b.ref)
  );
  const activeBookings = [...liveForMerchant, ...localActive].filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');
  const allMerchantBookings = [...liveForMerchant, ...localActive];

  const completedBookings = allMerchantBookings.filter(b => b.status === 'COMPLETED');
  const totalRevenue = allMerchantBookings.reduce((sum, b) => 
    (b.status === 'COMPLETED' || b.status === 'CONFIRMED' || b.status === 'CHECKED_IN') ? sum + (Number(b.amount) || 0) : sum, 0
  );

  const uniqueCustomers = new Set(allMerchantBookings.filter(b => b.status !== 'CANCELLED').map(b => b.customerPhone || b.customerName)).size;
  const occupancy = uniqueCustomers;

  const activeStaffIds = new Set(allMerchantBookings.map(b => b.assignedDoctorId).filter(Boolean));
  const merchantStaffCount = staffList.length;
  const metric3 = merchantStaffCount > 0 ? merchantStaffCount : (activeStaffIds.size > 0 ? activeStaffIds.size : 0);

  // Trend calculation
  const daysMap = [0, 0, 0, 0, 0, 0, 0];
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

  // Business verticals for multi-business owner
  const verticals = currentMerchant.verticals || (
    currentMerchant.merchantName.toLowerCase().includes('sunstone')
      ? [
          { id: 'vert-resort', name: 'Sunstone Resort', category: 'Resort Booking', archetype: 'Accommodation', badge: 'Resort & Suites' },
          { id: 'vert-turf', name: 'Sunstone Arena', category: 'Football Turf', archetype: 'Sports', badge: 'Sports Turf' }
        ]
      : []
  );

  const activeVertical = verticals.find(v => v.id === currentMerchant.activeVerticalId || v.category === currentMerchant.category) || verticals[0];

  const getBookingType = (serviceName: string, fallback?: string) => {
    const name = (serviceName || '').toLowerCase();
    if (name.includes('room') || name.includes('hotel') || name.includes('suite') || name.includes('villa') || name.includes('resort') || name.includes('cottage') || name.includes('stay')) return 'Resort Stay';
    if (name.includes('football') || name.includes('turf') || name.includes('pitch') || name.includes('court') || name.includes('arena')) return 'Turf Slot';
    if (name.includes('cricket')) return 'Cricket Ground';
    return isTurfBranch ? 'Turf Slot' : 'Resort Stay';
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
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="flex items-center gap-6 relative z-10">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-lg shadow-blue-600/30 shrink-0">
              <div className="h-full w-full rounded-2xl bg-white dark:bg-[#162033] flex items-center justify-center font-black text-4xl text-blue-600 dark:text-blue-400 uppercase select-none">
                {(currentStaff?.name || 'A').trim().charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{`${archetypeConfig.staffPrefix || ''} ${currentStaff?.name || ''}`}</h1>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mt-1">{currentStaff?.roleTitle}</p>
              <div className="flex items-center gap-3 mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={14} /> Active Shift</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex gap-4">
            <div className="bg-slate-50 dark:bg-[#162033] rounded-2xl p-4 border border-slate-200 dark:border-white/10 text-center min-w-[120px]">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{activeBookings.length}</h3>
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Pending</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/40 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/40 text-center min-w-[120px]">
              <h3 className="text-3xl font-black text-blue-700 dark:text-blue-300">{completedBookings.length}</h3>
              <p className="text-[9px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest mt-1">Completed</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {activeBookings.map((booking) => (
            <div key={booking.id} className="bg-white dark:bg-[#0f1624] rounded-2xl p-5 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{booking.teamName || booking.customerName}</h3>
                <p className="text-xs text-slate-500">{booking.serviceName} • {booking.time} • {booking.customerPhone}</p>
              </div>
              {booking.status === 'CONFIRMED' && (
                <button onClick={() => checkInBooking(booking.id)} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                  Check-in
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── OWNER EXECUTIVE COMMAND CENTER ──────────────────────────────────────────
  return (
    <div className="space-y-6 pb-12 font-sans animate-fade-in max-w-[1400px] mx-auto">

      {/* 1. Executive Top Banner with Quick Business Entity Switcher */}
      <div className="p-6 md:p-7 rounded-3xl bg-white dark:bg-[#0f1624] border border-slate-200/80 dark:border-white/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-[#ff6325]/15 via-[#0a3161]/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#0a3161] dark:text-white">
                {currentMerchant.merchantName || (isTurfBranch ? 'Sunstone Arena Turf' : 'Sunstone Resort')}
              </h1>
              <span className="px-3 py-1 rounded-full bg-[#ff6325]/10 text-[#ff6325] text-xs font-black border border-[#ff6325]/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff6325] animate-ping" />
                {activeBranch.name || activeBranchCategory}
              </span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                activeBranch.gstStatus === 'WITH_GST' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}>
                {activeBranch.gstStatus === 'WITH_GST' ? `GST: ${activeBranch.gstNumber || currentMerchant.gstNumber || '33AAAAA0000A1Z5'}` : 'Nett'}
              </span>
            </div>
            
            <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={15} /> All Systems Operational
              </span>
              <span>•</span>
              <span>Executive Multi-Vertical Console</span>
              <span>•</span>
              <span className="text-slate-400 dark:text-slate-500">Auto-sync live at 3s intervals</span>
            </p>
          </div>

          {/* Merchant ID Badge */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-white/10 shrink-0 shadow-xs">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0a3161] to-[#142642] dark:from-[#ff6325] dark:to-[#e04e13] text-white flex items-center justify-center font-black text-xs shadow-sm">
              {currentMerchant.username?.charAt(0) || 'M'}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Merchant ID
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{currentMerchant.username}</span>
                <span className="text-[10px] font-bold text-slate-400">({currentMerchant.vendorId || currentMerchant.id?.slice(0, 8)})</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: Main KPIs, Analytics & Booking Queue (~65-70%) */}
        <div className="lg:col-span-8 space-y-6">

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#0f1624] rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#ff6325]/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                  <IndianRupee size={18} />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50">
                  +14%
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Today's Revenue</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">₹{totalRevenue.toLocaleString()}</h3>
            </div>

            <div className="bg-white dark:bg-[#0f1624] rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#ff6325]/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                  <Calendar size={18} />
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-200/50">
                  Active
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {isTurfBranch ? 'Total Matches' : (archetypeConfig.kpiTotalBookings || 'Total Reservations')}
              </p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{allMerchantBookings.length}</h3>
            </div>

            <div className="bg-white dark:bg-[#0f1624] rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#ff6325]/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#ff6325] to-[#e04e13] flex items-center justify-center text-white shadow-md shadow-[#ff6325]/30">
                  <Users size={18} />
                </div>
                <span className="text-[10px] font-bold text-[#ff6325] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-200/50">
                  Verified
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {isTurfBranch ? 'Teams & Players' : 'Guests & Visitors'}
              </p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{occupancy}</h3>
            </div>

            <div className="bg-white dark:bg-[#0f1624] rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#ff6325]/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <Activity size={18} />
                </div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-200/50">
                  Peak
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Staff on Duty</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{metric3}</h3>
            </div>
          </div>

          {/* Interactive Trends Graph */}
          <div className="bg-white dark:bg-[#0f1624] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-white/5 px-6 py-4 bg-slate-50/50 dark:bg-white/[0.02]">
              <div>
                <h2 className="text-base font-black text-[#0a3161] dark:text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#ff6325]" />
                  {isTurfBranch ? 'Weekly Revenue Velocity & Footfall' : 'Weekly Occupancy & Revenue Trend'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isTurfBranch ? 'Peak traffic distribution across 7 days' : 'Guest check-ins & booking distribution across 7 days'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 mt-2 sm:mt-0 p-1 rounded-xl bg-slate-100 dark:bg-white/5">
                {['Today', 'This Week', 'This Month'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeTab === tab 
                        ? 'bg-[#ff6325] text-white shadow-sm font-black' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6">
              <div className="h-56 flex items-end justify-between gap-3 px-2">
                {weeklyData.map((val, idx) => {
                  const hp = (val / maxWeekly) * 100;
                  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                  return (
                    <div key={idx} className="h-full flex flex-col items-center gap-2 flex-1 group">
                      <div className="w-full relative flex justify-center items-end h-full">
                        <div className="w-full max-w-[48px] bg-slate-100 dark:bg-white/5 rounded-t-xl relative group-hover:bg-[#ff6325]/20 transition-colors" style={{ height: `${hp}%` }}>
                          <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#0a3161] to-[#ff6325] rounded-t-xl transition-all shadow-[0_0_12px_rgba(255,99,37,0.3)]" style={{ height: `${Math.max(hp * 0.7, 12)}%` }} />
                        </div>
                        <div className="absolute -top-9 bg-[#0a3161] text-white shadow-xl text-[10px] font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-[#ff6325]/30">
                          {val} {isTurfBranch ? 'Bookings' : 'Reservations'}
                        </div>
                      </div>
                      <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 group-hover:text-[#ff6325] transition-colors">{days[idx]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Booking Queue with Real Actions */}
          <div className="bg-white dark:bg-[#0f1624] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 px-6 py-4 bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <FileText size={17} className="text-[#ff6325]" />
                <h2 className="text-base font-black text-[#0a3161] dark:text-white">
                  {isTurfBranch ? 'Live Queue & Incoming Slots' : 'Live Queue & Upcoming Reservations'}
                </h2>
                {liveForMerchant.filter(b => b.status === 'PENDING').length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ff6325]/15 text-[#ff6325] border border-[#ff6325]/30 text-[10px] font-black animate-pulse">
                    {liveForMerchant.filter(b => b.status === 'PENDING').length} Pending
                  </span>
                )}
              </div>
              <button onClick={() => router.push('/tracks/bookings')} className="text-xs font-bold text-[#ff6325] hover:opacity-80 flex items-center gap-1 transition-colors">
                View All <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
                    <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                    <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {isTurfBranch ? 'Slot & Facility' : 'Suite & Accommodation'}
                    </th>
                    <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Schedule</th>
                    <th className="py-3 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {activeBookings.length > 0 ? (
                    activeBookings.slice(0, 6).map(booking => {
                      const isPending = booking.status === 'PENDING';
                      return (
                        <tr key={booking.id} className={`hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors ${isPending ? 'bg-orange-50/30 dark:bg-[#ff6325]/10' : ''}`}>
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-xs ${isPending ? 'bg-[#ff6325]/15 text-[#ff6325] border border-[#ff6325]/30' : 'bg-[#0a3161]/10 text-[#0a3161] dark:text-[#ff6325]'}`}>
                                {(booking.teamName || booking.customerName || '?').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white text-xs">{booking.teamName || booking.customerName}</p>
                                <p className="text-[11px] text-slate-400 font-medium">{booking.customerPhone || 'Verified Booking'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-6">
                            <p className="text-[10px] font-black uppercase tracking-wider text-[#ff6325]">
                              {getBookingType(booking.serviceName, currentMerchant.category)}
                            </p>
                            <p className="font-bold text-slate-900 dark:text-white text-xs">{booking.serviceName}</p>
                          </td>
                          <td className="py-3.5 px-6">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{booking.date}</p>
                            <p className="text-[11px] font-bold text-[#ff6325]">{booking.time}</p>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            {isPending ? (
                              <button
                                disabled={acceptingId === booking.id}
                                onClick={() => handleAccept(booking)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                              >
                                {acceptingId === booking.id ? 'Accepting...' : '✓ Confirm'}
                              </button>
                            ) : booking.status === 'CHECKED_IN' ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                In Session
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                                Confirmed
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                        No active queue right now. All scheduled slots are clear.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Live Facility / Pitch Slot Matrix & Quick Executive Console (~30-35%) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Real-time Pitch & Room Availability Matrix */}
          <div className="bg-white dark:bg-[#0f1624] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200/60">
                  <Activity size={16} />
                </span>
                <div>
                  <h3 className="text-sm font-black text-[#0a3161] dark:text-white">
                    {isTurfBranch ? 'Live Slot & Pitch Grid' : 'Live Suite & Room Inventory'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isTurfBranch ? 'Pitches & Court Availability' : 'Suites & Cottages Availability'}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                Live
              </span>
            </div>

            {/* Matrix Slots List Filtered by Active Branch */}
            <div className="space-y-3">
              {resourceSlots
                .filter(res => isTurfBranch ? res.type === 'Pitch' : (res.type === 'Suite' || res.type === 'Villa' || res.type === 'Lounge'))
                .map((res) => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center justify-between transition-all hover:border-slate-300 dark:hover:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${
                      res.status === 'Available' ? 'bg-emerald-500 ring-4 ring-emerald-500/20' :
                      res.status === 'Occupied' ? 'bg-[#ff6325] ring-4 ring-[#ff6325]/20' :
                      'bg-amber-400 ring-4 ring-amber-400/20'
                    }`} />
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">{res.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Clock size={11} className="text-slate-400" />
                        <span>{res.currentSlot}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      res.status === 'Available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                      res.status === 'Occupied' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {res.status}
                    </span>
                    {res.customer && (
                      <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[85px] mt-0.5">
                        {res.customer}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Legend */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Ready</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff6325] inline-block" /> {isTurfBranch ? 'In Play' : 'Occupied'}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Reserved</span>
            </div>
          </div>

          {/* Quick Walk-In & Action Console */}
          <div className="bg-gradient-to-br from-[#0a3161] to-[#12427e] dark:from-[#0a192f] dark:to-[#0f2744] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6325]/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Sparkles size={16} className="text-[#ff6325]" />
                Walk-in & Quick Actions
              </h3>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-bold">Fast Lane</span>
            </div>

            <p className="text-xs text-white/70 mb-5 relative z-10">
              {isTurfBranch 
                ? 'Instant offline booking assignment for walk-in players, teams, or pitch checks.' 
                : 'Instant offline reservation for walk-in guests, banquet events, or room check-ins.'}
            </p>

            <div className="space-y-2.5 relative z-10">
              <button
                onClick={() => router.push('/tracks/calendar')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#ff6325] hover:bg-[#e04e13] text-white font-black text-xs transition-all shadow-lg shadow-[#ff6325]/30 cursor-pointer active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <Plus size={15} /> {isTurfBranch ? 'Book Walk-in Slot' : 'Book Walk-in Guest'}
                </span>
                <ChevronRight size={14} />
              </button>

              <button
                onClick={() => router.push('/home/verify-code')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all border border-white/15 cursor-pointer active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <QrCode size={15} className="text-amber-400" /> Scan QR / Verify Ticket
                </span>
                <ChevronRight size={14} />
              </button>

              <button
                onClick={() => router.push('/workspace/my-services')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/90 font-bold text-xs transition-all border border-white/10 cursor-pointer"
              >
                <span>{isTurfBranch ? 'Edit Pitch & Turf Pricing' : 'Edit Suite & Villa Tariff'}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Multi-Vertical Revenue Breakdown */}
          {verticals.length > 1 && (
            <div className="bg-white dark:bg-[#0f1624] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm p-6">
              <h3 className="text-sm font-black text-[#0a3161] dark:text-white mb-1">
                Multi-Entity Revenue Split
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">Consolidated earnings across verticals</p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      🏨 Sunstone Resort
                    </span>
                    <span className="text-slate-900 dark:text-white font-black">62% (₹{(totalRevenue * 0.62).toFixed(0)})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                    <div className="h-full bg-[#0a3161] rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      ⚽ Sunstone Arena Turf
                    </span>
                    <span className="text-[#ff6325] font-black">38% (₹{(totalRevenue * 0.38).toFixed(0)})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                    <div className="h-full bg-[#ff6325] rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
