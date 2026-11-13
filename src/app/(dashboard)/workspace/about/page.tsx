'use client';

import { useState, useEffect } from 'react';
import { useVendorStore } from '@/lib/store';
import { 
  Building2, Info, CheckSquare, Image as ImageIcon, Plus, X, Save, 
  MapPin, Phone, Globe, Mail, Clock, ShieldCheck, CheckCircle2, ChevronRight, Sparkles,
  Luggage, Dog, Crown, Star, Award
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

  // Pet Policy & Luxe Status
  const [isPetFriendly, setIsPetFriendly] = useState<boolean>(false);
  const [isLuxeVerified, setIsLuxeVerified] = useState<boolean>(false);
  const [isMysteryModeOptIn, setIsMysteryModeOptIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`hotel_mystery_optin_${currentMerchant?.id || 'default'}`);
        if (stored !== null) return stored === 'true';
      } catch {}
    }
    return currentMerchant?.isMysteryModeOptIn ?? currentMerchant?.metadata?.isMysteryModeOptIn ?? true;
  });

  // Smart Bag Locker & Luggage Storage
  const [isLuggageStorageEnabled, setIsLuggageStorageEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`hotel_luggage_enabled_${currentMerchant?.id || 'default'}`);
        if (stored !== null) return stored === 'true';
      } catch {}
    }
    return currentMerchant?.metadata?.isLuggageStorageEnabled ?? true;
  });

  // PG & Coliving Settings
  const [isPgProperty, setIsPgProperty] = useState<boolean>(() => {
    return Boolean(currentMerchant?.metadata?.isPgProperty || (currentMerchant?.category || '').toLowerCase().includes('pg'));
  });
  const [pgGenderType, setPgGenderType] = useState<string>(() => {
    return currentMerchant?.metadata?.pgGenderType || 'coliving';
  });
  const [pgFoodIncluded, setPgFoodIncluded] = useState<boolean>(() => {
    return currentMerchant?.metadata?.pgFoodIncluded ?? true;
  });
  const [pgGateCurfew, setPgGateCurfew] = useState<string>(() => {
    return currentMerchant?.metadata?.pgGateCurfew || '24/7 Biometric Entry (No Curfew)';
  });
  const [pgNoticePeriod, setPgNoticePeriod] = useState<string>(() => {
    return currentMerchant?.metadata?.pgNoticePeriod || '15 Days';
  });

  // Dedicated Women's / Ladies PG Security & Comfort States
  const [hasLadyWarden, setHasLadyWarden] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasLadyWarden ?? true;
  });
  const [zeroMaleFloorAccess, setZeroMaleFloorAccess] = useState<boolean>(() => {
    return currentMerchant?.metadata?.zeroMaleFloorAccess ?? true;
  });
  const [hasReceptionVisitorLobby, setHasReceptionVisitorLobby] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasReceptionVisitorLobby ?? true;
  });
  const [hasParentsDaytimeLounge, setHasParentsDaytimeLounge] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasParentsDaytimeLounge ?? true;
  });
  const [hasPeriodEmergencyKit, setHasPeriodEmergencyKit] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasPeriodEmergencyKit ?? true;
  });
  const [hasPrivateDryingZone, setHasPrivateDryingZone] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasPrivateDryingZone ?? true;
  });
  const [hasVanityMirrorSocket, setHasVanityMirrorSocket] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasVanityMirrorSocket ?? true;
  });
  const [hasPackedLunchBox, setHasPackedLunchBox] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasPackedLunchBox ?? true;
  });
  const [hasContactlessParcelHub, setHasContactlessParcelHub] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasContactlessParcelHub ?? true;
  });
  const [parentMotherStayAllowed, setParentMotherStayAllowed] = useState<boolean>(() => {
    return currentMerchant?.metadata?.parentMotherStayAllowed ?? true;
  });

  // Dedicated Co-Living Lifestyle & Remote Work States
  const [hasCoworkingLounge, setHasCoworkingLounge] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasCoworkingLounge ?? true;
  });
  const [hasHighSpeedDualWifi, setHasHighSpeedDualWifi] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasHighSpeedDualWifi ?? true;
  });
  const [hasFullPowerBackup, setHasFullPowerBackup] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasFullPowerBackup ?? true;
  });
  const [hasGamingLounge, setHasGamingLounge] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasGamingLounge ?? true;
  });
  const [hasRooftopCafe, setHasRooftopCafe] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasRooftopCafe ?? true;
  });
  const [hasModularKitchen, setHasModularKitchen] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasModularKitchen ?? true;
  });
  const [hasFitnessGym, setHasFitnessGym] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasFitnessGym ?? true;
  });
  const [hasCommercialDryerLaundry, setHasCommercialDryerLaundry] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasCommercialDryerLaundry ?? true;
  });
  const [hasEvChargingPoint, setHasEvChargingPoint] = useState<boolean>(() => {
    return currentMerchant?.metadata?.hasEvChargingPoint ?? false;
  });

  const [luggageHourlyRate, setLuggageHourlyRate] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`hotel_luggage_rate_${currentMerchant?.id || 'default'}`);
        if (stored) return Number(stored);
      } catch {}
    }
    return currentMerchant?.luggageHourlyRate ?? currentMerchant?.metadata?.luggageHourlyRate ?? 49;
  });

  // Dedicated rates for each item category (set by Business Owner)
  const [rateHandbag, setRateHandbag] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`hotel_luggage_rate_handbag_${currentMerchant?.id || 'default'}`);
        if (stored) return Number(stored);
      } catch {}
    }
    return currentMerchant?.metadata?.rateHandbag ?? 25;
  });

  const [rateBackpack, setRateBackpack] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`hotel_luggage_rate_backpack_${currentMerchant?.id || 'default'}`);
        if (stored) return Number(stored);
      } catch {}
    }
    return currentMerchant?.metadata?.rateBackpack ?? 39;
  });

  const [rateTrolley, setRateTrolley] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`hotel_luggage_rate_trolley_${currentMerchant?.id || 'default'}`);
        if (stored) return Number(stored);
      } catch {}
    }
    return currentMerchant?.metadata?.rateTrolley ?? 49;
  });

  const [rateBox, setRateBox] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`hotel_luggage_rate_box_${currentMerchant?.id || 'default'}`);
        if (stored) return Number(stored);
      } catch {}
    }
    return currentMerchant?.metadata?.rateBox ?? 59;
  });

  const [rateBulky, setRateBulky] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`hotel_luggage_rate_bulky_${currentMerchant?.id || 'default'}`);
        if (stored) return Number(stored);
      } catch {}
    }
    return currentMerchant?.metadata?.rateBulky ?? 79;
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

  const [luggageMaxCapacity, setLuggageMaxCapacity] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`hotel_luggage_capacity_${currentMerchant?.id || 'default'}`);
        if (stored) return Number(stored);
      } catch {}
    }
    return currentMerchant?.metadata?.luggageMaxCapacity ?? 10;
  });

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

      // Restore gallery from localStorage if previously uploaded or fallback to currentMerchant
      let initialGallery = currentMerchant.gallery || [];
      if (typeof window !== 'undefined') {
        try {
          const storedG = localStorage.getItem(`venue_gallery_${currentMerchant.id}`) ||
            (currentMerchant.username ? localStorage.getItem(`venue_gallery_${currentMerchant.username}`) : null) ||
            localStorage.getItem('venue_gallery_default');
          if (storedG) {
            const parsedG = JSON.parse(storedG);
            if (Array.isArray(parsedG) && parsedG.length > 0) {
              initialGallery = parsedG;
            }
          }
        } catch {}
      }
      setGallery(initialGallery);

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

      if (currentMerchant.isPetFriendly !== undefined) setIsPetFriendly(Boolean(currentMerchant.isPetFriendly));
      if (currentMerchant.isLuxeVerified !== undefined) setIsLuxeVerified(Boolean(currentMerchant.isLuxeVerified));
      if (currentMerchant.isMysteryModeOptIn !== undefined) {
        setIsMysteryModeOptIn(Boolean(currentMerchant.isMysteryModeOptIn));
      } else if (currentMerchant.metadata?.isMysteryModeOptIn !== undefined) {
        setIsMysteryModeOptIn(Boolean(currentMerchant.metadata.isMysteryModeOptIn));
      }
      if (currentMerchant.luggageHourlyRate) setLuggageHourlyRate(Number(currentMerchant.luggageHourlyRate));
      if (currentMerchant.metadata?.isLuggageStorageEnabled !== undefined) {
        setIsLuggageStorageEnabled(Boolean(currentMerchant.metadata.isLuggageStorageEnabled));
      }
      if (currentMerchant.metadata?.luggageHourlyRate) {
        setLuggageHourlyRate(Number(currentMerchant.metadata.luggageHourlyRate));
      }
      if (currentMerchant.metadata?.luggageDayPassRate) {
        setLuggageDayPassRate(Number(currentMerchant.metadata.luggageDayPassRate));
      }
      if (currentMerchant.metadata?.luggageMaxCapacity) {
        setLuggageMaxCapacity(Number(currentMerchant.metadata.luggageMaxCapacity));
      }

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
            if (data.metadata?.isLuggageStorageEnabled !== undefined) {
              setIsLuggageStorageEnabled(Boolean(data.metadata.isLuggageStorageEnabled));
            }
            if (data.metadata?.luggageHourlyRate) {
              setLuggageHourlyRate(Number(data.metadata.luggageHourlyRate));
            }
            if (data.metadata?.luggageMaxCapacity) {
              setLuggageMaxCapacity(Number(data.metadata.luggageMaxCapacity));
            }
            if (data.metadata?.luggageDayPassRate) {
              setLuggageDayPassRate(Number(data.metadata.luggageDayPassRate));
            }
            if (data.metadata?.isPetFriendly !== undefined) {
              setIsPetFriendly(Boolean(data.metadata.isPetFriendly));
            }
            if (data.metadata?.isPgProperty !== undefined) {
              setIsPgProperty(Boolean(data.metadata.isPgProperty));
            }
            if (data.metadata?.pgGenderType) {
              setPgGenderType(data.metadata.pgGenderType);
            }
            if (data.metadata?.pgFoodIncluded !== undefined) {
              setPgFoodIncluded(Boolean(data.metadata.pgFoodIncluded));
            }
            if (data.metadata?.pgGateCurfew) {
              setPgGateCurfew(data.metadata.pgGateCurfew);
            }
            if (data.metadata?.pgNoticePeriod) {
              setPgNoticePeriod(data.metadata.pgNoticePeriod);
            }
            if (data.metadata?.hasLadyWarden !== undefined) {
              setHasLadyWarden(Boolean(data.metadata.hasLadyWarden));
            }
            if (data.metadata?.zeroMaleFloorAccess !== undefined) {
              setZeroMaleFloorAccess(Boolean(data.metadata.zeroMaleFloorAccess));
            }
            if (data.metadata?.hasReceptionVisitorLobby !== undefined) {
              setHasReceptionVisitorLobby(Boolean(data.metadata.hasReceptionVisitorLobby));
            }
            if (data.metadata?.hasParentsDaytimeLounge !== undefined) {
              setHasParentsDaytimeLounge(Boolean(data.metadata.hasParentsDaytimeLounge));
            }
            if (data.metadata?.hasPeriodEmergencyKit !== undefined) {
              setHasPeriodEmergencyKit(Boolean(data.metadata.hasPeriodEmergencyKit));
            }
            if (data.metadata?.hasPrivateDryingZone !== undefined) {
              setHasPrivateDryingZone(Boolean(data.metadata.hasPrivateDryingZone));
            }
            if (data.metadata?.hasVanityMirrorSocket !== undefined) {
              setHasVanityMirrorSocket(Boolean(data.metadata.hasVanityMirrorSocket));
            }
            if (data.metadata?.hasPackedLunchBox !== undefined) {
              setHasPackedLunchBox(Boolean(data.metadata.hasPackedLunchBox));
            }
            if (data.metadata?.hasContactlessParcelHub !== undefined) {
              setHasContactlessParcelHub(Boolean(data.metadata.hasContactlessParcelHub));
            }
            if (data.metadata?.parentMotherStayAllowed !== undefined) {
              setParentMotherStayAllowed(Boolean(data.metadata.parentMotherStayAllowed));
            }
            if (data.metadata?.hasCoworkingLounge !== undefined) {
              setHasCoworkingLounge(Boolean(data.metadata.hasCoworkingLounge));
            }
            if (data.metadata?.hasHighSpeedDualWifi !== undefined) {
              setHasHighSpeedDualWifi(Boolean(data.metadata.hasHighSpeedDualWifi));
            }
            if (data.metadata?.hasFullPowerBackup !== undefined) {
              setHasFullPowerBackup(Boolean(data.metadata.hasFullPowerBackup));
            }
            if (data.metadata?.hasGamingLounge !== undefined) {
              setHasGamingLounge(Boolean(data.metadata.hasGamingLounge));
            }
            if (data.metadata?.hasRooftopCafe !== undefined) {
              setHasRooftopCafe(Boolean(data.metadata.hasRooftopCafe));
            }
            if (data.metadata?.hasModularKitchen !== undefined) {
              setHasModularKitchen(Boolean(data.metadata.hasModularKitchen));
            }
            if (data.metadata?.hasFitnessGym !== undefined) {
              setHasFitnessGym(Boolean(data.metadata.hasFitnessGym));
            }
            if (data.metadata?.hasCommercialDryerLaundry !== undefined) {
              setHasCommercialDryerLaundry(Boolean(data.metadata.hasCommercialDryerLaundry));
            }
            if (data.metadata?.hasEvChargingPoint !== undefined) {
              setHasEvChargingPoint(Boolean(data.metadata.hasEvChargingPoint));
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
      isPetFriendly,
      isLuxeVerified,
      isMysteryModeOptIn,
      luggageHourlyRate,
      metadata: {
        ...(currentMerchant.metadata || {}),
        isLuggageStorageEnabled,
        luggageHourlyRate: rateTrolley || luggageHourlyRate,
        rateHandbag,
        rateBackpack,
        rateTrolley,
        rateBox,
        rateBulky,
        luggageDayPassRate,
        luggageMaxCapacity,
        isPetFriendly,
        isMysteryModeOptIn,
        checkInTime,
        checkOutTime,
        operatingHours,
        isPgProperty,
        pgGenderType,
        pgFoodIncluded,
        pgGateCurfew,
        pgNoticePeriod,
        hasLadyWarden,
        zeroMaleFloorAccess,
        hasReceptionVisitorLobby,
        hasParentsDaytimeLounge,
        hasPeriodEmergencyKit,
        hasPrivateDryingZone,
        hasVanityMirrorSocket,
        hasPackedLunchBox,
        hasContactlessParcelHub,
        parentMotherStayAllowed,
        hasCoworkingLounge,
        hasHighSpeedDualWifi,
        hasFullPowerBackup,
        hasGamingLounge,
        hasRooftopCafe,
        hasModularKitchen,
        hasFitnessGym,
        hasCommercialDryerLaundry,
        hasEvChargingPoint,
      }
    } as any);

    if (typeof window !== 'undefined') {
      try {
        const id = currentMerchant.id;
        const uname = currentMerchant.username;
        const valStr = String(isLuggageStorageEnabled);

        localStorage.setItem(`hotel_mystery_optin_${id}`, String(isMysteryModeOptIn));
        if (uname) localStorage.setItem(`hotel_mystery_optin_${uname}`, String(isMysteryModeOptIn));
        localStorage.setItem('hotel_mystery_optin_default', String(isMysteryModeOptIn));
        
        // Multi-key sync so H101 / UUID / default never get out of sync
        localStorage.setItem(`hotel_luggage_enabled_${id}`, valStr);
        if (uname) localStorage.setItem(`hotel_luggage_enabled_${uname}`, valStr);
        localStorage.setItem('hotel_luggage_enabled_H101', valStr);
        localStorage.setItem('hotel_luggage_enabled_default', valStr);

        localStorage.setItem(`hotel_luggage_rate_${id}`, String(rateTrolley || luggageHourlyRate));
        if (uname) localStorage.setItem(`hotel_luggage_rate_${uname}`, String(rateTrolley || luggageHourlyRate));
        localStorage.setItem('hotel_luggage_rate_default', String(rateTrolley || luggageHourlyRate));

        // Category specific rates sync
        localStorage.setItem(`hotel_luggage_rate_handbag_${id}`, String(rateHandbag));
        localStorage.setItem(`hotel_luggage_rate_backpack_${id}`, String(rateBackpack));
        localStorage.setItem(`hotel_luggage_rate_trolley_${id}`, String(rateTrolley));
        localStorage.setItem(`hotel_luggage_rate_box_${id}`, String(rateBox));
        localStorage.setItem(`hotel_luggage_rate_bulky_${id}`, String(rateBulky));
        if (uname) {
          localStorage.setItem(`hotel_luggage_rate_handbag_${uname}`, String(rateHandbag));
          localStorage.setItem(`hotel_luggage_rate_backpack_${uname}`, String(rateBackpack));
          localStorage.setItem(`hotel_luggage_rate_trolley_${uname}`, String(rateTrolley));
          localStorage.setItem(`hotel_luggage_rate_box_${uname}`, String(rateBox));
          localStorage.setItem(`hotel_luggage_rate_bulky_${uname}`, String(rateBulky));
        }
        localStorage.setItem('hotel_luggage_rate_handbag_default', String(rateHandbag));
        localStorage.setItem('hotel_luggage_rate_backpack_default', String(rateBackpack));
        localStorage.setItem('hotel_luggage_rate_trolley_default', String(rateTrolley));
        localStorage.setItem('hotel_luggage_rate_box_default', String(rateBox));
        localStorage.setItem('hotel_luggage_rate_bulky_default', String(rateBulky));

        localStorage.setItem(`hotel_luggage_daypass_${id}`, String(luggageDayPassRate));
        if (uname) localStorage.setItem(`hotel_luggage_daypass_${uname}`, String(luggageDayPassRate));
        localStorage.setItem('hotel_luggage_daypass_default', String(luggageDayPassRate));

        localStorage.setItem(`hotel_luggage_capacity_${id}`, String(luggageMaxCapacity));
        if (uname) localStorage.setItem(`hotel_luggage_capacity_${uname}`, String(luggageMaxCapacity));
        localStorage.setItem('hotel_luggage_capacity_default', String(luggageMaxCapacity));

        // Venue photo gallery sync to localStorage for instant customer preview (capped to avoid 5MB quota overflow)
        try {
          const safeGallery = (gallery || []).slice(0, 4);
          localStorage.setItem(`venue_gallery_${id}`, JSON.stringify(safeGallery));
          if (uname) localStorage.setItem(`venue_gallery_${uname}`, JSON.stringify(safeGallery));
          localStorage.setItem('venue_gallery_default', JSON.stringify(safeGallery));
        } catch (storageErr) {
          console.warn('Skipping heavy gallery cache to avoid localStorage QuotaExceededError');
        }

        // PG & Coliving configurations localStorage sync
        const pgConfig = {
          isPgProperty,
          pgGenderType,
          pgFoodIncluded,
          pgGateCurfew,
          pgNoticePeriod,
          hasLadyWarden,
          zeroMaleFloorAccess,
          hasReceptionVisitorLobby,
          hasParentsDaytimeLounge,
          hasPeriodEmergencyKit,
          hasPrivateDryingZone,
          hasVanityMirrorSocket,
          hasPackedLunchBox,
          hasContactlessParcelHub,
          parentMotherStayAllowed,
          hasCoworkingLounge,
          hasHighSpeedDualWifi,
          hasFullPowerBackup,
          hasGamingLounge,
          hasRooftopCafe,
          hasModularKitchen,
          hasFitnessGym,
          hasCommercialDryerLaundry,
          hasEvChargingPoint,
        };
        localStorage.setItem(`pg_config_${id}`, JSON.stringify(pgConfig));
        if (uname) localStorage.setItem(`pg_config_${uname}`, JSON.stringify(pgConfig));
        localStorage.setItem('pg_config_default', JSON.stringify(pgConfig));

        // Dispatch instant events for other components and tabs
        window.dispatchEvent(new CustomEvent('hotel_mystery_toggle', { detail: { enabled: isMysteryModeOptIn, merchantId: id } }));
        window.dispatchEvent(new CustomEvent('hotel_luggage_toggle', { detail: { enabled: isLuggageStorageEnabled, merchantId: id } }));
        window.dispatchEvent(new CustomEvent('pg_config_updated', { detail: { ...pgConfig, merchantId: id } }));
        window.dispatchEvent(new CustomEvent('venue_gallery_updated', { detail: { gallery, merchantId: id } }));
        window.dispatchEvent(new Event('storage'));
      } catch {}
    }

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

        {/* 2. Check-in / Check-out & Operating Timings (For Daily Stays / Hostels) */}
        {!isPgProperty && (
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
        )}

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

        {/* 5. Smart Bag Locker & Luggage Cloakroom Service */}
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl shadow-sm border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/25 ring-4 ring-amber-500/15 shrink-0">
                <Luggage size={18} className="text-white stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  5. Smart Bag Locker & Luggage Cloakroom
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enable this if your hotel provides secure frontdesk luggage drop & locker storage for travelers arriving early or departing late.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                const nextVal = !isLuggageStorageEnabled;
                setIsLuggageStorageEnabled(nextVal);
                
                // Direct fast fetch to Backend API
                try {
                  const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
                  const baseUrl = process.env.NEXT_PUBLIC_API_URL || (isProd ? 'https://bokspot-be.onrender.com/api/v1' : 'http://localhost:9000/api/v1');
                  const targetId = currentMerchant?.id || '8fb83f4b-62aa-3a5b-3e42-074005378435';
                  await fetch(`${baseUrl}/merchants/${targetId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      metadata: {
                        ...(currentMerchant?.metadata || {}),
                        isLuggageStorageEnabled: nextVal,
                        luggageHourlyRate: luggageHourlyRate || 100,
                        luggageDayPassRate: luggageDayPassRate || 500
                      }
                    })
                  });
                } catch (e) {
                  console.error('Failed to patch merchant directly', e);
                }

                if (typeof window !== 'undefined') {
                  try {
                    const id = currentMerchant?.id;
                    const uname = currentMerchant?.username;
                    const valStr = String(nextVal);
                    if (id) localStorage.setItem(`hotel_luggage_enabled_${id}`, valStr);
                    if (uname) localStorage.setItem(`hotel_luggage_enabled_${uname}`, valStr);
                    localStorage.setItem('hotel_luggage_enabled_H101', valStr);
                    localStorage.setItem('hotel_luggage_enabled_default', valStr);
                    window.dispatchEvent(new CustomEvent('hotel_luggage_toggle', { detail: { enabled: nextVal, merchantId: id } }));
                    window.dispatchEvent(new Event('storage'));
                  } catch {}
                }

                // Also update local store
                try {
                  if (currentMerchant?.id) {
                    await updateMerchantProfile(currentMerchant.id, {
                      metadata: {
                        ...(currentMerchant.metadata || {}),
                        isLuggageStorageEnabled: nextVal,
                        luggageHourlyRate: luggageHourlyRate
                      }
                    } as any);
                  }
                } catch (e) {}
              }}
              className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isLuggageStorageEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isLuggageStorageEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {isLuggageStorageEnabled ? (
            <div className="space-y-5 pt-4">
              {/* Category-Specific Item Tariff Matrix */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-700 dark:text-slate-300">
                    Custom Hourly Rates by Luggage Category (Set by Business Owner)
                  </label>
                  <span className="text-[10px] text-amber-500 font-extrabold uppercase">
                    Live Rates Active
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {/* 1. Small Handbag */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block truncate">
                      👛 Handbag / Purse
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-amber-500 text-xs">₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={rateHandbag === 0 ? '' : rateHandbag}
                        onChange={(e) => setRateHandbag(Number(e.target.value.replace(/\D/g, '')) || 0)}
                        className="w-full bg-transparent font-black text-slate-900 dark:text-white outline-none text-xs"
                      />
                      <span className="text-[10px] text-slate-400">/hr</span>
                    </div>
                  </div>

                  {/* 2. Backpack */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block truncate">
                      🎒 Backpack / Kit
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-amber-500 text-xs">₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={rateBackpack === 0 ? '' : rateBackpack}
                        onChange={(e) => setRateBackpack(Number(e.target.value.replace(/\D/g, '')) || 0)}
                        className="w-full bg-transparent font-black text-slate-900 dark:text-white outline-none text-xs"
                      />
                      <span className="text-[10px] text-slate-400">/hr</span>
                    </div>
                  </div>

                  {/* 3. Trolley Suitcase */}
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 block truncate">
                      🧳 Trolley Suitcase
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-amber-500 text-xs">₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={rateTrolley === 0 ? '' : rateTrolley}
                        onChange={(e) => setRateTrolley(Number(e.target.value.replace(/\D/g, '')) || 0)}
                        className="w-full bg-transparent font-black text-slate-900 dark:text-white outline-none text-xs"
                      />
                      <span className="text-[10px] text-slate-400">/hr</span>
                    </div>
                  </div>

                  {/* 4. Carton / Box */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block truncate">
                      📦 Carton / Box
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-amber-500 text-xs">₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={rateBox === 0 ? '' : rateBox}
                        onChange={(e) => setRateBox(Number(e.target.value.replace(/\D/g, '')) || 0)}
                        className="w-full bg-transparent font-black text-slate-900 dark:text-white outline-none text-xs"
                      />
                      <span className="text-[10px] text-slate-400">/hr</span>
                    </div>
                  </div>

                  {/* 5. Bulky Gear */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block truncate">
                      🚲 Bulky / Large
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-amber-500 text-xs">₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={rateBulky === 0 ? '' : rateBulky}
                        onChange={(e) => setRateBulky(Number(e.target.value.replace(/\D/g, '')) || 0)}
                        className="w-full bg-transparent font-black text-slate-900 dark:text-white outline-none text-xs"
                      />
                      <span className="text-[10px] text-slate-400">/hr</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day Pass and Max Capacity */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Full Day Cap Pass */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>Full Day Cap Pass</span>
                    <span className="text-indigo-400 font-black">24 hrs Tariff</span>
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#162033] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-indigo-500">
                    <span className="font-bold text-indigo-400 text-sm">₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={luggageDayPassRate === 0 ? '' : luggageDayPassRate}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setLuggageDayPassRate(val === '' ? 0 : Number(val));
                      }}
                      placeholder="e.g. 500"
                      className="w-full bg-transparent font-black text-slate-900 dark:text-white outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-xs text-slate-400 whitespace-nowrap">/ 24 hrs</span>
                  </div>
                </div>

                {/* Maximum Total Storage Capacity */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>Cloakroom Max Capacity</span>
                    <span className="text-emerald-500 font-black">Slot Limit</span>
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#162033] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-emerald-500">
                    <span className="font-bold text-emerald-500 text-sm">🎒</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={luggageMaxCapacity === 0 ? '' : luggageMaxCapacity}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setLuggageMaxCapacity(val === '' ? 1 : Math.max(1, Number(val)));
                      }}
                      placeholder="e.g. 10"
                      className="w-full bg-transparent font-black text-slate-900 dark:text-white outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-xs text-slate-400 whitespace-nowrap">Slots / Units</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-semibold">
                <span>✓ <strong>Live Guest Booking:</strong> The <strong>&quot;Bag Locker&quot;</strong> tab is active with your custom rates: 👛 ₹{rateHandbag}/h, 🎒 ₹{rateBackpack}/h, 🧳 ₹{rateTrolley}/h, 📦 ₹{rateBox}/h, 🚲 ₹{rateBulky}/h.</span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#162033] border border-slate-200 dark:border-white/10 text-xs text-slate-400 mt-4">
              ✕ <strong>Service Disabled:</strong> Your hotel does not offer bag locker storage. The Bag Locker tab will be hidden from travelers on your booking page.
            </div>
          )}
        </div>

        {/* 6. Pet Policy */}
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl shadow-sm border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 transition-all space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/25 ring-4 ring-emerald-500/15 shrink-0">
                <Dog size={18} className="text-white stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">6. Pet-Friendly Property Setting</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enable this if your hotel/resort allows guests to bring pets (dogs, cats). Powers customer &quot;Pet Friendly&quot; search filters.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPetFriendly(!isPetFriendly)}
              className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isPetFriendly ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isPetFriendly ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className={`text-xs font-semibold px-3.5 py-2.5 rounded-xl border ${
            isPetFriendly 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
              : 'bg-slate-50 dark:bg-[#162033] text-slate-400 border-slate-200 dark:border-white/10'
          }`}>
            {isPetFriendly 
              ? '✓ Pets Allowed: Hotel appears when travelers select "Pet Friendly" filter or add pets in guest counter.' 
              : '✕ Pets Not Allowed: Guests searching for pet-friendly stays will not see this property.'}
          </div>
        </div>

        {/* 7. BokSpot Luxe™ Certification — Exclusively for Luxury Hotels, Resorts & Villas (Hidden for Hostels & PG) */}
        {!isPgProperty && !currentMerchant?.category?.toLowerCase().includes('hostel') && !currentMerchant?.category?.toLowerCase().includes('pg') && !currentMerchant?.merchantName?.toLowerCase().includes('hostel') && (
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl shadow-sm border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 transition-all space-y-4">
          {(() => {
            const guestRating = Number((currentMerchant as any)?.rating || (currentMerchant as any)?.metadata?.rating || 4.8);
            const isEligibleForLuxe = guestRating >= 4.5;

            return (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/25 ring-4 ring-amber-500/15 shrink-0">
                      <Crown size={18} className="text-slate-950 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-black text-slate-900 dark:text-white">
                          7. BokSpot Luxe™ Partner Verification
                        </h2>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          isEligibleForLuxe 
                            ? 'bg-amber-500/15 text-amber-500 border-amber-500/30' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                        }`}>
                          {isEligibleForLuxe ? '⭐ Verified Luxe Partner' : 'Standard Partner'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Properties must maintain a 4.5+ guest review rating and pass BokSpot quality standards to unlock the golden Luxe badge.
                      </p>
                    </div>
                  </div>

                  {isEligibleForLuxe ? (
                    <div className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 shrink-0 flex items-center gap-1.5 select-none">
                      <Sparkles size={13} />
                      <span>Luxe Certified ✓</span>
                    </div>
                  ) : (
                    <div className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700 shrink-0 flex items-center gap-1.5 select-none" title="Requires a 4.5★ guest rating">
                      <span>🔒 Requires 4.5★+ Rating</span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
                  <span className="text-amber-500 text-sm mt-0.5">ℹ️</span>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>How Luxe Verification Works:</strong> Certified properties carry the <strong>BokSpot Luxe Badge</strong> across guest listings and qualify under the <em>&quot;Just Luxury&quot;</em> filter. Properties maintain verified status through authentic guest reviews (current score: <strong>{guestRating}★</strong>).
                  </div>
                </div>
              </>
            );
          })()}

          {/* Mystery Secret Deals Opt-In Toggle Card */}
          {(() => {
            const guestRating = Number((currentMerchant as any)?.rating || (currentMerchant as any)?.metadata?.rating || 4.8);
            const isEligibleByRating = guestRating >= 4.5;

            return (
              <div className="pt-3 border-t border-slate-100 dark:border-white/5">
                <div className={`p-4 rounded-2xl border transition-all ${
                  isEligibleByRating 
                    ? 'bg-slate-50 dark:bg-[#162033] border-slate-200 dark:border-white/10' 
                    : 'bg-slate-50/50 dark:bg-[#162033]/50 border-slate-200/60 dark:border-white/5 opacity-80'
                } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base">🤫</span>
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Participate in BokSpot Mystery Deals (Secret Mode)
                      </h3>
                      {isEligibleByRating ? (
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          ⭐ {guestRating} Rating Qualified
                        </span>
                      ) : (
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                          🔒 Requires 4.5★+ Guest Rating ({guestRating}★ current)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                      Sell luxury rooms at exclusive special rates without diluting your public brand. In <strong>Just Luxury (Secret Mode)</strong>, your property name and exact street address remain confidential until the guest completes booking confirmation.
                    </p>
                    {!isEligibleByRating && (
                      <p className="text-[10px] text-rose-500 font-semibold pt-1">
                        ⚠️ To protect customer trust in Secret Mode, only verified properties maintaining 4.5★ or higher guest reviews can participate.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      {!isEligibleByRating 
                        ? 'Locked (Rating < 4.5★)' 
                        : (isMysteryModeOptIn ? 'Opted In' : 'Direct Name Visible')}
                    </span>
                    <button
                      type="button"
                      disabled={!isEligibleByRating}
                      onClick={() => {
                        if (!isEligibleByRating) return;
                        setIsMysteryModeOptIn(!isMysteryModeOptIn);
                      }}
                      className={`relative inline-flex h-6 w-12 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        !isEligibleByRating 
                          ? 'opacity-40 cursor-not-allowed bg-slate-300 dark:bg-slate-700' 
                          : (isMysteryModeOptIn ? 'bg-amber-500 cursor-pointer' : 'bg-slate-300 dark:bg-slate-700 cursor-pointer')
                      }`}
                      title={!isEligibleByRating ? 'Requires a 4.5★ guest rating to activate' : ''}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isMysteryModeOptIn && isEligibleByRating ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
        )}



        {/* 7.5 PG & Co-Living Specific Settings */}
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl shadow-sm border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 transition-all">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ff6325] text-white flex items-center justify-center font-bold shadow-md shadow-[#ff6325]/25 ring-4 ring-[#ff6325]/15 shrink-0">
                <span className="text-lg">🏢</span>
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">8. PG & Co-Living Stay Configurations</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configure Gender exclusivity, food inclusion models, curfew and visit permissions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {isPgProperty ? 'PG Mode Active' : 'Enable PG Features'}
              </span>
              <button
                type="button"
                onClick={() => setIsPgProperty(!isPgProperty)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  isPgProperty ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPgProperty ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {isPgProperty && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    PG Gender Type
                  </label>
                  <select
                    value={pgGenderType}
                    onChange={(e) => setPgGenderType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-xs font-bold text-slate-800 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="coliving">👥 Unisex / Coliving</option>
                    <option value="gents">🚹 Gents Only PG</option>
                    <option value="ladies">🚺 Ladies Only PG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Food Inclusions Model
                  </label>
                  <select
                    value={pgFoodIncluded ? 'with-food' : 'without-food'}
                    onChange={(e) => setPgFoodIncluded(e.target.value === 'with-food')}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-xs font-bold text-slate-800 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="with-food">🍛 3 Homely Meals Included</option>
                    <option value="without-food">🍳 Self-Cooking / Food Excluded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Gate Curfew / Closing Time
                  </label>
                  <select
                    value={pgGateCurfew}
                    onChange={(e) => setPgGateCurfew(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#162033] text-xs font-bold text-slate-800 dark:text-white outline-none cursor-pointer"
                  >
                    <option value="24/7 Biometric Entry (No Curfew)">24/7 Biometric Entry (No Curfew)</option>
                    <option value="10:00 PM Gate Closing">10:00 PM Gate Closing</option>
                    <option value="10:30 PM Gate Closing">10:30 PM Gate Closing</option>
                    <option value="11:00 PM Gate Closing">11:00 PM Gate Closing</option>
                    <option value="12:00 AM Midnight">12:00 AM Midnight</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-950 dark:text-orange-200 flex items-center justify-between">
                <div>
                  <span className="font-bold">✓ Free Property Visit Requests Allowed</span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Customers can schedule in-person room inspections directly through Bokspot before paying.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#ff6325] text-white text-[10px] font-bold">Active</span>
              </div>

              {/* Dedicated Women's / Ladies PG Security & Living Comfort Controls */}
              {pgGenderType === 'ladies' && (
                <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🏢</span>
                    <div>
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Women's Safety, Privacy & Living Comfort Controls
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        These verified safety badges display directly to female guests and parents looking for safe accommodations.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* 1. Lady Warden */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>👩‍💼</span> 24/7 Resident Lady Warden
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">On-campus lady caretaker for health & security support.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasLadyWarden(!hasLadyWarden)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasLadyWarden ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasLadyWarden ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 2. Zero Male Floor Access */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>🚷</span> Strictly Zero Male Floor Access
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Male visitors strictly prohibited from entering room floors & corridors.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setZeroMaleFloorAccess(!zeroMaleFloorAccess)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          zeroMaleFloorAccess ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          zeroMaleFloorAccess ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 3. Reception Visitor Lobby */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>🛋️</span> Reception Waiting Lobby for Visitors
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Friends, colleagues and delivery persons can meet only in frontdesk reception.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasReceptionVisitorLobby(!hasReceptionVisitorLobby)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasReceptionVisitorLobby ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasReceptionVisitorLobby ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 4. Parents Daytime Visiting Lounge */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>👨‍👩‍👧</span> Parents Daytime Visiting Lounge
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Dedicated family seating lounge during visiting hours (10 AM – 7 PM).</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasParentsDaytimeLounge(!hasParentsDaytimeLounge)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasParentsDaytimeLounge ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasParentsDaytimeLounge ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 3. Period Emergency Kit & Sanitary Incinerator */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>🩸</span> Period Care & Sanitary Dispenser
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Pad vending, electric incinerator & hot water bag relief.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasPeriodEmergencyKit(!hasPeriodEmergencyKit)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasPeriodEmergencyKit ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasPeriodEmergencyKit ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 4. Private / Covered Cloth Drying Zone */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>🧺</span> Private Covered Cloth Drying Zone
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Covered balcony / indoor private racks for undergarments & laundry.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasPrivateDryingZone(!hasPrivateDryingZone)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasPrivateDryingZone ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasPrivateDryingZone ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 5. Vanity Corner (Mirror + Styling Plug) */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>🪞</span> Full Vanity Mirror & Styling Socket
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Full-length mirror with high-watt plug for straightener/dryer.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasVanityMirrorSocket(!hasVanityMirrorSocket)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasVanityMirrorSocket ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasVanityMirrorSocket ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 6. Packed Lunch Box Provision */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>🍱</span> Morning Dabba / Packed Lunch Box
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Early morning packed food for college or office shifts.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasPackedLunchBox(!hasPackedLunchBox)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasPackedLunchBox ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasPackedLunchBox ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 7. Contactless Parcel Hub at Gate */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>📦</span> Contactless Gate Parcel Hub
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Swiggy/Amazon delivery boys strictly kept at security gate.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasContactlessParcelHub(!hasContactlessParcelHub)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasContactlessParcelHub ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasContactlessParcelHub ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 8. Mother / Sister Guest Stay */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>👭</span> Mother / Sister Overnight Stay Allowed
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Female family members can stay overnight with prior intimation.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setParentMotherStayAllowed(!parentMotherStayAllowed)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          parentMotherStayAllowed ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          parentMotherStayAllowed ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dedicated Co-Living Lifestyle & Remote Work Amenities Controls */}
              {(pgGenderType === 'coliving' || pgGenderType === 'unisex') && (
                <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🏢</span>
                    <div>
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Co-Living Lifestyle & Remote Work Amenities
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Highlighted perks for working professionals, freelancers & digital nomads.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* 1. Coworking Lounge */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>💻</span> Dedicated Coworking Lounge / Desks
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Ergonomic seating, charging pods & quiet productivity zone.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasCoworkingLounge(!hasCoworkingLounge)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasCoworkingLounge ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasCoworkingLounge ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 2. Dual High-Speed Wi-Fi */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>🚀</span> Dual High-Speed Wi-Fi (300+ Mbps)
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Dual line ISP failover backup for seamless Zoom/Teams calls.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasHighSpeedDualWifi(!hasHighSpeedDualWifi)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasHighSpeedDualWifi ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasHighSpeedDualWifi ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 3. 100% Full Power Backup */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>⚡</span> 100% Full Power Backup (AC & Wi-Fi)
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Heavy generator support for nonstop AC and workstations.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasFullPowerBackup(!hasFullPowerBackup)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasFullPowerBackup ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasFullPowerBackup ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 4. Gaming Lounge */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>🎮</span> Gaming Lounge (PS5 / TT / Foosball)
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Recreation chill-out zone for community tournaments & bonding.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasGamingLounge(!hasGamingLounge)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasGamingLounge ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasGamingLounge ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 5. Rooftop Cafe */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>☕</span> Rooftop Cafe & Open Deck
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Evening hangout lounge, movie nights & coffee counter.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasRooftopCafe(!hasRooftopCafe)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasRooftopCafe ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasRooftopCafe ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 6. Modular Kitchen */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>🍳</span> Self-Cooking Modular Kitchen
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Induction, microwave, refrigerator & basic pantry utensils.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasModularKitchen(!hasModularKitchen)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasModularKitchen ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasModularKitchen ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 7. Fitness Gym */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>🏋️‍♂️</span> In-House Fitness Gym / Yoga Deck
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Cardio machines, dumbbells and morning yoga space.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasFitnessGym(!hasFitnessGym)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasFitnessGym ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasFitnessGym ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 8. Commercial Laundry with Dryer */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>🧺</span> Commercial Laundry with Heat Dryer
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Automatic washing machines with instant heat tumbling dryers.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasCommercialDryerLaundry(!hasCommercialDryerLaundry)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasCommercialDryerLaundry ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasCommercialDryerLaundry ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* 9. EV Scooter Charging */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#162033] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>⚡🛵</span> Dedicated EV Scooter Charging Point
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Dedicated 16A plug points in parking lot for 2-wheeler EVs.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasEvChargingPoint(!hasEvChargingPoint)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                          hasEvChargingPoint ? 'bg-[#ff6325]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasEvChargingPoint ? 'translate-x-4.5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 9. Location & Map Coordinates */}
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl shadow-sm border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 transition-all">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-[#ff6325] text-white flex items-center justify-center font-bold shadow-md shadow-[#ff6325]/25 ring-4 ring-[#ff6325]/15 shrink-0">
              <MapPin size={18} className="text-white stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">9. Location & Map Coordinates</h2>
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

        {/* 10. Property Highlights */}
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl shadow-sm border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 transition-all">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/25 ring-4 ring-amber-500/15 shrink-0">
              <Sparkles size={18} className="text-white stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">10. Property Highlights & Key Selling Points</h2>
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

        {/* 11. Photo Gallery */}
        <div className="bg-white dark:bg-[#0f1624] rounded-3xl shadow-sm border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 transition-all">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/25 ring-4 ring-purple-500/15 shrink-0">
                <ImageIcon size={18} className="text-white stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">11. Venue Photo Showcase Gallery</h2>
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
