'use client';

import { useVendorStore, CatalogListing, CatalogService } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Image as ImageIcon, Trash2, Calendar, Building2 } from 'lucide-react';

export default function ServiceListingsPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;
  const { services, addService, updateService, currentMerchant } = useVendorStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'LISTINGS' | 'PASSES' | 'TRAINERS'>('LISTINGS');
  const [newTrainer, setNewTrainer] = useState({ name: '', title: '', experienceYears: 5, certs: '', avatar: '', price: 0, priceUnit: 'session' });
  const [trainerModalOpen, setTrainerModalOpen] = useState(false);
  const [slotTargetListingId, setSlotTargetListingId] = useState<string>('ALL');
  const [editingPassModal, setEditingPassModal] = useState(false);
  const [salonFilterCat, setSalonFilterCat] = useState<string>('ALL');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [gymFilterCat, setGymFilterCat] = useState<string>('ALL');
  const [quickGymAddOpen, setQuickGymAddOpen] = useState(false);
  const [quickGymPass, setQuickGymPass] = useState({
    name: '',
    filter: 'Gym Floor',
    duration: 60,
    price: 299,
    originalPrice: 499
  });
  const [gymAmenities, setGymAmenities] = useState<string[]>([
    'Olympic Barbells & Rogue Racks',
    'Hi-Tech Cardio & Sled Track',
    'Steam Sauna & Luxury Showers',
    'InBody Composition Scan',
    'RFID Smart Lockers',
    'Valet Parking'
  ]);
  const [salonOpenTime, setSalonOpenTime] = useState<string>('09:00');
  const [salonCloseTime, setSalonCloseTime] = useState<string>('21:00');
  const [salonSlotInterval, setSalonSlotInterval] = useState<number>(30);
  const [salonCapacity, setSalonCapacity] = useState<number>(2);
  const [manageSlotsOpen, setManageSlotsOpen] = useState(false);
  const todayIso = new Date().toISOString().split('T')[0];
  const tomorrowIso = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [slotFromDate, setSlotFromDate] = useState<string>(todayIso);
  const [slotToDate, setSlotToDate] = useState<string>(tomorrowIso);
  const [breakfastBreak, setBreakfastBreak] = useState({ enabled: false, start: '10:30', end: '11:00' });
  const [lunchBreak, setLunchBreak] = useState({ enabled: true, start: '13:00', end: '14:00' });
  const [blockedSlotsByDate, setBlockedSlotsByDate] = useState<Record<string, string[]>>({});
  const [homeConvenienceFee, setHomeConvenienceFee] = useState<number>(49);
  const [homeMinOrderValue, setHomeMinOrderValue] = useState<number>(399);
  const [scheduleSaved, setScheduleSaved] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<{
    id: string;
    name: string;
    salonCategory: string;
    genderTarget: string;
    serviceMode: string;
    duration: number;
    price: number;
    description: string;
    active: boolean;
    clinicContact?: string;
  } | null>(null);
  const [quickTreatment, setQuickTreatment] = useState({
    name: '',
    salonCategory: 'HAIR',
    genderTarget: 'UNISEX',
    serviceMode: 'BOTH',
    duration: 30,
    price: 499
  });
  const [newPass, setNewPass] = useState<{
    id: string;
    name: string;
    sessions: string;
    price: number;
    originalPrice?: number;
    validity: string;
    perk: string;
  }>({
    id: '',
    name: '',
    sessions: 'Unlimited',
    price: 2999,
    originalPrice: 3800,
    validity: '30 Days Validity',
    perk: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!currentMerchant) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-[#ff6325] border-t-transparent animate-spin" />
      </div>
    );
  }

  const activeMerchant = currentMerchant;

  let category = services.find(s => s.id === serviceId);
  if (!category && typeof window !== 'undefined') {
    try {
      const storedOverride = localStorage.getItem(`custom_service_override_${serviceId}`);
      if (storedOverride) {
        category = JSON.parse(storedOverride);
      }
    } catch (err) {
      console.warn('Failed to parse stored service override', err);
    }
  }

  // Fallback: If category not in store, create a clean dynamic template based on active branch / merchant category
  if (!category && serviceId && currentMerchant) {
    const rawCat = (currentMerchant.category || 'Service').trim();
    const branchId = currentMerchant.activeBranchId || 'main-branch';
    const isYoga = rawCat.toLowerCase().includes('yoga');
    const isGym = rawCat.toLowerCase().includes('gym') || rawCat.toLowerCase().includes('fitness');

    category = {
      id: serviceId,
      name: currentMerchant.merchantName || rawCat,
      merchant: currentMerchant.merchantName || 'Service Provider',
      price: isYoga ? 350 : isGym ? 299 : 500,
      duration: 60,
      category: rawCat,
      active: true,
      branchId,
      rating: 5.0,
      bookingsCount: 0,
      imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=80',
      description: `Active bookable units and passes for ${rawCat}.`,
      city: currentMerchant.city || 'Chennai',
      metadata: {
        branchId,
        merchantName: currentMerchant.merchantName,
        originalCategory: rawCat,
      },
      listings: []
    };
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Category Not Found</h2>
        <button onClick={() => router.push('/workspace/my-services')} className="px-6 py-2 bg-gradient-to-r from-[#0a3161] to-[#124b8f] text-white rounded-xl font-bold shadow-lg shadow-[#0a3161]/20">Go Back</button>
      </div>
    );
  }

  const listings = category.listings || [];

  const handleDeleteListing = (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    const updatedCategory = {
      ...category,
      listings: category.listings!.filter(l => l.id !== listId)
    };
    updateService(updatedCategory);
  };

  const getFallbackImage = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;
  }

  // Display name formatting (clean internal technical identifiers like __BOKSPOT_GROUP__)
  const displayName = (!category.name || category.name === '__BOKSPOT_GROUP__') 
    ? (category.category || 'Service Units') 
    : category.name;

  const isFitnessOrYoga = (category.category || '').toLowerCase().includes('yoga') ||
    (category.category || '').toLowerCase().includes('gym') ||
    (category.category || '').toLowerCase().includes('fitness') ||
    (category.name || '').toLowerCase().includes('yoga') ||
    (category.name || '').toLowerCase().includes('gym') ||
    (category.name || '').toLowerCase().includes('fitness') ||
    (currentMerchant.category || '').toLowerCase().includes('yoga') ||
    (currentMerchant.category || '').toLowerCase().includes('gym') ||
    (currentMerchant.category || '').toLowerCase().includes('fitness');

  const isDoctorClinic = (category.category || '').toLowerCase().includes('doctor') ||
    (category.category || '').toLowerCase().includes('clinic') ||
    (category.category || '').toLowerCase().includes('medical') ||
    (category.name || '').toLowerCase().includes('doctor') ||
    (category.name || '').toLowerCase().includes('clinic') ||
    (currentMerchant.category || '').toLowerCase().includes('doctor') ||
    (currentMerchant.category || '').toLowerCase().includes('clinic');

  const isHomeService = ['electrician', 'plumber', 'cleaning', 'technician'].some(k =>
    (category.category || '').toLowerCase().includes(k) ||
    (category.name || '').toLowerCase().includes(k)
  );

  const passes: any[] = category.metadata?.classPasses || [
    {
      id: 'pass-5-classes',
      name: '5-Class Flexible Pass',
      sessions: '5 Classes',
      price: 1799,
      originalPrice: 2250,
      validity: '45 Days Validity',
      perk: 'Flexible morning/evening access'
    },
    {
      id: 'pass-1-month',
      name: '1-Month Unlimited Pass',
      sessions: 'Unlimited',
      price: 2999,
      originalPrice: 3800,
      validity: '30 Days Validity',
      perk: 'Free Studio Locker + Daily Ayurvedic Brew'
    }
  ];

  const handleSavePasses = (updatedPasses: any[]) => {
    const updatedCategory = {
      ...category,
      metadata: {
        ...(category.metadata || {}),
        classPasses: updatedPasses
      }
    };
    updateService(updatedCategory);
  };

  const trainers: any[] = category.metadata?.trainers || [];

  const handleSaveTrainers = (updatedTrainers: any[]) => {
    const updatedCategory = {
      ...category,
      metadata: {
        ...(category.metadata || {}),
        trainers: updatedTrainers
      }
    };
    updateService(updatedCategory);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">

      {/* 1. Compact Header Strip with Clear Breadcrumbs */}
      <div className="px-5 py-4 rounded-2xl bg-white dark:bg-[#0f1624] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb path */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
            <button
              onClick={() => router.push('/workspace/my-services')}
              className="hover:text-[#ff6325] transition-colors flex items-center gap-1 cursor-pointer font-bold"
            >
              <ArrowLeft size={13} />
              <span>Services</span>
            </button>
            {category.category && (
              <>
                <span>/</span>
                <span className="font-bold">{category.category}</span>
              </>
            )}
            {category.name && category.name !== '__BOKSPOT_GROUP__' && category.name !== category.category && (
              <>
                <span>/</span>
                <span className="text-[#ff6325] font-black">{category.name}</span>
              </>
            )}
          </div>

          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="capitalize">{displayName}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ff6325]/10 text-[#ff6325] font-bold">
              {listings.length} Bookable {listings.length === 1 ? 'Batch' : 'Batches'}
            </span>
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.push('/workspace/about')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold text-xs transition-all border border-slate-200/80 dark:border-white/10 cursor-pointer shadow-sm"
            title="Manage Venue Profile, Photos & Location"
          >
            <Building2 size={14} className="text-[#ff6325]" />
            <span>Venue Profile</span>
          </button>
          {(isFitnessOrYoga || isDoctorClinic || (category.category || '').toLowerCase().includes('salon') || (category.category || '').toLowerCase().includes('spa') || (category.name || '').toLowerCase().includes('salon') || (category.name || '').toLowerCase().includes('spa')) && (
            <button
              type="button"
              onClick={() => setManageSlotsOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a3161] hover:bg-[#ff6325] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Calendar size={14} />
              <span>Manage Slots</span>
            </button>
          )}
          {activeTab === 'LISTINGS' && isFitnessOrYoga && !(category.category || category.name || '').toLowerCase().includes('yoga') ? (
            <button
              type="button"
              onClick={() => setQuickGymAddOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus size={15} /> Add Pass
            </button>
          ) : activeTab === 'LISTINGS' && !isFitnessOrYoga && !((category.category || '').toLowerCase().includes('salon') || (category.category || '').toLowerCase().includes('spa') || (category.name || '').toLowerCase().includes('salon') || (category.name || '').toLowerCase().includes('spa')) && (
            <button
              type="button"
              onClick={() => {
                if (isDoctorClinic) {
                  setEditingTreatment({
                    id: `doc-${Date.now()}`,
                    name: '',
                    price: 500,
                    active: true,
                    duration: 20,
                    salonCategory: 'General Physician',
                    genderTarget: 'ALL',
                    serviceMode: 'IN_SALON',
                    description: 'MBBS • 5+ years experience'
                  });
                } else if (isHomeService) {
                  setEditingTreatment({
                    id: `svc-${Date.now()}`,
                    name: '',
                    price: 499,
                    active: true,
                    duration: 45,
                    salonCategory: '30 Days Warranty',
                    genderTarget: 'ALL',
                    serviceMode: 'IN_SALON',
                    description: ''
                  });
                } else {
                  router.push(`/workspace/my-services/${serviceId}/listing/new`);
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
              title={isDoctorClinic ? 'Add a new Doctor' : isHomeService ? 'Add a new Service' : `Add a new batch under ${displayName}`}
            >
              <Plus size={15} /> {isDoctorClinic ? 'Add Doctor' : isHomeService ? 'Add Service' : 'Add Batch'}
            </button>
          )}
          {activeTab === 'PASSES' && (
            <button
              onClick={() => {
                setNewPass({
                  id: `pass-${Date.now()}`,
                  name: '',
                  sessions: 'Unlimited',
                  price: 2999,
                  originalPrice: 3800,
                  validity: '30 Days Validity',
                  perk: ''
                });
                setEditingPassModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus size={15} /> Add Membership Pass
            </button>
          )}
          {activeTab === 'TRAINERS' && (
            <button
              type="button"
              onClick={() => {
                setNewTrainer({ name: '', title: '', experienceYears: 5, certs: '', avatar: '', price: 0, priceUnit: 'session' });
                setTrainerModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus size={15} /> Add Trainer
            </button>
          )}
        </div>
      </div>

      {/* Quick Salon / Spa Menu Builder (Single-Screen Multi-Service Adder) */}
      {activeTab === 'LISTINGS' && !isHomeService && ((category.category || '').toLowerCase().includes('salon') || (category.category || '').toLowerCase().includes('spa') || (category.name || '').toLowerCase().includes('salon') || (category.name || '').toLowerCase().includes('spa')) && (() => {
        const lowerTitle = `${category.category || ''} ${category.name || ''}`.toLowerCase();
        const hasSpa = lowerTitle.includes('spa');
        const hasSalon = lowerTitle.includes('salon');
        const isSpaOnly = hasSpa && !hasSalon;
        const builderTitle = isSpaOnly ? '🧘 Quick Spa Menu Builder' : (hasSpa && hasSalon) ? '✨ Quick Salon & Spa Menu Builder' : '✂️ Quick Salon Menu Builder';
        const builderDesc = isSpaOnly
          ? 'Add multiple spa therapies (Massage, Aromatherapy, Body Scrub, Steam) in one place.'
          : 'Add multiple treatments (Hair, Beard, Facial, Spa) in one place without opening separate forms.';
        const namePlaceholder = isSpaOnly ? 'e.g. Aromatherapy Deep Tissue' : 'e.g. Signature Haircut';
        const modeBothLabel = isSpaOnly ? 'In-Spa & Doorstep' : 'In-Salon & Doorstep';
        const modeInLabel = isSpaOnly ? 'In-Spa Only' : 'In-Salon Only';

        return (
        <div className="bg-white dark:bg-[#0f1624] rounded-2xl border border-slate-200/80 dark:border-white/10 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{builderTitle}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0a3161]/10 text-[#0a3161] dark:bg-blue-500/20 dark:text-blue-300 font-bold">
                  Instant Sync
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {builderDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-end">
            <div className="lg:col-span-3">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{isSpaOnly ? 'Therapy Name' : 'Treatment Name'}</label>
              <input
                type="text"
                value={quickTreatment.name}
                onChange={(e) => setQuickTreatment(prev => ({ ...prev, name: e.target.value }))}
                placeholder={namePlaceholder}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
              />
            </div>
            <div className="lg:col-span-2 relative">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Filter</label>
              <input
                type="text"
                value={quickTreatment.salonCategory}
                onFocus={() => setFilterDropdownOpen(true)}
                onBlur={() => setTimeout(() => setFilterDropdownOpen(false), 180)}
                onChange={(e) => {
                  setQuickTreatment(prev => ({ ...prev, salonCategory: e.target.value }));
                  setFilterDropdownOpen(true);
                }}
                placeholder="Type or pick filter..."
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
              />
              {filterDropdownOpen && (() => {
                const defaultSuggestions = [
                  'Hair & Styling', 'Beard Grooming', 'Facials & Skin',
                  'Massage & Spa', 'Packages', 'Bridal Makeup', 'Nail Art', 'Ayurvedic Therapy'
                ];
                const existingCats = listings.map(l => l.metadata?.salonCategory).filter(Boolean) as string[];
                const allSuggestions = Array.from(new Set([...defaultSuggestions, ...existingCats]));
                const q = quickTreatment.salonCategory.trim().toLowerCase();
                const matches = allSuggestions.filter(s => !q || s.toLowerCase().includes(q));
                const exactMatch = allSuggestions.some(s => s.toLowerCase() === q);

                return (
                  <div className="absolute left-0 top-full mt-1 w-52 max-h-48 overflow-y-auto z-50 bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl p-1">
                    {matches.map(item => (
                      <button
                        key={item}
                        type="button"
                        onMouseDown={() => {
                          setQuickTreatment(prev => ({ ...prev, salonCategory: item }));
                          setFilterDropdownOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-[#ff6325]/10 hover:text-[#ff6325] cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                    {quickTreatment.salonCategory.trim() && !exactMatch && (
                      <button
                        type="button"
                        onMouseDown={() => setFilterDropdownOpen(false)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#0a3161] dark:text-blue-400 bg-[#0a3161]/5 hover:bg-[#0a3161]/10 cursor-pointer"
                      >
                        + Use &quot;{quickTreatment.salonCategory.trim()}&quot;
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gender</label>
              <select
                value={quickTreatment.genderTarget}
                onChange={(e) => setQuickTreatment(prev => ({ ...prev, genderTarget: e.target.value }))}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
              >
                <option value="UNISEX">All (Unisex)</option>
                <option value="WOMEN">Women</option>
                <option value="MEN">Men</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mode</label>
              <select
                value={quickTreatment.serviceMode}
                onChange={(e) => setQuickTreatment(prev => ({ ...prev, serviceMode: e.target.value }))}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
              >
                <option value="BOTH">{modeBothLabel}</option>
                <option value="IN_SALON">{modeInLabel}</option>
                <option value="DOORSTEP">Doorstep Only</option>
              </select>
            </div>
            <div className="lg:col-span-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mins</label>
              <input
                type="number"
                min={10}
                value={quickTreatment.duration}
                onChange={(e) => setQuickTreatment(prev => ({ ...prev, duration: e.target.value === '' ? ('' as any) : Number(e.target.value) }))}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
              />
            </div>
            <div className="lg:col-span-2 flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Price (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={quickTreatment.price}
                  onChange={(e) => setQuickTreatment(prev => ({ ...prev, price: e.target.value === '' ? ('' as any) : Number(e.target.value) }))}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!quickTreatment.name.trim()) return;
                  const newUnit: CatalogListing = {
                    id: `list-${Date.now()}`,
                    name: quickTreatment.name.trim(),
                    price: quickTreatment.price,
                    duration: quickTreatment.duration,
                    active: true,
                    description: `Professional ${quickTreatment.name.trim()} service.`,
                    metadata: {
                      salonCategory: quickTreatment.salonCategory,
                      genderTarget: quickTreatment.genderTarget,
                      serviceMode: quickTreatment.serviceMode,
                    }
                  };
                  const updatedCategory: CatalogService = {
                    ...category!,
                    listings: [...(category?.listings || []), newUnit]
                  };
                  updateService(updatedCategory);
                  setQuickTreatment(prev => ({ ...prev, name: '' }));
                }}
                className="px-3.5 py-2 rounded-xl bg-[#0a3161] hover:bg-[#ff6325] text-white font-black text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* Quick Gym Pass Builder Modal (Opens on + Add Pass click) */}
      {quickGymAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0f1624] w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🏋️ Add Gym Pass / Session</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Add Day Passes, CrossFit sessions, or 1-on-1 Personal Training.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuickGymAddOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pass / Session Name</label>
                <input
                  type="text"
                  value={quickGymPass.name}
                  onChange={(e) => setQuickGymPass(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Day Pass (Full Open Gym & Steam)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Filter</label>
                  <select
                    value={quickGymPass.filter}
                    onChange={(e) => setQuickGymPass(prev => ({ ...prev, filter: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                  >
                    <option value="Gym Floor">Gym Floor</option>
                    <option value="1-on-1 PT">1-on-1 PT</option>
                    <option value="Group Class">Group Class</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min={15}
                    value={quickGymPass.duration}
                    onChange={(e) => setQuickGymPass(prev => ({ ...prev, duration: e.target.value === '' ? ('' as any) : Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={quickGymPass.price}
                    onChange={(e) => setQuickGymPass(prev => ({ ...prev, price: e.target.value === '' ? ('' as any) : Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={quickGymPass.originalPrice}
                    onChange={(e) => setQuickGymPass(prev => ({ ...prev, originalPrice: e.target.value === '' ? ('' as any) : Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setQuickGymAddOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!quickGymPass.name.trim()) return;
                  const dur = Number(quickGymPass.duration) || 60;
                  const newUnit: CatalogListing = {
                    id: `list-${Date.now()}`,
                    name: quickGymPass.name.trim(),
                    price: Number(quickGymPass.price) || 0,
                    originalPrice: Number(quickGymPass.originalPrice) || 0,
                    duration: dur,
                    active: true,
                    description: `${dur} mins session • Turnstile pass`,
                    metadata: {
                      gymFilter: quickGymPass.filter,
                    }
                  };
                  updateService({
                    ...category!,
                    listings: [...(category?.listings || []), newUnit]
                  });
                  setQuickGymPass(prev => ({ ...prev, name: '' }));
                  setQuickGymAddOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-[#ff6325] hover:bg-[#e04e13] text-white text-xs font-black cursor-pointer shadow-sm"
              >
                + Add Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fitness / Yoga Tab Switcher: Daily Batches vs Memberships & Passes */}
      {isFitnessOrYoga && (
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('LISTINGS')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'LISTINGS'
                ? 'bg-[#ff6325] text-white shadow-xs'
                : 'bg-white dark:bg-[#0f1624] text-slate-600 dark:text-slate-300 hover:text-slate-900 border border-slate-200 dark:border-white/10'
            }`}
          >
            Daily Class Batches ({listings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PASSES')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'PASSES'
                ? 'bg-[#ff6325] text-white shadow-xs'
                : 'bg-white dark:bg-[#0f1624] text-slate-600 dark:text-slate-300 hover:text-slate-900 border border-slate-200 dark:border-white/10'
            }`}
          >
            Memberships & Multi-Class Passes ({passes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('TRAINERS')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'TRAINERS'
                ? 'bg-[#ff6325] text-white shadow-xs'
                : 'bg-white dark:bg-[#0f1624] text-slate-600 dark:text-slate-300 hover:text-slate-900 border border-slate-200 dark:border-white/10'
            }`}
          >
            Coaches & Trainers ({trainers.length})
          </button>
        </div>
      )}

      {/* 2. TAB A: LISTINGS / BATCHES GRID (Clean Menu/Pass List for Salon, Spa, Gym & Yoga) */}
      {activeTab === 'LISTINGS' && (isFitnessOrYoga || isDoctorClinic || (category.category || '').toLowerCase().includes('salon') || (category.category || '').toLowerCase().includes('spa') || (category.name || '').toLowerCase().includes('salon') || (category.name || '').toLowerCase().includes('spa')) ? (
        <div className="space-y-4">
          {/* Dynamic Salon & Spa Category Filter Pills from Vendor's Listings */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: 'All Services' },
              ...Array.from(new Set(listings.map(l => {
                const raw = isFitnessOrYoga ? (l.metadata?.gymCategory || 'Gym Floor') : (l.metadata?.salonCategory || 'Hair & Styling');
                const legacyMap: Record<string, string> = {
                  HAIR: 'Hair & Styling',
                  BEARD: 'Beard Grooming',
                  SKIN_FACIAL: 'Facials & Skin',
                  MASSAGE_SPA: 'Massage & Spa',
                  PACKAGE: 'Packages'
                };
                return legacyMap[raw] || raw;
              }))).map(cat => ({ id: cat, label: cat }))
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSalonFilterCat(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  salonFilterCat === tab.id
                    ? 'bg-[#ff6325] text-white shadow-sm'
                    : 'bg-white dark:bg-[#0f1624] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-[#ff6325]/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Clean Menu List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {listings
              .filter(list => {
                if (salonFilterCat === 'ALL') return true;
                const raw = isFitnessOrYoga ? (list.metadata?.gymCategory || 'Gym Floor') : (list.metadata?.salonCategory || 'Hair & Styling');
                const legacyMap: Record<string, string> = {
                  HAIR: 'Hair & Styling',
                  BEARD: 'Beard Grooming',
                  SKIN_FACIAL: 'Facials & Skin',
                  MASSAGE_SPA: 'Massage & Spa',
                  PACKAGE: 'Packages'
                };
                return (legacyMap[raw] || raw) === salonFilterCat;
              })
              .map(list => {
                const catLabel = isFitnessOrYoga
                  ? (list.metadata?.gymFilter || ((category.category || category.name || '').toLowerCase().includes('yoga') ? 'Yoga Batch' : 'Gym Floor'))
                  : (({
                      HAIR: 'Hair & Styling',
                      BEARD: 'Beard Grooming',
                      SKIN_FACIAL: 'Facials & Skin',
                      MASSAGE_SPA: 'Massage & Spa',
                      PACKAGE: 'Packages'
                    } as Record<string, string>)[list.metadata?.salonCategory || 'HAIR'] || list.metadata?.salonCategory || 'Treatment');
                const genderLabel = list.metadata?.genderTarget === 'WOMEN' ? 'Women' : list.metadata?.genderTarget === 'MEN' ? 'Men' : 'Unisex';
                const modeLabel = isDoctorClinic
                  ? (list.metadata?.serviceMode === 'IN_SALON' ? 'In-Clinic' : list.metadata?.serviceMode === 'DOORSTEP' ? 'Video Consult' : 'In-Clinic & Video')
                  : (list.metadata?.serviceMode === 'IN_SALON' ? 'In-Salon Only' : list.metadata?.serviceMode === 'DOORSTEP' ? 'Doorstep Only' : 'In-Salon & Doorstep');

                return (
                  <div
                    key={list.id}
                    onClick={() => setEditingTreatment({
                      id: list.id,
                      name: list.name || '',
                      salonCategory: isFitnessOrYoga ? (list.metadata?.gymFilter || 'Gym Floor') : (list.metadata?.salonCategory || 'HAIR'),
                      genderTarget: list.metadata?.genderTarget || 'UNISEX',
                      serviceMode: list.metadata?.serviceMode || 'BOTH',
                      duration: list.duration || 30,
                      price: list.price || 499,
                      description: list.description || '',
                      active: list.active !== false,
                      clinicContact: list.metadata?.clinicContact || ''
                    })}
                    className="group bg-white dark:bg-[#0f1624] rounded-2xl border border-slate-200/80 dark:border-white/10 p-4 flex items-center justify-between gap-4 hover:border-[#ff6325]/60 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#0a3161]/10 text-[#0a3161] dark:bg-blue-500/20 dark:text-blue-300">
                          {catLabel}
                        </span>
                        {!isFitnessOrYoga && !isDoctorClinic ? (
                          <>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                              {genderLabel}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              {modeLabel}
                            </span>
                          </>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            Turnstile Pass
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-[#ff6325] transition-colors">
                        {list.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {list.duration || 30} mins • <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-base font-black text-slate-900 dark:text-white block">₹{list.price}</span>
                        <span className="text-[10px] font-bold text-[#ff6325] group-hover:underline">Edit →</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedCategory: CatalogService = {
                            ...category!,
                            listings: listings.filter(l => l.id !== list.id)
                          };
                          updateService(updatedCategory);
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-red-500/15 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : activeTab === 'LISTINGS' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {listings.map(list => {
            const isDiningCategory = (category.name || '').toLowerCase().includes('dining') ||
              (category.name || '').toLowerCase().includes('restaurant') ||
              (category.category || '').toLowerCase().includes('dining') ||
              (category.category || '').toLowerCase().includes('restaurant') ||
              Boolean(category.metadata?.isDining);
            const isTurfListing = (category.name || '').toLowerCase().includes('turf') ||
              (category.name || '').toLowerCase().includes('football') ||
              (category.name || '').toLowerCase().includes('cricket') ||
              (category.name || '').toLowerCase().includes('badminton') ||
              (category.name || '').toLowerCase().includes('tennis') ||
              (category.name || '').toLowerCase().includes('basketball') ||
              (category.name || '').toLowerCase().includes('swimming') ||
              (category.name || '').toLowerCase().includes('court') ||
              (category.name || '').toLowerCase().includes('arena') ||
              (category.category || '').toLowerCase().includes('sports') ||
              (category.category || '').toLowerCase().includes('turf') ||
              (category.category || '').toLowerCase().includes('badminton') ||
              (list.name || '').toLowerCase().includes('court') ||
              (list.name || '').toLowerCase().includes('pitch') ||
              (list.name || '').toLowerCase().includes('turf');
            const listImg = 
              (list.imageUrl && list.imageUrl.startsWith('http') && !list.imageUrl.includes('ui-avatars') ? list.imageUrl : null) ||
              ((list as any).images && Array.isArray((list as any).images) && (list as any).images[0]?.startsWith('http') ? (list as any).images[0] : null) ||
              (list.metadata?.imageUrl?.startsWith('http') ? list.metadata.imageUrl : null) ||
              (list.metadata?.gallery && Array.isArray(list.metadata.gallery) && list.metadata.gallery[0]?.startsWith('http') ? list.metadata.gallery[0] : null) ||
              (category.imageUrl && category.imageUrl.startsWith('http') ? category.imageUrl : null) ||
              (isTurfListing
                ? 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80'
                : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80');

            return (
              <div
                key={list.id}
                onClick={() => {
                  if (isFitnessOrYoga) {
                    setEditingTreatment({
                      id: list.id,
                      name: list.name || '',
                      salonCategory: list.metadata?.gymFilter || 'Gym Floor',
                      genderTarget: 'UNISEX',
                      serviceMode: 'IN_SALON',
                      duration: list.duration || 60,
                      price: list.price || 299,
                      description: list.description || '',
                      active: list.active !== false
                    });
                  } else {
                    router.push(`/workspace/my-services/${serviceId}/listing/${list.id}`);
                  }
                }}
                className="bg-white dark:bg-[#0f1624] rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-[#ff6325]/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer group"
              >
                {/* Compact Cover Image (h-36 identical to Category/Format card) */}
                <div
                  className="h-36 w-full relative overflow-hidden bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${listImg}"), linear-gradient(135deg, #1e293b, #0f172a)`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/50" />

                  {/* Top Bar on Cover */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                    <div className="flex flex-col gap-0.5">
                      {isDiningCategory ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black shadow-lg border border-white/20 backdrop-blur-md"
                            style={{ backgroundColor: Number(list.price) > 0 ? 'rgba(255, 99, 37, 0.95)' : 'rgba(16, 185, 129, 0.95)', color: '#ffffff' }}
                          >
                            {Number(list.price) > 0 ? `₹${Number(list.price).toLocaleString('en-IN')} Deposit` : 'Free Hold'}
                          </span>
                          {(list.metadata as any)?.seatingZone && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-white/20 text-white backdrop-blur-md border border-white/20">
                              {(list.metadata as any).seatingZone}
                            </span>
                          )}
                        </div>
                      ) : list.price !== undefined && list.price > 0 ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black shadow-lg border border-white/20 backdrop-blur-md"
                            style={{ backgroundColor: 'rgba(255, 99, 37, 0.95)', color: '#ffffff' }}
                          >
                            ₹{Number(list.price).toLocaleString('en-IN')}
                            <span className="text-[10px] font-semibold ml-1 opacity-90">
                              {list.priceUnit || (list.metadata as any)?.priceUnit || (isTurfListing ? '/hr' : '/night')}
                            </span>
                          </span>
                          {(list.discountPercentage || (list.metadata as any)?.discountPercentage) ? (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-500/90 text-white backdrop-blur-md border border-white/20">
                              -{list.discountPercentage || (list.metadata as any)?.discountPercentage}%
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md"
                          style={{ color: '#ffffff' }}
                        >
                          Custom Pricing
                        </span>
                      )}
                      {(list.securityDeposit || (list.metadata as any)?.securityDeposit) ? (
                        <span className="text-[9px] font-bold text-amber-200 drop-shadow-md backdrop-blur-xs px-1 rounded bg-black/40 w-fit">
                          Deposit: ₹{Number(list.securityDeposit || (list.metadata as any)?.securityDeposit).toLocaleString('en-IN')}
                        </span>
                      ) : null}
                    </div>

                    <button
                      onClick={(e) => handleDeleteListing(e, list.id)}
                      className="h-7 w-7 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                      style={{ color: '#ffffff' }}
                      title="Delete Listing"
                    >
                      <Trash2 size={12} style={{ color: '#ffffff', stroke: '#ffffff' }} />
                    </button>
                  </div>

                  {/* Bottom Listing Name on Cover */}
                  <div className="absolute bottom-2.5 left-3 right-3 z-10">
                    <h3
                      className="text-base font-black capitalize truncate tracking-wide drop-shadow-md"
                      style={{ color: '#ffffff' }}
                    >
                      {list.name}
                    </h3>
                    <p
                      className="text-[11px] font-semibold drop-shadow"
                      style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                    >
                      {displayName}
                    </p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white dark:bg-[#0f1624]">
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2">
                      {list.description || 'Configured bookable listing unit with active pricing, timing and amenities.'}
                    </p>

                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {list.isTimingEnabled && <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded">Timing</span>}
                      {list.isAddonsEnabled && <span className="px-2 py-0.5 bg-[#ff6325]/10 text-[#ff6325] text-[10px] font-bold rounded">Add-ons</span>}
                      {list.isRulesEnabled && <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded">Rules</span>}
                      {list.isOffersEnabled && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded">Offers</span>}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                    {/* Hourly Slots for Sports/Arenas/Courts */}
                    {isTurfListing ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/workspace/my-services/${serviceId}/listing/${list.id}/slots`);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs border bg-orange-500 hover:bg-orange-600 text-white border-orange-600 dark:bg-[#ff6325] dark:hover:bg-[#e04e13]"
                        title="Manage Hourly Slot Timings & Pricing"
                      >
                        <Calendar size={13} className="shrink-0" />
                        <span className="whitespace-nowrap">Manage Slots</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Available
                      </span>
                    )}

                    <span className="font-bold text-slate-500 dark:text-slate-400 group-hover:text-[#ff6325] transition-colors text-xs flex items-center gap-1 ml-auto">
                      Edit Unit &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {listings.length === 0 && (
            <div className="col-span-full py-16 px-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 bg-white dark:bg-[#162033] rounded-2xl flex items-center justify-center mb-3 text-[#ff6325] shadow-sm border border-slate-200 dark:border-white/10">
                <ImageIcon size={24} />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">{isHomeService ? 'No Services Yet' : 'No Batches Yet'}</h3>
              <p className="text-slate-400 max-w-sm text-xs mb-4">
                Click below to add the first {isHomeService ? 'service' : 'daily batch'} for <strong className="text-slate-700 dark:text-white capitalize">{displayName}</strong>.
              </p>
              <button
                onClick={() => {
                  if (isHomeService) {
                    setEditingTreatment({
                      id: `svc-${Date.now()}`,
                      name: '',
                      price: 499,
                      active: true,
                      duration: 45,
                      salonCategory: '30 Days Warranty',
                      genderTarget: 'ALL',
                      serviceMode: 'IN_SALON',
                      description: ''
                    });
                  } else {
                    router.push(`/workspace/my-services/${serviceId}/listing/new`);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {isHomeService ? '+ Add First Service' : '+ Add First Batch'}
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* 3B. TAB C: COACHES & TRAINERS */}
      {activeTab === 'TRAINERS' && (
        <div className="space-y-4">
          {trainers.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-[#0f1624] border border-dashed border-slate-200 dark:border-white/10 text-center text-xs text-slate-500">
              No trainers added yet. Click &quot;+ Add Trainer&quot; above so customers can select them!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainers.map((tr: any) => (
                <div
                  key={tr.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0f1624] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-black shrink-0 border border-slate-200 dark:border-white/10">
                      {(tr.name || 'TR').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{tr.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {tr.title} • {tr.experienceYears}y exp{tr.certs ? ` • ${tr.certs}` : ''}{Number(tr.price) > 0 ? ` • ₹${tr.price}/${tr.priceUnit === 'month' ? 'month' : 'session'}` : ' • Included'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveTrainers(trainers.filter((t: any) => t.id !== tr.id))}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer shrink-0"
                    title="Delete Trainer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {trainerModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0f1624] border border-slate-200 dark:border-white/10 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Add Coach / Trainer</h3>
                  <button
                    type="button"
                    onClick={() => setTrainerModalOpen(false)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Trainer Name (e.g. Vikram Sethi)"
                    value={newTrainer.name}
                    onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                  />
                  <input
                    type="text"
                    placeholder="Role / Specialty (e.g. Strength Coach)"
                    value={newTrainer.title}
                    onChange={(e) => setNewTrainer({ ...newTrainer, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      min={1}
                      placeholder="Experience (Years)"
                      value={newTrainer.experienceYears || ''}
                      onChange={(e) => setNewTrainer({ ...newTrainer, experienceYears: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                    />
                    <input
                      type="text"
                      placeholder="Certifications (e.g. ACE)"
                      value={newTrainer.certs}
                      onChange={(e) => setNewTrainer({ ...newTrainer, certs: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      min={0}
                      placeholder="Fee (₹, 0 = Included)"
                      value={newTrainer.price || ''}
                      onChange={(e) => setNewTrainer({ ...newTrainer, price: Math.max(0, Number(e.target.value) || 0) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                    />
                    <select
                      value={newTrainer.priceUnit}
                      onChange={(e) => setNewTrainer({ ...newTrainer, priceUnit: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                    >
                      <option value="session">Per Session</option>
                      <option value="month">Per Month</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTrainerModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newTrainer.name.trim()) return;
                      const created = {
                        id: `trn-${Date.now()}`,
                        name: newTrainer.name.trim(),
                        title: newTrainer.title.trim() || 'Certified Trainer',
                        experienceYears: Number(newTrainer.experienceYears) || 1,
                        certs: newTrainer.certs.trim() || 'Certified',
                        price: Number(newTrainer.price) || 0,
                        priceUnit: newTrainer.priceUnit || 'session',
                        avatar: ''
                      };
                      handleSaveTrainers([...trainers, created]);
                      setTrainerModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#ff6325] text-white text-xs font-black hover:bg-[#e5531a] transition-colors cursor-pointer"
                  >
                    Save Trainer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. TAB B: MEMBERSHIPS & PASSES GRID (SERVICE LEVEL) */}
      {activeTab === 'PASSES' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                All-Access Studio Memberships & Passes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                These passes grant access across all daily batches. Customers can purchase these passes directly in your studio app.
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {passes.map((pass: any, pIdx: number) => (
              <div
                key={pass.id || pIdx}
                className="p-5 rounded-2xl bg-white dark:bg-[#0f1624] border border-slate-200/90 dark:border-white/10 shadow-sm flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                      {pass.sessions}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = passes.filter((_, idx) => idx !== pIdx);
                        handleSavePasses(updated);
                      }}
                      className="text-slate-400 hover:text-red-500 text-xs font-bold transition-colors cursor-pointer"
                    >
                      ✕ Remove
                    </button>
                  </div>

                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {pass.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {pass.validity}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-[#ff6325] block">
                      ₹{Number(pass.price).toLocaleString()}
                    </span>
                    {pass.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{Number(pass.originalPrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewPass(pass);
                      setEditingPassModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Edit Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* MODAL: ADD / EDIT PASS */}
      {editingPassModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1624] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {newPass.id && passes.some((p: any) => p.id === newPass.id) ? 'Edit Membership Pass' : 'New Membership Pass'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPassModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pass Name *
                </label>
                <input
                  type="text"
                  value={newPass.name}
                  onChange={(e) => setNewPass({ ...newPass, name: e.target.value })}
                  placeholder="e.g. 3-Month Unlimited Sadhana Pass"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={newPass.price || ''}
                    onChange={(e) => setNewPass({ ...newPass, price: Number(e.target.value) || 0 })}
                    placeholder="e.g. 7999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    MRP / Orig Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newPass.originalPrice || ''}
                    onChange={(e) => setNewPass({ ...newPass, originalPrice: Number(e.target.value) || undefined })}
                    placeholder="e.g. 9999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Sessions Count
                  </label>
                  <input
                    type="text"
                    value={newPass.sessions}
                    onChange={(e) => setNewPass({ ...newPass, sessions: e.target.value })}
                    placeholder="e.g. Unlimited or 10 Classes"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Validity
                  </label>
                  <input
                    type="text"
                    value={newPass.validity}
                    onChange={(e) => setNewPass({ ...newPass, validity: e.target.value })}
                    placeholder="e.g. 90 Days Validity"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingPassModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newPass.name.trim()) return alert('Please enter a pass name');
                  let updated;
                  if (passes.some((p: any) => p.id === newPass.id)) {
                    updated = passes.map((p: any) => p.id === newPass.id ? newPass : p);
                  } else {
                    updated = [...passes, { ...newPass, id: `pass-${Date.now()}` }];
                  }
                  handleSavePasses(updated);
                  setEditingPassModal(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-black bg-[#ff6325] text-white hover:bg-[#e04e13]"
              >
                Save Pass
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Quick Edit Salon & Spa Treatment Modal */}
      {editingTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0f1624] w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {isDoctorClinic ? 'Doctor / Consultation Details' : isHomeService ? 'Home Service Details' : 'Edit Salon / Spa Service'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingTreatment(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{isDoctorClinic ? 'Doctor Name' : isHomeService ? 'Service Title' : 'Treatment Name'}</label>
                <input
                  type="text"
                  placeholder={isDoctorClinic ? 'e.g. Dr. Rajesh Kumar (Senior Consultant)' : isHomeService ? 'e.g. MCB & Wiring Check / Tap Leak Repair' : 'e.g. Haircut & Styling'}
                  value={editingTreatment.name}
                  onChange={(e) => setEditingTreatment(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                />
              </div>

              <div className={`grid grid-cols-1 ${(isDoctorClinic || isHomeService) ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-3`}>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{isDoctorClinic ? 'Specialization' : isHomeService ? 'Warranty / Policy' : 'Filter'}</label>
                  {(isDoctorClinic || isHomeService) ? (
                    <input
                      type="text"
                      placeholder={isDoctorClinic ? 'e.g. Cardiologist, Dentist' : 'e.g. 30 Days Warranty / No Warranty'}
                      value={editingTreatment.salonCategory}
                      onChange={(e) => setEditingTreatment(prev => prev ? ({ ...prev, salonCategory: e.target.value }) : null)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                    />
                  ) : (
                    <select
                      value={editingTreatment.salonCategory}
                      onChange={(e) => setEditingTreatment(prev => prev ? ({ ...prev, salonCategory: e.target.value }) : null)}
                      className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                    >
                      <option value="HAIR">Hair & Styling</option>
                      <option value="BEARD">Beard Grooming</option>
                      <option value="SKIN_FACIAL">Facials & Skin</option>
                      <option value="MASSAGE_SPA">Massage & Spa</option>
                      <option value="PACKAGE">Packages</option>
                    </select>
                  )}
                </div>
                {!isDoctorClinic && !isHomeService && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gender</label>
                  <select
                    value={editingTreatment.genderTarget}
                    onChange={(e) => setEditingTreatment(prev => prev ? ({ ...prev, genderTarget: e.target.value }) : null)}
                    className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                  >
                    <option value="UNISEX">All (Unisex)</option>
                    <option value="WOMEN">Women</option>
                    <option value="MEN">Men</option>
                  </select>
                </div>
                )}
                {!isHomeService && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{isDoctorClinic ? 'Consultation Mode' : 'Service Mode'}</label>
                  <select
                    value={editingTreatment.serviceMode}
                    onChange={(e) => setEditingTreatment(prev => prev ? ({ ...prev, serviceMode: e.target.value }) : null)}
                    className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                  >
                    {isDoctorClinic ? (
                      <>
                        <option value="BOTH">In-Clinic & Video</option>
                        <option value="IN_SALON">In-Clinic Only</option>
                        <option value="DOORSTEP">Video Consult Only</option>
                      </>
                    ) : (
                      <>
                        <option value="BOTH">In-Salon & Doorstep</option>
                        <option value="IN_SALON">In-Salon Only</option>
                        <option value="DOORSTEP">Doorstep Only</option>
                      </>
                    )}
                  </select>
                </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Duration (Mins)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 20"
                    value={editingTreatment.duration || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setEditingTreatment(prev => prev ? ({ ...prev, duration: val ? Number(val) : 0 }) : null);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{isDoctorClinic ? 'Consultation Fee (₹)' : 'Price (₹)'}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 500"
                    value={editingTreatment.price || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setEditingTreatment(prev => prev ? ({ ...prev, price: val ? Number(val) : 0 }) : null);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{isDoctorClinic ? 'Qualification & Experience' : 'Description'}</label>
                <textarea
                  rows={2}
                  placeholder={isDoctorClinic ? 'e.g. MBBS, MD • 12 yrs exp' : 'Service details...'}
                  value={editingTreatment.description}
                  onChange={(e) => setEditingTreatment(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                />
              </div>

              {isDoctorClinic && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Clinic Contact (Optional • Shown After Booking)</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={editingTreatment.clinicContact || ''}
                    onChange={(e) => setEditingTreatment(prev => prev ? ({ ...prev, clinicContact: e.target.value }) : null)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setEditingTreatment(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingTreatment.name.trim()) return;
                  const updatedListings = listings.map(l =>
                    l.id === editingTreatment.id
                      ? {
                          ...l,
                          name: editingTreatment.name.trim(),
                          duration: editingTreatment.duration,
                          price: editingTreatment.price,
                          description: editingTreatment.description,
                          active: editingTreatment.active,
                          metadata: {
                            ...(l.metadata || {}),
                            salonCategory: editingTreatment.salonCategory,
                            genderTarget: editingTreatment.genderTarget,
                            serviceMode: editingTreatment.serviceMode,
                          }
                        }
                      : l
                  );
                  updateService({ ...category!, listings: updatedListings });
                  setEditingTreatment(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#ff6325] hover:bg-[#e04e13] text-white text-xs font-black cursor-pointer shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Manage Slots Modal (Multi-Date, When-to-When, Interval, Breakfast/Lunch Breaks, Manual Block) */}
      {manageSlotsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0f1624] w-full max-w-3xl rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-white/10 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🕒 Manage Salon &amp; Spa Slots</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Set operating hours, interval, breakfast/lunch breaks, and block slots for 1 or multiple days at once.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setManageSlotsOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* 0. Target Doctor Selector (Doctor/Clinic only) */}
            {isDoctorClinic && listings.length > 0 && (
              <div className="bg-slate-50 dark:bg-white/5 p-3.5 rounded-2xl border border-slate-200/70 dark:border-white/10">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Apply Schedule To Doctor</label>
                <select
                  value={slotTargetListingId}
                  onChange={(e) => setSlotTargetListingId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                >
                  <option value="ALL">All Doctors (Clinic Default)</option>
                  {listings.map((l: any) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* 1. Date Range (2 to 7 days at once) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end bg-slate-50 dark:bg-white/5 p-3.5 rounded-2xl border border-slate-200/70 dark:border-white/10">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">From Date</label>
                <input
                  type="date"
                  value={slotFromDate}
                  min={todayIso}
                  onChange={(e) => setSlotFromDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">To Date</label>
                <input
                  type="date"
                  value={slotToDate}
                  min={slotFromDate}
                  onChange={(e) => setSlotToDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                />
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { label: 'Today', days: 0 },
                  { label: '2 Days', days: 1 },
                  { label: '7 Days', days: 6 },
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setSlotFromDate(todayIso);
                      setSlotToDate(new Date(Date.now() + p.days * 86400000).toISOString().split('T')[0]);
                    }}
                    className="flex-1 py-2 rounded-xl bg-white dark:bg-[#0f1624] border border-slate-200 dark:border-white/10 hover:border-[#ff6325] text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. When to When, Interval, Chairs / Rooms */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Opens At</label>
                <input
                  type="time"
                  value={salonOpenTime}
                  onChange={(e) => setSalonOpenTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Closes At</label>
                <input
                  type="time"
                  value={salonCloseTime}
                  onChange={(e) => setSalonCloseTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Interval</label>
                <select
                  value={salonSlotInterval}
                  onChange={(e) => setSalonSlotInterval(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                >
                  <option value={15}>15 mins</option>
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>60 mins</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{isFitnessOrYoga ? 'Batch Capacity' : isDoctorClinic ? 'Consultation Rooms' : 'Chairs / Rooms'}</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={salonCapacity}
                  onChange={(e) => setSalonCapacity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                />
              </div>
            </div>

            {/* 3. Breakfast & Lunch Breaks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-black text-slate-800 dark:text-white">☕ Breakfast Break</span>
                  <input
                    type="checkbox"
                    checked={breakfastBreak.enabled}
                    onChange={(e) => setBreakfastBreak(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="accent-[#ff6325] w-4 h-4"
                  />
                </label>
                {breakfastBreak.enabled && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={breakfastBreak.start}
                      onChange={(e) => setBreakfastBreak(prev => ({ ...prev, start: e.target.value }))}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-semibold"
                    />
                    <span className="text-xs text-slate-400">to</span>
                    <input
                      type="time"
                      value={breakfastBreak.end}
                      onChange={(e) => setBreakfastBreak(prev => ({ ...prev, end: e.target.value }))}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-semibold"
                    />
                  </div>
                )}
              </div>

              <div className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-black text-slate-800 dark:text-white">🍽️ Lunch Break</span>
                  <input
                    type="checkbox"
                    checked={lunchBreak.enabled}
                    onChange={(e) => setLunchBreak(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="accent-[#ff6325] w-4 h-4"
                  />
                </label>
                {lunchBreak.enabled && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={lunchBreak.start}
                      onChange={(e) => setLunchBreak(prev => ({ ...prev, start: e.target.value }))}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-semibold"
                    />
                    <span className="text-xs text-slate-400">to</span>
                    <input
                      type="time"
                      value={lunchBreak.end}
                      onChange={(e) => setLunchBreak(prev => ({ ...prev, end: e.target.value }))}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-semibold"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 3b. Doorstep Convenience Fee & Min Order (Salon & Spa only) */}
            {!isFitnessOrYoga && !isDoctorClinic && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-white/5 p-3.5 rounded-2xl border border-slate-200/70 dark:border-white/10">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Doorstep Convenience Fee (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={homeConvenienceFee}
                  onChange={(e) => setHomeConvenienceFee(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Min Order for Doorstep (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={homeMinOrderValue}
                  onChange={(e) => setHomeMinOrderValue(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                />
              </div>
            </div>
            )}

            {/* 4. Generated Slots Preview (Click to Block/Unblock) */}
            {(() => {
              const toMins = (t: string) => {
                const [h, m] = (t || '09:00').split(':').map(Number);
                return (h || 0) * 60 + (m || 0);
              };
              const fmt = (mins: number) => {
                let h = Math.floor(mins / 60);
                const m = mins % 60;
                const ap = h >= 12 ? 'PM' : 'AM';
                h = h % 12 || 12;
                return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ap}`;
              };
              const sM = toMins(salonOpenTime);
              const eM = toMins(salonCloseTime);
              const bStart = toMins(breakfastBreak.start);
              const bEnd = toMins(breakfastBreak.end);
              const lStart = toMins(lunchBreak.start);
              const lEnd = toMins(lunchBreak.end);
              const previewSlots: { label: string; slotValue: string; isBreak: boolean }[] = [];
              for (let m = sM; m <= eM - salonSlotInterval; m += salonSlotInterval) {
                const isBreak =
                  (breakfastBreak.enabled && m >= bStart && m < bEnd) ||
                  (lunchBreak.enabled && m >= lStart && m < lEnd);
                const sTime = fmt(m);
                previewSlots.push({ label: `${sTime} – ${fmt(m + salonSlotInterval)}`, slotValue: sTime, isBreak });
              }
              const currentBlocked = blockedSlotsByDate[slotFromDate] || [];

              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Generated Slots Preview ({previewSlots.length} slots) — Click any slot to Block/Unblock
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                    {previewSlots.map(s => {
                      const isBlocked = currentBlocked.includes(s.slotValue);
                      return (
                        <button
                          key={s.label}
                          type="button"
                          disabled={s.isBreak}
                          onClick={() => {
                            const dates: string[] = [];
                            const cur = new Date(slotFromDate + 'T00:00:00');
                            const end = new Date(slotToDate + 'T00:00:00');
                            while (cur <= end) {
                              dates.push(cur.toISOString().split('T')[0]);
                              cur.setDate(cur.getDate() + 1);
                            }
                            setBlockedSlotsByDate(prev => {
                              const next = { ...prev };
                              dates.forEach(d => {
                                const list = next[d] || [];
                                next[d] = isBlocked ? list.filter(x => x !== s.slotValue) : Array.from(new Set([...list, s.slotValue]));
                              });
                              return next;
                            });
                          }}
                          className={`p-2 rounded-xl border text-left transition-all ${
                            s.isBreak
                              ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 cursor-not-allowed'
                              : isBlocked
                                ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 text-rose-600 line-through cursor-pointer'
                                : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-[#ff6325] text-slate-800 dark:text-white cursor-pointer'
                          }`}
                        >
                          <span className="text-[11px] font-bold block">{s.label}</span>
                          <span className="text-[9px] font-semibold opacity-80">
                            {s.isBreak ? '☕ Break' : isBlocked ? 'Blocked' : 'Available'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setManageSlotsOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const schedulePayload = {
                    openTime: salonOpenTime,
                    closeTime: salonCloseTime,
                    slotInterval: salonSlotInterval,
                    capacity: salonCapacity,
                    breakfastBreak,
                    lunchBreak,
                    blockedSlotsByDate,
                  };
                  if (isDoctorClinic && slotTargetListingId !== 'ALL') {
                    updateService({
                      ...category!,
                      listings: (category?.listings || []).map((l: any) =>
                        l.id === slotTargetListingId
                          ? { ...l, metadata: { ...(l.metadata || {}), salonSchedule: schedulePayload } }
                          : l
                      )
                    });
                  } else {
                    updateService({
                      ...category!,
                      metadata: {
                        ...(category?.metadata || {}),
                        homeConvenienceFee,
                        homeMinOrderValue,
                        gymAmenities,
                        salonSchedule: schedulePayload
                      }
                    });
                  }
                  setManageSlotsOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-[#ff6325] hover:bg-[#e04e13] text-white text-xs font-black cursor-pointer shadow-sm"
              >
                Save &amp; Apply to Selected Dates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
