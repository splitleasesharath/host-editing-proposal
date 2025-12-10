import { useState } from 'react';
import { HostEditingProposal } from './components';
import type { Proposal, HouseRule, AlertMessage, CounterofferParams } from './types';
import { RESERVATION_SPANS } from './types';
import './styles/host-editing-proposal.css';

// Sample house rules
const SAMPLE_HOUSE_RULES: HouseRule[] = [
  { id: '1', name: 'No smoking', description: 'No smoking inside the property' },
  { id: '2', name: 'No pets', description: 'No pets allowed' },
  { id: '3', name: 'No parties', description: 'No parties or events' },
  { id: '4', name: 'Quiet hours', description: 'Quiet hours 10pm - 8am' },
  { id: '5', name: 'No guests', description: 'No overnight guests' },
  { id: '6', name: 'Kitchen cleanup', description: 'Clean kitchen after use' },
  { id: '7', name: 'Shoes off', description: 'Remove shoes indoors' },
];

// Sample proposal data
const SAMPLE_PROPOSAL: Proposal = {
  id: 'prop-001',

  // Scheduling
  checkInDay: 'Monday',
  checkOutDay: 'Friday',
  moveInRangeStart: new Date('2025-01-15'),
  moveInRangeEnd: new Date('2025-01-22'),
  moveOut: new Date('2025-03-15'),
  startDate: new Date('2025-01-15'),
  endDate: new Date('2025-03-15'),
  daysSelected: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
  daysAvailable: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  nightsSelected: ['Monday Night', 'Tuesday Night', 'Wednesday Night', 'Thursday Night'],
  complementaryDays: [],
  complementaryNights: [],

  // Duration
  reservationSpan: RESERVATION_SPANS[2], // 8 weeks
  reservationSpanWeeks: 8,
  durationInMonths: 2,
  actualWeeksDuringRes: 8,
  nightsPerWeek: 4,

  // Pricing
  proposalNightlyPrice: 85,
  fourWeekCompensation: 960,
  fourWeekRent: 1120,
  hostCompensation: 72.25,
  totalCompensation: 2312,
  totalPriceForReservation: 2720,
  damageDeposit: 300,
  cleaningFee: 75,

  // House rules
  houseRules: [
    { id: '1', name: 'No smoking' },
    { id: '3', name: 'No parties' },
  ],

  // Status
  status: 'host_review',
  counterOfferHappened: false,
  isFinalized: false,
  history: ['Proposal submitted by guest'],

  // Relationships
  listing: {
    id: 'listing-001',
    title: 'Cozy Downtown Studio',
    rentalType: 'nightly',
    nightsAvailable: [
      'Sunday Night',
      'Monday Night',
      'Tuesday Night',
      'Wednesday Night',
      'Thursday Night',
      'Friday Night',
      'Saturday Night',
    ],
    daysAvailable: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  guest: {
    id: 'user-guest-001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
  },
  hostAccount: {
    id: 'host-001',
    user: {
      id: 'user-host-001',
      firstName: 'Michael',
      lastName: 'Smith',
      email: 'michael.smith@email.com',
    },
  },
};

function App() {
  const [proposal] = useState<Proposal>(SAMPLE_PROPOSAL);
  const [toast, setToast] = useState<AlertMessage | null>(null);

  const handleAcceptAsIs = async (acceptedProposal: Proposal) => {
    console.log('Accepted proposal as-is:', acceptedProposal);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleCounteroffer = async (params: CounterofferParams) => {
    console.log('Counteroffer submitted:', params);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleReject = async (rejectedProposal: Proposal, reason: string) => {
    console.log('Rejected proposal:', rejectedProposal, 'Reason:', reason);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleCancel = () => {
    console.log('Cancelled editing');
  };

  const handleAlert = (alert: AlertMessage) => {
    setToast(alert);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        fontFamily: "'Lato', sans-serif",
      }}
    >
      {/* Toast notification */}
      {toast && (
        <div className={`hep-toast hep-toast-${toast.type}`}>
          <div className="hep-toast-title">{toast.title}</div>
          {toast.content && <div className="hep-toast-content">{toast.content}</div>}
        </div>
      )}

      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          padding: '24px',
        }}
      >
        <HostEditingProposal
          proposal={proposal}
          availableHouseRules={SAMPLE_HOUSE_RULES}
          isInternalUsage={false}
          onAcceptAsIs={handleAcceptAsIs}
          onCounteroffer={handleCounteroffer}
          onReject={handleReject}
          onCancel={handleCancel}
          onAlert={handleAlert}
        />
      </div>

      {/* Demo info */}
      <div
        style={{
          maxWidth: '800px',
          margin: '20px auto',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '10px',
          fontSize: '14px',
          color: '#666',
        }}
      >
        <h3 style={{ margin: '0 0 12px 0', color: '#31135D' }}>Demo Info</h3>
        <p style={{ margin: '0 0 8px 0' }}>
          This is a demo of the <strong>Host Editing Proposal</strong> component.
        </p>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          <li>Click "Edit Proposal Terms" to expand the editing form</li>
          <li>Modify dates, schedule, reservation span, or house rules</li>
          <li>Click "show preview" to see the updated breakdown</li>
          <li>Click "Update Proposal" to submit changes</li>
          <li>Click "Reject Proposal" to reject the proposal</li>
        </ul>
        <p style={{ margin: '12px 0 0 0' }}>
          Check the browser console for logged actions.
        </p>
      </div>
    </div>
  );
}

export default App;
