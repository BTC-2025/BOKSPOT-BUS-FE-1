export type Archetype = 'EVENT' | 'RENTAL' | 'APPOINTMENT' | 'DINING' | 'ACCOMMODATION' | 'TRANSPORT' | 'ASSET_RENTAL' | 'PASS_ENTRY' | 'HOME_CALL';

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
  'accommodation-hospitality': 'ACCOMMODATION',
  
  // Transport (Existing custom flows in BOKSPOT)
  'cabs': 'TRANSPORT',
  'flights': 'TRANSPORT',
  'trains': 'TRANSPORT',
  'buses': 'TRANSPORT',
  'metro': 'TRANSPORT',
};

// Blueprint schemas for the Dynamic Form Engine (Business App)
export const ARCHETYPE_SCHEMAS: Record<Archetype, any> = {
  PASS_ENTRY: {
    title: "Event Pass & Turnstile Entry Details",
    fields: [
      { name: "passTitle", type: "text", label: "Pass / Ticket Tier Title", placeholder: "e.g., General Silver, VIP Fan Pit, Platinum Balcony, Special Darshan", required: true },
      { name: "venueScreenGate", type: "text", label: "Audi / Screen / Gate Entry Point", placeholder: "e.g., Audi 2 (Dolby Atmos) / Gate 4 Turnstile / East Gopuram Gate", required: true },
      { name: "showEventTime", type: "text", label: "Doors Open & Show Timings", placeholder: "e.g., Doors Open: 06:30 PM | Event Starts: 07:15 PM", required: true },
      { name: "passPrice", type: "number", label: "Price per Pass (₹)", placeholder: "e.g., 599", required: true },
      { name: "totalSeatInventory", type: "number", label: "Total Available Passes / Seats", placeholder: "e.g., 250", required: true },
      { name: "ageLimitRules", type: "text", label: "Age Limit & Guidelines", placeholder: "e.g., 5+ years require ticket • Traditional attire required for Darshan", required: false },
      { name: "qrEntryEnabled", type: "text", label: "Turnstile Barcode / QR Format", placeholder: "e.g., BNX Encrypted Digital QR Pass with Turnstile scan", required: false }
    ]
  },
  EVENT: {
    title: "Event Details",
    fields: [
      { name: "eventName", type: "text", label: "Event Name", required: true },
      { name: "eventDate", type: "date", label: "Event Date", required: true },
      { name: "ticketTiers", type: "array", label: "Ticket Pricing Tiers (e.g., VIP: ₹2000)", required: true },
      { name: "cast", type: "textarea", label: "Cast / Performers", required: false },
      { name: "ageLimit", type: "text", label: "Age Limit / Entry Rules", required: false }
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
    title: "Facility & Turf Rental Details",
    fields: [
      { name: "facilityName", type: "text", label: "Court / Pitch / Facility Name", placeholder: "e.g., 7s Main Turf A, Badminton Court 1, Indoor Box Cricket", required: true },
      { name: "turfSize", type: "text", label: "Dimensions / Turf Size", placeholder: "e.g., 100ft x 65ft (7-a-side) or Regulation Badminton Size", required: false },
      { name: "surfaceType", type: "text", label: "Surface / Flooring Type", placeholder: "e.g., FIFA Certified AstroTurf, Wooden Court, Synthetic Mat", required: false },
      { name: "hourlyRate", type: "number", label: "Base Hourly Rate (₹)", placeholder: "e.g., 1200", required: true },
      { name: "hasFloodlights", type: "text", label: "Night Floodlights Available?", placeholder: "e.g., Yes (₹200/hr extra after 6 PM)", required: false },
      { name: "amenities", type: "multi-select", label: "Turf Amenities", placeholder: "e.g., Floodlights, Changing Rooms, Drinking Water, Parking, Shower", required: false }
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
      { name: "costForTwo", type: "number", label: "Cost for Two (₹)", required: true },
      { name: "cuisines", type: "multi-select", label: "Cuisines", required: true },
      { name: "facilities", type: "multi-select", label: "Facilities (e.g. Serves Alcohol, Indoor Seating)", required: false },
      { name: "menuImages", type: "image-array", label: "Upload Menu Pages", required: true },
      { name: "offers", type: "array", label: "Active Offers (e.g. FLAT 25% OFF)", required: false }
    ]
  },
  ACCOMMODATION: {
    title: "Accommodation Details",
    fields: [
      { name: "roomType", type: "text", label: "Room Type / Suite Title", required: true },
      { name: "totalUnits", type: "number", label: "Number of Rooms Available (Inventory)", required: true },
      { name: "maxGuests", type: "number", label: "Max Guests / Adults", required: true },
      { name: "bedType", type: "text", label: "Bed Type (e.g., King / Queen Beds, Twin Beds)", required: false },
      { name: "bathroomType", type: "text", label: "Bathroom Spec (e.g., Private Ensuite Bathrooms, Jacuzzi)", required: false },
      { name: "checkInTime", type: "time", label: "Standard Check-in Time", required: true },
      { name: "checkOutTime", type: "time", label: "Standard Check-out Time", required: true },
      { name: "perks", type: "array", label: "Special Offers & Deals", placeholder: "e.g., Happy Hours 1+1, 20% Off F&B, Free Breakfast, Early Check-in", required: false },
      { name: "amenities", type: "multi-select", label: "Room Facilities & Amenities", placeholder: "e.g., Free Wi-Fi, Air Conditioning, Smart TV, Mini Bar, Balcony", required: false }
    ]
  },
  TRANSPORT: {
    title: "Transport Details",
    fields: [
      { name: "vehicleType", type: "text", label: "Vehicle Type", required: true }
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
