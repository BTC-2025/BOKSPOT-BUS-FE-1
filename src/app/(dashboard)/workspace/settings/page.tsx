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
  const [address, setAddress] = useState('42 Anna Nagar, Chennai');
  const [about, setAbout] = useState(currentMerchant?.aboutText || '');
  const [isSaved, setIsSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(currentMerchant?.logoUrl || null);

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
        logoUrl: logoPreview || undefined
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

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[40%] h-full bg-gradient-to-l from-[#f8fafc] to-transparent pointer-events-none" />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <Settings size={200} />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
            {archetypeConfig?.hasOutdoorConditions ? 'Facility Settings' : isService ? 'Business Settings' : 'Clinic Settings'}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100"><Building2 size={14} className="text-[#0a3161]" /> Business Profile</span>
            <span>•</span>
            <span className="text-slate-700">{currentMerchant.merchantName}</span>
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
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <Building2 size={18} className="text-[#0a3161]" /> Core Business Details
            </h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Business Name</label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#ff6325] focus-within:ring-1 focus-within:ring-[#ff6325] transition-all">
                  <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                  <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-slate-900 font-bold" 
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Company Email</label>
                    <span className="text-[8px] bg-blue-50 text-[#0a3161] font-black px-2 py-0.5 rounded uppercase tracking-wider">BNX Integrated</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#ff6325] focus-within:ring-1 focus-within:ring-[#ff6325] transition-all">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-slate-900 font-bold" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Telephone / Support Line</label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#ff6325] focus-within:ring-1 focus-within:ring-[#ff6325] transition-all">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-slate-900 font-bold" 
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Website URL</label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#ff6325] focus-within:ring-1 focus-within:ring-[#ff6325] transition-all">
                    <Globe className="h-4 w-4 text-slate-400 shrink-0" />
                    <input 
                      value={website} 
                      onChange={(e) => setWebsite(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-slate-900 font-bold" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Address Coordinates</label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#ff6325] focus-within:ring-1 focus-within:ring-[#ff6325] transition-all">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <input 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-slate-900 font-bold" 
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">About Description</label>
                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#ff6325] focus-within:ring-1 focus-within:ring-[#ff6325] transition-all">
                  <Info className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                  <textarea 
                    rows={4}
                    value={about} 
                    onChange={(e) => setAbout(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-slate-900 font-bold resize-none leading-relaxed" 
                    required
                  />
                </div>
              </div>

              {/* Dynamic Archetype Specific Settings */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-black text-slate-900 mb-4">{archetypeConfig?.hasOutdoorConditions ? 'Pitch Configuration' : isHospital ? 'Emergency Protocols' : isService ? 'Service Regions' : 'Preferences'}</h3>
                
                <div className="space-y-4">
                  {archetypeConfig?.hasOutdoorConditions && (
                    <>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#22c55e]" />
                        <span className="text-sm font-bold text-slate-700">Enable Automated Floodlights Integration</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#22c55e]" />
                        <span className="text-sm font-bold text-slate-700">Allow Rain Bookings (Non-Refundable)</span>
                      </label>
                    </>
                  )}
                  {isHospital && (
                    <>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0ea5e9]" />
                        <span className="text-sm font-bold text-slate-700">Enable 24/7 ER Access Routing</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                        <input type="checkbox" className="w-4 h-4 accent-[#0ea5e9]" />
                        <span className="text-sm font-bold text-slate-700">Auto-route Critical Patients to Apollo Main</span>
                      </label>
                    </>
                  )}
                  
                  {false && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Standard Check-in Time</label>
                        <input type="time" defaultValue="14:00" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Standard Check-out Time</label>
                        <input type="time" defaultValue="11:00" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold" />
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <input type="checkbox" id="roomService" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" defaultChecked />
                        <label htmlFor="roomService" className="text-sm font-semibold text-slate-700">Enable 24/7 Room Service</label>
                      </div>
                    </div>
                  )}

                  {(!archetypeConfig?.hasOutdoorConditions && !isHospital && !isService && !false) && (
                     <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                     <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#ff6325]" />
                     <span className="text-sm font-bold text-slate-700">Enable Walk-in Bookings</span>
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
