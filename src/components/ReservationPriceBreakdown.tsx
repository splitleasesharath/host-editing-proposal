import { format } from 'date-fns';
import type {
  DayOfWeek,
  HouseRule,
  ReservationSpan,
  Night,
} from '../types';

// Original values for comparison (to highlight changes)
export interface OriginalValues {
  moveInDate?: Date;
  checkInDay?: DayOfWeek;
  checkOutDay?: DayOfWeek;
  reservationSpan?: ReservationSpan;
  weeksReservationSpan?: number;
  houseRules?: HouseRule[];
  nightsSelected?: Night[];
}

export interface ReservationBreakdownProps {
  moveInDate: Date;
  checkInDay: DayOfWeek;
  checkOutDay: DayOfWeek;
  reservationSpan: ReservationSpan;
  weeksReservationSpan: number;
  houseRules: HouseRule[];
  nightsSelected: Night[];
  nightlyCompensation: number;
  nightlyPrice: number;
  totalCompensation: number;
  totalPrice: number;
  hostCompensationPer4Weeks: number;
  pricePer4Weeks: number;
  damageDeposit: number;
  cleaningFee: number;
  isVisible?: boolean;
  // Original values to compare against for highlighting changes
  originalValues?: OriginalValues;
}

export function ReservationPriceBreakdown({
  moveInDate,
  checkInDay,
  checkOutDay,
  reservationSpan,
  weeksReservationSpan,
  houseRules,
  nightsSelected,
  nightlyCompensation,
  nightlyPrice,
  totalCompensation,
  totalPrice,
  hostCompensationPer4Weeks,
  pricePer4Weeks,
  damageDeposit,
  cleaningFee,
  isVisible = true,
  originalValues,
}: ReservationBreakdownProps) {
  if (!isVisible) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const nightsCount = nightsSelected.length * weeksReservationSpan;

  // Helper to check if a value changed
  const hasChanged = {
    moveInDate: originalValues?.moveInDate
      ? format(originalValues.moveInDate, 'yyyy-MM-dd') !== format(moveInDate, 'yyyy-MM-dd')
      : false,
    checkInDay: originalValues?.checkInDay
      ? originalValues.checkInDay !== checkInDay
      : false,
    checkOutDay: originalValues?.checkOutDay
      ? originalValues.checkOutDay !== checkOutDay
      : false,
    reservationSpan: originalValues?.reservationSpan
      ? originalValues.reservationSpan.value !== reservationSpan.value
      : false,
    weeksReservationSpan: originalValues?.weeksReservationSpan
      ? originalValues.weeksReservationSpan !== weeksReservationSpan
      : false,
    houseRules: originalValues?.houseRules
      ? (() => {
          const origIds = new Set(originalValues.houseRules.map((r) => r.id));
          const newIds = new Set(houseRules.map((r) => r.id));
          return (
            origIds.size !== newIds.size ||
            [...origIds].some((id) => !newIds.has(id))
          );
        })()
      : false,
    nightsSelected: originalValues?.nightsSelected
      ? (() => {
          const origNights = new Set(originalValues.nightsSelected);
          const newNights = new Set(nightsSelected);
          return (
            origNights.size !== newNights.size ||
            [...origNights].some((n) => !newNights.has(n))
          );
        })()
      : false,
  };

  // Check if any schedule-related field changed (affects pricing)
  const schedulingChanged =
    hasChanged.nightsSelected || hasChanged.weeksReservationSpan;

  // Helper to get row class with change highlight
  const getRowClass = (changed: boolean) => {
    return `hep-breakdown-row${changed ? ' hep-breakdown-row-changed' : ''}`;
  };

  return (
    <div className="hep-breakdown-container">
      <h3 className="hep-breakdown-title">Proposal Details</h3>

      {/* Show change indicator if any changes exist */}
      {originalValues && Object.values(hasChanged).some(Boolean) && (
        <div className="hep-changes-indicator">
          <span className="hep-changes-badge">Modified</span>
          <span className="hep-changes-text">Changed items are highlighted</span>
        </div>
      )}

      <div className={getRowClass(hasChanged.moveInDate)}>
        <span className="hep-breakdown-row-label">Move-in</span>
        <span className="hep-breakdown-row-value">
          {format(moveInDate, 'EEEE, MMM d, yyyy')}
          {hasChanged.moveInDate && originalValues?.moveInDate && (
            <span className="hep-original-value">
              was: {format(originalValues.moveInDate, 'MMM d, yyyy')}
            </span>
          )}
        </span>
      </div>

      <div className={getRowClass(hasChanged.checkInDay)}>
        <span className="hep-breakdown-row-label">Check-in</span>
        <span className="hep-breakdown-row-value">
          {checkInDay}
          {hasChanged.checkInDay && originalValues?.checkInDay && (
            <span className="hep-original-value">was: {originalValues.checkInDay}</span>
          )}
        </span>
      </div>

      <div className={getRowClass(hasChanged.checkOutDay)}>
        <span className="hep-breakdown-row-label">Check-out</span>
        <span className="hep-breakdown-row-value">
          {checkOutDay}
          {hasChanged.checkOutDay && originalValues?.checkOutDay && (
            <span className="hep-original-value">was: {originalValues.checkOutDay}</span>
          )}
        </span>
      </div>

      <div className={getRowClass(hasChanged.reservationSpan || hasChanged.weeksReservationSpan)}>
        <span className="hep-breakdown-row-label">Reservation Length</span>
        <span className="hep-breakdown-row-value">
          {reservationSpan.value === 'other' ? `${weeksReservationSpan} weeks` : reservationSpan.label}
          {(hasChanged.reservationSpan || hasChanged.weeksReservationSpan) &&
            originalValues?.reservationSpan && (
              <span className="hep-original-value">
                was: {originalValues.reservationSpan.value === 'other'
                  ? `${originalValues.weeksReservationSpan} weeks`
                  : originalValues.reservationSpan.label}
              </span>
            )}
        </span>
      </div>

      <div className={getRowClass(hasChanged.houseRules)}>
        <span className="hep-breakdown-row-label">Your House Rules</span>
        <span className="hep-breakdown-row-value">
          {houseRules.length > 0
            ? houseRules.map((rule) => rule.name).join(', ')
            : 'None specified'}
          {hasChanged.houseRules && originalValues?.houseRules && (
            <span className="hep-original-value">
              was: {originalValues.houseRules.length > 0
                ? originalValues.houseRules.map((r) => r.name).join(', ')
                : 'None'}
            </span>
          )}
        </span>
      </div>

      <div className={getRowClass(hasChanged.nightsSelected)}>
        <span className="hep-breakdown-row-label">Weekly Pattern</span>
        <span className="hep-breakdown-row-value">
          {nightsSelected.length} nights/week
          {hasChanged.nightsSelected && originalValues?.nightsSelected && (
            <span className="hep-original-value">
              was: {originalValues.nightsSelected.length} nights/week
            </span>
          )}
        </span>
      </div>

      <div className={getRowClass(hasChanged.weeksReservationSpan)}>
        <span className="hep-breakdown-row-label">Actual Weeks Used</span>
        <span className="hep-breakdown-row-value">
          {weeksReservationSpan}
          {hasChanged.weeksReservationSpan && originalValues?.weeksReservationSpan && (
            <span className="hep-original-value">
              was: {originalValues.weeksReservationSpan}
            </span>
          )}
        </span>
      </div>

      <div className="hep-breakdown-row">
        <span className="hep-breakdown-row-label">Compensation/night</span>
        <span className="hep-breakdown-row-value">
          {formatCurrency(nightlyCompensation)}
        </span>
      </div>

      <div className="hep-breakdown-row">
        <span className="hep-breakdown-row-label">Price per night</span>
        <span className="hep-breakdown-row-value">
          {formatCurrency(nightlyPrice)}
        </span>
      </div>

      <div className={getRowClass(schedulingChanged)}>
        <span className="hep-breakdown-row-label">Nights reserved</span>
        <span className="hep-breakdown-row-value">
          {nightsCount}
          {schedulingChanged && originalValues?.nightsSelected && originalValues?.weeksReservationSpan && (
            <span className="hep-original-value">
              was: {originalValues.nightsSelected.length * originalValues.weeksReservationSpan}
            </span>
          )}
        </span>
      </div>

      <div className={getRowClass(schedulingChanged)}>
        <span className="hep-breakdown-row-label">Total Compensation</span>
        <span className="hep-breakdown-row-value">
          {formatCurrency(totalCompensation)}
        </span>
      </div>

      <div className={getRowClass(schedulingChanged)}>
        <span className="hep-breakdown-row-label">Total Price</span>
        <span className="hep-breakdown-row-value">
          {formatCurrency(totalPrice)}
        </span>
      </div>

      <div className={`hep-breakdown-row hep-breakdown-row-highlight${schedulingChanged ? ' hep-breakdown-row-changed' : ''}`}>
        <span className="hep-breakdown-row-label">Compensation / 4 weeks</span>
        <span className="hep-breakdown-row-value">
          {formatCurrency(hostCompensationPer4Weeks)}
        </span>
      </div>

      <div className={`hep-breakdown-row hep-breakdown-row-highlight${schedulingChanged ? ' hep-breakdown-row-changed' : ''}`}>
        <span className="hep-breakdown-row-label">Price per 4 weeks</span>
        <span className="hep-breakdown-row-value">
          {formatCurrency(pricePer4Weeks)}
        </span>
      </div>

      <div className="hep-breakdown-row">
        <span className="hep-breakdown-row-label">Refundable Damage Deposit</span>
        <span className="hep-breakdown-row-value">
          {formatCurrency(damageDeposit)}
        </span>
      </div>

      <div className="hep-breakdown-row">
        <span className="hep-breakdown-row-label">Maintenance Fee</span>
        <span className="hep-breakdown-row-value">
          {formatCurrency(cleaningFee)}
        </span>
      </div>

      <p className="hep-breakdown-footnote">
        *Refundable Damage Deposit is collected before move-in and returned after
        checkout if no damages occur.
      </p>
    </div>
  );
}
