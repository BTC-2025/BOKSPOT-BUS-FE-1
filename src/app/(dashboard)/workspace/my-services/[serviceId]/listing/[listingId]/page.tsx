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
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [addons, setAddons] = useState<{name: string, price: number}[]>([]);
  
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
          setDescription(list.description || '');
          setBasePrice(list.price !== undefined && list.price !== null ? list.price.toString() : '');
          setMetadata(list.metadata || {});
          setAddons(list.metadata?.addons || []);
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

  const archetype: Archetype = 
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
      imageUrl: imageUrl.trim() || undefined,
      description: description.trim() || undefined,
      active: true,
      price: parseFloat(basePrice) || 0,
      duration: 30, // Default duration
      metadata: { 
        ...metadata, 
        addons, 
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
            <ArrowLeft size={13} /> Back to {category.category || category.name}
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{isCreating ? 'Add Bookable Unit' : 'Edit Unit Details'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ff6325]/10 text-[#ff6325] font-black uppercase tracking-wider">
              {category.category || category.name}
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
                    Unit / Listing Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder={
                      category?.name?.toLowerCase().includes('resort') || category?.category?.toLowerCase().includes('resort') || category?.name?.toLowerCase().includes('villa')
                        ? "e.g. 3BHK Private Pool Villa, Sunset Hill View Cottage, Deluxe Suite"
                        : "e.g. Deluxe Room 101, Executive Suite, Pitch A"
                    }
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#162033] text-slate-900 dark:text-white font-semibold text-sm focus:border-[#ff6325] focus:bg-white dark:focus:bg-[#131d2e] outline-none transition-all shadow-xs"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {archetype === 'RENTAL' ? 'Hourly Slot Price (₹)' : archetype === 'ACCOMMODATION' ? 'Tariff Per Night (₹)' : 'Price / Fee (₹)'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">₹</span>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      placeholder="e.g. 15000"
                      min="0"
                      className="w-full pl-9 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#162033] text-slate-900 dark:text-white font-black text-sm focus:border-[#ff6325] focus:bg-white dark:focus:bg-[#131d2e] outline-none transition-all shadow-xs"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Base tariff visible to customers on booking card.
                  </p>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                <div 
                  onClick={() => document.getElementById('listing-image-upload')?.click()}
                  className="h-44 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/15 hover:border-[#ff6325] bg-slate-50/80 dark:bg-[#162033] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group shadow-inner"
                >
                  {imageUrl ? (
                    <>
                      <img src={imageUrl} alt="Unit Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold backdrop-blur-xs">
                        Change Photo
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-3">
                      <ImageIcon size={28} className="mx-auto text-slate-400 mb-2 group-hover:text-[#ff6325] transition-colors" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Upload Unit Photo</span>
                      <span className="text-[10px] text-slate-400">JPG, PNG, WebP</span>
                    </div>
                  )}
                </div>

                <input 
                  id="listing-image-upload"
                  type="file" 
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const compressed = await compressImage(file, 800, 600, 0.85);
                        setImageUrl(compressed);
                      } catch (err) {
                        console.error('Image compression error', err);
                      }
                    }
                  }}
                  accept="image/*"
                />

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Or Direct Image Web URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs focus:border-[#ff6325] focus:bg-white dark:focus:bg-[#131d2e] outline-none transition-all shadow-xs"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Paste high-resolution photo link or select from local gallery.
                  </p>
                </div>
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
                  Unit Highlights & Layout
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Spacious beachfront villa featuring private plunge pool, king-size bed, sunset sea views, complimentary breakfast, and signature bath amenities..."
                  rows={3}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs focus:border-[#ff6325] focus:bg-white dark:focus:bg-[#131d2e] outline-none transition-all shadow-xs"
                />
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-3 bg-slate-50 dark:bg-white/[0.03] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider block">
                      Optional Unit Add-ons
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Extra Bed, BBQ Setup, Candlelight Dinner, Floodlights
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
                        placeholder="Add-on item (e.g. Extra Bed / Candlelight Dinner)"
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
                    4. {category.name} Specifications & Setup
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

            {/* Simulated Customer Room Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#162033] shadow-md group transition-all hover:shadow-xl">
              <div className="h-48 w-full relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img 
                  src={imageUrl || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=75'} 
                  alt="Unit Cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/65 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-bold text-white flex items-center gap-1.5 shadow-md">
                  <Bed size={13} className="text-[#ff6325]" />
                  <span>{metadata.bedType || '1 King Bed'}</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-gradient-to-r from-[#0a3161] to-[#142642] text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-xl border border-white/10">
                  ₹{gstEnabled 
                    ? Math.round(Number(basePrice || 0) * (1 + gstPercentage / 100)).toLocaleString() 
                    : (basePrice ? Number(basePrice).toLocaleString() : '0')} 
                  <span className="text-[10px] font-normal opacity-80">{gstEnabled ? ` (${gstPercentage}% GST)` : ' / night'}</span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white leading-tight">
                    {serviceName.trim() ? serviceName : `${category.name} (Unit Title)`}
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                    {description.trim() ? description : 'Spacious modern unit featuring premium bedding, clean washroom, and essential hospitality amenities.'}
                  </p>
                </div>

                {/* Badges preview */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                    📐 {metadata.sizeSqFt || 450} sq.ft
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                    👥 Max {metadata.maxGuests || 4} Guests
                  </span>
                  {metadata.viewType && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      🌅 {metadata.viewType}
                    </span>
                  )}
                </div>

                {/* Timing bar */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#0f1624] border border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock size={12} className="text-[#ff6325]" /> Check-in: <strong>{metadata.checkInTime || '12:00 PM'}</strong>
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock size={12} className="text-amber-500" /> Check-out: <strong>{metadata.checkOutTime || '11:00 AM'}</strong>
                  </span>
                </div>

                <button 
                  type="button" 
                  disabled 
                  className="w-full py-2.5 rounded-xl bg-[#ff6325] text-white text-xs font-bold text-center shadow-md shadow-[#ff6325]/20 opacity-90 cursor-default"
                >
                  Select & Reserve Unit
                </button>
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
