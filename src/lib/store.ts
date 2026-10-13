import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface MedicalReport {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Prescription {
  diagnosis: string;
  medications: { name: string; dosage: string; duration: string }[];
  updatedAt: string;
}

export interface DietPlan {
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
  dietType: string; // e.g. "Keto", "High Protein Lean Bulk"
  assignedAt: string;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  weightLbs?: number;
}

export interface PersistedBooking {
  id: string;
  ref: string;
  serviceId: string;
  serviceName: string;
  merchantName: string;
  category: string;
  date: string;
  time: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'CHECKED_IN';
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  notes?: string;
  otp?: string;
  
  // Doctor/Medical specific fields
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  paymentStatus?: string;
  isWalkIn?: boolean;
  vitals?: {
    bp: string;
    temp: string;
    pulse: string;
    oxygen: string;
  };
  symptoms?: string;
  medicalReports?: MedicalReport[];
  prescription?: Prescription;

  // Fitness specific fields
  fitnessGoal?: string;
  dietPlan?: DietPlan;
  workoutPlan?: WorkoutExercise[];
  weightTracker?: { date: string; weightKg: number }[];

  // Salon specific fields
  stylingNotes?: string;
  stylistAssigned?: string;
  hairType?: string;
  skinType?: string;
  beforeAfterGallery?: string[]; // simulated base64 or picture seeds

  // Dining specific fields
  tableNumber?: string;
  seatCount?: number;
  dietaryRestrictions?: string[];
  occasion?: string;
  preOrderedCourses?: string[];
  
  // Turf / Resource specific fields
  teamName?: string;
  equipmentRentals?: { item: string; qty: number; price: number }[];
  matchNotes?: string;
  refereeAssigned?: string;
}


export interface CatalogListing {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  duration?: number;
  active?: boolean;

  // Extended Details
  isTimingEnabled?: boolean;
  timingDetails?: string;
  isCapacityEnabled?: boolean;
  participantCapacity?: number;
  isAddonsEnabled?: boolean;
  addOns?: Array<{ name: string; price: number }>;
  isTipsEnabled?: boolean;
  tipsAndGuidelines?: string;
  isRestrictionsEnabled?: boolean;
  restrictions?: string;
  isInstructionsEnabled?: boolean;
  specialInstructions?: string;
  isOffersEnabled?: boolean;
  offersAndDiscounts?: string;
  metadata?: Record<string, any>;
  schedule?: Array<{ dayOfWeek: string; startTime: string; endTime: string; price: number }>;
}

export interface SupportTicket {
  id: string;
  merchantId: string;
  merchantName: string;
  subject: string;
  message: string;
  status: 'open' | 'pending' | 'resolved';
  createdAt: string;
}
export interface CatalogService {
  id: string;
  name: string;
  merchant: string;
  price: number;
  duration: number; // in minutes
  category: string;
  active: boolean;
  rating: number;
  bookingsCount: number;
  listings?: CatalogListing[];
  imageUrl?: string;
  description?: string;
  createdAt?: string;
  
  // Extended Details
  isTimingEnabled?: boolean;
  timingDetails?: string;
  participantCapacity?: number;
  isAddonsEnabled?: boolean;
  addOns?: Array<{ name: string; price: number }>;
  isRulesEnabled?: boolean;
  tipsAndGuidelines?: string;
  restrictions?: string;
  specialInstructions?: string;
  isOffersEnabled?: boolean;
  offersAndDiscounts?: string;
  
  // Location
  city?: string;
  latitude?: number;
  longitude?: number;

  // Custom industry-specific details
  specializationRequired?: string;
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  productsUsed?: string;
  tableCapacity?: number;

  // Doctor/Medical specific
  doctorId?: string; // Links this schedule to a specific sub-id
  doctorName?: string;
  roomNumber?: string;
  timeSlots?: string[]; // E.g. ['10:00 AM', '11:00 AM']

  // Fitness specific
  trainerName?: string;
  classCapacity?: number;

  // Salon specific
  stylistName?: string;
  treatmentType?: string;

  // Dining specific
  cuisineType?: string;
  seatingSection?: string;

  // Turf specific
  pitchType?: string;
  includesFloodlights?: boolean;

  // Cinema/Theatre specific
  moviePoster?: string;
  movieShowtimes?: string;
  movieLanguage?: string;
  movieRating?: string;
  hallNumber?: string;

  [key: string]: any;
}

export interface MerchantUser {
  isCustomized?: boolean;
  activeModules?: string[];
  customDictionary?: Record<string, string>;
  id: string;
  username: string;
  merchantName: string;
  category: string;
  logoLetter: string;
  aboutText: string;
  vendorId?: string;
  email?: string;
  assignSupervisor?: boolean;
  supervisorName?: string;
  supervisorPhone?: string;
  supervisorEmail?: string;
  supervisorAddress?: string;
  archetype?: 'Healthcare' | 'ResourceBooking' | 'Service' | 'Dining' | 'Accommodation' | 'SportsFacility' | 'Fitness' | 'EventSpace' | 'Rental' | 'CareServices' | 'PersonalCare' | 'Sports' | 'Wellness' | 'Trade' | 'Workspace' | 'Events' | 'Rentals';
  
  // Venue Profile (Global Business Details)
  thingsToKnow?: string[];
  gallery?: string[];
  about?: string;
  amenities?: string[];
  
  // Custom auth info for sign up
  passwordHash?: string;
}

export interface StaffPermissions {
  canManageVitals: boolean;
  canAddPrescription: boolean;
  canManageBilling: boolean;
  canManageAppointments: boolean;
}

export interface StaffMember {
  id: string; // e.g., nurse/ahhospital@bnxmail.com
  merchantId: string;
  name: string;
  roleTitle: string;
  isDoctor?: boolean;
  passwordHash: string;
  permissions: StaffPermissions;
}

interface VendorStoreState {
  currentMerchant: MerchantUser | null;
  loginRole: 'vendor' | 'supervisor' | 'staff' | null;
  supervisorId: string | null;
  currentStaff: StaffMember | null;
  theme: 'system' | 'light' | 'dark';
  bookings: PersistedBooking[];
  fetchBookings: () => Promise<void>;
  services: CatalogService[];
  fetchServices: () => Promise<void>;
  staffAccounts: StaffMember[];
  customMerchants: Record<string, Partial<MerchantUser>>;
  registeredMerchants: MerchantUser[];
  
  // Theme actions
  setTheme: (theme: 'system' | 'light' | 'dark') => void;
  
  // Auth actions
  loginMerchant: (username: string, passwordHash: string) => boolean;
  registerMerchant: (merchant: MerchantUser, passwordHash: string) => boolean;
  logoutMerchant: () => void;
  switchStore: (merchantId: string) => void;
  
  // Booking actions
  checkInBooking: (bookingId: string) => void;
  completeBooking: (bookingId: string) => void;
  cancelBooking: (bookingId: string) => void;
  rescheduleBooking: (bookingId: string, newDate: string, newTime: string) => void;
  updateBookingNotes: (bookingId: string, notes: string) => void;
  
  // Industry actions — Medical
  uploadReport: (bookingId: string, reportName: string) => void;
  deleteReport: (bookingId: string, reportId: string) => void;
  savePrescription: (bookingId: string, prescription: Prescription) => void;
  
  // Industry actions — Fitness
  assignDiet: (bookingId: string, diet: DietPlan) => void;
  saveWorkout: (bookingId: string, workout: WorkoutExercise[]) => void;
  
  // Industry actions — Salon
  saveStylingDetails: (bookingId: string, details: { stylist: string; hairType: string; skinType: string; stylingNotes: string }) => void;
  uploadBeforeAfterPhoto: (bookingId: string, photoSeed: string) => void;
  
  // Industry actions — Dining
  assignTable: (bookingId: string, tableNumber: string) => void;
  saveDietaryAlerts: (bookingId: string, alerts: string[]) => void;

  // Services actions
  addService: (service: CatalogService) => void;
  updateService: (updated: CatalogService) => void;
  deleteService: (serviceId: string) => void;

  // Staff actions
  addStaffMember: (staff: StaffMember) => void;
  updateStaffPermissions: (staffId: string, permissions: StaffPermissions) => void;
  deleteStaffMember: (staffId: string) => void;

  completeOnboarding: (merchantId: string, setupData: { activeModules: string[], customDictionary: Record<string, string>, merchantName?: string, archetype?: string }) => void;
  updateMerchantModules: (merchantId: string, activeModules: string[], customDictionary?: Record<string, string>) => void;
  updateMerchantProfile: (merchantId: string, profileData: Partial<MerchantUser>) => void;
  resetOnboarding: (merchantId: string) => void;

  // Support Tickets
  supportTickets: SupportTicket[];
  fetchSupportTickets: () => Promise<void>;
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'timestamp' | 'status' | 'createdAt'>) => void;
  resolveSupportTicket: (ticketId: string) => void;
  updateSupportTicketStatus: (ticketId: string, status: 'open' | 'pending' | 'resolved') => void;
}

