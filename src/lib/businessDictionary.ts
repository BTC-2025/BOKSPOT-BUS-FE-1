import { 
  Stethoscope, 
  Dumbbell, 
  Briefcase, 
  Bed, 
  Scissors, 
  MonitorPlay,
  HeartPulse,
  Activity,
  User,
  Users,
  Wrench,
  Key,
  Calendar,
  Clock,
  Tent,
  type LucideIcon 
} from 'lucide-react';

export type ArchetypeConfig = {
  staffIcon?: any;

  feature1Label?: string;
  feature1Desc?: string;
  feature2Label?: string;
  feature2Desc?: string;

  bookingTitle: string;
  bookingIcon: LucideIcon;
  servicesTitle: string;
  servicesIcon: LucideIcon;
  staffTitle: string;
  
  kpiTotalBookings: string;
  kpiNewBookings: string;
  quickActionNew: string;
  liveWidgetTitle: string;
  
  drawerHeader: string;
  assignedStaffLabel: string;
  hasHealthVitals: boolean;
  hasMatchNotes: boolean;
  
  staffRoleLabel: string;
  staffRosterLabel: string;
  scanLabel: string;
  customerDirLabel: string;
  managementLabel: string;
  settingsLabel: string;
  themeClass: string;
  
  staffOnboardTitle: string;
  staffOnboardDesc: string;
  activeStaffLabel: string;
  newShiftLabel: string;
  servicesDesc: string;
  servicesEmptyTitle: string;
  servicesEmptyDesc: string;
  staffEmptyTitle: string;
  staffEmptyDesc: string;
  priceLabel: string;
  createServiceLabel: string;
  editServiceLabel: string;
  assignStaffLabel: string;
  deployServiceLabel: string;
  bookingHeaderTitle?: string;
  bookingHeaderDesc?: string;
  customerSearchPlaceholder?: string;
  bookingRefLabel?: string;
  bookingAssignedLabel?: string;
  emptyStateIcon?: any;
  customerDesc?: string;
  customerTierLabel?: string;
  customerMetricsLabel?: string;
  customerSpendLabel?: string;
  customerVolumeLabel?: string;
  gradientClass?: string;
  dashboardTitle?: string;
  metric1Title?: string;
  metric2Title?: string;
  metric3Title?: string;
  metric4Title?: string;
  trendTitle?: string;
  chartLabel?: string;
  liveQueueTitle?: string;
  hasOutdoorConditions?: boolean;
  staffRolePlaceholder?: string;
  serviceDurationPlaceholder?: string;
  staffNamePlaceholder?: string;
  staffEmailPlaceholder?: string;
  serviceNamePlaceholder?: string;
  serviceFeePlaceholder?: string;
  staffPermissionDesc?: string;
  staffPrefix?: string;
  gridNavLabel?: string;
  gridTitle?: string;
};

