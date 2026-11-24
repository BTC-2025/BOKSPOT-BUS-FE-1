'use client';

import { useVendorStore, CatalogListing, CatalogService } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Image as ImageIcon, Trash2, Calendar, Building2 } from 'lucide-react';
import { getEntertainmentCategoryConfig } from '@/lib/entertainmentData';
import { getDiningConfig } from '@/lib/diningData';
import { getWellnessConfig } from '@/lib/wellnessData';
import { getFitnessConfig } from '@/lib/fitnessData';
import { getClinicConfig } from '@/lib/clinicalData';
import { getHomeServiceConfig } from '@/lib/homeServicesData';
import { getSportCategoryConfig } from '@/lib/sportsData';

export default function ServiceListingsPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;
  const { services, addService, updateService, currentMerchant } = useVendorStore();
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

  let category = services.find(s => s.id === serviceId);
  if (!category && typeof window !== 'undefined') {
    try {
      const storedOverride = localStorage.getItem(`custom_service_override_${serviceId}`);
      if (storedOverride) {
        category = JSON.parse(storedOverride);
      }
    } catch (err) {
      console.warn('Failed to parse stored service override', err);
    }
  }

  // Fallback: If category not in store but generated via auto-fallback (e.g. svc-dining-*, svc-wellness-*, etc.)
  if (!category && serviceId && currentMerchant) {
    const rawCat = (currentMerchant.category || '').toLowerCase();
    const branchId = currentMerchant.activeBranchId || 'main-branch';

    const sportCfg = getSportCategoryConfig(rawCat);
    if (sportCfg || serviceId.includes('turf') || serviceId.includes('sport') || rawCat.includes('turf') || rawCat.includes('football')) {
      const activeSportCfg = sportCfg || getSportCategoryConfig('football-turf')!;
      category = {
        id: serviceId,
        name: `${activeSportCfg.categoryName} Master Units`,
        merchant: currentMerchant.merchantName || activeSportCfg.merchantName,
        price: activeSportCfg.defaultPrice,
        duration: 60,
        category: activeSportCfg.categoryName,
        active: true,
        branchId,
        rating: 5.0,
        bookingsCount: 320,
        imageUrl: activeSportCfg.heroImage,
        description: `Professional ${activeSportCfg.categoryName} court and unit management. Configure court surfaces, hourly tariffs, and equipment add-ons.`,
        city: currentMerchant.city || 'Chennai',
        metadata: {
          isFacility: true,
          branchId,
          merchantName: currentMerchant.merchantName || activeSportCfg.merchantName,
          originalCategory: activeSportCfg.categoryName,
          amenities: activeSportCfg.amenities,
          mandatoryRule: activeSportCfg.mandatoryRule,
          supervisorTitle: activeSportCfg.supervisorTitle,
          includedGear: activeSportCfg.includedGear,
          listings: activeSportCfg.units.map(u => ({
            id: u.id,
            name: u.name,
            price: u.price,
            imageUrl: u.imageUrl,
            description: u.description,
            images: [u.imageUrl],
            metadata: {
              imageUrl: u.imageUrl,
              surface: u.surface,
              badge: u.badge,
              addons: activeSportCfg.addons,
              mandatoryRule: activeSportCfg.mandatoryRule,
              equipmentAddons: activeSportCfg.includedGear,
              refereeOrManager: activeSportCfg.supervisorTitle
            }
          }))
        },
        listings: activeSportCfg.units.map(u => ({
          id: u.id,
          name: u.name,
          price: u.price,
          imageUrl: u.imageUrl,
          description: u.description,
          images: [u.imageUrl],
          active: true,
          metadata: {
            imageUrl: u.imageUrl,
            surface: u.surface,
            badge: u.badge,
            addons: activeSportCfg.addons,
            mandatoryRule: activeSportCfg.mandatoryRule,
            equipmentAddons: activeSportCfg.includedGear,
            refereeOrManager: activeSportCfg.supervisorTitle
          }
        }))
      };
    } else if (rawCat.includes('dining') || rawCat.includes('restaurant') || serviceId.includes('dining')) {
      const diningCfg = getDiningConfig(currentMerchant.id || 'grand-temple-dine');
      category = {
        id: serviceId,
        name: `${diningCfg.name} Table Reservations`,
        merchant: currentMerchant.merchantName || diningCfg.name,
        price: diningCfg.tableTypes[0]?.depositAmount || 0,
        duration: 90,
        category: 'Restaurant Table Reservation',
        active: true,
        branchId,
        rating: diningCfg.rating,
        bookingsCount: 380,
        imageUrl: diningCfg.heroImage,
        description: `Cozy dining tables, celebration setups, session time slots, and chef specialty pre-orders.`,
        city: currentMerchant.city || 'Chennai',
        metadata: {
          isDining: true,
          tableTypes: diningCfg.tableTypes,
          timeSlots: diningCfg.timeSlots,
          popularMenu: diningCfg.popularMenu
        },
        listings: diningCfg.tableTypes.map(t => ({
          id: t.id,
          name: t.name,
          price: t.depositAmount,
          imageUrl: diningCfg.heroImage,
          description: `${t.capacity} • Zone: ${t.zone}`,
          images: diningCfg.galleryImages,
          active: true
        }))
      };
    } else if (rawCat.includes('salon') || rawCat.includes('spa') || serviceId.includes('wellness')) {
      const wellnessCfg = getWellnessConfig(currentMerchant.id || 'style-studio');
      category = {
        id: serviceId,
        name: `${wellnessCfg.name} Treatments`,
        merchant: currentMerchant.merchantName || wellnessCfg.name,
        price: wellnessCfg.treatments[0]?.price || 499,
        duration: 45,
        category: 'Salon / Spa Appointment',
        active: true,
        branchId,
        rating: wellnessCfg.rating,
        bookingsCount: 290,
        imageUrl: wellnessCfg.heroImage,
        description: `Hair styling, beard grooming, facial rejuvenation and spa therapy slots.`,
        city: currentMerchant.city || 'Chennai',
        metadata: {
          isWellness: true,
          treatments: wellnessCfg.treatments,
          specialists: wellnessCfg.specialists
        },
        listings: wellnessCfg.treatments.map(t => ({
          id: t.id,
          name: t.name,
          price: t.price,
          originalPrice: t.originalPrice,
          discountPercentage: t.originalPrice ? Math.round(((t.originalPrice - t.price) / t.originalPrice) * 100) : 0,
          imageUrl: wellnessCfg.heroImage,
          description: `${t.durationMinutes} Mins • ${t.category}`,
          images: wellnessCfg.galleryImages,
          active: true,
          metadata: {
            speciality: t.category,
            consultationDuration: t.durationMinutes,
            doctorName: t.genderTarget === 'MEN' ? 'Arun Varma (Lead Hair Director)' : t.genderTarget === 'WOMEN' ? 'Priya Sundaram (Senior Aesthetician)' : 'Any Senior Stylist',
            qualification: "Toni&Guy Certified / L'Oréal Color Pro (8+ yrs exp)",
            opdRoomNumber: 'Styling Station #2 (Luxury Suite)',
            maxDailyTokens: 16,
            consultationFee: t.price,
            opdTimings: 'Mon-Sun: 09:00 AM - 09:00 PM',
            treatmentCategory: t.category,
            serviceMode: t.serviceMode,
            genderTarget: t.genderTarget
          }
        }))
      };
    } else if (rawCat.includes('gym') || rawCat.includes('yoga') || serviceId.includes('fitness')) {
      const fitCfg = getFitnessConfig(currentMerchant.id || 'zenfit-clinic');
      category = {
        id: serviceId,
        name: `${fitCfg.name} Passes & Batches`,
        merchant: currentMerchant.merchantName || fitCfg.name,
        price: fitCfg.passes[0]?.price || 299,
        duration: 60,
        category: 'Gym / Yoga Slot Booking',
        active: true,
        branchId,
        rating: fitCfg.rating,
        bookingsCount: 510,
        imageUrl: fitCfg.heroImage,
        description: `Open gym day passes, group yoga batches, personal trainers, and digital turnstile entry.`,
        city: currentMerchant.city || 'Chennai',
        metadata: {
          isFitness: true,
          passes: fitCfg.passes,
          trainers: fitCfg.trainers,
          timeSlots: fitCfg.timeSlots
        },
        listings: fitCfg.passes.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          imageUrl: fitCfg.heroImage,
          description: `${p.durationMinutes === 720 ? 'Full Day' : `${p.durationMinutes}m`} • ${p.formatType}`,
          images: fitCfg.galleryImages,
          active: true
        }))
      };
    } else if (rawCat.includes('doctor') || rawCat.includes('clinic') || serviceId.includes('doc')) {
      const docCfg = getClinicConfig(currentMerchant.id || 'apollo-dental');
      category = {
        id: serviceId,
        name: `${docCfg.name} OPD Slots`,
        merchant: currentMerchant.merchantName || docCfg.name,
        price: docCfg.doctors[0]?.consultationFee || 500,
        duration: 20,
        category: 'Doctor Appointment',
        active: true,
        branchId,
        rating: docCfg.rating,
        bookingsCount: 440,
        imageUrl: docCfg.heroImage,
        description: `OPD consultation chambers, live waiting room token queue, and verified medical specialists.`,
        city: currentMerchant.city || 'Chennai',
        metadata: {
          isDoctor: true,
          doctors: docCfg.doctors,
          consultationModes: docCfg.consultationModes,
          timeSlots: docCfg.timeSlots
        },
        listings: docCfg.doctors.map(d => ({
          id: d.id,
          name: d.name,
          price: d.consultationFee,
          imageUrl: d.avatar,
          description: `${d.role} • ${d.opdRoom}`,
          images: [d.avatar],
          active: true
        }))
      };
    } else if (rawCat.includes('electrician') || rawCat.includes('plumber') || rawCat.includes('clean') || rawCat.includes('technician') || serviceId.includes('home')) {
      const homeCfg = getHomeServiceConfig(rawCat);
      const matched = homeCfg.services.find(s => rawCat.includes(s.category)) || homeCfg.services[0];
      category = {
        id: serviceId,
        name: matched.name,
        merchant: currentMerchant.merchantName || homeCfg.name,
        price: matched.inspectionFee,
        duration: matched.estDurationMinutes,
        category: currentMerchant.category || 'Electrician Booking',
        active: true,
        branchId,
        rating: homeCfg.rating,
        bookingsCount: 890,
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
        description: `${matched.description}`,
        city: currentMerchant.city || 'Chennai',
        metadata: {
          isHomeService: true,
          serviceItem: matched,
          arrivalWindows: homeCfg.arrivalWindows,
          warrantyDays: homeCfg.warrantyDays
        },
        listings: matched.popularAddons.map((a, idx) => ({
          id: `addon-${idx}`,
          name: a.name,
          price: a.price,
          imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
          description: `Add-on Service (+₹${a.price})`,
          images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop'],
          active: true
        }))
      };
    } else if (rawCat.includes('movie') || rawCat.includes('cinema') || serviceId.includes('movies')) {
      const entCfg = getEntertainmentCategoryConfig('movies');
      if (entCfg) {
        category = {
          id: serviceId,
          name: `${entCfg.categoryName} Passes & Screenings`,
          merchant: currentMerchant.merchantName || entCfg.merchantName,
          price: entCfg.defaultPrice,
          duration: 120,
          category: entCfg.categoryName,
          active: true,
          branchId,
          rating: 4.9,
          bookingsCount: 420,
          imageUrl: entCfg.heroImage,
          description: `Premier ${entCfg.categoryName} hall, screen formats, tier pricing and concession add-on controls.`,
          city: currentMerchant.city || 'Chennai',
          metadata: {
            isEntertainment: true,
            seatTiers: entCfg.seatTiers
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
      }
    }
  }

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
            const isDiningCategory = (category.name || '').toLowerCase().includes('dining') ||
              (category.name || '').toLowerCase().includes('restaurant') ||
              (category.category || '').toLowerCase().includes('dining') ||
              (category.category || '').toLowerCase().includes('restaurant') ||
              Boolean(category.metadata?.isDining);
            const isTurfListing = (category.name || '').toLowerCase().includes('turf') ||
              (category.name || '').toLowerCase().includes('football') ||
              (category.name || '').toLowerCase().includes('cricket') ||
              (category.name || '').toLowerCase().includes('badminton') ||
              (category.name || '').toLowerCase().includes('tennis') ||
              (category.name || '').toLowerCase().includes('basketball') ||
              (category.name || '').toLowerCase().includes('swimming') ||
              (category.name || '').toLowerCase().includes('court') ||
              (category.name || '').toLowerCase().includes('arena') ||
              (category.category || '').toLowerCase().includes('sports') ||
              (category.category || '').toLowerCase().includes('turf') ||
              (category.category || '').toLowerCase().includes('badminton') ||
              (list.name || '').toLowerCase().includes('court') ||
              (list.name || '').toLowerCase().includes('pitch') ||
              (list.name || '').toLowerCase().includes('turf');
            const listImg = 
              (list.imageUrl && list.imageUrl.startsWith('http') && !list.imageUrl.includes('ui-avatars') ? list.imageUrl : null) ||
              ((list as any).images && Array.isArray((list as any).images) && (list as any).images[0]?.startsWith('http') ? (list as any).images[0] : null) ||
              (list.metadata?.imageUrl?.startsWith('http') ? list.metadata.imageUrl : null) ||
              (list.metadata?.gallery && Array.isArray(list.metadata.gallery) && list.metadata.gallery[0]?.startsWith('http') ? list.metadata.gallery[0] : null) ||
              (category.imageUrl && category.imageUrl.startsWith('http') ? category.imageUrl : null) ||
              (isTurfListing
                ? 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80'
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
                    <div className="flex flex-col gap-0.5">
                      {isDiningCategory ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black shadow-lg border border-white/20 backdrop-blur-md"
                            style={{ backgroundColor: Number(list.price) > 0 ? 'rgba(255, 99, 37, 0.95)' : 'rgba(16, 185, 129, 0.95)', color: '#ffffff' }}
                          >
                            {Number(list.price) > 0 ? `₹${Number(list.price).toLocaleString('en-IN')} Deposit` : 'Free Hold'}
                          </span>
                          {(list.metadata as any)?.seatingZone && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-white/20 text-white backdrop-blur-md border border-white/20">
                              {(list.metadata as any).seatingZone}
                            </span>
                          )}
                        </div>
                      ) : list.price !== undefined && list.price > 0 ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black shadow-lg border border-white/20 backdrop-blur-md"
                            style={{ backgroundColor: 'rgba(255, 99, 37, 0.95)', color: '#ffffff' }}
                          >
                            ₹{Number(list.price).toLocaleString('en-IN')}
                            <span className="text-[10px] font-semibold ml-1 opacity-90">
                              {list.priceUnit || (list.metadata as any)?.priceUnit || (isTurfListing ? '/hr' : '/night')}
                            </span>
                          </span>
                          {(list.discountPercentage || (list.metadata as any)?.discountPercentage) ? (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-500/90 text-white backdrop-blur-md border border-white/20">
                              -{list.discountPercentage || (list.metadata as any)?.discountPercentage}%
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md"
                          style={{ color: '#ffffff' }}
                        >
                          Custom Pricing
                        </span>
                      )}
                      {(list.securityDeposit || (list.metadata as any)?.securityDeposit) ? (
                        <span className="text-[9px] font-bold text-amber-200 drop-shadow-md backdrop-blur-xs px-1 rounded bg-black/40 w-fit">
                          Deposit: ₹{Number(list.securityDeposit || (list.metadata as any)?.securityDeposit).toLocaleString('en-IN')}
                        </span>
                      ) : null}
                    </div>

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
                    {/* Hourly Slots for Sports/Arenas/Courts */}
                    {isTurfListing ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/workspace/my-services/${serviceId}/listing/${list.id}/slots`);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs border bg-orange-500 hover:bg-orange-600 text-white border-orange-600 dark:bg-[#ff6325] dark:hover:bg-[#e04e13]"
                        title="Manage Hourly Slot Timings & Pricing"
                      >
                        <Calendar size={13} className="shrink-0" />
                        <span className="whitespace-nowrap">Manage Slots</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Available
                      </span>
                    )}

                    <span className="font-bold text-slate-500 dark:text-slate-400 group-hover:text-[#ff6325] transition-colors text-xs flex items-center gap-1 ml-auto">
                      Edit Unit &rarr;
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
