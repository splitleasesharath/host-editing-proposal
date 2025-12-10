import { useState, useEffect, useCallback } from 'react';
import { format, addWeeks } from 'date-fns';
import { Edit2, X, ChevronDown, Trash2 } from 'lucide-react';
import type {
  Proposal,
  DayOfWeek,
  Night,
  HouseRule,
  ReservationSpan,
  AlertMessage,
  CounterofferParams,
} from '../types';
import { PROPOSAL_STATUSES, RESERVATION_SPANS } from '../types';
import { ReservationPriceBreakdown } from './ReservationPriceBreakdown';
import { ScheduleSelector } from './ScheduleSelector';
import {
  DateInput,
  ReservationSpanDropdown,
  NumberInput,
  HouseRulesMultiSelect,
} from './FormInputs';
import '../styles/host-editing-proposal.css';

export interface HostEditingProposalProps {
  proposal: Proposal;
  availableHouseRules: HouseRule[];
  isInternalUsage?: boolean;
  onAcceptAsIs?: (proposal: Proposal) => Promise<void>;
  onCounteroffer?: (params: CounterofferParams) => Promise<void>;
  onReject?: (proposal: Proposal, reason: string) => Promise<void>;
  onCancel?: () => void;
  onAlert?: (alert: AlertMessage) => void;
}

type ViewMode = 'general' | 'editing';

