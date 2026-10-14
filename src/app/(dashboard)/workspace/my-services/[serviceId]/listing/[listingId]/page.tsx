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
          className="flex items-center gap-2 text-slate-400 hover:text-[#ff6325] font-bold text-sm mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Back to {category.name} Listings
        </button>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          {isCreating ? 'Create New Listing' : 'Edit Listing'}
        </h1>
        <p className="text-sm text-slate-300 font-medium mt-2">
          Listing in category: <strong className="text-white">{category.name}</strong>
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between relative mb-12 px-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 z-0 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#0a3161] to-[#ff6325] transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
        </div>
        {[
          { num: 1, label: 'Basic Info', icon: Info },
          { num: 2, label: 'Dynamic Details', icon: Zap },
          { num: 3, label: 'Publish', icon: CheckCircle2 }
        ].map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center gap-2" onClick={() => setStep(s.num)} style={{ cursor: 'pointer' }}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors shadow-sm
              ${step >= s.num ? 'bg-gradient-to-tr from-[#0a3161] to-[#124b8f] text-white ring-4 ring-[#ff6325]/30' : 'bg-[#162033] text-slate-400 border-2 border-white/10'}
            `}>
              <s.icon size={20} className={step >= s.num ? 'text-[#ff6325]' : 'text-slate-400'} />
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${step >= s.num ? 'text-[#ff6325]' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-[#0f1624] rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden text-white">
        
        {step === 1 && (
          <div className="p-8 md:p-10 space-y-8 animate-fade-in">
            <h2 className="text-2xl font-black text-white border-b border-white/10 pb-4">1. Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Listing Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Deluxe AC Room, Presidential Suite, Standard King"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-[#ff6325] focus:ring-2 focus:ring-[#ff6325]/20 transition-all font-medium bg-[#162033] text-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Listing Image</label>
                <div 
                  onClick={() => document.getElementById('listing-image-upload')?.click()}
                  className="w-full h-32 rounded-xl border-2 border-dashed border-white/20 hover:border-[#ff6325] bg-[#162033] flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group mb-3"
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
                    <div className="flex flex-col items-center text-slate-400 group-hover:text-[#ff6325] transition-colors">
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
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Or enter Image URL</label>
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
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Base Price (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="e.g. 500"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-[#ff6325] focus:ring-2 focus:ring-[#ff6325]/20 transition-all font-medium bg-[#162033] text-white placeholder-slate-400"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">The starting price shown to customers.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Short Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this listing (amenities, view, bedding details)..."
                  className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-[#ff6325] focus:ring-2 focus:ring-[#ff6325]/20 transition-all font-medium bg-[#162033] text-white placeholder-slate-400 min-h-[120px]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">Add-ons / Extras (Optional)</label>
                  <button onClick={() => setAddons([...addons, { name: '', price: 0 }])} className="text-xs font-bold text-[#ff6325] flex items-center gap-1 hover:underline bg-[#ff6325]/10 px-3 py-1.5 rounded-lg border border-[#ff6325]/20"><Plus size={14} /> Add Option</button>
                </div>
                {addons.length === 0 && <p className="text-sm text-slate-400 italic">No add-ons configured.</p>}
                {addons.map((addon, idx) => (
                  <div key={idx} className="flex items-center gap-3 mb-3 bg-[#162033] p-3 rounded-xl border border-white/10 animate-fade-in">
                    <input type="text" placeholder="Add-on Name (e.g. Extra Bed, Breakfast)" value={addon.name} onChange={(e) => { const newA = [...addons]; newA[idx].name = e.target.value; setAddons(newA); }} className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 bg-[#0f1624] text-white text-sm font-medium focus:border-[#ff6325] focus:outline-none" />
                    <div className="relative w-28">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                      <input type="number" placeholder="Price" value={addon.price} onChange={(e) => { const newA = [...addons]; newA[idx].price = Number(e.target.value); setAddons(newA); }} className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-white/10 bg-[#0f1624] text-white text-sm font-medium focus:border-[#ff6325] focus:outline-none" />
                    </div>
                    <button onClick={() => setAddons(addons.filter((_, i) => i !== idx))} className="text-red-400 hover:bg-red-500/20 p-2.5 rounded-lg border border-transparent hover:border-red-500/30 transition-colors"><X size={16} strokeWidth={3} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button 
                onClick={() => setStep(2)}
                disabled={!serviceName}
                className="px-8 py-3 bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg shadow-[#ff6325]/25"
              >
                Next: Dynamic Details
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 md:p-10 space-y-8 animate-fade-in bg-[#162033]/40">
            <h2 className="text-2xl font-black text-white border-b border-white/10 pb-4 flex items-center gap-2">
              <Zap className="text-[#ff6325]" /> 2. Dynamic Details ({archetype})
            </h2>
            <p className="text-sm text-slate-300">
              These fields are specifically tailored for your business category type ({archetype}). Fill them out accurately.
            </p>
            
            <div className="bg-[#0f1624] rounded-2xl shadow-xl border border-white/10 overflow-hidden">
              <DynamicForm 
                archetype={archetype}
                initialData={metadata}
                onSubmit={(data) => {
                  setMetadata(data);
                  setStep(3);
                }}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-8 md:p-10 space-y-8 animate-fade-in bg-[#162033]/40">
            <h2 className="text-2xl font-black text-white border-b border-white/10 pb-4 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-400" /> 3. Review & Publish
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-white text-lg">Basic Info</h3>
                <div className="bg-[#162033] p-4 rounded-xl border border-white/10 space-y-2 text-white">
                  <p className="text-sm"><span className="text-slate-400">Name:</span> <strong>{serviceName}</strong></p>
                  <p className="text-sm"><span className="text-slate-400">Category:</span> <strong>{category.name}</strong></p>
                  <p className="text-sm"><span className="text-slate-400">Archetype:</span> <strong>{archetype}</strong></p>
                  <p className="text-sm"><span className="text-slate-400">Base Price:</span> <strong className="text-[#ff6325]">₹{basePrice || '0'}</strong></p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-white text-lg">Dynamic Config</h3>
                <div className="bg-[#162033] p-4 rounded-xl border border-white/10 space-y-2 max-h-64 overflow-y-auto text-white">
                  {Object.entries(metadata).length > 0 ? (
                    Object.entries(metadata).map(([key, val]) => (
                      <div key={key} className="text-sm border-b border-white/5 pb-2 last:border-0">
                        <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> <br/>
                        <strong>{Array.isArray(val) ? val.join(', ') : String(val)}</strong>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">No dynamic details provided.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-white/10">
              <button 
                onClick={() => setStep(2)}
                className="px-6 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-bold transition-colors"
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
