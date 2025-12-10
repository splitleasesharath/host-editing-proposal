// Days of the week
export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

// Night options
export type Night =
  | 'Sunday Night'
  | 'Monday Night'
  | 'Tuesday Night'
  | 'Wednesday Night'
  | 'Thursday Night'
  | 'Friday Night'
  | 'Saturday Night';

// Reservation span options
export interface ReservationSpan {
  value: string;
  label: string;
  weeks: number;
  months: number;
  days: number;
}

export const RESERVATION_SPANS: ReservationSpan[] = [
  { value: '6-weeks', label: '6 weeks', weeks: 6, months: 1.5, days: 42 },
  { value: '7-weeks', label: '7 weeks', weeks: 7, months: 1.75, days: 49 },
  { value: '8-weeks', label: '8 weeks', weeks: 8, months: 2, days: 56 },
  { value: '9-weeks', label: '9 weeks (~2 months)', weeks: 9, months: 2, days: 63 },
  { value: '10-weeks', label: '10 weeks', weeks: 10, months: 2.5, days: 70 },
  { value: '12-weeks', label: '12 weeks', weeks: 12, months: 3, days: 84 },
  { value: '13-weeks', label: '13 weeks (3 months)', weeks: 13, months: 3, days: 91 },
  { value: '16-weeks', label: '16 weeks', weeks: 16, months: 4, days: 112 },
  { value: '17-weeks', label: '17 weeks (~4 months)', weeks: 17, months: 4, days: 119 },
  { value: 'other', label: 'Other', weeks: 0, months: 0, days: 0 },
];

// House rules
export interface HouseRule {
  id: string;
  name: string;
  description?: string;
}

// Proposal status
export type ProposalStatus =
  | 'proposal_submitted_for_review'
  | 'proposal_submitted_by_guest'
  | 'host_review'
  | 'host_counteroffer_submitted'
  | 'proposal_accepted'
  | 'lease_documents_sent_to_guest'
  | 'lease_documents_sent_to_host'
  | 'lease_documents_signed'
  | 'initial_payment_submitted'
  | 'proposal_cancelled_by_guest'
  | 'proposal_rejected_by_host'
  | 'proposal_cancelled_by_system'
  | 'guest_ignored_suggestion';

export interface ProposalStatusInfo {
  status: ProposalStatus;
  displayText: string;
  usualOrder: number;
}

export const PROPOSAL_STATUSES: Record<ProposalStatus, ProposalStatusInfo> = {
  'proposal_submitted_for_review': { status: 'proposal_submitted_for_review', displayText: 'Proposal Submitted for Review', usualOrder: 0 },
  'proposal_submitted_by_guest': { status: 'proposal_submitted_by_guest', displayText: 'Proposal Submitted by Guest', usualOrder: 1 },
  'host_review': { status: 'host_review', displayText: 'Host Review', usualOrder: 2 },
  'host_counteroffer_submitted': { status: 'host_counteroffer_submitted', displayText: 'Host Counteroffer Submitted', usualOrder: 3 },
  'proposal_accepted': { status: 'proposal_accepted', displayText: 'Proposal or Counteroffer Accepted', usualOrder: 4 },
  'lease_documents_sent_to_guest': { status: 'lease_documents_sent_to_guest', displayText: 'Lease Documents Sent to Guest', usualOrder: 5 },
  'lease_documents_sent_to_host': { status: 'lease_documents_sent_to_host', displayText: 'Lease Documents Sent to Host', usualOrder: 6 },
  'lease_documents_signed': { status: 'lease_documents_signed', displayText: 'Lease Documents Signed', usualOrder: 7 },
  'initial_payment_submitted': { status: 'initial_payment_submitted', displayText: 'Initial Payment Submitted', usualOrder: 8 },
  'proposal_cancelled_by_guest': { status: 'proposal_cancelled_by_guest', displayText: 'Proposal Cancelled by Guest', usualOrder: 9 },
  'proposal_rejected_by_host': { status: 'proposal_rejected_by_host', displayText: 'Proposal Rejected by Host', usualOrder: 10 },
  'proposal_cancelled_by_system': { status: 'proposal_cancelled_by_system', displayText: 'Proposal Cancelled by System', usualOrder: 11 },
  'guest_ignored_suggestion': { status: 'guest_ignored_suggestion', displayText: 'Guest Ignored Suggestion', usualOrder: 12 },
};