export const businessDictionary: Record<string, ArchetypeConfig> = {
  Healthcare: {

    staffIcon: 'Stethoscope',
    feature1Label: 'Manage Patient Vitals & Triage',
    feature1Desc: 'Can update BP, Temp, Pulse and view queue. (Ideal for Nurses)',
    feature2Label: 'Write Prescriptions & EMR',
    feature2Desc: 'Can add medicines, view medical reports. (Ideal for Sub-Doctors)',

    bookingTitle: 'Medical Records',
    bookingIcon: Activity,
    servicesTitle: 'Treatments',
    servicesIcon: Stethoscope,
    staffTitle: 'Medical Staff',
    kpiTotalBookings: 'Total Patients',
    kpiNewBookings: 'New Appointments',
    quickActionNew: '+ New Patient',
    liveWidgetTitle: 'Emergency Cases',
    drawerHeader: 'Master Clinical Chart',
    assignedStaffLabel: 'Consulting Physician',
    hasHealthVitals: true,
    hasMatchNotes: false,
    staffRoleLabel: 'Doctor/Specialist',
    staffRosterLabel: 'Staff Access & Roster',
    scanLabel: 'Scan Patient Token',
    customerDirLabel: 'Patient Database',
    managementLabel: 'Schedules & Shifts',
    settingsLabel: 'Clinic Settings',
    themeClass: 'theme-medical',
    staffOnboardTitle: 'Onboard Doctor',
    staffOnboardDesc: 'Onboard medical professionals to your platform to start accepting appointments.',
    activeStaffLabel: 'Active Medical Professionals',
    newShiftLabel: 'New Shift',
    servicesDesc: 'Manage your medical staff, create consultation services, and assign detailed shift timings across the hospital network.',
    servicesEmptyTitle: 'No Shifts Defined',
    servicesEmptyDesc: 'Create shifts to allocate time slots for your doctors to receive patient bookings.',
    staffEmptyTitle: 'No Doctors Found',
    staffEmptyDesc: 'Onboard medical professionals to your platform to start accepting appointments.',
    priceLabel: 'Fee',
    createServiceLabel: 'Create Shift',
    editServiceLabel: 'Edit Shift',
    assignStaffLabel: 'Assign Doctor',
    deployServiceLabel: 'Deploy Shift Schedule',
  },
  ResourceBooking: {
    bookingTitle: 'Match Logs',
    bookingIcon: Calendar,
    servicesTitle: 'Facilities',
    servicesIcon: MonitorPlay,
    staffTitle: 'Ground Staff',
    kpiTotalBookings: 'Total Matches',
    kpiNewBookings: 'Upcoming Games',
    quickActionNew: '+ New Booking',
    liveWidgetTitle: 'Pitch/Weather Status',
    drawerHeader: 'Match Log Details',
    assignedStaffLabel: 'Assigned Staff/Ref',
    hasHealthVitals: false,
    hasMatchNotes: true,
    staffRoleLabel: 'Referee/Manager',
    staffRosterLabel: 'Ground Staff Roster',
    scanLabel: 'Scan Player Pass',
    customerDirLabel: 'Teams & Players',
    managementLabel: 'Pitch Management',
    settingsLabel: 'Facility Settings',
    themeClass: 'theme-turf',
    staffOnboardTitle: 'Onboard Staff',
    staffOnboardDesc: 'Onboard referees and managers to your platform.',
    activeStaffLabel: 'Active Ground Staff',
    newShiftLabel: 'New Pitch Slot',
    servicesDesc: 'Manage your referees, ground staff, and create pitch booking slots for teams.',
    servicesEmptyTitle: 'No Pitches Defined',
    servicesEmptyDesc: 'Create pitch availability slots for customers to book.',
    staffEmptyTitle: 'No Staff Found',
    staffEmptyDesc: 'Onboard referees and managers to your platform.',
    priceLabel: 'Price',
    createServiceLabel: 'Create Pitch Slot',
    editServiceLabel: 'Edit Pitch Slot',
    assignStaffLabel: 'Assign Referee/Manager',
    deployServiceLabel: 'Deploy Pitch Slot',
  },
  Service: {

    staffIcon: 'User',
    feature1Label: 'Manage Core Operations',
    feature1Desc: 'Can view and update daily business operations and schedules.',
    feature2Label: 'Advanced Reports & Billing',
    feature2Desc: 'Can view sensitive financial reports and manage billing operations.',

    bookingTitle: 'Work Orders',
    bookingIcon: Clock,
    servicesTitle: 'Services',
    servicesIcon: Wrench,
    staffTitle: 'Technicians',
    kpiTotalBookings: 'Total Work Orders',
    kpiNewBookings: 'New Requests',
    quickActionNew: '+ New Work Order',
    liveWidgetTitle: 'Active Service Calls',
    drawerHeader: 'Work Order Details',
    assignedStaffLabel: 'Assigned Technician',
    hasHealthVitals: false,
    hasMatchNotes: false,
    staffRoleLabel: 'Technician/Pro',
    staffRosterLabel: 'Technician Roster',
    scanLabel: 'Scan Job ID',
    customerDirLabel: 'Client Base',
    managementLabel: 'Field Operations',
    settingsLabel: 'Business Settings',
    themeClass: 'theme-service',
    staffOnboardTitle: 'Onboard Technician',
    staffOnboardDesc: 'Onboard your technical workforce.',
    activeStaffLabel: 'Active Technicians',
    newShiftLabel: 'New Work Shift',
    servicesDesc: 'Manage your field technicians, electricians, and schedule work shifts.',
    servicesEmptyTitle: 'No Slots Defined',
    servicesEmptyDesc: 'Create service availability slots for clients.',
    staffEmptyTitle: 'No Technicians Found',
    staffEmptyDesc: 'Onboard your technical workforce.',
    priceLabel: 'Service Charge',
    createServiceLabel: 'Create Shift',
    editServiceLabel: 'Edit Shift',
    assignStaffLabel: 'Assign Technician',
    deployServiceLabel: 'Deploy Service Slot',
  },
  Accommodation: {

    staffIcon: 'User',
    feature1Label: 'Manage Core Operations',
    feature1Desc: 'Can view and update daily business operations and schedules.',
    feature2Label: 'Advanced Reports & Billing',
    feature2Desc: 'Can view sensitive financial reports and manage billing operations.',

    bookingTitle: 'Reservations',
    bookingIcon: Calendar,
    servicesTitle: 'Room Types',
    servicesIcon: Bed,
    staffTitle: 'Hotel Staff',
    kpiTotalBookings: 'Total Reservations',
    kpiNewBookings: 'Check-ins Today',
    quickActionNew: '+ New Reservation',
    liveWidgetTitle: 'Room Availability',
    drawerHeader: 'Reservation Details',
    assignedStaffLabel: 'Assigned Staff',
    hasHealthVitals: false,
    hasMatchNotes: false,
    staffRoleLabel: 'Reception/Housekeeping',
    staffRosterLabel: 'Staff & Access Control',
    scanLabel: 'Scan Booking ID',
    customerDirLabel: 'Customer Database',
    managementLabel: 'Room Management',
    settingsLabel: 'Hotel Settings',
    themeClass: 'theme-hotel',
    staffOnboardTitle: 'Onboard Staff',
    staffOnboardDesc: 'Onboard your reception and housekeeping staff.',
    activeStaffLabel: 'Active Hotel Staff',
    newShiftLabel: 'New Room Type',
    servicesDesc: 'Manage your hotel staff, create room types, and define tariff prices.',
    servicesEmptyTitle: 'No Rooms Defined',
    servicesEmptyDesc: 'Create room categories and define tariff prices.',
    staffEmptyTitle: 'No Staff Found',
    staffEmptyDesc: 'Onboard your reception and housekeeping staff to manage guests.',
    priceLabel: 'Tariff/Night',
    createServiceLabel: 'Create Room',
    editServiceLabel: 'Edit Room',
    assignStaffLabel: 'Assign Manager',
    deployServiceLabel: 'Add Room',
    customerSearchPlaceholder: 'Search guest name, room number, or reservation ID...',
    customerMetricsLabel: 'Stays',
    customerSpendLabel: 'Total Spent',
    customerVolumeLabel: 'Total Revenue',
    bookingRefLabel: 'Guest & Room',
    bookingAssignedLabel: 'Assigned Host / Manager',
    staffRolePlaceholder: 'e.g. Front Desk Executive, Housekeeping Lead, Resort Manager',
    staffNamePlaceholder: 'e.g. Rajesh Kumar',
    staffEmailPlaceholder: 'e.g. frontdesk@resort.com',
    serviceNamePlaceholder: 'e.g. Deluxe Ocean View Villa, Luxury Swiss Cottage',
  },
  Hostel: {
    staffIcon: 'User',
    feature1Label: 'Manage Dorms & Bunks',
    feature1Desc: 'Can assign dorm beds, track locker keys, and manage check-in/out schedules.',
    feature2Label: 'Hostel Revenue & Billing',
    feature2Desc: 'Can view dormitory occupancy revenue, caution deposits, and guest billing.',
    bookingTitle: 'Hostel Bookings',
    bookingIcon: Calendar,
    servicesTitle: 'Dorm & Room Types',
    servicesIcon: Bed,
    staffTitle: 'Hostel Crew',
    kpiTotalBookings: 'Total Hostellers',
    kpiNewBookings: 'Check-ins Today',
    quickActionNew: '+ New Hostel Booking',
    liveWidgetTitle: 'Dorm & Bed Availability',
    drawerHeader: 'Hostel Reservation Details',
    assignedStaffLabel: 'Hostel Warden / Manager',
    hasHealthVitals: false,
    hasMatchNotes: false,
    staffRoleLabel: 'Warden / Front Desk / Caretaker',
    staffRosterLabel: 'Hostel Crew Roster',
    scanLabel: 'Scan Student / Guest Pass',
    customerDirLabel: 'Hosteller Directory',
    managementLabel: 'Dorm & Bed Management',
    settingsLabel: 'Hostel Settings',
    themeClass: 'theme-hotel',
    staffOnboardTitle: 'Onboard Hostel Staff',
    staffOnboardDesc: 'Onboard wardens, caretakers, and front desk receptionists.',
    activeStaffLabel: 'Active Hostel Staff',
    newShiftLabel: 'New Dorm / Bed Plan',
    servicesDesc: 'Manage hostel rooms, 4-bed/6-bed/8-bed AC/Non-AC dorms, and bed tariffs.',
    servicesEmptyTitle: 'No Dorms or Beds Defined',
    servicesEmptyDesc: 'Create dorm categories (e.g. Mixed Dorm, Female Dorm, Private Room) and define bed tariffs.',
    staffEmptyTitle: 'No Hostel Crew Found',
    staffEmptyDesc: 'Onboard wardens and caretakers to manage check-ins and hostel curfew logs.',
    priceLabel: 'Tariff / Bed / Night',
    createServiceLabel: 'Add Dorm / Bed Type',
    editServiceLabel: 'Edit Dorm / Bed Type',
    assignStaffLabel: 'Assign Warden',
    deployServiceLabel: 'Publish Dorm / Bed',
    customerSearchPlaceholder: 'Search hosteller name, bed/bunk number, or reservation ID...',
    customerMetricsLabel: 'Hostel Stays',
    customerSpendLabel: 'Total Paid',
    customerVolumeLabel: 'Total Hostel Revenue',
    bookingRefLabel: 'Guest & Bed / Dorm',
    bookingAssignedLabel: 'Assigned Warden / Caretaker',
    staffRolePlaceholder: 'e.g. Hostel Warden, Night Caretaker, Frontdesk Associate',
    staffNamePlaceholder: 'e.g. Anand Sharma',
    staffEmailPlaceholder: 'e.g. warden@backpackershostel.com',
    serviceNamePlaceholder: 'e.g. 6-Bed Mixed AC Dorm Bed, 4-Bed Female Dorm Bed, Private Deluxe Bunk',
    serviceFeePlaceholder: 'e.g. 799',
    gridNavLabel: 'Dorm & Bed Grid',
    gridTitle: 'Hostel Dorm & Bed Allocation',
  },
  Camping: {
    staffIcon: 'User',
    feature1Label: 'Manage Tents, Domes & Campsites',
    feature1Desc: 'Can assign tent pitches, oversee campfire zones, and manage check-in/out schedules.',
    feature2Label: 'Camp Revenue & Gear Add-ons',
    feature2Desc: 'Can track overnight camp occupancy, BBQ packages, sleeping bags, and equipment rentals.',
    bookingTitle: 'Camp & Tent Reservations',
    bookingIcon: Tent,
    servicesTitle: 'Tents, Domes & Campsites',
    servicesIcon: Tent,
    staffTitle: 'Camp Crew & Guides',
    kpiTotalBookings: 'Total Campers',
    kpiNewBookings: 'Arrivals Today',
    quickActionNew: '+ New Camp Reservation',
    liveWidgetTitle: 'Tent & Campsite Availability',
    drawerHeader: 'Camp Reservation Details',
    assignedStaffLabel: 'Camp Manager / Trek Leader',
    hasHealthVitals: false,
    hasMatchNotes: false,
    staffRoleLabel: 'Camp Guide / Caretaker / Safety Officer',
    staffRosterLabel: 'Camp Crew Roster',
    scanLabel: 'Scan Camper Pass',
    customerDirLabel: 'Camper Directory',
    managementLabel: 'Campsite & Pitch Allocation',
    settingsLabel: 'Campsite Settings',
    themeClass: 'theme-hotel',
    staffOnboardTitle: 'Onboard Camp Staff',
    staffOnboardDesc: 'Onboard trek leaders, camp guides, safety marshals, and caretakers.',
    activeStaffLabel: 'Active Camp Crew',
    newShiftLabel: 'New Tent / Campsite Pitch',
    servicesDesc: 'Manage luxury alpine tents, stargazing glamping domes, wilderness pitches, and campfire packages.',
    servicesEmptyTitle: 'No Tents or Campsites Defined',
    servicesEmptyDesc: 'Create tent packages (e.g. 2-Person Alpine Tent, Luxury Glamping Dome, Open Campsite Pitch) and set tariffs.',
    staffEmptyTitle: 'No Camp Crew Found',
    staffEmptyDesc: 'Onboard camp guides and safety officers to manage check-ins and outdoor activities.',
    priceLabel: 'Tariff / Tent / Night',
    createServiceLabel: 'Add Tent / Campsite',
    editServiceLabel: 'Edit Tent / Campsite',
    assignStaffLabel: 'Assign Camp Guide',
    deployServiceLabel: 'Publish Campsite / Tent',
    customerSearchPlaceholder: 'Search camper name, tent/pitch ID, or reservation number...',
    customerMetricsLabel: 'Camp Stays',
    customerSpendLabel: 'Total Paid',
    customerVolumeLabel: 'Total Campsite Revenue',
    bookingRefLabel: 'Camper & Pitch / Tent',
    bookingAssignedLabel: 'Assigned Camp Guide / Lead',
    staffRolePlaceholder: 'e.g. Senior Trek Leader, Camp Marshal, Outdoor Chef',
    staffNamePlaceholder: 'e.g. Vikram Rana',
    staffEmailPlaceholder: 'e.g. leader@pinetrailscamp.com',
    serviceNamePlaceholder: 'e.g. 2-Person Alpine Tent, Luxury Stargazing Dome, Forest Clearing Pitch',
    serviceFeePlaceholder: 'e.g. 1999',
    gridNavLabel: 'Tent & Pitch Grid',
    gridTitle: 'Campsite & Pitch Allocation',
  },
  Beauty: {

    staffIcon: 'User',
    feature1Label: 'Manage Core Operations',
    feature1Desc: 'Can view and update daily business operations and schedules.',
    feature2Label: 'Advanced Reports & Billing',
    feature2Desc: 'Can view sensitive financial reports and manage billing operations.',

    bookingTitle: 'Appointments',
    bookingIcon: Calendar,
    servicesTitle: 'Services',
    servicesIcon: Scissors,
    staffTitle: 'Stylists',
    kpiTotalBookings: 'Total Appointments',
    kpiNewBookings: 'New Bookings',
    quickActionNew: '+ New Appointment',
    liveWidgetTitle: 'Stylist Availability',
    drawerHeader: 'Appointment Details',
    assignedStaffLabel: 'Assigned Stylist',
    hasHealthVitals: false,
    hasMatchNotes: false,
    staffRoleLabel: 'Stylist/Therapist',
    staffRosterLabel: 'Stylist Roster',
    scanLabel: 'Scan Appointment',
    customerDirLabel: 'Client Directory',
    managementLabel: 'Salon Management',
    settingsLabel: 'Salon Settings',
    themeClass: 'theme-salon',
    staffOnboardTitle: 'Onboard Stylist',
    staffOnboardDesc: 'Onboard your stylists and therapists.',
    activeStaffLabel: 'Active Stylists',
    newShiftLabel: 'New Service',
    servicesDesc: 'Manage your stylists and create beauty service slots.',
    servicesEmptyTitle: 'No Services Defined',
    servicesEmptyDesc: 'Create service availability slots for clients.',
    staffEmptyTitle: 'No Stylists Found',
    staffEmptyDesc: 'Onboard your stylists and therapists.',
    priceLabel: 'Price',
    createServiceLabel: 'Create Service',
    editServiceLabel: 'Edit Service',
    assignStaffLabel: 'Assign Stylist',
    deployServiceLabel: 'Deploy Service',
  },
  PassEntry: {
    staffIcon: 'User',
    feature1Label: 'Gate Scan & QR Validation',
    feature1Desc: 'Can scan digital tickets, validate PNR, and allow gate admittance.',
    feature2Label: 'Capacity & Pass Management',
    feature2Desc: 'Can monitor real-time passenger / visitor footfall and issue emergency passes.',
    bookingTitle: 'Tickets & Passes',
    bookingIcon: Calendar,
    servicesTitle: 'Routes & Schedules',
    servicesIcon: Clock,
    staffTitle: 'Gate / Crew Staff',
    kpiTotalBookings: 'Total Passes Issued',
    kpiNewBookings: 'Departures / Shows Today',
    quickActionNew: '+ Issue Ticket',
    liveWidgetTitle: 'Live Gate Scanning',
    drawerHeader: 'Pass & Boarding Details',
    assignedStaffLabel: 'Conductor / Gate Agent',
    hasHealthVitals: false,
    hasMatchNotes: false,
    staffRoleLabel: 'Gate Agent / Conductor',
    staffRosterLabel: 'Crew & Gate Roster',
    scanLabel: 'Scan Ticket QR / Barcode',
    customerDirLabel: 'Passenger / Attendee Roster',
    managementLabel: 'Gate & Fleet Ops',
    settingsLabel: 'Terminal Settings',
    themeClass: 'theme-pass',
    staffOnboardTitle: 'Onboard Crew Member',
    staffOnboardDesc: 'Onboard conductors, ticket checkers, and gate operators.',
    activeStaffLabel: 'Active Gate Staff',
    newShiftLabel: 'New Departure Slot',
    servicesDesc: 'Configure bus/train/flight routes, cinema showtimes, entry pass timings, and seat pricing.',
    servicesEmptyTitle: 'No Routes or Shows Scheduled',
    servicesEmptyDesc: 'Create timetable schedules to start issuing passes to customers.',
    staffEmptyTitle: 'No Gate Staff Found',
    staffEmptyDesc: 'Onboard gate operators or ticket controllers.',
    priceLabel: 'Ticket Fare',
    createServiceLabel: 'Create Departure / Show',
    editServiceLabel: 'Edit Schedule',
    assignStaffLabel: 'Assign Gate Attendant',
    deployServiceLabel: 'Publish Timetable',
  },
  FacilityHourly: {
    staffIcon: 'MonitorPlay',
    feature1Label: 'Pitch / Arena Allocations',
    feature1Desc: 'Can assign courts, manage equipment rentals, and record match results.',
    feature2Label: 'Slot Lock & Referee Roster',
    feature2Desc: 'Can oversee collision-safe hourly locks and assign match officials.',
    bookingTitle: 'Slot Bookings',
    bookingIcon: Calendar,
    servicesTitle: 'Arenas & Pitches',
    servicesIcon: MonitorPlay,
    staffTitle: 'Ground / Arena Staff',
    kpiTotalBookings: 'Total Booked Slots',
    kpiNewBookings: 'Matches Scheduled Today',
    quickActionNew: '+ Book Court Slot',
    liveWidgetTitle: 'Pitch Availability & Floodlights',
    drawerHeader: 'Court / Pitch Reservation',
    assignedStaffLabel: 'Referee / Slot Manager',
    hasHealthVitals: false,
    hasMatchNotes: true,
    staffRoleLabel: 'Ground Manager / Referee',
    staffRosterLabel: 'Field Crew Roster',
    scanLabel: 'Scan Booking Token',
    customerDirLabel: 'Teams & Player Directory',
    managementLabel: 'Pitch & Slot Manager',
    settingsLabel: 'Arena Settings',
    themeClass: 'theme-turf',
    staffOnboardTitle: 'Onboard Arena Staff',
    staffOnboardDesc: 'Onboard referees, pitch keepers, and shift managers.',
    activeStaffLabel: 'Active Ground Crew',
    newShiftLabel: 'New Hourly Slot',
    servicesDesc: 'Manage sports courts, studio spaces, turf pitches, and hourly meeting rooms.',
    servicesEmptyTitle: 'No Pitches or Arenas Configured',
    servicesEmptyDesc: 'Set hourly rates, floodlight surcharges, and peak slot timings.',
    staffEmptyTitle: 'No Ground Staff Found',
    staffEmptyDesc: 'Onboard referees and shift attendants.',
    priceLabel: 'Rate / Hour',
    createServiceLabel: 'Create Arena / Slot',
    editServiceLabel: 'Edit Slot',
    assignStaffLabel: 'Assign Referee / Manager',
    deployServiceLabel: 'Open Hourly Slots',
  },
  AssetRental: {
    staffIcon: 'Key',
    feature1Label: 'Asset Dispatch & Handover',
    feature1Desc: 'Can inspect vehicle/gear condition, check fuel/battery, and hand over keys.',
    feature2Label: 'Security Deposit & Return Log',
    feature2Desc: 'Can verify return status, odometer/damage inspection, and process deposit refunds.',
    bookingTitle: 'Rental Agreements',
    bookingIcon: Key,
    servicesTitle: 'Fleet & Inventory',
    servicesIcon: Briefcase,
    staffTitle: 'Fleet Managers',
    kpiTotalBookings: 'Total Rental Trips',
    kpiNewBookings: 'Active Rentals On Road',
    quickActionNew: '+ Dispatch Rental',
    liveWidgetTitle: 'Fleet Availability & Depot',
    drawerHeader: 'Rental Dispatch Details',
    assignedStaffLabel: 'Fleet Dispatcher',
    hasHealthVitals: false,
    hasMatchNotes: false,
    staffRoleLabel: 'Depot Fleet Lead',
    staffRosterLabel: 'Rental Crew Roster',
    scanLabel: 'Scan Vehicle / Gear Tag',
    customerDirLabel: 'Renter License Registry',
    managementLabel: 'Depot & Fleet Control',
    settingsLabel: 'Rental Agency Settings',
    themeClass: 'theme-rental',
    staffOnboardTitle: 'Onboard Dispatcher',
    staffOnboardDesc: 'Onboard mechanics, fleet dispatchers, and inspection coordinators.',
    activeStaffLabel: 'Active Fleet Staff',
    newShiftLabel: 'Add Fleet Asset',
    servicesDesc: 'Manage self-drive cars, bikes, cameras, and audiovisual rental inventory.',
    servicesEmptyTitle: 'No Fleet Inventory Found',
    servicesEmptyDesc: 'Add vehicles or equipment assets with daily tariff rates and security deposits.',
    staffEmptyTitle: 'No Fleet Staff Found',
    staffEmptyDesc: 'Onboard depot coordinators to verify customer licenses and dispatches.',
    priceLabel: 'Tariff / Day',
    createServiceLabel: 'Add Asset to Fleet',
    editServiceLabel: 'Edit Asset Details',
    assignStaffLabel: 'Assign Dispatcher',
    deployServiceLabel: 'Deploy Asset to Depot',
  },
  HomeCall: {
    staffIcon: 'Wrench',
    feature1Label: 'Dispatch & Work Orders',
    feature1Desc: 'Can route technicians to customer homes, view address GPS, and track on-site arrival.',
    feature2Label: 'Spare Parts & Billing Signoff',
    feature2Desc: 'Can log spare parts used, capture customer signoff OTP, and close service calls.',
    bookingTitle: 'Work Orders',
    bookingIcon: Clock,
    servicesTitle: 'Service Catalogue',
    servicesIcon: Wrench,
    staffTitle: 'Field Technicians',
    kpiTotalBookings: 'Total Work Orders',
    kpiNewBookings: 'Pending Visits Today',
    quickActionNew: '+ Dispatch Pro',
    liveWidgetTitle: 'Live Field Dispatch',
    drawerHeader: 'Work Order & Doorstep Visit',
    assignedStaffLabel: 'Assigned Pro / Technician',
    hasHealthVitals: false,
    hasMatchNotes: false,
    staffRoleLabel: 'Electrician / Plumber / Pro',
    staffRosterLabel: 'Field Pro Roster',
    scanLabel: 'Verify Job OTP',
    customerDirLabel: 'Client Address Book',
    managementLabel: 'Field Operations & Dispatch',
    settingsLabel: 'Service Provider Settings',
    themeClass: 'theme-service',
    staffOnboardTitle: 'Onboard Field Technician',
    staffOnboardDesc: 'Onboard electricians, plumbers, home cleaners, and caretakers.',
    activeStaffLabel: 'Active Field Technicians',
    newShiftLabel: 'New Service Package',
    servicesDesc: 'Manage home repair, cleaning, installation, and care services with doorstep SLAs.',
    servicesEmptyTitle: 'No Services Available',
    servicesEmptyDesc: 'Define doorstep consultation fees and hourly labor charges.',
    staffEmptyTitle: 'No Field Pros Found',
    staffEmptyDesc: 'Onboard certified technicians and service specialists.',
    priceLabel: 'Visit Charge',
    createServiceLabel: 'Create Service Package',
    editServiceLabel: 'Edit Package',
    assignStaffLabel: 'Assign Technician',
    deployServiceLabel: 'Publish Service Offering',
  }
};

