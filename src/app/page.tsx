'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useVendorStore } from '../lib/store';
import { 
  Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, KeyRound, AlertCircle,
  Stethoscope, Dumbbell, Scissors, Utensils, Sparkles, Film, Goal
} from 'lucide-react';

const GROUPED_CATEGORIES = {
  "Accommodation & Hospitality": [
    "Hotel Booking", "Resort Booking", "Homestay / Villa", "Hostel Booking", "Camping Booking"
  ],
  "Sports & Arenas": [
    "Football Turf", "Cricket Ground", "Badminton Court", "Tennis Court", "Basketball Court", "Swimming Pool Slots", "Gaming Arena Booking", "Indoor Play Arena"
  ],
  "Health, Wellness & Dining": [
    "Restaurant Table Reservation", "Salon / Spa Appointment", "Gym / Yoga Slot Booking", "Doctor Appointment"
  ],
  "Home & Trade Services": [
    "Electrician Booking", "Plumber Booking", "Cleaning Service", "Technician Service"
  ],
  "Workspaces, Studios & Events": [
    "Co-working Space", "Meeting Room", "Podcast Studio", "Conference Hall", "Training Sessions", "Studio Booking", "Event Organizer Booking"
  ],
  "Rentals & Equipment": [
    "Cycle Rental", "Sports Bike Rental", "Camera Rental", "Sound System Rental", "Event Equipment Rental"
  ],
  "Personal Care Services": [
    "Pet Grooming Appointment", "Babysitting Service", "Elder Care Service"
  ],
  "API Integrations (Category B)": [
    "Flight Booking", "Train Booking", "Bus Booking", "Ferry / Boat Booking", "Shuttle / Van Booking", "Helicopter Booking (Premium)", "Cab / Taxi Booking", "Bike Rental", "Self-Drive Car Rental", "Cinema / Movie Tickets", "Theatre Shows", "Concert Tickets", "Events & Festivals", "Exhibition Entry", "Workshops / Classes", "Temple Darshan Booking", "Pooja Slot Booking", "Pilgrimage Packages"
  ]
};

