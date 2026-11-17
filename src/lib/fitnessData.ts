// Gym / Yoga Slot & Fitness Pass Dynamic Registry & Master Schemas
// Connects dynamically to Merchant Services & Fitness Trainer Roster

export interface FitnessTrainer {
  id: string;
  name: string;
  role: string; // e.g. "Senior Ashtanga Yoga Master", "CrossFit & Strength Coach", "Functional Movement Specialist"
  avatar: string;
  rating: number;
  experienceYears: number;
  specialties: string[];
}

export interface FitnessPassItem {
  id: string;
  name: string;
  formatType: 'OPEN_GYM' | 'YOGA_CLASS' | 'PERSONAL_TRAINING' | 'CROSSFIT';
  price: number;
  durationMinutes: number; // 60 mins or full day 720 mins
  batchType: 'SINGLE_SESSION' | 'DAY_PASS' | 'MONTHLY_MEMBERSHIP';
  maxCapacity: number; // e.g. 15 spots per yoga batch or 40 for open gym
  icon: string;
  description: string;
  amenities: string[];
}

export interface FitnessVenueConfig {
  slug: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: string;
  city: string;
  locality: string;
  address: string;
  openingHours: string;
  heroImage: string;
  galleryImages: string[];
  features: string[];
  passes: FitnessPassItem[];
  trainers: FitnessTrainer[];
  timeSlots: {
    time: string;
    session: 'MORNING' | 'EVENING';
    spotsLeft: number;
  }[];
}

export const MASTER_FITNESS_CONFIG: Record<string, FitnessVenueConfig> = {
  'zenfit-clinic': {
    slug: 'zenfit-clinic',
    name: 'ZenFit Fitness Club & Himalayan Yoga Shala',
    category: 'Gym / Yoga Slot Booking',
    rating: 4.9,
    reviewsCount: '540+ reviews',
    city: 'Chennai',
    locality: 'Alwarpet / TTK Road',
    address: '84 TTK Road, Alwarpet, Chennai, Tamil Nadu 600018',
    openingHours: '05:30 AM – 10:00 PM (Monday – Sunday)',
    heroImage: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80'
    ],
    features: [
      'Imported Biomechanical Hammer Strength Equipment',
      'Bamboo-Floored Sound-Insulated Yoga Shala',
      'Locker Rooms with Steam & Hot Showers',
      'In-House Whey Shake & Cold Brew Bar',
      'Valet Parking & EV Charging Spot'
    ],
    passes: [
      {
        id: 'pass-open-gym',
        name: 'Full Day Open Gym & Cardio Floor Pass',
        formatType: 'OPEN_GYM',
        price: 299,
        durationMinutes: 720,
        batchType: 'DAY_PASS',
        maxCapacity: 45,
        icon: '🏋️',
        description: 'Unlimited single-day access to free weights, squat racks, turf track, cardio machines & steam shower.',
        amenities: ['Locker with Key', 'Steam Bath Access', 'Shower & Towel']
      },
      {
        id: 'pass-sunrise-yoga',
        name: 'Sunrise Traditional Hatha Yoga Batch',
        formatType: 'YOGA_CLASS',
        price: 399,
        durationMinutes: 60,
        batchType: 'SINGLE_SESSION',
        maxCapacity: 16,
        icon: '🧘',
        description: 'Breathing pranayama, surya namaskars, deep flexibility asanas, and guided sound bowl meditation.',
        amenities: ['Manduka Pro Mat Included', 'Sound Bowl Healing', 'Herbal Detox Tea']
      },
      {
        id: 'pass-power-yoga',
        name: 'Sunset Vinyasa Power Flow & Core Conditioning',
        formatType: 'YOGA_CLASS',
        price: 449,
        durationMinutes: 60,
        batchType: 'SINGLE_SESSION',
        maxCapacity: 14,
        icon: '🔥',
        description: 'High-energy calorie-burning yoga flow targeting core strength, endurance, and post-workout cool down.',
        amenities: ['Cushioned Mat', 'Blocks & Straps Provided', 'Cool Down Aromatherapy']
      },
      {
        id: 'pass-pt-session',
        name: '1-on-1 Certified Personal Trainer Session',
        formatType: 'PERSONAL_TRAINING',
        price: 799,
        durationMinutes: 60,
        batchType: 'SINGLE_SESSION',
        maxCapacity: 1,
        icon: '💪',
        description: 'Dedicated 60-min personalized session with a master strength coach, postural check & workout log.',
        amenities: ['Dedicated Coach', 'InBody Body Composition Scan', 'Post-Workout Protein Shake']
      }
    ],
    trainers: [
      {
        id: 'trn-ananya',
        name: 'Acharya Ananya Sharma',
        role: 'Lead Yoga & Meditation Master',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
        rating: 4.96,
        experienceYears: 10,
        specialties: ['Hatha Yoga', 'Pranayama', 'Sound Bowl Therapy']
      },
      {
        id: 'trn-vikram',
        name: 'Vikram Rathore, CSCS',
        role: 'Head Strength & Conditioning Coach',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80',
        rating: 4.92,
        experienceYears: 8,
        specialties: ['Powerlifting', 'Hypertrophy', 'Fat Loss Conditioning']
      }
    ],
    timeSlots: [
      // Morning Batches
      { time: '06:00 AM', session: 'MORNING', spotsLeft: 8 },
      { time: '07:15 AM', session: 'MORNING', spotsLeft: 4 },
      { time: '08:30 AM', session: 'MORNING', spotsLeft: 11 },
      { time: '09:45 AM', session: 'MORNING', spotsLeft: 15 },
      // Evening Batches
      { time: '05:00 PM', session: 'EVENING', spotsLeft: 6 },
      { time: '06:15 PM', session: 'EVENING', spotsLeft: 3 },
      { time: '07:30 PM', session: 'EVENING', spotsLeft: 9 },
      { time: '08:45 PM', session: 'EVENING', spotsLeft: 14 }
    ]
  }
};

export function getFitnessConfig(identifier?: string): FitnessVenueConfig {
  if (!identifier) return MASTER_FITNESS_CONFIG['zenfit-clinic'];
  const clean = identifier.toLowerCase().trim();
  const match = Object.values(MASTER_FITNESS_CONFIG).find(f => 
    f.slug.includes(clean) || clean.includes(f.slug) || f.name.toLowerCase().includes(clean)
  );
  return match || MASTER_FITNESS_CONFIG['zenfit-clinic'];
}
