'use client';

import { useVendorStore, CatalogListing } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Package, AlertTriangle, Tag, Users, CheckSquare, Info, X, Save, Bed, Image as ImageIcon, Activity, Heart, Car, Ticket, Briefcase, Zap, CheckCircle2, Plus } from 'lucide-react';
import DynamicForm from '@/components/DynamicForm';
import { CATEGORY_TO_ARCHETYPE_MAP, Archetype } from '@/lib/archetypes';
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
  const [basePrice, setBasePrice] = useState('0');
  const [addons, setAddons] = useState<{name: string, price: number}[]>([]);
  
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
          setBasePrice(list.price?.toString() || '0');
          setMetadata(list.metadata || {});
          setAddons(list.metadata?.addons || []);
        }
      }
    }
  }, [services, serviceId, listingId, isCreating, currentMerchant]);

  if (!mounted || !currentMerchant) return null;

  const category = services.find(s => s.id === serviceId);
  if (!category) return null;

  const catSlug = category?.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const merchantSlug = currentMerchant?.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const archetype: Archetype = CATEGORY_TO_ARCHETYPE_MAP[catSlug || ''] || CATEGORY_TO_ARCHETYPE_MAP[merchantSlug || ''] || 'EVENT';

  const handleSaveDetails = () => {
    if (!serviceName.trim()) {
      alert("Please enter a Listing Name");
      setStep(1);
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
      metadata: { ...metadata, addons }
    };

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
    <div className="space-y-8 animate-fade-in pb-24 font-sans max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="py-6">
        <button 
          onClick={() => router.push(`/workspace/my-services/${serviceId}`)}
          className="flex items-center gap-2 text-text-secondary hover:text-[#ff6325] font-bold text-sm mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Back to {category.name} Listings
        </button>
        <h1 className="text-3xl font-black text-text-primary tracking-tight flex items-center gap-3">
          {isCreating ? 'Create New Listing' : 'Edit Listing'}
        </h1>
        <p className="text-sm text-text-secondary font-medium mt-2">
          Listing in category: <strong className="text-text-primary">{category.name}</strong>
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between relative mb-12 px-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border-brand/40 z-0 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#0a3161] to-[#ff6325] transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
        </div>
        {[
          { num: 1, label: 'Basic Info', icon: Info },
          { num: 2, label: 'Dynamic Details', icon: Zap },
          { num: 3, label: 'Publish', icon: CheckCircle2 }
        ].map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center gap-2" onClick={() => setStep(s.num)} style={{ cursor: 'pointer' }}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors shadow-sm
              ${step >= s.num ? 'bg-gradient-to-tr from-[#0a3161] to-[#124b8f] text-white ring-4 ring-[#ff6325]/30' : 'bg-bg-tertiary text-text-secondary border-2 border-border-brand/40'}
            `}>
              <s.icon size={20} className={step >= s.num ? 'text-[#ff6325]' : 'text-text-secondary'} />
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${step >= s.num ? 'text-[#ff6325]' : 'text-text-secondary'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-bg-secondary rounded-[2rem] shadow-2xl border border-border-brand/60 overflow-hidden text-text-primary">
        
        {step === 1 && (
          <div className="p-8 md:p-10 space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-text-primary flex items-center gap-2">
                <Info className="text-[#ff6325]" /> 1. Basic Information
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Configure primary details, pricing, description, and optional add-ons.
              </p>
            </div>
            
            <div className="space-y-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Listing Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder={
                    category?.name?.toLowerCase().includes('resort') || currentMerchant?.category?.toLowerCase().includes('resort')
                      ? "e.g. Beachfront Pool Villa, Luxury Swiss Tent, Lagoon View Cottage, Premium Suite"
                      : category?.name?.toLowerCase().includes('villa') || category?.name?.toLowerCase().includes('homestay') || currentMerchant?.category?.toLowerCase().includes('villa')
                      ? "e.g. 3BHK Private Pool Villa, Sunset Hill View Cottage, Traditional Courtyard Room"
                      : archetype === 'HOME_CALL'
                      ? "e.g. Split AC Deep Cleaning & Foam Jet Wash, Switchboard & MCB Repair, Kitchen Sink Drain Unclog"
                      : archetype === 'PASS_ENTRY'
                      ? "e.g. VIP Standing Fan Pit, Audi 1 Dolby Atmos Recliner, Special Darshan Pass"
                      : archetype === 'ASSET_RENTAL'
                      ? "e.g. Royal Enfield Hunter 350 Dapper, Hyundai Creta Automatic, Sony FX3 Cinema Kit"
                      : archetype === 'RENTAL' || category?.name?.toLowerCase().includes('turf') || category?.name?.toLowerCase().includes('cricket') || category?.name?.toLowerCase().includes('court')
                      ? "e.g. 7-a-side Main Turf (Pitch 1), Indoor Box Cricket Arena, Badminton Court A"
                      : archetype === 'APPOINTMENT'
                      ? "e.g. Senior Doctor OPD Consultation, Hair Styling Session"
                      : archetype === 'DINING'
                      ? "e.g. Rooftop 4-Seater Table, Private Dining Room"
                      : "e.g. Deluxe AC Room, Presidential Suite, Standard King Room"
                  }
                  className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-[#ff6325] focus:ring-2 focus:ring-[#ff6325]/20 transition-all font-medium bg-[#162033] text-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Listing Image</label>
                <div 
                  onClick={() => document.getElementById('listing-image-upload')?.click()}
                  className="w-full h-32 rounded-xl border-2 border-dashed border-border-brand/60 hover:border-[#ff6325] bg-bg-tertiary flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group mb-3"
                >
                  {imageUrl ? (
                    <>
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-white font-bold text-sm flex items-center gap-2">
                          Change Image
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-text-secondary group-hover:text-[#ff6325] transition-colors">
                      <span className="font-bold text-sm">Click to choose local image</span>
                      <span className="text-xs mt-1 opacity-70">PNG, JPG up to 5MB</span>
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
                        const compressed = await compressImage(file, 400, 400, 0.8);
                        setImageUrl(compressed);
                      } catch (err) {
                        console.error('Image compression failed', err);
                      }
                    }
                  }}
                  accept="image/*"
                />
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Or enter Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-[#ff6325] focus:ring-2 focus:ring-[#ff6325]/20 transition-all font-medium bg-[#162033] text-white placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                    {archetype === 'HOME_CALL' ? 'Inspection / Starting Rate (₹)' : archetype === 'PASS_ENTRY' ? 'Price per Pass / Ticket (₹)' : archetype === 'ASSET_RENTAL' ? 'Daily Rental Tariff (₹ / 24h)' : archetype === 'RENTAL' ? 'Base Hourly Rate (₹)' : archetype === 'APPOINTMENT' ? 'Doctor Consultation Fee (₹)' : archetype === 'ACCOMMODATION' ? 'Tariff per Night (₹)' : 'Base Price (₹)'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder={
                      category?.name?.toLowerCase().includes('resort') || currentMerchant?.category?.toLowerCase().includes('resort')
                        ? "e.g. 4500"
                        : category?.name?.toLowerCase().includes('villa') || category?.name?.toLowerCase().includes('homestay')
                        ? "e.g. 3500"
                        : archetype === 'ACCOMMODATION'
                        ? "e.g. 2499"
                        : archetype === 'HOME_CALL' 
                        ? "e.g. 199" 
                        : archetype === 'PASS_ENTRY' 
                        ? "e.g. 599" 
                        : archetype === 'ASSET_RENTAL' 
                        ? "e.g. 1500" 
                        : archetype === 'RENTAL' 
                        ? "e.g. 1200" 
                        : archetype === 'APPOINTMENT' 
                        ? "e.g. 600" 
                        : "e.g. 500"
                    }
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-[#ff6325] focus:ring-2 focus:ring-[#ff6325]/20 transition-all font-medium bg-[#162033] text-white placeholder-slate-400"
                    required
                  />
                  <p className="text-[10px] text-text-secondary mt-1">
                    {archetype === 'ACCOMMODATION' ? 'Standard per-night room tariff shown to guests.' : archetype === 'HOME_CALL' ? 'Visiting inspection fee or package starting price.' : archetype === 'PASS_ENTRY' ? 'Single admission price per pass/ticket.' : archetype === 'ASSET_RENTAL' ? 'Per-day rental tariff (24 hours window).' : archetype === 'RENTAL' ? 'Hourly court rate charged to players.' : archetype === 'APPOINTMENT' ? 'Standard fee charged per patient consultation.' : 'The starting price shown to customers.'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Short Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    category?.name?.toLowerCase().includes('resort') || currentMerchant?.category?.toLowerCase().includes('resort')
                      ? "Describe villa layout, beach/pool proximity, complimentary breakfast, air-conditioning, private sit-out deck, and guest capacity..."
                      : category?.name?.toLowerCase().includes('villa') || category?.name?.toLowerCase().includes('homestay')
                      ? "Describe homestay amenities, kitchen access, surrounding nature/hill view, peaceful courtyard, and family accommodation details..."
                      : archetype === 'ACCOMMODATION'
                      ? "Describe room amenities, view (city/garden/pool), bedding type, high-speed Wi-Fi, and 24/7 room service..."
                      : archetype === 'HOME_CALL'
                      ? "Describe technician equipment, service process, guarantee terms, and safety precautions followed at doorstep..."
                      : archetype === 'PASS_ENTRY'
                      ? "Describe the show/event experience, gate timings, stage proximity, sound clarity, and special privileges included with this pass..."
                      : archetype === 'ASSET_RENTAL'
                      ? "Describe vehicle model year, transmission, fuel efficiency, included accessories (helmets, phone mount), and handover terms..."
                      : archetype === 'RENTAL' || category?.name?.toLowerCase().includes('turf') || category?.name?.toLowerCase().includes('court')
                      ? "Describe this court/pitch (e.g. FIFA-standard artificial turf with 8 floodlights, changing rooms, and complimentary drinking water)..."
                      : archetype === 'APPOINTMENT'
                      ? "Describe doctor's clinical background, treatment approach, and hospital affiliations..."
                      : "Describe this listing (amenities, view, bedding details)..."
                  }
                  className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-[#ff6325] focus:ring-2 focus:ring-[#ff6325]/20 transition-all font-medium bg-[#162033] text-white placeholder-slate-400 min-h-[120px]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
                    {archetype === 'HOME_CALL' ? 'Spare Parts & Optional Add-on Additions' : archetype === 'PASS_ENTRY' ? 'F&B Combos & Merchandise Add-ons (Optional)' : archetype === 'ASSET_RENTAL' ? 'Add-on Gear / Excess Insurance (Optional)' : archetype === 'RENTAL' ? 'Equipment Add-ons & Surcharges (Optional)' : 'Add-ons / Extras (Optional)'}
                  </label>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAddons(prev => [...prev, { name: '', price: 0 }]);
                    }} 
                    className="text-xs font-bold text-[#ff6325] flex items-center gap-1 hover:brightness-110 bg-[#ff6325]/10 px-3 py-1.5 rounded-lg border border-[#ff6325]/20 cursor-pointer active:scale-95 transition-all"
                  >
                    <Plus size={14} /> Add Option
                  </button>
                </div>
                {addons.length === 0 && <p className="text-sm text-text-secondary italic">No add-ons configured.</p>}
                {addons.map((addon, idx) => (
                  <div key={idx} className="flex items-center gap-3 mb-3 bg-[#162033] p-3 rounded-xl border border-white/10 animate-fade-in">
                    <input 
                      type="text" 
                      placeholder={
                        archetype === 'HOME_CALL'
                          ? "e.g. Outdoor Unit Foam Jet Cleaning, Antibacterial Spray Coat, Extra Drain Pipe"
                          : archetype === 'PASS_ENTRY'
                          ? "e.g. Large Tub Popcorn & Coke, VIP Lounge Pass, Souvenir T-Shirt"
                          : archetype === 'ASSET_RENTAL'
                          ? "e.g. Extra Pillion Helmet, Action Camera Mount, Riding Jacket"
                          : archetype === 'RENTAL' 
                          ? "e.g. Football / Bibs Rental, Floodlights Surcharge" 
                          : "Add-on Name (e.g. Extra Bed, Breakfast)"
                      } 
                      value={addon.name} 
                      onChange={(e) => {  
                        const newA = [...addons]; 
                        newA[idx].name = e.target.value; 
                        setAddons(newA); 
                      }} 
                      className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 bg-[#0f1624] text-white text-sm font-medium focus:border-[#ff6325] focus:outline-none" 
                    />
                    <div className="relative w-28">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                      <input 
                        type="number" 
                        placeholder="Price" 
                        value={addon.price || ''} 
                        onChange={(e) => { 
                          const newA = [...addons]; 
                          newA[idx].price = Number(e.target.value); 
                          setAddons(newA); 
                        }} 
                        className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-white/10 bg-[#0f1624] text-white text-sm font-medium focus:border-[#ff6325] focus:outline-none" 
                      />
                    </div>
                    <button 
                      type="button"
                      title="Remove this add-on"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setAddons(prev => prev.filter((_, i) => i !== idx));
                      }} 
                      className="h-10 w-10 flex items-center justify-center text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-xl border border-red-500/20 hover:border-red-500 transition-all cursor-pointer shrink-0"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-border-brand/40">
              <button 
                onClick={() => setStep(2)}
                disabled={!serviceName}
                className="px-8 py-3 bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg shadow-[#ff6325]/25 cursor-pointer"
              >
                Next: Dynamic Details
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 md:p-10 space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-text-primary flex items-center gap-2">
                <Zap className="text-[#ff6325]" /> 2. Dynamic Details ({archetype})
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                These fields are specifically tailored for your business category type ({archetype}). Fill them out accurately.
              </p>
            </div>
            
            <div>
              <DynamicForm 
                archetype={archetype}
                initialData={metadata}
                onCancel={() => setStep(1)}
                onSubmit={(data) => {
                  setMetadata(data);
                  setStep(3);
                }}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-8 md:p-10 space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-text-primary flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" /> 3. Review & Publish
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Verify all listing parameters before publishing your service.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-text-primary text-lg">Basic Info</h3>
                <div className="bg-bg-tertiary p-5 rounded-2xl border border-border-brand/60 space-y-2 text-text-primary">
                  <p className="text-sm"><span className="text-text-secondary">Name:</span> <strong>{serviceName}</strong></p>
                  <p className="text-sm"><span className="text-text-secondary">Category:</span> <strong>{category.name}</strong></p>
                  <p className="text-sm"><span className="text-text-secondary">Archetype:</span> <strong>{archetype}</strong></p>
                  <p className="text-sm"><span className="text-text-secondary">Base Price:</span> <strong className="text-[#ff6325]">₹{basePrice || '0'}</strong></p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-text-primary text-lg">Dynamic Config</h3>
                <div className="bg-bg-tertiary p-5 rounded-2xl border border-border-brand/60 space-y-2 max-h-64 overflow-y-auto text-text-primary">
                  {Object.entries(metadata).length > 0 ? (
                    Object.entries(metadata).map(([key, val]) => (
                      <div key={key} className="text-sm border-b border-border-brand/40 pb-2 last:border-0">
                        <span className="text-text-secondary capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> <br/>
                        <strong>
                          {Array.isArray(val) 
                            ? val.map(v => typeof v === 'string' ? v.replace(/([a-z])([A-Z])/g, '$1 $2') : v).join(', ') 
                            : (typeof val === 'string' ? val.replace(/([a-z])([A-Z])/g, '$1 $2') : String(val))}
                        </strong>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-text-secondary italic">No dynamic details provided.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-border-brand/40">
              <button 
                onClick={() => setStep(2)}
                className="px-6 py-3 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-xl font-bold transition-colors cursor-pointer"
              >
                Back to Edit
              </button>
              <button 
                onClick={handleSaveDetails}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white rounded-xl font-bold shadow-lg shadow-[#ff6325]/25 transition-all"
              >
                <Save size={18} /> Publish Listing
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