export default function AdminGatePage() {
  const { loginMerchant, registerMerchant, currentMerchant } = useVendorStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Sign up state
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [bookingType, setBookingType] = useState('Hotel Booking');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (useVendorStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }
    const unsub = useVendorStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (mounted && hasHydrated && currentMerchant) {
      window.location.href = '/home/dashboard-home';
    }
  }, [currentMerchant, mounted, hasHydrated]);

  if (!mounted || !hasHydrated) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-[10px] text-text-secondary uppercase tracking-[0.2em] animate-pulse">Initializing Gate...</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    if (username.trim() === 'Admin' && password === 'Admin123') {
      setSuccess('Super Admin access granted. Redirecting...');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
      return;
    }

    const successLogin = loginMerchant(username.trim(), password);
    if (successLogin) {
      setSuccess('Sign in successful. Redirecting to console...');
      setTimeout(() => {
        window.location.href = '/home/dashboard-home';
      }, 1000);
    } else {
      setError('Invalid username or passcode.');
    }
  };

  const handleQuickLogin = (user: string, pass: string) => {
    setError(null);
    setSuccess(null);
    setUsername(user);
    setPassword(pass);

    const successLogin = loginMerchant(user, pass);
    if (successLogin) {
      setSuccess(`Authenticated as ${user}! Redirecting...`);
      setTimeout(() => {
        window.location.href = '/home/dashboard-home';
      }, 800);
    } else {
      setError('Quick login configuration error.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!businessName.trim() || !username.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const getArchetypeForCategory = (cat: string) => {
      const lower = cat.toLowerCase();
      if (lower.includes('hotel') || lower.includes('resort') || lower.includes('homestay') || lower.includes('hostel') || lower.includes('camping')) return 'Accommodation';
      if (lower.includes('doctor') || lower.includes('clinic') || lower.includes('hospital')) return 'Healthcare';
      if (lower.includes('salon') || lower.includes('spa') || lower.includes('grooming') || lower.includes('beauty')) return 'Beauty';
      if (lower.includes('turf') || lower.includes('ground') || lower.includes('court') || lower.includes('pool') || lower.includes('arena') || lower.includes('sports')) return 'ResourceBooking';
      return 'Service';
    };

    const newMerchant = {
      id: `m-${Date.now()}`,
      username: username.trim(),
      merchantName: businessName.trim(),
      category: bookingType,
      logoLetter: businessName.trim().charAt(0).toUpperCase() || 'M',
      vendorId: `V${Math.floor(Math.random() * 100000)}`,
      email: username.trim().includes('@') ? username.trim() : `${username.trim()}@bnxmail.com`,
      archetype: getArchetypeForCategory(bookingType),
      isCustomized: true
    };

    const successSignup = registerMerchant(newMerchant as any, password);
    if (successSignup) {
      setSuccess('Account created successfully! Please sign in.');
      setTimeout(() => {
        setIsSignUpMode(false);
        setPassword('');
      }, 1000);
    } else {
      setError('Registration failed.');
    }
  };

  const handleGoogleLogin = () => {
    setError('Google login is simulated in this demo.');
    setTimeout(() => {
      handleQuickLogin('vendor123', 'pass123'); // Simulate google login as an existing vendor
    }, 1500);
  };

  const DEMO_PROFILES = [
    { role: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'hover:border-sky-500/30 hover:text-sky-400' },
    { role: 'fitness', label: 'Trainer', icon: Dumbbell, color: 'hover:border-emerald-500/30 hover:text-emerald-400' },
    { role: 'salon', label: 'Stylist', icon: Scissors, color: 'hover:border-rose-500/30 hover:text-rose-400' },
    { role: 'dining', label: 'Maitre D\'', icon: Utensils, color: 'hover:border-purple-500/30 hover:text-purple-400' }
  ];

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Background Gradients */}
      <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#0a3161]/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#8b6508]/6 blur-[120px] pointer-events-none" />
      
      {/* Clean Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-[0.02]" />
 
      <div className="w-full max-w-md z-10 space-y-6">
        {/* Logo / Title Area */}
        <div className="text-center space-y-3">
          <div className="flex flex-col items-center justify-center space-y-2.5">
            <div className="flex items-center gap-2 bg-white/95 px-4.5 py-1.5 rounded-full border border-white/20 shadow-lg select-none shrink-0 scale-105">
              <Sparkles className="w-4.5 h-4.5 text-[#ff6325] fill-[#ff6325] animate-pulse" />
              <span className="font-['Playfair_Display'] text-[17px] tracking-[0.15em] uppercase font-bold text-slate-800">
                <span className="text-[#0a3161] font-black">BOK</span>
                <span className="text-[#ff6325] font-black">SPOT</span>
              </span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm select-none ${isAdminMode ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-400' : 'bg-[#8b6508]/15 border border-[#8b6508]/30 text-[#fceea7]'}`}>
              {isAdminMode ? 'SUPER ADMIN CONSOLE' : 'MERCHANT CONSOLE'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {isAdminMode ? 'Sign in to access platform-wide settings and support tickets.' : 'Sign in to manage bookings, services, and schedules.'}
          </p>
        </div>
 
        {/* Login Card */}
        <div className="rounded-2xl border border-border-brand bg-bg-secondary backdrop-blur-xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {error && (
            <div className="mb-4 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
 
          {success && (
            <div className="mb-4 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck size={15} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}
 
          <form onSubmit={isSignUpMode ? handleSignUp : handleSubmit} className="space-y-4">
            {isSignUpMode ? (
              <>
                {/* Business Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block">Business Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. My Cool Hotel"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full rounded-xl border border-border-brand bg-bg-tertiary/20 focus:bg-bg-tertiary/40 px-4 py-2.5 text-xs text-text-primary placeholder-slate-600 outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Booking Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block">Booking Type</label>
                  <div className="relative">
                    <select
                      value={bookingType}
                      onChange={(e) => setBookingType(e.target.value)}
                      className="w-full rounded-xl border border-border-brand bg-bg-tertiary/20 focus:bg-bg-tertiary/40 px-4 py-2.5 text-xs text-text-primary outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] transition-all"
                    >
                      <option value="" disabled>Select a service type</option>
                      {Object.entries(GROUPED_CATEGORIES).map(([groupName, categories]) => (
                        <optgroup key={groupName} label={groupName} className="font-bold text-slate-800 bg-slate-50">
                          {categories.map(cat => (
                            <option key={cat} value={cat} className="font-normal text-slate-700 bg-white">{cat}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Email / Username */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block">Email (e.g. @bnxmail.com)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. admin@bnxmail.com"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-xl border border-border-brand bg-bg-tertiary/20 focus:bg-bg-tertiary/40 pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder-slate-600 outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] transition-all"
                      required
                    />
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block">Passcode</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-border-brand bg-bg-tertiary/20 focus:bg-bg-tertiary/40 pl-10 pr-10 py-2.5 text-xs text-text-primary placeholder-slate-600 outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] transition-all"
                      required
                    />
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Username / Console Key */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block">Username / Account ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. admin or D101"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-xl border border-border-brand bg-bg-tertiary/20 focus:bg-bg-tertiary/40 pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder-slate-600 outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] transition-all"
                      required
                    />
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  </div>
                </div>
     
                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block">Passcode</label>
                    <a href="#" className="text-[10px] text-[#fceea7] hover:text-[#8b6508] font-semibold transition-colors">Forgot key?</a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-border-brand bg-bg-tertiary/20 focus:bg-bg-tertiary/40 pl-10 pr-10 py-2.5 text-xs text-text-primary placeholder-slate-600 outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] transition-all"
                      required
                    />
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </>
            )}
 
            {/* Keep Signed In */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                className="h-3.5 w-3.5 rounded border-border-brand bg-bg-tertiary/20 text-[#8b6508] focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="text-[10px] font-semibold text-text-secondary select-none">Keep me signed in on this device</label>
            </div>
 
            {/* Sign In / Sign Up Button */}
            <button
              type="submit"
              className={`w-full text-white hover:brightness-105 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all mt-6 flex items-center justify-center gap-1.5 cursor-pointer ${isAdminMode ? 'bg-indigo-500 shadow-indigo-500/20' : 'bg-gradient-to-r from-[#8b6508] to-[#d4af37] shadow-[#8b6508]/10'}`}
            >
              {isSignUpMode ? 'Create Account & Sign In' : 'Sign In'} <ArrowRight size={13} />
            </button>
            
            {/* Google Login Option (Only in login mode usually, but can be both) */}
            {!isAdminMode && (
              <div className="pt-2">
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-border-brand"></div>
                  <span className="flex-shrink-0 mx-4 text-text-muted text-[10px] uppercase font-bold">or</span>
                  <div className="flex-grow border-t border-border-brand"></div>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white text-gray-800 hover:bg-gray-50 border border-gray-200 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-border-brand/50 text-center space-y-2">
              {!isAdminMode && (
                <p className="text-[10px] text-text-secondary font-semibold">
                  {isSignUpMode ? "Already have an account? " : "Don't have an account? "}
                  <button 
                    type="button" 
                    onClick={() => { setIsSignUpMode(!isSignUpMode); setError(null); setSuccess(null); }} 
                    className="text-[#8b6508] font-bold hover:underline"
                  >
                    {isSignUpMode ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              )}
              <p className="text-[10px] text-text-secondary font-semibold">
                {isAdminMode ? (
                  <>Are you a merchant? <button type="button" onClick={() => setIsAdminMode(false)} className="text-indigo-400 font-bold hover:underline">Merchant Login</button></>
                ) : (
                  <>Platform Administrator? <button type="button" onClick={() => { setIsAdminMode(true); setUsername(''); setPassword(''); setIsSignUpMode(false); }} className="text-[#8b6508] font-bold hover:underline">Admin Login</button></>
                )}
              </p>
            </div>
          </form>
 

        </div>
      </div>
    </main>
  );
}
