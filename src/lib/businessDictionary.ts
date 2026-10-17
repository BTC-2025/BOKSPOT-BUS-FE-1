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
  }
};

export const getArchetypeConfig = (archetype: string): ArchetypeConfig => {
  return businessDictionary[archetype] || businessDictionary['Service']; // fallback
};