export const getArchetypeConfig = (archetypeOrCategory?: string): ArchetypeConfig => {
  if (!archetypeOrCategory) return businessDictionary['Service'];

  // Direct match
  if (businessDictionary[archetypeOrCategory]) return businessDictionary[archetypeOrCategory];

  const lower = archetypeOrCategory.toLowerCase().trim();

  // Hostel specific check
  if (lower.includes('hostel') || lower.includes('pg') || lower.includes('dorm') || lower.includes('bunk')) {
    return businessDictionary['Hostel'];
  }

  // Camping specific check
  if (lower.includes('camp') || lower.includes('tent') || lower.includes('glamp')) {
    return businessDictionary['Camping'];
  }
  
  // Normalized Excel archetype aliases
  const aliasMap: Record<string, string> = {
    'OvernightStay': 'Accommodation',
    'TimeSlot': 'Service',
    'Rental': 'FacilityHourly',
    'RENTAL': 'FacilityHourly',
    'FACILITY_HOURLY': 'FacilityHourly',
    'ASSET_RENTAL': 'AssetRental',
    'Fitness': 'ResourceBooking',
    'Dining': 'FacilityHourly',
    'PersonalCare': 'Beauty',
    'SportsFacility': 'FacilityHourly',
    'Sports': 'FacilityHourly',
    'CareServices': 'HomeCall',
    'Trade': 'HomeCall',
    'Workspace': 'PassEntry',
    'Events': 'PassEntry',
    'Rentals': 'AssetRental',
    'EventSpace': 'FacilityHourly',
    'hostel-booking': 'Hostel',
    'hostel': 'Hostel',
    'camping-booking': 'Camping',
    'camping': 'Camping'
  };

  const resolved = aliasMap[archetypeOrCategory];
  if (resolved && businessDictionary[resolved]) {
    return businessDictionary[resolved];
  }

  // Fuzzy check for other categories
  if (lower.includes('hotel') || lower.includes('resort') || lower.includes('villa') || lower.includes('homestay') || lower.includes('stay') || lower.includes('accommodation')) {
    return businessDictionary['Accommodation'];
  }
  if (lower.includes('turf') || lower.includes('ground') || lower.includes('football') || lower.includes('cricket') || lower.includes('sport') || lower.includes('court') || lower.includes('pitch') || lower.includes('arena')) {
    return businessDictionary['FacilityHourly'];
  }
  if (lower.includes('doctor') || lower.includes('clinic') || lower.includes('health')) {
    return businessDictionary['Healthcare'];
  }
  if (lower.includes('salon') || lower.includes('spa') || lower.includes('beauty')) {
    return businessDictionary['Beauty'];
  }
  if (lower.includes('bike') || lower.includes('car-rent') || lower.includes('equipment-rent') || lower.includes('gear')) {
    return businessDictionary['AssetRental'];
  }
  if (lower.includes('clean') || lower.includes('electric') || lower.includes('plumb') || lower.includes('repair')) {
    return businessDictionary['HomeCall'];
  }

  return businessDictionary['Service']; // fallback
};