export const PRESET_MERCHANTS: MerchantUser[] = [
  {
    id: '8fb83f4b-62aa-3a5b-3e42-074005378435',
    username: 'H101',
    merchantName: 'Grand Hotel',
    category: 'Hotel Booking',
    logoLetter: 'G',
    aboutText: 'Welcome to Grand Hotel. We provide professional Hotel Booking services.',
    vendorId: '20260000',
    email: 'h101@bnxmail.com',
    archetype: 'Accommodation'
  },
  {
    id: '7d24a2aa-b792-554b-1bf8-b3f392999a3f',
    username: 'H102',
    merchantName: 'Sunstone Resort',
    category: 'Resort Booking',
    logoLetter: 'S',
    aboutText: 'Welcome to Sunstone Resort. We provide professional Resort Booking services.',
    vendorId: '20260001',
    email: 'h102@bnxmail.com',
    archetype: 'Accommodation'
  },
  {
    id: '23b1896d-5bd2-3242-cd72-0d55891c85e2',
    username: 'H103',
    merchantName: 'Riverfront Villa',
    category: 'Homestay / Villa',
    logoLetter: 'R',
    aboutText: 'Welcome to Riverfront Villa. We provide professional Homestay / Villa services.',
    vendorId: '20260002',
    email: 'h103@bnxmail.com',
    archetype: 'Accommodation'
  },
  {
    id: '51c6a3b8-2abc-9421-7644-2a2dea05dbc0',
    username: 'H104',
    merchantName: 'Backpackers Hostel',
    category: 'Hostel Booking',
    logoLetter: 'B',
    aboutText: 'Welcome to Backpackers Hostel. We provide professional Hostel Booking services.',
    vendorId: '20260003',
    email: 'h104@bnxmail.com',
    archetype: 'Accommodation'
  },
  {
    id: 'a1f48aa6-72ae-8830-257a-5d3c190bebf8',
    username: 'H105',
    merchantName: 'Pine Trails Camp',
    category: 'Camping Booking',
    logoLetter: 'P',
    aboutText: 'Welcome to Pine Trails Camp. We provide professional Camping Booking services.',
    vendorId: '20260004',
    email: 'h105@bnxmail.com',
    archetype: 'Accommodation'
  },
  {
    id: '7c996ce5-e515-8b61-5039-83c06a21e9e5',
    username: 'T102',
    merchantName: 'Arena 5 Turf',
    category: 'Football Turf',
    logoLetter: 'A',
    aboutText: 'Welcome to Arena 5 Turf. We provide professional Football Turf services.',
    vendorId: '20260005',
    email: 't102@bnxmail.com',
    archetype: 'Sports'
  },
  {
    id: '5a8fe3b6-9787-e911-bd92-12be14cde4e6',
    username: 'T103',
    merchantName: 'Pitch Perfect Grounds',
    category: 'Cricket Ground',
    logoLetter: 'P',
    aboutText: 'Welcome to Pitch Perfect Grounds. We provide professional Cricket Ground services.',
    vendorId: '20260006',
    email: 't103@bnxmail.com',
    archetype: 'Sports'
  },
  {
    id: 'de764dbc-2b2b-6079-d829-4633f41fd826',
    username: 'T104',
    merchantName: 'Smash Academy',
    category: 'Badminton Court',
    logoLetter: 'S',
    aboutText: 'Welcome to Smash Academy. We provide professional Badminton Court services.',
    vendorId: '20260007',
    email: 't104@bnxmail.com',
    archetype: 'Sports'
  },
  {
    id: '1ededc46-c2c0-1e09-a0be-30c4b441bbae',
    username: 'T105',
    merchantName: 'Grand Slam Club',
    category: 'Tennis Court',
    logoLetter: 'G',
    aboutText: 'Welcome to Grand Slam Club. We provide professional Tennis Court services.',
    vendorId: '20260008',
    email: 't105@bnxmail.com',
    archetype: 'Sports'
  },
  {
    id: 'ad72ab0e-4361-aed4-d236-117c907068e9',
    username: 'T106',
    merchantName: 'Hoop Kings Arena',
    category: 'Basketball Court',
    logoLetter: 'H',
    aboutText: 'Welcome to Hoop Kings Arena. We provide professional Basketball Court services.',
    vendorId: '20260009',
    email: 't106@bnxmail.com',
    archetype: 'Sports'
  },
  {
    id: '10af45e9-939e-0b14-5bd6-c4b21fb3fe8a',
    username: 'T107',
    merchantName: 'Blue Wave Pool',
    category: 'Swimming Pool Slots',
    logoLetter: 'B',
    aboutText: 'Welcome to Blue Wave Pool. We provide professional Swimming Pool Slots services.',
    vendorId: '20260010',
    email: 't107@bnxmail.com',
    archetype: 'Sports'
  },
  {
    id: '5ef7ac5b-f41e-d1bd-8741-498129d65866',
    username: 'G101',
    merchantName: 'Cyber Core Cafe',
    category: 'Gaming Arena Booking',
    logoLetter: 'C',
    aboutText: 'Welcome to Cyber Core Cafe. We provide professional Gaming Arena Booking services.',
    vendorId: '20260011',
    email: 'g101@bnxmail.com',
    archetype: 'Sports'
  },
  {
    id: 'bdb9deee-6122-12de-c16b-26fad5fb0028',
    username: 'G102',
    merchantName: 'JumpZone Park',
    category: 'Indoor Play Arena',
    logoLetter: 'J',
    aboutText: 'Welcome to JumpZone Park. We provide professional Indoor Play Arena services.',
    vendorId: '20260012',
    email: 'g102@bnxmail.com',
    archetype: 'Sports'
  },
  {
    id: 'b23bbd1f-3c8d-56dd-7143-e34153dec1fd',
    username: 'R404',
    merchantName: 'Grand Temple Restaurant',
    category: 'Restaurant Table Reservation',
    logoLetter: 'G',
    aboutText: 'Welcome to Grand Temple Restaurant. We provide professional Restaurant Table Reservation services.',
    vendorId: '20260013',
    email: 'r404@bnxmail.com',
    archetype: 'Dining'
  },
  {
    id: '18bc5a90-2570-dd5a-eba7-b5c244f6147c',
    username: 'S303',
    merchantName: 'Style Studio',
    category: 'Salon / Spa Appointment',
    logoLetter: 'S',
    aboutText: 'Welcome to Style Studio. We provide professional Salon / Spa Appointment services.',
    vendorId: '20260014',
    email: 's303@bnxmail.com',
    archetype: 'Wellness'
  },
  {
    id: 'f2a14cc0-5f78-aff0-8665-b91d0a464e5f',
    username: 'F202',
    merchantName: 'ZenFit Clinic',
    category: 'Gym / Yoga Slot Booking',
    logoLetter: 'Z',
    aboutText: 'Welcome to ZenFit Clinic. We provide professional Gym / Yoga Slot Booking services.',
    vendorId: '20260015',
    email: 'f202@bnxmail.com',
    archetype: 'Wellness'
  },
  {
    id: '6e2a5d5e-0c09-63ca-11ab-81e24d60f77a',
    username: 'D101',
    merchantName: 'Apollo Dental',
    category: 'Doctor Appointment',
    logoLetter: 'A',
    aboutText: 'Welcome to Apollo Dental. We provide professional Doctor Appointment services.',
    vendorId: '20260016',
    email: 'd101@bnxmail.com',
    archetype: 'Wellness'
  },
  {
    id: '2ecab9d2-4489-adcb-10ca-5493f964b34d',
    username: 'E201',
    merchantName: 'Spark Electricians',
    category: 'Electrician Booking',
    logoLetter: 'S',
    aboutText: 'Welcome to Spark Electricians. We provide professional Electrician Booking services.',
    vendorId: '20260017',
    email: 'e201@bnxmail.com',
    archetype: 'Trade'
  },
  {
    id: '72fb2c1f-ff1b-ba37-1045-1e0fb08b633a',
    username: 'E202',
    merchantName: 'FlowTech Plumbers',
    category: 'Plumber Booking',
    logoLetter: 'F',
    aboutText: 'Welcome to FlowTech Plumbers. We provide professional Plumber Booking services.',
    vendorId: '20260018',
    email: 'e202@bnxmail.com',
    archetype: 'Trade'
  },
  {
    id: 'a71f9807-d3ed-e020-bd3c-b51a386ad4de',
    username: 'E203',
    merchantName: 'Shine Home Cleaners',
    category: 'Cleaning Service',
    logoLetter: 'S',
    aboutText: 'Welcome to Shine Home Cleaners. We provide professional Cleaning Service services.',
    vendorId: '20260019',
    email: 'e203@bnxmail.com',
    archetype: 'Trade'
  },
  {
    id: 'aa4fcbce-2fa1-863b-f814-92f6ad48a3ad',
    username: 'E204',
    merchantName: 'FixIt Tech Repairs',
    category: 'Technician Service',
    logoLetter: 'F',
    aboutText: 'Welcome to FixIt Tech Repairs. We provide professional Technician Service services.',
    vendorId: '20260020',
    email: 'e204@bnxmail.com',
    archetype: 'Trade'
  },
  {
    id: '2add955b-f1c9-4fac-1a52-e6dd19887ed4',
    username: 'W301',
    merchantName: 'HubSpace',
    category: 'Co-working Space',
    logoLetter: 'H',
    aboutText: 'Welcome to HubSpace. We provide professional Co-working Space services.',
    vendorId: '20260021',
    email: 'w301@bnxmail.com',
    archetype: 'Workspace'
  },
  {
    id: '082299ad-a075-b9ab-1ff9-f34412da2720',
    username: 'W302',
    merchantName: 'Boardroom Plus',
    category: 'Meeting Room',
    logoLetter: 'B',
    aboutText: 'Welcome to Boardroom Plus. We provide professional Meeting Room services.',
    vendorId: '20260022',
    email: 'w302@bnxmail.com',
    archetype: 'Workspace'
  },
  {
    id: '57f6b4ae-1c14-cba8-72b2-51a96c88cb20',
    username: 'W303',
    merchantName: 'AudioWave Cast',
    category: 'Podcast Studio',
    logoLetter: 'A',
    aboutText: 'Welcome to AudioWave Cast. We provide professional Podcast Studio services.',
    vendorId: '20260023',
    email: 'w303@bnxmail.com',
    archetype: 'Workspace'
  },
  {
    id: 'da471c80-e77f-f2a6-955b-fa486a1838a4',
    username: 'W304',
    merchantName: 'Summit Conference',
    category: 'Conference Hall',
    logoLetter: 'S',
    aboutText: 'Welcome to Summit Conference. We provide professional Conference Hall services.',
    vendorId: '20260024',
    email: 'w304@bnxmail.com',
    archetype: 'Workspace'
  },
  {
    id: '198bd77a-f881-cbf5-86f4-97104d9cd3c6',
    username: 'W305',
    merchantName: 'EduPro Sessions',
    category: 'Training Sessions',
    logoLetter: 'E',
    aboutText: 'Welcome to EduPro Sessions. We provide professional Training Sessions services.',
    vendorId: '20260025',
    email: 'w305@bnxmail.com',
    archetype: 'Workspace'
  },
  {
    id: 'b5223c3a-18dd-2e6d-d7e6-d9f9af88120e',
    username: 'W306',
    merchantName: 'Shutter Studio',
    category: 'Studio Booking',
    logoLetter: 'S',
    aboutText: 'Welcome to Shutter Studio. We provide professional Studio Booking services.',
    vendorId: '20260026',
    email: 'w306@bnxmail.com',
    archetype: 'Workspace'
  },
  {
    id: 'c8dc997b-0599-73ae-4e5f-a55cb6cbdf85',
    username: 'O801',
    merchantName: 'Elite Planners',
    category: 'Event Organizer Booking',
    logoLetter: 'E',
    aboutText: 'Welcome to Elite Planners. We provide professional Event Organizer Booking services.',
    vendorId: '20260027',
    email: 'o801@bnxmail.com',
    archetype: 'Events'
  },
  {
    id: 'dcee4116-5e1b-734c-2a91-a635b00aa38a',
    username: 'V401',
    merchantName: 'City Wheels',
    category: 'Cycle Rental',
    logoLetter: 'C',
    aboutText: 'Welcome to City Wheels. We provide professional Cycle Rental services.',
    vendorId: '20260028',
    email: 'v401@bnxmail.com',
    archetype: 'Rentals'
  },
  {
    id: '22acc0cf-989e-dd2a-0a3e-d6c510abae14',
    username: 'V402',
    merchantName: 'Rev Rider',
    category: 'Sports Bike Rental',
    logoLetter: 'R',
    aboutText: 'Welcome to Rev Rider. We provide professional Sports Bike Rental services.',
    vendorId: '20260029',
    email: 'v402@bnxmail.com',
    archetype: 'Rentals'
  },
  {
    id: '580e355e-092a-53f1-657c-643cf6178419',
    username: 'M501',
    merchantName: 'Lens Crafters',
    category: 'Camera Rental',
    logoLetter: 'L',
    aboutText: 'Welcome to Lens Crafters. We provide professional Camera Rental services.',
    vendorId: '20260030',
    email: 'm501@bnxmail.com',
    archetype: 'Rentals'
  },
  {
    id: 'a6020993-655b-a8ae-9571-5fe2d048fee4',
    username: 'M502',
    merchantName: 'Bass Drop Audio',
    category: 'Sound System Rental',
    logoLetter: 'B',
    aboutText: 'Welcome to Bass Drop Audio. We provide professional Sound System Rental services.',
    vendorId: '20260031',
    email: 'm502@bnxmail.com',
    archetype: 'Rentals'
  },
  {
    id: '8ca6acea-f6bf-dfa4-28f8-3e0bb5045924',
    username: 'M503',
    merchantName: 'Party Supply Co',
    category: 'Event Equipment Rental',
    logoLetter: 'P',
    aboutText: 'Welcome to Party Supply Co. We provide professional Event Equipment Rental services.',
    vendorId: '20260032',
    email: 'm503@bnxmail.com',
    archetype: 'Rentals'
  },
  {
    id: 'c26fec4d-6ff6-5b1e-fc3a-294596b2f346',
    username: 'P601',
    merchantName: 'Paws & Bubbles',
    category: 'Pet Grooming Appointment',
    logoLetter: 'P',
    aboutText: 'Welcome to Paws & Bubbles. We provide professional Pet Grooming Appointment services.',
    vendorId: '20260033',
    email: 'p601@bnxmail.com',
    archetype: 'PersonalCare'
  },
  {
    id: 'd3f460f8-bf3c-3e72-f822-f1ce090935de',
    username: 'B701',
    merchantName: 'SafeHands Nannies',
    category: 'Babysitting Service',
    logoLetter: 'S',
    aboutText: 'Welcome to SafeHands Nannies. We provide professional Babysitting Service services.',
    vendorId: '20260034',
    email: 'b701@bnxmail.com',
    archetype: 'PersonalCare'
  },
  {
    id: '17dca546-8456-d5e1-9006-254fea58d4ea',
    username: 'B702',
    merchantName: 'Compassion Care',
    category: 'Elder Care Service',
    logoLetter: 'C',
    aboutText: 'Welcome to Compassion Care. We provide professional Elder Care Service services.',
    vendorId: '20260035',
    email: 'b702@bnxmail.com',
    archetype: 'PersonalCare'
  }
];

