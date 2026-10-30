'use client';

import { useVendorStore, PersistedBooking } from '@/lib/store';
import { 
  ChevronLeft, ChevronRight, Calendar, User, Clock, CheckCircle2, 
  ShieldAlert, IndianRupee, Lock, Unlock, PlusCircle, Search, Trash2, XCircle,
  Download, Database, Send, Move
} from 'lucide-react';
import { useState } from 'react';

export default function CalendarPage() {
  const { 
    currentMerchant, 
    bookings, 
    services, 
    checkInBooking, 
    completeBooking, 
    cancelBooking,
    loginRole
  } = useVendorStore();

  const [selectedSlotBooking, setSelectedSlotBooking] = useState<PersistedBooking | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Calendar view preferences
  const [showWeekends, setShowWeekends] = useState(true);
  const [coreHoursOnly, setCoreHoursOnly] = useState(false);

  // Export menu display
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Toast notifications State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Walk-in form State
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinServiceId, setWalkinServiceId] = useState('');
  const [walkinPrice, setWalkinPrice] = useState<number>(0);
  const [walkinNotes, setWalkinNotes] = useState('');

  // Reschedule form State
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  if (!currentMerchant) {
    return <div className="text-center text-slate-500 py-12">Loading calendar session...</div>;
  }

  // Effective branch and offerings isolation
  const effectiveBranches = (currentMerchant.branches && currentMerchant.branches.length > 0)
    ? currentMerchant.branches
    : [
        {
          id: 'branch-main-1',
          name: currentMerchant?.merchantName || 'Main Branch',
          city: currentMerchant?.city || 'Chennai',
          category: currentMerchant?.category || 'General Service',
          businessType: 'Main Facility',
          address: currentMerchant?.address || 'Chennai Location',
          gstStatus: 'WITH_GST',
          gstNumber: currentMerchant?.gstNumber || '33AAAAA0000A1Z5'
        }
      ];
  const activeBranch = effectiveBranches.find(b => b.id === (currentMerchant.activeBranchId || effectiveBranches[0].id)) || effectiveBranches[0];
  const isTurfBranch = (activeBranch.category?.toLowerCase().includes('turf') || activeBranch.name?.toLowerCase().includes('turf'));
  const curName = (currentMerchant.merchantName || '').toLowerCase().trim();

  // Filter bookings for this merchant & active branch
  const merchantBookings = bookings.filter((b) => {
    const bName = (b.merchantName || '').toLowerCase().trim();
    let matchesMerchant = bName === curName || bName.includes(curName) || curName.includes(bName);
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

    return isTurfBranch ? isBookingTurf : !isBookingTurf;
  });

  // Filter services for this merchant to populate form dropdown
  const merchantServices = services.filter(
    (s) => s.merchant.toLowerCase() === currentMerchant.merchantName.toLowerCase() && s.active
  );

  // Apply filters
  const filteredBookings = merchantBookings.filter(b => {
    // 1. Search Query (Client Name)
    if (searchQuery && !b.customerName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // 2. Service Filter
    if (serviceFilter !== 'ALL' && b.serviceName !== serviceFilter) {
      return false;
    }
    // 3. Status Filter
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'BLOCKED') {
        return b.customerName === '🚫 Blocked / Busy Slot';
      }
      if (b.status !== statusFilter) {
        return false;
      }
    }
    return true;
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dates = ['2026-05-25', '2026-05-26', '2026-05-27', '2026-05-28', '2026-05-29', '2026-05-30', '2026-05-31'];
  
  const activeDays = showWeekends ? days : days.slice(0, 5);
  const activeDates = showWeekends ? dates : dates.slice(0, 5);

  const hours = [
    { label: '08:00 AM', query: '08:00 AM' },
    { label: '10:00 AM', query: '10:00 AM' },
    { label: '11:00 AM', query: '11:00 AM' },
    { label: '11:30 AM', query: '11:30 AM' },
    { label: '01:00 PM', query: '01:00 PM' },
    { label: '02:30 PM', query: '02:30 PM' },
    { label: '04:00 PM', query: '04:00 PM' },
    { label: '06:00 PM', query: '06:00 PM' },
    { label: '08:00 PM', query: '08:00 PM' },
    { label: '09:00 PM', query: '09:00 PM' }
  ];

  const activeHours = coreHoursOnly 
    ? hours.filter(h => {
        const lbl = h.label;
        return lbl.includes('10:00') || lbl.includes('11:00') || lbl.includes('11:30') || lbl.includes('01:00') || lbl.includes('02:30') || lbl.includes('04:00');
      })
    : hours;

  // Colors mapping for status
  const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-[#8b6508]/15 text-[#fceea7] border border-[#8b6508]/30',
    CHECKED_IN: 'bg-[#0a3161]/25 text-[#9cc3f5] border border-[#0a3161]/35',
    COMPLETED: 'bg-green-500/10 text-green-400 border border-green-500/20',
    CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20'
  };

  // EXPORT FUNCTIONS
  const handleExportCSV = () => {
    const headers = ['Ref', 'Date', 'Time', 'Customer', 'Phone', 'Service', 'Amount', 'Status', 'Notes'];
    const rows = filteredBookings.map(b => [
      b.ref,
      b.date,
      b.time,
      b.customerName,
      b.customerPhone,
      b.serviceName,
      b.amount,
      b.status,
      (b.notes || '').replace(/"/g, '""')
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BokSpot_Calendar_Export_${currentMerchant.merchantName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setToast({ message: 'CSV exported & downloaded successfully.', type: 'success' });
    setShowExportMenu(false);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredBookings, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `BokSpot_Calendar_Export_${currentMerchant.merchantName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setToast({ message: 'JSON exported & downloaded successfully.', type: 'success' });
    setShowExportMenu(false);
  };

  const handleExportLocalStorage = () => {
    localStorage.setItem(
      `bokspot_calendar_export_${currentMerchant.username}`,
      JSON.stringify(filteredBookings)
    );
    setToast({ 
      message: `Saved ${filteredBookings.length} slots in browser LocalStorage key: bokspot_calendar_export_${currentMerchant.username}`, 
      type: 'success' 
    });
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border flex items-center justify-between gap-4 shadow-2xl animate-fade-in ${
          toast.type === 'success' 
            ? 'bg-green-950/90 border-green-500/30 text-green-400' 
            : toast.type === 'error'
            ? 'bg-red-950/90 border-red-500/30 text-red-400'
            : 'bg-[#0a223f]/90 border-[#0a3161]/40 text-[#9cc3f5]'
        }`}>
          <span className="text-xs font-bold">{toast.message}</span>
          <button onClick={() => setToast(null)} className="opacity-75 hover:opacity-100 cursor-pointer">
            <XCircle size={15} />
          </button>
        </div>
      )}

      {/* Title block */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Interactive Calendar Slots</h1>
          <p className="text-xs text-slate-400">Weekly scheduling planner. Block slots, add walk-ins, and manage bookings instantly.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Export Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] px-4.5 py-2 text-xs text-slate-300 hover:text-white font-bold transition-all cursor-pointer"
            >
              <Download size={13} className="text-[#d4af37]" /> Export Schedule
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2.5 w-56 rounded-xl border border-border-brand bg-bg-tertiary p-2 shadow-2xl z-50 space-y-1 animate-fade-in text-left">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block px-2.5 py-1.5 border-b border-white/5 mb-1">Select Export Target</span>
                
                <button
                  onClick={handleExportCSV}
                  className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-left"
                >
                  <Download size={13} className="text-[#fceea7]" />
                  <span>Download as CSV File</span>
                </button>
                
                <button
                  onClick={handleExportJSON}
                  className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-left"
                >
                  <Download size={13} className="text-[#fceea7]" />
                  <span>Download as JSON File</span>
                </button>
                
                <button
                  onClick={handleExportLocalStorage}
                  className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-slate-300 hover:bg-[#8b6508]/15 hover:text-[#fceea7] transition-colors cursor-pointer text-left"
                >
                  <Database size={13} className="text-[#fceea7]" />
                  <span className="font-bold">Export to LocalStorage</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.01] px-4 py-2 text-xs text-slate-400 font-bold select-none">
            <Calendar size={14} className="text-[#d4af37]" /> May 25 – May 31, 2026
          </div>
        </div>
      </div>

      {/* Preference Settings & Interactive Stats Dashboard Row */}
      <div className="grid md:grid-cols-[260px_1fr] gap-6 items-stretch">
        {/* Preference Toggles */}
        <div className="flex flex-col gap-3 justify-center p-4 rounded-2xl border border-white/5 bg-white/[0.005]">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block">Calendar View Options</span>
          <div className="flex flex-row md:flex-col gap-2">
            <button
              onClick={() => {
                setShowWeekends(!showWeekends);
                setToast({ message: `Calendar updated: ${!showWeekends ? 'Weekends visible' : 'Weekends hidden'}`, type: 'info' });
              }}
              className={`flex-1 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center md:text-left ${
                showWeekends
                  ? 'bg-[#8b6508]/15 border-[#8b6508]/30 text-[#fceea7]'
                  : 'border-white/5 text-slate-400 hover:bg-white/5'
              }`}
            >
              📅 {showWeekends ? 'Hide Weekends' : 'Show Weekends'}
            </button>

            <button
              onClick={() => {
                setCoreHoursOnly(!coreHoursOnly);
                setToast({ message: `Calendar updated: ${!coreHoursOnly ? 'Showing Core Hours Only' : 'Showing All Hours'}`, type: 'info' });
              }}
              className={`flex-1 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center md:text-left ${
                coreHoursOnly
                  ? 'bg-[#8b6508]/15 border-[#8b6508]/30 text-[#fceea7]'
                  : 'border-white/5 text-slate-400 hover:bg-white/5'
              }`}
            >
              ⏰ {coreHoursOnly ? 'Show All Hours (8am-9pm)' : 'Shift Core Hours (10am-4pm)'}
            </button>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.005] flex-1">
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold">Weekly Bookings</span>
            <div className="text-lg font-black text-white">
              {merchantBookings.filter(b => b.customerName !== '🚫 Blocked / Busy Slot' && b.status !== 'CANCELLED').length} slots
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold">Scheduled Revenue</span>
            <div className="text-lg font-black text-[#fceea7]">
              {loginRole === 'supervisor' ? 'Protected' : `₹${merchantBookings.filter(b => b.status !== 'CANCELLED' && b.customerName !== '🚫 Blocked / Busy Slot').reduce((acc, b) => acc + b.amount, 0).toLocaleString('en-IN')}`}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold">Blocked Slots</span>
            <div className="text-lg font-black text-slate-400">
              {merchantBookings.filter(b => b.customerName === '🚫 Blocked / Busy Slot').length} slots
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold">Capacity Utilized</span>
            <div className="text-lg font-black text-emerald-400">
              {Math.round((merchantBookings.filter(b => b.customerName !== '🚫 Blocked / Busy Slot').length / (activeDates.length * activeHours.length)) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters Panel */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white/[0.005] border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-3 flex-wrap flex-1 max-w-2xl">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Search size={13} />
            </span>
            <input
              type="text"
              placeholder="Search customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-500/ border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8b6508]/40"
            />
          </div>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="bg-slate-500/ border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]/40"
          >
            <option value="ALL">All Services</option>
            {Array.from(new Set(merchantBookings.map(b => b.serviceName)))
              .filter(name => name !== 'Blocked Slot' && name !== 'Manually Blocked')
              .map(name => (
                <option key={name} value={name}>{name}</option>
              ))
            }
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-500/ border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]/40"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CHECKED_IN">Checked-in</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="BLOCKED">Blocked Slots</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(searchQuery || serviceFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setServiceFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="text-xs text-[#fceea7] hover:underline font-bold"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Weekly grid container */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 gap-px bg-white/5 border border-white/5 rounded-xl overflow-hidden">
              {/* Header corner */}
              <div className="bg-[#0b101e] p-3 text-center text-[10px] font-black uppercase tracking-wider text-slate-500 border-r border-white/5">Time Slot</div>
              
              {/* Day headers */}
              {activeDays.map((day, idx) => (
                <div key={day} className="bg-[#0b101e] p-3 text-center border-r border-white/5 last:border-r-0">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{day}</div>
                  <div className="text-xs font-black text-white mt-0.5">{activeDates[idx].split('-')[2]}</div>
                </div>
              ))}

              {/* Rows */}
              {activeHours.map((hour) => (
                <div key={hour.label} className="contents">
                  {/* Hour labels */}
                  <div className="bg-[#0b101e]/60 p-3 text-right pr-4 text-[10px] text-slate-500 font-bold border-r border-white/5 flex items-center justify-end h-16">
                    {hour.label}
                  </div>
                  {/* Slots per day */}
                  {activeDates.map((date) => {
                    // Find booking for this date and time
                    const slotBooking = filteredBookings.find(
                      (b) => b.date === date && b.time.toLowerCase() === hour.query.toLowerCase()
                    );
                    const isBlocked = slotBooking?.customerName === '🚫 Blocked / Busy Slot';
                    
                    return (
                      <div 
                        key={`${date}-${hour.label}`} 
                        className={`bg-white/[0.005] p-1.5 h-16 border-r border-white/5 last:border-r-0 flex flex-col justify-center transition-colors relative`}
                      >
                        {slotBooking ? (
                          <button
                            onClick={() => {
                              setSelectedSlotBooking(slotBooking);
                              setSelectedSlot(null);
                            }}
                            className={`w-full h-full rounded-lg p-1.5 text-left border text-[9px] leading-tight truncate font-bold flex flex-col justify-between ${
                              isBlocked
                                ? 'bg-slate-500/ text-slate-500 border-slate-800/60'
                                : statusColors[slotBooking.status] || 'bg-white/5 border-white/10 text-white'
                            } cursor-pointer`}
                          >
                            <span className="truncate block font-black flex items-center gap-1">
                              {isBlocked && <Lock size={8} className="text-slate-500" />}
                              {slotBooking.customerName}
                            </span>
                            <span className="opacity-70 truncate block mt-0.5">{slotBooking.serviceName}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedSlot({ date, time: hour.label });
                              setSelectedSlotBooking(null);
                            }}
                            className="h-full w-full rounded-lg border border-dashed border-white/[0.02] flex items-center justify-center opacity-20 hover:opacity-100 hover:border-[#8b6508]/30 hover:bg-[#8b6508]/5 transition-all cursor-pointer"
                          >
                            <span className="text-[8px] uppercase tracking-wider text-slate-600 font-bold">Free</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Slot / Form Action Panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 space-y-4 min-h-[420px] flex flex-col justify-between">
            {selectedSlotBooking ? (
              // Case 1: Existing Booking Selected
              <div className="space-y-4 flex-1 flex flex-col justify-between animate-fade-in">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">
                      {selectedSlotBooking.customerName === '🚫 Blocked / Busy Slot' ? 'Blocked Slot Details' : 'Slot Booking Details'}
                    </h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-[8px] font-black tracking-wide shrink-0 ${statusColors[selectedSlotBooking.status]}`}>
                      {selectedSlotBooking.status}
                    </span>
                  </div>

                  <div className="space-y-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-[#8b6508]/10 border border-[#8b6508]/20 text-[#fceea7] flex items-center justify-center font-bold text-xs shrink-0">
                        {selectedSlotBooking.customerName[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-white truncate">{selectedSlotBooking.customerName}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">{selectedSlotBooking.ref}</div>
                      </div>
                    </div>

                    <div className="space-y-1.5 border-t border-white/5 pt-2.5 text-[10px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} className="text-slate-500" />
                        <span>Scheduled: {selectedSlotBooking.date} at <strong>{selectedSlotBooking.time}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={11} className="text-slate-500" />
                        <span>Service: <strong className="text-white">{selectedSlotBooking.serviceName}</strong></span>
                      </div>
                      {selectedSlotBooking.customerName !== '🚫 Blocked / Busy Slot' && (
                        <div className="flex items-center gap-1.5">
                          <IndianRupee size={11} className="text-slate-500" />
                          <span>Fee Charged: <strong className="text-white">₹{selectedSlotBooking.amount}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedSlotBooking.notes && (
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">User Notes</span>
                      <p className="text-[10px] text-slate-400 italic bg-white/[0.01] border border-white/5 p-2.5 rounded-lg leading-relaxed">
                        "{selectedSlotBooking.notes}"
                      </p>
                    </div>
                  )}

                  {/* Reschedule Subsection */}
                  {selectedSlotBooking.customerName !== '🚫 Blocked / Busy Slot' && (
                    <div className="space-y-2.5 border-t border-white/5 pt-4">
                      <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider block text-left">Reschedule Slot / Move</span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={rescheduleDate}
                          onChange={(e) => setRescheduleDate(e.target.value)}
                          className="bg-slate-500/ border border-white/5 rounded-xl px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-[#8b6508]/40"
                        >
                          <option value="">Choose Date</option>
                          {dates.map((d, idx) => (
                            <option key={d} value={d}>{days[idx]} ({d.split('-')[2]})</option>
                          ))}
                        </select>

                        <select
                          value={rescheduleTime}
                          onChange={(e) => setRescheduleTime(e.target.value)}
                          className="bg-slate-500/ border border-white/5 rounded-xl px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-[#8b6508]/40"
                        >
                          <option value="">Choose Time</option>
                          {hours.map((h) => (
                            <option key={h.query} value={h.query}>{h.label}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          if (!rescheduleDate || !rescheduleTime) {
                            setToast({ message: 'Select rescheduling date & time first.', type: 'error' });
                            return;
                          }
                          // Check if destination slot is occupied
                          const isOccupied = merchantBookings.some(
                            b => b.date === rescheduleDate && b.time.toLowerCase() === rescheduleTime.toLowerCase() && b.id !== selectedSlotBooking.id
                          );
                          if (isOccupied) {
                            setToast({ message: 'Target slot is already occupied.', type: 'error' });
                            return;
                          }

                          const updated = bookings.map(b => 
                            b.id === selectedSlotBooking.id 
                              ? { ...b, date: rescheduleDate, time: rescheduleTime }
                              : b
                          );
                          useVendorStore.setState({ bookings: updated });
                          setSelectedSlotBooking({ ...selectedSlotBooking, date: rescheduleDate, time: rescheduleTime });
                          
                          setToast({ 
                            message: `Rescheduled client to ${rescheduleDate} at ${rescheduleTime}`, 
                            type: 'success' 
                          });
                          
                          // Clear reschedule forms
                          setRescheduleDate('');
                          setRescheduleTime('');
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#8b6508]/30 bg-[#8b6508]/10 hover:bg-[#8b6508]/20 py-2 text-xs font-bold text-[#fceea7] transition-all text-center cursor-pointer"
                      >
                        <Move size={12} /> Apply Move / Reschedule
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Interactive Actions */}
                <div className="pt-4 border-t border-white/5 space-y-2">
                  {selectedSlotBooking.customerName === '🚫 Blocked / Busy Slot' ? (
                    <button
                      onClick={() => {
                        useVendorStore.setState({
                          bookings: bookings.filter(b => b.id !== selectedSlotBooking.id)
                        });
                        setSelectedSlotBooking(null);
                        setToast({ message: 'Slot has been unblocked successfully.', type: 'success' });
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white transition-all text-center cursor-pointer shadow-md"
                    >
                      <Unlock size={13} /> Unblock Slot / Set Free
                    </button>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        {selectedSlotBooking.status === 'CONFIRMED' && (
                          <button
                            onClick={() => {
                              checkInBooking(selectedSlotBooking.id);
                              setSelectedSlotBooking({ ...selectedSlotBooking, status: 'CHECKED_IN' });
                              setToast({ message: 'Client checked in successfully.', type: 'success' });
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-[#0a3161] hover:bg-[#08264b] py-2 text-[10.5px] font-bold text-white transition-all text-center cursor-pointer shadow-sm"
                          >
                            Check In
                          </button>
                        )}
                        {selectedSlotBooking.status === 'CHECKED_IN' && (
                          <button
                            onClick={() => {
                              completeBooking(selectedSlotBooking.id);
                              setSelectedSlotBooking({ ...selectedSlotBooking, status: 'COMPLETED' });
                              setToast({ message: 'Appointment marked as completed.', type: 'success' });
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-green-600 hover:bg-green-700 py-2 text-[10.5px] font-bold text-white transition-all text-center cursor-pointer shadow-md"
                          >
                            Complete
                          </button>
                        )}
                        {selectedSlotBooking.status !== 'CANCELLED' && selectedSlotBooking.status !== 'COMPLETED' && (
                          <button
                            onClick={() => {
                              cancelBooking(selectedSlotBooking.id);
                              setSelectedSlotBooking({ ...selectedSlotBooking, status: 'CANCELLED' });
                              setToast({ message: 'Appointment has been cancelled.', type: 'info' });
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-red-950/45 border border-red-500/20 hover:bg-red-900/35 py-2 text-[10.5px] font-bold text-red-400 transition-all text-center cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      {/* Simulate SMS Notification */}
                      {selectedSlotBooking.status !== 'CANCELLED' && (
                        <button
                          onClick={() => {
                            setToast({
                              message: `✉️ SMS & email reminder dispatched successfully to ${selectedSlotBooking.customerName}!`,
                              type: 'success'
                            });
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] py-2 text-xs font-bold text-slate-300 transition-all text-center cursor-pointer"
                        >
                          <Send size={12} /> Send Alert Reminder
                        </button>
                      )}

                      <a
                        href="/workspace/bookings"
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 py-2 text-xs font-bold text-slate-300 transition-all text-center cursor-pointer"
                      >
                        Open Complete Client File
                      </a>
                    </>
                  )}
                </div>
              </div>
            ) : selectedSlot ? (
              // Case 2: Free Slot Clicked -> Block or Walk-in
              <div className="space-y-4 flex-1 flex flex-col justify-between animate-fade-in">
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="font-extrabold text-xs text-[#fceea7] uppercase tracking-wider">Configure Free Slot</h3>
                    <button onClick={() => setSelectedSlot(null)} className="text-slate-500 hover:text-slate-300 cursor-pointer">
                      <XCircle size={15} />
                    </button>
                  </div>
                  
                  <div className="text-[10px] text-slate-400">
                    Selected: <strong>{selectedSlot.date}</strong> at <strong>{selectedSlot.time}</strong>
                  </div>

                  <div className="space-y-3.5 pt-2 text-left">
                    {/* Add Walk-in Form */}
                    <div className="space-y-2">
                      <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Walk-in Client Name</span>
                      <input
                        type="text"
                        placeholder="Rajesh Kumar"
                        value={walkinName}
                        onChange={(e) => setWalkinName(e.target.value)}
                        className="w-full bg-slate-500/ border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#8b6508]/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Client Phone</span>
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={walkinPhone}
                        onChange={(e) => setWalkinPhone(e.target.value)}
                        className="w-full bg-slate-500/ border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#8b6508]/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Select Service</span>
                      <select
                        value={walkinServiceId}
                        onChange={(e) => {
                          const sId = e.target.value;
                          setWalkinServiceId(sId);
                          const selectedSvc = merchantServices.find(s => s.id === sId);
                          if (selectedSvc) setWalkinPrice(selectedSvc.price);
                        }}
                        className="w-full bg-slate-500/ border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]/40"
                      >
                        <option value="">-- Choose Service --</option>
                        {merchantServices.map((s) => (
                          <option key={s.id} value={s.id}>{s.name} (₹{s.price})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Service Fee (₹)</span>
                      <input
                        type="number"
                        placeholder="500"
                        value={walkinPrice}
                        onChange={(e) => setWalkinPrice(Number(e.target.value))}
                        className="w-full bg-slate-500/ border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8b6508]/40"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">Appointment Notes</span>
                      <textarea
                        placeholder="Walk-in comments..."
                        value={walkinNotes}
                        onChange={(e) => setWalkinNotes(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-500/ border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#8b6508]/40 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      if (!walkinName) {
                        alert("Please enter a client name for walk-in booking.");
                        return;
                      }
                      const selectedService = merchantServices.find(s => s.id === walkinServiceId);
                      const newBooking: PersistedBooking = {
                        id: `bk-${Date.now()}`,
                        ref: `BK-WI${Math.floor(1000 + Math.random() * 9000)}`,
                        serviceId: walkinServiceId || 'manual-walkin',
                        serviceName: selectedService ? selectedService.name : 'Custom Walk-in Service',
                        merchantName: currentMerchant.merchantName,
                        category: currentMerchant.category,
                        date: selectedSlot.date,
                        time: selectedSlot.time,
                        amount: Number(walkinPrice) || 0,
                        status: 'CONFIRMED',
                        customerName: walkinName,
                        customerEmail: 'walkin@bokspot.com',
                        customerPhone: walkinPhone || 'N/A',
                        notes: walkinNotes ? `Walk-in Notes: ${walkinNotes}` : 'Walk-in appointment.'
                      };
                      useVendorStore.setState({ bookings: [newBooking, ...bookings] });
                      setSelectedSlot(null);
                      setToast({ message: `Successfully registered walk-in client: ${walkinName}`, type: 'success' });
                      
                      // Clear forms
                      setWalkinName('');
                      setWalkinPhone('');
                      setWalkinServiceId('');
                      setWalkinPrice(0);
                      setWalkinNotes('');
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#8b6508] hover:bg-[#a37910] py-2.5 text-xs font-bold text-white transition-all text-center cursor-pointer shadow-md"
                  >
                    <PlusCircle size={13} /> Confirm Walk-in Appointment
                  </button>

                  <button
                    onClick={() => {
                      const newBooking: PersistedBooking = {
                        id: `bk-blocked-${Date.now()}`,
                        ref: `BK-BL${Math.floor(1000 + Math.random() * 9000)}`,
                        serviceId: 'blocked',
                        serviceName: 'Manually Blocked',
                        merchantName: currentMerchant.merchantName,
                        category: currentMerchant.category,
                        date: selectedSlot.date,
                        time: selectedSlot.time,
                        amount: 0,
                        status: 'CANCELLED',
                        customerName: '🚫 Blocked / Busy Slot',
                        customerEmail: 'blocked@bokspot.com',
                        customerPhone: 'N/A',
                        notes: 'Slot manually blocked by business owner.'
                      };
                      useVendorStore.setState({ bookings: [newBooking, ...bookings] });
                      setSelectedSlot(null);
                      setToast({ message: 'Slot blocked successfully.', type: 'info' });
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/5 py-2.5 text-xs font-bold text-slate-300 transition-all text-center cursor-pointer"
                  >
                    <Lock size={13} /> Block Slot / Set Unavailable
                  </button>
                </div>
              </div>
            ) : (
              // Case 3: Empty State
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-500 space-y-2">
                <ShieldAlert size={24} className="text-slate-600 animate-pulse" />
                <h4 className="font-extrabold text-xs text-white">Interactive Planner</h4>
                <p className="text-[10px] text-slate-500 leading-normal max-w-[200px]">
                  Click any booked slot to review details and execute actions, or click any **Free** slot to add walk-ins and block slots.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
