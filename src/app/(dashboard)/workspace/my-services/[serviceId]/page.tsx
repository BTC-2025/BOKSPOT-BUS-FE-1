'use client';

import { useVendorStore, CatalogListing } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Image as ImageIcon, Trash2, Calendar, Building2 } from 'lucide-react';

export default function ServiceListingsPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;
  const { services, updateService, currentMerchant } = useVendorStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !currentMerchant) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-[#ff6325] border-t-transparent animate-spin" />
      </div>
    );
  }

  const category = services.find(s => s.id === serviceId);

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

  return (
    <div className="space-y-12 animate-fade-in pb-12 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/[0.08]">
        <div>
          <button 
            onClick={() => router.push('/workspace/my-services')}
            className="flex items-center gap-2 text-slate-400 hover:text-[#ff6325] font-bold text-sm mb-4 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Types
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            {category.name} Listings
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-2 max-w-2xl">
            Manage individual listings inside the <span className="text-white font-bold">{category.name}</span> type.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/workspace/about')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0f1624] hover:bg-[#162033] text-slate-100 hover:text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 border border-white/20 hover:border-[#ff6325]/60 cursor-pointer"
            title="Manage Venue / Campsite Profile, Photos & Location"
          >
            <Building2 size={16} className="text-[#ff6325]" />
            <span>Venue Profile</span>
          </button>
          <button 
            onClick={() => router.push(`/workspace/my-services/${serviceId}/listing/new`)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white shadow-lg shadow-[#ff6325]/25 font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
          >
            <Plus size={16} /> Add Listing
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {listings.map(list => (
            <div 
              key={list.id} 
              onClick={() => router.push(`/workspace/my-services/${serviceId}/listing/${list.id}`)}
              className="bg-[#0f1624] rounded-3xl border border-white/10 hover:border-[#ff6325]/50 shadow-lg hover:shadow-2xl hover:shadow-[#ff6325]/10 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col cursor-pointer group backdrop-blur-sm"
            >
              <div className="h-36 w-full bg-[#162033] relative overflow-hidden">
                {list.imageUrl ? (
                  <img src={list.imageUrl} alt={list.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <img src={getFallbackImage(list.name)} alt={list.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1624] via-transparent to-black/20" />
                <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => handleDeleteListing(e, list.id)} className="h-8 w-8 bg-black/60 hover:bg-red-600 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-md transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-extrabold text-base text-white leading-tight group-hover:text-[#ff6325] transition-colors">{list.name}</h3>
                    {list.price !== undefined && list.price > 0 && (
                      <span className="text-xs font-bold text-[#ff6325] bg-[#ff6325]/10 px-2 py-1 rounded-md shrink-0 border border-[#ff6325]/20">
                        ₹{list.price}
                      </span>
                    )}
                  </div>
                  {list.description && <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">{list.description}</p>}
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {list.isTimingEnabled && <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold rounded">Timing</span>}
                    {list.isAddonsEnabled && <span className="px-2 py-1 bg-orange-500/10 text-[#ff6325] border border-orange-500/20 text-[10px] font-bold rounded">Add-ons</span>}
                    {list.isRulesEnabled && <span className="px-2 py-1 bg-white/10 text-slate-300 border border-white/10 text-[10px] font-bold rounded">Rules</span>}
                    {list.isOffersEnabled && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded">Offers</span>}
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  {/* Hide Hourly Slots button for Accommodation/Hotels/Resorts/Villas/Camping/Hostels where booking is by Night/Date, not hourly slots */}
                  {!category?.slug?.includes('hotel') &&
                   !category?.slug?.includes('resort') &&
                   !category?.slug?.includes('villa') &&
                   !category?.slug?.includes('homestay') &&
                   !category?.slug?.includes('camp') &&
                   !category?.slug?.includes('tent') &&
                   !category?.slug?.includes('hostel') &&
                   !category?.name?.toLowerCase().includes('hotel') &&
                   !category?.name?.toLowerCase().includes('resort') &&
                   !category?.name?.toLowerCase().includes('villa') &&
                   !category?.name?.toLowerCase().includes('homestay') &&
                   !category?.name?.toLowerCase().includes('camp') &&
                   !category?.name?.toLowerCase().includes('tent') &&
                   !category?.name?.toLowerCase().includes('glamp') &&
                   !category?.name?.toLowerCase().includes('hostel') &&
                   !category?.name?.toLowerCase().includes('stay') &&
                   !currentMerchant?.category?.toLowerCase().includes('camp') &&
                   !currentMerchant?.category?.toLowerCase().includes('tent') &&
                   !currentMerchant?.category?.toLowerCase().includes('hostel') &&
                   !currentMerchant?.category?.toLowerCase().includes('hotel') &&
                   !currentMerchant?.category?.toLowerCase().includes('resort') &&
                   !currentMerchant?.category?.toLowerCase().includes('villa') &&
                   currentMerchant?.archetype !== 'Accommodation' &&
                   currentMerchant?.archetype !== 'Camping' &&
                   currentMerchant?.archetype !== 'Hostel' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/workspace/my-services/${serviceId}/listing/${list.id}/slots`);
                      }}
                      className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#162033] dark:hover:bg-[#1f2d47] text-slate-800 dark:text-white text-xs font-bold rounded-lg transition-all border border-slate-200 dark:border-white/10 shadow-sm"
                    >
                      <Calendar size={13} className="text-[#ff6325]" />
                      <span>Slots</span>
                    </button>
                  )}
                  <span className="text-xs font-bold text-[#ff6325] group-hover:translate-x-1 transition-transform ml-auto">Edit Info &rarr;</span>
                </div>
              </div>
            </div>
          ))}

          {listings.length === 0 && (
            <div className="col-span-full py-20 px-6 rounded-3xl border-2 border-dashed border-white/10 bg-[#0f1624]/60 flex flex-col items-center justify-center text-center backdrop-blur-sm">
              <div className="h-16 w-16 bg-[#162033] rounded-2xl flex items-center justify-center mb-4 text-[#ff6325] rotate-3 border border-white/10">
                <ImageIcon size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Listings Yet</h3>
              <p className="text-slate-400 max-w-md text-sm mb-6 leading-relaxed">
                Click the button below to create the first listing for <strong className="text-white">{category.name}</strong>.
              </p>
              <button 
                onClick={() => router.push(`/workspace/my-services/${serviceId}/listing/new`)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-bold text-sm transition-all shadow-lg shadow-[#ff6325]/25 cursor-pointer"
              >
                + Add First Listing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
