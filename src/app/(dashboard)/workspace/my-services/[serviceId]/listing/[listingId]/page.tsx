'use client';

import { useVendorStore, CatalogListing } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Package, AlertTriangle, Tag, Users, CheckSquare, Info, X, Save, Bed, Image as ImageIcon, Activity, Heart, Car, Ticket, Briefcase, Zap, CheckCircle2, Plus } from 'lucide-react';
import DynamicForm from '@/components/DynamicForm';
import { getArchetypeFromCategory, Archetype } from '@/lib/archetypes';
import { compressImage } from '@/lib/imageUtils';

export default function ListingEditorPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;
  const listingId = params.listingId as string;
  const isCreating = listingId === 'new';

  const { services, updateService, currentMerchant } = useVendorStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);

  // Form State
  const [serviceName, setServiceName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryInput, setNewGalleryInput] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [offerBadge, setOfferBadge] = useState('');
  const [bannerTagline, setBannerTagline] = useState('');
  const [priceUnit, setPriceUnit] = useState('monthly rent (all inclusive)');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [isTokenAdvanceEnabled, setIsTokenAdvanceEnabled] = useState(true);
  const [tokenAdvanceAmount, setTokenAdvanceAmount] = useState('');
  const [foodFacilityProvided, setFoodFacilityProvided] = useState(true);
  const [foodDeductionAmount, setFoodDeductionAmount] = useState('');

  // Tenure Discount Packages for Long-Stay (PG / Hostel Monthly Offers)
  const [tenureDiscounts, setTenureDiscounts] = useState<{
    mo3Pct: string;   // % off for 3 months
    mo3Price: string; // Direct Monthly Rent for 3 months (₹)
    mo6Pct: string;   // % off for 6 months
    mo6Price: string; // Direct Monthly Rent for 6 months (₹)
    mo11Pct: string;  // % off for 11 months
    mo11Price: string;// Direct Monthly Rent for 11 months (₹)
  }>({
    mo3Pct: '5',
    mo3Price: '',
    mo6Pct: '10',
    mo6Price: '',
    mo11Pct: '15',
    mo11Price: '',
  });

  const [addons, setAddons] = useState<{ 
    name: string; 
    price: number; 
    stockType?: 'REUSABLE' | 'CONSUMABLE' | 'UNLIMITED';
    maxStock?: number;
    currentStock?: number;
  }[]>([]);
  const [equipmentAddons, setEquipmentAddons] = useState('');

  // GST Tax State for this Listing
  const [gstEnabled, setGstEnabled] = useState(false);
  const [gstPercentage, setGstPercentage] = useState(18); // Default standard 18% (9% SGST + 9% CGST)
  const [gstNumber, setGstNumber] = useState('');

  // Config-Driven Metadata State
  const [metadata, setMetadata] = useState<Record<string, any>>({});

  useEffect(() => {
    setMounted(true);
    if (services.length > 0 && currentMerchant) {
      const category = services.find(s => s.id === serviceId);
      if (category && !isCreating) {
        const list = category.listings?.find(l => l.id === listingId);
        if (list) {
          setServiceName(list.name || '');
          setImageUrl(list.imageUrl || '');
          const existingGallery = Array.isArray(list.metadata?.gallery)
            ? list.metadata.gallery
            : Array.isArray((list as any).images)
              ? (list as any).images
              : list.imageUrl ? [list.imageUrl] : [];
          setGalleryImages(existingGallery);
          setDescription(list.description || '');
          setBasePrice(list.price !== undefined && list.price !== null ? list.price.toString() : '');
          const orig = list.metadata?.originalPrice || (list as any).originalPrice;
          const disc = list.metadata?.discountPercentage || (list as any).discountPercentage;
          const currentBase = list.price !== undefined && list.price !== null ? Number(list.price) : 0;

          if (orig && Number(orig) > currentBase) {
            setOriginalPrice(orig.toString());
          } else if (disc && Number(disc) > 0 && currentBase > 0) {
            setOriginalPrice(Math.round(currentBase / (1 - Number(disc) / 100)).toString());
          } else {
            setOriginalPrice('');
          }

          if (disc && Number(disc) > 0) {
            setDiscountPercentage(disc.toString());
          } else if (orig && Number(orig) > currentBase && currentBase > 0) {
            setDiscountPercentage(Math.round(((Number(orig) - currentBase) / Number(orig)) * 100).toString());
          } else {
            setDiscountPercentage('');
          }

          setOfferBadge(list.metadata?.offerBadge || (list as any).offerBadge || '');
          setBannerTagline(list.metadata?.bannerTagline || (list as any).bannerTagline || '');
          setPriceUnit(list.metadata?.priceUnit || (list as any).priceUnit || 'monthly rent (all inclusive)');
          const existingDeposit = list.metadata?.securityDeposit !== undefined
            ? list.metadata.securityDeposit
            : (list as any).securityDeposit;
          setSecurityDeposit(existingDeposit !== undefined && existingDeposit !== null ? existingDeposit.toString() : '');
          setIsTokenAdvanceEnabled(list.metadata?.isTokenAdvanceEnabled ?? (list as any).isTokenAdvanceEnabled ?? true);
          const existingToken = list.metadata?.tokenAdvanceAmount ?? (list as any).tokenAdvanceAmount;
          setTokenAdvanceAmount(existingToken !== undefined && existingToken !== null ? existingToken.toString() : '');
          setFoodFacilityProvided(list.metadata?.foodFacilityProvided ?? (list as any).foodFacilityProvided ?? true);
          const existingFoodDed = list.metadata?.foodDeductionAmount ?? (list as any).foodDeductionAmount;
          setFoodDeductionAmount(existingFoodDed !== undefined && existingFoodDed !== null ? existingFoodDed.toString() : '');
          if (list.metadata?.tenureDiscounts || (list as any).tenureDiscounts) {
            const td = list.metadata?.tenureDiscounts || (list as any).tenureDiscounts;
            const bPrice = Number(list.price) || 0;
            const pct3 = td.mo3Pct ?? td.mo3 ?? 5;
            const pct6 = td.mo6Pct ?? td.mo6 ?? 10;
            const pct11 = td.mo11Pct ?? td.mo11 ?? 15;
            setTenureDiscounts({
              mo3Pct: pct3.toString(),
              mo3Price: td.mo3Price ? td.mo3Price.toString() : (bPrice > 0 ? Math.round(bPrice * (1 - Number(pct3) / 100)).toString() : ''),
              mo6Pct: pct6.toString(),
              mo6Price: td.mo6Price ? td.mo6Price.toString() : (bPrice > 0 ? Math.round(bPrice * (1 - Number(pct6) / 100)).toString() : ''),
              mo11Pct: pct11.toString(),
              mo11Price: td.mo11Price ? td.mo11Price.toString() : (bPrice > 0 ? Math.round(bPrice * (1 - Number(pct11) / 100)).toString() : ''),
            });
          }
          setMetadata(list.metadata || {});
          setAddons(list.metadata?.addons || []);
          setEquipmentAddons(list.metadata?.equipmentAddons || '');
          setGstEnabled(list.metadata?.gstEnabled ?? (category.gstType === 'WITH_GST' || currentMerchant.gstStatus === 'WITH_GST'));
          setGstPercentage(list.metadata?.gstPercentage ?? 18);
          setGstNumber(list.metadata?.gstNumber || currentMerchant.gstNumber || '');
        }
      } else if (category && isCreating) {
        setGstEnabled(category.gstType === 'WITH_GST' || currentMerchant.gstStatus === 'WITH_GST');
        setGstNumber(currentMerchant.gstNumber || '');
      }
    }
  }, [services, serviceId, listingId, isCreating, currentMerchant]);

  if (!mounted || !currentMerchant) return null;

  const category = services.find(s => s.id === serviceId);
  if (!category) return null;

  // Clean human-readable category name
  const categoryDisplayName = (!category.name || category.name === '__BOKSPOT_GROUP__')
    ? (category.category || 'Service')
    : category.name;

  const isTurfCategory = (categoryDisplayName || '').toLowerCase().includes('turf') ||
    (categoryDisplayName || '').toLowerCase().includes('football') ||
    (categoryDisplayName || '').toLowerCase().includes('cricket') ||
    (categoryDisplayName || '').toLowerCase().includes('court') ||
    (category.category || '').toLowerCase().includes('turf') ||
    (category.category || '').toLowerCase().includes('football');

  const isHotel =
    (categoryDisplayName || '').toLowerCase().includes('hotel') ||
    (categoryDisplayName || '').toLowerCase().includes('room') ||
    (currentMerchant?.category || '').toLowerCase().includes('hotel');

  const isResortVilla =
    (categoryDisplayName || '').toLowerCase().includes('resort') ||
    (categoryDisplayName || '').toLowerCase().includes('villa') ||
    (categoryDisplayName || '').toLowerCase().includes('cottage');

  const isCamping =
    (categoryDisplayName || '').toLowerCase().includes('camp') ||
    (categoryDisplayName || '').toLowerCase().includes('tent');

  const isPgOrHostel =
    (categoryDisplayName || '').toLowerCase().includes('pg') ||
    (categoryDisplayName || '').toLowerCase().includes('hostel') ||
    (categoryDisplayName || '').toLowerCase().includes('dorm') ||
    (categoryDisplayName || '').toLowerCase().includes('co-living') ||
    (categoryDisplayName || '').toLowerCase().includes('coliving') ||
    (category.category || '').toLowerCase().includes('hostel') ||
    (category.category || '').toLowerCase().includes('pg') ||
    (currentMerchant?.category || '').toLowerCase().includes('hostel') ||
    (currentMerchant?.category || '').toLowerCase().includes('pg');

  const isAccommodation = isHotel || isResortVilla || isCamping || isPgOrHostel ||
    (categoryDisplayName || '').toLowerCase().includes('suite') ||
    (categoryDisplayName || '').toLowerCase().includes('stay') ||
    (currentMerchant?.archetype?.toUpperCase() === 'ACCOMMODATION') ||
    ((currentMerchant?.category || '').toLowerCase().includes('hotel') || (currentMerchant?.category || '').toLowerCase().includes('resort'));

  const archetype: Archetype =
    isTurfCategory ? 'RENTAL' :
      isAccommodation ? 'ACCOMMODATION' :
        getArchetypeFromCategory(category?.name) ||
        getArchetypeFromCategory(category?.category) ||
        getArchetypeFromCategory(currentMerchant?.category) ||
        'RENTAL';

  const handleSaveDetails = () => {
    if (!serviceName.trim()) {
      alert("Please enter a Listing Name");
      setStep(1);
      return;
    }

    if (gstEnabled && !gstNumber.trim()) {
      alert("Please enter a valid 15-character Business GSTIN Number to apply GST Invoice.");
      return;
    }

    if (gstEnabled && gstNumber.trim().length !== 15) {
      alert("GSTIN must be exactly 15 alphanumeric characters (e.g., 33AAAAA0000A1Z5).");
      return;
    }

    const parsedTenureDiscounts = {
      mo3: tenureDiscounts.mo3Pct !== '' ? Number(tenureDiscounts.mo3Pct) : 0,
      mo3Pct: tenureDiscounts.mo3Pct !== '' ? Number(tenureDiscounts.mo3Pct) : 0,
      mo3Price: tenureDiscounts.mo3Price !== '' ? Number(tenureDiscounts.mo3Price) : undefined,
      mo6: tenureDiscounts.mo6Pct !== '' ? Number(tenureDiscounts.mo6Pct) : 0,
      mo6Pct: tenureDiscounts.mo6Pct !== '' ? Number(tenureDiscounts.mo6Pct) : 0,
      mo6Price: tenureDiscounts.mo6Price !== '' ? Number(tenureDiscounts.mo6Price) : undefined,
      mo11: tenureDiscounts.mo11Pct !== '' ? Number(tenureDiscounts.mo11Pct) : 0,
      mo11Pct: tenureDiscounts.mo11Pct !== '' ? Number(tenureDiscounts.mo11Pct) : 0,
      mo11Price: tenureDiscounts.mo11Price !== '' ? Number(tenureDiscounts.mo11Price) : undefined,
    };

    const updatedListing: CatalogListing = {
      id: isCreating ? `list-${Date.now()}` : listingId,
      name: serviceName.trim(),
      imageUrl: imageUrl.trim() || (galleryImages.length > 0 ? galleryImages[0] : undefined),
      images: galleryImages.length > 0 ? galleryImages : (imageUrl.trim() ? [imageUrl.trim()] : []),
      description: description.trim() || undefined,
      active: true,
      price: parseFloat(basePrice) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      discountPercentage: discountPercentage ? parseFloat(discountPercentage) : undefined,
      offerBadge: offerBadge.trim() || undefined,
      bannerTagline: bannerTagline.trim() || undefined,
      priceUnit: priceUnit.trim() || (isTurfCategory ? '/ hour' : isAccommodation ? '/ night' : '/ service'),
      securityDeposit: securityDeposit ? parseFloat(securityDeposit) : undefined,
      isTokenAdvanceEnabled,
      tokenAdvanceAmount: tokenAdvanceAmount ? parseFloat(tokenAdvanceAmount) : undefined,
      foodFacilityProvided,
      foodDeductionAmount: foodDeductionAmount ? parseFloat(foodDeductionAmount) : undefined,
      tenureDiscounts: parsedTenureDiscounts,
      duration: 30, // Default duration
      metadata: {
        ...metadata,
        gallery: galleryImages.length > 0 ? galleryImages : (imageUrl.trim() ? [imageUrl.trim()] : []),
        addons,
        equipmentAddons: equipmentAddons.trim() || undefined,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        discountPercentage: discountPercentage ? parseFloat(discountPercentage) : undefined,
        offerBadge: offerBadge.trim() || undefined,
        bannerTagline: bannerTagline.trim() || undefined,
        priceUnit: priceUnit.trim() || (isTurfCategory ? '/ hour' : isAccommodation ? '/ night' : '/ service'),
        securityDeposit: securityDeposit ? parseFloat(securityDeposit) : undefined,
        isTokenAdvanceEnabled,
        tokenAdvanceAmount: tokenAdvanceAmount ? parseFloat(tokenAdvanceAmount) : undefined,
        foodFacilityProvided,
        foodDeductionAmount: foodDeductionAmount ? parseFloat(foodDeductionAmount) : undefined,
        tenureDiscounts: parsedTenureDiscounts,
        gstEnabled,
        gstPercentage: gstEnabled ? gstPercentage : 0,
        gstNumber: gstEnabled ? gstNumber : undefined
      },
      // Direct root attributes for instant compatibility with consumer app & templates
      gstEnabled,
      gstPercentage: gstEnabled ? gstPercentage : 0,
      gstNumber: gstEnabled ? gstNumber : undefined,
      bedType: metadata.bedType,
      sizeSqFt: metadata.sizeSqFt ? Number(metadata.sizeSqFt) : undefined,
      maxGuests: metadata.maxGuests ? Number(metadata.maxGuests) : undefined,
      totalUnits: metadata.totalUnits ? Number(metadata.totalUnits) : undefined,
      inventoryLeft: metadata.totalUnits ? Number(metadata.totalUnits) : undefined,
      checkInTime: metadata.checkInTime,
      checkOutTime: metadata.checkOutTime,
      viewType: metadata.viewType,
      petPolicy: metadata.petPolicy,
      cancellationPolicy: metadata.cancellationPolicy,
      mealPlanOptions: metadata.mealPlanOptions,
      perks: Array.isArray(metadata.perks)
        ? metadata.perks
        : typeof metadata.perks === 'string' && metadata.perks.trim() !== ''
          ? metadata.perks.split(',').map((s: string) => s.trim())
          : [],
      amenities: Array.isArray(metadata.amenities)
        ? metadata.amenities
        : typeof metadata.amenities === 'string' && metadata.amenities.trim() !== ''
          ? metadata.amenities.split(',').map((s: string) => s.trim())
          : []
    } as any;

    let updatedListings = category.listings || [];
    if (isCreating) {
      updatedListings = [...updatedListings, updatedListing];
    } else {
      updatedListings = updatedListings.map(l => l.id === updatedListing.id ? updatedListing : l);
    }

    const updatedCategory = {
      ...category,
      listings: updatedListings
    };

    updateService(updatedCategory);
    router.push(`/workspace/my-services/${serviceId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24 font-sans max-w-7xl mx-auto px-2 sm:px-4">

      {/* 1. Header Strip - Clean Non-Overlapping Bar */}
      <div className="px-6 py-4 rounded-2xl bg-white dark:bg-[#0f1624] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.push(`/workspace/my-services/${serviceId}`)}
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-[#ff6325] font-bold mb-1 transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} /> Back to <span className="capitalize">{categoryDisplayName}</span>
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{isCreating ? 'Add Bookable Unit' : 'Edit Unit Details'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ff6325]/10 text-[#ff6325] font-black uppercase tracking-wider">
              {categoryDisplayName}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.push(`/workspace/my-services/${serviceId}`)}
            className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveDetails}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-[#ff6325]/20 active:scale-95 cursor-pointer"
          >
            <Save size={15} /> {isCreating ? 'Save & Publish Unit' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* 2. Responsive 2-Column Executive Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Comprehensive Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Section 1: Overview & Pricing */}
          <div className="bg-white dark:bg-[#0f1624] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-sm overflow-hidden transition-all hover:shadow-md">
            {/* Top Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#ff6325] via-amber-500 to-[#0a3161]" />

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff6325] ring-4 ring-[#ff6325]/15" />
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    1. Unit Overview & Pricing
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Step 1 of 4</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {isTurfCategory ? 'Pitch / Court / Unit Title' : 'Unit / Listing Title'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder={
                      isTurfCategory
                        ? "e.g. 7-a-side Main Astro Turf A, 5s Cage Pitch B, Box Cricket Arena"
                        : isHotel
                          ? "e.g. Deluxe AC Room, Executive Suite, Standard Non-AC Room"
                          : isCamping
                            ? "e.g. 2-Person Alpine Tent, Luxury Glamping Pod, Riverside Dome"
                            : "e.g. 3BHK Private Pool Villa, Sunset Hill View Cottage, Deluxe Suite"
                    }
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#162033] text-slate-900 dark:text-white font-semibold text-sm focus:border-[#ff6325] focus:bg-white dark:focus:bg-[#131d2e] outline-none transition-all shadow-xs"
                    required
                  />
                </div>

                {/* If PG / Hostel: Dedicated Clean 3-Payment Flow UI */}
                {isPgOrHostel ? (
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* 1. Monthly Rent (Selling Price) */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                          Monthly Rent (With Food) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">₹</span>
                          <input
                            type="number"
                            value={basePrice}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBasePrice(val);
                              if (originalPrice && Number(originalPrice) > Number(val) && Number(val) > 0) {
                                setDiscountPercentage(Math.round(((Number(originalPrice) - Number(val)) / Number(originalPrice)) * 100).toString());
                              }
                            }}
                            placeholder="e.g. 7500"
                            min="0"
                            className="w-full pl-9 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#162033] text-slate-900 dark:text-white font-black text-sm focus:border-[#ff6325] outline-none shadow-xs"
                            required
                          />
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Final price resident pays.
                        </span>
                      </div>

                      {/* 2. Original Rate (Before Discount / Strikethrough) */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Original Rate (₹) <span className="text-slate-400 font-normal">(Optional Offer)</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">₹</span>
                          <input
                            type="number"
                            value={originalPrice}
                            onChange={(e) => {
                              const orig = e.target.value;
                              setOriginalPrice(orig);
                              if (orig && Number(orig) > Number(basePrice) && Number(basePrice) > 0) {
                                setDiscountPercentage(Math.round(((Number(orig) - Number(basePrice)) / Number(orig)) * 100).toString());
                              } else {
                                setDiscountPercentage('');
                              }
                            }}
                            placeholder="e.g. 9000 (Strikethrough)"
                            min="0"
                            className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {discountPercentage ? `Shows: ₹${originalPrice} (-${discountPercentage}% OFF)` : 'Shown crossed out to attract residents.'}
                        </span>
                      </div>

                      {/* 3. Optional Urgency / Offer Tag */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Deal Label / Badge <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={offerBadge}
                          onChange={(e) => setOfferBadge(e.target.value)}
                          placeholder="e.g. Early Bird 10% Offer, Limited Beds"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                        />
                        <span className="text-[10px] text-slate-400">
                          Promotional tag shown on bed card.
                        </span>
                      </div>
                    </div>

                    {/* Refundable Security Deposit & Rent Cadence */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Billing Period / Rent Cadence
                        </label>
                        <select
                          value={priceUnit || 'monthly rent (all inclusive)'}
                          onChange={(e) => setPriceUnit(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325] cursor-pointer"
                        >
                          <option value="monthly rent (all inclusive)">monthly rent (all inclusive)</option>
                          <option value="/ month (stay only)">/ month (stay only)</option>
                          <option value="/ bed per month">/ bed per month</option>
                          <option value="/ day (daily stay)">/ day (daily stay / transit)</option>
                        </select>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Subtitle shown below price on customer card (e.g. ₹3,000 monthly rent).
                        </span>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Refundable Security Deposit (₹) <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">₹</span>
                          <input
                            type="number"
                            value={securityDeposit}
                            onChange={(e) => setSecurityDeposit(e.target.value)}
                            placeholder="e.g. 3000"
                            min="0"
                            className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Shown as &apos;Refundable Deposit: ₹X,XXX&apos; on listing card.
                        </span>
                      </div>
                    </div>

                    {/* 3. Food / Mess Option */}
                    <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">🍱</span>
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                              Is Food Provided in this PG?
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                            {foodFacilityProvided
                              ? 'Yes, residents get daily meals (Breakfast, Lunch, Dinner).'
                              : 'No, this is a stay-only room without food.'}
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={foodFacilityProvided}
                            onChange={(e) => setFoodFacilityProvided(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-slate-300 dark:bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>

                      {foodFacilityProvided && (
                        <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-800/30 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                              Discount if resident does NOT want food (₹ / Month)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">₹</span>
                              <input
                                type="number"
                                value={foodDeductionAmount}
                                onChange={(e) => setFoodDeductionAmount(e.target.value)}
                                placeholder="e.g. 1000 or 1500"
                                min="0"
                                className="w-full pl-7 pr-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-[#0f1624] text-xs font-black text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                              />
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                              Amount reduced when guest chooses &apos;Stay Only&apos;.
                            </span>
                          </div>

                          {/* Customer Live Price Preview Box */}
                          <div className="rounded-xl bg-white dark:bg-[#162033] p-3 border border-emerald-200/60 dark:border-emerald-800/30 shadow-2xs space-y-1.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                              Resident Monthly Rent:
                            </span>
                            <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200">
                              <span>🍱 Stay + Food:</span>
                              <span className="font-black text-[#033266] dark:text-[#ff6325]">
                                ₹{basePrice ? Number(basePrice).toLocaleString() : '3,000'}/mo
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              <span>🍳 Stay Only (No Food):</span>
                              <span className="font-black">
                                ₹{Math.max(0, (Number(basePrice) || 3000) - (Number(foodDeductionAmount) || 0)).toLocaleString()}/mo
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4. Lock Bed Option / Token Advance Config */}
                    <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-[#ff6325]/10 border border-orange-200/60 dark:border-[#ff6325]/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">🔒</span>
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                              Allow Bed Lock / Token Advance
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                            Let residents reserve & hold this bed with partial advance instead of paying full 1st month rent.
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={isTokenAdvanceEnabled}
                            onChange={(e) => setIsTokenAdvanceEnabled(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-slate-300 dark:bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff6325]"></div>
                        </label>
                      </div>

                      {isTokenAdvanceEnabled && (
                        <div className="pt-2 border-t border-orange-200/50 dark:border-[#ff6325]/20 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                              Bed Lock Token Amount (₹) <span className="text-[#ff6325]">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">₹</span>
                              <input
                                type="number"
                                value={tokenAdvanceAmount}
                                onChange={(e) => setTokenAdvanceAmount(e.target.value)}
                                placeholder="e.g. 999 or 1500"
                                min="100"
                                className="w-full pl-7 pr-3.5 py-2 rounded-xl border border-orange-300 dark:border-[#ff6325]/40 bg-white dark:bg-[#0f1624] text-xs font-black text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              Displayed on user app as: &apos;🔒 Lock this bed today for just ₹{tokenAdvanceAmount ? Number(tokenAdvanceAmount).toLocaleString() : '0'}&apos;
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-white dark:bg-[#162033] border border-orange-200/60 dark:border-[#ff6325]/20 text-xs text-slate-600 dark:text-slate-300">
                            Resident pays <strong className="text-[#ff6325]">₹{tokenAdvanceAmount ? Number(tokenAdvanceAmount).toLocaleString() : '0'}</strong> immediately to book. Remaining rent & deposit collected on check-in day.
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 5. Stay Duration & Monthly Tenure Offers (Tenure Discount Packages) */}
                    <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🎁</span>
                          <div>
                            <span className="text-xs font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider block">
                              Stay Duration &amp; Tenure Discount Packages
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                              Incentivize long-term residents with special monthly agreement discounts.
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300">
                          Live on User App
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2 border-t border-amber-200/50 dark:border-amber-900/30">
                        {/* 1 Month (Flexi Stay) */}
                        <div className="p-3 rounded-2xl bg-white dark:bg-[#162033] border border-amber-200/60 dark:border-white/10 text-center flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-black text-slate-900 dark:text-white block">1 Month</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Flexi Plan (Standard)</span>
                          </div>
                          <div className="mt-2 py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-black text-slate-700 dark:text-slate-300">
                            ₹{basePrice ? Number(basePrice).toLocaleString() : '6,000'}/mo
                          </div>
                        </div>

                        {/* 3 Months Offer */}
                        <div className="p-3 rounded-2xl bg-white dark:bg-[#162033] border border-amber-200/60 dark:border-white/10 text-center flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-xs font-black text-slate-900 dark:text-white block">3 Months</span>
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block mt-0.5">🔥 Most Popular</span>
                          </div>
                          
                          {/* Monthly Rent Input (₹) */}
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Monthly Rent</label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">₹</span>
                              <input
                                type="number"
                                placeholder={basePrice ? String(Math.round(Number(basePrice) * 0.95)) : '5700'}
                                value={tenureDiscounts.mo3Price}
                                onChange={(e) => {
                                  const pr = e.target.value.replace(/^0+(?=\d)/, '');
                                  const bp = Number(basePrice) || 0;
                                  let calcPct = tenureDiscounts.mo3Pct;
                                  if (bp > 0 && pr && Number(pr) <= bp) {
                                    calcPct = Math.round(((bp - Number(pr)) / bp) * 100).toString();
                                  }
                                  setTenureDiscounts({ ...tenureDiscounts, mo3Price: pr, mo3Pct: calcPct });
                                }}
                                className="w-full h-8 pl-6 pr-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-950/30 text-xs font-black text-slate-900 dark:text-white outline-none"
                              />
                            </div>
                          </div>

                          {/* Discount % OFF */}
                          <div className="flex items-center justify-center gap-1 text-[11px]">
                            <input
                              type="number"
                              min="0"
                              max="50"
                              value={tenureDiscounts.mo3Pct}
                              onChange={(e) => {
                                const pct = e.target.value.replace(/^0+(?=\d)/, '');
                                const bp = Number(basePrice) || 0;
                                const calcPrice = (bp > 0 && pct) ? Math.round(bp * (1 - Number(pct) / 100)).toString() : '';
                                setTenureDiscounts({ ...tenureDiscounts, mo3Pct: pct, mo3Price: calcPrice });
                              }}
                              className="w-12 h-6 text-center rounded-lg border border-slate-200 dark:border-white/10 text-xs font-black text-[#ff6325] outline-none"
                            />
                            <span className="font-bold text-slate-400">% OFF</span>
                          </div>
                        </div>

                        {/* 6 Months Offer */}
                        <div className="p-3 rounded-2xl bg-white dark:bg-[#162033] border border-amber-200/60 dark:border-white/10 text-center flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-xs font-black text-slate-900 dark:text-white block">6 Months</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">⭐ Best Value</span>
                          </div>

                          {/* Monthly Rent Input (₹) */}
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Monthly Rent</label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">₹</span>
                              <input
                                type="number"
                                placeholder={basePrice ? String(Math.round(Number(basePrice) * 0.90)) : '5400'}
                                value={tenureDiscounts.mo6Price}
                                onChange={(e) => {
                                  const pr = e.target.value.replace(/^0+(?=\d)/, '');
                                  const bp = Number(basePrice) || 0;
                                  let calcPct = tenureDiscounts.mo6Pct;
                                  if (bp > 0 && pr && Number(pr) <= bp) {
                                    calcPct = Math.round(((bp - Number(pr)) / bp) * 100).toString();
                                  }
                                  setTenureDiscounts({ ...tenureDiscounts, mo6Price: pr, mo6Pct: calcPct });
                                }}
                                className="w-full h-8 pl-6 pr-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-950/30 text-xs font-black text-slate-900 dark:text-white outline-none"
                              />
                            </div>
                          </div>

                          {/* Discount % OFF */}
                          <div className="flex items-center justify-center gap-1 text-[11px]">
                            <input
                              type="number"
                              min="0"
                              max="50"
                              value={tenureDiscounts.mo6Pct}
                              onChange={(e) => {
                                const pct = e.target.value.replace(/^0+(?=\d)/, '');
                                const bp = Number(basePrice) || 0;
                                const calcPrice = (bp > 0 && pct) ? Math.round(bp * (1 - Number(pct) / 100)).toString() : '';
                                setTenureDiscounts({ ...tenureDiscounts, mo6Pct: pct, mo6Price: calcPrice });
                              }}
                              className="w-12 h-6 text-center rounded-lg border border-slate-200 dark:border-white/10 text-xs font-black text-[#ff6325] outline-none"
                            />
                            <span className="font-bold text-slate-400">% OFF</span>
                          </div>
                        </div>

                        {/* 11 Months Offer */}
                        <div className="p-3 rounded-2xl bg-white dark:bg-[#162033] border border-amber-200/60 dark:border-white/10 text-center flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-xs font-black text-slate-900 dark:text-white block">11 Months</span>
                            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block mt-0.5">🏆 Annual Contract</span>
                          </div>

                          {/* Monthly Rent Input (₹) */}
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Monthly Rent</label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">₹</span>
                              <input
                                type="number"
                                placeholder={basePrice ? String(Math.round(Number(basePrice) * 0.85)) : '5100'}
                                value={tenureDiscounts.mo11Price}
                                onChange={(e) => {
                                  const pr = e.target.value.replace(/^0+(?=\d)/, '');
                                  const bp = Number(basePrice) || 0;
                                  let calcPct = tenureDiscounts.mo11Pct;
                                  if (bp > 0 && pr && Number(pr) <= bp) {
                                    calcPct = Math.round(((bp - Number(pr)) / bp) * 100).toString();
                                  }
                                  setTenureDiscounts({ ...tenureDiscounts, mo11Price: pr, mo11Pct: calcPct });
                                }}
                                className="w-full h-8 pl-6 pr-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-950/30 text-xs font-black text-slate-900 dark:text-white outline-none"
                              />
                            </div>
                          </div>

                          {/* Discount % OFF */}
                          <div className="flex items-center justify-center gap-1 text-[11px]">
                            <input
                              type="number"
                              min="0"
                              max="50"
                              value={tenureDiscounts.mo11Pct}
                              onChange={(e) => {
                                const pct = e.target.value.replace(/^0+(?=\d)/, '');
                                const bp = Number(basePrice) || 0;
                                const calcPrice = (bp > 0 && pct) ? Math.round(bp * (1 - Number(pct) / 100)).toString() : '';
                                setTenureDiscounts({ ...tenureDiscounts, mo11Pct: pct, mo11Price: calcPrice });
                              }}
                              className="w-12 h-6 text-center rounded-lg border border-slate-200 dark:border-white/10 text-xs font-black text-[#ff6325] outline-none"
                            />
                            <span className="font-bold text-slate-400">% OFF</span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Price Calculation Preview */}
                      {basePrice && Number(basePrice) > 0 && (
                        <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#162033]/80 border border-amber-200/50 dark:border-white/5 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                          <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                            Resident Total Contract Value Breakdown:
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                              <span className="text-slate-400 block text-[10px]">1 Mo Flexi:</span>
                              <strong className="text-slate-900 dark:text-white">₹{Number(basePrice).toLocaleString()}</strong>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                              <span className="text-slate-400 block text-[10px]">3 Mo (3 × ₹{tenureDiscounts.mo3Price || Math.round(Number(basePrice) * (1 - (Number(tenureDiscounts.mo3Pct) || 0) / 100))}):</span>
                              <strong className="text-amber-600">₹{(3 * (Number(tenureDiscounts.mo3Price) || Math.round(Number(basePrice) * (1 - (Number(tenureDiscounts.mo3Pct) || 0) / 100)))).toLocaleString()}</strong>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                              <span className="text-slate-400 block text-[10px]">6 Mo (6 × ₹{tenureDiscounts.mo6Price || Math.round(Number(basePrice) * (1 - (Number(tenureDiscounts.mo6Pct) || 0) / 100))}):</span>
                              <strong className="text-emerald-600">₹{(6 * (Number(tenureDiscounts.mo6Price) || Math.round(Number(basePrice) * (1 - (Number(tenureDiscounts.mo6Pct) || 0) / 100)))).toLocaleString()}</strong>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                              <span className="text-slate-400 block text-[10px]">11 Mo (11 × ₹{tenureDiscounts.mo11Price || Math.round(Number(basePrice) * (1 - (Number(tenureDiscounts.mo11Pct) || 0) / 100))}):</span>
                              <strong className="text-purple-600">₹{(11 * (Number(tenureDiscounts.mo11Price) || Math.round(Number(basePrice) * (1 - (Number(tenureDiscounts.mo11Pct) || 0) / 100)))).toLocaleString()}</strong>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                /* Standard Hotel / Turf Pricing Grid (For other categories only) */
                <div className="contents">
                {/* 1. Original Rate (Rack Price / MRP) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {isTurfCategory ? 'Original Hourly Slot Rate (₹)' : archetype === 'ACCOMMODATION' ? 'Original Rate / Rack Price (₹)' : 'Original Price / MRP (₹)'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">₹</span>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => {
                        const orig = e.target.value;
                        setOriginalPrice(orig);
                        if (orig && Number(orig) > 0) {
                          const disc = discountPercentage ? Number(discountPercentage) : 0;
                          const finalSelling = Math.round(Number(orig) * (1 - disc / 100));
                          setBasePrice(finalSelling.toString());
                        } else {
                          setBasePrice('');
                        }
                      }}
                      placeholder={isTurfCategory ? "e.g. 1500 or 1200" : "e.g. 16111 or 15000"}
                      min="0"
                      className="w-full pl-9 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#162033] text-slate-900 dark:text-white font-black text-sm focus:border-[#ff6325] focus:bg-white dark:focus:bg-[#131d2e] outline-none transition-all shadow-xs"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isTurfCategory ? 'Standard hourly court/pitch tariff before discount.' : 'Your standard rack tariff before applying discount.'}
                  </p>
                </div>

                {/* 2. Discount Percentage (% OFF) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Discount Percentage (% OFF) <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    {discountPercentage && Number(discountPercentage) > 0 ? (
                      <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/40">
                        -{discountPercentage}% OFF Applied
                      </span>
                    ) : null}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={discountPercentage}
                      onChange={(e) => {
                        const disc = e.target.value;
                        setDiscountPercentage(disc);
                        if (originalPrice && Number(originalPrice) > 0) {
                          const pct = disc ? Number(disc) : 0;
                          const finalSelling = Math.round(Number(originalPrice) * (1 - pct / 100));
                          setBasePrice(finalSelling.toString());
                        }
                      }}
                      placeholder="e.g. 10 (Leave empty for 0%)"
                      min="0"
                      max="95"
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#162033] text-slate-900 dark:text-white font-black text-sm focus:border-[#ff6325] focus:bg-white dark:focus:bg-[#131d2e] outline-none transition-all shadow-xs"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Type 10 for 10% discount, 20 for 20% discount.
                  </p>
                </div>

                {/* 3. Auto-Calculated Final Tariff Per Night & Deal Badges */}
                <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200 dark:border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                        {isTurfCategory ? 'Final Tariff (Customer Hourly Checkout Price)' : 'Final Tariff (Guest Checkout Price)'}
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-black text-[#ff6325]">
                          ₹{basePrice ? Number(basePrice).toLocaleString() : '0'}
                        </span>
                        {originalPrice && Number(originalPrice) > Number(basePrice || 0) && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{Number(originalPrice).toLocaleString()}
                          </span>
                        )}
                        <span className="text-xs text-slate-500 dark:text-slate-300 font-bold">
                          {priceUnit || (isTurfCategory ? '/ hour' : isAccommodation ? '/ night' : '/ service')}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        {discountPercentage && Number(discountPercentage) > 0
                          ? `Customer saves ₹${(Number(originalPrice) - Number(basePrice)).toLocaleString()} (${discountPercentage}% OFF)`
                          : 'Full price tariff without discount.'}
                      </span>
                      {securityDeposit && Number(securityDeposit) > 0 && (
                        <span className="inline-block mt-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          Refundable Deposit: <span className="font-extrabold text-[#ff6325]">₹{Number(securityDeposit).toLocaleString()}</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Deal Label / Urgency Badge <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={offerBadge}
                        onChange={(e) => setOfferBadge(e.target.value)}
                        placeholder={isTurfCategory ? "e.g. Prime Evening Slot, Weekend Match Offer" : "e.g. Early Bird 10% Offer, Limited Period"}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                      />
                    </div>
                  </div>

                  {/* Rent Cadence / Price Unit & Refundable Deposit Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-white/10">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Billing Period / Rent Cadence <span className="text-slate-400 font-normal">(e.g. monthly rent)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={priceUnit}
                          onChange={(e) => setPriceUnit(e.target.value)}
                          placeholder={isTurfCategory ? "/ hour" : "e.g. monthly rent (all inclusive) or / night"}
                          list="price-unit-suggestions"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                        />
                        <datalist id="price-unit-suggestions">
                          <option value="monthly rent (all inclusive)" />
                          <option value="/ month" />
                          <option value="/ night" />
                          <option value="/ hour" />
                          <option value="/ day" />
                          <option value="/ slot" />
                          <option value="/ person / month" />
                        </datalist>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Subtitle shown below price (e.g. &apos;monthly rent (all inclusive)&apos;).
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Refundable Security Deposit (₹) <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">₹</span>
                        <input
                          type="number"
                          value={securityDeposit}
                          onChange={(e) => setSecurityDeposit(e.target.value)}
                          placeholder="e.g. 3000"
                          min="0"
                          className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Shown as &apos;Refundable Deposit: ₹X,XXX&apos; on listing card.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              )}

                  {/* Promo Banner Tagline Field */}
                  <div className="md:col-span-2 pt-2 border-t border-slate-200 dark:border-white/10">
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      {isTurfCategory ? 'Arena / Pitch Banner Tagline' : 'Promotional Getaway Banner Tagline'} <span className="text-slate-400 font-normal">(Shown on bottom card)</span>
                    </label>
                    <input
                      type="text"
                      value={bannerTagline}
                      onChange={(e) => setBannerTagline(e.target.value)}
                      placeholder={
                        isTurfCategory 
                          ? "e.g. Premier FIFA 7v7 Astro Arena, Floodlit Night Tournament Pitch" 
                          : isHotel
                          ? "e.g. Comfortable City Centre Stay, Peaceful Business & Leisure Getaway"
                          : isCamping
                          ? "e.g. Camp Under the Stars, Serene Riverfront Wilderness Camp"
                          : "e.g. Your Perfect Getaway Awaits, Serene Waterfront Escape, Luxury Weekend Treat"
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#ff6325]"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      {isTurfCategory 
                        ? "Custom promotional caption overlaid onto the turf card's showcase banner." 
                        : "Custom caption overlaid onto the room card's atmospheric getaway banner."}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Tax & Billing Settlement
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 transition-colors">
                      <input
                        type="checkbox"
                        checked={gstEnabled}
                        onChange={(e) => setGstEnabled(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-[#ff6325] accent-[#ff6325] cursor-pointer"
                      />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                        Apply GST
                      </span>
                    </label>
                  </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#162033] border border-slate-200 dark:border-white/10 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-black text-xs text-slate-900 dark:text-white block">
                        {gstEnabled ? `GST Tax Invoice (${gstPercentage}%)` : 'Nett Direct Pricing'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                        {gstEnabled 
                          ? `${gstPercentage / 2}% SGST + ${gstPercentage / 2}% CGST itemized breakdown` 
                          : 'Zero extra tax surcharge added to customer'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-[#ff6325] text-base block">
                        ₹{gstEnabled 
                          ? Math.round(Number(basePrice || 0) * (1 + gstPercentage / 100)).toLocaleString() 
                          : Number(basePrice || 0).toLocaleString()}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        {gstEnabled ? `Total Incl. ${gstPercentage}% GST` : 'Nett Payable'}
                      </span>
                    </div>
                  </div>

                  {gstEnabled && (
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                          GST Tax Slab
                        </label>
                        <select
                          value={gstPercentage}
                          onChange={(e) => setGstPercentage(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                        >
                          <option value={18}>18% GST (Standard Hospitality & Commercial)</option>
                          <option value={12}>12% GST (Budget Rooms & Stays under ₹7,500)</option>
                          <option value={5}>5% GST (Special Exemption & Standalone Dining)</option>
                          <option value={28}>28% GST (Luxury Suites / Amusement / Events)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">
                          Business GSTIN <span className="text-red-500 font-black">* Required</span>
                        </label>
                        <input
                          type="text"
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                          placeholder="e.g. 33AAAAA0000A1Z5"
                          maxLength={15}
                          required={gstEnabled}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1624] text-xs font-bold text-slate-900 dark:text-white outline-none uppercase placeholder-slate-400 focus:border-[#ff6325]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {gstEnabled 
                    ? `Itemized SGST (${gstPercentage / 2}%) + CGST (${gstPercentage / 2}%) will be shown to the customer on checkout.` 
                    : 'Customer pays exactly the base tariff without tax surcharge.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Photos & Media */}
          <div className="bg-white dark:bg-[#0f1624] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-600" />
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15" />
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    2. Photos & Media
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Step 2 of 4</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                {/* 1. Dedicated Primary Cover Image Dropzone */}
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between h-6">
                    <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Primary Cover Photo</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ff6325]/10 text-[#ff6325] font-black">Main Card</span>
                    </label>
                  </div>

                  <div
                    onClick={() => document.getElementById('cover-image-upload')?.click()}
                    className="h-44 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-[#ff6325] bg-slate-50/70 dark:bg-[#162033] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group shadow-inner"
                  >
                    {imageUrl ? (
                      <>
                        <img src={imageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold backdrop-blur-xs">
                          Change Cover Photo
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 text-[#ff6325] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                          <ImageIcon size={20} />
                        </div>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">Upload Main Cover</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">Visible first on search & card headers</span>
                      </div>
                    )}
                  </div>

                  <input
                    id="cover-image-upload"
                    type="file"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const compressed = await compressImage(file, 1200, 800, 0.88);
                          setImageUrl(compressed);
                          if (!galleryImages.includes(compressed)) {
                            setGalleryImages(prev => [compressed, ...prev]);
                          }
                        } catch (err) {
                          console.error('Image compression error', err);
                        }
                      }
                    }}
                    accept="image/*"
                  />

                  <div className="h-10 flex items-center">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setImageUrl(val);
                        if (val.trim() && !galleryImages.includes(val.trim())) {
                          setGalleryImages(prev => [val.trim(), ...prev]);
                        }
                      }}
                      placeholder="Or paste Direct Cover URL..."
                      className="w-full h-full px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs focus:border-[#ff6325] outline-none"
                    />
                  </div>
                </div>

                {/* 2. Dedicated Folder / Bulk Gallery Dropzone */}
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between h-6">
                    <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      {isTurfCategory ? 'Pitch & Arena Action Photos' : 'Room & Facility Gallery Photos'}
                    </label>
                    <span className="text-[11px] font-bold text-slate-400">
                      {galleryImages.length} uploaded
                    </span>
                  </div>

                  {/* Bulk / Folder Dropzone */}
                  <div
                    onClick={() => document.getElementById('gallery-bulk-upload')?.click()}
                    className="h-44 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-[#ff6325] bg-slate-50/70 dark:bg-[#162033] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group shadow-inner"
                  >
                    <div className="text-center p-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 text-amber-500 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                        📁
                      </div>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                        Upload Folder or Select Multiple Photos
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {isTurfCategory
                          ? 'Select photos of Pitch Grass, Goal Posts, Floodlights, Dugout'
                          : 'Select multiple files together (Bedroom, Jacuzzi, Balcony, Sunset View)'}
                      </span>
                    </div>
                  </div>

                  <input
                    id="gallery-bulk-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        try {
                          const newCompressed: string[] = [];
                          for (let i = 0; i < files.length; i++) {
                            const compressed = await compressImage(files[i], 1200, 800, 0.85);
                            newCompressed.push(compressed);
                          }
                          if (!imageUrl && newCompressed.length > 0) {
                            setImageUrl(newCompressed[0]);
                          }
                          setGalleryImages(prev => Array.from(new Set([...prev, ...newCompressed])));
                        } catch (err) {
                          console.error('Gallery bulk error', err);
                        }
                      }
                    }}
                    accept="image/*"
                  />

                  {/* Direct URL input for quick web image add - auto adds on paste or enter */}
                  <div className="h-10 flex items-center">
                    <input
                      type="url"
                      value={newGalleryInput}
                      onChange={(e) => setNewGalleryInput(e.target.value)}
                      onPaste={(e) => {
                        const pasted = e.clipboardData.getData('text')?.trim();
                        if (pasted) {
                          e.preventDefault();
                          if (!galleryImages.includes(pasted)) {
                            setGalleryImages(prev => [...prev, pasted]);
                          }
                          if (!imageUrl) setImageUrl(pasted);
                          setNewGalleryInput('');
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newGalleryInput.trim()) {
                            const trimmed = newGalleryInput.trim();
                            if (!galleryImages.includes(trimmed)) {
                              setGalleryImages(prev => [...prev, trimmed]);
                            }
                            if (!imageUrl) setImageUrl(trimmed);
                            setNewGalleryInput('');
                          }
                        }
                      }}
                      onBlur={() => {
                        if (newGalleryInput.trim()) {
                          const trimmed = newGalleryInput.trim();
                          if (!galleryImages.includes(trimmed)) {
                            setGalleryImages(prev => [...prev, trimmed]);
                          }
                          if (!imageUrl) setImageUrl(trimmed);
                          setNewGalleryInput('');
                        }
                      }}
                      placeholder="Or paste photo web link here..."
                      className="w-full h-full px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs focus:border-[#ff6325] outline-none"
                    />
                  </div>
                </div>

                {/* Multi-Photo Gallery Preview Thumbnails - Full width across both columns */}
                {galleryImages.length > 0 && (
                  <div className="col-span-1 md:col-span-2 pt-2 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        Unit Gallery ({galleryImages.length} {galleryImages.length === 1 ? 'Photo' : 'Photos'})
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Click image to set as Primary Cover
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2.5 max-h-40 overflow-y-auto custom-scrollbar p-1">
                      {galleryImages.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setImageUrl(img)}
                          className={`h-16 w-20 rounded-xl relative overflow-hidden group cursor-pointer border-2 transition-all ${img === imageUrl ? 'border-[#ff6325] ring-2 ring-[#ff6325]/30' : 'border-slate-200 dark:border-white/10 hover:border-slate-400'
                            }`}
                        >
                          <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          {img === imageUrl && (
                            <span className="absolute top-1 left-1 bg-[#ff6325] text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = galleryImages.filter((_, i) => i !== idx);
                              setGalleryImages(updated);
                              if (img === imageUrl) {
                                setImageUrl(updated[0] || '');
                              }
                            }}
                            className="absolute top-1 right-1 h-4 w-4 bg-black/70 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete photo"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Highlights & Add-ons */}
          <div className="bg-white dark:bg-[#0f1624] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-500/15" />
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    3. Description & Inclusions
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Step 3 of 4</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                  {isTurfCategory ? 'Pitch Highlights & Ground Rules' : 'Unit Highlights & Layout'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    isTurfCategory
                      ? "e.g. FIFA certified 50mm monofilament turf, high-intensity LED floodlights, professional dugout, complimentary match bibs and ball, shower facilities..."
                      : isHotel
                        ? "e.g. Well-ventilated modern room featuring comfortable bedding, clean attached washroom with 24/7 hot water, work desk, high-speed WiFi, and daily housekeeping..."
                        : isCamping
                          ? "e.g. Weatherproof pitched dome tent with foam sleeping mats, clean sleeping bags, campfire setup, shared washrooms, and starry night outdoor BBQ..."
                          : "e.g. Spacious beachfront villa featuring private plunge pool, king-size bed, sunset sea views, complimentary breakfast, and signature bath amenities..."
                  }
                  rows={3}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs focus:border-[#ff6325] focus:bg-white dark:focus:bg-[#131d2e] outline-none transition-all shadow-xs"
                />
              </div>

              {/* Complimentary / Included Gear or Inclusions (Hotels, Turfs & Camps only - PG handles this cleanly in Step 4) */}
              {!isPgOrHostel && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                    {isTurfCategory
                      ? '⚽ Complimentary / Included Playing Gear'
                      : isHotel
                        ? '🎁 Complimentary Welcome Pack & Free Inclusions'
                        : 'Included Amenities / Welcome Gear'}
                  </label>
                  <input
                    type="text"
                    value={equipmentAddons}
                    onChange={(e) => setEquipmentAddons(e.target.value)}
                    placeholder={
                      isTurfCategory
                        ? "e.g. 2 Match Balls (Size 5), 14 Team Bibs (Neon Green & Orange), Goalkeeper Gloves"
                        : isHotel
                          ? "e.g. RO Drinking Water, High-Speed WiFi, Clean Towels & Bath Soap, Electric Kettle"
                          : isCamping
                            ? "e.g. Sleeping Bags, Flashlight & Lanterns, Campfire Wood, Mineral Water"
                            : "e.g. Welcome Drinks, High-Speed WiFi, Beach Towels, Snorkeling Kit"
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs focus:border-[#ff6325] outline-none transition-all shadow-xs"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Items you provide for free with this booking (displayed in the green banner on the customer page).
                  </span>
                </div>
              )}

              <div className="pt-2">
                <div className="flex items-center justify-between mb-3 bg-slate-50 dark:bg-white/[0.03] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider block">
                      {isTurfCategory ? 'Optional Turf Add-ons' : 'Optional Unit Add-ons'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isTurfCategory
                        ? 'Match Referee, Mineral Water Dispenser, Extra Match Ball, Video Recording'
                        : isHotel
                          ? 'Homely 3 Meals (Breakfast/Lunch/Dinner), Extra Pillow & Blanket, Covered Parking'
                          : isCamping
                            ? 'BBQ Grill Kit, Extra Sleeping Bag, Guided Night Trek, Bonfire Wood'
                            : 'Homely Meals (Mess), Extra Bed, BBQ Setup, Candlelight Dinner, Airport Pickup'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddons(prev => [...prev, { name: '', price: 0 }])}
                    className="px-4 py-2 rounded-xl bg-[#ff6325] hover:bg-[#e04e13] text-white font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-[#ff6325]/25 active:scale-95"
                  >
                    <Plus size={15} /> Add Add-on
                  </button>
                </div>

                {addons.length > 0 ? (
                  <div className="space-y-3">
                    {addons.map((addon, idx) => {
                      const stockType = addon.stockType || 'REUSABLE';
                      const maxStock = addon.maxStock ?? 5;
                      const currentStock = addon.currentStock ?? maxStock;

                      return (
                        <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033]/60 space-y-3">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="text"
                              placeholder={
                                isTurfCategory
                                  ? "Add-on item (e.g. Match Referee / Video Recording / Energy Drinks)"
                                  : archetype === 'APPOINTMENT'
                                    ? "Add-on service (e.g. Blood Sugar Test / ECG / Diet Plan)"
                                    : "Add-on item (e.g. Extra Bed / Candlelight Dinner / Airport Pickup)"
                              }
                              value={addon.name}
                              onChange={(e) => {
                                const next = [...addons];
                                next[idx].name = e.target.value;
                                setAddons(next);
                              }}
                              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111927] text-xs font-semibold outline-none text-slate-900 dark:text-white shadow-2xs"
                            />
                            <div className="relative w-28">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                              <input
                                type="number"
                                placeholder="Price"
                                value={addon.price || ''}
                                onChange={(e) => {
                                  const next = [...addons];
                                  next[idx].price = Number(e.target.value);
                                  setAddons(next);
                                }}
                                className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111927] text-xs font-black outline-none text-slate-900 dark:text-white shadow-2xs"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setAddons(prev => prev.filter((_, i) => i !== idx))}
                              className="h-9 w-9 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                              title="Remove Add-on"
                            >
                              <X size={15} />
                            </button>
                          </div>

                          {/* Inventory Control & Refill Engine */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60 dark:border-white/5 text-[11px]">
                            {/* Stock Type Selector */}
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                                Stock Mode:
                              </span>
                              <div className="inline-flex rounded-xl p-0.5 bg-slate-200/70 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...addons];
                                    next[idx].stockType = 'REUSABLE';
                                    setAddons(next);
                                  }}
                                  className={`px-2.5 py-1 rounded-lg font-extrabold text-[10px] transition-all ${
                                    stockType === 'REUSABLE'
                                      ? 'bg-white dark:bg-[#0f1624] text-blue-600 dark:text-blue-400 shadow-2xs'
                                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                  }`}
                                  title="Auto-refills when slot/day finishes (Extra Bed, Sports Kit, Helmet)"
                                >
                                  🔄 Reusable (Slot Lock)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...addons];
                                    next[idx].stockType = 'CONSUMABLE';
                                    setAddons(next);
                                  }}
                                  className={`px-2.5 py-1 rounded-lg font-extrabold text-[10px] transition-all ${
                                    stockType === 'CONSUMABLE'
                                      ? 'bg-white dark:bg-[#0f1624] text-amber-600 dark:text-amber-400 shadow-2xs'
                                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                  }`}
                                  title="Physical stock consumed per order (Carton, Toiletries, Firewood)"
                                >
                                  📦 Consumable (Stock)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...addons];
                                    next[idx].stockType = 'UNLIMITED';
                                    setAddons(next);
                                  }}
                                  className={`px-2.5 py-1 rounded-lg font-extrabold text-[10px] transition-all ${
                                    stockType === 'UNLIMITED'
                                      ? 'bg-white dark:bg-[#0f1624] text-emerald-600 dark:text-emerald-400 shadow-2xs'
                                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                  }`}
                                  title="No inventory limit"
                                >
                                  ♾️ Unlimited
                                </button>
                              </div>
                            </div>

                            {/* Stock Limits & Refill Controls */}
                            {stockType !== 'UNLIMITED' && (
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 bg-white dark:bg-[#111927] px-2.5 py-1 rounded-xl border border-slate-200 dark:border-white/10">
                                  <span className="text-slate-400 font-bold">Max Limit:</span>
                                  <input
                                    type="number"
                                    min="1"
                                    max="999"
                                    value={maxStock}
                                    onChange={(e) => {
                                      const next = [...addons];
                                      const val = Math.max(1, Number(e.target.value) || 1);
                                      next[idx].maxStock = val;
                                      if ((next[idx].currentStock ?? val) > val) next[idx].currentStock = val;
                                      setAddons(next);
                                    }}
                                    className="w-12 text-center font-black text-slate-900 dark:text-white outline-none"
                                  />
                                  <span className="text-slate-400 text-[10px]">units</span>
                                </div>

                                {stockType === 'CONSUMABLE' && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-amber-700 dark:text-amber-400">
                                      Remaining: <strong className="font-black">{currentStock}</strong>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = [...addons];
                                        next[idx].currentStock = maxStock;
                                        setAddons(next);
                                      }}
                                      className="px-2 py-0.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white font-extrabold text-[10px] transition-all cursor-pointer border border-emerald-500/20"
                                      title="Refill stock to max limit"
                                    >
                                      ⚡ Refill Stock
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No add-ons added yet. Click &quot;Add Add-on&quot; to configure optional upsells.</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Category Details Dynamic Grid */}
          <div className="bg-white dark:bg-[#0f1624] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-600" />
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full bg-purple-500 ring-4 ring-purple-500/15" />
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    4. <span className="capitalize">{categoryDisplayName}</span> Specifications & Setup
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Step 4 of 4</span>
              </div>

              <DynamicForm
                archetype={archetype}
                categoryName={category?.name || ''}
                merchantCategory={currentMerchant?.category || ''}
                initialData={metadata}
                inlineMode={true}
                onChange={(data) => {
                  setMetadata(data);
                }}
                onSubmit={(data) => {
                  setMetadata(data);
                }}
              />
            </div>
          </div>

          {/* Bottom Action Bar (Normal flow - never overlaps content) */}
          <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0f1624] border border-slate-200/90 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#ff6325]/10 text-[#ff6325] flex items-center justify-center font-black text-sm shrink-0">
                ✓
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 dark:text-white block">
                  {serviceName.trim() ? serviceName : 'Ready to save bookable unit'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {basePrice ? `₹${Number(basePrice).toLocaleString()} per unit` : 'Set your base tariff to publish'} • {gstEnabled ? `GST Registered (${gstPercentage}%)` : 'Direct Nett'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => router.push(`/workspace/my-services/${serviceId}`)}
                className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveDetails}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-[#ff6325]/20 active:scale-95 cursor-pointer"
              >
                <Save size={16} /> {isCreating ? 'Save & Publish Unit' : 'Save Changes'}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Live Customer View Mockup (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">

          {/* Card: Customer Card Real-Time Preview */}
          <div className="bg-white dark:bg-[#0f1624] rounded-3xl border border-slate-200/90 dark:border-white/10 shadow-lg overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-white">
                  Live Customer Preview
                </span>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Active Simulator
              </span>
            </div>

            {/* Exact Agoda-style Live Customer Booking Card Preview */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#162033] shadow-md p-4 space-y-4">

              {/* Photo with Units Badge & Image Pill */}
              <div
                className="h-44 w-full relative rounded-xl overflow-hidden bg-cover bg-center bg-slate-800"
                style={{
                  backgroundImage: `url("${imageUrl || (galleryImages.length > 0 ? galleryImages[0] : (isTurfCategory ? 'https://images.unsplash.com/photo-1574629810360-7efbb49fec90?w=800&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'))}"), linear-gradient(135deg, ${isTurfCategory ? '#0d381e, #1a5632' : '#1e293b, #0f172a'})`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                <div className="absolute top-2.5 left-2.5 bg-[#033266]/90 dark:bg-[#ff6325]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black text-white flex items-center gap-1 shadow-md z-10">
                  <Users size={11} />
                  <span>
                    {metadata.totalUnits
                      ? `${metadata.totalUnits} ${isTurfCategory ? (Number(metadata.totalUnits) > 1 ? 'PITCHES OPEN' : 'PITCH AVAILABLE') : 'UNITS LEFT'}`
                      : (isTurfCategory ? 'PITCH AVAILABLE' : '3 UNITS LEFT')}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[10px] font-bold z-10">
                  📷 See Photos ({galleryImages.length || 1})
                </div>
              </div>

              {/* Title & Review */}
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white leading-tight">
                  {serviceName.trim() ? serviceName : `${categoryDisplayName} (Unit Title)`}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-600 text-white font-black text-[10px]">
                    ★ 4.8
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    (120 Reviews)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {description.trim()
                    ? description
                    : (isTurfCategory
                      ? 'FIFA certified astro turf with high-mast floodlights, dugout seating, and match ball gear.'
                      : 'Spacious modern unit featuring premium bedding, clean washroom, and essential hospitality amenities.')}
                </p>
              </div>

              {/* Inclusions pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800/50">
                <CheckCircle2 size={11} />
                <span>Instant Confirmation • {isTurfCategory ? 'Free Equipment' : 'Free Cancellation'}</span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                {isTurfCategory ? (
                  <>
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-[#033266] dark:text-[#ff6325] shrink-0" />
                      <span>{metadata.turfSize || '7-a-side Pitch'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⚡</span>
                      <span className="truncate">{metadata.floodlightsSurcharge ? 'Night Floodlit' : 'Day & Night Play'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🌱</span>
                      <span>{metadata.surfaceType || 'FIFA 50mm Astro'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⚽</span>
                      <span>Bibs & Ball Inc.</span>
                    </div>
                  </>
                ) : archetype === 'APPOINTMENT' ? (
                  <>
                    <div className="flex items-center gap-1">
                      <span>🩺</span>
                      <span className="truncate">{metadata.doctorName || metadata.speciality || 'Specialist Consult'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{metadata.consultationDuration || 20} Mins Slot</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🏥</span>
                      <span>{metadata.opdRoomNumber || 'Consultation Cabin'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🎟️</span>
                      <span>Verified Token</span>
                    </div>
                  </>
                ) : archetype === 'DINING' ? (
                  <>
                    <div className="flex items-center gap-1">
                      <span>🍽️</span>
                      <span>Cost for Two: ₹{metadata.costForTwo || 1200}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🍷</span>
                      <span>Table Reservation</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>✨</span>
                      <span>AC & Outdoor</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⚡</span>
                      <span>Instant Booking</span>
                    </div>
                  </>
                ) : archetype === 'ASSET_RENTAL' ? (
                  <>
                    <div className="flex items-center gap-1">
                      <span>🚗</span>
                      <span className="truncate">{metadata.assetModel || 'Vehicle Rental'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🛣️</span>
                      <span>{metadata.freeKmPerDay || '250 km / Day'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🛡️</span>
                      <span>Deposit: ₹{metadata.securityDeposit || 2000}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📄</span>
                      <span>Original DL Req.</span>
                    </div>
                  </>
                ) : archetype === 'PASS_ENTRY' || archetype === 'EVENT' ? (
                  <>
                    <div className="flex items-center gap-1">
                      <span>🎟️</span>
                      <span className="truncate">{metadata.passTitle || 'Entry Ticket / Pass'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📍</span>
                      <span className="truncate">{metadata.originDeparturePoint || 'Main Venue Gate'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🕒</span>
                      <span>{metadata.scheduleTimings || 'Event Schedule'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📱</span>
                      <span>Digital QR Pass</span>
                    </div>
                  </>
                ) : archetype === 'HOME_CALL' ? (
                  <>
                    <div className="flex items-center gap-1">
                      <span>🔧</span>
                      <span className="truncate">{metadata.serviceTitle || 'Doorstep Service'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{metadata.serviceDuration || '60 Mins'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🛡️</span>
                      <span>30 Days Warranty</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>✅</span>
                      <span>Verified Pro</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-[#033266] dark:text-[#ff6325] shrink-0" />
                      <span>Max {metadata.maxGuests || 4} Adults</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bed size={12} className="text-[#033266] dark:text-[#ff6325] shrink-0" />
                      <span className="truncate">{metadata.bedType || 'King Bed'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📐</span>
                      <span>{metadata.sizeSqFt || 450} sq.ft</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🚿</span>
                      <span>Ensuite Bath</span>
                    </div>
                  </>
                )}
              </div>

              {/* Deal Pricing & CTA matching Consumer UI */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    {originalPrice && Number(originalPrice) > Number(basePrice || 0) && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400 line-through">
                          ₹{Number(originalPrice).toLocaleString()}
                        </span>
                        {discountPercentage && Number(discountPercentage) > 0 && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[10px] font-black border border-rose-200 dark:border-rose-900/40">
                            -{discountPercentage}%
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl font-black text-[#033266] dark:text-[#ff6325]">
                        ₹{basePrice ? Number(basePrice).toLocaleString() : '0'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isPgOrHostel ? (priceUnit || 'monthly rent (all inclusive)') : isTurfCategory ? '/ hour' : archetype === 'ACCOMMODATION' ? (priceUnit || '/ night') : archetype === 'ASSET_RENTAL' ? '/ day' : archetype === 'APPOINTMENT' ? '/ consult' : '/ person'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#f4511e] text-white text-[11px] font-black uppercase tracking-wider shadow-sm opacity-90 cursor-default"
                  >
                    {isPgOrHostel ? 'SELECT BED & BOOK →' : isTurfCategory ? 'BOOK SLOT →' : archetype === 'ACCOMMODATION' ? 'BOOK ROOM →' : archetype === 'APPOINTMENT' ? 'BOOK APPOINTMENT →' : archetype === 'DINING' ? 'RESERVE TABLE →' : archetype === 'ASSET_RENTAL' ? 'RENT NOW →' : 'BOOK NOW →'}
                  </button>
                </div>

                {offerBadge && (
                  <div className="pt-1.5 border-t border-slate-200 dark:border-white/10 flex items-center gap-1 text-[10px] font-bold text-[#033266] dark:text-[#ff6325]">
                    <span>⚡</span>
                    <span className="truncate">{offerBadge}</span>
                  </div>
                )}
              </div>

              {/* Getaway / Turf Showcase Banner Preview */}
              <div
                className="h-24 rounded-xl overflow-hidden relative shadow-inner border border-slate-200 dark:border-white/10 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${imageUrl || (galleryImages.length > 0 ? galleryImages[0] : (isTurfCategory ? 'https://images.unsplash.com/photo-1574629810360-7efbb49fec90?w=800&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'))}"), linear-gradient(135deg, ${isTurfCategory ? '#0d381e, #1a5632' : '#1e293b, #0f172a'})`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end p-2.5">
                  <span className="font-serif italic text-white text-xs font-bold drop-shadow-md">
                    {bannerTagline.trim() ? bannerTagline : (isTurfCategory ? 'Premier FIFA Astro Turf Arena' : 'Your Perfect Getaway Awaits')}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/15 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <CheckCircle2 size={13} className="text-amber-600" /> BOKSPOT Verified Guarantee
              </span>
              <p className="text-[10px] text-amber-700/80 dark:text-amber-300/80 leading-normal">
                Units with high-resolution photos and detailed bed & washroom specs receive 3.4x higher bookings.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill Bar */}
          <div className="bg-white dark:bg-[#0f1624] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm p-4 space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Unit Configuration Status
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Inventory Units:</span>
                <span className="font-black text-slate-900 dark:text-white">{metadata.totalUnits || 1} available</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Configured Add-ons:</span>
                <span className="font-black text-[#ff6325]">{addons.length} items</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>Tax Compliance:</span>
                <span className={`font-bold ${gstEnabled ? 'text-emerald-500' : 'text-slate-500'}`}>
                  {gstEnabled ? `GST Registered (${gstPercentage}%)` : 'Direct Nett (Tax-Exempt)'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
