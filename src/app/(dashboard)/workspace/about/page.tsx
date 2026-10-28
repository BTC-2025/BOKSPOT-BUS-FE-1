'use client';

import { useState, useEffect } from 'react';
import { useVendorStore } from '@/lib/store';
import { 
  Building2, Info, CheckSquare, Image as ImageIcon, Plus, X, Save, 
  MapPin, Phone, Globe, Mail, Clock, ShieldCheck, CheckCircle2, ChevronRight, Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VenueProfilePage() {
  const router = useRouter();
  const { currentMerchant, updateMerchantProfile } = useVendorStore();
  const [mounted, setMounted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Core & About
  const [merchantName, setMerchantName] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [aboutText, setAboutText] = useState('');

  // Operational Times
  const [checkInTime, setCheckInTime] = useState('12:00 PM');
  const [checkOutTime, setCheckOutTime] = useState('11:00 AM');
  const [operatingHours, setOperatingHours] = useState('24/7 Front Desk');

  // Amenities
  const [thingsToKnow, setThingsToKnow] = useState<string[]>([]);
  const [newThing, setNewThing] = useState('');

  // Policies
  const [policies, setPolicies] = useState<string[]>([]);
  const [newPolicy, setNewPolicy] = useState('');

  // Gallery
  const [gallery, setGallery] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Property Highlights
  const [highlights, setHighlights] = useState<Array<{ title: string; description: string; icon?: string }>>([
    { title: 'Great breakfast & inclusions', description: 'Breakfast buffet gets strong praise for its wide spread, varied choices, and fresh multi-cuisine preparations.', icon: '🍳' },
    { title: 'Great food & dining', description: 'In-house multi-cuisine dining options with seafood specialties and room service options praised by guests.', icon: '🍽️' },
    { title: 'Professional guest services', description: 'Dedicated 24/7 front desk, warm concierge, express check-in, and personalized butler assistance.', icon: '🛎️' },
    { title: 'Sparkling clean & hygienic', description: 'Rooms are regularly sanitized and described as clean, neat, and well kept with spotless linen.', icon: '✨' },
    { title: 'Top property leisure facilities', description: 'Private swimming pool, lawn garden, sun deck, and entertainment conveniences designed for staycations.', icon: '🏊' },
  ]);
  const [newHighlightTitle, setNewHighlightTitle] = useState('');
  const [newHighlightDesc, setNewHighlightDesc] = useState('');
  const [newHighlightIcon, setNewHighlightIcon] = useState('⭐');

  // Location & Around Property State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [postalCode, setPostalCode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [aroundProperty, setAroundProperty] = useState<Array<{ name: string; distance: string }>>([]);
  const [newLandmarkName, setNewLandmarkName] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Smart Keyword to Icon Auto-Detection Dictionary
  const detectIconFromText = (text: string): string => {
    const t = text.toLowerCase().trim();
    if (!t) return '⭐';

    if (/breakfast|egg|omelet|dosa|idli|morning meal/i.test(t)) return '🍳';
    if (/pool|swim|jacuzzi|water/i.test(t)) return '🏊';
    if (/food|dining|restaurant|dinner|lunch|buffet|culinary|chef|meal|kitchen|snack/i.test(t)) return '🍽️';
    if (/coffee|tea|cafe|espresso|beverage/i.test(t)) return '☕';
    if (/bar|cocktail|drinks|lounge|pub|brew/i.test(t)) return '🍸';
    if (/wifi|internet|speed|broadband|network/i.test(t)) return '📶';
    if (/clean|hygiene|sanitized|tidy|spotless|housekeeping|linen/i.test(t)) return '✨';
    if (/service|concierge|front desk|reception|butler|staff|bellboy/i.test(t)) return '🛎️';
    if (/park|parking|valet|garage|car/i.test(t)) return '🚗';
    if (/pet|dog|cat|puppy|animal/i.test(t)) return '🐾';
    if (/ac|air condition|climate|cooling|cool/i.test(t)) return '❄️';
    if (/tv|screen|netflix|smart tv|entertainment|theatre/i.test(t)) return '📺';
    if (/gym|fitness|workout|exercise|dumbbell|yoga/i.test(t)) return '🏋️';
    if (/spa|massage|sauna|wellness|relax|steam/i.test(t)) return '💆';
    if (/beach|sea|ocean|coast|sand|shore/i.test(t)) return '🏖️';
    if (/mountain|hill|view|valley|peak/i.test(t)) return '⛰️';
    if (/garden|lawn|nature|green|flora|park/i.test(t)) return '🌿';
    if (/turf|football|cricket|sports|arena|ground|play/i.test(t)) return '⚽';
    if (/security|safe|guard|cctv|lock|shield|secure/i.test(t)) return '🛡️';
    if (/power|generator|backup|electricity|charging|ev/i.test(t)) return '⚡';
    if (/bed|room|suite|pillow|sleep|comfort/i.test(t)) return '🛏️';
    if (/child|kid|play area|family|baby/i.test(t)) return '🧸';
    if (/music|party|bonfire|campfire|dance|dj/i.test(t)) return '🔥';
    if (/location|center|prime|accessible|near/i.test(t)) return '📍';
    if (/award|luxury|star|premium|vip|elite|best/i.test(t)) return '🏆';

    return '⭐';
  };
  const [newLandmarkDist, setNewLandmarkDist] = useState('');

  useEffect(() => {
    setMounted(true);
    if (currentMerchant) {
      setMerchantName(currentMerchant.merchantName || '');
      setPhone(currentMerchant.phone || '');
      setWebsite(currentMerchant.website || '');
      setAboutText(currentMerchant.aboutText || currentMerchant.about || '');
      setThingsToKnow(currentMerchant.thingsToKnow || currentMerchant.amenities || [
        'Free Wi-Fi', 'Swimming Pool', 'Air Conditioning', 'Valet Parking', '24/7 Front Desk'
      ]);
      setGallery(currentMerchant.gallery || []);
      setAddress(currentMerchant.address || '');
      setCity(currentMerchant.city || 'Chennai');
      setState((currentMerchant as any).state || 'Tamil Nadu');
      setPostalCode((currentMerchant as any).postalCode || '');
      if (currentMerchant.latitude) setLatitude(String(currentMerchant.latitude));
      if (currentMerchant.longitude) setLongitude(String(currentMerchant.longitude));
      
      if (currentMerchant.policies) {
        setPolicies(Array.isArray(currentMerchant.policies) ? currentMerchant.policies : []);
      }
      if (currentMerchant.aroundProperty) {
        setAroundProperty(currentMerchant.aroundProperty);
      }
      if (currentMerchant.highlights && Array.isArray(currentMerchant.highlights) && currentMerchant.highlights.length > 0) {
        setHighlights(currentMerchant.highlights);
      }
      if ((currentMerchant as any).checkInTime) setCheckInTime((currentMerchant as any).checkInTime);
      if ((currentMerchant as any).checkOutTime) setCheckOutTime((currentMerchant as any).checkOutTime);
      if ((currentMerchant as any).operatingHours) setOperatingHours((currentMerchant as any).operatingHours);

      // Fetch fresh DB data
      const fetchProfile = async () => {
        try {
          const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || (isProd ? 'https://bokspot-be.onrender.com/api/v1' : 'http://localhost:9000/api/v1');

          const res = await fetch(`${baseUrl}/merchants/${currentMerchant.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.name) setMerchantName(data.name);
            if (data.phone) setPhone(data.phone);
            if (data.website) setWebsite(data.website);
            if (data.description) setAboutText(data.description);
            if (data.amenities?.length) setThingsToKnow(data.amenities);
            if (data.images?.length) setGallery(data.images);
            if (data.address) setAddress(data.address);
            if (data.city) setCity(data.city);
            if (data.state) setState(data.state);
            if (data.postalCode) setPostalCode(data.postalCode);
            if (data.latitude) setLatitude(String(data.latitude));
            if (data.longitude) setLongitude(String(data.longitude));
            if (data.metadata?.policies) setPolicies(data.metadata.policies);
            if (data.metadata?.aroundProperty) setAroundProperty(data.metadata.aroundProperty);
            if (data.metadata?.highlights && Array.isArray(data.metadata.highlights) && data.metadata.highlights.length > 0) {
              setHighlights(data.metadata.highlights);
            }
            if (data.metadata?.checkInTime) setCheckInTime(data.metadata.checkInTime);
            if (data.metadata?.checkOutTime) setCheckOutTime(data.metadata.checkOutTime);
            if (data.metadata?.operatingHours) setOperatingHours(data.metadata.operatingHours);
          }
        } catch (err) {
          console.error('Failed to fetch merchant profile', err);
        }
      };
      fetchProfile();
    }
  }, [currentMerchant?.id]);

  if (!mounted || !currentMerchant) return null;

  const handleAddThing = () => {
    if (newThing.trim() && !thingsToKnow.includes(newThing.trim())) {
      setThingsToKnow([...thingsToKnow, newThing.trim()]);
      setNewThing('');
    }
  };

  const handleRemoveThing = (item: string) => {
    setThingsToKnow(thingsToKnow.filter(t => t !== item));
  };

  const handleAddPolicy = () => {
    if (newPolicy.trim() && !policies.includes(newPolicy.trim())) {
      setPolicies([...policies, newPolicy.trim()]);
      setNewPolicy('');
    }
  };

  const handleRemovePolicy = (item: string) => {
    setPolicies(policies.filter(p => p !== item));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const compressPromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 1200;
              const scaleSize = Math.min(1, MAX_WIDTH / img.width);
              canvas.width = img.width * scaleSize;
              canvas.height = img.height * scaleSize;

              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
              resolve(compressedBase64);
            };
            img.onerror = reject;
            img.src = event.target?.result as string;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const newBase64s = await Promise.all(compressPromises);
      setGallery((prev) => Array.from(new Set([...prev, ...newBase64s])));
    } catch (err) {
      console.error('Multi-file compression error', err);
    } finally {
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    await updateMerchantProfile(currentMerchant.id, {
      merchantName,
      phone,
      website,
      aboutText,
      about: aboutText,
      thingsToKnow,
      amenities: thingsToKnow,
      gallery,
      policies,
      address,
      city,
      state,
      postalCode,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      aroundProperty,
      highlights,
      checkInTime,
      checkOutTime,
      operatingHours,
    } as any);

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-28 animate-fade-in font-sans">
      
      {/* Top Header & Save Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <button
            type="button"
            onClick={() => router.push('/workspace/my-services')}
            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-[#ff6325] font-bold text-xs mb-3 transition-colors cursor-pointer"
          >
            &larr; Back to Services
          </button>
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#ff6325] text-white flex items-center justify-center font-bold shadow-md shadow-[#ff6325]/30 ring-4 ring-[#ff6325]/15 shrink-0">
              <Building2 size={22} className="text-white stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Venue & Property Profile
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5">
                Configure public profile, contact, amenities, hours, and navigation details for <strong className="text-slate-900 dark:text-white">{currentMerchant.merchantName}</strong>.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 active:scale-95 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff6325]/25 transition-all cursor-pointer shrink-0"
        >
          {isSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {isSaved ? 'Saved Successfully!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">

        {/* 1. Core Property & Contact Info */}
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl shadow-sm border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 transition-all">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/25 ring-4 ring-blue-500/15 shrink-0">
              <Building2 size={18} className="text-white stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">1. Core Property & Contact Details</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Direct phone, web link, and venue introduction for booking guests.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Venue / Business Name
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033]">
                <Building2 size={15} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="e.g. Sunstone Luxury Resort & Arena"
                  className="w-full bg-transparent text-slate-900 dark:text-white font-medium text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Guest Help / Concierge Phone
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033]">
                <Phone size={15} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-transparent text-slate-900 dark:text-white font-medium text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Official Website
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033]">
                <Globe size={15} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. https://www.sunstoneresort.com"
                  className="w-full bg-transparent text-slate-900 dark:text-white font-medium text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Operating Schedule
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033]">
                <Clock size={15} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  placeholder="e.g. 24/7 Front Desk or 06:00 AM - 11:00 PM"
                  className="w-full bg-transparent text-slate-900 dark:text-white font-medium text-xs outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              About Property & Ambiance Story
            </label>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Welcome to Sunstone Resort. Escape to serenity with private beach access, infinity pool, multi-cuisine dining, and luxury villa suites..."
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs outline-none focus:border-[#ff6325] transition-all leading-relaxed"
            />
          </div>
        </div>

        {/* 2. Check-in / Check-out & Operating Timings */}
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl shadow-sm border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 transition-all">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/25 ring-4 ring-amber-500/15 shrink-0">
              <Clock size={18} className="text-white stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">2. Check-in & Check-out Window</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Clear timing guidelines displayed prominently to guests upon booking.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Standard Check-in Time
              </label>
              <input
                type="text"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                placeholder="e.g. 12:00 PM or 02:00 PM"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs outline-none focus:border-[#ff6325]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Standard Check-out Time
              </label>
              <input
                type="text"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                placeholder="e.g. 11:00 AM"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs outline-none focus:border-[#ff6325]"
              />
            </div>
          </div>
        </div>

        {/* 3. Amenities & Facilities */}
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl shadow-sm border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 transition-all">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/25 ring-4 ring-emerald-500/15 shrink-0">
              <CheckSquare size={18} className="text-white stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">3. Property Amenities & Facilities</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add verified conveniences like Free Wi-Fi, Valet Parking, Infinity Pool, Elevator, Spa, etc.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {thingsToKnow.map((thing, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-500/20">
                <span>✓</span> {thing}
                <button 
                  type="button" 
                  onClick={() => handleRemoveThing(thing)} 
                  className="hover:text-red-500 ml-1 cursor-pointer font-bold"
                >
                  &times;
                </button>
              </span>
            ))}
            {thingsToKnow.length === 0 && (
              <p className="text-xs text-slate-400 italic py-1">No amenities added yet.</p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newThing}
              onChange={(e) => setNewThing(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddThing())}
              placeholder="e.g. Free Wi-Fi, Valet Parking, Multi-cuisine Restaurant, Private Beach"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs focus:border-[#ff6325] outline-none"
            />
            <button 
              type="button" 
              onClick={handleAddThing} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
            >
              Add
            </button>
          </div>
        </div>

        {/* 4. House Rules & Stay Policies */}
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl shadow-sm border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 transition-all">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/25 ring-4 ring-indigo-500/15 shrink-0">
              <ShieldCheck size={18} className="text-white stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">4. House Rules & Stay Policies</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Specify ID requirements, couples policy, pet rules, and smoking restrictions.</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 mb-4">
            {policies.map((policy, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-[#162033] text-slate-800 dark:text-slate-200 px-4 py-3 rounded-xl border border-slate-200/80 dark:border-white/10">
                <span className="font-medium text-xs leading-relaxed">• {policy}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemovePolicy(policy)} 
                  className="text-slate-400 hover:text-red-500 ml-2 cursor-pointer font-bold text-sm"
                >
                  &times;
                </button>
              </div>
            ))}
            {policies.length === 0 && (
              <p className="text-xs text-slate-400 italic py-1">No custom policies configured.</p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newPolicy}
              onChange={(e) => setNewPolicy(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPolicy())}
              placeholder="e.g. Valid Government Photo ID required at check-in (Aadhaar / Passport / Driving License)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs focus:border-[#ff6325] outline-none"
            />
            <button 
              type="button" 
              onClick={handleAddPolicy} 
              className="bg-[#ff6325] hover:bg-[#e04e13] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
            >
              Add Policy
            </button>
          </div>
        </div>

        {/* 5. Location & Map Coordinates */}
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl shadow-sm border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 transition-all">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-[#ff6325] text-white flex items-center justify-center font-bold shadow-md shadow-[#ff6325]/25 ring-4 ring-[#ff6325]/15 shrink-0">
              <MapPin size={18} className="text-white stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">5. Location & Map Coordinates</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Full address, pin code, and GPS coordinates for guest navigation and Google Maps routing.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Address Line
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 142 East Coast Road, Kovalam Beach Road"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs outline-none focus:border-[#ff6325]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Chennai"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs outline-none focus:border-[#ff6325]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Tamil Nadu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs outline-none focus:border-[#ff6325]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  PIN / Postal Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 603112"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs outline-none focus:border-[#ff6325]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Latitude (GPS)
                </label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g. 12.8797"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs outline-none focus:border-[#ff6325]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Longitude (GPS)
                </label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g. 80.2435"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs outline-none focus:border-[#ff6325]"
                />
              </div>
            </div>

            {latitude && longitude && (
              <div className="pt-1">
                <a
                  href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#ff6325] hover:underline inline-flex items-center gap-1.5"
                >
                  📍 Open live pin on Google Maps &rarr;
                </a>
              </div>
            )}
          </div>

          {/* Around Property Landmarks */}
          <div className="pt-6 border-t border-slate-100 dark:border-white/5">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 uppercase tracking-wider">
              Around Property (Nearby Landmarks & Transit)
            </h3>
            <p className="text-xs text-slate-400 mb-4">Add nearby transit, beach, airport, or mall with distance indicators.</p>

            <div className="flex flex-col gap-2 mb-4">
              {aroundProperty.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-[#162033] px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10">
                  <span className="font-semibold text-xs text-slate-800 dark:text-white">📍 {item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-[#ff6325] bg-[#ff6325]/10 px-2 py-0.5 rounded-md border border-[#ff6325]/20">
                      {item.distance}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAroundProperty(aroundProperty.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer font-bold text-sm"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
              {aroundProperty.length === 0 && (
                <p className="text-xs text-slate-400 italic py-1">No landmarks added yet.</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newLandmarkName}
                onChange={(e) => setNewLandmarkName(e.target.value)}
                placeholder="Landmark (e.g. Covelong Beach, Chennai Airport)"
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033] text-slate-900 dark:text-white text-xs font-medium outline-none focus:border-[#ff6325]"
              />
              <input
                type="text"
                value={newLandmarkDist}
                onChange={(e) => setNewLandmarkDist(e.target.value)}
                placeholder="Distance (e.g. 500 m / 18 km)"
                className="w-full sm:w-44 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033] text-slate-900 dark:text-white text-xs font-medium outline-none focus:border-[#ff6325]"
              />
              <button
                type="button"
                onClick={() => {
                  if (newLandmarkName.trim()) {
                    setAroundProperty([...aroundProperty, { name: newLandmarkName.trim(), distance: newLandmarkDist.trim() || 'Nearby' }]);
                    setNewLandmarkName('');
                    setNewLandmarkDist('');
                  }
                }}
                className="bg-slate-900 hover:bg-[#ff6325] text-white px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                Add Landmark
              </button>
            </div>
          </div>
        </div>

        {/* 6. Property Highlights */}
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl shadow-sm border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 transition-all">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/25 ring-4 ring-amber-500/15 shrink-0">
              <Sparkles size={18} className="text-white stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">6. Property Highlights & Key Selling Points</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                These highlights display directly on the customer Overview page (e.g., breakfast buffet, dining options, 24/7 front desk, sanitization).
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            {highlights.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-base shrink-0">
                    {item.icon || '⭐'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setHighlights(highlights.filter((_, i) => i !== idx))}
                  className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer font-bold text-sm shrink-0 p-1"
                  title="Remove Highlight"
                >
                  &times;
                </button>
              </div>
            ))}
            {highlights.length === 0 && (
              <p className="text-xs text-slate-400 italic py-1">No highlights added yet.</p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#121a29] border border-slate-200/70 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#ff6325]" />
                Add New Highlight
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">✨ Icon auto-detected from title</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Auto-detected Icon button with quick-selector popover */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  title="Click to change icon"
                  className="h-10 w-11 rounded-xl border-2 border-dashed border-[#ff6325]/40 hover:border-[#ff6325] bg-white dark:bg-[#162033] flex items-center justify-center text-lg shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {newHighlightIcon}
                </button>

                {/* Quick Icon Selector Dropdown */}
                {showIconPicker && (
                  <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-white/15 rounded-2xl shadow-xl z-50 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Select Icon</span>
                      <button
                        type="button"
                        onClick={() => setShowIconPicker(false)}
                        className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="grid grid-cols-6 gap-1.5 max-h-40 overflow-y-auto p-0.5">
                      {['🍳', '🏊', '🍽️', '☕', '🍸', '📶', '✨', '🛎️', '🚗', '🐾', '❄️', '📺', '🏋️', '💆', '🏖️', '⛰️', '🌿', '⚽', '🛡️', '⚡', '🛏️', '🧸', '🔥', '📍'].map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => {
                            setNewHighlightIcon(icon);
                            setShowIconPicker(false);
                          }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-base hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${newHighlightIcon === icon ? 'bg-orange-100 dark:bg-orange-950/50 ring-1 ring-[#ff6325]' : ''}`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Title input with live smart detection */}
              <div className="flex-1">
                <input
                  type="text"
                  value={newHighlightTitle}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewHighlightTitle(val);
                    // Smart auto-detection based on user typing
                    const autoIcon = detectIconFromText(val);
                    setNewHighlightIcon(autoIcon);
                  }}
                  placeholder="e.g. Free Breakfast Buffet, Swimming Pool, High Speed WiFi..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#162033] text-slate-900 dark:text-white text-xs font-bold outline-none focus:border-[#ff6325] transition-all"
                />
              </div>
            </div>

            <div>
              <textarea
                value={newHighlightDesc}
                onChange={(e) => setNewHighlightDesc(e.target.value)}
                rows={2}
                placeholder="Highlight details (e.g. Wide spread multi-cuisine breakfast freshly prepared every morning.)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#162033] text-slate-900 dark:text-white text-xs font-medium outline-none focus:border-[#ff6325] resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (newHighlightTitle.trim()) {
                    setHighlights([
                      ...highlights,
                      {
                        title: newHighlightTitle.trim(),
                        description: newHighlightDesc.trim() || 'Verified amenity and feature of this property.',
                        icon: newHighlightIcon.trim() || '⭐'
                      }
                    ]);
                    setNewHighlightTitle('');
                    setNewHighlightDesc('');
                    setNewHighlightIcon('⭐');
                  }
                }}
                className="bg-[#ff6325] hover:bg-[#e04e13] text-white px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                Add Highlight
              </button>
            </div>
          </div>
        </div>

        {/* 7. Photo Gallery */}
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl shadow-sm border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 transition-all">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/25 ring-4 ring-purple-500/15 shrink-0">
                <ImageIcon size={18} className="text-white stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">7. Venue Photo Showcase Gallery</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">High-resolution photos of reception, pool, dining, architecture, and garden grounds.</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {gallery.length} {gallery.length === 1 ? 'photo' : 'photos'} uploaded
            </span>
          </div>

          {/* Dedicated Folder / Multi-File Dropzone Area */}
          <div
            onClick={() => document.getElementById('gallery-upload')?.click()}
            className="mb-5 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/15 hover:border-[#ff6325] bg-slate-50/70 dark:bg-[#162033] flex flex-col items-center justify-center cursor-pointer transition-all group shadow-inner text-center"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 text-[#ff6325] flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform text-xl">
              📁
            </div>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200 block">
              Upload Folder or Select Multiple Photos
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Drag & drop or click to choose multiple files (Reception, Pool, Dining, Sunset, Grounds)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 mb-5">
            {gallery.map((url, idx) => (
              <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group bg-slate-100 dark:bg-[#162033] shadow-xs">
                <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 h-6 w-6 bg-black/75 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all shadow-md cursor-pointer"
                >
                  &times;
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1.5 left-2 bg-[#ff6325] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                    Hero Cover
                  </span>
                )}
              </div>
            ))}
            {gallery.length === 0 && (
              <p className="text-xs text-slate-400 italic col-span-full py-2 text-center">No venue showcase photos uploaded yet. Click the box above or paste a link below.</p>
            )}
          </div>

          {/* Hidden input triggered by the dropzone card above */}
          <input
            type="file"
            accept="image/*"
            multiple
            id="gallery-upload"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Web link input for quick image URL addition */}
          <div className="h-10 flex items-center">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData('text')?.trim();
                if (pasted && !gallery.includes(pasted)) {
                  e.preventDefault();
                  setGallery(prev => [...prev, pasted]);
                  setNewImageUrl('');
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (newImageUrl.trim() && !gallery.includes(newImageUrl.trim())) {
                    setGallery(prev => [...prev, newImageUrl.trim()]);
                    setNewImageUrl('');
                  }
                }
              }}
              onBlur={() => {
                if (newImageUrl.trim() && !gallery.includes(newImageUrl.trim())) {
                  setGallery(prev => [...prev, newImageUrl.trim()]);
                  setNewImageUrl('');
                }
              }}
              placeholder="Or paste photo web link here..."
              className="w-full h-full px-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#162033] text-slate-900 dark:text-white font-medium text-xs outline-none focus:border-[#ff6325]"
            />
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 active:scale-95 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff6325]/25 transition-all cursor-pointer"
          >
            {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {isSaved ? 'Venue Profile Saved!' : 'Save Venue Profile'}
          </button>
        </div>

      </div>
    </div>
  );
}
