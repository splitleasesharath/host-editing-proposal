import { useState, useEffect, useCallback } from 'react';
import type { DayOfWeek, Night } from '../types';

/**
 * Night configuration - maps to days of the week
 * Based on Bubble.io implementation
 */
interface NightConfig {
  id: string;
  display: string;
  singleLetter: string;
  associatedCheckin: DayOfWeek;
  associatedCheckout: DayOfWeek;
  bubbleNumber: number;
}

const ALL_NIGHTS: NightConfig[] = [
  {
    id: 'sunday',
    display: 'Sunday',
    singleLetter: 'S',
    associatedCheckin: 'Sunday',
    associatedCheckout: 'Monday',
    bubbleNumber: 1,
  },
  {
    id: 'monday',
    display: 'Monday',
    singleLetter: 'M',
    associatedCheckin: 'Monday',
    associatedCheckout: 'Tuesday',
    bubbleNumber: 2,
  },
  {
    id: 'tuesday',
    display: 'Tuesday',
    singleLetter: 'T',
    associatedCheckin: 'Tuesday',
    associatedCheckout: 'Wednesday',
    bubbleNumber: 3,
  },
  {
    id: 'wednesday',
    display: 'Wednesday',
    singleLetter: 'W',
    associatedCheckin: 'Wednesday',
    associatedCheckout: 'Thursday',
    bubbleNumber: 4,
  },
  {
    id: 'thursday',
    display: 'Thursday',
    singleLetter: 'T',
    associatedCheckin: 'Thursday',
    associatedCheckout: 'Friday',
    bubbleNumber: 5,
  },
  {
    id: 'friday',
    display: 'Friday',
    singleLetter: 'F',
    associatedCheckin: 'Friday',
    associatedCheckout: 'Saturday',
    bubbleNumber: 6,
  },
  {
    id: 'saturday',
    display: 'Saturday',
    singleLetter: 'S',
    associatedCheckin: 'Saturday',
    associatedCheckout: 'Sunday',
    bubbleNumber: 7,
  },
];

// Map night IDs to Night type
const NIGHT_ID_TO_TYPE: Record<string, Night> = {
  sunday: 'Sunday Night',
  monday: 'Monday Night',
  tuesday: 'Tuesday Night',
  wednesday: 'Wednesday Night',
  thursday: 'Thursday Night',
  friday: 'Friday Night',
  saturday: 'Saturday Night',
};

const NIGHT_TYPE_TO_ID: Record<Night, string> = {
  'Sunday Night': 'sunday',
  'Monday Night': 'monday',
  'Tuesday Night': 'tuesday',
  'Wednesday Night': 'wednesday',
  'Thursday Night': 'thursday',
  'Friday Night': 'friday',
  'Saturday Night': 'saturday',
};

export interface ScheduleSelectorProps {
  initialNightsSelected: Night[];
  availableNights?: Night[];
  onChange: (data: {
    checkInDay: DayOfWeek;
    checkOutDay: DayOfWeek;
    nightsSelected: Night[];
    daysSelected: DayOfWeek[];
  }) => void;
  disabled?: boolean;
}

/**
 * Get check-in day from selected nights
 * Check-in is the first selected night's associated check-in day
 */
function getCheckInDay(selectedNightIds: string[]): DayOfWeek | null {
  if (selectedNightIds.length === 0) return null;

  // Sort by bubble number to find first selected night
  const sorted = [...selectedNightIds].sort((a, b) => {
    const nightA = ALL_NIGHTS.find((n) => n.id === a);
    const nightB = ALL_NIGHTS.find((n) => n.id === b);
    return (nightA?.bubbleNumber || 0) - (nightB?.bubbleNumber || 0);
  });

  const firstNight = ALL_NIGHTS.find((n) => n.id === sorted[0]);
  return firstNight?.associatedCheckin || null;
}

/**
 * Get check-out day from selected nights
 * Check-out is the last selected night's associated check-out day
 */
function getCheckOutDay(selectedNightIds: string[]): DayOfWeek | null {
  if (selectedNightIds.length === 0) return null;

  // Sort by bubble number to find last selected night
  const sorted = [...selectedNightIds].sort((a, b) => {
    const nightA = ALL_NIGHTS.find((n) => n.id === a);
    const nightB = ALL_NIGHTS.find((n) => n.id === b);
    return (nightA?.bubbleNumber || 0) - (nightB?.bubbleNumber || 0);
  });

  const lastNight = ALL_NIGHTS.find((n) => n.id === sorted[sorted.length - 1]);
  return lastNight?.associatedCheckout || null;
}

