export type Archetype = 'EVENT' | 'RENTAL' | 'FACILITY_HOURLY' | 'APPOINTMENT' | 'DINING' | 'ACCOMMODATION' | 'TRANSPORT' | 'ASSET_RENTAL' | 'PASS_ENTRY' | 'HOME_CALL';

export const CATEGORY_TO_ARCHETYPE_MAP: Record<string, Archetype> = {
  // Home Call & Doorstep Services (Electrician, Plumber, AC Repair, Cleaning, Pest Control)
  'electrician': 'HOME_CALL',
  'electricians': 'HOME_CALL',
  'plumber': 'HOME_CALL',
  'plumbers': 'HOME_CALL',
  'cleaning': 'HOME_CALL',
  'home-cleaning': 'HOME_CALL',
  'deep-cleaning': 'HOME_CALL',
  'ac-service': 'HOME_CALL',
  'ac-repair': 'HOME_CALL',
  'technicians': 'HOME_CALL',
  'appliance-repair': 'HOME_CALL',
  'pest-control': 'HOME_CALL',
  'carpenter': 'HOME_CALL',
  'painting': 'HOME_CALL',
  'babysitting': 'HOME_CALL',
  'elder-care': 'HOME_CALL',
  'event-organizer': 'HOME_CALL',
  'event-organizer-booking': 'HOME_CALL',
  'home-services': 'HOME_CALL',

  // Pass & Ticket Entry (Movies, Concerts, Theatre, Events, Darshan)
  'movies': 'PASS_ENTRY',
  'cinema-movie-tickets': 'PASS_ENTRY',
  'theatre': 'PASS_ENTRY',
  'theatre-shows': 'PASS_ENTRY',
  'concerts': 'PASS_ENTRY',
  'concert-tickets': 'PASS_ENTRY',
  'events': 'PASS_ENTRY',
  'events-festivals': 'PASS_ENTRY',
  'exhibitions': 'PASS_ENTRY',
  'exhibition-entry': 'PASS_ENTRY',
  'workshops': 'PASS_ENTRY',
  'workshops-classes': 'PASS_ENTRY',
  'darshan': 'PASS_ENTRY',
  'temple-darshan-booking': 'PASS_ENTRY',
  'pooja': 'PASS_ENTRY',
  'pooja-slot-booking': 'PASS_ENTRY',
  'comedy-events': 'PASS_ENTRY',
  'sports-events': 'PASS_ENTRY',
  'music-events': 'PASS_ENTRY',
  'nightlife': 'PASS_ENTRY',
  'screenings': 'PASS_ENTRY',
  'social-mixers': 'PASS_ENTRY',
  
  // Asset Rentals (Self-Drive Cars, Bikes, Cameras, Equipment)
  'car-rental': 'ASSET_RENTAL',
  'bike-rental': 'ASSET_RENTAL',
  'sports-bike': 'ASSET_RENTAL',
  'cycle-rental': 'ASSET_RENTAL',
  'camera': 'ASSET_RENTAL',
  'camera-rental': 'ASSET_RENTAL',
  'sound-system': 'ASSET_RENTAL',
  'sound-system-rental': 'ASSET_RENTAL',
  'event-equip': 'ASSET_RENTAL',
  'event-equipment-rental': 'ASSET_RENTAL',

  // Facilities & Turfs
  'turfs': 'RENTAL',
  'turf': 'RENTAL',
  'football-turf': 'RENTAL',
  'cricket-ground': 'RENTAL',
  'badminton': 'RENTAL',
  'badminton-court': 'RENTAL',
  'tennis': 'RENTAL',
  'tennis-court': 'RENTAL',
  'basketball': 'RENTAL',
  'basketball-court': 'RENTAL',
  'swimming': 'RENTAL',
  'swimming-pool-slots': 'RENTAL',
  'sports-arenas': 'RENTAL',
  'sports': 'RENTAL',
  'game-zones': 'RENTAL',
  'gaming-arena-booking': 'RENTAL',
  'indoor-play-arena': 'RENTAL',
  'theme-parks': 'RENTAL',
  'photo-studios': 'RENTAL',
  'studio-booking': 'RENTAL',
  'meeting-room': 'RENTAL',
  'coworking-space': 'RENTAL',
  'podcast-studio': 'RENTAL',

  // Appointments (Healthcare, Doctor OPD, Salons & Wellness)
  'doctor': 'APPOINTMENT',
  'doctor-appointment': 'APPOINTMENT',
  'clinics': 'APPOINTMENT',
  'clinic': 'APPOINTMENT',
  'dental': 'APPOINTMENT',
  'hospital': 'APPOINTMENT',
  'healthcare': 'APPOINTMENT',
  'salons': 'APPOINTMENT',
  'salon-spa-appointment': 'APPOINTMENT',
  'spas': 'APPOINTMENT',
  'spa': 'APPOINTMENT',
  'gym-yoga': 'APPOINTMENT',
  'gym-yoga-slot-booking': 'APPOINTMENT',
  'pet-grooming': 'APPOINTMENT',
  'pet-grooming-appointment': 'APPOINTMENT',
  'fitness-classes': 'APPOINTMENT',
  'training': 'APPOINTMENT',
  'training-sessions': 'APPOINTMENT',

  // Dining
  'restaurants': 'DINING',
  'restobars': 'DINING',
  'clubs': 'DINING',
  'cafes': 'DINING',
  'fine-dining': 'DINING',
  'restaurant-table-reservation': 'DINING',
  
  // Accommodation
  'hotels': 'ACCOMMODATION',
  'resorts': 'ACCOMMODATION',
  'camping': 'ACCOMMODATION',
  'villas': 'ACCOMMODATION',
  'homestays': 'ACCOMMODATION',
  'hotel-booking': 'ACCOMMODATION',
  'resort-booking': 'ACCOMMODATION',
  'homestay-villa': 'ACCOMMODATION',
  'hostel-booking': 'ACCOMMODATION',
  'camping-booking': 'ACCOMMODATION',
  'pilgrimage': 'ACCOMMODATION',
  'pilgrimage-packages': 'ACCOMMODATION',
  'accommodation-hospitality': 'ACCOMMODATION',
  
  // Transport (Existing custom flows in BOKSPOT)
  'cabs': 'TRANSPORT',
  'flights': 'TRANSPORT',
  'trains': 'TRANSPORT',
  'buses': 'TRANSPORT',
  'metro': 'TRANSPORT',
};

