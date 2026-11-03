'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Bed,
  Calendar as CalendarIcon,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter,
  Plus,
  DoorClosed,
  Check,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Key,
  Coffee,
  RefreshCw
} from 'lucide-react';

interface RoomUnit {
  number: string;
  category: string;
  floor: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE';
  currentGuest?: {
    name: string;
    ref: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    phone: string;
    mealPlan: string;
    transit?: boolean;
  };
}

const INITIAL_ROOMS: RoomUnit[] = [
  // 1st Floor - Deluxe
  { number: '101', category: 'Deluxe City View', floor: 1, status: 'OCCUPIED', currentGuest: { name: 'Karthik Raja', ref: 'BOK-HTL-8921', checkIn: 'Today, 12:00 PM', checkOut: 'Tomorrow, 11:00 AM', nights: 1, phone: '+91 98765 43210', mealPlan: 'Free Breakfast (CP)' } },
  { number: '102', category: 'Deluxe City View', floor: 1, status: 'AVAILABLE' },
  { number: '103', category: 'Deluxe City View', floor: 1, status: 'CLEANING' },
  { number: '104', category: 'Deluxe City View', floor: 1, status: 'OCCUPIED', currentGuest: { name: 'Ananya Sharma', ref: 'BOK-HTL-4412', checkIn: 'Oct 14', checkOut: 'Oct 17', nights: 3, phone: '+91 98401 22334', mealPlan: 'Room Only (EP)' } },
  { number: '105', category: 'Deluxe City View', floor: 1, status: 'AVAILABLE' },

  // 2nd Floor - Executive Suites
  { number: '201', category: 'Executive Club Suite', floor: 2, status: 'OCCUPIED', currentGuest: { name: 'Vikram Seth', ref: 'BOK-HTL-7719', checkIn: 'Today, 01:00 PM', checkOut: 'Today, 07:00 PM', nights: 0, phone: '+91 91234 56789', mealPlan: 'Day-Use Transit', transit: true } },
  { number: '202', category: 'Executive Club Suite', floor: 2, status: 'AVAILABLE' },
  { number: '203', category: 'Executive Club Suite', floor: 2, status: 'MAINTENANCE' },
  { number: '204', category: 'Executive Club Suite', floor: 2, status: 'AVAILABLE' },

  // 3rd Floor - Presidential Penthouse
  { number: '301', category: 'Presidential Penthouse', floor: 3, status: 'OCCUPIED', currentGuest: { name: 'Dr. S. Mukherjee', ref: 'BOK-HTL-9003', checkIn: 'Oct 12', checkOut: 'Oct 16', nights: 4, phone: '+91 97890 12345', mealPlan: 'Half Board (MAP)' } },
  { number: '302', category: 'Presidential Penthouse', floor: 3, status: 'AVAILABLE' }
];

const INITIAL_CAMP_TENTS: RoomUnit[] = [
  // Zone 1 - Riverside Alpine Tents
  { number: 'T-01', category: '2-Person Alpine Tent', floor: 1, status: 'OCCUPIED', currentGuest: { name: 'Rahul Varma', ref: 'BOK-CMP-1021', checkIn: 'Today, 03:00 PM', checkOut: 'Tomorrow, 10:00 AM', nights: 1, phone: '+91 98765 11223', mealPlan: 'Campfire + BBQ Dinner' } },
  { number: 'T-02', category: '2-Person Alpine Tent', floor: 1, status: 'AVAILABLE' },
  { number: 'T-03', category: '2-Person Alpine Tent', floor: 1, status: 'CLEANING' },
  { number: 'T-04', category: '4-Person Family Tent', floor: 1, status: 'OCCUPIED', currentGuest: { name: 'Sanjay & Family', ref: 'BOK-CMP-8812', checkIn: 'Today, 02:00 PM', checkOut: 'Day After, 11:00 AM', nights: 2, phone: '+91 98401 55667', mealPlan: 'All Meals + Trekking' } },
  { number: 'T-05', category: '4-Person Family Tent', floor: 1, status: 'AVAILABLE' },

  // Zone 2 - Stargazing Glamping Domes
  { number: 'D-01', category: 'Luxury Stargazing Dome', floor: 2, status: 'OCCUPIED', currentGuest: { name: 'Pooja Iyer', ref: 'BOK-CMP-4432', checkIn: 'Today, 04:00 PM', checkOut: 'Tomorrow, 11:00 AM', nights: 1, phone: '+91 91234 99887', mealPlan: 'Private Bonfire & Wine' } },
  { number: 'D-02', category: 'Luxury Stargazing Dome', floor: 2, status: 'AVAILABLE' },
  { number: 'D-03', category: 'Luxury Stargazing Dome', floor: 2, status: 'MAINTENANCE' },

  // Zone 3 - Open Forest Pitch Allocations
  { number: 'P-01', category: 'DIY Camping Forest Pitch', floor: 3, status: 'AVAILABLE' },
  { number: 'P-02', category: 'DIY Camping Forest Pitch', floor: 3, status: 'AVAILABLE' }
];

