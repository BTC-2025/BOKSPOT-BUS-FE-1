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
    <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-fade-in">
      <div className="py-6">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Building2 className="text-[#0a3161]" size={32} />
          Venue Profile
        </h1>
        <p className="text-slate-500 font-medium mt-2">
          Manage the global details for {currentMerchant.merchantName}. This information will be displayed at the top of your public page.
        </p>
      </div>

      <div className="space-y-6">
        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Info className="text-[#0a3161]" /> About Us
          </h2>
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            placeholder="Welcome to our facility. We provide..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#ff6325] focus:ring-2 focus:ring-[#ff6325]/20 transition-all font-medium bg-slate-50 focus:bg-white min-h-[120px]"
          />
        </div>

        {/* Things To Know */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
            <CheckSquare className="text-green-500" /> Things to Know (Amenities & Rules)
          </h2>
          <p className="text-sm text-slate-500 mb-4">Add global amenities like Parking, Washrooms, Drinking Water, etc.</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {thingsToKnow.map((thing, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-bold border border-green-200">
                {thing}
                <button onClick={() => handleRemoveThing(thing)} className="hover:text-red-500 ml-1">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newThing}
              onChange={(e) => setNewThing(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddThing()}
              placeholder="e.g. Free Parking"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-green-500 transition-colors font-medium"
            />
            <button onClick={handleAddThing} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold transition-colors">
              Add
            </button>
          </div>
        </div>

        {/* Policies */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Info className="text-orange-500" /> Policies
          </h2>
          <p className="text-sm text-slate-500 mb-4">Add your venue policies (e.g. No smoking, Check-in/out times, Cancellation policy).</p>
          
          <div className="flex flex-col gap-2 mb-4">
            {policies.map((policy, idx) => (
              <div key={idx} className="flex justify-between items-center bg-orange-50 text-orange-800 px-4 py-3 rounded-xl border border-orange-200">
                <span className="font-medium text-sm">{policy}</span>
                <button onClick={() => handleRemovePolicy(policy)} className="hover:text-red-500 ml-2">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newPolicy}
              onChange={(e) => setNewPolicy(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPolicy()}
              placeholder="e.g. Check-in after 2:00 PM"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 transition-colors font-medium"
            />
            <button onClick={handleAddPolicy} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-bold transition-colors">
              Add Policy
            </button>
          </div>
        </div>

        {/* Location & Map Coordinates */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
            <MapPin className="text-[#ff6325]" /> Location & Map Coordinates
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Provide the precise address and Google Maps coordinates so customers can view your venue on the map and calculate directions.
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 142 Anna Salai, Thousand Lights, Chennai - 600006"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ff6325] transition-colors font-medium text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Latitude (GPS)</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g. 13.0827"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ff6325] transition-colors font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Longitude (GPS)</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g. 80.2707"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ff6325] transition-colors font-medium text-sm"
                />
              </div>
            </div>

            {latitude && longitude && (
              <div className="pt-2">
                <a
                  href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#ff6325] hover:underline flex items-center gap-1.5"
                >
                  📍 Test Google Maps pin (opens new tab) &rarr;
                </a>
              </div>
            )}
          </div>

          {/* Around Property Landmarks */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Around Property (Nearby Landmarks)</h3>
            <p className="text-xs text-slate-500 mb-4">Add nearby transit, hospitals, metro, or attractions with distances.</p>
            
            <div className="flex flex-col gap-2 mb-4">
              {aroundProperty.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                  <span className="font-semibold text-sm text-slate-800">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#ff6325] bg-[#ff6325]/10 px-2 py-0.5 rounded-md">{item.distance}</span>
                    <button 
                      onClick={() => setAroundProperty(aroundProperty.filter((_, i) => i !== idx))} 
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              ))}
              {aroundProperty.length === 0 && (
                <p className="text-xs text-slate-400 italic">No landmarks added yet. Add one below if you want it displayed.</p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newLandmarkName}
                onChange={(e) => setNewLandmarkName(e.target.value)}
                placeholder="Landmark (e.g. Metro Station, Airport)"
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-medium"
              />
              <input
                type="text"
                value={newLandmarkDist}
                onChange={(e) => setNewLandmarkDist(e.target.value)}
                placeholder="Distance (e.g. 0.5 km)"
                className="w-32 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-medium"
              />
              <button
                onClick={() => {
                  if (newLandmarkName.trim()) {
                    setAroundProperty([...aroundProperty, { name: newLandmarkName.trim(), distance: newLandmarkDist.trim() || 'Nearby' }]);
                    setNewLandmarkName('');
                    setNewLandmarkDist('');
                  }
                }}
                className="bg-[#0a3161] hover:bg-[#124b8f] text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
            <ImageIcon className="text-purple-500" /> Venue Gallery
          </h2>
          <p className="text-sm text-slate-500 mb-4">Add high-quality images of your entire venue to showcase it to users.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {gallery.map((url, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                <button 
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 items-center">
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
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus size={18} /> Select Local Image
            </label>
            <span className="text-xs text-slate-400">or upload multiple images</span>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white rounded-xl font-bold shadow-lg shadow-[#ff6325]/25 transition-all"
          >
            <Save size={20} /> Save Venue Profile
          </button>
        </div>
      </div>
    </div>
  );
}
