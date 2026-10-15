'use client';

import { useVendorStore } from '@/lib/store';
import { getArchetypeConfig } from '@/lib/businessDictionary';
import { 
  Building2, Mail, Phone, Globe, MapPin, Save, Info, User,
  CheckCircle2, Clock, Camera, Settings, ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
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
        aroundProperty: landmarks
      });
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

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">About Description</label>
                <div className="flex items-start gap-3 rounded-xl border border-border-brand/60 bg-bg-tertiary px-4 py-3 focus-within:border-[#ff6325] focus-within:ring-1 focus-within:ring-[#ff6325]/30 transition-all">
                  <Info className="h-4 w-4 text-text-muted shrink-0 mt-1" />
                  <textarea 
                    rows={4}
                    value={about} 
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Tell guests about your property, ambience, hospitality, and signature offerings..."
                    className="flex-1 bg-transparent outline-none text-sm text-text-primary font-bold resize-none leading-relaxed" 
                    required
                  />
                </div>
              </div>

              {/* Customer Page Hero Gallery Management */}
              <div className="pt-6 border-t border-border-brand/40 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-black text-text-primary flex items-center gap-2">
                      <Camera size={16} className="text-[#ff6325]" /> Property Gallery Photos (Customer Hero Grid)
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      The top 3 photos appear directly on your customer booking hero showcase.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="relative rounded-2xl overflow-hidden border border-border-brand bg-bg-tertiary group h-36">
                      <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
                        <button
                          type="button"
                          onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                      <span className="absolute bottom-1.5 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-white">
                        {idx === 0 ? 'Primary Cover' : `Photo #${idx + 1}`}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste high-res image URL (e.g. https://images.unsplash.com/...)"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border-brand/60 bg-bg-tertiary text-sm text-text-primary font-medium focus:border-[#ff6325] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newGalleryUrl.trim()) {
                        setGalleryImages([...galleryImages, newGalleryUrl.trim()]);
                        setNewGalleryUrl('');
                      }
                    }}
                    className="px-5 py-2.5 bg-[#0a3161] hover:bg-[#124b8f] text-white font-bold text-xs rounded-xl uppercase tracking-wider shrink-0 cursor-pointer"
                  >
                    Add Photo
                  </button>
                </div>
              </div>

              {/* Amenities Management */}
              <div className="pt-6 border-t border-border-brand/40 space-y-4">
                <h3 className="text-sm font-black text-text-primary flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" /> Property Amenities & Facilities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {amenitiesList.map((amenity, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-tertiary border border-border-brand text-xs font-bold text-text-primary">
                      <span>✓</span>
                      <span>{amenity}</span>
                      <button 
                        type="button" 
                        onClick={() => setAmenitiesList(amenitiesList.filter((_, i) => i !== idx))}
                        className="ml-1 text-slate-400 hover:text-red-500 font-extrabold cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add an amenity (e.g., Free Wi-Fi, Swimming Pool, In-house Restaurant, Valet Parking)"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border-brand/60 bg-bg-tertiary text-sm text-text-primary font-medium focus:border-[#ff6325] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newAmenity.trim()) {
                        setAmenitiesList([...amenitiesList, newAmenity.trim()]);
                        setNewAmenity('');
                      }
                    }}
                    className="px-5 py-2.5 bg-[#ff6325] hover:brightness-110 text-white font-bold text-xs rounded-xl uppercase tracking-wider shrink-0 cursor-pointer"
                  >
                    Add Amenity
                  </button>
                </div>
              </div>

              {/* House Rules & Policies */}
              <div className="pt-6 border-t border-border-brand/40 space-y-4">
                <h3 className="text-sm font-black text-text-primary flex items-center gap-2">
                  <Info size={16} className="text-blue-400" /> House Rules & Booking Policies
                </h3>
                <div className="space-y-2">
                  {policiesList.map((policy, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-bg-tertiary border border-border-brand text-xs font-semibold text-text-primary">
                      <span>• {policy}</span>
                      <button 
                        type="button" 
                        onClick={() => setPoliciesList(policiesList.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-500 font-extrabold cursor-pointer px-2"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add policy (e.g., Check-in from 12 PM, Government ID required, No smoking inside)"
                    value={newPolicy}
                    onChange={(e) => setNewPolicy(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border-brand/60 bg-bg-tertiary text-sm text-text-primary font-medium focus:border-[#ff6325] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newPolicy.trim()) {
                        setPoliciesList([...policiesList, newPolicy.trim()]);
                        setNewPolicy('');
                      }
                    }}
                    className="px-5 py-2.5 bg-[#0a3161] hover:bg-[#124b8f] text-white font-bold text-xs rounded-xl uppercase tracking-wider shrink-0 cursor-pointer"
                  >
                    Add Policy
                  </button>
                </div>
              </div>

              {/* Nearby Landmarks */}
              <div className="pt-6 border-t border-border-brand/40 space-y-4">
                <h3 className="text-sm font-black text-text-primary flex items-center gap-2">
                  <MapPin size={16} className="text-amber-400" /> Nearby Landmarks & Attractions
                </h3>
                <div className="space-y-2">
                  {landmarks.map((lm, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-bg-tertiary border border-border-brand text-xs font-bold text-text-primary">
                      <span>📍 {lm.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-blue-400 font-extrabold">{lm.distance}</span>
                        <button 
                          type="button" 
                          onClick={() => setLandmarks(landmarks.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-red-500 font-extrabold cursor-pointer px-2"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="text"
                    placeholder="Landmark name (e.g. Marina Beach, Airport Terminal 1, Metro Station)"
                    value={newLandmarkName}
                    onChange={(e) => setNewLandmarkName(e.target.value)}
                    className="sm:col-span-8 px-4 py-2.5 rounded-xl border border-border-brand/60 bg-bg-tertiary text-sm text-text-primary font-medium focus:border-[#ff6325] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Distance (e.g. 1.2 km)"
                    value={newLandmarkDist}
                    onChange={(e) => setNewLandmarkDist(e.target.value)}
                    className="sm:col-span-2 px-4 py-2.5 rounded-xl border border-border-brand/60 bg-bg-tertiary text-sm text-text-primary font-medium focus:border-[#ff6325] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newLandmarkName.trim() && newLandmarkDist.trim()) {
                        setLandmarks([...landmarks, { name: newLandmarkName.trim(), distance: newLandmarkDist.trim() }]);
                        setNewLandmarkName('');
                        setNewLandmarkDist('');
                      }
                    }}
                    className="sm:col-span-2 px-4 py-2.5 bg-[#ff6325] hover:brightness-110 text-white font-bold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
                  >
                    Add
                  </button>
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