const INITIAL_HOSTEL_ROOMS: RoomUnit[] = [
  // Dorm 1 - Mixed AC Dorm
  { number: 'B-101', category: '6-Bed Mixed AC Dorm Bed', floor: 1, status: 'OCCUPIED', currentGuest: { name: 'David Lee', ref: 'BOK-HST-3312', checkIn: 'Oct 20', checkOut: 'Oct 24', nights: 4, phone: '+91 98765 99001', mealPlan: 'Hostel Bed Only' } },
  { number: 'B-102', category: '6-Bed Mixed AC Dorm Bed', floor: 1, status: 'AVAILABLE' },
  { number: 'B-103', category: '6-Bed Mixed AC Dorm Bed', floor: 1, status: 'CLEANING' },
  { number: 'B-104', category: '6-Bed Mixed AC Dorm Bed', floor: 1, status: 'AVAILABLE' },

  // Dorm 2 - Female Only Dorm
  { number: 'B-201', category: '4-Bed Female Dorm Bed', floor: 2, status: 'OCCUPIED', currentGuest: { name: 'Sneha Patel', ref: 'BOK-HST-5521', checkIn: 'Today, 01:00 PM', checkOut: 'Tomorrow, 11:00 AM', nights: 1, phone: '+91 99887 12345', mealPlan: 'Bed + Breakfast' } },
  { number: 'B-202', category: '4-Bed Female Dorm Bed', floor: 2, status: 'AVAILABLE' },

  // Private Deluxe Bunk
  { number: 'P-301', category: 'Private Twin Bunk Room', floor: 3, status: 'AVAILABLE' }
];

import { useVendorStore } from '@/lib/store';
import { getArchetypeConfig } from '@/lib/businessDictionary';

