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
    staffEmptyDesc: 'Onboard your reception and housekeeping staff.',
    priceLabel: 'Tariff/Night',
    createServiceLabel: 'Create Room',
    editServiceLabel: 'Edit Room',
    assignStaffLabel: 'Assign Manager',
    deployServiceLabel: 'Add Room',
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

export const getArchetypeConfig = (archetype: string): ArchetypeConfig => {
  // Direct match
  if (businessDictionary[archetype]) return businessDictionary[archetype];
  
  // Normalized Excel archetype aliases
  const aliasMap: Record<string, string> = {
    'OvernightStay': 'Accommodation',
    'TimeSlot': 'Service',
    'Rental': 'AssetRental',
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
    'EventSpace': 'FacilityHourly'
  };

  const resolved = aliasMap[archetype];
  if (resolved && businessDictionary[resolved]) {
    return businessDictionary[resolved];
  }

  return businessDictionary['Service']; // fallback
};
