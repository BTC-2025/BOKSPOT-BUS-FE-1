'use client';

import { useVendorStore, CatalogService, BranchInfo } from '@/lib/store';
import { getArchetypeConfig } from '@/lib/businessDictionary';
import { compressImage } from '@/lib/imageUtils';
import {
  Plus, Trash2, Edit, X, Package, List, Building2, MapPin,
  Check, ChevronDown, Sparkles, Activity, Layers, Search,
  SlidersHorizontal, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// Curated high-resolution covers for business verticals to avoid ugly generic placeholders
const CURATED_VERTICAL_COVERS: Record<string, string> = {
  'football': 'https://images.unsplash.com/photo-1574629810360-7efbb49fec90?q=80&w=1200&auto=format&fit=crop',
  'turf': 'https://images.unsplash.com/photo-1529900245534-52f31b4f354b?q=80&w=1200&auto=format&fit=crop',
  'cricket': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop',
  'resort': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
  'villa': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop',
  'hotel': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop',
  'badminton': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1200&auto=format&fit=crop',
  'swimming': 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?q=80&w=1200&auto=format&fit=crop',
  'dining': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
  'salon': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop',
  'coworking': 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop'
};

export default function WorkspacePage() {
  const router = useRouter();
  const { currentMerchant, services, fetchServices, addService, updateService, deleteService, switchBranch, addBranch } = useVendorStore();
  const [mounted, setMounted] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<'ALL' | 'STAYS' | 'SPORTS' | 'SERVICES'>('ALL');

  useEffect(() => {
    setMounted(true);
    fetchServices();
  }, []);

  // Modals state
  const [showBookingTypeModal, setShowBookingTypeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);

  // New Branch Form State
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCity, setNewBranchCity] = useState('Chennai');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchGstStatus, setNewBranchGstStatus] = useState<'WITH_GST' | 'WITHOUT_GST'>('WITHOUT_GST');
  const [newBranchGstNumber, setNewBranchGstNumber] = useState('');
  const [newBranchOfferings, setNewBranchOfferings] = useState('');

  // Navigation State
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Booking Type Form State
  const [bookingTypeCategory, setBookingTypeCategory] = useState('');
  const [bookingTypeImage, setBookingTypeImage] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryArchetype, setCustomCategoryArchetype] = useState('RENTAL');

  // Category Form State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');

  const GROUPED_CATEGORIES = {
    "Accommodation & Hospitality": [
      "Hotel Booking", "Resort Booking", "Homestay / Villa", "Hostel Booking", "Camping Booking"
    ],
    "Sports & Arenas": [
      "Football Turf", "Cricket Ground", "Badminton Court", "Tennis Court", "Basketball Court", "Swimming Pool Slots", "Gaming Arena Booking", "Indoor Play Arena"
    ],
    "Health, Wellness & Dining": [
      "Restaurant Table Reservation", "Salon / Spa Appointment", "Gym / Yoga Slot Booking", "Doctor Appointment"
    ],
    "Workspaces, Studios & Events": [
      "Co-working Space", "Meeting Room", "Podcast Studio", "Conference Hall", "Studio Booking"
    ]
  };

  if (!currentMerchant || !mounted) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-4 border-[#ff6325] border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Catalog...</p>
        </div>
      </div>
    );
  }

  // Branches
  const effectiveBranches: BranchInfo[] = (currentMerchant?.branches && currentMerchant.branches.length > 0)
    ? currentMerchant.branches
    : [
      {
        id: 'branch-chennai-main',
        name: `${currentMerchant.merchantName || 'Main'} - Chennai Branch`,
        city: currentMerchant.city || 'Chennai',
        address: currentMerchant.address || 'Central Avenue, Chennai',
        gstStatus: currentMerchant.gstStatus || 'WITH_GST',
        gstNumber: currentMerchant.gstNumber || '33AAAAA0000A1Z5',
        offeringsSummary: 'Stays, Sports & Leisure',
        isMainBranch: true
      },
      {
        id: 'branch-madurai-sports',
        name: `${currentMerchant.merchantName || 'Sports'} - Madurai Arena Branch`,
        city: 'Madurai',
        address: 'Ring Road Arena Complex, Madurai',
        gstStatus: 'WITHOUT_GST',
        offeringsSummary: 'Cricket Turf & Banquet',
        isMainBranch: false
      }
    ];

  const activeBranch = effectiveBranches.find(b => b.id === (currentMerchant.activeBranchId || effectiveBranches[0].id)) || effectiveBranches[0];

  // Filter services strictly by Active Branch
  const merchantServices = services.filter(s => {
    if (s.branchId) return s.branchId === activeBranch.id;
    if (s.city) return s.city.toLowerCase() === activeBranch.city.toLowerCase();
    return activeBranch.isMainBranch;
  });

  const getSmartCover = (catName: string, explicitImg?: string | null) => {
    const lower = (catName || '').toLowerCase();
    if (lower.includes('football') || lower.includes('ground') || lower.includes('turf') || lower.includes('sport') || lower.includes('pitch') || lower.includes('astro')) {
      if (explicitImg && explicitImg.startsWith('http') && !explicitImg.includes('ui-avatars') && !explicitImg.includes('localhost') && !explicitImg.includes('placeholder')) {
        return explicitImg;
      }
      return 'https://images.unsplash.com/photo-1574629810360-7efbb49fec90?q=80&w=1200&auto=format&fit=crop';
    }
    if (lower.includes('resort') || lower.includes('hotel') || lower.includes('villa') || lower.includes('stay') || lower.includes('suite') || lower.includes('room')) {
      if (explicitImg && explicitImg.startsWith('http') && !explicitImg.includes('ui-avatars') && !explicitImg.includes('localhost') && !explicitImg.includes('placeholder')) {
        return explicitImg;
      }
      return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop';
    }
    if (explicitImg && !explicitImg.includes('ui-avatars.com') && explicitImg.startsWith('http')) {
      return explicitImg;
    }
    for (const [key, url] of Object.entries(CURATED_VERTICAL_COVERS)) {
      if (lower.includes(key)) return url;
    }
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop';
  };

  const groupedCategories = merchantServices.reduce((acc: any, srv: any) => {
    const cat = srv.category || 'Uncategorized';
    if (!acc[cat]) {
      acc[cat] = {
        category: cat,
        mainImage: null,
        count: 0,
        serviceId: null,
        createdAt: srv.createdAt,
        city: srv.city || activeBranch.city,
        totalListings: 0,
        types: []
      };
    }

    if (srv.name === '__BOKSPOT_GROUP__') {
      acc[cat].mainImage = srv.metadata?.mainImageUrl || srv.imageUrl || acc[cat].mainImage;
      acc[cat].serviceId = srv.id;
      if (srv.createdAt) acc[cat].createdAt = srv.createdAt;
      if (srv.city) acc[cat].city = srv.city;
    } else {
      acc[cat].count += 1;
      acc[cat].totalListings += (srv.listings?.length || 1);
      acc[cat].types.push(srv.name);
      if (!acc[cat].mainImage) acc[cat].mainImage = srv.imageUrl;
    }
    return acc;
  }, {});

  // Summary Metrics
  const totalCategoriesCount = Object.keys(groupedCategories).length;
  const totalSubTypesCount = Object.values(groupedCategories).reduce((s: number, g: any) => s + (g.count || 0), 0);
  const totalBookableUnitsCount = Object.values(groupedCategories).reduce((s: number, g: any) => s + (g.totalListings || 0), 0);

  // Filter Categories by search and tab
  const categoryEntries = Object.entries(groupedCategories).filter(([cat]: any) => {
    const lower = cat.toLowerCase();
    if (searchFilter.trim() && !lower.includes(searchFilter.toLowerCase())) return false;
    if (activeCategoryTab === 'STAYS' && !lower.includes('resort') && !lower.includes('hotel') && !lower.includes('villa') && !lower.includes('stay') && !lower.includes('hostel')) return false;
    if (activeCategoryTab === 'SPORTS' && !lower.includes('football') && !lower.includes('turf') && !lower.includes('ground') && !lower.includes('cricket') && !lower.includes('court')) return false;
    if (activeCategoryTab === 'SERVICES' && (lower.includes('resort') || lower.includes('hotel') || lower.includes('football') || lower.includes('turf'))) return false;
    return true;
  });

  const currentGroupCategories = merchantServices.filter(s => s.category === selectedGroup && s.name !== '__BOKSPOT_GROUP__');

  const handleSaveBookingType = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = (bookingTypeCategory || categorySearchQuery).trim();
    if (!finalCategory) return alert("Please enter category name");

    const newService: CatalogService = {
      id: crypto.randomUUID(),
      name: '__BOKSPOT_GROUP__',
      merchant: currentMerchant.merchantName,
      price: 0,
      duration: 30,
      category: finalCategory,
      active: true,
      rating: 5.0,
      bookingsCount: 0,
      city: activeBranch.city || 'Chennai',
      branchId: activeBranch.id,
      branchName: activeBranch.name,
      gstType: activeBranch.gstStatus,
      listings: [],
      metadata: {
        mainImageUrl: bookingTypeImage.trim() || undefined,
        customArchetype: isCustomCategory ? customCategoryArchetype : undefined,
        isCustomCategory: isCustomCategory
      },
      createdAt: new Date().toISOString()
    };

    addService(newService);
    setShowBookingTypeModal(false);
    setBookingTypeCategory('');
    setCategorySearchQuery('');
    setBookingTypeImage('');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return alert("Please enter a type name");

    const newService: CatalogService = {
      id: editingServiceId || crypto.randomUUID(),
      name: categoryName.trim(),
      merchant: currentMerchant.merchantName,
      price: 0,
      duration: 30,
      category: selectedGroup || currentMerchant.category,
      active: true,
      rating: 5.0,
      bookingsCount: 0,
      city: activeBranch.city || 'Chennai',
      branchId: activeBranch.id,
      branchName: activeBranch.name,
      gstType: activeBranch.gstStatus,
      imageUrl: categoryImage.trim() || undefined,
      description: categoryDesc.trim() || undefined,
      listings: [],
      createdAt: new Date().toISOString()
    };

    if (editingServiceId) {
      const origService = merchantServices.find(s => s.id === editingServiceId);
      if (origService) newService.listings = origService.listings;
      updateService(newService);
    } else {
      addService(newService);
    }

    setShowCategoryModal(false);
    setEditingServiceId(null);
    setCategoryName('');
    setCategoryImage('');
    setCategoryDesc('');
  };

  const handleDeleteService = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteService(id);
  };

  return (
    <div className="space-y-5 animate-fade-in pb-12 font-sans max-w-[1400px] mx-auto">

      {/* 1. Compact Header Strip */}
      <div className="px-5 py-4 rounded-2xl bg-white dark:bg-[#0f1624] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-gradient-to-br from-[#0a3161] to-[#162033] shadow-md flex items-center justify-center shrink-0 icon-force-white">
            <Layers size={18} className="icon-force-white" style={{ color: '#ffffff', stroke: '#ffffff' }} />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {selectedGroup ? `${selectedGroup} Units` : 'Service Catalog'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeBranch.name} &bull; <span className="font-bold text-[#ff6325]">{activeBranch.city} Outlet</span>
            </p>
          </div>
        </div>

        {/* Compact Right Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {!selectedGroup && (
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium focus:border-[#ff6325] outline-none shadow-xs text-slate-900 dark:text-white"
              />
            </div>
          )}

          {!selectedGroup ? (
            <button
              onClick={() => {
                setBookingTypeCategory('');
                setCategorySearchQuery('');
                setBookingTypeImage('');
                setShowBookingTypeModal(true);
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            >
              <Plus size={15} /> Add Category
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedGroup(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-bold text-xs cursor-pointer"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  setEditingServiceId(null);
                  setCategoryName('');
                  setCategoryImage('');
                  setCategoryDesc('');
                  setShowCategoryModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ff6325] text-white font-black text-xs cursor-pointer"
              >
                <Plus size={14} /> Add Type
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. High-Density Compact Grid (4 Columns) */}
      <div>
        {!selectedGroup ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryEntries.map(([cat, info]: any) => {
              const coverImg = getSmartCover(cat, info.mainImage);
              const isTurf = cat.toLowerCase().includes('turf') || cat.toLowerCase().includes('football') || cat.toLowerCase().includes('ground');

              const targetService = merchantServices.find(s => s.category === cat && s.name !== '__BOKSPOT_GROUP__');
              const targetServiceId = targetService?.id;

              return (
                <div
                  key={cat}
                  onClick={() => {
                    if (targetServiceId) {
                      router.push(`/workspace/my-services/${targetServiceId}`);
                    } else {
                      setSelectedGroup(cat);
                    }
                  }}
                  className="bg-white dark:bg-[#0f1624] rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-[#ff6325]/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer group"
                >
                  {/* Compact Header Cover */}
                  <div
                    className="h-36 w-full relative overflow-hidden bg-cover bg-center"
                    style={{
                      backgroundImage: isTurf
                        ? 'url("https://images.unsplash.com/photo-1574629810360-7efbb49fec90?w=800&auto=format&fit=crop&q=80"), linear-gradient(135deg, #0d381e, #1a5632)'
                        : 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80"), linear-gradient(135deg, #1e293b, #0f172a)'
                    }}
                  >
                    {/* Dark gradient overlay for guaranteed text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg border border-white/30 backdrop-blur-md"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', color: '#ffffff' }}
                      >
                        <span>{isTurf ? '⚽' : '🏨'}</span>
                        <span style={{ color: '#ffffff' }} className="font-black !text-white text-xs">{isTurf ? 'Sports Arena' : 'Resort Stay'}</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 shadow-lg !text-white"
                          style={{ color: '#ffffff' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete category "${cat}" and all its units?`)) {
                              // Delete all services belonging to this category in this branch
                              const servicesToDelete = merchantServices.filter(s => s.category === cat);
                              servicesToDelete.forEach(s => deleteService(s.id));
                            }
                          }}
                          className="h-7 w-7 rounded-full bg-black/60 hover:bg-red-500 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-md border border-white/20"
                          title={`Delete ${cat}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Category Name on the Cover in bold white text */}
                    <div className="absolute bottom-2.5 left-3 right-3 z-10">
                      <h3
                        className="text-base font-black capitalize truncate tracking-wide drop-shadow-md"
                        style={{ color: '#ffffff' }}
                      >
                        {cat}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white dark:bg-[#0f1624]">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {activeBranch.name.split('-')[1]?.trim() || activeBranch.city}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ff6325]/10 text-[#ff6325] font-black shrink-0">
                          {info.count || 1} Formats
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-1">
                        <MapPin size={12} className="text-[#ff6325]" /> {activeBranch.address || activeBranch.city}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(info.types && info.types.length > 0) ? (
                        info.types.slice(0, 2).map((t: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 text-[10px] font-bold border border-slate-200/60 dark:border-white/5">
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                          {isTurf ? 'AstroTurf' : 'Suites'}
                        </span>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                      <span className="font-black text-[#ff6325] text-xs">
                        Configure Units
                      </span>
                      <span className="font-bold text-slate-500 dark:text-slate-400 group-hover:text-[#ff6325] flex items-center gap-1 transition-colors text-xs">
                        Manage <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // LEVEL 2: SUB-TYPES / LISTINGS FOR SELECTED GROUP (Matching Level 1 size)
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentGroupCategories.map(srv => {
                const srvCover = getSmartCover(srv.name, srv.imageUrl);
                const isTurfUnit = (srv.name || '').toLowerCase().includes('turf') ||
                  (srv.name || '').toLowerCase().includes('pitch') ||
                  (srv.name || '').toLowerCase().includes('football') ||
                  (selectedGroup || '').toLowerCase().includes('football') ||
                  (selectedGroup || '').toLowerCase().includes('turf');
                return (
                  <div
                    key={srv.id}
                    onClick={() => router.push(`/workspace/my-services/${srv.id}`)}
                    className="bg-white dark:bg-[#0f1624] rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-[#ff6325]/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer group"
                  >
                    {/* Compact Header Cover - Same h-36 as Category Cards */}
                    <div
                      className="h-36 w-full relative overflow-hidden bg-cover bg-center"
                      style={{
                        backgroundImage: isTurfUnit
                          ? `url("${srvCover}"), url("https://images.unsplash.com/photo-1574629810360-7efbb49fec90?w=800&auto=format&fit=crop&q=80"), linear-gradient(135deg, #0d381e, #1a5632)`
                          : `url("${srvCover}"), url("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80"), linear-gradient(135deg, #1e293b, #0f172a)`
                      }}
                    >
                      {/* Dark gradient overlay for guaranteed high contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/50" />

                      {/* Top action pills & buttons */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg border border-white/30 backdrop-blur-md"
                          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', color: '#ffffff' }}
                        >
                          <span>{isTurfUnit ? '⚽' : '🏨'}</span>
                          <span style={{ color: '#ffffff' }} className="font-black !text-white text-xs">{isTurfUnit ? 'Sports Unit' : 'Stay Unit'}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingServiceId(srv.id);
                              setCategoryName(srv.name);
                              setCategoryImage(srv.imageUrl || '');
                              setCategoryDesc(srv.description || '');
                              setShowCategoryModal(true);
                            }}
                            className="h-7 w-7 rounded-full bg-black/60 hover:bg-[#0a3161] text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                            style={{ color: '#ffffff' }}
                            title="Edit"
                          >
                            <Edit size={12} style={{ color: '#ffffff', stroke: '#ffffff' }} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteService(e, srv.id)}
                            className="h-7 w-7 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                            style={{ color: '#ffffff' }}
                            title="Delete"
                          >
                            <Trash2 size={12} style={{ color: '#ffffff', stroke: '#ffffff' }} />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Unit Name on the Cover matching Category card */}
                      <div className="absolute bottom-2.5 left-3 right-3 z-10">
                        <h3
                          className="text-base font-black capitalize truncate tracking-wide drop-shadow-md"
                          style={{ color: '#ffffff' }}
                        >
                          {srv.name}
                        </h3>
                        <p
                          className="text-[11px] font-semibold drop-shadow"
                          style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                        >
                          {selectedGroup} &bull; {activeBranch.city}
                        </p>
                      </div>
                    </div>

                    {/* Compact Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white dark:bg-[#0f1624]">
                      <div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2">
                          {srv.description || 'Configured bookable slot unit with pricing and time intervals.'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <List size={13} className="text-[#ff6325]" />
                          <span>{srv.listings?.length || 1} Schedules</span>
                        </span>
                        <span className="font-bold text-slate-500 dark:text-slate-400 group-hover:text-[#ff6325] flex items-center gap-1 transition-colors text-xs">
                          Configure <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {currentGroupCategories.length === 0 && (
              <div className="py-16 px-6 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col items-center justify-center text-center">
                <Package size={36} className="text-[#ff6325] mb-3" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">No Format Types Added</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
                  Add specific pitch or room types under {selectedGroup} (e.g. 5-a-side AstroTurf or Deluxe Suite).
                </p>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] text-white font-black text-xs uppercase tracking-wider"
                >
                  + Add First Type
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* LEVEL 1 MODAL: ADD CATEGORY */}
      {showBookingTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0f1624] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/[0.08]">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Add Business Category</h2>
              <button onClick={() => setShowBookingTypeModal(false)} className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="bookingTypeForm" onSubmit={handleSaveBookingType} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Category Name</label>
                  <input
                    type="text"
                    value={bookingTypeCategory}
                    onChange={(e) => setBookingTypeCategory(e.target.value)}
                    placeholder="e.g. Football Turf, Swimming Pool, Cricket Ground..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white font-medium focus:border-[#ff6325] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Cover Image (Optional)</label>
                  <div onClick={() => document.getElementById('b-upload')?.click()} className="w-full h-28 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/15 flex flex-col items-center justify-center cursor-pointer hover:border-[#ff6325]">
                    {bookingTypeImage ? (
                      <img src={bookingTypeImage} alt="Cover" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-xs text-slate-400 font-bold">Click to choose image file</span>
                    )}
                  </div>
                  <input id="b-upload" type="file" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const compressed = await compressImage(file, 600, 400, 0.85);
                      setBookingTypeImage(compressed);
                    }
                  }} accept="image/*" />
                </div>
              </form>
            </div>
            <div className="p-5 border-t border-slate-100 dark:border-white/[0.08] flex justify-end gap-3">
              <button type="button" onClick={() => setShowBookingTypeModal(false)} className="px-5 py-2 rounded-xl text-slate-500 font-bold text-xs">Cancel</button>
              <button type="submit" form="bookingTypeForm" className="px-6 py-2.5 rounded-xl bg-[#ff6325] text-white font-black text-xs uppercase tracking-wider shadow-md">Save Category</button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 2 MODAL: ADD TYPE */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0f1624] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/[0.08]">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">{editingServiceId ? 'Edit Type' : 'Add Unit Type'}</h2>
              <button onClick={() => setShowCategoryModal(false)} className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="categoryListingForm" onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Unit / Type Name</label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g. 5s AstroTurf Pitch A, Deluxe Suite 201..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white font-medium focus:border-[#ff6325] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    value={categoryDesc}
                    onChange={(e) => setCategoryDesc(e.target.value)}
                    placeholder="Brief description of dimensions or amenities..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white text-xs outline-none"
                  />
                </div>
              </form>
            </div>
            <div className="p-5 border-t border-slate-100 dark:border-white/[0.08] flex justify-end gap-3">
              <button type="button" onClick={() => setShowCategoryModal(false)} className="px-5 py-2 rounded-xl text-slate-500 font-bold text-xs">Cancel</button>
              <button type="submit" form="categoryListingForm" className="px-6 py-2.5 rounded-xl bg-[#ff6325] text-white font-black text-xs uppercase tracking-wider shadow-md">Save Type</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