export const getArchetypeFromCategory = (cat?: string): Archetype | null => {
  if (!cat) return null;
  const raw = cat.toUpperCase().trim();
  if (['EVENT', 'RENTAL', 'FACILITY_HOURLY', 'APPOINTMENT', 'DINING', 'ACCOMMODATION', 'TRANSPORT', 'ASSET_RENTAL', 'PASS_ENTRY', 'HOME_CALL'].includes(raw)) {
    return raw as Archetype;
  }
  // Title-case archetype aliases
  if (raw === 'SERVICE' || raw === 'HEALTHCAREBOOKING') return 'APPOINTMENT';
  if (raw === 'RESOURCEBOOKING') return 'RENTAL';

  const normalized = cat.toLowerCase().trim().replace(/\s+/g, '-');
  if (CATEGORY_TO_ARCHETYPE_MAP[normalized]) return CATEGORY_TO_ARCHETYPE_MAP[normalized];
  
  // Fuzzy checks
  if (normalized.includes('bus') || normalized.includes('train') || normalized.includes('flight') || normalized.includes('cab')) return 'TRANSPORT';
  if (normalized.includes('villa') || normalized.includes('hotel') || normalized.includes('resort') || normalized.includes('hostel') || normalized.includes('stay') || normalized.includes('camp') || normalized.includes('accommodation')) return 'ACCOMMODATION';
  if (normalized.includes('turf') || normalized.includes('court') || normalized.includes('pool') || normalized.includes('arena')) return 'RENTAL';
  if (normalized.includes('doctor') || normalized.includes('clinic') || normalized.includes('salon') || normalized.includes('spa') || normalized.includes('gym')) return 'APPOINTMENT';
  if (normalized.includes('restaurant') || normalized.includes('dining') || normalized.includes('cafe')) return 'DINING';
  if (normalized.includes('clean') || normalized.includes('electric') || normalized.includes('plumb') || normalized.includes('repair')) return 'HOME_CALL';
  if (normalized.includes('movie') || normalized.includes('concert') || normalized.includes('darshan') || normalized.includes('event')) return 'PASS_ENTRY';
  if (normalized.includes('bike') || normalized.includes('car-rent') || normalized.includes('camera')) return 'ASSET_RENTAL';

  // Default fallback for any custom category (e.g. Laser Tag, Paintball, Custom Activity)
  return 'RENTAL';
};