export default function HotelRoomMatrixPage() {
  const { bookings, fetchBookings, currentMerchant } = useVendorStore();
  const catLower = (currentMerchant?.category || '').toLowerCase();
  const archLower = (currentMerchant?.archetype || '').toLowerCase();
  const isCamping = archLower === 'camping' || catLower.includes('camp') || catLower.includes('tent') || catLower.includes('glamp');
  const isHostel = archLower === 'hostel' || catLower.includes('hostel') || catLower.includes('dorm');

  const initialInventory = isCamping ? INITIAL_CAMP_TENTS : isHostel ? INITIAL_HOSTEL_ROOMS : INITIAL_ROOMS;

  const [rooms, setRooms] = useState<RoomUnit[]>(initialInventory);
  const [activeMatrixTab, setActiveMatrixTab] = useState<'ROOMS' | 'MINI_SPACE'>('ROOMS');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'OCCUPIED' | 'CLEANING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<RoomUnit | null>(null);

  // Mini Space (Luggage & Cloakroom Management) state
  const checkMiniSpaceEnabled = () => {
    if (typeof window !== 'undefined') {
      try {
        const id = currentMerchant?.id;
        const uname = currentMerchant?.username;
        const keys = [
          id ? `hotel_luggage_enabled_${id}` : null,
          uname ? `hotel_luggage_enabled_${uname}` : null,
          'hotel_luggage_enabled_H101',
          'hotel_luggage_enabled_default'
        ].filter(Boolean) as string[];

        for (const k of keys) {
          const val = localStorage.getItem(k);
          if (val !== null) return val === 'true';
        }
      } catch {}
    }
    return currentMerchant?.metadata?.isLuggageStorageEnabled ?? true;
  };

  const [miniSpaceEnabled, setMiniSpaceEnabled] = useState<boolean>(checkMiniSpaceEnabled);
  const [miniSpaceSlots, setMiniSpaceSlots] = useState([
    { slotId: 'MS-01', status: 'OCCUPIED', token: 'MNI-K92X', guest: 'Priya Sundaram', bags: 2, dropTime: '10:30 AM', pickupEst: '04:30 PM', phone: '+91 98401 22334', amount: 196 },
    { slotId: 'MS-02', status: 'OCCUPIED', token: 'MNI-7B8A', guest: 'Rohan Sharma', bags: 1, dropTime: '11:15 AM', pickupEst: '03:15 PM', phone: '+91 98840 55667', amount: 98 },
    { slotId: 'MS-03', status: 'AVAILABLE', token: '', guest: '', bags: 0, dropTime: '', pickupEst: '', phone: '', amount: 0 },
    { slotId: 'MS-04', status: 'AVAILABLE', token: '', guest: '', bags: 0, dropTime: '', pickupEst: '', phone: '', amount: 0 },
    { slotId: 'MS-05', status: 'AVAILABLE', token: '', guest: '', bags: 0, dropTime: '', pickupEst: '', phone: '', amount: 0 },
    { slotId: 'MS-06', status: 'AVAILABLE', token: '', guest: '', bags: 0, dropTime: '', pickupEst: '', phone: '', amount: 0 },
  ]);
  const [selectedLuggageSlot, setSelectedLuggageSlot] = useState<any | null>(null);
  const [hourlyPrice, setHourlyPrice] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('vendor-portal-storage-v10');
        if (stored) {
          const parsed = JSON.parse(stored);
          const currentM = parsed.state?.currentMerchant;
          if (currentM?.luggageHourlyRate) return Number(currentM.luggageHourlyRate);
        }
      } catch { }
    }
    return 150;
  });
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [tempHourlyPrice, setTempHourlyPrice] = useState(hourlyPrice);
  const [dayPassPrice, setDayPassPrice] = useState(hourlyPrice * 5);

  const handleSaveHourlyPrice = (newRate: number) => {
    setHourlyPrice(newRate);
    setDayPassPrice(newRate * 5);
    setIsEditingRate(false);

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('vendor-portal-storage-v10');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.state?.currentMerchant) {
            parsed.state.currentMerchant.luggageHourlyRate = newRate;
            localStorage.setItem('vendor-portal-storage-v10', JSON.stringify(parsed));
          }
        }
        localStorage.setItem(`hotel_luggage_rate_${currentMerchant?.id || 'default'}`, String(newRate));
      } catch { }
    }
  };

  const archetypeConfig = getArchetypeConfig(currentMerchant?.archetype || currentMerchant?.category);

  // Sync mini space state on merchant profile changes and storage/custom events
  useEffect(() => {
    const syncStatus = () => {
      setMiniSpaceEnabled(checkMiniSpaceEnabled());
    };

    syncStatus();

    // Listen to cross-window storage event and immediate custom event
    window.addEventListener('storage', syncStatus);
    window.addEventListener('hotel_luggage_toggle', syncStatus);

    return () => {
      window.removeEventListener('storage', syncStatus);
      window.removeEventListener('hotel_luggage_toggle', syncStatus);
    };
  }, [currentMerchant]);

  // Poll backend for real-time customer bookings every 4 seconds
  useEffect(() => {
    fetchBookings();
    const interval = setInterval(() => {
      fetchBookings();
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  // Merge real bookings from customer app into hotel rooms
  useEffect(() => {
    if (!bookings || bookings.length === 0) return;

    // Filter accommodation bookings (hotels, resorts, villas, homestays, rooms)
    const hotelBookings = bookings.filter(b => {
      const cat = (b.category || '').toLowerCase();
      const sName = (b.serviceName || '').toLowerCase();
      return (
        cat.includes('hotel') ||
        cat.includes('room') ||
        cat.includes('accommodation') ||
        cat.includes('resort') ||
        cat.includes('villa') ||
        cat.includes('homestay') ||
        cat.includes('stay') ||
        cat.includes('hostel') ||
        cat.includes('camp') ||
        sName.includes('suite') ||
        sName.includes('deluxe') ||
        sName.includes('room') ||
        sName.includes('villa') ||
        sName.includes('resort')
      );
    });

    if (hotelBookings.length > 0) {
      setRooms(prevRooms => {
        const updated = [...prevRooms];
        hotelBookings.forEach((hb) => {
          // If specific roomNumber was assigned or already assigned to this booking
          let targetRoomIdx = -1;
          if (hb.roomNumber) {
            targetRoomIdx = updated.findIndex(r => r.number === hb.roomNumber);
          }
          if (targetRoomIdx === -1) {
            targetRoomIdx = updated.findIndex(r => r.currentGuest?.ref === hb.ref);
          }
          // If not assigned yet and booking is not cancelled, pick first available room
          if (targetRoomIdx === -1 && hb.status !== 'CANCELLED') {
            targetRoomIdx = updated.findIndex(r => r.status === 'AVAILABLE');
          }

          if (targetRoomIdx !== -1) {
            updated[targetRoomIdx] = {
              ...updated[targetRoomIdx],
              status: hb.status === 'CANCELLED' ? 'AVAILABLE' : 'OCCUPIED',
              currentGuest: hb.status === 'CANCELLED' ? undefined : {
                name: hb.customerName || 'Verified Guest',
                ref: hb.ref,
                checkIn: hb.time ? `${hb.date || 'Today'} (${hb.time})` : (hb.date || 'Today'),
                checkOut: hb.time && hb.time.includes('to') ? hb.time.split('to')[1]?.trim() : 'Next Day',
                nights: (hb as any).durationMinutes ? Math.round((hb as any).durationMinutes / 1440) || 1 : 1,
                phone: hb.customerPhone || '+91 99887 76655',
                mealPlan: hb.notes?.includes('Breakfast') ? 'With Breakfast' : (hb.serviceName || 'Standard Stay')
              }
            };
          }
        });
        return updated;
      });
    }
  }, [bookings]);

  useEffect(() => {
    if (!selectedRoom && rooms.length > 0) {
      setSelectedRoom(rooms[0]);
    }
  }, [rooms, selectedRoom]);

  // Status changer
  const handleUpdateStatus = async (roomNumber: string, newStatus: RoomUnit['status']) => {
    const targetRoom = rooms.find(r => r.number === roomNumber);
    const guestRef = targetRoom?.currentGuest?.ref;

    // If releasing room from Occupied via Check-out, mark booking as COMPLETED
    if (guestRef && (newStatus === 'CLEANING' || newStatus === 'AVAILABLE')) {
      try {
        const matchingBooking = bookings.find(b => b.ref === guestRef);
        if (matchingBooking) {
          const updated = { ...matchingBooking, status: 'COMPLETED' as const };
          useVendorStore.getState().completeBooking(matchingBooking.id);
          await fetch('/api/v1/bookings/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          });
        } else {
          await fetch('/api/v1/bookings/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ref: guestRef, status: 'COMPLETED' }),
          });
        }
      } catch (err) {
        console.warn('Failed to sync completed checkout to backend:', err);
      }
    }

    setRooms(prev => prev.map(r => {
      if (r.number === roomNumber) {
        return {
          ...r,
          status: newStatus,
          currentGuest: newStatus === 'AVAILABLE' || newStatus === 'CLEANING' ? undefined : r.currentGuest
        };
      }
      return r;
    }));
    if (selectedRoom?.number === roomNumber) {
      setSelectedRoom(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Quick Stats
  const totalRooms = rooms.length;
  const occupiedCount = rooms.filter(r => r.status === 'OCCUPIED').length;
  const availableCount = rooms.filter(r => r.status === 'AVAILABLE').length;
  const cleaningCount = rooms.filter(r => r.status === 'CLEANING').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

  const filteredRooms = rooms.filter(r => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNumber = r.number.toLowerCase().includes(q);
      const matchCat = r.category.toLowerCase().includes(q);
      const matchGuest = r.currentGuest?.name.toLowerCase().includes(q);
      return matchNumber || matchCat || matchGuest;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b13] text-slate-900 dark:text-slate-100 p-6 md:p-8 space-y-6 transition-colors">

      {/* ─── Header & Live KPI Ribbon ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ff6325]/15 text-[#ff6325] border border-[#ff6325]/30">
              {isCamping ? 'Campsite Inventory PMS' : isHostel ? 'Hostel Dorm PMS' : 'Frontdesk PMS Matrix'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Live Inventory & Tape Chart</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            {isCamping ? 'Tent & Pitch Allocation Grid' : isHostel ? 'Hostel Dorm & Bed Control' : 'Hotel Room Grid & Guest Control'}
          </h1>
        </div>

        {/* Switcher & Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Main Module Tabs */}
          <div className="p-1 rounded-xl bg-slate-200/80 dark:bg-white/10 flex items-center gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveMatrixTab('ROOMS')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${activeMatrixTab === 'ROOMS'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Bed size={13} />
              <span>Rooms Inventory</span>
            </button>
            {miniSpaceEnabled && (
              <button
                type="button"
                onClick={() => setActiveMatrixTab('MINI_SPACE')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${activeMatrixTab === 'MINI_SPACE'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                    : 'text-amber-600 dark:text-amber-400 hover:text-amber-700'
                  }`}
              >
                <span>🧳</span>
                <span>Mini Space (Luggage)</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-900 text-white font-black">
                  {miniSpaceSlots.filter(s => s.status === 'OCCUPIED').length} Active
                </span>
              </button>
            )}
          </div>

          {activeMatrixTab === 'ROOMS' && (
            <button
              onClick={() => handleUpdateStatus(selectedRoom?.number || (isCamping ? 'T-02' : '103'), 'AVAILABLE')}
              className="px-4 py-2 bg-emerald-50 dark:bg-emerald-500/15 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <CheckCircle2 size={15} />
              <span>{isCamping ? 'Mark Tent Ready' : isHostel ? 'Mark Bed Ready' : 'Mark Selected Ready'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Metric Cards ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0f1728] border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-sm dark:shadow-lg">
          <span className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider block">Live Occupancy</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{occupancyRate}%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">({occupiedCount}/{totalRooms} {isCamping ? 'Tents/Pitches' : isHostel ? 'Beds' : 'Rooms'})</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#ff6325] h-full rounded-full transition-all duration-500" style={{ width: `${occupancyRate}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f1728] border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-sm dark:shadow-lg">
          <span className="text-[11px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block">Available for Booking</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{availableCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Instant Check-in Ready</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 block">Synced with Booking.com & Bokspot</span>
        </div>

        <div className="bg-white dark:bg-[#0f1728] border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-sm dark:shadow-lg">
          <span className="text-[11px] font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider block">Housekeeping / Cleaning</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">{cleaningCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Under Sanitization</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 block">Assigned to Floor Roster</span>
        </div>

        <div className="bg-white dark:bg-[#0f1728] border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-sm dark:shadow-lg">
          <span className="text-[11px] font-extrabold uppercase text-[#ff6325] tracking-wider block">Transit Stays Today</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-[#ff6325]">1</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Day-Use Layover</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 block">Hourly check-out at 07:00 PM</span>
        </div>
      </div>

      {/* ─── ROOMS INVENTORY TAB ─── */}
      {activeMatrixTab === 'ROOMS' ? (
        <>
          {/* ─── Search & Status Filters ─── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0d1424] p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-2 w-full sm:w-80 bg-slate-50 dark:bg-[#121c33] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search room, category, or guest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none font-medium"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'ALL', label: `All Rooms (${totalRooms})` },
                { id: 'AVAILABLE', label: `Available (${availableCount})` },
                { id: 'OCCUPIED', label: `Occupied (${occupiedCount})` },
                { id: 'CLEANING', label: `Cleaning (${cleaningCount})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${statusFilter === tab.id
                      ? 'bg-[#ff6325] text-white shadow-md shadow-[#ff6325]/25'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ─── Main Grid: Room Matrix + Detail Drawer ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column: Room Grid by Floor */}
            <div className="lg:col-span-8 space-y-6">
              {[1, 2, 3].map(floorNumber => {
                const floorRooms = filteredRooms.filter(r => r.floor === floorNumber);
                if (floorRooms.length === 0) return null;

                const zoneName = isCamping
                  ? (floorNumber === 1 ? 'Zone 1: Riverside Pitches' : floorNumber === 2 ? 'Zone 2: Stargazing Domes' : 'Zone 3: Forest Clearing')
                  : isHostel
                    ? (floorNumber === 1 ? 'Dorm 1: Mixed AC Bunks' : floorNumber === 2 ? 'Dorm 2: Female Sanctuary' : 'Private Bunk Units')
                    : `Floor ${floorNumber}`;

                const zoneTag = isCamping
                  ? (floorNumber === 1 ? 'Alpine Canvas Tents' : floorNumber === 2 ? 'Glamping Geodesic Domes' : 'Open Pitch Tents')
                  : isHostel
                    ? (floorNumber === 1 ? 'Ground Level 8-Bed' : floorNumber === 2 ? 'Upper Deck 6-Bed' : 'Deluxe Bunks')
                    : (floorNumber === 1 ? 'Deluxe Wing' : floorNumber === 2 ? 'Executive Club Wing' : 'Presidential Suites');

                const unitLabel = isCamping ? 'Tents / Pitches' : isHostel ? 'Beds' : 'Rooms';

                return (
                  <div key={floorNumber} className="bg-white dark:bg-[#0e1628] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff6325]" />
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{zoneName}</h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400">({floorRooms.length} {unitLabel})</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {zoneTag}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {floorRooms.map(room => {
                        const isSelected = selectedRoom?.number === room.number;

                        return (
                          <div
                            key={room.number}
                            onClick={() => setSelectedRoom(room)}
                            className={`rounded-2xl p-4 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-36 ${isSelected
                                ? 'bg-orange-50/70 dark:bg-[#15223d] border-[#ff6325] shadow-xl ring-2 ring-[#ff6325]/30'
                                : room.status === 'OCCUPIED'
                                  ? 'bg-indigo-50/40 dark:bg-[#121a2c] border-indigo-200 dark:border-indigo-500/25 hover:border-indigo-400 dark:hover:border-indigo-500/50'
                                  : room.status === 'AVAILABLE'
                                    ? 'bg-emerald-50/40 dark:bg-[#0f1d24] border-emerald-200 dark:border-emerald-500/25 hover:border-emerald-400 dark:hover:border-emerald-500/50'
                                    : 'bg-amber-50/40 dark:bg-[#1a1c17] border-amber-200 dark:border-amber-500/25 hover:border-amber-400 dark:hover:border-amber-500/50'
                              }`}
                          >
                            {/* Top bar with Unit Number & Category pill */}
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-xl font-black text-slate-900 dark:text-white">{room.number}</span>
                                <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[90px] font-medium">{room.category}</span>
                              </div>

                              {/* Status Dot */}
                              <span className={`w-3 h-3 rounded-full shadow-md ${room.status === 'OCCUPIED' ? 'bg-indigo-500 ring-4 ring-indigo-500/20' :
                                  room.status === 'AVAILABLE' ? 'bg-emerald-500 ring-4 ring-emerald-500/20' :
                                    'bg-amber-500 ring-4 ring-amber-500/20 animate-pulse'
                                }`} />
                            </div>

                            {/* Bottom Summary */}
                            <div>
                              {room.status === 'OCCUPIED' ? (
                                <div>
                                  <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate block">{room.currentGuest?.name}</span>
                                  <span className="text-[9px] text-indigo-600 dark:text-indigo-300 font-bold">{room.currentGuest?.transit ? '⚡ Day-Pass Camp' : `${room.currentGuest?.nights} Nights`}</span>
                                </div>
                              ) : room.status === 'AVAILABLE' ? (
                                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle2 size={12} />
                                  <span>Ready</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                  <Clock size={12} />
                                  <span>{isCamping ? 'Resetting Pitch' : 'Cleaning'}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Selected Unit Guest Details & Frontdesk Controls */}
            <div className="lg:col-span-4 space-y-6">
              {selectedRoom ? (
                <div className="bg-white dark:bg-[#0e1628] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xl space-y-5 sticky top-24">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-[#ff6325] block">
                        {isCamping ? 'Tent & Pitch Folio' : isHostel ? 'Bed & Dorm Folio' : 'Room Folio'}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {isCamping ? `Unit ${selectedRoom.number}` : isHostel ? `Bed ${selectedRoom.number}` : `Room ${selectedRoom.number}`}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{selectedRoom.category}</span>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${selectedRoom.status === 'OCCUPIED' ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' :
                        selectedRoom.status === 'AVAILABLE' ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' :
                          'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                      }`}>
                      {selectedRoom.status}
                    </span>
                  </div>

                  {/* Guest Details or Vacant Slate */}
                  {selectedRoom.currentGuest ? (
                    <div className="space-y-4">
                      <div className="bg-slate-50 dark:bg-[#121c32] p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Primary Camper / Guest</span>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#ff6325]/15 text-[#ff6325] flex items-center justify-center font-black">
                            {selectedRoom.currentGuest.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{selectedRoom.currentGuest.name}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium">{selectedRoom.currentGuest.ref}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">Check-in</span>
                          <span className="text-slate-900 dark:text-white font-bold">{selectedRoom.currentGuest.checkIn}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">Check-out</span>
                          <span className="text-slate-900 dark:text-white font-bold">{selectedRoom.currentGuest.checkOut}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">{isCamping ? 'Camp Plan' : 'Meal Plan'}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedRoom.currentGuest.mealPlan}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">Phone Contact</span>
                          <span className="text-slate-900 dark:text-white font-bold">{selectedRoom.currentGuest.phone}</span>
                        </div>
                      </div>

                      {/* Actions for Occupied Unit */}
                      <div className="space-y-2 pt-2">
                        <button
                          onClick={() => handleUpdateStatus(selectedRoom.number, 'CLEANING')}
                          className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 border border-rose-300 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                        >
                          {isCamping ? 'Process Check-Out & Clean Pitch' : isHostel ? 'Process Check-Out & Strip Bed' : 'Process Check-Out & Release Room'}
                        </button>
                        {!isCamping && (
                          <button
                            onClick={async () => {
                              const guestRef = selectedRoom.currentGuest?.ref;
                              try {
                                if (guestRef) {
                                  const matchingBooking = bookings.find(b => b.ref === guestRef);
                                  const updated = {
                                    ...(matchingBooking || { ref: guestRef }),
                                    keycardIssued: true,
                                    roomNumber: selectedRoom.number,
                                    keycardIssuedAt: new Date().toISOString(),
                                  };
                                  await fetch('/api/v1/bookings/sync', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(updated),
                                  });
                                }
                              } catch (err) {
                                console.warn('Keycard sync error:', err);
                              }
                              alert(`Digital Access Keycard successfully issued for ${selectedRoom.number} to guest ${selectedRoom.currentGuest?.name}! Access is now live on customer app.`);
                            }}
                            className="w-full py-2.5 bg-gradient-to-r from-[#ff6325] to-[#ff8452] hover:opacity-95 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#ff6325]/20 active:scale-98"
                          >
                            <Key size={14} className="text-white" />
                            <span>Issue Digital Keycard Access</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-slate-50 dark:bg-[#121c32] p-6 rounded-2xl border border-slate-200 dark:border-white/10 text-center space-y-2">
                        <DoorClosed size={36} className="text-slate-400 dark:text-slate-500 mx-auto" />
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {isCamping ? 'Tent / Pitch is Currently Vacant' : isHostel ? 'Bed is Currently Vacant' : 'Room is Currently Vacant'}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Ready for walk-in reservation or Bokspot app guest arrival.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleUpdateStatus(selectedRoom.number, 'AVAILABLE')}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${selectedRoom.status === 'AVAILABLE'
                              ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400'
                              : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                            }`}
                        >
                          Set Available
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedRoom.number, 'CLEANING')}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${selectedRoom.status === 'CLEANING'
                              ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-400'
                              : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                            }`}
                        >
                          {isCamping ? 'Mark Pitch Reset' : 'Mark Cleaning'}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="bg-white dark:bg-[#0e1628] rounded-3xl p-8 border border-slate-200 dark:border-white/10 text-center text-slate-500 dark:text-slate-400 shadow-sm">
                  {isCamping ? 'Select a tent or pitch unit from the grid to manage folio and status.' : 'Select a room unit from the grid to manage folio and housekeeping.'}
                </div>
              )}
            </div>

          </div>
        </>
      ) : (
        /* ─── MINI SPACE / SMART BAG LOCKER CONSOLE ─── */
        <div className="space-y-6">
          {/* Banner with Tariff Pill & Slot Controls */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#101827] to-[#182032] border border-amber-500/25 p-6 shadow-xl text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-amber-500/30">
                    🧳
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                        Smart Locker & Cloakroom Hub
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Live Sync
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                      Frontdesk Bag Locker Console
                    </h2>
                  </div>
                </div>
                <p className="text-xs text-slate-400 max-w-xl">
                  Manage guest baggage check-ins, automated hourly tariff calculation, QR token verification, and instant locker releases.
                </p>
              </div>

              {/* Quick Actions & Tariff Editor */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Tariff Edit */}
                {isEditingRate ? (
                  <div className="flex items-center gap-2 bg-slate-800/90 border border-amber-500/50 p-1.5 rounded-2xl shadow-lg backdrop-blur-md">
                    <span className="text-xs font-bold text-slate-300 pl-2.5">₹</span>
                    <input
                      type="number"
                      value={tempHourlyPrice}
                      onChange={(e) => setTempHourlyPrice(Number(e.target.value))}
                      className="w-16 bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs font-black text-amber-400 outline-none text-center"
                      autoFocus
                    />
                    <span className="text-[11px] text-slate-400">/hr</span>
                    <button
                      type="button"
                      onClick={() => handleSaveHourlyPrice(tempHourlyPrice)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black transition-all cursor-pointer shadow-sm"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingRate(false)}
                      className="px-2 py-1 text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setTempHourlyPrice(hourlyPrice);
                      setIsEditingRate(true);
                    }}
                    className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/40 px-3.5 py-2 rounded-2xl cursor-pointer transition-all group backdrop-blur-md"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center text-xs font-bold">
                      ₹
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Hourly Rate</span>
                      <span className="text-sm font-black text-amber-400">₹{hourlyPrice}<span className="text-[10px] text-slate-400 font-medium"> /bag/hr</span></span>
                    </div>
                    <span className="text-[10px] text-amber-400/80 group-hover:text-amber-300 underline font-bold pl-1">Edit</span>
                  </div>
                )}

                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3.5 py-2 rounded-2xl backdrop-blur-md">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    ⚡
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Day Pass (5x)</span>
                    <span className="text-sm font-black text-indigo-300">₹{dayPassPrice}<span className="text-[10px] text-slate-400 font-medium"> /full day</span></span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newSlotNum = miniSpaceSlots.length + 1;
                    setMiniSpaceSlots(prev => [
                      ...prev,
                      { slotId: `MS-0${newSlotNum}`, status: 'AVAILABLE', token: '', guest: '', bags: 0, dropTime: '', pickupEst: '', phone: '', amount: 0 }
                    ]);
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-slate-950 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-500/25"
                >
                  <Plus size={15} />
                  <span>Add Locker Slot</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                  🔐
                </div>
                <div>
                  <span className="text-xl font-black text-white block leading-none">{miniSpaceSlots.length}</span>
                  <span className="text-[11px] text-slate-400">Total Lockers</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-lg text-amber-400">
                  🎒
                </div>
                <div>
                  <span className="text-xl font-black text-amber-400 block leading-none">
                    {miniSpaceSlots.filter(s => s.status === 'OCCUPIED').reduce((acc, s) => acc + s.bags, 0)} Bags
                  </span>
                  <span className="text-[11px] text-slate-400">Active in Vault</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-lg text-emerald-400">
                  🟢
                </div>
                <div>
                  <span className="text-xl font-black text-emerald-400 block leading-none">
                    {miniSpaceSlots.filter(s => s.status === 'AVAILABLE').length} Open
                  </span>
                  <span className="text-[11px] text-slate-400">Ready for Drop</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-lg text-indigo-400">
                  💳
                </div>
                <div>
                  <span className="text-xl font-black text-indigo-300 block leading-none">
                    ₹{miniSpaceSlots.filter(s => s.status === 'OCCUPIED').reduce((acc, s) => acc + s.amount, 0)}
                  </span>
                  <span className="text-[11px] text-slate-400">Today's Revenue</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Smart Locker Matrix + Interactive Detail Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Visual Locker Units */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Locker Bay Layout
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    ({miniSpaceSlots.length} Compartments)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" /> Stored ({miniSpaceSlots.filter(s => s.status === 'OCCUPIED').length})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" /> Available ({miniSpaceSlots.filter(s => s.status === 'AVAILABLE').length})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {miniSpaceSlots.map((slot) => {
                  const isOccupied = slot.status === 'OCCUPIED';
                  const isSelected = selectedLuggageSlot?.slotId === slot.slotId;

                  return (
                    <div
                      key={slot.slotId}
                      onClick={() => setSelectedLuggageSlot(slot)}
                      className={`group relative rounded-2xl p-4 transition-all duration-200 cursor-pointer overflow-hidden border ${isSelected
                          ? 'bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border-amber-500 shadow-xl ring-2 ring-amber-500/30 dark:bg-slate-800'
                          : isOccupied
                            ? 'bg-white dark:bg-[#0e1628] border-amber-400/40 hover:border-amber-400 dark:hover:border-amber-400 hover:shadow-lg'
                            : 'bg-white dark:bg-[#0e1628] border-slate-200/80 dark:border-white/10 hover:border-emerald-400/60 hover:shadow-md'
                        }`}
                    >
                      {/* Top Compartment Header */}
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs ${isOccupied
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}>
                            {slot.slotId.replace('MS-', '#')}
                          </div>
                          <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                            {slot.slotId}
                          </span>
                        </div>

                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${isOccupied
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isOccupied ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                          {isOccupied ? 'Locked' : 'Open'}
                        </span>
                      </div>

                      {/* Locker Body Content */}
                      {isOccupied ? (
                        <div className="space-y-2.5">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Guest & Tag</span>
                            <span className="font-black text-sm text-slate-900 dark:text-white truncate block">
                              {slot.guest}
                            </span>
                          </div>

                          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                              <span>🎒</span>
                              <span>{slot.bags} {slot.bags > 1 ? 'Bags' : 'Bag'}</span>
                            </div>
                            <span className="font-mono text-[11px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                              {slot.token}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-1 text-[10px] font-bold text-slate-400 pt-1">
                            <div>
                              <span className="block text-[9px] uppercase">Drop</span>
                              <span className="text-slate-700 dark:text-slate-200">{slot.dropTime}</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[9px] uppercase">Pick Est</span>
                              <span className="text-amber-600 dark:text-amber-400">{slot.pickupEst}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 flex flex-col items-center justify-center text-center space-y-1.5">
                          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm font-black">
                            ✓
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Empty Vault
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Ready for incoming drop
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Visual Smart Inspector & Digital Release Folio */}
            <div className="lg:col-span-4 bg-white dark:bg-[#0e1628] rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 shadow-lg space-y-5 sticky top-24">
              {selectedLuggageSlot ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center text-lg font-black">
                        🧳
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-black uppercase tracking-wider block">
                          Locker Inspection Folio
                        </span>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">
                          {selectedLuggageSlot.slotId}
                        </h3>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${selectedLuggageSlot.status === 'OCCUPIED'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      }`}>
                      {selectedLuggageSlot.status === 'OCCUPIED' ? 'Stored' : 'Available'}
                    </span>
                  </div>

                  {selectedLuggageSlot.status === 'OCCUPIED' ? (
                    <div className="space-y-4">
                      {/* Guest Pass Ticket Card */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-slate-200/80 dark:border-white/10 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/10">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Guest Name</span>
                            <span className="font-black text-sm text-slate-900 dark:text-white">{selectedLuggageSlot.guest}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Token Pass</span>
                            <span className="font-mono font-black text-xs text-amber-600 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md">
                              {selectedLuggageSlot.token}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Contact:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{selectedLuggageSlot.phone}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Baggage:</span>
                            <span className="font-black text-slate-800 dark:text-slate-200">🎒 {selectedLuggageSlot.bags} Bags</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Drop Time:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{selectedLuggageSlot.dropTime}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Est. Return:</span>
                            <span className="font-bold text-amber-600 dark:text-amber-400">{selectedLuggageSlot.pickupEst}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-500">Amount Paid:</span>
                          <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">₹{selectedLuggageSlot.amount}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setMiniSpaceSlots(prev => prev.map(s => {
                            if (s.slotId === selectedLuggageSlot.slotId) {
                              return { ...s, status: 'AVAILABLE', token: '', guest: '', bags: 0, dropTime: '', pickupEst: '', phone: '', amount: 0 };
                            }
                            return s;
                          }));
                          setSelectedLuggageSlot((prev: any) => ({ ...prev, status: 'AVAILABLE', token: '', guest: '', bags: 0, amount: 0 }));
                        }}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/25 transition-all"
                      >
                        <CheckCircle2 size={15} />
                        <span>Verify Token & Handover Luggage</span>
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-xl">
                        ✓
                      </div>
                      <h4 className="font-black text-slate-900 dark:text-white text-sm">Locker Ready</h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        This compartment is sanitized and vacant for next guest baggage drop.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-xl">
                    🔍
                  </div>
                  <h4 className="font-black text-slate-700 dark:text-slate-300 text-sm">No Locker Selected</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Click on any locker card on the left to inspect baggage token, guest phone, or release slot.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
