'use client';

import { useVendorStore } from '../../lib/store';
import { Activity, Info, Map, Camera, Dumbbell, Baby, Wrench, Building2, Ticket } from 'lucide-react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Create a dynamic import for the real map component to avoid SSR issues with Leaflet
// Defining this outside the component prevents it from unmounting/remounting on every state change/poll.
const RealMap = dynamic(() => import('./RealMapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] flex items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl animate-pulse">
      <div className="flex flex-col items-center">
        <div className="h-6 w-6 border-2 border-[#8b6508] border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Syncing Live Map Feed...</p>
      </div>
    </div>
  )
});

export default function LiveResourceMap() {
  const { currentMerchant } = useVendorStore();
  const [hoveredResource, setHoveredResource] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!currentMerchant || !mounted) return null;

  const arch = currentMerchant.archetype;

  // --- TURF / SPORTS (ResourceBooking, SportsFacility) ---
  if (arch === 'ResourceBooking' || arch === 'SportsFacility') {
    const pitches = [
      { id: 'Pitch A', type: '5A-Side', status: 'Available', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600', icon: '🟢', details: 'Ready for booking' },
      { id: 'Pitch B', type: '5A-Side', status: 'Booked', color: 'bg-red-500/20 border-red-500/40 text-red-600', icon: '🔴', details: 'Ongoing Match (Ends in 20m)' },
      { id: 'Pitch C', type: '7A-Side', status: 'Maintenance', color: 'bg-amber-500/20 border-amber-500/40 text-amber-600', icon: '🟡', details: 'Net repair in progress' }
    ];

    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative">
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Activity size={18} className="text-emerald-500" /> Live Field Map
            </h2>
            <p className="text-xs font-semibold text-slate-500">Real-time pitch availability and match status.</p>
          </div>
        </div>

        <div className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div className="flex flex-col gap-4 relative z-10">
            {pitches.map((pitch) => (
              <div 
                key={pitch.id}
                onMouseEnter={() => setHoveredResource(pitch.id)}
                onMouseLeave={() => setHoveredResource(null)}
                className={`w-full h-24 rounded-2xl border-2 flex flex-col justify-between p-4 cursor-pointer transition-all ${pitch.color} ${hoveredResource === pitch.id ? 'scale-[1.02] shadow-lg' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-black text-lg">{pitch.id}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/50">{pitch.status}</span>
                </div>
                <div className="text-xs font-bold opacity-70">{pitch.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- HOSPITAL (Healthcare) ---
  if (arch === 'Healthcare') {
    const beds = [
      { id: 'Bed 01', type: 'ICU', status: 'Occupied', color: 'bg-red-50 border-red-200 text-red-600' },
      { id: 'Bed 02', type: 'ICU', status: 'Available', color: 'bg-emerald-50 border-emerald-200 text-emerald-600' },
      { id: 'Bed 03', type: 'General', status: 'Available', color: 'bg-emerald-50 border-emerald-200 text-emerald-600' },
      { id: 'Bed 04', type: 'General', status: 'Cleaning', color: 'bg-amber-50 border-amber-200 text-amber-600' },
    ];
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative">
        <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          <Activity size={18} className="text-[#0ea5e9]" /> Live Ward Map
        </h2>
        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="grid grid-cols-2 gap-4">
            {beds.map((bed) => (
              <div key={bed.id} className={`p-4 border rounded-xl ${bed.color}`}>
                <div className="font-black text-sm mb-2">{bed.id}</div>
                <div className="text-[10px] font-bold uppercase">{bed.status} • {bed.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- HOTEL (Accommodation) ---
  if (arch === 'Accommodation') {
    const rooms = Array.from({length: 8}).map((_, i) => ({
      id: `Room ${101 + i}`,
      status: Math.random() > 0.5 ? 'Available' : 'Occupied'
    }));
    return (
      <div className="bg-white dark:bg-[#12141a] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 size={18} className="text-amber-500" /> Floor Plan
          </h2>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-400" /> Occupied
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-white/[0.02] p-5 sm:p-6 rounded-2xl border border-slate-200/60 dark:border-white/5">
          {rooms.map(r => (
            <div 
              key={r.id} 
              className={`h-16 rounded-xl border flex flex-col items-center justify-center transition-all ${
                r.status === 'Available' 
                  ? 'bg-emerald-50/70 dark:bg-emerald-500/10 border-emerald-300/80 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs' 
                  : 'bg-slate-100/80 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500'
              }`}
            >
              <span className="text-xs font-black">{r.id}</span>
              <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-0.5">{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- RESTAURANT (Dining) ---
  if (arch === 'Dining') {
    const tables = [
      { id: 'T-01', size: '2-Seater', status: 'Available', color: 'bg-emerald-50 border-emerald-200 text-emerald-600' },
      { id: 'T-02', size: '4-Seater', status: 'Occupied', color: 'bg-red-50 border-red-200 text-red-600' },
      { id: 'T-03', size: '6-Seater', status: 'Reserved', color: 'bg-amber-50 border-amber-200 text-amber-600' },
    ];
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative">
        <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          <Map size={18} className="text-orange-500" /> Restaurant Layout
        </h2>
        <div className="flex justify-center gap-6 bg-slate-50 p-8 rounded-2xl border border-slate-200">
          {tables.map((table) => (
            <div key={table.id} className={`h-24 w-24 rounded-full border-4 flex flex-col items-center justify-center ${table.color}`}>
              <span className="font-black text-sm">{table.id}</span>
              <span className="text-[9px] font-bold mt-1">{table.size}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- GYM (Fitness) ---
  if (arch === 'Fitness') {
    const zones = [
      { name: 'Cardio Zone', crowded: 'High', color: 'bg-red-50 border-red-200 text-red-600' },
      { name: 'Free Weights', crowded: 'Medium', color: 'bg-amber-50 border-amber-200 text-amber-600' },
      { name: 'Yoga Studio', crowded: 'Low', color: 'bg-emerald-50 border-emerald-200 text-emerald-600' },
    ];
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative">
        <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          <Dumbbell size={18} className="text-purple-500" /> Gym Zones
        </h2>
        <div className="flex flex-col gap-3">
          {zones.map(z => (
            <div key={z.name} className={`p-4 rounded-xl border flex justify-between items-center ${z.color}`}>
              <span className="font-black text-sm">{z.name}</span>
              <span className="text-xs font-bold px-3 py-1 bg-white/50 rounded-full">{z.crowded} Traffic</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- RENTAL (Rental) ---
  if (arch === 'Rental') {
    const items = [
      { rack: 'Rack A', status: '8/10 Available', color: 'bg-emerald-50 text-emerald-600' },
      { rack: 'Rack B', status: '2/10 Available', color: 'bg-amber-50 text-amber-600' },
      { rack: 'Rack C', status: '0/10 Available', color: 'bg-red-50 text-red-600' },
    ];
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative">
        <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          <Camera size={18} className="text-blue-500" /> Inventory Layout
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {items.map(item => (
            <div key={item.rack} className={`min-w-[120px] h-32 rounded-xl border-2 flex flex-col items-center justify-center p-2 text-center ${item.color}`}>
              <span className="font-black text-lg mb-2">{item.rack}</span>
              <span className="text-xs font-bold">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- EVENT SPACE (EventSpace) ---
  if (arch === 'EventSpace') {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative">
        <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          <Ticket size={18} className="text-pink-500" /> Venue Layout
        </h2>
        <div className="space-y-4">
          <div className="w-full h-20 bg-indigo-50 border-2 border-indigo-200 rounded-xl flex items-center justify-center text-indigo-700 font-black">Main Hall (Occupied)</div>
          <div className="flex gap-4">
            <div className="flex-1 h-16 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center justify-center text-emerald-700 font-black text-sm">Meeting Rm 1 (Avail)</div>
            <div className="flex-1 h-16 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center justify-center text-emerald-700 font-black text-sm">Meeting Rm 2 (Avail)</div>
          </div>
        </div>
      </div>
    );
  }

  // --- SERVICE / CARE (Service, CareServices) ---
  const isCare = arch === 'CareServices';

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative">
      <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
        {isCare ? <Baby size={18} className="text-rose-500" /> : <Wrench size={18} className="text-slate-700" />}
        {isCare ? 'Active Care Sessions' : 'Field Technician Map'}
      </h2>
      <div className="w-full border border-slate-200 rounded-2xl overflow-hidden relative h-[380px]">
        <RealMap 
          center={[13.0827, 80.2707]} // Default to Chennai
          zoom={12}
          markers={[
            { id: '1', lat: 13.0850, lng: 80.2750, name: 'Rohan', merchant: 'Apollo Dental', category: 'Root Canal Treatment', emoji: '🦷', price: '₹4,500', rating: 4.8 },
            { id: '2', lat: 13.0720, lng: 80.2600, name: 'Vikram', merchant: 'City Clinic', category: 'General Checkup', emoji: '🩺', price: '₹500', rating: 4.5 },
            { id: '3', lat: 13.0950, lng: 80.2800, name: 'Anjali', merchant: 'Care Plus', category: 'Blood Test', emoji: '🩸', price: '₹1,200', rating: 4.9 },
          ]}
        />
      </div>
    </div>
  );
}
