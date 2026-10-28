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

  // Display name formatting (clean internal technical identifiers like __BOKSPOT_GROUP__)
  const displayName = (!category.name || category.name === '__BOKSPOT_GROUP__') 
    ? (category.category || 'Service Units') 
    : category.name;

  return (
    <div className="space-y-12 animate-fade-in pb-12 font-sans">

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
              {listings.length} Bookable {listings.length === 1 ? 'Unit' : 'Units'}
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
          <button
            onClick={() => router.push(`/workspace/my-services/${serviceId}/listing/new`)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            title={`Add a new listing under ${displayName}`}
          >
            <Plus size={15} /> Add Listing
          </button>
        </div>
      </div>

      {/* 2. Listings Grid (Matching Level 1 & 2 Size: 4 Columns) */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {listings.map(list => {
            const isTurfListing = (category.name || '').toLowerCase().includes('turf') ||
              (category.name || '').toLowerCase().includes('football') ||
              (list.name || '').toLowerCase().includes('turf') ||
              (list.name || '').toLowerCase().includes('pitch');
            const listImg = list.imageUrl && list.imageUrl.startsWith('http') && !list.imageUrl.includes('ui-avatars')
              ? list.imageUrl
              : (isTurfListing
                ? 'https://images.unsplash.com/photo-1574629810360-7efbb49fec90?w=800&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80');

            return (
              <div
                key={list.id}
                onClick={() => router.push(`/workspace/my-services/${serviceId}/listing/${list.id}`)}
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
                    {list.price !== undefined && list.price > 0 ? (
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black shadow-lg border border-white/20 backdrop-blur-md"
                        style={{ backgroundColor: 'rgba(255, 99, 37, 0.95)', color: '#ffffff' }}
                      >
                        ₹{Number(list.price).toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md"
                        style={{ color: '#ffffff' }}
                      >
                        Custom Pricing
                      </span>
                    )}

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
                    {/* Hourly Slots for Sports/Arenas only */}
                    {isTurfListing ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/workspace/my-services/${serviceId}/listing/${list.id}/slots`);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-[11px] font-bold rounded-lg transition-all border border-slate-200 dark:border-white/10 shadow-sm"
                      >
                        <Calendar size={12} className="text-[#ff6325]" />
                        <span>Slots</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Available
                      </span>
                    )}

                    <span className="font-bold text-slate-500 dark:text-slate-400 group-hover:text-[#ff6325] transition-colors text-xs flex items-center gap-1 ml-auto">
                      Edit Info &rarr;
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
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">No Listings Yet</h3>
              <p className="text-slate-400 max-w-sm text-xs mb-4">
                Click below to add the first bookable unit for <strong className="text-slate-700 dark:text-white capitalize">{displayName}</strong>.
              </p>
              <button
                onClick={() => router.push(`/workspace/my-services/${serviceId}/listing/new`)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
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
