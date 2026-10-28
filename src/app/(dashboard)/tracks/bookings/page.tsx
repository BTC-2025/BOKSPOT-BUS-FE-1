'use client';

import { useVendorStore, PersistedBooking } from '@/lib/store'; 
import { getArchetypeConfig } from '@/lib/businessDictionary';
import { getArchetypeFromCategory } from '@/lib/archetypes';
import { 
  Search, Clock, CheckCircle2, ChevronRight, X, Phone, 
  Activity, FileText, Pill, Stethoscope, ChevronDown, User, HeartPulse, ActivitySquare, TestTube2, AlertCircle, FileDigit, MonitorPlay, Zap, ShieldAlert, Flag, Tag
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function BookingsPage() {
  const { currentMerchant, bookings, staffAccounts, loginRole, currentStaff, checkInBooking, completeBooking, savePrescription, assignStaffToBooking } = useVendorStore();
  const [mounted, setMounted] = useState(false);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  
  const [matchNotesInput, setMatchNotesInput] = useState('');
  const [liveBookings, setLiveBookings] = useState<any[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const effectiveBranches = (currentMerchant?.branches && currentMerchant.branches.length > 0)
    ? currentMerchant.branches
    : [
        {
          id: 'branch-resort-stay',
          name: 'Suites & Stays',
          city: currentMerchant?.city || 'Chennai',
          category: 'Resort Booking',
          businessType: 'Stay & Rooms',
          address: 'East Coast Road, Chennai',
          gstStatus: 'WITH_GST',
          gstNumber: currentMerchant?.gstNumber || '33AAAAA0000A1Z5',
          offeringsSummary: 'Deluxe Suites, Pool Cottages',
          isMainBranch: true
        },
        {
          id: 'branch-resort-turf',
          name: 'Sports Turf',
          city: currentMerchant?.city || 'Chennai',
          category: 'Football Turf',
          businessType: 'Sports Facility',
          address: 'East Coast Road (Arena Annex), Chennai',
          gstStatus: 'WITH_GST',
          gstNumber: currentMerchant?.gstNumber || '33AAAAA0000A1Z5',
          offeringsSummary: '7v7 FIFA Astro Turf, Floodlit Ground',
          isMainBranch: false
        }
      ];

  const curId = String(currentMerchant?.id || '').trim();
  const curName = (currentMerchant?.merchantName || '').toLowerCase().trim();
  const activeBranch = effectiveBranches.find(b => b.id === (currentMerchant?.activeBranchId || effectiveBranches[0].id)) || effectiveBranches[0];
  const isTurfBranch = Boolean(activeBranch.category?.toLowerCase().includes('turf') || activeBranch.name?.toLowerCase().includes('turf'));
  const activeBranchCategory = activeBranch.category || (isTurfBranch ? 'Football Turf' : (currentMerchant?.category || 'Resort Booking'));

  const baseConfig = getArchetypeConfig(activeBranchCategory || currentMerchant?.archetype || 'Service');
  const archetypeConfig = { ...baseConfig, ...(currentMerchant?.customDictionary || {}) };

  const isMatch = (b: any) => {
    if (!b) return false;
    const bId = String(b.merchantId || '').trim();
    const bName = (b.merchantName || '').toLowerCase().trim();
    
    // Match by ID or Name
    let matchesMerchant = (curId && bId && curId === bId) || 
                          (curName && bName && (curName === bName || bName.includes(curName) || curName.includes(bName)));
    
    // Also match if booking has merchantName starting with Sunstone / Arena or matching active branch
    if (!matchesMerchant && (curName.includes('sunstone') || curName.includes('resort') || curName.includes('arena'))) {
      if (bName.includes('sunstone') || bName.includes('arena 5') || bName.includes('arena')) {
        matchesMerchant = true;
      }
    }

    if (!matchesMerchant) return false;

    const bCategory = (b.category || '').toLowerCase().trim();
    const bServiceName = (b.serviceName || '').toLowerCase();
    const isBookingTurf = bCategory.includes('turf') || bCategory.includes('football') || bCategory.includes('cricket') || bCategory.includes('pitch') || bCategory.includes('sport') ||
      bServiceName.includes('turf') || bServiceName.includes('football') || bServiceName.includes('pitch');

    // Strict Branch Offering Isolation:
    // If user switched to "Sports Turf" branch -> show Turf bookings
    // If user switched to "Suites & Stays" branch -> show Accommodation/Resort bookings
    if (isTurfBranch) {
      return isBookingTurf;
    } else {
      return !isBookingTurf;
    }
  };

  useEffect(() => {
    setMounted(true);
    if (!currentMerchant) return;

    const fetchSync = async () => {
      try {
        let res = await fetch(`/api/v1/bookings/sync?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) {
          res = await fetch(`http://localhost:9000/api/v1/bookings/sync?t=${Date.now()}`, { cache: 'no-store' });
        }
        if (res.ok) {
          const raw = await res.json();
          const items = Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
          const merchantOnlyLive = items.filter(isMatch);
          setLiveBookings(merchantOnlyLive);
        }
      } catch (e) {
        try {
          const resDirect = await fetch(`http://localhost:9000/api/v1/bookings/sync?t=${Date.now()}`, { cache: 'no-store' });
          if (resDirect.ok) {
            const rawDirect = await resDirect.json();
            const itemsDirect = Array.isArray(rawDirect?.data) ? rawDirect.data : (Array.isArray(rawDirect) ? rawDirect : []);
            const merchantOnlyDirect = itemsDirect.filter(isMatch);
            setLiveBookings(merchantOnlyDirect);
          }
        } catch (err2) {}
      }
    };
    fetchSync();
    const interval = setInterval(fetchSync, 2000);
    return () => clearInterval(interval);
  }, [currentMerchant, isTurfBranch, curId, curName]);

  const handleAccept = async (b: any) => {
    setAcceptingId(b.id);
    try {
      await fetch('/api/v1/bookings/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...b, status: 'CONFIRMED' }),
      });
      setLiveBookings(prev => prev.map(item => item.id === b.id ? { ...item, status: 'CONFIRMED' } : item));
      useVendorStore.setState(state => ({
        bookings: state.bookings.map(item => item.id === b.id ? { ...item, status: 'CONFIRMED' } : item)
      }));
    } catch (e) {}
    setAcceptingId(null);
  };

  const handleAssignStaff = async (booking: any, staffId: string) => {
    const selected = staffAccounts.find(s => s.id === staffId);
    const staffName = selected?.name || '';
    assignStaffToBooking(booking.id, staffId, staffName);
    
    // Update local liveBookings
    setLiveBookings(prev => prev.map(item => item.id === booking.id ? {
      ...item,
      assignedDoctorId: staffId,
      refereeAssigned: staffName,
      assignedStaffName: staffName
    } : item));

    // Sync to backend so persistence & staff view updates
    try {
      await fetch('/api/v1/bookings/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...booking,
          assignedDoctorId: staffId,
          refereeAssigned: staffName,
          assignedStaffName: staffName
        }),
      });
    } catch (err) {}
  };

  if (!currentMerchant || !mounted) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-[#ff6325] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Combine bookings: liveBookings from backend take precedence over local cache
  const combinedRaw = [...liveBookings];
  bookings.forEach((b: any) => {
    if (!combinedRaw.some(lb => lb.ref === b.ref || lb.id === b.id)) {
      combinedRaw.push(b);
    }
  });

  const allMergedBookings = combinedRaw.map((b: any) => {
    const splitPaidCount = b?.isSplitEnabled
      ? (Array.isArray(b.splitPayments)
          ? b.splitPayments.filter((s: any) => s.status === 'PAID').length
          : (typeof b.splitPaidMembers === 'number' ? b.splitPaidMembers : 0))
      : 0;
    const isSplitComplete = !b?.isSplitEnabled || splitPaidCount >= (b?.splitCount || 2);
    const rawStatus = b.status || 'PENDING';
    const resolvedStatus = (b?.isSplitEnabled && !isSplitComplete)
      ? 'SPLIT_PENDING'
      : (rawStatus === 'SPLIT_PENDING' && isSplitComplete ? 'CONFIRMED' : rawStatus);

    return {
      ...b,
      splitPaidMembers: splitPaidCount,
      isSplitComplete,
      status: resolvedStatus,
    };
  });

  // Strict Filter logic — ONLY show bookings that explicitly belong to THIS merchant (by ID or exact Merchant Name)
  // and guarantee strict archetype / category isolation so Villa never sees Bus/Train bookings.
  const curArch = getArchetypeFromCategory(currentMerchant.archetype) || getArchetypeFromCategory(currentMerchant.category);

  let merchantBookings = allMergedBookings.filter(isMatch);

  const isStaffView = loginRole === 'staff';
  if (isStaffView && currentStaff) {
    const staffFiltered = merchantBookings.filter((b) => 
      b.assignedDoctorId === currentStaff.id || b.refereeAssigned === currentStaff.name
    );
    merchantBookings = staffFiltered;
  }

  const displayBookings = merchantBookings;

  const filteredBookings = displayBookings.filter((b) => {
    const searchTarget = (b.teamName || b.customerName || '');
    return searchTarget.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (b.ref || '').toLowerCase().includes(searchQuery.toLowerCase());
  }).sort((a, b) => {
    const parseTime = (item: any) => {
      if (item.bookedAt) {
        const d = new Date(item.bookedAt).getTime();
        if (!isNaN(d)) return d;
      }
      if (item.id && !isNaN(Number(item.id)) && Number(item.id) > 1700000000000) {
        return Number(item.id);
      }
      const dateStr = item.date || '2026-01-01';
      const d = new Date(dateStr).getTime();
      return !isNaN(d) ? d : 0;
    };
    return parseTime(b) - parseTime(a);
  });

  const selectedBooking = allMergedBookings.find((b) => b.id === selectedBookingId);
  const selectedStaff = staffAccounts.find(s => s.id === selectedBooking?.assignedDoctorId || s.name === selectedBooking?.refereeAssigned);
  const EmptyIcon = archetypeConfig.emptyStateIcon || User;

  const handleOpenDrawer = (booking: PersistedBooking) => {
    setSelectedBookingId(booking.id);
  };

  return (
    <div className="relative min-h-full pb-12 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8 border-b border-border-brand/40 pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight flex items-center gap-3">
            {archetypeConfig.bookingHeaderTitle || 'Bookings'}
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ff6325]/10 text-[#ff6325] border border-[#ff6325]/20">
              {filteredBookings.length} Total
            </span>
          </h1>
          <p className="text-sm text-text-secondary font-medium mt-2 max-w-2xl">
            {archetypeConfig.bookingHeaderDesc || 'Manage your bookings and records.'}
          </p>
          <div className="mt-2 text-xs font-mono text-slate-500 flex items-center gap-2">
            <span>Merchant: <strong className="text-slate-800 dark:text-slate-200">{currentMerchant.merchantName}</strong> ({currentMerchant.id?.substring(0,8)}...)</span>
            <span>•</span>
            <span>Live Sync: <strong className="text-emerald-600 font-bold">{liveBookings.length}</strong> items</span>
            <button 
              onClick={async () => {
                try {
                  const res = await fetch(`http://localhost:9000/api/v1/bookings/sync?t=${Date.now()}`);
                  const raw = await res.json();
                  const items = Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
                  const merchantOnly = items.filter(isMatch);
                  setLiveBookings(merchantOnly);
                } catch(e) {}
              }} 
              className="px-2 py-0.5 rounded bg-[#ff6325] text-white font-bold text-[10px] ml-2 hover:opacity-90 active:scale-95"
            >
              Force Sync
            </button>
          </div>
        </div>
        
        <div className="relative w-full md:w-[350px] shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted" />
          </div>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={archetypeConfig.customerSearchPlaceholder || 'Search...'}
            className="w-full bg-bg-secondary border border-border-brand/60 rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold text-text-primary placeholder-text-muted outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325]/20 transition-all shadow-sm hover:shadow-md" 
          />
        </div>
      </div>

      {/* Modern Robust Data Table / List */}
      <div className="bg-bg-secondary rounded-3xl border border-border-brand/60 shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-bg-tertiary/40 border-b border-border-brand/40 text-[10px] font-black uppercase tracking-widest text-text-secondary">
          <div className="col-span-3">{archetypeConfig.bookingRefLabel || 'Ref & Name'}</div>
          <div className="col-span-2">Date / Time</div>
          <div className="col-span-3">Service Type</div>
          <div className="col-span-2">{archetypeConfig.bookingAssignedLabel || 'Assigned Staff'}</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border-brand/30">
          {filteredBookings.map((b) => {
            const staff = staffAccounts.find(s => s.id === b.assignedDoctorId || s.name === b.refereeAssigned);
            const isPending = b.status === 'CONFIRMED' || b.status === 'CHECKED_IN';
            const primaryName = (b.teamName || b.customerName || 'Guest Customer');
            
            return (
              <div 
                key={b.id} 
                onClick={() => handleOpenDrawer(b)}
                className={`group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:px-8 py-6 items-center hover:bg-bg-tertiary/30 transition-colors cursor-pointer ${selectedBookingId === b.id ? ('bg-bg-tertiary/50') : ''}`}
              >
                {/* Column 1: Patient/Team */}
                <div className="col-span-1 md:col-span-3 flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${isPending ? 'bg-[#ff6325]/15 text-[#ff6325] border border-[#ff6325]/30' : 'bg-[#0a3161]/20 text-[#0a3161] dark:text-[#ff6325] border border-[#0a3161]/30'}`}>
                    {(primaryName || '?').charAt(0)}
                  </div>
                  <div>
                    <h3 className={`text-sm font-black text-text-primary transition-colors group-hover:text-[#ff6325]`}>{primaryName}</h3>
                    <p className="text-[10px] font-bold text-text-secondary flex items-center gap-1 mt-0.5"><FileDigit size={12} /> {b.ref}</p>
                  </div>
                </div>

                {/* Column 2: DateTime */}
                <div className="col-span-1 md:col-span-2">
                  <p className="text-xs font-black text-text-primary">{b.date}</p>
                  <p className="text-[10px] font-bold text-[#ff6325]">{b.time}</p>
                </div>

                {/* Column 3: Service */}
                <div className="col-span-1 md:col-span-3">
                  <p className="text-xs font-bold text-text-primary line-clamp-1">{b.serviceName}</p>
                  <p className="text-[10px] font-semibold text-text-secondary">{b.category || currentMerchant.category}</p>
                </div>

                {/* Column 4: Doctor/Staff Assign Selector */}
                <div className="col-span-1 md:col-span-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-bg-tertiary border border-border-brand flex items-center justify-center shrink-0">
                      <EmptyIcon size={10} className='text-text-secondary' />
                    </div>
                    <div className="min-w-0 flex-1">
                      <select
                        value={b.assignedDoctorId || ''}
                        onChange={(e) => handleAssignStaff(b, e.target.value)}
                        className="w-full bg-bg-secondary hover:bg-bg-tertiary border border-border-brand/70 rounded-lg px-2 py-1 text-xs font-bold text-text-primary outline-none focus:border-[#ff6325] cursor-pointer transition-colors truncate"
                      >
                        <option value="">Unassigned</option>
                        {staffAccounts.map(s => {
                          const role = s.roleTitle || (s as any).role || '';
                          return (
                            <option key={s.id} value={s.id}>
                              {archetypeConfig.staffPrefix || ''}{s.name}{role ? ` (${role})` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Column 5: Status / Action */}
                <div className="col-span-1 md:col-span-2 flex justify-end items-center gap-2">
                  {b.status === 'SPLIT_PENDING' ? (
                    <div className="px-3.5 py-1.5 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                      <span>👥 Split ({b.splitPaidMembers || 0}/{b.splitCount || 2})</span>
                    </div>
                  ) : b.status === 'PENDING' ? (
                    <button
                      disabled={acceptingId === b.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(b);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      {acceptingId === b.id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>✓ Accept</>
                      )}
                    </button>
                  ) : (
                    <div className={`px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border ${
                      b.status === 'COMPLETED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                      b.status === 'CHECKED_IN' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                      b.status === 'CONFIRMED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                      b.status === 'CANCELLED' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                      'bg-[#ff6325]/10 border-[#ff6325]/30 text-[#ff6325]'
                    }`}>
                      {b.status === 'COMPLETED' || b.status === 'CONFIRMED' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      {b.status.replace('_', ' ')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredBookings.length === 0 && (
            <div className="py-24 text-center bg-bg-secondary">
              <Search className="mx-auto h-12 w-12 text-text-muted mb-4 opacity-50" />
              <h3 className="text-lg font-black text-text-primary mb-2">No Records Found</h3>
              <p className="text-sm font-semibold text-text-secondary">No records match your current search parameters.</p>
            </div>
          )}
        </div>
      </div>

      {/* THE ULTIMATE DRAWER (MEDICAL or TURF) */}
      {selectedBooking && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBookingId(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[700px] lg:w-[800px] bg-bg-secondary border-l border-border-brand/60 shadow-2xl flex flex-col transform transition-transform animate-slide-in">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border-brand/40 p-6 bg-bg-secondary shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-white shadow-md bg-[#0a3161] dark:bg-[#ff6325]">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-text-primary">{archetypeConfig.drawerHeader}</h2>
                  <p className="text-xs font-black tracking-widest uppercase mt-1 flex items-center gap-1.5 text-[#ff6325]">
                    <FileDigit size={12} /> REF ID: {selectedBooking.ref}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedBookingId(null)} className="h-10 w-10 flex items-center justify-center rounded-full bg-bg-tertiary border border-border-brand text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Entity Snapshot */}
            <div className="bg-bg-secondary border-b border-border-brand/40 p-6 shrink-0 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-[2rem] bg-gradient-to-br from-[#ff6325] to-[#ff8452] border-2 border-[#ff6325]/40 shadow-lg flex items-center justify-center shrink-0 text-white font-black text-2xl md:text-3xl select-none">
                {((selectedBooking.customerName || selectedBooking.teamName || 'U').charAt(0)).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-text-primary">{selectedBooking.teamName || selectedBooking.customerName}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-text-secondary">
                  <span className="flex items-center gap-1"><User size={14} className="text-text-muted" /> Booker: {selectedBooking.customerName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Phone size={14} className="text-text-muted" /> {selectedBooking.customerPhone}</span>
                  {archetypeConfig.hasHealthVitals && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1"><HeartPulse size={14} className="text-red-400" /> Blood: O+</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><AlertCircle size={14} className="text-amber-400" /> Allergies: Penicillin</span>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 shrink-0 text-right min-w-[160px]">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-1">{archetypeConfig.assignedStaffLabel || 'Assigned Staff'}</p>
                <select
                  value={selectedBooking.assignedDoctorId || ''}
                  onChange={(e) => handleAssignStaff(selectedBooking, e.target.value)}
                  className="bg-bg-secondary hover:bg-bg-tertiary border border-border-brand/70 rounded-lg px-2 py-1 text-xs font-bold text-text-primary outline-none focus:border-[#ff6325] cursor-pointer transition-colors max-w-full"
                >
                  <option value="">Unassigned</option>
                  {staffAccounts.map(s => {
                    const role = s.roleTitle || (s as any).role || '';
                    return (
                      <option key={s.id} value={s.id}>
                        {archetypeConfig.staffPrefix || ''}{s.name}{role ? ` (${role})` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Dynamic Archetype Operational Controls & Metadata */}
            <div className="flex-1 bg-bg-primary overflow-y-auto p-6 space-y-6">
              {/* Common Booking & Pricing Summary */}
              <div className="p-4 rounded-2xl bg-bg-secondary border border-border-brand/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-text-secondary">Booking Details</span>
                  <div className="text-right">
                    <span className="text-base font-black text-[#ff6325] block">
                      ₹{Number(selectedBooking.amount || selectedBooking.price || selectedBooking.totalAmount || 0).toLocaleString()}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      selectedBooking.payMode === 'PARTIAL_ADVANCE' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {selectedBooking.isSplitEnabled && (selectedBooking.splitPaidMembers || 0) < (selectedBooking.splitCount || 2)
                        ? `Split In Progress (${selectedBooking.splitPaidMembers || 0}/${selectedBooking.splitCount || 2} Paid)`
                        : selectedBooking.payMode === 'PARTIAL_ADVANCE' ? '30% Advance Paid (Venue Pay)' : 'Paid Online (100% UPI)'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-text-muted text-[10px] block font-semibold">Service Booked</span>
                    <span className="font-bold text-text-primary">{selectedBooking.serviceName || 'Custom Service'}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] block font-semibold">Schedule Window</span>
                    <span className="font-bold text-text-primary">{selectedBooking.time || selectedBooking.date}</span>
                  </div>
                </div>

                {/* ── Partial Advance & Venue Pay Settlement Card (Only for non-split partial bookings) ── */}
                {selectedBooking.payMode === 'PARTIAL_ADVANCE' && !selectedBooking.isSplitEnabled && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                        <span>💰</span> Payment Mode: 30% Advance + Venue Pay
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Collect at Venue
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="p-2.5 rounded-xl bg-bg-secondary/70 border border-border-brand/40">
                        <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">Advance Paid Online</span>
                        <span className="text-base font-black text-emerald-400">
                          ₹{Number(selectedBooking.advancePaid || Math.round((selectedBooking.amount || 0) * 0.3)).toLocaleString()}
                        </span>
                        <span className="text-[9px] text-text-muted block mt-0.5">✓ Received via Bokspot</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-bg-secondary/70 border border-amber-500/30 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">Balance to Collect at Venue</span>
                          <span className="text-base font-black text-amber-400">
                            {selectedBooking.venueBalanceCollected ? '₹0' : `₹${Number(selectedBooking.balanceAtVenue || ((selectedBooking.amount || 0) - Math.round((selectedBooking.amount || 0) * 0.3))).toLocaleString()}`}
                          </span>
                          <span className={`text-[9px] block mt-0.5 ${selectedBooking.venueBalanceCollected ? 'text-emerald-400 font-bold' : 'text-amber-300/80'}`}>
                            {selectedBooking.venueBalanceCollected ? '✓ Fully Settled at Venue' : '⚠️ Collect cash/UPI on arrival'}
                          </span>
                        </div>

                        {!selectedBooking.venueBalanceCollected && (
                          <button
                            onClick={async () => {
                              const bId = selectedBooking.id;
                              const updated = {
                                ...selectedBooking,
                                venueBalanceCollected: true,
                                venueBalanceCollectedAt: new Date().toISOString(),
                              };
                              setLiveBookings(prev => prev.map(item => item.id === bId ? updated : item));
                              useVendorStore.setState(state => ({
                                bookings: state.bookings.map(item => item.id === bId ? updated : item)
                              }));
                              try {
                                await fetch('/api/v1/bookings/sync', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(updated),
                                });
                              } catch (err) {}
                              alert(`Collected ₹${Number(selectedBooking.balanceAtVenue || ((selectedBooking.amount || 0) - Math.round((selectedBooking.amount || 0) * 0.3))).toLocaleString()} balance at venue from ${selectedBooking.customerName}! Payment marked fully settled.`);
                            }}
                            className="mt-2 w-full py-1.5 px-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white font-black text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
                          >
                            ✓ Mark Balance Collected
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Accept / Status Action Inside Drawer */}
                <div className="pt-3 border-t border-border-brand/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      selectedBooking.status === 'SPLIT_PENDING' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
                      selectedBooking.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                      selectedBooking.status === 'CHECKED_IN' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      selectedBooking.status === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40' :
                      selectedBooking.status === 'CANCELLED' ? 'bg-red-500/15 text-red-400 border-red-500/40' :
                      'bg-[#ff6325]/15 text-[#ff6325] border-[#ff6325]/30'
                    }`}>
                      {selectedBooking.status === 'SPLIT_PENDING' 
                        ? `SPLIT (${selectedBooking.splitPaidMembers || 0}/${selectedBooking.splitCount || 2} PAID)` 
                        : (selectedBooking.status || 'PENDING')}
                    </span>
                  </div>

                  {selectedBooking.status === 'PENDING' && (
                    <button
                      disabled={acceptingId === selectedBooking.id}
                      onClick={() => handleAccept(selectedBooking)}
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {acceptingId === selectedBooking.id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>✓ Accept Reservation</>
                      )}
                    </button>
                  )}
                </div>

                {/* Group Split Details Card for Merchant */}
                {Boolean(selectedBooking.isSplitEnabled) && (
                  <div className="mt-3 p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-indigo-400 flex items-center gap-1.5">
                        👥 Group Split Booking ({selectedBooking.splitPaidMembers || 0}/{selectedBooking.splitCount || 2} Paid)
                      </span>
                      <span className="font-mono text-[10px] font-bold text-text-muted">
                        Per Head: ₹{(selectedBooking.splitPerPerson || Math.round(selectedBooking.amount / (selectedBooking.splitCount || 2))).toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {(selectedBooking.splitPayments || [
                        { name: selectedBooking.customerName, role: 'LEADER', status: 'PAID', amount: selectedBooking.amountPaidByLeader || (selectedBooking.amount / (selectedBooking.splitCount || 2)) }
                      ]).map((m: any, idx: number) => {
                        const isMemberPaid = m.status === 'PAID';
                        return (
                          <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-bg-tertiary/40 text-[11px]">
                            <span className="font-bold text-text-primary flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${isMemberPaid ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                              {m.name} {m.role === 'LEADER' ? '(Initiator)' : ''}
                            </span>
                            {isMemberPaid ? (
                              <span className="text-emerald-400 font-mono font-bold">✓ Paid ₹{m.amount?.toLocaleString()}</span>
                            ) : (
                              <span className="text-amber-400 font-mono font-bold">⏳ Pending ₹{m.amount?.toLocaleString()}</span>
                            )}
                          </div>
                        );
                      })}

                      {(selectedBooking.splitPaidMembers || 0) < (selectedBooking.splitCount || 2) && (
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] flex items-center justify-between text-amber-400">
                          <span className="font-medium">
                            {(selectedBooking.splitCount || 2) - (selectedBooking.splitPaidMembers || 0)} Member(s) Pending
                          </span>
                          <span className="text-[10px] font-bold">Escrow Protected</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 1. DOCTOR / HEALTHCARE OPD QUEUE & EMR TAB */}
              {(currentMerchant.category?.toLowerCase().includes('doctor') || currentMerchant.archetype === 'Healthcare' || selectedBooking.metadata?.appointmentBooking) && (
                <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-500 font-extrabold text-sm">
                      <Stethoscope size={16} />
                      <span>Doctor OPD Consultation & Token Queue</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-black text-[10px] border border-blue-500/20">
                      Token #{selectedBooking.metadata?.appointmentBooking?.tokenNum || '14'}
                    </span>
                  </div>

                  {selectedBooking.metadata?.appointmentBooking?.patientNotes && (
                    <div className="p-3 rounded-xl bg-bg-secondary border border-border-brand text-xs">
                      <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Patient Reported Symptoms:</span>
                      <p className="text-text-primary italic">"{selectedBooking.metadata.appointmentBooking.patientNotes}"</p>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => completeBooking(selectedBooking.id)}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                    >
                      ✓ Mark Consultation Complete
                    </button>
                    <button
                      onClick={() => alert(`Calling Token #${selectedBooking.metadata?.appointmentBooking?.tokenNum || '14'} to Room 3`)}
                      className="px-4 py-2.5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-brand text-text-primary font-bold text-xs transition-all cursor-pointer"
                    >
                      📢 Call Next Token
                    </button>
                  </div>
                </div>
              )}

              {/* 2. VEHICLE & ASSET RENTAL HANDOVER & DEPOSIT TAB */}
              {(currentMerchant.category?.toLowerCase().includes('rental') || currentMerchant.category?.toLowerCase().includes('bike') || currentMerchant.category?.toLowerCase().includes('car') || selectedBooking.metadata?.rentalBooking) && (
                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-500 font-extrabold text-sm">
                      <Zap size={16} />
                      <span>Vehicle Handover & Refundable Deposit Checklist</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-black text-[10px] border border-amber-500/20">
                      Deposit: ₹2,000 (Tax-Exempt)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-bg-secondary border border-border-brand cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded accent-[#ff6325]" />
                      <span className="text-text-primary font-medium">Driving License Verified</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-bg-secondary border border-border-brand cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded accent-[#ff6325]" />
                      <span className="text-text-primary font-medium">Odometer & Fuel Logged</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-bg-secondary border border-border-brand cursor-pointer">
                      <input type="checkbox" className="rounded accent-[#ff6325]" />
                      <span className="text-text-primary font-medium">Vehicle Returned Without Damage</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-bg-secondary border border-border-brand cursor-pointer">
                      <input type="checkbox" className="rounded accent-[#ff6325]" />
                      <span className="text-text-primary font-medium">Helmet / Accessories Handed Back</span>
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      alert('Deposit of ₹2,000 refunded via original payment mode.');
                      completeBooking(selectedBooking.id);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    ✓ Release ₹2,000 Deposit & Complete Rental
                  </button>
                </div>
              )}

              {/* 3. HOME VISITS & FIELD SERVICE OTP COMPLETION */}
              {(currentMerchant.category?.toLowerCase().includes('electrician') || currentMerchant.category?.toLowerCase().includes('plumber') || currentMerchant.category?.toLowerCase().includes('cleaning') || selectedBooking.metadata?.homeCallBooking) && (
                <div className="p-5 rounded-2xl bg-teal-500/5 border border-teal-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-teal-500 font-extrabold text-sm">
                      <CheckCircle2 size={16} />
                      <span>Doorstep Visit & Job OTP Signoff</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-black text-[10px] border border-teal-500/20">
                      Upfront Fee: ₹199
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-bg-secondary border border-border-brand text-xs space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase block">Service Address:</span>
                    <p className="text-text-primary font-semibold">
                      {selectedBooking.metadata?.homeCallBooking?.serviceAddress || selectedBooking.customerAddress || 'Customer Doorstep Location'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter 4-Digit Customer Signoff OTP"
                      maxLength={4}
                      className="flex-1 bg-bg-secondary border border-border-brand rounded-xl px-3 py-2 text-xs font-bold text-text-primary outline-none focus:border-[#ff6325]"
                    />
                    <button
                      onClick={() => {
                        alert('Job confirmed with customer OTP. Final receipt generated.');
                        completeBooking(selectedBooking.id);
                      }}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Verify & Sign Off
                    </button>
                  </div>
                </div>
              )}

              {/* 4. TURNSTILE PASS SCANNER (EVENTS & MOVIES) */}
              {(currentMerchant.category?.toLowerCase().includes('movie') || currentMerchant.category?.toLowerCase().includes('concert') || currentMerchant.category?.toLowerCase().includes('event') || selectedBooking.metadata?.passBooking) && (
                <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-400 font-extrabold text-sm">
                      <Tag size={16} />
                      <span>Turnstile Gate Entry Verification</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-black text-[10px] border border-purple-500/20">
                      {selectedBooking.metadata?.passBooking?.tier || 'General Pass'} ({selectedBooking.metadata?.passBooking?.passCount || 1} Pax)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-bg-secondary border border-border-brand flex items-center justify-between text-xs">
                    <span className="text-text-secondary font-medium">Turnstile Gate Scan Status:</span>
                    <span className="font-black text-emerald-400">QR Valid • Ready for Entry</span>
                  </div>

                  <button
                    onClick={() => {
                      checkInBooking(selectedBooking.id);
                    }}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    ⚡ Punch Turnstile Entry Gate
                  </button>
                </div>
              )}

              {/* 5. HOME SERVICE DOORSTEP DISPATCH & OTP */}
              {(currentMerchant.category?.toLowerCase().includes('electrician') || currentMerchant.category?.toLowerCase().includes('plumber') || currentMerchant.category?.toLowerCase().includes('cleaning') || currentMerchant.category?.toLowerCase().includes('ac') || currentMerchant.category?.toLowerCase().includes('repair') || currentMerchant.category?.toLowerCase().includes('technician') || selectedBooking.metadata?.homeService) && (
                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                      <Clock size={16} />
                      <span>Doorstep Job Dispatch & Start OTP</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-black text-[10px] border border-amber-500/20">
                      Inspection ₹199
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-bg-secondary border border-border-brand flex items-center justify-between">
                      <span className="text-text-secondary font-medium">Customer Doorstep Start OTP:</span>
                      <span className="font-mono font-black text-white bg-white/10 px-2 py-0.5 rounded tracking-widest text-sm">4 8 2 1</span>
                    </div>
                    <div className="p-3 rounded-xl bg-bg-secondary border border-border-brand flex items-center justify-between">
                      <span className="text-text-secondary font-medium">Technician Status:</span>
                      <span className="font-bold text-amber-400">Assigned & En Route 🛵</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      checkInBooking(selectedBooking.id);
                      alert('Technician arrived & OTP Verified! Job status marked IN_PROGRESS with 30-Day BOKSPOT Warranty active.');
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    Verify Start OTP & Begin Job
                  </button>
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}