/**
 * Convert night IDs to Night types
 */
function nightIdsToTypes(nightIds: string[]): Night[] {
  return nightIds.map((id) => NIGHT_ID_TO_TYPE[id]).filter(Boolean) as Night[];
}

/**
 * Convert Night types to night IDs
 */
function nightTypesToIds(nights: Night[]): string[] {
  return nights.map((n) => NIGHT_TYPE_TO_ID[n]).filter(Boolean);
}

/**
 * Get days from selected nights
 */
function nightsToDays(nightIds: string[]): DayOfWeek[] {
  return nightIds
    .map((id) => {
      const night = ALL_NIGHTS.find((n) => n.id === id);
      return night?.associatedCheckin;
    })
    .filter(Boolean) as DayOfWeek[];
}

export function ScheduleSelector({
  initialNightsSelected,
  availableNights,
  onChange,
  disabled = false,
}: ScheduleSelectorProps) {
  // Convert initial nights to IDs
  const initialNightIds = nightTypesToIds(initialNightsSelected);
  const [selectedNightIds, setSelectedNightIds] = useState<string[]>(initialNightIds);

  // Available night IDs (all nights available if not specified)
  const availableNightIds = availableNights
    ? nightTypesToIds(availableNights)
    : ALL_NIGHTS.map((n) => n.id);

  // Sync with prop changes
  useEffect(() => {
    const newIds = nightTypesToIds(initialNightsSelected);
    setSelectedNightIds(newIds);
  }, [initialNightsSelected]);

  // Emit changes
  const emitChange = useCallback(
    (nightIds: string[]) => {
      const checkIn = getCheckInDay(nightIds);
      const checkOut = getCheckOutDay(nightIds);

      if (checkIn && checkOut) {
        onChange({
          checkInDay: checkIn,
          checkOutDay: checkOut,
          nightsSelected: nightIdsToTypes(nightIds),
          daysSelected: nightsToDays(nightIds),
        });
      }
    },
    [onChange]
  );

  const handleNightClick = useCallback(
    (nightId: string) => {
      if (disabled) return;
      if (!availableNightIds.includes(nightId)) return;

      const isSelected = selectedNightIds.includes(nightId);
      let newSelection: string[];

      if (isSelected) {
        // Remove night
        newSelection = selectedNightIds.filter((id) => id !== nightId);
      } else {
        // Add night (max 7)
        if (selectedNightIds.length >= 7) return;
        newSelection = [...selectedNightIds, nightId];
      }

      setSelectedNightIds(newSelection);
      emitChange(newSelection);
    },
    [selectedNightIds, availableNightIds, disabled, emitChange]
  );

  // Calculate derived values for display
  const checkInDay = getCheckInDay(selectedNightIds);
  const checkOutDay = getCheckOutDay(selectedNightIds);
  const nightsCount = selectedNightIds.length;

  return (
    <div className="hss-host-schedule-selector">
      {/* Night selector grid */}
      <div className="hss-nights-grid">
        {ALL_NIGHTS.map((night) => {
          const isSelected = selectedNightIds.includes(night.id);
          const isAvailable = availableNightIds.includes(night.id);

          const classes = ['hss-night-cell'];
          if (isSelected) classes.push('hss-selected');
          if (!isAvailable) classes.push('hss-unavailable');
          if (disabled) classes.push('hss-disabled');

          return (
            <div
              key={night.id}
              className={classes.join(' ')}
              onClick={() => handleNightClick(night.id)}
              role="checkbox"
              aria-checked={isSelected}
              aria-label={`${night.display} night`}
              aria-disabled={disabled || !isAvailable}
              tabIndex={disabled || !isAvailable ? -1 : 0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleNightClick(night.id);
                }
              }}
            >
              <span className="hss-night-letter">{night.singleLetter}</span>
            </div>
          );
        })}
      </div>

      {/* Summary of selection */}
      <div className="hss-selection-summary">
        <div className="hss-summary-item">
          <span className="hss-summary-label">Nights Selected:</span>
          <span className="hss-summary-value">{nightsCount} night{nightsCount !== 1 ? 's' : ''}/week</span>
        </div>
        {checkInDay && (
          <div className="hss-summary-item">
            <span className="hss-summary-label">Check-in Day:</span>
            <span className="hss-summary-value hss-checkin">{checkInDay}</span>
          </div>
        )}
        {checkOutDay && (
          <div className="hss-summary-item">
            <span className="hss-summary-label">Check-out Day:</span>
            <span className="hss-summary-value hss-checkout">{checkOutDay}</span>
          </div>
        )}
      </div>
    </div>
  );
}