// Weekly selection
export type WeeklySelection = 'full-week' | 'partial-week' | 'custom';

// Rental type
export type RentalType = 'nightly' | 'weekly' | 'monthly';

// Listing interface
export interface Listing {
  id: string;
  title: string;
  rentalType: RentalType;
  nightsAvailable?: Night[];
  daysAvailable?: DayOfWeek[];
}

// User interface
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Host Account
export interface HostAccount {
  id: string;
  user: User;
}

// Main Proposal interface
export interface Proposal {
  id: string;

  // Scheduling fields
  checkInDay: DayOfWeek;
  checkOutDay: DayOfWeek;
  moveInRangeStart: Date;
  moveInRangeEnd: Date;
  moveOut: Date;
  startDate: Date;
  endDate: Date;
  daysSelected: DayOfWeek[];
  daysAvailable: DayOfWeek[];
  nightsSelected: Night[];
  complementaryDays: DayOfWeek[];
  complementaryNights: Night[];

  // Duration fields
  reservationSpan: ReservationSpan;
  reservationSpanWeeks: number;
  durationInMonths: number;
  actualWeeksDuringRes: number;
  nightsPerWeek: number;

  // Pricing fields
  proposalNightlyPrice: number;
  fourWeekCompensation: number;
  fourWeekRent: number;
  hostCompensation: number;
  totalCompensation: number;
  totalPriceForReservation: number;
  damageDeposit: number;
  cleaningFee: number;

  // Host counteroffer fields (hc prefix)
  hcFourWeekCompensation?: number;
  hcFourWeekRent?: number;
  hcCheckInDay?: DayOfWeek;
  hcCheckOutDay?: DayOfWeek;
  hcCleaningFee?: number;
  hcDamageDeposit?: number;
  hcDaysSelected?: DayOfWeek[];
  hcDurationInMonths?: number;
  hcHostCompensation?: number;
  hcHouseRules?: HouseRule[];
  hcMoveInDate?: Date;
  hcNightlyPrice?: number;
  hcNightsPerWeek?: number;
  hcNightsSelected?: Night[];
  hcReservationSpan?: ReservationSpan;
  hcReservationSpanWeeks?: number;
  hcTotalHostCompensation?: number;
  hcTotalPrice?: number;
  hcWeeksSchedule?: WeeklySelection;

  // House rules
  houseRules: HouseRule[];

  // Status & tracking
  status: ProposalStatus;
  counterOfferHappened: boolean;
  isFinalized: boolean;
  history: string[];

  // Relationships
  listing: Listing;
  guest: User;
  hostAccount: HostAccount;
  originProposal?: Proposal;
}

// Component state
export interface HostEditingProposalState {
  acceptAsIs: boolean;
  approxMoveOut: Date | null;
  isInternalUsage: boolean;
  mainProposal: Proposal | null;
  openingForTheFirstTime: boolean;
  view: 'general' | 'editing';
  yesProceedButtonLocked: boolean;
}

// Counteroffer parameters
export interface CounterofferParams {
  proposal: Proposal;
  numberOfWeeks: number;
  reservationSpan: ReservationSpan;
  checkIn: DayOfWeek;
  checkOut: DayOfWeek;
  nightsSelected: Night[];
  daysSelected: DayOfWeek[];
  newHouseRules: HouseRule[];
  moveInDate: Date;
}

// Reservation breakdown display data
export interface ReservationBreakdownData {
  moveInDate: Date;
  checkInDay: DayOfWeek;
  checkOutDay: DayOfWeek;
  reservationLength: string;
  houseRules: HouseRule[];
  weeklyPattern: WeeklySelection;
  actualWeeksUsed: number;
  compensationPerNight: number;
  pricePerNight: number;
  nightsReserved: number;
  totalCompensation: number;
  totalPrice: number;
  compensationPer4Weeks: number;
  pricePer4Weeks: number;
  refundableDamageDeposit: number;
  maintenanceFee: number;
}

// Alert types
export type AlertType = 'success' | 'error' | 'warning' | 'information';

export interface AlertMessage {
  type: AlertType;
  title: string;
  content?: string;
  duration?: number;
}