// Blueprint schemas for the Dynamic Form Engine (Business App)
export const ARCHETYPE_SCHEMAS: Record<Archetype, any> = {
  PASS_ENTRY: {
    title: "Pass, Ticket & Gate Schedule Details",
    fields: [
      { name: "passTitle", type: "text", label: "Pass / Ticket Tier Title", placeholder: "e.g., AC Sleeper Upper/Lower, Audi 1 Dolby Atmos, VIP Fan Pit, Special Darshan", required: true },
      { name: "originDeparturePoint", type: "text", label: "Departure Point / Boarding Gate", placeholder: "e.g., Chennai CMBT Gate 3 / Screen 2 (Audi 2) / East Gopuram Gate", required: true },
      { name: "destinationDropPoint", type: "text", label: "Arrival / Dropping Point / Zone", placeholder: "e.g., Bangalore Majestic / Row H Seat 12 / Main Sanctum", required: false },
      { name: "scheduleTimings", type: "text", label: "Departure / Showtime & Boarding Window", placeholder: "e.g., Dep: 09:30 PM (Boarding closes 15m prior)", required: true },
      { name: "passPrice", type: "number", label: "Price per Seat / Pass (₹)", placeholder: "e.g., 750", required: true },
      { name: "seatLayoutCapacity", type: "text", label: "Seat Layout / Capacity Tier", placeholder: "e.g., 2+1 Sleeper (36 Berths), Screen 2 (240 Seats), Hourly Quota (100)", required: true },
      { name: "amenitiesIncluded", type: "text", label: "Included Amenities & Perks", placeholder: "e.g., AC, Charging Port, Bottled Water, Blanket, WiFi, Prasadam", required: false },
      { name: "mandatoryDocs", type: "text", label: "Mandatory Govt ID / Entry Rules", placeholder: "e.g., Original Aadhaar / Driving License mandatory at Turnstile", required: false },
      { name: "qrFormat", type: "text", label: "Barcode / Turnstile Encryption Format", placeholder: "e.g., BNX-PNR-QR (Encrypted Turnstile Scannable)", required: false }
    ]
  },
  EVENT: {
    title: "Event Details",
    fields: [
      { name: "eventName", type: "text", label: "Event Name", placeholder: "e.g., Live Music Concert, Standup Comedy Night, Art Workshop", required: true },
      { name: "eventDate", type: "date", label: "Event Date", required: true },
      { name: "ticketTiers", type: "array", label: "Ticket Pricing Tiers", placeholder: "e.g., Early Bird: ₹499, General: ₹799, VIP Lounge: ₹1999", required: true },
      { name: "cast", type: "textarea", label: "Cast / Performers", placeholder: "e.g., Lead Vocalist: A.R. John, Supporting DJ: Alex, Opening Act: Trio Band", required: false },
      { name: "ageLimit", type: "text", label: "Age Limit / Entry Rules", placeholder: "e.g., 18+ Only, Valid Govt ID mandatory at gate", required: false }
    ]
  },
  ASSET_RENTAL: {
    title: "Vehicle & Equipment Rental Details",
    fields: [
      { name: "assetModel", type: "text", label: "Vehicle / Equipment Model", placeholder: "e.g., Royal Enfield Hunter 350, Hyundai Creta AT, Sony A7 IV Kit", required: true },
      { name: "dailyRentalPrice", type: "number", label: "Daily Rental Rate (₹ / 24 Hours)", placeholder: "e.g., 1500", required: true },
      { name: "securityDeposit", type: "number", label: "Refundable Security Deposit (₹) [Tax-Exempt]", placeholder: "e.g., 2000", required: true },
      { name: "freeKmPerDay", type: "text", label: "Daily Kilometers Limit & Overage Rate", placeholder: "e.g., 250 km/day (₹12 per extra km)", required: false },
      { name: "fuelPolicy", type: "text", label: "Fuel Policy", placeholder: "e.g., Same-to-Same (Return with same fuel level)", required: false },
      { name: "transmission", type: "text", label: "Transmission / Gearbox", placeholder: "e.g., Manual 5-Speed / Automatic CVT", required: false },
      { name: "mandatoryDocs", type: "text", label: "Required Verification at Handover", placeholder: "e.g., Original Driving License + Aadhaar Card", required: true },
      { name: "helmetIncluded", type: "text", label: "Complimentary Helmets / Accessories", placeholder: "e.g., 2 ISI Helmets included with bike", required: false }
    ]
  },
  RENTAL: {
    title: "Facility, Turf & Court Rental Details",
    fields: [
      { name: "facilityName", type: "text", label: "Court / Pitch / Room Name", placeholder: "e.g., 7s Main AstroTurf A, Court 1 (Teak Wood), Meeting Room 3", required: true },
      { name: "turfSize", type: "text", label: "Court Dimensions & Geometry", placeholder: "e.g., 100ft x 65ft (7-a-side) / Full Court (Auto-locks Half Courts)", required: false },
      { name: "surfaceType", type: "text", label: "Surface / Floor Type", placeholder: "e.g., FIFA Certified 50mm AstroTurf / Yonex Synthetic Mat", required: false },
      { name: "hourlyRate", type: "number", label: "Standard Hourly Rate (₹)", placeholder: "e.g., 1200", required: true },
      { name: "peakHourlyRate", type: "number", label: "Peak / Evening Hourly Rate (₹)", placeholder: "e.g., 1600 (Post 6:00 PM)", required: false },
      { name: "floodlightsSurcharge", type: "number", label: "Night Floodlights Surcharge (₹ / Hour)", placeholder: "e.g., 200", required: false },
      { name: "equipmentAddons", type: "text", label: "Rental Equipment & Gear Available", placeholder: "e.g., Bibs & Ball (Free), Professional Rackets (₹50/ea), Shuttles (₹100)", required: false },
      { name: "refereeOrManager", type: "text", label: "Match Referee / Ground Manager In-charge", placeholder: "e.g., Certified KFA Referee / Ground Supervisor on duty", required: false }
    ]
  },
  FACILITY_HOURLY: {
    title: "Hourly Arena, Court & Facility Details",
    fields: [
      { name: "facilityName", type: "text", label: "Pitch / Court / Room Specification", placeholder: "e.g., Main Turf A, Box Cricket Arena, Podcast Pod 1", required: true },
      { name: "turfSize", type: "text", label: "Capacity & Dimensions", placeholder: "e.g., 7-a-side / 12 Pax Conference / 4 Podmics", required: false },
      { name: "surfaceType", type: "text", label: "Flooring / Soundproofing Spec", placeholder: "e.g., FIFA Turf, Wooden Court, Acoustic Studio Treatment", required: false },
      { name: "hourlyRate", type: "number", label: "Base Hourly Slot Rate (₹)", placeholder: "e.g., 1200", required: true },
      { name: "peakHourlyRate", type: "number", label: "Peak Evening Rate (₹)", placeholder: "e.g., 1500", required: false },
      { name: "floodlightsSurcharge", type: "number", label: "Floodlights / Equipment Surcharge (₹)", placeholder: "e.g., 250", required: false },
      { name: "equipmentAddons", type: "text", label: "Rental Gear & Refreshments", placeholder: "e.g., Match Balls, Rackets, Video Cam, Tea/Coffee", required: false }
    ]
  },
  APPOINTMENT: {
    title: "Doctor / Specialist Consultation Details",
    fields: [
      { name: "doctorName", type: "text", label: "Specialist / Doctor Full Name", placeholder: "e.g., Dr. Rajesh Kumar, MBBS, MD (General Medicine)", required: true },
      { name: "qualification", type: "text", label: "Medical Degrees & Qualifications", placeholder: "e.g., MBBS, MD, DNB, Fellow in Cardiology (14+ yrs exp)", required: true },
      { name: "speciality", type: "text", label: "Speciality / Clinical Department", placeholder: "e.g., Senior Physician, Dermatology, Dental Surgeon, Orthopedics", required: true },
      { name: "consultationDuration", type: "number", label: "Consultation Slot Duration (Minutes)", placeholder: "e.g., 20", required: true },
      { name: "opdRoomNumber", type: "text", label: "OPD Consultation Room / Cabin", placeholder: "e.g., Cabin 3 (First Floor OPD Wing)", required: false },
      { name: "maxDailyTokens", type: "number", label: "Max Daily OPD Tokens Limit", placeholder: "e.g., 40", required: false },
      { name: "consultationFee", type: "number", label: "Consultation Fee (₹)", placeholder: "e.g., 600", required: true },
      { name: "opdTimings", type: "text", label: "OPD Session Hours", placeholder: "e.g., Mon-Sat: 10:00 AM - 01:00 PM & 05:00 PM - 08:00 PM", required: false }
    ]
  },
  DINING: {
    title: "Dining / Restaurant Details",
    fields: [
      { name: "costForTwo", type: "number", label: "Cost for Two (₹)", placeholder: "e.g., 1200", required: true },
      { name: "cuisines", type: "multi-select", label: "Cuisines", placeholder: "e.g., South Indian, North Indian, Chettinad, Chinese, Continental", required: true },
      { name: "facilities", type: "multi-select", label: "Facilities", placeholder: "e.g., AC Dining, Valet Parking, Serves Alcohol, Outdoor Seating, Live Music", required: false },
      { name: "menuImages", type: "image-array", label: "Upload Menu Pages", required: true },
      { name: "offers", type: "array", label: "Active Offers & Discounts", placeholder: "e.g., FLAT 20% OFF on Weekdays, 1+1 on Cocktails", required: false }
    ]
  },
  ACCOMMODATION: {
    title: "Accommodation, Campsite & Stay Details",
    fields: [
      { name: "roomType", type: "text", label: "Room / Villa / Unit Type", placeholder: "e.g., Deluxe Ocean View Villa, 3BHK Private Pool Villa, Executive King Suite", required: true },
      { name: "totalUnits", type: "number", label: "Inventory / Units Available", placeholder: "e.g., 5", required: true },
      { name: "maxGuests", type: "number", label: "Max Guests Allowed", placeholder: "e.g., 4 Guests (2 Adults + 2 Kids)", required: true },
      { name: "bedType", type: "text", label: "Bed & Sleeping Setup", placeholder: "e.g., 1 King Bed + 1 Sofa Bed, 2 Queen Beds", required: false },
      { name: "sizeSqFt", type: "number", label: "Room / Villa Area (Sq.Ft)", placeholder: "e.g., 450", required: false },
      { name: "viewType", type: "text", label: "Balcony / View Type", placeholder: "e.g., Sea Facing / Pool View / Mountain View / Garden View", required: false },
      { name: "bathroomType", type: "text", label: "Bathroom / Washroom Setup", placeholder: "e.g., Ensuite Marble Bathroom with Rain Shower & Bathtub", required: false },
      { name: "checkInTime", type: "time", label: "Standard Check-in Time", required: true },
      { name: "checkOutTime", type: "time", label: "Standard Check-out Time", required: true },
      { name: "mealPlanOptions", type: "text", label: "Dining & Meal Plan Options", placeholder: "e.g., Room Only, Free Buffet Breakfast (CP), All Meals Included (AP)", required: false },
      { name: "petPolicy", type: "text", label: "Pet Policy", placeholder: "e.g., Pet Friendly (Dogs/Cats allowed with prior notice) / No Pets", required: false },
      { name: "cancellationPolicy", type: "text", label: "Cancellation Policy", placeholder: "e.g., 100% Free Cancellation up to 24 hrs before check-in", required: false },
      { name: "perks", type: "array", label: "Special Inclusions & Highlights", placeholder: "e.g., Free Buffet Breakfast, Sunset View Balcony, Private Plunge Pool, High-Speed WiFi", required: false },
      { name: "amenities", type: "multi-select", label: "Room & Unit Amenities", placeholder: "e.g., AC, Smart TV 55\", Mini Bar, Espresso Machine, Work Desk, Bathrobes", required: false }
    ]
  },
  TRANSPORT: {
    title: "Transport Details",
    fields: [
      { name: "vehicleType", type: "text", label: "Vehicle Type / Coach Class", placeholder: "e.g., Multi-Axle Volvo AC Sleeper, Innova Crysta 7-Seater, 3-Tier AC Coach", required: true }
    ]
  },
  HOME_CALL: {
    title: "Doorstep & Home Service Details",
    fields: [
      { name: "serviceTitle", type: "text", label: "Service / Package Title", placeholder: "e.g., Split AC Deep Cleaning & Gas Refill, Electrical Wiring Check, Complete Bathroom Leakage Repair", required: true },
      { name: "inspectionFee", type: "number", label: "Visiting & Inspection Fee (₹)", placeholder: "e.g., 199 (Adjusted against final bill if work approved)", required: true },
      { name: "serviceDuration", type: "text", label: "Estimated Job Duration", placeholder: "e.g., 45 - 90 Minutes", required: false },
      { name: "serviceWarranty", type: "text", label: "Post-Service Warranty", placeholder: "e.g., 30 Days BOKSPOT Service Warranty & Free Rework", required: false },
      { name: "partsPolicy", type: "text", label: "Spare Parts / Consumables Policy", placeholder: "e.g., Authentic rate-card billing with 100% genuine spares", required: false },
      { name: "verifiedProTag", type: "text", label: "Technician Verification", placeholder: "e.g., Police Background Verified & COVID Vaccinated Pro", required: false }
    ]
  }
};
