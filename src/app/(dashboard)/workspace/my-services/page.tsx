'use client';

import { useVendorStore, CatalogService, BranchInfo } from '@/lib/store';
import { getArchetypeConfig } from '@/lib/businessDictionary';
import { compressImage } from '@/lib/imageUtils';
import { Plus, Trash2, Edit, X, Package, List, Building2, MapPin, Check, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkspacePage() {
  const router = useRouter();
  const { currentMerchant, services, fetchServices, addService, updateService, deleteService, switchBranch, addBranch } = useVendorStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchServices(); // Always pull fresh data from backend on load
  }, []);

  // Modals state
  const [showBookingTypeModal, setShowBookingTypeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);

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
    "Home & Trade Services": [
      "Electrician Booking", "Plumber Booking", "Cleaning Service", "Technician Service"
    ],
    "Workspaces, Studios & Events": [
      "Co-working Space", "Meeting Room", "Podcast Studio", "Conference Hall", "Training Sessions", "Studio Booking", "Event Organizer Booking"
    ],
    "Rentals & Equipment": [
      "Cycle Rental", "Sports Bike Rental", "Camera Rental", "Sound System Rental", "Event Equipment Rental"
    ],
    "Personal Care Services": [
      "Pet Grooming Appointment", "Babysitting Service", "Elder Care Service"
    ],
    "API Integrations (Category B)": [
      "Flight Booking", "Train Booking", "Bus Booking", "Ferry / Boat Booking", "Shuttle / Van Booking", "Helicopter Booking (Premium)", "Cab / Taxi Booking", "Bike Rental", "Self-Drive Car Rental", "Cinema / Movie Tickets", "Theatre Shows", "Concert Tickets", "Events & Festivals", "Exhibition Entry", "Workshops / Classes", "Temple Darshan Booking", "Pooja Slot Booking", "Pilgrimage Packages"
    ]
  };

  if (!currentMerchant || !mounted) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-[#ff6325] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Flat list of all available categories
  const allAvailableCategories = Object.values(GROUPED_CATEGORIES).flat();

  // Filter categories based on search query
  const filteredCategories = allAvailableCategories.filter(cat => 
    cat.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  // Save Booking Type (Level 1)
  const handleSaveBookingType = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = (bookingTypeCategory || categorySearchQuery).trim();
    if (!finalCategory) return alert("Please select or type a category name");

    const newService: CatalogService = {
      id: crypto.randomUUID(),
      name: '__BOKSPOT_GROUP__', // Special marker
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
    setIsCustomCategory(false);
  };

  // Save Category (Level 2)
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return alert("Please enter a category name");

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
      // Find original service to preserve its listings during update
      const origService = merchantServices.find(s => s.id === editingServiceId);
      if (origService) {
        newService.listings = origService.listings;
      }
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

  const openEditCategory = (e: React.MouseEvent, srv: CatalogService) => {
    e.stopPropagation();
    setEditingServiceId(srv.id);
    setCategoryName(srv.name);
    setCategoryImage(srv.imageUrl || '');
    setCategoryDesc(srv.description || '');
    setShowCategoryModal(true);
  };

  const handleDeleteService = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteService(id);
  };

  const openCategoryPage = (srv: CatalogService) => {
    router.push(`/workspace/my-services/${srv.id}`);
  };

  const getFallbackImage = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;
  };

  const getCategoryPlaceholder = (): string => {
    // CRITICAL: Always prioritize the specific category user is currently managing (selectedGroup)
    // Never fall back to login merchant type (e.g. Resort) if user is inside a different category (e.g. Football Ground)!
    const group = (selectedGroup || '').toLowerCase();
    const merchantCat = (currentMerchant?.category || '').toLowerCase();
    const target = group || merchantCat;

    // 1. Football / Turf / Ground / Sports
    if (target.includes('football') || target.includes('turf') || target.includes('ground') || target.includes('pitch')) {
      return "e.g. 5s AstroTurf Pitch A, 7s Main Football Arena, 11s Natural Turf";
    }
    // 2. Cricket / Nets
    if (target.includes('cricket') || target.includes('net')) {
      return "e.g. Main Cricket Ground (65m), Box Cricket Pitch 1, Practice Net Turf";
    }
    // 3. Badminton / Tennis / Courts
    if (target.includes('badminton') || target.includes('tennis') || target.includes('court') || target.includes('basketball')) {
      return "e.g. Synthetic Court 1, Wooden Floor Court A, BWF Standard Court";
    }
    // 4. Swimming / Aquatics
    if (target.includes('swim') || target.includes('pool')) {
      return "e.g. 50m Olympic Pool Lane, Heated Hydro Pool, Kids Shallow Splash Pool";
    }
    // 5. Camping / Outdoor / Trekking
    if (target.includes('camp') || target.includes('tent') || target.includes('trek')) {
      return "e.g. 2-Person Alpine Tent, Luxury Glamping Dome, Forest Pitch with Bonfire";
    }
    // 6. Hostels / Dorms
    if (target.includes('hostel') || target.includes('dorm')) {
      return "e.g. 6-Bed Mixed AC Dorm, 4-Bed Female Dorm, Private Deluxe Bunk Room";
    }
    // 7. Resorts & Villas (Only when target actually contains resort/villa!)
    if (target.includes('resort')) {
      return "e.g. Beachfront Villa, Luxury Swiss Cottage, Lagoon Pool Villa";
    }
    if (target.includes('homestay') || target.includes('villa')) {
      return "e.g. 3BHK Heritage Homestay, Sunset Hill Villa, Poolside Villa";
    }
    // 8. Hotels & Lodges
    if (target.includes('hotel') || target.includes('lodge') || target.includes('room')) {
      return "e.g. Deluxe King Room, Executive Suite, Standard AC Double";
    }
    // 9. Dining / Cafe / Tables
    if (target.includes('rest') || target.includes('din') || target.includes('cafe') || target.includes('table')) {
      return "e.g. Rooftop 4-Seater Table, AC Family Dining, Candlelight Booth";
    }
    // 10. Doctor / Clinic
    if (target.includes('doctor') || target.includes('clinic') || target.includes('health') || target.includes('hospital')) {
      return "e.g. General OPD Consultation, Dental Checkup, Cardiology Review";
    }
    // 11. Salon / Spa
    if (target.includes('salon') || target.includes('spa') || target.includes('beauty')) {
      return "e.g. Premium Hair Spa & Styling, Swedish Full Body Massage, Bridal Makeup Package";
    }
    // 12. Coworking / Meeting Room / Studio
    if (target.includes('meeting') || target.includes('coworking') || target.includes('studio') || target.includes('conference')) {
      return "e.g. 10-Pax Conference Room, Dedicated Flexi Desk, 4K Podcast Soundproof Studio";
    }
    // 13. Rentals (Vehicles & Equipment)
    if (target.includes('rental') || target.includes('bike') || target.includes('car') || target.includes('cycle') || target.includes('camera')) {
      return "e.g. 350cc Cruiser Bike, 5-Seater Automatic Sedan, Sony Cinema Camera Kit";
    }
    // 14. Events & Tickets
    if (target.includes('event') || target.includes('ticket') || target.includes('show') || target.includes('cinema') || target.includes('concert')) {
      return "e.g. VIP Seating Zone, General Admission Pass, Weekend Stage Entry";
    }

    return "e.g. Standard Unit / Type Name";
  };

  // Default fallback branches if not yet initialized in currentMerchant
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

  // Filter services strictly by Active Branch (by branchId or matching city)
  const merchantServices = services.filter(s => {
    if (s.branchId) return s.branchId === activeBranch.id;
    if (s.city) return s.city.toLowerCase() === activeBranch.city.toLowerCase();
    // Default fallback to first/main branch if untagged
    return activeBranch.isMainBranch;
  });

  const groupedCategories = merchantServices.reduce((acc: any, srv: any) => {
    const cat = srv.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = { category: cat, mainImage: null, count: 0, serviceId: null, createdAt: srv.createdAt, city: srv.city || activeBranch.city };

    if (srv.name === '__BOKSPOT_GROUP__') {
      acc[cat].mainImage = srv.metadata?.mainImageUrl || srv.imageUrl || acc[cat].mainImage;
      acc[cat].serviceId = srv.id;
      if (srv.createdAt) acc[cat].createdAt = srv.createdAt;
      if (srv.city) acc[cat].city = srv.city;
    } else {
      acc[cat].count += 1;
      if (!acc[cat].mainImage) acc[cat].mainImage = srv.imageUrl;
    }
    return acc;
  }, {});

  // Real categories in the selected group (Level 2)
  const currentGroupCategories = merchantServices.filter(s => s.category === selectedGroup && s.name !== '__BOKSPOT_GROUP__');

  // Save new branch handler
  const handleSaveNewBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) return alert("Please enter branch name");
    
    const createdBranch: BranchInfo = {
      id: `branch-${Date.now()}`,
      name: newBranchName.trim(),
      city: newBranchCity,
      address: newBranchAddress.trim() || undefined,
      gstStatus: newBranchGstStatus,
      gstNumber: newBranchGstStatus === 'WITH_GST' ? newBranchGstNumber.trim() : undefined,
      offeringsSummary: newBranchOfferings.trim() || undefined,
      isMainBranch: false
    };

    addBranch(createdBranch);
    setShowAddBranchModal(false);
    setNewBranchName('');
    setNewBranchAddress('');
    setNewBranchGstNumber('');
    setNewBranchOfferings('');
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12 font-sans">

      {/* Header section with Branch Switcher & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200 dark:border-white/[0.06]">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              {selectedGroup ? `${selectedGroup} Types` : 'My Services'}
            </h1>

            {/* Branch Switcher Pill Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 hover:border-[#ff6325] text-slate-900 dark:text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
                title="Switch Active Outlet / Branch"
              >
                <MapPin size={13} className="text-[#ff6325]" />
                <span className="truncate max-w-[200px]">{activeBranch.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${activeBranch.gstStatus === 'WITH_GST' ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'}`}>
                  {activeBranch.gstStatus === 'WITH_GST' ? 'GST Tax Invoice' : 'Non-GST'}
                </span>
                <ChevronDown size={13} className="text-slate-500 dark:text-slate-400" />
              </button>

              {/* Branch dropdown menu */}
              {showBranchDropdown && (
                <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-[#0f1624] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 p-2 divide-y divide-slate-100 dark:divide-white/5 animate-fade-in">
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Your Business Branches</span>
                    <span>City</span>
                  </div>
                  <div className="space-y-1 py-1 max-h-56 overflow-y-auto">
                    {effectiveBranches.map((branch) => {
                      const isActive = branch.id === activeBranch.id;
                      return (
                        <div
                          key={branch.id}
                          onClick={() => {
                            switchBranch(branch.id);
                            setShowBranchDropdown(false);
                          }}
                          className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                            isActive 
                              ? 'bg-[#ff6325]/15 border border-[#ff6325]/40 text-slate-900 dark:text-white' 
                              : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex flex-col pr-2">
                            <span className="font-bold text-xs flex items-center gap-1.5">
                              {branch.name}
                              {isActive && <Check size={12} className="text-[#ff6325]" />}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              {branch.offeringsSummary || branch.address || 'All Services'}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">{branch.city}</span>
                            <span className={`text-[9px] font-bold px-1 rounded ${branch.gstStatus === 'WITH_GST' ? 'text-cyan-600 dark:text-cyan-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                              {branch.gstStatus === 'WITH_GST' ? 'GST' : 'Nett'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBranchDropdown(false);
                        setShowAddBranchModal(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#ff6325]/10 hover:bg-[#ff6325]/20 text-[#ff6325] text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus size={14} /> Add New Branch Outlet
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
            {selectedGroup
              ? `Manage your ${selectedGroup} types (formats) and their specific listings.`
              : `Operating under ${activeBranch.name} (${activeBranch.city}). Add your categories and manage bookings.`}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {!selectedGroup ? (
            <button
              onClick={() => {
                setBookingTypeCategory('');
                setCategorySearchQuery('');
                setIsCustomCategory(false);
                setBookingTypeImage('');
                setShowBookingTypeModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#ff6325]/25 active:scale-95 cursor-pointer"
            >
              <Plus size={18} className="text-white" /> Add Category
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingServiceId(null);
                setCategoryName('');
                setCategoryImage('');
                setCategoryDesc('');
                setShowCategoryModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#ff6325]/25 active:scale-95 cursor-pointer"
            >
              <Plus size={18} /> Add Type
            </button>
          )}
        </div>
      </div>

      {/* Grid Area */}
      <div>
        {!selectedGroup ? (
          // LEVEL 1: BOOKING TYPES
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {Object.entries(groupedCategories).map(([cat, info]: any) => (
                <div
                  key={cat}
                  onClick={() => setSelectedGroup(cat)}
                  className="bg-white dark:bg-[#0f1624] rounded-3xl border border-slate-200 dark:border-white/10 hover:border-[#ff6325]/50 shadow-md hover:shadow-2xl hover:shadow-[#ff6325]/10 hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden flex flex-col cursor-pointer backdrop-blur-sm"
                >
                  <div className="h-40 w-full bg-slate-100 dark:bg-[#162033] relative overflow-hidden">
                    <img
                      src={info.mainImage || getFallbackImage(cat)}
                      alt={cat}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = getFallbackImage(cat); }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    {info.serviceId && (
                      <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => {
                          e.stopPropagation();
                          const srv = merchantServices.find(s => s.id === info.serviceId);
                          if (srv) {
                            setBookingTypeCategory(srv.category || '');
                            setBookingTypeImage(srv.metadata?.mainImageUrl || srv.imageUrl || '');
                            setShowBookingTypeModal(true);
                          }
                        }} className="h-8 w-8 bg-black/60 hover:bg-[#0a3161] backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-md transition-colors">
                          <Edit size={13} />
                        </button>
                        <button onClick={(e) => handleDeleteService(e, info.serviceId)} className="h-8 w-8 bg-black/60 hover:bg-red-600 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-md transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-[#ff6325] transition-colors">{cat}</h3>
                      {info.createdAt && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1.5 uppercase tracking-wider block">
                          Added: {new Date(info.createdAt).toLocaleDateString()} {new Date(info.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                      )}
                      {info.city && (
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-[11px] text-[#ff6325] font-bold uppercase tracking-wider flex items-center gap-1 bg-[#ff6325]/10 px-2 py-0.5 rounded-md w-fit border border-[#ff6325]/20">
                            📍 {info.city}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[130px]">
                            {activeBranch.name.split('-')[1]?.trim() || activeBranch.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-3.5">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Package size={15} className="text-[#ff6325]" />
                        <span className="text-xs font-bold">{info.count} Types inside</span>
                      </div>
                      <span className="text-xs font-bold text-[#ff6325] opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {Object.keys(groupedCategories).length === 0 && (
              <div className="col-span-full py-20 px-6 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-[#ff6325] rotate-3 shadow-sm border border-slate-200">
                  <Package size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Categories Yet</h3>
                <p className="text-slate-500 max-w-md text-sm mb-6">
                  Start by adding your primary Business Category (like Cricket Ground, Turf or Hotel Booking).
                </p>
                <button
                  onClick={() => setShowBookingTypeModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-105 text-white font-bold text-sm transition-all shadow-md shadow-[#ff6325]/25"
                >
                  Add First Category
                </button>
              </div>
            )}
          </>
        ) : (
          // LEVEL 2: CATEGORIES & LISTINGS
          <div>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setSelectedGroup(null)} className="text-sm font-bold text-[#ff6325] hover:underline flex items-center gap-1 transition-all">
                ← Back to Categories
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {currentGroupCategories.map(srv => (
                <div
                  key={srv.id}
                  onClick={() => openCategoryPage(srv)}
                  className="bg-[#0f1624] rounded-3xl border border-white/10 hover:border-[#ff6325]/50 shadow-lg hover:shadow-2xl hover:shadow-[#ff6325]/10 hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden flex flex-col cursor-pointer backdrop-blur-sm"
                >
                  <div className="h-40 w-full bg-[#162033] relative overflow-hidden">
                    <img
                      src={srv.imageUrl || getFallbackImage(srv.name)}
                      alt={srv.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = getFallbackImage(srv.name); }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1624] via-transparent to-black/20" />
                    <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => openEditCategory(e, srv)} className="h-8 w-8 bg-black/60 hover:bg-[#0a3161] backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-md transition-colors">
                        <Edit size={13} />
                      </button>
                      <button onClick={(e) => handleDeleteService(e, srv.id)} className="h-8 w-8 bg-black/60 hover:bg-red-600 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-md transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-lg text-white leading-tight group-hover:text-[#ff6325] transition-colors">{srv.name}</h3>
                      {srv.description && (
                        <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">{srv.description}</p>
                      )}
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-3.5">
                      <div className="flex items-center gap-2 text-slate-300">
                        <List size={15} className="text-[#ff6325]" />
                        <span className="text-xs font-bold">{srv.listings?.length || 0} Listings inside</span>
                      </div>
                      <span className="text-xs font-bold text-[#ff6325] opacity-0 group-hover:opacity-100 transition-opacity">Manage →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {currentGroupCategories.length === 0 && (
              <div className="mt-12 py-16 px-6 rounded-3xl border-2 border-dashed border-white/10 bg-[#0f1624]/60 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                <div className="h-16 w-16 bg-[#162033] rounded-2xl flex items-center justify-center mb-4 text-[#ff6325] rotate-3 border border-white/10">
                  <Package size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Types Added Yet</h3>
                <p className="text-slate-400 max-w-md text-sm mb-6 leading-relaxed">
                  You haven't added any types (like {(selectedGroup?.toLowerCase().includes('cricket') || currentMerchant?.category?.toLowerCase().includes('cricket')) ? 'Main Cricket Ground / Box Pitch 1' : (selectedGroup?.toLowerCase().includes('turf') || selectedGroup?.toLowerCase().includes('sport') || selectedGroup?.toLowerCase().includes('ground') || currentMerchant?.category?.toLowerCase().includes('turf') || currentMerchant?.category?.toLowerCase().includes('sport') || currentMerchant?.category?.toLowerCase().includes('ground')) ? '7s Turf / Court 1' : 'Deluxe Room / Suite'}) to {selectedGroup} yet.
                </p>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-bold text-sm transition-all shadow-lg shadow-[#ff6325]/25"
                >
                  Add First Type & Listing
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* LEVEL 1 MODAL: BOOKING TYPE */}
      {showBookingTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0f1624] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/[0.08]">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Add Category</h2>
              <button onClick={() => setShowBookingTypeModal(false)} className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="bookingTypeForm" onSubmit={handleSaveBookingType} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Category Name
                  </label>
                  
                  {/* Clean Type Input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={bookingTypeCategory}
                      onChange={(e) => {
                        setBookingTypeCategory(e.target.value);
                        setCategorySearchQuery(e.target.value);
                      }}
                      placeholder="Type category (e.g. Cricket Ground, Swimming Pool, Laser Tag)..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white focus:border-[#ff6325] focus:ring-2 focus:ring-[#ff6325]/20 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      required
                      autoFocus
                    />

                    {/* Matched suggestions dropdown if typing matches standard categories */}
                    {categorySearchQuery.trim() && filteredCategories.length > 0 && !filteredCategories.some(c => c.toLowerCase() === categorySearchQuery.toLowerCase()) && (
                      <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-[#0f1624] border border-slate-200 dark:border-white/15 rounded-xl shadow-2xl z-50 divide-y divide-slate-100 dark:divide-white/5 animate-fade-in">
                        <div className="p-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-[#162033]/50">
                          Suggested Standard Categories:
                        </div>
                        {filteredCategories.slice(0, 6).map((cat: string) => (
                          <div
                            key={cat}
                            onClick={() => {
                              setBookingTypeCategory(cat);
                              setCategorySearchQuery('');
                            }}
                            className="px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 hover:bg-[#ff6325]/10 hover:text-[#ff6325] cursor-pointer font-medium flex items-center justify-between transition-colors"
                          >
                            <span>{cat}</span>
                            <span className="text-[10px] text-[#ff6325] font-bold">Pick this</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick helpful pill / custom indicator */}
                  {bookingTypeCategory.trim() && !allAvailableCategories.some(c => c.toLowerCase() === bookingTypeCategory.toLowerCase()) && (
                    <div className="mt-2.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Creating new custom category: <strong>"{bookingTypeCategory.trim()}"</strong></span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Main Cover Image (User App Front Page)</label>
                  <div onClick={() => document.getElementById('booking-image-upload')?.click()} className="w-full h-32 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/15 hover:border-[#ff6325] bg-slate-50 dark:bg-[#162033]/50 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group mb-3">
                    {bookingTypeImage ? (
                      <>
                        <img src={bookingTypeImage} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white font-bold text-sm flex items-center gap-2">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 group-hover:text-[#ff6325] transition-colors">
                        <span className="font-bold text-sm">Click to choose image</span>
                        <span className="text-xs mt-1 opacity-70">PNG, JPG up to 5MB</span>
                      </div>
                    )}
                  </div>
                  <input id="booking-image-upload" type="file" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const compressed = await compressImage(file, 400, 400, 0.8);
                        setBookingTypeImage(compressed);
                      } catch (err) {
                        console.error('Image compression failed', err);
                      }
                    }
                  }} accept="image/*" />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0a101b] flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setShowBookingTypeModal(false)} className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
              <button type="submit" form="bookingTypeForm" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-bold transition-all shadow-lg shadow-[#ff6325]/25 cursor-pointer">Save Category</button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 2 MODAL: TYPE & LISTING */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0f1624] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/[0.08]">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{editingServiceId ? 'Edit Type' : 'Add Type'}</h2>
              <button onClick={() => setShowCategoryModal(false)} className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"><X size={16} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="categoryListingForm" onSubmit={handleSaveCategory} className="space-y-5">
                <h3 className="text-base font-black text-slate-900 dark:text-slate-200 border-b border-slate-100 dark:border-white/[0.08] pb-2 mb-4">Type Details</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Type Name</label>
                  <input 
                    type="text" 
                    value={categoryName} 
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder={getCategoryPlaceholder()}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white focus:border-[#ff6325] focus:ring-2 focus:ring-[#ff6325]/20 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Type Image</label>
                  <div onClick={() => document.getElementById('cat-image-upload')?.click()} className="w-full h-32 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/15 hover:border-[#ff6325] bg-slate-50 dark:bg-[#162033]/50 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group mb-3">
                    {categoryImage ? (
                      <>
                        <img src={categoryImage} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><span className="text-white font-bold text-sm flex items-center gap-2">Change Image</span></div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 group-hover:text-[#ff6325] transition-colors"><span className="font-bold text-sm">Click to choose image</span></div>
                    )}
                  </div>
                  <input id="cat-image-upload" type="file" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const compressed = await compressImage(file, 400, 400, 0.8);
                        setCategoryImage(compressed);
                      } catch (err) {
                        console.error('Image compression failed', err);
                      }
                    }
                  }} accept="image/*" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Description</label>
                  <textarea value={categoryDesc} onChange={(e) => setCategoryDesc(e.target.value)} placeholder="Short description..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white focus:border-[#ff6325] focus:ring-2 focus:ring-[#ff6325]/20 transition-all font-medium min-h-[80px] placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0a101b] flex justify-end items-center gap-3 shrink-0">
              <button type="button" onClick={() => setShowCategoryModal(false)} className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-white/5 transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="submit" form="categoryListingForm" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-bold transition-all shadow-lg shadow-[#ff6325]/25 cursor-pointer">
                Save Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 3 MODAL: ADD BRANCH OUTLET */}
      {showAddBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0f1624] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/[0.08]">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Add Business Branch</h2>
                <p className="text-xs text-slate-400 mt-0.5">Create a city outlet (e.g., Chennai / Madurai branch)</p>
              </div>
              <button 
                onClick={() => setShowAddBranchModal(false)} 
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="addBranchForm" onSubmit={handleSaveNewBranch} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Branch / Outlet Name</label>
                  <input
                    type="text"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="e.g. Madurai Ring Road Sports Arena"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white focus:border-[#ff6325] focus:ring-2 focus:ring-[#ff6325]/20 transition-all font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Branch City</label>
                    <select
                      value={newBranchCity}
                      onChange={(e) => setNewBranchCity(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white focus:border-[#ff6325] font-medium"
                    >
                      <option value="Chennai">Chennai</option>
                      <option value="Madurai">Madurai</option>
                      <option value="Coimbatore">Coimbatore</option>
                      <option value="Theni">Theni</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Mumbai">Mumbai</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">GST Mode</label>
                    <select
                      value={newBranchGstStatus}
                      onChange={(e) => setNewBranchGstStatus(e.target.value as any)}
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white focus:border-[#ff6325] font-medium"
                    >
                      <option value="WITHOUT_GST">Without GST (Individual)</option>
                      <option value="WITH_GST">With GST (Tax Invoice)</option>
                    </select>
                  </div>
                </div>

                {newBranchGstStatus === 'WITH_GST' && (
                  <div className="animate-fade-in">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">GSTIN Number</label>
                    <input
                      type="text"
                      value={newBranchGstNumber}
                      onChange={(e) => setNewBranchGstNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. 33AAAAA0000A1Z5"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white focus:border-[#ff6325] font-medium tracking-wider"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Offerings Summary</label>
                  <input
                    type="text"
                    value={newBranchOfferings}
                    onChange={(e) => setNewBranchOfferings(e.target.value)}
                    placeholder="e.g. Cricket Turf, Box Net & Banquet Hall"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white focus:border-[#ff6325] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Address / Landmark</label>
                  <input
                    type="text"
                    value={newBranchAddress}
                    onChange={(e) => setNewBranchAddress(e.target.value)}
                    placeholder="e.g. Near Toll Gate, Ring Road, Madurai"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white focus:border-[#ff6325] font-medium"
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0a101b] flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={() => setShowAddBranchModal(false)} 
                className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="addBranchForm" 
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-bold transition-all shadow-lg shadow-[#ff6325]/25 cursor-pointer"
              >
                Save Branch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
