'use client';

import { useVendorStore, CatalogService, BranchInfo, PRESET_MERCHANTS } from '@/lib/store';
import { getArchetypeConfig } from '@/lib/businessDictionary';
import { compressImage } from '@/lib/imageUtils';
import { getEntertainmentCategoryConfig, NOW_SHOWING_MOVIES, MovieListingItem } from '@/lib/entertainmentData';
import {
  Plus, Trash2, Edit, X, Package, List, Building2, MapPin,
  Check, ChevronDown, Sparkles, Activity, Layers, Search,
  SlidersHorizontal, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink,
  Store, UserCheck, Phone, Mail, Film, Clapperboard, Video
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const { currentMerchant, services, fetchServices, addService, updateService, deleteService, switchBranch, addBranch } = useVendorStore();
  const [mounted, setMounted] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<'ALL' | 'STAYS' | 'SPORTS' | 'SERVICES'>('ALL');

  useEffect(() => {
    setMounted(true);
    fetchServices();
  }, [currentMerchant?.id, currentMerchant?.activeBranchId]);

  // Modals state
  const [showBookingTypeModal, setShowBookingTypeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showScreeningModal, setShowScreeningModal] = useState(false);

  // Entertainment / Screening Form State
  const [movieTitle, setMovieTitle] = useState('');
  const [movieFormat, setMovieFormat] = useState('IMAX Laser 3D');
  const [movieScreen, setMovieScreen] = useState('Audi 1 (IMAX)');
  const [movieShowtime, setMovieShowtime] = useState('10:30 AM');
  const [movieTierPrice, setMovieTierPrice] = useState('190');
  const [moviePoster, setMoviePoster] = useState('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80');

  // Navigation State
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Booking Type Form State
  const [bookingTypeCategory, setBookingTypeCategory] = useState('');
  const [bookingTypeLocation, setBookingTypeLocation] = useState('');
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
    ],
    "Cinema & Live Entertainment": [
      "Cinema / Movie Tickets", "Theatre Shows", "Concert Tickets", "Events & Festivals", "Exhibition Entry", "Workshops / Classes"
    ]
  };

  const ALL_PRESET_CATEGORIES = useMemo(() => {
    return [
      "Cinema / Movie Tickets",
      "Theatre Shows",
      "Concert Tickets",
      "Events & Festivals",
      "Exhibition Entry",
      "Workshops / Classes",
      "Hotel Booking",
      "Hostel Booking",
      "PG & Co-Living Stays",
      "Resort Booking",
      "Homestay / Villa",
      "Camping Booking",
      "Football Turf",
      "Cricket Ground",
      "Badminton Court",
      "Tennis Court",
      "Basketball Court",
      "Swimming Pool Slots",
      "Gaming Arena Booking",
      "Indoor Play Arena",
      "Restaurant Table Reservation",
      "Salon / Spa Appointment",
      "Gym / Yoga Slot Booking",
      "Doctor Appointment",
      "Co-working Space",
      "Meeting Room",
      "Studio Booking"
    ];
  }, []);

  const categorySuggestions = useMemo(() => {
    const query = (bookingTypeCategory || '').trim().toLowerCase();
    if (!query) return [];
    return ALL_PRESET_CATEGORIES.filter(c => c.toLowerCase().includes(query));
  }, [bookingTypeCategory, ALL_PRESET_CATEGORIES]);

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
  const presetMatch = PRESET_MERCHANTS.find(m => m.id === currentMerchant?.id || m.username.toLowerCase() === currentMerchant?.username?.toLowerCase());
  const effectiveBranches: BranchInfo[] = (currentMerchant?.branches && currentMerchant.branches.length > 0)
    ? currentMerchant.branches
    : (presetMatch?.branches && presetMatch.branches.length > 0)
      ? presetMatch.branches
      : [
        {
          id: `branch-main-${currentMerchant.id || 'default'}`,
          name: `${currentMerchant.city || 'Main'} Branch`,
          city: currentMerchant.city || 'Chennai',
          category: currentMerchant.category || 'General Service',
          businessType: currentMerchant.category || 'Service Facility',
          address: currentMerchant.address || `${currentMerchant.city || 'Chennai'} Location`,
          gstStatus: (currentMerchant.gstStatus as any) || 'WITHOUT_GST',
          gstNumber: currentMerchant.gstNumber || '',
          offeringsSummary: currentMerchant.category || 'Primary Offerings',
          isMainBranch: true
        }
      ];

  const activeBranch = effectiveBranches.find(b => b.id === (currentMerchant.activeBranchId || effectiveBranches[0].id)) || effectiveBranches[0];
  const isTurfBranch = (activeBranch.category?.toLowerCase().includes('turf') || activeBranch.name?.toLowerCase().includes('turf'));
  const isStayBranch = (activeBranch.category?.toLowerCase().includes('resort') || activeBranch.category?.toLowerCase().includes('hotel') || activeBranch.category?.toLowerCase().includes('villa') || activeBranch.category?.toLowerCase().includes('stay') || activeBranch.name?.toLowerCase().includes('stay') || activeBranch.name?.toLowerCase().includes('suite'));
  const isEntBranch = (activeBranch.category?.toLowerCase().includes('movie') || activeBranch.category?.toLowerCase().includes('cinema') || activeBranch.category?.toLowerCase().includes('theatre') || activeBranch.category?.toLowerCase().includes('concert') || activeBranch.category?.toLowerCase().includes('multiplex') || activeBranch.name?.toLowerCase().includes('multiplex') || activeBranch.name?.toLowerCase().includes('cinema'));

  // Filter services strictly by Active Branch and category isolation
  let merchantServices = services.filter(s => {
    // If explicitly tagged with branchId and doesn't match active branch, but allow generic merchant services without strict branchId
    if (s.branchId && activeBranch?.id && s.branchId !== activeBranch.id) {
      // If service is category-level for current merchant without branch-specific overrides, let it display
      if (!s.metadata?.branchId && s.category === activeBranch.category) {
        // allow
      } else {
        return false;
      }
    }

    // Strict Category / Offering isolation between branches
    const sCat = (s.category || '').toLowerCase();
    const sName = (s.name || '').toLowerCase();
    const isServiceTurf = sCat.includes('turf') || sCat.includes('football') || sCat.includes('cricket') || sCat.includes('pitch') || sCat.includes('sport') ||
      sName.includes('turf') || sName.includes('football') || sName.includes('pitch');
    const isServiceEnt = sCat.includes('movie') || sCat.includes('cinema') || sCat.includes('theatre') || sCat.includes('concert') || sCat.includes('entertainment') ||
      sName.includes('movie') || sName.includes('cinema') || sName.includes('screen');

    if (isTurfBranch) {
      return isServiceTurf;
    } else if (isStayBranch) {
      return !isServiceTurf && !isServiceEnt;
    } else if (isEntBranch) {
      return isServiceEnt || (!isServiceTurf && !sCat.includes('resort') && !sCat.includes('hotel'));
    }
    return true;
  });

  // Dynamic Auto-Fallback for Entertainment / Multiplex Branches if local services are empty
  if (merchantServices.length === 0 && isEntBranch) {
    const entCfg = getEntertainmentCategoryConfig((activeBranch.category || currentMerchant.category || 'movies').toLowerCase());
    if (entCfg) {
      const branchOfferings = activeBranch.offeringsSummary || `${entCfg.categoryName} Auditoriums`;
      const fallbackEntService: CatalogService = {
        id: `svc-${entCfg.slug}-${activeBranch.id}`,
        name: `${entCfg.categoryName} Passes & Screenings`,
        merchant: activeBranch.name || currentMerchant.merchantName || entCfg.merchantName,
        price: entCfg.defaultPrice,
        duration: 120,
        category: entCfg.categoryName,
        active: true,
        branchId: activeBranch.id,
        rating: 4.9,
        bookingsCount: 420,
        imageUrl: entCfg.heroImage,
        description: `Premier ${entCfg.categoryName} hall, screen formats (${branchOfferings}), tier pricing and concession add-on controls.`,
        city: activeBranch.city || currentMerchant.city || 'Chennai',
        metadata: {
          isEntertainment: true,
          branchId: activeBranch.id,
          branchName: activeBranch.name,
          merchantName: activeBranch.name || currentMerchant.merchantName || entCfg.merchantName,
          originalCategory: entCfg.categoryName,
          amenities: entCfg.amenities,
          venueRules: entCfg.venueRules,
          formats: entCfg.formats,
          languages: entCfg.languages,
          showtimes: entCfg.showtimes,
          seatTiers: entCfg.seatTiers,
          snackAddons: entCfg.snackAddons,
          listings: entCfg.seatTiers.map(tier => ({
            id: tier.id,
            name: tier.name,
            price: tier.price,
            imageUrl: entCfg.heroImage,
            description: tier.desc,
            images: [entCfg.heroImage],
            metadata: {
              badge: tier.badge,
              icon: tier.icon,
              formats: entCfg.formats,
              showtimes: entCfg.showtimes,
              snackAddons: entCfg.snackAddons
            }
          }))
        },
        listings: entCfg.seatTiers.map(tier => ({
          id: tier.id,
          name: tier.name,
          price: tier.price,
          imageUrl: entCfg.heroImage,
          description: tier.desc,
          images: [entCfg.heroImage],
          active: true
        }))
      };
      merchantServices = [fallbackEntService];
    }
  }

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

  // Filter Categories by search (Category name, service/unit names, and listing titles) and tab
  const categoryEntries = Object.entries(groupedCategories).filter(([cat, info]: any) => {
    const q = searchFilter.trim().toLowerCase();
    if (q) {
      const matchCat = cat.toLowerCase().includes(q);
      const matchTypes = (info.types || []).some((t: string) => (t || '').toLowerCase().includes(q));
      // Also match individual services & listing unit names under this category in current branch
      const matchServices = merchantServices.some((s: any) => {
        if (s.category !== cat) return false;
        const nameMatch = (s.name || '').toLowerCase().includes(q);
        const descMatch = (s.description || '').toLowerCase().includes(q);
        const listingMatch = (s.listings || []).some((l: any) =>
          (l.name || l.title || l.unitNumber || '').toLowerCase().includes(q)
        );
        return nameMatch || descMatch || listingMatch;
      });

      if (!matchCat && !matchTypes && !matchServices) return false;
    }

    const lower = cat.toLowerCase();
    if (activeCategoryTab === 'STAYS' && !lower.includes('resort') && !lower.includes('hotel') && !lower.includes('villa') && !lower.includes('stay') && !lower.includes('hostel')) return false;
    if (activeCategoryTab === 'SPORTS' && !lower.includes('football') && !lower.includes('turf') && !lower.includes('ground') && !lower.includes('cricket') && !lower.includes('court')) return false;
    if (activeCategoryTab === 'SERVICES' && (lower.includes('resort') || lower.includes('hotel') || lower.includes('football') || lower.includes('turf'))) return false;
    return true;
  });

  const currentGroupCategories = merchantServices.filter(s => {
    if (s.category !== selectedGroup || s.name === '__BOKSPOT_GROUP__') return false;
    const q = searchFilter.trim().toLowerCase();
    if (!q) return true;
    const nameMatch = (s.name || '').toLowerCase().includes(q);
    const descMatch = (s.description || '').toLowerCase().includes(q);
    const listingMatch = (s.listings || []).some((l: any) =>
      (l.name || l.title || l.unitNumber || '').toLowerCase().includes(q)
    );
    return nameMatch || descMatch || listingMatch;
  });

  const handleSaveBookingType = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = (bookingTypeCategory || categorySearchQuery).trim();
    if (!finalCategory) return alert("Please enter category name");

    // Location / Branch Determination
    const targetLocation = (bookingTypeLocation || activeBranch.city || currentMerchant.city || 'Chennai').trim();

    // Check if branch already exists for this location or create a new branch under the merchant's GST
    let targetBranch = effectiveBranches.find(
      b => (b.city && b.city.toLowerCase() === targetLocation.toLowerCase()) ||
        (b.name && b.name.toLowerCase().includes(targetLocation.toLowerCase()))
    );

    if (!targetBranch && targetLocation) {
      // Auto-create branch under same GST entity
      const newBranchId = `branch-${targetLocation.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
      targetBranch = {
        id: newBranchId,
        name: `${finalCategory} - ${targetLocation}`,
        city: targetLocation,
        category: finalCategory,
        businessType: finalCategory,
        address: `${targetLocation} Location`,
        gstStatus: currentMerchant.gstStatus || activeBranch.gstStatus || 'WITH_GST',
        gstNumber: currentMerchant.gstNumber || activeBranch.gstNumber || '33AAAAA0000A1Z5',
        offeringsSummary: finalCategory,
        isMainBranch: false
      };
      addBranch(targetBranch);
      switchBranch(targetBranch.id);
    }

    const boundBranch = targetBranch || activeBranch;

    const newService: CatalogService = {
      id: crypto.randomUUID(),
      name: finalCategory,
      merchant: currentMerchant.merchantName,
      price: 0,
      duration: 30,
      category: finalCategory,
      active: true,
      rating: 5.0,
      bookingsCount: 0,
      city: boundBranch.city || targetLocation,
      branchId: boundBranch.id,
      branchName: boundBranch.name,
      gstType: boundBranch.gstStatus,
      listings: [],
      metadata: {
        mainImageUrl: bookingTypeImage.trim() || undefined,
        customArchetype: isCustomCategory ? customCategoryArchetype : undefined,
        isCustomCategory: isCustomCategory,
        locationArea: targetLocation
      },
      createdAt: new Date().toISOString()
    };

    addService(newService);
    setShowBookingTypeModal(false);
    setBookingTypeCategory('');
    setBookingTypeLocation('');
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
    <div className="space-y-4 animate-fade-in pb-8 font-sans w-full">

      {/* 1. Interactive Branch Switcher Strip (TL Logic: Branch-Isolated Offerings with Primary GST) */}
      <div className="px-5 py-4 rounded-2xl bg-white dark:bg-[#0f1624] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="p-3 rounded-2xl bg-gradient-to-br from-[#ff6325] to-[#d4430c] shadow-lg shadow-[#ff6325]/20 flex items-center justify-center shrink-0">
            <Layers size={20} className="text-white" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {selectedGroup ? `${selectedGroup} Units` : 'Service Catalog & Units'}
              </h1>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${activeBranch.gstStatus === 'WITH_GST'
                  ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/30'
                  : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                }`}>
                {activeBranch.gstStatus === 'WITH_GST' ? `GST: ${activeBranch.gstNumber || currentMerchant?.gstNumber || '33AAAAA0000A1Z5'}` : 'Non-GST (Nett)'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span>Operating Branch:</span>
              <strong className="text-slate-800 dark:text-slate-200">{activeBranch.name || `${activeBranch.city} Branch`}</strong>
              <span>&bull;</span>
              <span className="text-slate-400">{activeBranch.address || `${activeBranch.city} Location`}</span>
            </p>
          </div>
        </div>

        {/* Compact Right Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search services, units..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium focus:border-[#ff6325] outline-none shadow-xs text-slate-900 dark:text-white"
            />
          </div>

          <button
            onClick={() => router.push('/workspace/about')}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold text-xs transition-all border border-slate-200/80 dark:border-white/10 cursor-pointer shadow-sm shrink-0"
            title="Manage Venue Profile, Photos & Location"
          >
            <Building2 size={14} className="text-[#ff6325]" />
            <span>Venue Profile</span>
          </button>

          {isEntBranch && (
            <button
              onClick={() => {
                setMovieTitle('');
                setMovieFormat('IMAX Laser 3D');
                setMovieScreen('Audi 1 (IMAX Laser)');
                setMovieShowtime('10:30 AM');
                setMovieTierPrice('190');
                setShowScreeningModal(true);
              }}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
              title="Post Movie Screening, Formats, Audi & Showtime"
            >
              <Clapperboard size={14} /> + Post Screening
            </button>
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
              <Plus size={15} /> Add Service
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
              const isEnt = cat.toLowerCase().includes('movie') || cat.toLowerCase().includes('cinema') || cat.toLowerCase().includes('theatre') || cat.toLowerCase().includes('concert') || cat.toLowerCase().includes('ticket');

              const categoryServices = merchantServices.filter(s => s.category === cat && s.name !== '__BOKSPOT_GROUP__');
              const hasMultipleTypes = categoryServices.length > 1;
              const singleTargetService = categoryServices.length === 1 ? categoryServices[0] : null;

              return (
                <div
                  key={cat}
                  onClick={() => {
                    // Direct 2-tier: Category -> Listings / Bookable Units directly (No intermediate 'Type' step)
                    const targetService = singleTargetService || categoryServices[0] || merchantServices.find(s => s.category === cat);
                    if (targetService) {
                      router.push(`/workspace/my-services/${targetService.id}`);
                    } else {
                      // Fallback: auto-create parent category service and route directly into unit creation
                      const newId = `svc-${Date.now()}`;
                      addService({
                        id: newId,
                        merchantId: currentMerchant.id,
                        merchant: currentMerchant.merchantName || 'Merchant',
                        branchId: activeBranch.id,
                        name: cat,
                        category: cat,
                        price: 0,
                        duration: 60,
                        active: true,
                        city: activeBranch.city || currentMerchant.city || 'Chennai',
                        rating: 5,
                        reviews: 0,
                        bookingsCount: 0,
                        description: `Primary bookable units for ${cat}`,
                        status: 'ACTIVE',
                        listings: []
                      } as CatalogService);
                      router.push(`/workspace/my-services/${newId}`);
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
                        <span>
                          {isTurf ? '⚽' : (isEnt ? '🎬' : (cat.toLowerCase().includes('resort') ? '🌴' : (cat.toLowerCase().includes('villa') ? '🏡' : '🏨')))}
                        </span>
                        <span style={{ color: '#ffffff' }} className="font-black !text-white text-xs">
                          {isTurf ? 'Sports Arena' : (isEnt ? 'Cinema & Entertainment' : (cat.toLowerCase().includes('resort') ? 'Resort Stay' : (cat.toLowerCase().includes('villa') ? 'Villa Stay' : (cat.toLowerCase().includes('hotel') ? 'Hotel Stay' : (activeBranch.category || 'Standard Service')))))}
                        </span>
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
            {categoryEntries.length === 0 && (
              <div className="col-span-full py-16 px-6 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col items-center justify-center text-center">
                <Package size={36} className="text-[#ff6325] mb-3" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">No Services Found For This Branch</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
                  Click below to add a service category (like Football Turf or Resort Booking) or configure units.
                </p>
                <button
                  onClick={() => setShowBookingTypeModal(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md active:scale-95 transition-all"
                >
                  + Add Service Category
                </button>
              </div>
            )}
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
                          <span style={{ color: '#ffffff' }} className="font-black !text-white text-xs">
                            {isTurfUnit
                              ? 'Sports Unit'
                              : ((srv.category || srv.name || '').toLowerCase().includes('hotel')
                                ? 'Hotel Unit'
                                : ((srv.category || srv.name || '').toLowerCase().includes('resort')
                                  ? 'Resort Unit'
                                  : 'Stay Unit'))}
                          </span>
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
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Configure {selectedGroup} Units</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
                  Create specific pitch, court, or room units with pricing, schedules, and timing under {selectedGroup}.
                </p>
                <button
                  onClick={() => {
                    // Check if group root service exists or auto create to jump straight to units
                    const existingGroup = merchantServices.find(s => s.category === selectedGroup);
                    if (existingGroup) {
                      router.push(`/workspace/my-services/${existingGroup.id}`);
                    } else {
                      setShowCategoryModal(true);
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md active:scale-95 transition-all"
                >
                  + Add Bookable Unit / Type
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
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Category Name</label>
                  <input
                    type="text"
                    value={bookingTypeCategory}
                    onChange={(e) => setBookingTypeCategory(e.target.value)}
                    placeholder="e.g. Hotel Booking, Football Turf, Resort Booking..."
                    autoFocus
                    autoComplete="off"
                    id="bookingTypeCategoryInput"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white font-medium focus:border-[#ff6325] outline-none"
                    required
                  />
                  {categorySuggestions.length > 0 && bookingTypeCategory.trim() !== '' && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-[#162033] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                      {categorySuggestions.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setBookingTypeCategory(cat);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-[#ff6325]/10 hover:text-[#ff6325] transition-colors flex items-center justify-between cursor-pointer border-b border-slate-100 dark:border-white/5 last:border-0"
                        >
                          <span>{cat}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Operating Location / City / Area</span>
                    <span className="text-[10px] text-slate-400 font-medium normal-case">Defines branch for this offering</span>
                  </label>
                  <input
                    type="text"
                    value={bookingTypeLocation}
                    onChange={(e) => setBookingTypeLocation(e.target.value)}
                    placeholder={`e.g. ${activeBranch.city || 'Chennai'} ECR, Bangalore Whitefield, Anna Nagar...`}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white text-xs font-semibold focus:border-[#ff6325] outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Operating under parent GST: <strong className="text-slate-600 dark:text-slate-300">{currentMerchant.gstNumber || '33AAAAA0000A1Z5'}</strong>
                  </p>
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

      {/* LEVEL 3 MODAL: POST MOVIE / SCREENING (Multiplex Partner Flow) */}
      {showScreeningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0f1624] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                  <Film size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Post Movie Screening</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Add movie title, audi, format & showtimes for {activeBranch.name}</p>
                </div>
              </div>
              <button onClick={() => setShowScreeningModal(false)} className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* Quick Select from Master Catalog */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Select from Central Movie Catalog or Enter Custom
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {NOW_SHOWING_MOVIES.map((catalogMovie) => (
                    <button
                      key={catalogMovie.id}
                      type="button"
                      onClick={() => {
                        setMovieTitle(catalogMovie.title);
                        setMoviePoster(catalogMovie.posterUrl);
                        if (catalogMovie.formats?.[0]) setMovieFormat(catalogMovie.formats[0]);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        movieTitle === catalogMovie.title
                          ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30'
                          : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50 dark:bg-white/5'
                      }`}
                    >
                      <img src={catalogMovie.posterUrl} alt={catalogMovie.title} className="w-8 h-12 rounded object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-slate-900 dark:text-white truncate">{catalogMovie.title}</p>
                        <p className="text-[9px] text-slate-400 font-semibold">{catalogMovie.certificate} • {catalogMovie.runtime}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Movie Title / Event Name</label>
                <input
                  type="text"
                  value={movieTitle}
                  onChange={(e) => setMovieTitle(e.target.value)}
                  placeholder="e.g. Leo (IMAX Experience), Avatar: Fire & Ash, Master..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white text-xs font-semibold focus:border-purple-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Experience Format</label>
                  <select
                    value={movieFormat}
                    onChange={(e) => setMovieFormat(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white text-xs font-bold outline-none"
                  >
                    <option value="IMAX Laser 3D">IMAX Laser 3D</option>
                    <option value="Dolby Atmos 7.1">Dolby Atmos 7.1</option>
                    <option value="4DX Motion & Scent">4DX Motion & Scent</option>
                    <option value="RealD 3D / 2D Standard">RealD 3D / 2D Standard</option>
                    <option value="VIP Recliner Gold Class">VIP Recliner Gold Class</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Screen / Audi</label>
                  <input
                    type="text"
                    value={movieScreen}
                    onChange={(e) => setMovieScreen(e.target.value)}
                    placeholder="e.g. Audi 1 (IMAX), Screen 3..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Showtime Slot</label>
                  <select
                    value={movieShowtime}
                    onChange={(e) => setMovieShowtime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white text-xs font-bold outline-none"
                  >
                    <option value="10:30 AM">10:30 AM (Morning)</option>
                    <option value="02:15 PM">02:15 PM (Matinee)</option>
                    <option value="06:45 PM">06:45 PM (Prime Evening)</option>
                    <option value="10:00 PM">10:00 PM (Night Show)</option>
                    <option value="11:45 PM">11:45 PM (Late Night / Premiere)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Base Ticket Price (₹)</label>
                  <input
                    type="number"
                    value={movieTierPrice}
                    onChange={(e) => setMovieTierPrice(e.target.value)}
                    placeholder="190"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Movie Poster URL (Optional)</label>
                <input
                  type="text"
                  value={moviePoster}
                  onChange={(e) => setMoviePoster(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white text-xs font-mono outline-none"
                />
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-white/[0.08] flex justify-end gap-3 bg-slate-50/50 dark:bg-white/[0.02]">
              <button type="button" onClick={() => setShowScreeningModal(false)} className="px-5 py-2 rounded-xl text-slate-500 font-bold text-xs">Cancel</button>
              <button
                type="button"
                onClick={() => {
                  const finalTitle = movieTitle.trim() || 'Blockbuster Movie Screening';
                  const newScreeningService: CatalogService = {
                    id: `ent-screen-${Date.now()}`,
                    name: `${finalTitle} (${movieFormat})`,
                    merchant: activeBranch.name || currentMerchant.merchantName,
                    price: Number(movieTierPrice) || 190,
                    duration: 150,
                    category: 'Cinema / Movie Tickets',
                    active: true,
                    branchId: activeBranch.id,
                    city: activeBranch.city || currentMerchant.city || 'Chennai',
                    rating: 4.9,
                    bookingsCount: 0,
                    imageUrl: moviePoster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80',
                    description: `${finalTitle} in ${movieFormat} at ${movieScreen}. Screened at ${activeBranch.name}.`,
                    metadata: {
                      isEntertainment: true,
                      movieTitle: finalTitle,
                      branchId: activeBranch.id,
                      branchName: activeBranch.name,
                      formats: [movieFormat, 'Dolby Atmos 7.1', 'RealD 3D / 2D'],
                      showtimes: [
                        { time: movieShowtime, screen: movieScreen, status: 'Available' },
                        { time: '02:15 PM', screen: movieScreen, status: 'Available' },
                        { time: '06:45 PM', screen: movieScreen, status: 'Fast Filling', fillingFast: true }
                      ],
                      seatTiers: [
                        { id: 'recliner', name: 'Royal Recliner (Lounge)', price: Math.round(Number(movieTierPrice) * 1.8), icon: '👑', badge: 'VIP Lounger', desc: '180° Motorized Recliner + In-Seat Dining' },
                        { id: 'prime', name: 'Prime Circle', price: Math.round(Number(movieTierPrice) * 1.3), icon: '🌟', badge: 'Popular', desc: 'Optimum Eye-Level Center Rows' },
                        { id: 'classic', name: 'Classic Executive', price: Number(movieTierPrice), icon: '🎟️', desc: 'Standard High-Back Ergonomic Cinema Seating' }
                      ],
                      snackAddons: [
                        { id: 'popcorn', name: 'Tub Popcorn + Coke Combo', price: 240, icon: '🍿', desc: 'Large Salted/Caramel Popcorn with 500ml Chilled Coke' },
                        { id: 'nachos', name: 'Warm Cheesy Nachos', price: 180, icon: '🌮', desc: 'Crispy Tortilla Chips with Warm Jalapeño Cheese Dip' },
                        { id: 'coffee', name: 'Cold Coffee / Iced Tea', price: 120, icon: '🥤', desc: 'Chilled Refreshing Beverage Delivered to your Seat' }
                      ]
                    },
                    listings: [
                      {
                        id: `tier-recliner-${Date.now()}`,
                        name: 'Royal Recliner (Lounge)',
                        price: Math.round(Number(movieTierPrice) * 1.8),
                        imageUrl: moviePoster,
                        description: '180° Motorized Recliner + In-Seat Dining',
                        active: true
                      },
                      {
                        id: `tier-prime-${Date.now()}`,
                        name: 'Prime Circle',
                        price: Math.round(Number(movieTierPrice) * 1.3),
                        imageUrl: moviePoster,
                        description: 'Optimum Eye-Level Center Rows',
                        active: true
                      },
                      {
                        id: `tier-classic-${Date.now()}`,
                        name: 'Classic Executive',
                        price: Number(movieTierPrice),
                        imageUrl: moviePoster,
                        description: 'Standard High-Back Ergonomic Cinema Seating',
                        active: true
                      }
                    ]
                  };
                  addService(newScreeningService);
                  setShowScreeningModal(false);
                  setMovieTitle('');
                }}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider shadow-md"
              >
                Publish Screening
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