const INITIAL_SERVICES: CatalogService[] = [];

const INITIAL_BOOKINGS: PersistedBooking[] = [];

function formatSlug(slug: string): string {
  const mapping: Record<string, string> = {
    flights: 'Flight Booking',
    trains: 'Train Booking',
    buses: 'Bus Booking',
    ferry: 'Ferry / Boat Booking',
    shuttle: 'Shuttle / Van Booking',
    helicopter: 'Helicopter Booking',
    cabs: 'Cab / Taxi Booking',
    'bike-rental': 'Bike Rental',
    'car-rental': 'Self-Drive Car Rental',
    hotels: 'Hotel Booking',
    resorts: 'Resort Booking',
    villas: 'Homestay / Villa',
    hostels: 'Hostel Booking',
    camping: 'Camping Booking',
    movies: 'Cinema / Movie Tickets',
    theatre: 'Theatre Shows',
    concerts: 'Concert Tickets',
    events: 'Events & Festivals',
    exhibitions: 'Exhibition Entry',
    workshops: 'Workshops / Classes',
    gaming: 'Gaming Arena Booking',
    'football-turf': 'Football Turf',
    'cricket-ground': 'Cricket Ground',
    badminton: 'Badminton Court',
    tennis: 'Tennis Court',
    basketball: 'Basketball Court',
    swimming: 'Swimming Pool Slots',
    'play-arena': 'Indoor Play Arena',
    dining: 'Restaurant Table Reservation',
    salons: 'Salon / Spa Appointment',
    'gym-yoga': 'Gym / Yoga Slot Booking',
    doctor: 'Doctor Appointment',
    electrician: 'Electrician Booking',
    plumber: 'Plumber Booking',
    cleaning: 'Cleaning Service',
    technician: 'Technician Service',
    studio: 'Studio Booking',
    coworking: 'Co-working Space',
    'meeting-room': 'Meeting Room',
    podcast: 'Podcast Studio',
    conference: 'Conference Hall',
    training: 'Training Sessions',
    darshan: 'Temple Darshan Booking',
    pooja: 'Pooja Slot Booking',
    pilgrimage: 'Pilgrimage Packages',
    'cycle-rental': 'Cycle Rental',
    'sports-bike': 'Sports Bike Rental',
    camera: 'Camera Rental',
    'sound-system': 'Sound System Rental',
    'event-equip': 'Event Equipment Rental',
    'pet-grooming': 'Pet Grooming Appointment',
    babysitting: 'Babysitting Service',
    'elder-care': 'Elder Care Service',
    'event-organizer': 'Event Organizer Booking',
  };
  
  if (mapping[slug]) return mapping[slug];
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getMockServicesForAdminMerchant(merchant: MerchantUser): CatalogService[] {
  return [
    {
      id: `ds-${merchant.username}-1`,
      name: `Standard ${merchant.category} Service`,
      merchant: merchant.merchantName,
      price: 499,
      duration: 45,
      category: merchant.category,
      active: true,
      rating: 4.7,
      bookingsCount: 24,
      description: `Professional standard ${merchant.category} package.`
    },
    {
      id: `ds-${merchant.username}-2`,
      name: `Premium ${merchant.category} Package`,
      merchant: merchant.merchantName,
      price: 1499,
      duration: 90,
      category: merchant.category,
      active: true,
      rating: 4.9,
      bookingsCount: 12,
      description: `Complete luxury ${merchant.category} experience.`
    }
  ];
}

export interface SubAccount {
  subId: string;
  merchantId: string;
  passwordHash: string;
}

export const SUB_ACCOUNTS: SubAccount[] = [
  { subId: 'H101', merchantId: '8fb83f4b-62aa-3a5b-3e42-074005378435', passwordHash: 'pass101' },
  { subId: 'H102', merchantId: '7d24a2aa-b792-554b-1bf8-b3f392999a3f', passwordHash: 'pass102' },
  { subId: 'H103', merchantId: '23b1896d-5bd2-3242-cd72-0d55891c85e2', passwordHash: 'pass103' },
  { subId: 'H104', merchantId: '51c6a3b8-2abc-9421-7644-2a2dea05dbc0', passwordHash: 'pass104' },
  { subId: 'H105', merchantId: 'a1f48aa6-72ae-8830-257a-5d3c190bebf8', passwordHash: 'pass105' },
  { subId: 'T102', merchantId: '7c996ce5-e515-8b61-5039-83c06a21e9e5', passwordHash: 'pass102' },
  { subId: 'T103', merchantId: '5a8fe3b6-9787-e911-bd92-12be14cde4e6', passwordHash: 'pass103' },
  { subId: 'T104', merchantId: 'de764dbc-2b2b-6079-d829-4633f41fd826', passwordHash: 'pass104' },
  { subId: 'T105', merchantId: '1ededc46-c2c0-1e09-a0be-30c4b441bbae', passwordHash: 'pass105' },
  { subId: 'T106', merchantId: 'ad72ab0e-4361-aed4-d236-117c907068e9', passwordHash: 'pass106' },
  { subId: 'T107', merchantId: '10af45e9-939e-0b14-5bd6-c4b21fb3fe8a', passwordHash: 'pass107' },
  { subId: 'G101', merchantId: '5ef7ac5b-f41e-d1bd-8741-498129d65866', passwordHash: 'pass101' },
  { subId: 'G102', merchantId: 'bdb9deee-6122-12de-c16b-26fad5fb0028', passwordHash: 'pass102' },
  { subId: 'R404', merchantId: 'b23bbd1f-3c8d-56dd-7143-e34153dec1fd', passwordHash: 'pass404' },
  { subId: 'S303', merchantId: '18bc5a90-2570-dd5a-eba7-b5c244f6147c', passwordHash: 'pass303' },
  { subId: 'F202', merchantId: 'f2a14cc0-5f78-aff0-8665-b91d0a464e5f', passwordHash: 'pass202' },
  { subId: 'D101', merchantId: '6e2a5d5e-0c09-63ca-11ab-81e24d60f77a', passwordHash: 'pass101' },
  { subId: 'E201', merchantId: '2ecab9d2-4489-adcb-10ca-5493f964b34d', passwordHash: 'pass201' },
  { subId: 'E202', merchantId: '72fb2c1f-ff1b-ba37-1045-1e0fb08b633a', passwordHash: 'pass202' },
  { subId: 'E203', merchantId: 'a71f9807-d3ed-e020-bd3c-b51a386ad4de', passwordHash: 'pass203' },
  { subId: 'E204', merchantId: 'aa4fcbce-2fa1-863b-f814-92f6ad48a3ad', passwordHash: 'pass204' },
  { subId: 'W301', merchantId: '2add955b-f1c9-4fac-1a52-e6dd19887ed4', passwordHash: 'pass301' },
  { subId: 'W302', merchantId: '082299ad-a075-b9ab-1ff9-f34412da2720', passwordHash: 'pass302' },
  { subId: 'W303', merchantId: '57f6b4ae-1c14-cba8-72b2-51a96c88cb20', passwordHash: 'pass303' },
  { subId: 'W304', merchantId: 'da471c80-e77f-f2a6-955b-fa486a1838a4', passwordHash: 'pass304' },
  { subId: 'W305', merchantId: '198bd77a-f881-cbf5-86f4-97104d9cd3c6', passwordHash: 'pass305' },
  { subId: 'W306', merchantId: 'b5223c3a-18dd-2e6d-d7e6-d9f9af88120e', passwordHash: 'pass306' },
  { subId: 'O801', merchantId: 'c8dc997b-0599-73ae-4e5f-a55cb6cbdf85', passwordHash: 'pass801' },
  { subId: 'V401', merchantId: 'dcee4116-5e1b-734c-2a91-a635b00aa38a', passwordHash: 'pass401' },
  { subId: 'V402', merchantId: '22acc0cf-989e-dd2a-0a3e-d6c510abae14', passwordHash: 'pass402' },
  { subId: 'M501', merchantId: '580e355e-092a-53f1-657c-643cf6178419', passwordHash: 'pass501' },
  { subId: 'M502', merchantId: 'a6020993-655b-a8ae-9571-5fe2d048fee4', passwordHash: 'pass502' },
  { subId: 'M503', merchantId: '8ca6acea-f6bf-dfa4-28f8-3e0bb5045924', passwordHash: 'pass503' },
  { subId: 'P601', merchantId: 'c26fec4d-6ff6-5b1e-fc3a-294596b2f346', passwordHash: 'pass601' },
  { subId: 'B701', merchantId: 'd3f460f8-bf3c-3e72-f822-f1ce090935de', passwordHash: 'pass701' },
  { subId: 'B702', merchantId: '17dca546-8456-d5e1-9006-254fea58d4ea', passwordHash: 'pass702' }
];

export const VENDOR_ACCOUNTS = [
  { username: 'admin', passwordHash: 'admin123' },
  { username: 'vendor123', passwordHash: 'vendorpass123' }
];

export const useVendorStore = create<VendorStoreState>()(
  persist(
    (set, get) => ({
      
  customMerchants: {},
  supportTickets: [],
  completeOnboarding: (merchantId, setupData) => set((state) => {
    const customData: any = { isCustomized: true, activeModules: setupData.activeModules, customDictionary: setupData.customDictionary };
    if (setupData.merchantName) customData.merchantName = setupData.merchantName;
    if (setupData.archetype) customData.archetype = setupData.archetype;
    return {
      customMerchants: { ...state.customMerchants, [merchantId]: customData },
      currentMerchant: state.currentMerchant?.id === merchantId 
        ? { ...state.currentMerchant, ...customData }
        : state.currentMerchant
    };
  }),

  updateMerchantModules: (merchantId, activeModules, customDictionary) => set((state) => {
    const customData = { activeModules, ...(customDictionary ? { customDictionary } : {}) };
    return {
      customMerchants: { ...state.customMerchants, [merchantId]: { ...(state.customMerchants[merchantId] || {}), ...customData } },
      currentMerchant: state.currentMerchant?.id === merchantId 
        ? { ...state.currentMerchant, ...customData }
        : state.currentMerchant
    };
  }),

  updateMerchantProfile: async (merchantId, profileData) => {
    // 1. Update local state immediately for optimistic UI
    set((state) => ({
      customMerchants: { ...state.customMerchants, [merchantId]: { ...(state.customMerchants[merchantId] || {}), ...profileData } },
      currentMerchant: state.currentMerchant?.id === merchantId 
        ? { ...state.currentMerchant, ...profileData }
        : state.currentMerchant
    }));

    // 2. Sync to Backend Database
    try {
      const isProd = process.env.NODE_ENV === 'production' || (typeof window !== 'undefined' && window.location.hostname !== 'localhost');
      const baseUrl = isProd ? 'https://bokspot-be.onrender.com/api/v1' : 'http://localhost:9000/api/v1';
      
      const payload: any = {};
      // Handle both formats depending on what is passed by components
      if (profileData.about || profileData.aboutText) payload.description = profileData.about || profileData.aboutText;
      if (profileData.amenities || profileData.thingsToKnow) payload.amenities = profileData.amenities || profileData.thingsToKnow;
      if (profileData.gallery) payload.images = profileData.gallery;
        if (profileData.policies) payload.metadata = { policies: profileData.policies };
      
      const res = await fetch(`${baseUrl}/merchants/${merchantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        console.error('Failed to sync merchant profile to DB:', await res.text());
      }
    } catch (err) {
      console.error('Error syncing merchant profile:', err);
    }
  },

  resetOnboarding: (merchantId) => set((state) => {
    return {
      customMerchants: { ...state.customMerchants, [merchantId]: { ...(state.customMerchants[merchantId] || {}), isCustomized: false } },
      currentMerchant: state.currentMerchant?.id === merchantId 
        ? { ...state.currentMerchant, isCustomized: false }
        : state.currentMerchant
    };
  }),

      currentMerchant: null,
      loginRole: null,
      supervisorId: null,
      currentStaff: null,
      theme: 'system',
      bookings: [],
      
      fetchBookings: async () => {
        try {
          const res = await axios.get(`${API_BASE}/bookings/sync`);
          if (res.data && Array.isArray(res.data)) {
            set({ bookings: res.data });
          }
        } catch (error) {
          console.error("Error fetching bookings:", error);
          set({ bookings: INITIAL_BOOKINGS });
        }
      },
      
      bookings: [],
      services: [],
      staffAccounts: [],
      customMerchants: {},
      registeredMerchants: [],
      
      setTheme: (theme) => set({ theme }),
      
      loginMerchant: (username, passwordHash) => {
        const cleanUser = username.trim();
        const lowerUser = cleanUser.toLowerCase();

        // 0. Check Staff Account (Sub ID)
        const staffAcc = get().staffAccounts.find(
          (s) => s.id.toLowerCase() === lowerUser && s.passwordHash === passwordHash
        );
        if (staffAcc) {
          const found = PRESET_MERCHANTS.find((m) => m.id === staffAcc.merchantId);
          if (found) {
            set({ currentMerchant: found, loginRole: 'staff', supervisorId: null, currentStaff: staffAcc });
            return true;
          }
        }

        // 1. Check Registered Accounts (Custom Signups)
        const registeredAcc = get().registeredMerchants.find(
          (m) => m.email?.toLowerCase() === lowerUser && m.passwordHash === passwordHash
        );
        if (registeredAcc) {
          const finalMerchant = { ...registeredAcc, ...(get().customMerchants[registeredAcc.id] || {}), isCustomized: true };
          set({ 
            currentMerchant: finalMerchant, 
            loginRole: 'vendor', 
            supervisorId: null,
            services: [],
            bookings: [],
            supportTickets: [],
            staffAccounts: []
          });
          return true;
        }

        // 2. Check Sub ID (Supervisor)
        const subAcc = SUB_ACCOUNTS.find(
          (s) => s.subId.toUpperCase() === cleanUser.toUpperCase() && s.passwordHash === passwordHash
        );
        if (subAcc) {
          const found = PRESET_MERCHANTS.find((m) => m.id === subAcc.merchantId);
          if (found) {
            set({ currentMerchant: found, loginRole: 'supervisor', supervisorId: subAcc.subId });
            // No mock seeding - user gets a blank slate
            return true;
          }
        }

        // 2. Check Main Vendor Account
        const isVendor = VENDOR_ACCOUNTS.some(
          (v) => v.username.toLowerCase() === lowerUser && v.passwordHash === passwordHash
        );
        // Allow passXXX where XXX is the numeric part of the username (e.g. T102 -> pass102)
        const expectedPass = 'pass' + lowerUser.replace(/\D/g, '');
        const isLegacyPreset = (passwordHash === '123' || passwordHash.toLowerCase() === expectedPass) && PRESET_MERCHANTS.some(m => m.username.toLowerCase() === lowerUser || lowerUser === 'admin');

        if (isVendor || isLegacyPreset) {
          const checkUsername = lowerUser === 'admin' || lowerUser === 'vendor123' ? 'doctor' : lowerUser;
          let found = PRESET_MERCHANTS.find((m) => m.username.toLowerCase() === checkUsername);
          if (!found) {
            found = PRESET_MERCHANTS[0];
          }
          const finalMerchant = { ...found, ...(get().customMerchants[found.id] || {}) };
          set({ 
            currentMerchant: finalMerchant, 
            loginRole: 'vendor', 
            supervisorId: null,
            services: [],
            bookings: [],
            supportTickets: [],
            staffAccounts: []
          });
          
          // No mock seeding - user gets a blank slate when starting fresh
          return true;
        }

        return false;
      },
      
      registerMerchant: (merchant, passwordHash) => {
        const newMerchant = { ...merchant, passwordHash };
        set((state) => ({
          registeredMerchants: [...state.registeredMerchants, newMerchant],
        }));
        return true;
      },
      
      logoutMerchant: () => {
        set({ 
          currentMerchant: null, 
          loginRole: null, 
          supervisorId: null, 
          currentStaff: null,
          services: [],
          bookings: [],
          supportTickets: [],
          staffAccounts: []
        });
      },
      
      switchStore: (merchantId) => {
        let found = PRESET_MERCHANTS.find((m) => m.id === merchantId);
        if (!found && merchantId.startsWith('mer-')) {
          const checkUsername = merchantId.replace('mer-', '');
          const categoryName = formatSlug(checkUsername);
          found = {
            id: merchantId,
            username: checkUsername,
            merchantName: `${categoryName} Care Hub`,
            category: categoryName,
            logoLetter: categoryName.charAt(0),
            aboutText: `Welcome to ${categoryName} Care Hub. We provide professional bookings and top-tier services.`
          };
        }
        if (!found) {
          found = PRESET_MERCHANTS[0];
        }
        const finalMerchant = { ...found, ...(get().customMerchants[found.id] || {}) };
        
        // When switching stores, clear the previous store's data from memory so it doesn't bleed over
        set({ 
          currentMerchant: finalMerchant, 
          loginRole: 'vendor', 
          supervisorId: null,
          services: [],
          bookings: [],
          supportTickets: [],
          staffAccounts: []
        });
      },
      
      checkInBooking: (bookingId) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'CHECKED_IN' as const } : b
          )
        }));
      },
      
      completeBooking: (bookingId) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'COMPLETED' } : b
          ),
        })),

      cancelBooking: (bookingId) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
          ),
        })),

      rescheduleBooking: (bookingId, newDate, newTime) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, date: newDate, time: newTime } : b
          ),
        })),

      updateBookingNotes: (bookingId, notes) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, notes } : b
          )
        }));
      },
      
      // Medical actions
      uploadReport: (bookingId, reportName) => {
        const newReport = {
          id: `rep-${Date.now()}`,
          name: reportName,
          url: 'https://picsum.photos/seed/rep/300/300',
          uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id === bookingId) {
              const currentReports = b.medicalReports || [];
              return { ...b, medicalReports: [...currentReports, newReport] };
            }
            return b;
          })
        }));
      },
      
      deleteReport: (bookingId, reportId) => {
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id === bookingId) {
              const currentReports = b.medicalReports || [];
              return {
                ...b,
                medicalReports: currentReports.filter((r) => r.id !== reportId)
              };
            }
            return b;
          })
        }));
      },
      
      savePrescription: (bookingId, prescription) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, prescription } : b
          )
        }));
      },
      
      // Fitness actions
      assignDiet: (bookingId, diet) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, dietPlan: diet } : b
          )
        }));
      },
      
      saveWorkout: (bookingId, workout) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, workoutPlan: workout } : b
          )
        }));
      },
      
      // Salon actions
      saveStylingDetails: (bookingId, details) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  stylistAssigned: details.stylist,
                  hairType: details.hairType,
                  skinType: details.skinType,
                  stylingNotes: details.stylingNotes
                }
              : b
          )
        }));
      },
      
      uploadBeforeAfterPhoto: (bookingId, photoSeed) => {
        const photoUrl = `https://picsum.photos/seed/${photoSeed}/200/200`;
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id === bookingId) {
              const currentGallery = b.beforeAfterGallery || [];
              return { ...b, beforeAfterGallery: [...currentGallery, photoUrl] };
            }
            return b;
          })
        }));
      },
      
      // Dining actions
      assignTable: (bookingId, tableNumber) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, tableNumber } : b
          )
        }));
      },
      
      saveDietaryAlerts: (bookingId, alerts) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, dietaryRestrictions: alerts } : b
          )
        }));
      },

      // Services actions
      fetchServices: async () => {
        try {
          const isProd = process.env.NODE_ENV === 'production' || (typeof window !== 'undefined' && window.location.hostname !== 'localhost');
          const baseUrl = isProd ? 'https://bokspot-be.onrender.com/api/v1' : 'http://localhost:9000/api/v1';
          const activeMerchantId = get().currentMerchant?.id || '2cf63fd7-6710-4ac6-a3fa-8cbda29fdc0e';
          
          // Add 60 second timeout so the app doesn't hang if backend is down, but allows Render cold starts and large base64 image payloads
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000);
          
          const res = await fetch(`${baseUrl}/services?merchantId=${activeMerchantId}`, { 
            cache: 'no-store',
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (res.ok) {
            const body = await res.json();
            let servicesData = [];
            if (Array.isArray(body?.data)) {
              servicesData = body.data;
            } else if (Array.isArray(body)) {
              servicesData = body;
            } else if (body?.data?.items && Array.isArray(body.data.items)) {
              servicesData = body.data.items;
            } else if (body?.data?.data && Array.isArray(body.data.data)) {
              servicesData = body.data.data;
            }
            
            // Map the API data structure to the BUS-FE structure
            const currentMerchant = get().currentMerchant;
            const currentMerchantName = currentMerchant?.merchantName;
            const currentArchetype = currentMerchant?.archetype;
            
            // Archetype → allowed category names/keywords mapping
            const ARCHETYPE_CATEGORY_MAP: Record<string, string[]> = {
              'Accommodation': ['hotel', 'resort', 'hostel', 'villa', 'homestay', 'room', 'accommodation', 'stay'],
              'Healthcare': ['doctor', 'clinic', 'medical', 'health', 'dental', 'appointment'],
              'SportsFacility': ['turf', 'cricket', 'football', 'badminton', 'tennis', 'basketball', 'swimming', 'sport', 'court', 'ground'],
              'Dining': ['restaurant', 'dining', 'food', 'table', 'reservation'],
              'Fitness': ['gym', 'yoga', 'fitness', 'workout', 'slot'],
              'EventSpace': ['event', 'concert', 'theatre', 'movie', 'cinema', 'hall', 'venue'],
              'Rental': ['rental', 'car', 'bike', 'vehicle'],
              'CareServices': ['salon', 'spa', 'care', 'beauty', 'hair'],
              'Service': [], // Generic — show all
            };
            
            // Filter 1: by merchantName (exact match if possible)
            const byName = currentMerchantName
              ? servicesData.filter((s: any) => s.metadata?.merchantName === currentMerchantName)
              : [];
            
            // If no services found for this merchant, return empty array instead of falling back to generic archetype services
            let filteredData = byName;
            const mapped = filteredData.map((s: any) => {
              let fetchedMerchantName = s.metadata?.merchantName || currentMerchantName || 'Grand Hotel';
              
              return {
                id: s.id,
                name: s.name,
                merchant: fetchedMerchantName,
                price: s.basePrice || 0,
                duration: s.durationMinutes || 60,
                category: s.metadata?.originalCategory || s.category?.name || 'General',
                active: s.isActive ?? true,
                rating: s.rating || 0,
                bookingsCount: s.reviewCount || 0,
                imageUrl: s.images?.[0] || s.metadata?.mainImageUrl || s.metadata?.images?.[0] || '',
                description: s.description || '',
                city: s.merchant?.city || s.city || 'Chennai',
                metadata: s.metadata || {},
                createdAt: s.createdAt,
                listings: s.metadata?.listings || [
                  {
                    id: s.id,
                    name: s.name,
                    price: s.basePrice || 0,
                    duration: s.durationMinutes || 60,
                    imageUrl: s.images?.[0] || s.metadata?.images?.[0] || '',
                    active: s.isActive ?? true
                  }
                ],
                isTimingEnabled: s.isTimingEnabled,
                timingDetails: s.timingDetails,
                isCapacityEnabled: s.isCapacityEnabled,
                participantCapacity: s.participantCapacity,
                isAddonsEnabled: s.isAddonsEnabled,
                addOns: s.addOns || [],
                isTipsEnabled: s.isTipsEnabled,
                tipsAndGuidelines: s.tipsAndGuidelines,
                isRestrictionsEnabled: s.isRestrictionsEnabled,
                restrictions: s.restrictions,
                isOffersEnabled: s.isOffersEnabled,
                offersAndDiscounts: s.offersAndDiscounts,
                isInstructionsEnabled: s.isInstructionsEnabled,
                specialInstructions: s.specialInstructions
              };
            });
            
            set({ services: mapped });
          }
        } catch (e: any) {
          // Silently fail — backend may be offline or cold starting
          // App will use local store state (services already in memory)
          if (e?.name !== 'AbortError') {
            console.warn('Backend offline — using local services data:', e?.message);
          }
        }
      },
      
      addService: async (service) => {
        try {
          const isProd = process.env.NODE_ENV === 'production' || (typeof window !== 'undefined' && window.location.hostname !== 'localhost');
          const baseUrl = isProd ? 'https://bokspot-be.onrender.com/api/v1' : 'http://localhost:9000/api/v1';
          // Convert local CatalogService structure to CreateServiceDto
          // Fetch the correct category ID from the backend to handle DB differences (Local vs Prod)
          let validCategoryId = isProd ? 'b06981f6-b12b-4905-be30-d74da4b6906b' : '712cb562-7f6a-4fea-9145-00c6da59ebc3'; // Prod/Local Fallback
          try {
            const catRes = await fetch(`${baseUrl}/services/categories`);
            if (catRes.ok) {
              const catBody = await catRes.json();
              const merchantCategory = (get().currentMerchant?.category || '').toLowerCase();
              const serviceNameLower = (service.name || '').toLowerCase();
              const serviceCategoryLower = (service.category || '').toLowerCase();
              
              // First try to match the chosen service category precisely
              let matchedCat = catBody.data?.find((c: any) => 
                c.name.toLowerCase().includes(serviceCategoryLower) || 
                c.slug.replace(/-/g, ' ').includes(serviceCategoryLower)
              );

              // Second try to match the service name itself to a global category!
              if (!matchedCat) {
                matchedCat = catBody.data?.find((c: any) => 
                  c.name.toLowerCase().includes(serviceNameLower) || 
                  c.slug.replace(/-/g, ' ').includes(serviceNameLower)
                );
              }
              
              // Fallback to merchant category if no direct match found
              if (!matchedCat) {
                matchedCat = catBody.data?.find((c: any) => 
                  c.name.toLowerCase() === merchantCategory || 
                  merchantCategory.includes(c.slug) || 
                  merchantCategory.includes(c.name.toLowerCase())
                );
              }
              
              if (!matchedCat && merchantCategory.includes('doctor')) matchedCat = catBody.data?.find((c: any) => c.slug === 'doctor');
              if (!matchedCat && merchantCategory.includes('spa')) matchedCat = catBody.data?.find((c: any) => c.slug === 'salons');
              if (!matchedCat) matchedCat = catBody.data?.find((c: any) => c.slug === 'general-service');
              
              if (matchedCat) {
                validCategoryId = matchedCat.id;
              } else {
                validCategoryId = 'b06981f6-b12b-4905-be30-d74da4b6906b'; // general-service fallback
              }
            }
          } catch (err) {
            console.warn('Could not fetch categories, using fallback ID');
          }
          
          const payload = {
            name: service.name,
            categoryId: validCategoryId,
            description: service.description || 'No description provided for this category.',
            shortDescription: service.description ? service.description.substring(0, 250) : 'No description provided for this category.',
            serviceType: 'RENTAL',
            durationMinutes: Number(service.duration) || 60,
            basePrice: Number(service.price) || 0,
            maxCapacity: Number(service.maxCapacity) || 1,
            images: [service.imageUrl || ''],
            metadata: { 
              ...(service.metadata || {}),
              merchantName: get().currentMerchant?.merchantName || service.merchant,
              originalCategory: service.category,
              listings: service.listings 
            },
            isTimingEnabled: Boolean(service.isTimingEnabled),
            timingDetails: String(service.timingDetails || ''),
            isCapacityEnabled: Boolean(service.isCapacityEnabled),
            participantCapacity: Number(service.participantCapacity) || 0,
            isAddonsEnabled: Boolean(service.isAddonsEnabled),
            addOns: service.addOns || [],
            isTipsEnabled: Boolean(service.isTipsEnabled),
            tipsAndGuidelines: String(service.tipsAndGuidelines || ''),
            isRestrictionsEnabled: Boolean(service.isRestrictionsEnabled),
            restrictions: String(service.restrictions || ''),
            isOffersEnabled: Boolean(service.isOffersEnabled),
            offersAndDiscounts: String(service.offersAndDiscounts || ''),
            isInstructionsEnabled: Boolean(service.isInstructionsEnabled),
            specialInstructions: String(service.specialInstructions || ''),
            
            // Location payload
            latitude: service.latitude,
            longitude: service.longitude
          };
          
          // Use the actual current merchant ID from state (which now correctly uses valid UUIDs)
          const activeMerchantId = get().currentMerchant?.id || '2cf63fd7-6710-4ac6-a3fa-8cbda29fdc0e';
          const res = await fetch(`${baseUrl}/services/${activeMerchantId}`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            const errText = await res.text();
            console.error('Backend rejected addService:', errText);
            alert('Failed to save to database. Error: ' + errText);
          } else {
            const data = await res.json();
            const finalService = { ...service, id: data.data?.id || service.id };
            set((state) => ({
              services: [finalService, ...state.services]
            }));
            alert('Success! Category/Service saved to Database.');
          }
        } catch (e) {
          console.error('Failed to sync addService to backend', e);
          alert('Network Error. Could not connect to backend.');
        }
      },
      
      updateService: async (updated) => {
        // Optimistic update
        set((state) => ({
          services: state.services.map((s) => (s.id === updated.id ? updated : s))
        }));
        try {
          const isProd = process.env.NODE_ENV === 'production' || (typeof window !== 'undefined' && window.location.hostname !== 'localhost');
          const baseUrl = isProd ? 'https://bokspot-be.onrender.com/api/v1' : 'http://localhost:9000/api/v1';
          // Use properties from the first listing if available, as they contain the actual configured details (price, duration, toggles)
          const source = (updated.listings && updated.listings.length > 0) ? updated.listings[0] : updated;
          
          let validCategoryId = '712cb562-7f6a-4fea-9145-00c6da59ebc3'; // Fallback
          try {
            const catRes = await fetch(`${baseUrl}/services/categories`);
            if (catRes.ok) {
              const catBody = await catRes.json();
              const merchantCategory = (get().currentMerchant?.category || '').toLowerCase();
              const serviceNameLower = (updated.name || '').toLowerCase();
              const serviceCategoryLower = (updated.category || '').toLowerCase();
              
              // First try to match the chosen service category precisely
              let matchedCat = catBody.data?.find((c: any) => 
                c.name.toLowerCase().includes(serviceCategoryLower) || 
                c.slug.replace(/-/g, ' ').includes(serviceCategoryLower)
              );

              // Second try to match the service name itself to a global category!
              if (!matchedCat) {
                matchedCat = catBody.data?.find((c: any) => 
                  c.name.toLowerCase().includes(serviceNameLower) || 
                  c.slug.replace(/-/g, ' ').includes(serviceNameLower)
                );
              }
              
              // Fallback to merchant category if no direct match found
              if (!matchedCat) {
                matchedCat = catBody.data?.find((c: any) => 
                  c.name.toLowerCase() === merchantCategory || 
                  merchantCategory.includes(c.slug) || 
                  merchantCategory.includes(c.name.toLowerCase())
                );
              }
              
              if (!matchedCat && merchantCategory.includes('doctor')) matchedCat = catBody.data?.find((c: any) => c.slug === 'doctor');
              if (!matchedCat && merchantCategory.includes('spa')) matchedCat = catBody.data?.find((c: any) => c.slug === 'salons');
              if (!matchedCat) matchedCat = catBody.data?.find((c: any) => c.slug === 'general-service');
              
              if (matchedCat) {
                validCategoryId = matchedCat.id;
              } else {
                validCategoryId = 'b06981f6-b12b-4905-be30-d74da4b6906b'; // general-service fallback
              }
            }
          } catch (err) {
            console.warn('Could not fetch categories, using fallback ID');
          }
          
          const payload = {
            name: updated.name,
            categoryId: validCategoryId,
            description: updated.description || 'No description provided for this category.',
            shortDescription: updated.description ? updated.description.substring(0, 250) : 'No description provided for this category.',
            durationMinutes: Number(source.duration) || 60,
            basePrice: Number(source.price) || 0,
            maxCapacity: Number((source as any).maxCapacity) || 1,
            images: [updated.imageUrl || source.imageUrl || ''],
            metadata: { 
              ...(updated.metadata || {}),
              merchantName: get().currentMerchant?.merchantName || updated.merchant,
              listings: updated.listings 
            },
            isTimingEnabled: Boolean(source.isTimingEnabled),
            timingDetails: String(source.timingDetails || ''),
            isCapacityEnabled: Boolean(source.isCapacityEnabled),
            participantCapacity: Number(source.participantCapacity) || 0,
            isAddonsEnabled: Boolean(source.isAddonsEnabled),
            addOns: source.addOns || [],
            isTipsEnabled: Boolean(source.isTipsEnabled),
            tipsAndGuidelines: String(source.tipsAndGuidelines || ''),
            isRestrictionsEnabled: Boolean(source.isRestrictionsEnabled),
            restrictions: String(source.restrictions || ''),
            isOffersEnabled: Boolean(source.isOffersEnabled),
            offersAndDiscounts: String(source.offersAndDiscounts || ''),
            isInstructionsEnabled: Boolean(source.isInstructionsEnabled),
            specialInstructions: String(source.specialInstructions || '')
          };
          
          const res = await fetch(`${baseUrl}/services/${updated.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            console.error('Backend rejected updateService:', await res.text());
          }
        } catch (e) {
          console.error('Failed to sync updateService to backend', e);
        }
      },
      
      deleteService: async (serviceId) => {
        set((state) => ({
          services: state.services.filter((s) => s.id !== serviceId)
        }));
        try {
          const isProd = process.env.NODE_ENV === 'production' || (typeof window !== 'undefined' && window.location.hostname !== 'localhost');
          const baseUrl = isProd ? 'https://bokspot-be.onrender.com/api/v1' : 'http://localhost:9000/api/v1';
          await fetch(`${baseUrl}/services/${serviceId}`, {
            method: 'DELETE'
          });
        } catch (e) {
          console.error('Failed to sync deleteService to backend', e);
        }
      },

      // Staff actions
      addStaffMember: (staff) => {
        set((state) => ({
          staffAccounts: [...state.staffAccounts, staff]
        }));
      },
      
      updateStaffPermissions: (staffId, permissions) => {
        set((state) => ({
          staffAccounts: state.staffAccounts.map((s) => 
            s.id === staffId ? { ...s, permissions } : s
          ),
          currentStaff: state.currentStaff?.id === staffId 
            ? { ...state.currentStaff, permissions } 
            : state.currentStaff
        }));
      },
      
      deleteStaffMember: (staffId) => {
        set((state) => ({
          staffAccounts: state.staffAccounts.filter((s) => s.id !== staffId)
        }));
      },

      fetchSupportTickets: async () => {
        try {
          const isProd = process.env.NODE_ENV === 'production' || (typeof window !== 'undefined' && window.location.hostname !== 'localhost');
          const baseUrl = isProd ? 'https://bokspot-be.onrender.com/api/v1' : 'http://localhost:9000/api/v1';
          const res = await fetch(`${baseUrl}/tickets`);
          if (res.ok) {
            const body = await res.json();
            const ticketsData = body.data || [];
            // Map the API data structure to the BUS-FE structure
            const mapped = ticketsData.map((t: any) => ({
              id: t.id,
              merchantId: t.merchantId,
              merchantName: t.merchantName,
              subject: t.subject,
              message: t.message,
              status: t.status.toLowerCase(), // OPEN -> open
              createdAt: t.createdAt
            }));
            set({ supportTickets: mapped });
          }
        } catch (e) {
          console.error('Failed to fetch tickets from backend', e);
        }
      },

      addSupportTicket: async (ticket) => {
        try {
          const isProd = process.env.NODE_ENV === 'production' || (typeof window !== 'undefined' && window.location.hostname !== 'localhost');
          const baseUrl = isProd ? 'https://bokspot-be.onrender.com/api/v1' : 'http://localhost:9000/api/v1';
          const res = await fetch(`${baseUrl}/tickets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...ticket, targetType: 'ADMIN' })
          });
          if (res.ok) {
            const body = await res.json();
            const newTicket = body.data;
            const mappedTicket = {
              id: newTicket.id,
              merchantId: newTicket.merchantId,
              merchantName: newTicket.merchantName,
              subject: newTicket.subject,
              message: newTicket.message,
              status: newTicket.status.toLowerCase(),
              createdAt: newTicket.createdAt
            };
            set((state) => ({
              supportTickets: [mappedTicket, ...state.supportTickets]
            }));
          }
        } catch (e) {
          console.error('Failed to create ticket in backend', e);
        }
      },

      resolveSupportTicket: (ticketId) => {
        set((state) => ({
          supportTickets: state.supportTickets.map((t) =>
            t.id === ticketId ? { ...t, status: 'resolved' } : t
          )
        }));
      },

      updateSupportTicketStatus: async (ticketId, status) => {
        try {
          const isProd = process.env.NODE_ENV === 'production' || (typeof window !== 'undefined' && window.location.hostname !== 'localhost');
          const baseUrl = isProd ? 'https://bokspot-be.onrender.com/api/v1' : 'http://localhost:9000/api/v1';
          const res = await fetch(`${baseUrl}/tickets/${ticketId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: status.toUpperCase() })
          });
          if (res.ok) {
            set((state) => ({
              supportTickets: state.supportTickets.map((t) =>
                t.id === ticketId ? { ...t, status } : t
              )
            }));
          }
        } catch (e) {
          console.error('Failed to update ticket status', e);
          // Fallback local update
          set((state) => ({
            supportTickets: state.supportTickets.map((t) =>
              t.id === ticketId ? { ...t, status } : t
            )
          }));
        }
      }
    }),
    { name: 'vendor-portal-storage-v9' }
  )
);
