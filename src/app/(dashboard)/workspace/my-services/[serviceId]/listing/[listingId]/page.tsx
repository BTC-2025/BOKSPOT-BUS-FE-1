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
  const [addons, setAddons] = useState<{name: string, price: number}[]>([]);
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

  const archetype: Archetype = 
    isTurfCategory ? 'RENTAL' :
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
                        : "e.g. 3BHK Private Pool Villa, Sunset Hill View Cottage, Deluxe Suite"
                    }
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#162033] text-slate-900 dark:text-white font-semibold text-sm focus:border-[#ff6325] focus:bg-white dark:focus:bg-[#131d2e] outline-none transition-all shadow-xs"
                    required
                  />
                </div>

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
                <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200 dark:border-white/10 space-y-3">
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
                        <span className="text-xs text-slate-400 font-bold">{isTurfCategory ? '/ hour' : '/ night'}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        {discountPercentage && Number(discountPercentage) > 0
                          ? `Customer saves ₹${(Number(originalPrice) - Number(basePrice)).toLocaleString()} (${discountPercentage}% OFF)`
                          : 'Full price tariff without discount.'}
                      </span>
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

                  {/* Promo Banner Tagline Field */}
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10">
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
                          className={`h-16 w-20 rounded-xl relative overflow-hidden group cursor-pointer border-2 transition-all ${
                            img === imageUrl ? 'border-[#ff6325] ring-2 ring-[#ff6325]/30' : 'border-slate-200 dark:border-white/10 hover:border-slate-400'
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
                      : "e.g. Spacious beachfront villa featuring private plunge pool, king-size bed, sunset sea views, complimentary breakfast, and signature bath amenities..."
                  }
                  rows={3}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs focus:border-[#ff6325] focus:bg-white dark:focus:bg-[#131d2e] outline-none transition-all shadow-xs"
                />
              </div>

              {/* Complimentary / Included Gear or Inclusions */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                  {isTurfCategory ? '⚽ Complimentary / Included Playing Gear' : 'Included Amenities / Welcome Gear'}
                </label>
                <input
                  type="text"
                  value={equipmentAddons}
                  onChange={(e) => setEquipmentAddons(e.target.value)}
                  placeholder={
                    isTurfCategory
                      ? "e.g. 2 Match Balls (Size 5), 14 Team Bibs (Neon Green & Orange), Goalkeeper Gloves"
                      : "e.g. Welcome Drinks, High-Speed WiFi, Beach Towels, Snorkeling Kit"
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs focus:border-[#ff6325] outline-none transition-all shadow-xs"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Items you provide for free with this booking (displayed in the green banner on the customer page).
                </span>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-3 bg-slate-50 dark:bg-white/[0.03] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider block">
                      {isTurfCategory ? 'Optional Turf Add-ons' : 'Optional Unit Add-ons'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isTurfCategory ? 'Match Referee, Mineral Water Dispenser, Extra Match Ball, Video Recording' : 'Extra Bed, BBQ Setup, Candlelight Dinner, Airport Pickup'}
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
                <div className="space-y-2.5">
                  {addons.map((addon, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
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
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-xs font-medium outline-none text-slate-900 dark:text-white"
                      />
                      <div className="relative w-32">
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
                          className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-xs font-bold outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setAddons(prev => prev.filter((_, i) => i !== idx))}
                        className="h-9 w-9 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
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
                        {isTurfCategory ? '/ hour' : archetype === 'ACCOMMODATION' ? '/ night' : archetype === 'ASSET_RENTAL' ? '/ day' : archetype === 'APPOINTMENT' ? '/ consult' : '/ person'}
                      </span>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    disabled 
                    className="px-4 py-2 rounded-xl bg-[#033266] dark:bg-[#ff6325] text-white text-[11px] font-black uppercase tracking-wider shadow-sm opacity-90 cursor-default"
                  >
                    {isTurfCategory ? 'BOOK SLOT →' : archetype === 'ACCOMMODATION' ? 'BOOK ROOM →' : archetype === 'APPOINTMENT' ? 'BOOK APPOINTMENT →' : archetype === 'DINING' ? 'RESERVE TABLE →' : archetype === 'ASSET_RENTAL' ? 'RENT NOW →' : 'BOOK NOW →'}
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
