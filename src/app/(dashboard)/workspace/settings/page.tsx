'use client';

import { useVendorStore } from '@/lib/store';
import { getArchetypeConfig } from '@/lib/businessDictionary';
import { 
  Building2, Mail, Phone, Globe, MapPin, Save, Info, User,
  CheckCircle2, Clock, Camera, Settings, ShieldAlert,
  ChevronRight, Sparkles, Crown, Award, Star
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const { currentMerchant, loginRole, supervisorId, updateMerchantModules, updateMerchantProfile } = useVendorStore();
  const archetypeConfig = getArchetypeConfig(currentMerchant?.archetype || 'Service');
  const isService = currentMerchant?.archetype === 'Service';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getBnxMailId = () => {
    if (!currentMerchant) return '';
    const originalEmail = currentMerchant.email || '';
    if (loginRole === 'supervisor') {
      const supName = supervisorId || 'SUPERVISOR';
      return `${supName}/${originalEmail}`;
    }
    return originalEmail;
  };

  const [name, setName] = useState(currentMerchant?.merchantName || '');
  const [email, setEmail] = useState(getBnxMailId() || '');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [website, setWebsite] = useState('www.beta-booking.com');
  const [address, setAddress] = useState(currentMerchant?.address || '42 Anna Nagar, Chennai');
  const [city, setCity] = useState(currentMerchant?.city || 'Chennai');
  const [latitude, setLatitude] = useState<string>(currentMerchant?.latitude?.toString() || '13.0827');
  const [longitude, setLongitude] = useState<string>(currentMerchant?.longitude?.toString() || '80.2707');
  const [about, setAbout] = useState(currentMerchant?.aboutText || currentMerchant?.about || '');
  const [isSaved, setIsSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(currentMerchant?.logoUrl || null);

  // BokSpot Luxe Certification state
  const [isLuxeVerified, setIsLuxeVerified] = useState<boolean>(
    currentMerchant?.isLuxeVerified ?? (currentMerchant?.metadata?.isLuxeVerified || false)
  );
  const [starRating, setStarRating] = useState<number>(
    currentMerchant?.starRating ?? (currentMerchant?.metadata?.starRating || 5)
  );
  const [tier, setTier] = useState<'STANDARD' | 'PREMIUM' | 'LUXURY'>(
    currentMerchant?.tier ?? (currentMerchant?.metadata?.tier || 'LUXURY')
  );
  const [isPetFriendly, setIsPetFriendly] = useState<boolean>(
    currentMerchant?.isPetFriendly ?? (currentMerchant?.metadata?.isPetFriendly || false)
  );

  // Bag Locker / Mini Space Luggage Storage Settings
  const [isLuggageStorageEnabled, setIsLuggageStorageEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const id = currentMerchant?.id;
        const uname = currentMerchant?.username;
        const keys = [
          id ? `hotel_luggage_enabled_${id}` : null,
          uname ? `hotel_luggage_enabled_${uname}` : null,
          'hotel_luggage_enabled_H101',
          'hotel_luggage_enabled_default'
        ].filter(Boolean) as string[];

        for (const k of keys) {
          const val = localStorage.getItem(k);
          if (val !== null) return val === 'true';
        }
      } catch {}
    }
    return currentMerchant?.metadata?.isLuggageStorageEnabled ?? true;
  });

  const handleToggleLuggageStorage = async (newState: boolean) => {
    setIsLuggageStorageEnabled(newState);
    if (!currentMerchant) return;

    // Direct fast fetch to Backend API to persist permanently
    try {
      const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || (isProd ? 'https://bokspot-be.onrender.com/api/v1' : 'http://localhost:9000/api/v1');
      const targetId = currentMerchant.id;
      await fetch(`${baseUrl}/merchants/${targetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metadata: {
            ...(currentMerchant.metadata || {}),
            isLuggageStorageEnabled: newState,
            luggageHourlyRate: luggageRate || 100,
            luggageDayPassRate: luggageDayPassRate || 500
          }
        })
      });
    } catch (e) {
      console.warn('Backend API merchant patch error:', e);
    }

    // Save directly to localStorage across all keys
    if (typeof window !== 'undefined') {
      try {
        const id = currentMerchant.id;
        const uname = currentMerchant.username;
        const valStr = String(newState);

        localStorage.setItem(`hotel_luggage_enabled_${id}`, valStr);
        if (uname) localStorage.setItem(`hotel_luggage_enabled_${uname}`, valStr);
        localStorage.setItem('hotel_luggage_enabled_H101', valStr);
        localStorage.setItem('hotel_luggage_enabled_default', valStr);

        window.dispatchEvent(new CustomEvent('hotel_luggage_toggle', { detail: { enabled: newState, merchantId: id } }));
        window.dispatchEvent(new Event('storage'));
      } catch {}
    }

    // Save to Zustand store
    await updateMerchantProfile(currentMerchant.id, {
      metadata: {
        ...(currentMerchant.metadata || {}),
        isLuggageStorageEnabled: newState,
      }
    } as any);
  };
  const [luggageRate, setLuggageRate] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`hotel_luggage_rate_${currentMerchant?.id || 'default'}`);
        if (stored) return Number(stored);
      } catch {}
    }
    return currentMerchant?.luggageHourlyRate ?? 150;
  });
  const [luggageDayPassRate, setLuggageDayPassRate] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`hotel_luggage_daypass_${currentMerchant?.id || 'default'}`);
        if (stored) return Number(stored);
      } catch {}
    }
    return currentMerchant?.metadata?.luggageDayPassRate ?? 500;
  });

  // Property Showcase Details displayed on customer venue page
  const [galleryImages, setGalleryImages] = useState<string[]>(
    currentMerchant?.gallery || [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80'
    ]
  );
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const [amenitiesList, setAmenitiesList] = useState<string[]>(
    currentMerchant?.amenities || [
      'Free High-Speed Wi-Fi',
      'Air Conditioned Rooms',
      'Swimming Pool & Lounge',
      'Complimentary Breakfast',
      '24/7 Concierge & Room Service',
      'Valet Parking Available'
    ]
  );
  const [newAmenity, setNewAmenity] = useState('');

  const [policiesList, setPoliciesList] = useState<string[]>(
    (Array.isArray(currentMerchant?.policies) ? currentMerchant?.policies : null) || [
      'Check-in: 12:00 PM | Check-out: 11:00 AM',
      'Valid Government photo ID required at check-in for all adults',
      'Couples & families warmly welcomed; primary guest must be 18+',
      'Smoking strictly prohibited inside bedrooms; designated outdoor zones available'
    ]
  );
  const [newPolicy, setNewPolicy] = useState('');

  const [landmarks, setLandmarks] = useState<Array<{ name: string; distance: string }>>(
    currentMerchant?.aroundProperty || [
      { name: 'Marina Beach / Promenade', distance: '1.2 km' },
      { name: 'Chennai Central Railway Station', distance: '3.5 km' },
      { name: 'Express Avenue Shopping Mall', distance: '2.1 km' }
    ]
  );
  const [newLandmarkName, setNewLandmarkName] = useState('');
  const [newLandmarkDist, setNewLandmarkDist] = useState('');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 200;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.6);
          setLogoPreview(compressed);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const [activeModules, setActiveModules] = useState<string[]>(currentMerchant?.activeModules || ['bookings', 'staff', 'customers', 'map']);
  const [customDictionary, setCustomDictionary] = useState<Record<string, string>>(currentMerchant?.customDictionary || {});
  
  const handleToggleModule = (module: string) => {
    setActiveModules((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    );
  };

  const handleDictChange = (key: string, value: string) => {
    setCustomDictionary((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveModules = () => {
    if (currentMerchant) {
      updateMerchantModules(currentMerchant.id, activeModules, customDictionary);
      alert('Module settings saved successfully!');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMerchant) {
      updateMerchantProfile(currentMerchant.id, {
        merchantName: name,
        aboutText: about,
        about: about,
        logoUrl: logoPreview || undefined,
        address,
        city,
        latitude: parseFloat(latitude) || 13.0827,
        longitude: parseFloat(longitude) || 80.2707,
        gallery: galleryImages,
        amenities: amenitiesList,
        policies: policiesList,
        aroundProperty: landmarks,
        isLuxeVerified,
        starRating,
        tier,
        isPetFriendly,
        luggageHourlyRate: luggageRate,
        metadata: {
          ...(currentMerchant.metadata || {}),
          isLuggageStorageEnabled,
          luggageHourlyRate: luggageRate,
          luggageDayPassRate
        }
      });

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`hotel_luggage_enabled_${currentMerchant.id}`, String(isLuggageStorageEnabled));
          localStorage.setItem('hotel_luggage_enabled_default', String(isLuggageStorageEnabled));
          localStorage.setItem(`hotel_luggage_rate_${currentMerchant.id}`, String(luggageRate));
          localStorage.setItem('hotel_luggage_rate_default', String(luggageRate));
          localStorage.setItem(`hotel_luggage_daypass_${currentMerchant.id}`, String(luggageDayPassRate));
          localStorage.setItem('hotel_luggage_daypass_default', String(luggageDayPassRate));
        } catch {}
      }
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!currentMerchant || !mounted) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="h-16 w-16 rounded-full border-4 border-[#ff6325] border-t-transparent animate-spin" />
          <p className="text-[#0a3161] font-black tracking-widest uppercase text-xs">Initializing Secure Network...</p>
        </div>
      </div>
    );
  }

  const isHospital = currentMerchant.archetype === 'Healthcare';
  const settingsTitle = archetypeConfig.settingsLabel || 'Business Settings';

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-bg-secondary border border-border-brand/60 p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[40%] h-full bg-gradient-to-l from-[#ff6325]/5 to-transparent pointer-events-none" />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-text-primary">
          <Settings size={200} />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight mb-2">
            {settingsTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-text-secondary">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg-tertiary text-text-primary"><Building2 size={14} className="text-[#ff6325]" /> Business Profile</span>
            <span>•</span>
            <span className="text-text-primary font-bold">{currentMerchant.merchantName}</span>
          </div>
        </div>

        <div className="relative z-10 flex gap-3">
          {currentMerchant.username.startsWith('O') && (
            <button 
              onClick={() => {
                if(confirm('Are you sure you want to run the onboarding wizard again?')) {
                  useVendorStore.getState().resetOnboarding(currentMerchant.id);
                  window.location.reload();
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 shadow-lg font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              Reconfigure Dashboard
            </button>
          )}
          <button 
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white shadow-lg shadow-[#ff6325]/25 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
          >
            {isSaved ? <CheckCircle2 size={16} /> : <Save size={16} />} 
            {isSaved ? 'Saved successfully' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Main Form */}
        <div className="space-y-8">
          <div className="bg-bg-secondary rounded-3xl p-8 border border-border-brand/60 shadow-sm relative overflow-hidden group">
            <h2 className="text-lg font-black text-text-primary mb-6 flex items-center gap-2">
              <Building2 size={18} className="text-[#ff6325]" /> Core Business Details
            </h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Business Name</label>
                <div className="flex items-center gap-3 rounded-xl border border-border-brand/60 bg-bg-tertiary px-4 py-3 focus-within:border-[#ff6325] focus-within:ring-1 focus-within:ring-[#ff6325]/30 transition-all">
                  <Building2 className="h-4 w-4 text-text-muted shrink-0" />
                  <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-text-primary font-bold" 
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Company Email</label>
                    <span className="text-[8px] bg-[#ff6325]/15 text-[#ff6325] border border-[#ff6325]/30 font-black px-2 py-0.5 rounded uppercase tracking-wider">BNX Integrated</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border-brand/60 bg-bg-tertiary px-4 py-3 focus-within:border-[#ff6325] focus-within:ring-1 focus-within:ring-[#ff6325]/30 transition-all">
                    <Mail className="h-4 w-4 text-text-muted shrink-0" />
                    <input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-text-primary font-bold" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Telephone / Support Line</label>
                  <div className="flex items-center gap-3 rounded-xl border border-border-brand/60 bg-bg-tertiary px-4 py-3 focus-within:border-[#ff6325] focus-within:ring-1 focus-within:ring-[#ff6325]/30 transition-all">
                    <Phone className="h-4 w-4 text-text-muted shrink-0" />
                    <input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-text-primary font-bold" 
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Website URL</label>
                  <div className="flex items-center gap-3 rounded-xl border border-border-brand/60 bg-bg-tertiary px-4 py-3 focus-within:border-[#ff6325] focus-within:ring-1 focus-within:ring-[#ff6325]/30 transition-all">
                    <Globe className="h-4 w-4 text-text-muted shrink-0" />
                    <input 
                      value={website} 
                      onChange={(e) => setWebsite(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-text-primary font-bold" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">City Location</label>
                  <div className="flex items-center gap-3 rounded-xl border border-border-brand/60 bg-bg-tertiary px-4 py-3 focus-within:border-[#ff6325] focus-within:ring-1 focus-within:ring-[#ff6325]/30 transition-all">
                    <MapPin className="h-4 w-4 text-text-muted shrink-0" />
                    <input 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Chennai"
                      className="flex-1 bg-transparent outline-none text-sm text-text-primary font-bold" 
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Full Street Address & Landmark</label>
                <div className="flex items-center gap-3 rounded-xl border border-border-brand/60 bg-bg-tertiary px-4 py-3 focus-within:border-[#ff6325] focus-within:ring-1 focus-within:ring-[#ff6325]/30 transition-all">
                  <MapPin className="h-4 w-4 text-text-muted shrink-0" />
                  <input 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-text-primary font-bold" 
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Latitude (for Customer Map)</label>
                  <div className="flex items-center gap-3 rounded-xl border border-border-brand/60 bg-bg-tertiary px-4 py-3 focus-within:border-[#ff6325] transition-all">
                    <input 
                      value={latitude} 
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="13.0827"
                      className="flex-1 bg-transparent outline-none text-sm text-text-primary font-bold" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Longitude (for Customer Map)</label>
                  <div className="flex items-center gap-3 rounded-xl border border-border-brand/60 bg-bg-tertiary px-4 py-3 focus-within:border-[#ff6325] transition-all">
                    <input 
                      value={longitude} 
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="80.2707"
                      className="flex-1 bg-transparent outline-none text-sm text-text-primary font-bold" 
                    />
                  </div>
                </div>
              </div>

              {/* GST & Invoicing Settings */}
              <div className="p-5 rounded-2xl bg-bg-tertiary border border-border-brand/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-text-primary flex items-center gap-2">
                      📑 Tax & Invoicing Profile
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Configure whether this business issues formal GST Tax Invoices or Non-GST booking receipts.
                    </p>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${currentMerchant?.gstStatus === 'WITH_GST' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                    {currentMerchant?.gstStatus === 'WITH_GST' ? 'GST Verified' : 'Non-GST Individual'}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">GST Registration Status</label>
                    <select
                      value={currentMerchant?.gstStatus || 'WITH_GST'}
                      onChange={(e) => updateMerchantProfile(currentMerchant.id, { gstStatus: e.target.value as any })}
                      className="w-full rounded-xl border border-border-brand/60 bg-bg-secondary px-4 py-3 text-sm text-text-primary font-bold focus:border-[#ff6325] outline-none"
                    >
                      <option value="WITH_GST">With GST (Formal Tax Invoice with 18% / 12% / 5%)</option>
                      <option value="WITHOUT_GST">Without GST (Individual Provider - Flat Nett Receipt)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">GSTIN Number</label>
                    <input
                      value={currentMerchant?.gstNumber || '33AAAAA0000A1Z5'}
                      onChange={(e) => updateMerchantProfile(currentMerchant.id, { gstNumber: e.target.value.toUpperCase() })}
                      placeholder="e.g. 33AAAAA0000A1Z5"
                      disabled={currentMerchant?.gstStatus === 'WITHOUT_GST'}
                      className="w-full rounded-xl border border-border-brand/60 bg-bg-secondary px-4 py-3 text-sm text-text-primary font-bold focus:border-[#ff6325] outline-none tracking-wider disabled:opacity-40"
                    />
                  </div>
                </div>
              </div>


              {/* Venue & Property Configuration Redirection Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#ff6325]/10 via-bg-tertiary to-[#ff6325]/5 border border-[#ff6325]/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-[#ff6325] text-white">
                        <Building2 size={18} />
                      </span>
                      <h3 className="text-base font-black text-text-primary">
                        Venue, Amenities & Smart Bag Locker
                      </h3>
                    </div>
                    <p className="text-xs text-text-secondary max-w-xl">
                      Property showcase details (Amenities, Gallery Photos, Pet Policy, Check-in/out hours, House Rules, and Bag Locker cloakroom tariffs) are now managed under your dedicated <strong>Venue Profile</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push('/workspace/about')}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#ff6325] hover:bg-[#e04e13] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#ff6325]/20 cursor-pointer transition-all shrink-0"
                  >
                    <span>Edit Venue Profile</span>
                    <span>&rarr;</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div className="p-2.5 rounded-xl bg-bg-secondary border border-border-brand text-center relative flex flex-col items-center justify-between">
                    <div>
                      <span className="text-sm block">🧳</span>
                      <span className="text-[11px] font-bold text-text-primary block mt-1">Bag Locker</span>
                      <span className="text-[10px] text-amber-500 font-bold block mb-1">
                        {isLuggageStorageEnabled ? `₹${luggageRate}/hr` : 'Disabled'}
                      </span>
                    </div>
                    {/* Quick Interactive Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleLuggageStorage(!isLuggageStorageEnabled)}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isLuggageStorageEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      title={isLuggageStorageEnabled ? 'Click to Disable Mini Space' : 'Click to Enable Mini Space'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isLuggageStorageEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-bg-secondary border border-border-brand text-center">
                    <span className="text-sm block">🐾</span>
                    <span className="text-[11px] font-bold text-text-primary block mt-1">Pet Policy</span>
                    <span className="text-[10px] text-emerald-500 font-bold">{isPetFriendly ? 'Allowed' : 'No Pets'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-bg-secondary border border-border-brand text-center">
                    <span className="text-sm block">✨</span>
                    <span className="text-[11px] font-bold text-text-primary block mt-1">Amenities</span>
                    <span className="text-[10px] text-text-secondary font-bold">{amenitiesList.length} Active</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-bg-secondary border border-border-brand text-center">
                    <span className="text-sm block">📸</span>
                    <span className="text-[11px] font-bold text-text-primary block mt-1">Gallery</span>
                    <span className="text-[10px] text-text-secondary font-bold">{galleryImages.length} Photos</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Archetype Specific Settings */}
              <div className="pt-6 border-t border-border-brand/40">
                <h3 className="text-sm font-black text-text-primary mb-4">{archetypeConfig?.hasOutdoorConditions ? 'Pitch Configuration' : isHospital ? 'Emergency Protocols' : isService ? 'Service Regions' : 'Preferences'}</h3>
                
                <div className="space-y-4">
                  {archetypeConfig?.hasOutdoorConditions && (
                    <>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-border-brand/60 bg-bg-tertiary cursor-pointer hover:border-[#ff6325]/40 transition-all">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#22c55e]" />
                        <span className="text-sm font-bold text-text-primary">Enable Automated Floodlights Integration</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-border-brand/60 bg-bg-tertiary cursor-pointer hover:border-[#ff6325]/40 transition-all">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#22c55e]" />
                        <span className="text-sm font-bold text-text-primary">Allow Rain Bookings (Non-Refundable)</span>
                      </label>
                    </>
                  )}
                  {isHospital && (
                    <>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-border-brand/60 bg-bg-tertiary cursor-pointer hover:border-[#ff6325]/40 transition-all">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0ea5e9]" />
                        <span className="text-sm font-bold text-text-primary">Enable 24/7 ER Access Routing</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-border-brand/60 bg-bg-tertiary cursor-pointer hover:border-[#ff6325]/40 transition-all">
                        <input type="checkbox" className="w-4 h-4 accent-[#0ea5e9]" />
                        <span className="text-sm font-bold text-text-primary">Auto-route Critical Patients to Apollo Main</span>
                      </label>
                    </>
                  )}

                  {(!archetypeConfig?.hasOutdoorConditions && !isHospital && !isService) && (
                     <label className="flex items-center gap-3 p-4 rounded-xl border border-border-brand/60 bg-bg-tertiary cursor-pointer hover:border-[#ff6325]/40 transition-all">
                     <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#ff6325]" />
                     <span className="text-sm font-bold text-text-primary">Enable Walk-in Bookings</span>
                   </label>
                  )}
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
