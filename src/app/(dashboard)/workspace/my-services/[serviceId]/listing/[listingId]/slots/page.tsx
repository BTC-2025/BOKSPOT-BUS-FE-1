'use client';

import { useVendorStore, CatalogListing } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Plus, Trash2, Calendar as CalendarIcon, Save } from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function SlotManagerPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;
  const listingId = params.listingId as string;
  
  const { services, updateService, currentMerchant } = useVendorStore();
  const [mounted, setMounted] = useState(false);

  const [activeDay, setActiveDay] = useState<string>('Monday');
  const [scheduleMode, setScheduleMode] = useState<'WEEKLY' | 'SPECIFIC_DATE'>('WEEKLY');
  const [selectedSpecificDate, setSelectedSpecificDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [schedule, setSchedule] = useState<Array<{ dayOfWeek?: string; specificDate?: string; startTime: string; endTime: string; price: number }>>([]);
  
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('10:00');
  const [newPrice, setNewPrice] = useState('500');

  useEffect(() => {
    setMounted(true);
    if (services.length > 0 && currentMerchant) {
      const category = services.find(s => s.id === serviceId);
      if (category) {
        const list = category.listings?.find(l => l.id === listingId);
        if (list && list.schedule) {
          setSchedule(list.schedule);
        } else if (list && list.price) {
            setNewPrice(list.price.toString());
        }
      }
    }
  }, [services, serviceId, listingId, currentMerchant]);

  if (!mounted || !currentMerchant) return null;

  const category = services.find(s => s.id === serviceId);
  const listing = category?.listings?.find(l => l.id === listingId);

  if (!category || !listing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Listing Not Found</h2>
        <button onClick={() => router.push(`/workspace/my-services/${serviceId}`)} className="px-6 py-2 bg-gradient-to-r from-[#0a3161] to-[#124b8f] text-white font-bold rounded-xl shadow-lg shadow-[#0a3161]/20">Go Back</button>
      </div>
    );
  }

  // Active slots filter based on mode
  const activeDaySlots = scheduleMode === 'WEEKLY'
    ? schedule.filter(s => s.dayOfWeek === activeDay && !s.specificDate).sort((a, b) => a.startTime.localeCompare(b.startTime))
    : schedule.filter(s => s.specificDate === selectedSpecificDate).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleAddSlot = () => {
    if (!newStartTime || !newEndTime || !newPrice) return;
    
    const newSlot = scheduleMode === 'WEEKLY'
      ? {
          dayOfWeek: activeDay,
          startTime: newStartTime,
          endTime: newEndTime,
          price: parseFloat(newPrice) || 0
        }
      : {
          specificDate: selectedSpecificDate,
          dayOfWeek: new Date(selectedSpecificDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }),
          startTime: newStartTime,
          endTime: newEndTime,
          price: parseFloat(newPrice) || 0
        };
    
    setSchedule([...schedule, newSlot]);
  };

  const handleRemoveSlot = (indexToRemove: number) => {
    const activeSlot = activeDaySlots[indexToRemove];
    if (!activeSlot) return;
    setSchedule(schedule.filter(s => s !== activeSlot));
  };

  const handleCopyFromMonday = () => {
    const mondaySlots = schedule.filter(s => s.dayOfWeek === 'Monday' && !s.specificDate);
    if (mondaySlots.length === 0) {
      alert("No weekly recurring slots on Monday to copy!");
      return;
    }
    
    // Remove existing slots for active day
    const filteredSchedule = schedule.filter(s => s.dayOfWeek !== activeDay || s.specificDate);
    
    // Add Monday's slots for active day
    const copiedSlots = mondaySlots.map(s => ({ ...s, dayOfWeek: activeDay }));
    
    setSchedule([...filteredSchedule, ...copiedSlots]);
  };

  const handleApplyToAllDays = () => {
    const currentDaySlots = schedule.filter(s => s.dayOfWeek === activeDay && !s.specificDate);
    if (currentDaySlots.length === 0) {
      alert(`No weekly slots created for ${activeDay} yet! Please add at least 1 slot first.`);
      return;
    }

    const specificDateSlots = schedule.filter(s => !!s.specificDate);
    const allDaysSchedule: Array<{ dayOfWeek?: string; specificDate?: string; startTime: string; endTime: string; price: number }> = [...specificDateSlots];
    
    DAYS_OF_WEEK.forEach(day => {
      currentDaySlots.forEach(s => {
        allDaysSchedule.push({
          ...s,
          dayOfWeek: day
        });
      });
    });

    setSchedule(allDaysSchedule);
    alert(`Applied ${currentDaySlots.length} slots from ${activeDay} across all 7 days! Click 'Save Schedule' to publish.`);
  };

  const handleSaveSchedule = () => {
    const updatedListing = { ...listing, schedule };
    
    const updatedCategory = {
      ...category,
      listings: category.listings!.map(l => l.id === listingId ? updatedListing : l)
    };
    
    updateService(updatedCategory);
    alert('Schedule saved successfully!');
    router.push(`/workspace/my-services/${serviceId}`);
  };

  const formattedDateTitle = selectedSpecificDate
    ? new Date(selectedSpecificDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <button 
            onClick={() => router.push(`/workspace/my-services/${serviceId}`)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm mb-2 transition-colors"
          >
            <ArrowLeft size={16} /> Back to {category.name}
          </button>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <CalendarIcon className="text-[#ff6325]" size={28} />
            Slot Manager: {listing.name}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Configure your recurring weekly availability or set custom slots for specific calendar dates.</p>
        </div>
        <button
          onClick={handleSaveSchedule}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-bold rounded-xl shadow-lg shadow-[#ff6325]/25 transition-all"
        >
          <Save size={18} /> Save Schedule
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
        <button
          type="button"
          onClick={() => setScheduleMode('WEEKLY')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            scheduleMode === 'WEEKLY'
              ? 'bg-[#0a3161] text-white shadow-md shadow-[#0a3161]/25'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>🔁</span> Recurring Weekly Schedule
        </button>
        <button
          type="button"
          onClick={() => setScheduleMode('SPECIFIC_DATE')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            scheduleMode === 'SPECIFIC_DATE'
              ? 'bg-[#ff6325] text-white shadow-md shadow-[#ff6325]/25'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>📅</span> Specific Calendar Date Slots
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        {scheduleMode === 'WEEKLY' ? (
          <div className="w-full md:w-64 shrink-0 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 h-fit sticky top-24">
            <h3 className="font-bold text-slate-900 mb-4 px-2">Days of Week</h3>
            <div className="space-y-1">
              {DAYS_OF_WEEK.map(day => {
                const slotCount = schedule.filter(s => s.dayOfWeek === day && !s.specificDate).length;
                const isActive = activeDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive ? 'bg-gradient-to-r from-[#0a3161] to-[#124b8f] text-white shadow-md shadow-[#0a3161]/25' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {day}
                    {slotCount > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-[#ff6325]/10 text-[#ff6325] font-bold'}`}>
                        {slotCount} slots
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="w-full md:w-72 shrink-0 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 h-fit sticky top-24 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Pick a Date</h3>
              <p className="text-xs text-slate-500">Select any calendar date to manage slots specifically for that day.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Target Date</label>
              <input
                type="date"
                value={selectedSpecificDate}
                onChange={e => setSelectedSpecificDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 text-sm focus:border-[#ff6325] focus:ring-2 focus:ring-[#ff6325]/20 outline-none shadow-xs"
              />
            </div>

            {/* Quick date shortcuts */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2 tracking-wider">Quick Select</span>
              <div className="flex flex-col gap-1.5">
                {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                  const d = new Date();
                  d.setDate(d.getDate() + offset);
                  const ds = d.toISOString().split('T')[0];
                  const isSelected = selectedSpecificDate === ds;
                  const count = schedule.filter(s => s.specificDate === ds).length;

                  return (
                    <button
                      key={ds}
                      type="button"
                      onClick={() => setSelectedSpecificDate(ds)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                        isSelected 
                          ? 'bg-[#ff6325] text-white shadow-xs' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>
                        {offset === 0 ? 'Today • ' : offset === 1 ? 'Tomorrow • ' : ''}
                        {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      {count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                          {count} slots
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Right Content: Slot Editor */}
        <div className="flex-1 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {scheduleMode === 'WEEKLY' ? `Weekly Slots for Every ${activeDay}` : `Slots for ${formattedDateTitle}`}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {scheduleMode === 'WEEKLY' 
                    ? `These slots will repeat every week on ${activeDay}.` 
                    : `These slots will only apply on ${selectedSpecificDate}.`}
                </p>
              </div>

              {scheduleMode === 'WEEKLY' && (
                <div className="flex items-center gap-2">
                  {activeDaySlots.length > 0 && (
                    <button 
                      onClick={handleApplyToAllDays} 
                      className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:brightness-110 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      title="Copy current day's slots to all other days of the week"
                    >
                      <span>⚡</span> Apply to All 7 Days
                    </button>
                  )}
                  {activeDay !== 'Monday' && (
                    <button onClick={handleCopyFromMonday} className="text-xs font-bold text-[#ff6325] hover:underline bg-[#ff6325]/10 px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                      Copy from Monday
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Add New Slot Form */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-8">
              <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                {scheduleMode === 'WEEKLY' ? `Add New Slot (${activeDay})` : `Add Slot for ${selectedSpecificDate}`}
              </h4>
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Start Time</label>
                  <input type="time" value={newStartTime} onChange={e => setNewStartTime(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325] outline-none" />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">End Time</label>
                  <input type="time" value={newEndTime} onChange={e => setNewEndTime(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325] outline-none" />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Price (₹)</label>
                  <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325] outline-none" placeholder="e.g. 1500" />
                </div>
                <button onClick={handleAddSlot} className="h-[42px] px-6 bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-bold rounded-xl transition-all shadow-md shadow-[#ff6325]/20 flex items-center gap-2">
                  <Plus size={16} /> Add Slot
                </button>
              </div>
            </div>

            {/* List Existing Slots */}
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Active Slots ({activeDaySlots.length})</h4>
              
              {activeDaySlots.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <Clock className="mx-auto text-slate-300 mb-2" size={32} />
                  <p className="text-slate-500 font-medium">
                    {scheduleMode === 'WEEKLY' ? `No weekly slots defined for ${activeDay}.` : `No specific slots defined for ${selectedSpecificDate}.`}
                  </p>
                  <p className="text-slate-400 text-sm mt-1">Use the form above to add your first time slot.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeDaySlots.map((slot, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-[#ff6325]/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-[#0a3161]/10 text-[#0a3161] flex items-center justify-center">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-bold text-emerald-600">₹{slot.price}</span>
                            {slot.specificDate ? (
                              <span className="text-[10px] bg-[#ff6325]/10 text-[#ff6325] px-2 py-0.5 rounded-full font-bold">
                                Specific Date: {slot.specificDate}
                              </span>
                            ) : (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                                Recurring ({slot.dayOfWeek})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => handleRemoveSlot(idx)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Remove Slot">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper to format "14:00" to "02:00 PM"
function formatTime(timeStr: string) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;
  return `${hour.toString().padStart(2, '0')}:${m} ${ampm}`;
}