export function HostEditingProposal({
  proposal,
  availableHouseRules,
  isInternalUsage = false,
  onAcceptAsIs,
  onCounteroffer,
  onReject,
  onCancel,
  onAlert,
}: HostEditingProposalProps) {
  // State management
  const [view, setView] = useState<ViewMode>('general');
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [proceedButtonLocked, setProceedButtonLocked] = useState(false);

  // Form state - holds edited values
  const [editedMoveInDate, setEditedMoveInDate] = useState<Date>(
    proposal.moveInRangeStart
  );
  const [editedReservationSpan, setEditedReservationSpan] =
    useState<ReservationSpan>(proposal.reservationSpan);
  const [editedWeeks, setEditedWeeks] = useState<number>(
    proposal.reservationSpanWeeks
  );
  const [editedCheckInDay, setEditedCheckInDay] = useState<DayOfWeek>(
    proposal.checkInDay
  );
  const [editedCheckOutDay, setEditedCheckOutDay] = useState<DayOfWeek>(
    proposal.checkOutDay
  );
  const [editedNightsSelected, setEditedNightsSelected] = useState<Night[]>(
    proposal.nightsSelected
  );
  const [editedDaysSelected, setEditedDaysSelected] = useState<DayOfWeek[]>(
    proposal.daysSelected
  );
  const [editedHouseRules, setEditedHouseRules] = useState<HouseRule[]>(
    proposal.houseRules
  );

  // Popup states
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showRejectSection, setShowRejectSection] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Collapsible state
  const [isEditSectionExpanded, setIsEditSectionExpanded] = useState(false);

  // Initialize values based on proposal status
  useEffect(() => {
    if (isFirstOpen && proposal) {
      const statusInfo = PROPOSAL_STATUSES[proposal.status];
      const useCounterOfferValues = statusInfo.usualOrder >= 3;

      if (useCounterOfferValues && proposal.hcMoveInDate) {
        setEditedMoveInDate(proposal.hcMoveInDate);
        setEditedReservationSpan(
          proposal.hcReservationSpan || proposal.reservationSpan
        );
        setEditedWeeks(
          proposal.hcReservationSpanWeeks || proposal.reservationSpanWeeks
        );
        setEditedCheckInDay(proposal.hcCheckInDay || proposal.checkInDay);
        setEditedCheckOutDay(proposal.hcCheckOutDay || proposal.checkOutDay);
        setEditedNightsSelected(
          proposal.hcNightsSelected || proposal.nightsSelected
        );
        setEditedDaysSelected(proposal.hcDaysSelected || proposal.daysSelected);
        setEditedHouseRules(proposal.hcHouseRules || proposal.houseRules);
      } else {
        setEditedMoveInDate(proposal.moveInRangeStart);
        setEditedReservationSpan(proposal.reservationSpan);
        setEditedWeeks(proposal.reservationSpanWeeks);
        setEditedCheckInDay(proposal.checkInDay);
        setEditedCheckOutDay(proposal.checkOutDay);
        setEditedNightsSelected(proposal.nightsSelected);
        setEditedDaysSelected(proposal.daysSelected);
        setEditedHouseRules(proposal.houseRules);
      }

      setIsFirstOpen(false);
    }
  }, [proposal, isFirstOpen]);

  // Check if any values have changed
  const hasChanges = useCallback((): boolean => {
    const dateChanged =
      format(proposal.moveInRangeStart, 'MM/dd/yy') !==
      format(editedMoveInDate, 'MM/dd/yy');

    const spanChanged =
      proposal.reservationSpanWeeks !== editedWeeks ||
      proposal.reservationSpan.value !== editedReservationSpan.value;

    const scheduleChanged =
      proposal.checkInDay !== editedCheckInDay ||
      proposal.checkOutDay !== editedCheckOutDay;

    // Compare house rules
    const originalRuleIds = new Set(proposal.houseRules.map((r) => r.id));
    const editedRuleIds = new Set(editedHouseRules.map((r) => r.id));
    const rulesChanged =
      originalRuleIds.size !== editedRuleIds.size ||
      [...originalRuleIds].some((id) => !editedRuleIds.has(id));

    return dateChanged || spanChanged || scheduleChanged || rulesChanged;
  }, [
    proposal,
    editedMoveInDate,
    editedWeeks,
    editedReservationSpan,
    editedCheckInDay,
    editedCheckOutDay,
    editedHouseRules,
  ]);

  // Calculate approximate move-out date
  const approxMoveOut = addWeeks(editedMoveInDate, editedWeeks);

  // Calculate pricing (simplified - in production this would be more complex)
  const nightsPerWeek = editedNightsSelected.length;
  const totalNights = nightsPerWeek * editedWeeks;
  const nightlyPrice = proposal.proposalNightlyPrice;
  const nightlyCompensation = nightlyPrice * 0.85; // Example: 85% goes to host
  const totalPrice = nightlyPrice * totalNights;
  const totalCompensation = nightlyCompensation * totalNights;
  const pricePer4Weeks = (totalPrice / editedWeeks) * 4;
  const compensationPer4Weeks = (totalCompensation / editedWeeks) * 4;

  // Handlers
  const handleToggleView = () => {
    setView(view === 'general' ? 'editing' : 'general');
  };

  const handleToggleEditSection = () => {
    const willExpand = !isEditSectionExpanded;
    setIsEditSectionExpanded(willExpand);
    // Show editing view when expanding, general view (breakdown) when collapsing
    setView(willExpand ? 'editing' : 'general');
  };

  const handleScheduleChange = (data: {
    checkInDay: DayOfWeek;
    checkOutDay: DayOfWeek;
    nightsSelected: Night[];
    daysSelected: DayOfWeek[];
  }) => {
    setEditedCheckInDay(data.checkInDay);
    setEditedCheckOutDay(data.checkOutDay);
    setEditedNightsSelected(data.nightsSelected);
    setEditedDaysSelected(data.daysSelected);
  };

  // Update Proposal button takes user to preview (breakdown) view
  const handleUpdateProposal = () => {
    setView('general');
    setIsEditSectionExpanded(false);
  };

  // From preview, user can confirm to show the final popup
  const handleConfirmFromPreview = () => {
    setShowConfirmPopup(true);
  };

  const handleConfirmProceed = async () => {
    if (proceedButtonLocked) return;
    setProceedButtonLocked(true);

    try {
      if (!hasChanges()) {
        // Accept as-is
        if (onAcceptAsIs) {
          await onAcceptAsIs(proposal);
        }
        onAlert?.({
          type: 'information',
          title: 'Proposal Accepted!',
          content: 'The proposal has been accepted as-is.',
        });
      } else {
        // Counteroffer
        if (onCounteroffer) {
          await onCounteroffer({
            proposal,
            numberOfWeeks: editedWeeks,
            reservationSpan: editedReservationSpan,
            checkIn: editedCheckInDay,
            checkOut: editedCheckOutDay,
            nightsSelected: editedNightsSelected,
            daysSelected: editedDaysSelected,
            newHouseRules: editedHouseRules,
            moveInDate: editedMoveInDate,
          });
        }
        onAlert?.({
          type: 'information',
          title: 'Modifications submitted!',
          content: 'Awaiting Guest Review.',
        });
      }

      setShowConfirmPopup(false);
      setView('general');
    } catch (error) {
      onAlert?.({
        type: 'error',
        title: 'Error',
        content: 'Failed to process your request. Please try again.',
      });
    } finally {
      setProceedButtonLocked(false);
    }
  };

  const handleReject = async () => {
    if (onReject) {
      try {
        await onReject(proposal, rejectReason);
        onAlert?.({
          type: 'information',
          title: 'Proposal Rejected',
          content: 'The proposal has been rejected.',
        });
        setShowRejectSection(false);
      } catch (error) {
        onAlert?.({
          type: 'error',
          title: 'Error',
          content: 'Failed to reject proposal. Please try again.',
        });
      }
    }
  };

  const handleCancel = () => {
    setView('general');
    setIsFirstOpen(true);
    onCancel?.();
  };

  return (
    <div className="hep-container">
      {/* Header */}
      <div className="hep-section-header">
        <h2 className="hep-title-main">Review Proposal Terms</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="hep-icon hep-icon-edit"
            onClick={handleToggleView}
            title="Edit proposal"
          >
            <Edit2 size={20} />
          </button>
          <button
            type="button"
            className="hep-icon hep-icon-close"
            onClick={handleCancel}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Guest Info */}
      <div className="hep-description hep-mb-16">
        Reviewing proposal from{' '}
        <strong>
          {proposal.guest.firstName} {proposal.guest.lastName}
        </strong>{' '}
        for <strong>{proposal.listing.title}</strong>
      </div>

      {/* Collapsible Edit Section */}
      <div
        className="hep-collapsible"
        onClick={handleToggleEditSection}
        style={{ marginBottom: '16px' }}
      >
        <span className="hep-collapsible-title">Edit Proposal Terms</span>
        <ChevronDown
          size={24}
          className={`hep-collapsible-icon ${
            isEditSectionExpanded ? 'expanded' : ''
          }`}
        />
      </div>

      {/* Editing Form */}
      <div
        className={`hep-animate-collapse ${
          isEditSectionExpanded && view === 'editing' ? 'expanded' : 'collapsed'
        }`}
      >
        <div className="hep-editing-terms">
          <h3 className="hep-title-section hep-mb-16">Proposal Details</h3>

          {/* Schedule Selector - Host selects nights, check-in/out derived */}
          <div className="hep-form-group">
            <label className="hep-label">Schedule Selection</label>
            <ScheduleSelector
              initialNightsSelected={editedNightsSelected}
              availableNights={proposal.listing.nightsAvailable}
              onChange={handleScheduleChange}
              disabled={
                isInternalUsage || proposal.listing.rentalType !== 'nightly'
              }
            />
          </div>

          {/* Move-in Date */}
          <div className="hep-form-group">
            <label className="hep-label">Your convenient move-in date</label>
            <DateInput
              value={editedMoveInDate}
              onChange={setEditedMoveInDate}
              placeholder="Move-in"
              minDate={new Date()}
            />
            <div className="hep-text-value" style={{ marginTop: '8px' }}>
              Move-in suggestion:{' '}
              {format(proposal.moveInRangeStart, 'EEEE, MMM d, yyyy')}
            </div>
          </div>

          {/* Reservation Span */}
          <div className="hep-form-row">
            <div className="hep-form-group">
              <label className="hep-label">Reservation Span</label>
              <ReservationSpanDropdown
                value={editedReservationSpan}
                onChange={(span) => {
                  setEditedReservationSpan(span);
                  // Only update weeks if not "Other" (span has predefined weeks)
                  if (span.value !== 'other') {
                    setEditedWeeks(span.weeks);
                  }
                }}
                options={RESERVATION_SPANS}
                placeholder="Select reservation span"
              />
            </div>
            {/* Only show # of weeks input when "Other" is selected */}
            {editedReservationSpan.value === 'other' && (
              <div className="hep-form-group">
                <label className="hep-label"># of weeks</label>
                <NumberInput
                  value={editedWeeks}
                  onChange={setEditedWeeks}
                  placeholder="Enter # Weeks"
                  min={1}
                  max={52}
                />
              </div>
            )}
          </div>

          {/* House Rules */}
          <div className="hep-form-group">
            <label className="hep-label">House Rules</label>
            <HouseRulesMultiSelect
              value={editedHouseRules}
              onChange={setEditedHouseRules}
              options={availableHouseRules}
              placeholder="Choose some options..."
            />
          </div>

          {/* Approximate Move-out */}
          <div className="hep-proposal-row" style={{ marginTop: '16px' }}>
            <span className="hep-row-label">Approximate Move-out</span>
            <span className="hep-text-value">
              {format(approxMoveOut, 'EEEE, MMM d, yyyy')}
            </span>
          </div>

          {/* Actions */}
          <div className="hep-actions-row">
            <button
              type="button"
              className="hep-btn hep-btn-cancel"
              onClick={handleCancel}
            >
              Cancel edits
            </button>
            <button
              type="button"
              className="hep-btn hep-btn-primary"
              onClick={handleUpdateProposal}
            >
              Update Proposal
            </button>
          </div>
        </div>
      </div>

      {/* Reservation Price Breakdown - shown in general view or as preview */}
      {view === 'general' && (
        <>
          <ReservationPriceBreakdown
            moveInDate={editedMoveInDate}
            checkInDay={editedCheckInDay}
            checkOutDay={editedCheckOutDay}
            reservationSpan={editedReservationSpan}
            weeksReservationSpan={editedWeeks}
            houseRules={editedHouseRules}
            nightsSelected={editedNightsSelected}
            nightlyCompensation={nightlyCompensation}
            nightlyPrice={nightlyPrice}
            totalCompensation={totalCompensation}
            totalPrice={totalPrice}
            hostCompensationPer4Weeks={compensationPer4Weeks}
            pricePer4Weeks={pricePer4Weeks}
            damageDeposit={proposal.damageDeposit}
            cleaningFee={proposal.cleaningFee}
            isVisible={true}
            originalValues={{
              moveInDate: proposal.moveInRangeStart,
              checkInDay: proposal.checkInDay,
              checkOutDay: proposal.checkOutDay,
              reservationSpan: proposal.reservationSpan,
              weeksReservationSpan: proposal.reservationSpanWeeks,
              houseRules: proposal.houseRules,
              nightsSelected: proposal.nightsSelected,
            }}
          />

          {/* Confirm button after preview */}
          <div className="hep-actions-row">
            <button
              type="button"
              className="hep-btn hep-btn-primary"
              onClick={handleConfirmFromPreview}
              disabled={proceedButtonLocked}
            >
              {hasChanges() ? 'Submit Counteroffer' : 'Accept As-Is'}
            </button>
          </div>
        </>
      )}

      {/* Reject Proposal Section */}
      {showRejectSection && (
        <div className="hep-reject-section">
          <div className="hep-reject-header">
            <Trash2 size={20} className="hep-icon-reject" />
            <span className="hep-reject-title">Reject Proposal</span>
          </div>
          <p className="hep-reject-warning">This action cannot be undone</p>
          <p className="hep-reject-confirmation">
            Are you sure you want to reject this proposal from{' '}
            <strong>
              {proposal.guest.firstName} {proposal.guest.lastName}
            </strong>
            ?
          </p>
          <div className="hep-form-group">
            <textarea
              className="hep-input-base"
              placeholder="Reason for rejection (optional)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
          <div className="hep-reject-actions">
            <button
              type="button"
              className="hep-btn hep-btn-cancel"
              onClick={() => setShowRejectSection(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="hep-btn hep-btn-destructive"
              onClick={handleReject}
            >
              Yes, Reject
            </button>
          </div>
        </div>
      )}

      {/* Reject Button (outside of reject section) */}
      {!showRejectSection && (
        <div className="hep-actions-row">
          <button
            type="button"
            className="hep-btn hep-btn-cancel"
            style={{ color: 'var(--hep-reject-red)', borderColor: 'var(--hep-reject-red)' }}
            onClick={() => setShowRejectSection(true)}
          >
            Reject Proposal
          </button>
        </div>
      )}

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="hep-popup-overlay">
          <div className="hep-popup">
            <h3 className="hep-popup-title">
              {hasChanges() ? 'Confirm Counteroffer' : 'Accept Proposal'}
            </h3>
            <p className="hep-popup-content">
              {hasChanges()
                ? 'You have made changes to the proposal terms. This will send a counteroffer to the guest for their review.'
                : 'You are accepting the proposal as-is without any modifications.'}
            </p>
            <div className="hep-popup-actions">
              <button
                type="button"
                className="hep-btn hep-btn-cancel"
                onClick={() => setShowConfirmPopup(false)}
              >
                No, Go Back
              </button>
              <button
                type="button"
                className="hep-btn hep-btn-primary"
                onClick={handleConfirmProceed}
                disabled={proceedButtonLocked}
                style={{ minWidth: 'auto', maxWidth: 'none' }}
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
