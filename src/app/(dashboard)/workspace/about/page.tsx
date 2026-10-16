'use client';

import { useState, useEffect } from 'react';
import { useVendorStore } from '@/lib/store';
import { Building2, Info, CheckSquare, Image as ImageIcon, Plus, X, Save, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VenueProfilePage() {
  const router = useRouter();
  const { currentMerchant, updateMerchantProfile } = useVendorStore();
  const [mounted, setMounted] = useState(false);

  // Form State
  const [aboutText, setAboutText] = useState('');
  const [thingsToKnow, setThingsToKnow] = useState<string[]>([]);
  const [newThing, setNewThing] = useState('');

  const [policies, setPolicies] = useState<string[]>([]);
  const [newPolicy, setNewPolicy] = useState('');

  const [gallery, setGallery] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Location & Around Property State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [aroundProperty, setAroundProperty] = useState<Array<{ name: string; distance: string }>>([]);
  const [newLandmarkName, setNewLandmarkName] = useState('');
  const [newLandmarkDist, setNewLandmarkDist] = useState('');

  useEffect(() => {
    setMounted(true);
    if (currentMerchant) {
      // Fetch the real data from the backend to avoid stale localStorage data
      const fetchProfile = async () => {
        try {
          const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || (isProd ? 'https://bokspot-be.onrender.com/api/v1' : 'http://localhost:9000/api/v1');

          const res = await fetch(`${baseUrl}/merchants/${currentMerchant.id}`);
          if (res.ok) {
            const data = await res.json();
            setAboutText(data.description || '');
            setThingsToKnow(data.amenities || []);
            setGallery(data.images || []);
            setAddress(data.address || '');
            setCity(data.city || currentMerchant.city || '');
            if (data.latitude) setLatitude(String(data.latitude));
            if (data.longitude) setLongitude(String(data.longitude));
            if (data.metadata?.policies) {
              setPolicies(data.metadata.policies);
            }
            if (data.metadata?.aroundProperty) {
              setAroundProperty(data.metadata.aroundProperty);
            }
          } else {
            // Fallback to local state if backend fetch fails
            setAboutText(currentMerchant.aboutText || '');
            setThingsToKnow(currentMerchant.thingsToKnow || []);
            setGallery(currentMerchant.gallery || []);
            setAddress(currentMerchant.address || '');
            setCity(currentMerchant.city || 'Chennai');
            if (currentMerchant.latitude) setLatitude(String(currentMerchant.latitude));
            if (currentMerchant.longitude) setLongitude(String(currentMerchant.longitude));
            if ((currentMerchant as any).policies) {
              setPolicies((currentMerchant as any).policies);
            }
            if ((currentMerchant as any).aroundProperty) {
              setAroundProperty((currentMerchant as any).aroundProperty);
            }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          setGallery(prev => [...prev, compressedBase64]);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateMerchantProfile(currentMerchant.id, {
      aboutText,
      thingsToKnow,
      gallery,
      policies,
      address,
      city,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      aroundProperty
    } as any);
    alert('Venue Profile saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-4 border-b border-white/[0.08]">
        <div>
          <button
            onClick={() => router.push('/workspace/my-services')}
            className="flex items-center gap-2 text-slate-400 hover:text-[#ff6325] font-bold text-xs mb-3 transition-colors cursor-pointer"
          >
            &larr; Back to Services
          </button>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Building2 className="text-[#ff6325]" size={32} />
            Venue Profile
          </h1>
          <p className="text-slate-400 text-xs font-medium mt-1.5">
            Configure global details for <strong className="text-white">{currentMerchant.merchantName}</strong>. This information is displayed directly on your customer booking page.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 active:scale-95 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff6325]/25 transition-all cursor-pointer"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* About Section */}
        <div className="bg-[#0f1624] rounded-3xl shadow-xl border border-white/10 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#ff6325]/15 text-[#ff6325] flex items-center justify-center font-bold">
              <Info size={16} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">About Property / Venue</h2>
              <p className="text-xs text-slate-400">Describe your property, ambiance, and what guests can look forward to.</p>
            </div>
          </div>
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            placeholder="Welcome to our venue. We provide luxury comfort, 24/7 hospitality, and verified amenities..."
            className="w-full mt-4 px-4 py-3 rounded-2xl border border-white/10 focus:border-[#ff6325] focus:ring-2 focus:ring-[#ff6325]/20 transition-all font-medium bg-[#162033] text-white placeholder-slate-500 min-h-[130px] text-sm outline-none"
          />
        </div>

        {/* Things To Know (Amenities & Key Features) */}
        <div className="bg-[#0f1624] rounded-3xl shadow-xl border border-white/10 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
              <CheckSquare size={16} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Amenities & Facilities</h2>
              <p className="text-xs text-slate-400">Add amenities like Free Wi-Fi, Valet Parking, Restaurant, Swimming Pool, Elevator, etc.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 my-4">
            {thingsToKnow.map((thing, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-emerald-500/20">
                <span>✓</span> {thing}
                <button onClick={() => handleRemoveThing(thing)} className="hover:text-red-400 ml-1 cursor-pointer">
                  <X size={14} />
                </button>
              </span>
            ))}
            {thingsToKnow.length === 0 && (
              <p className="text-xs text-slate-500 italic py-1">No amenities added yet.</p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newThing}
              onChange={(e) => setNewThing(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddThing()}
              placeholder="e.g. Free Wi-Fi, Valet Parking, Multi-cuisine Restaurant"
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-[#162033] text-white placeholder-slate-500 focus:border-[#ff6325] transition-colors font-medium text-sm outline-none"
            />
            <button onClick={handleAddThing} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md">
              Add
            </button>
          </div>
        </div>

        {/* Policies */}
        <div className="bg-[#0f1624] rounded-3xl shadow-xl border border-white/10 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
              <Info size={16} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">House Rules & Stay Policies</h2>
              <p className="text-xs text-slate-400">Specify check-in times, photo ID rules, cancellation terms, or pet policies.</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 my-4">
            {policies.map((policy, idx) => (
              <div key={idx} className="flex justify-between items-center bg-[#162033] text-slate-200 px-4 py-3 rounded-xl border border-white/10">
                <span className="font-medium text-xs leading-relaxed">{policy}</span>
                <button onClick={() => handleRemovePolicy(policy)} className="text-slate-400 hover:text-red-400 ml-2 cursor-pointer">
                  <X size={16} />
                </button>
              </div>
            ))}
            {policies.length === 0 && (
              <p className="text-xs text-slate-500 italic py-1">No custom policies configured.</p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newPolicy}
              onChange={(e) => setNewPolicy(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPolicy()}
              placeholder="e.g. Government ID proof required at check-in"
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-[#162033] text-white placeholder-slate-500 focus:border-[#ff6325] transition-colors font-medium text-sm outline-none"
            />
            <button onClick={handleAddPolicy} className="bg-[#ff6325] hover:bg-[#e04e13] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md">
              Add Policy
            </button>
          </div>
        </div>

        {/* Location & Map Coordinates */}
        <div className="bg-[#0f1624] rounded-3xl shadow-xl border border-white/10 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#ff6325]/15 text-[#ff6325] flex items-center justify-center font-bold">
              <MapPin size={16} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Location & Map Coordinates</h2>
              <p className="text-xs text-slate-400">
                Provide precise address and Google Maps GPS coordinates for customer navigation.
              </p>
            </div>
          </div>

          <div className="space-y-4 my-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Full Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 142 Anna Salai, Thousand Lights, Chennai - 600006"
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#162033] text-white placeholder-slate-500 focus:border-[#ff6325] transition-colors font-medium text-sm outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Latitude (GPS)</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g. 13.0827"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#162033] text-white placeholder-slate-500 focus:border-[#ff6325] transition-colors font-medium text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Longitude (GPS)</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g. 80.2707"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#162033] text-white placeholder-slate-500 focus:border-[#ff6325] transition-colors font-medium text-sm outline-none"
                />
              </div>
            </div>

            {latitude && longitude && (
              <div className="pt-1">
                <a
                  href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#ff6325] hover:underline flex items-center gap-1.5"
                >
                  📍 Test Google Maps pin (opens in new tab) &rarr;
                </a>
              </div>
            )}
          </div>

          {/* Around Property Landmarks */}
          <div className="pt-6 border-t border-white/10">
            <h3 className="text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">Around Property (Nearby Landmarks)</h3>
            <p className="text-xs text-slate-400 mb-4">Add nearby transit, metro, beach, or attractions with distance labels.</p>

            <div className="flex flex-col gap-2 mb-4">
              {aroundProperty.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-[#162033] px-4 py-2.5 rounded-xl border border-white/10">
                  <span className="font-semibold text-xs text-white">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-[#ff6325] bg-[#ff6325]/15 px-2 py-0.5 rounded-md border border-[#ff6325]/20">{item.distance}</span>
                    <button
                      onClick={() => setAroundProperty(aroundProperty.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              ))}
              {aroundProperty.length === 0 && (
                <p className="text-xs text-slate-500 italic py-1">No landmarks added yet. Add one below if you want it displayed on the customer map.</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newLandmarkName}
                onChange={(e) => setNewLandmarkName(e.target.value)}
                placeholder="Landmark (e.g. Marina Beach, Airport)"
                className="flex-1 px-4 py-2 rounded-xl border border-white/10 bg-[#162033] text-white placeholder-slate-500 text-xs font-medium outline-none focus:border-[#ff6325]"
              />
              <input
                type="text"
                value={newLandmarkDist}
                onChange={(e) => setNewLandmarkDist(e.target.value)}
                placeholder="Distance (e.g. 1.5 km)"
                className="w-full sm:w-36 px-4 py-2 rounded-xl border border-white/10 bg-[#162033] text-white placeholder-slate-500 text-xs font-medium outline-none focus:border-[#ff6325]"
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
                className="bg-[#162033] hover:bg-[#ff6325] border border-white/15 text-white px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                Add Landmark
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-[#0f1624] rounded-3xl shadow-xl border border-white/10 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
              <ImageIcon size={16} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Venue Photo Gallery</h2>
              <p className="text-xs text-slate-400">Upload photos of hotel facade, reception, dining area, and facilities.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 my-4">
            {gallery.map((url, idx) => (
              <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group bg-[#162033]">
                <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <button
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
            {gallery.length === 0 && (
              <p className="text-xs text-slate-500 italic col-span-full py-2">No photos uploaded yet.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="file"
              accept="image/*"
              multiple
              id="gallery-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="gallery-upload"
              className="bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Plus size={16} /> Upload Local Photos
            </label>
            <span className="text-xs text-slate-400">or upload multiple high-res pictures</span>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 active:scale-95 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff6325]/25 transition-all cursor-pointer"
          >
            <Save size={18} /> Save Venue Profile
          </button>
        </div>
      </div>
    </div>
  );
}
