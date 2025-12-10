import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, ChevronDown, X } from 'lucide-react';
import type { ReservationSpan, HouseRule } from '../types';
import { RESERVATION_SPANS } from '../types';

// Date Input Component
export interface DateInputProps {
  value: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DateInput({
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  minDate,
  maxDate,
}: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onChange(newDate);
    }
  };

  const formatForInput = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  return (
    <div className="hep-date-input-wrapper" style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="date"
        className="hep-input-base hep-input-date"
        value={formatForInput(value)}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        min={minDate ? formatForInput(minDate) : undefined}
        max={maxDate ? formatForInput(maxDate) : undefined}
        style={{ width: '100%', paddingRight: '40px' }}
      />
      <Calendar
        size={20}
        className="hep-icon"
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--hep-primary-purple)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// Dropdown Component
export interface DropdownProps {
  value: ReservationSpan | null;
  onChange: (span: ReservationSpan) => void;
  options?: ReservationSpan[];
  placeholder?: string;
  disabled?: boolean;
}

export function ReservationSpanDropdown({
  value,
  onChange,
  options = RESERVATION_SPANS,
  placeholder = 'Select reservation span',
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: ReservationSpan) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="hep-dropdown-wrapper"
      style={{ position: 'relative' }}
    >
      <button
        type="button"
        className="hep-input-base hep-dropdown"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          width: '100%',
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <span style={{ color: value ? 'inherit' : 'var(--hep-text-placeholder-light)' }}>
          {value ? value.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 200ms ease',
          }}
        />
      </button>

      {isOpen && (
        <div
          className="hep-dropdown-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--hep-primary-white)',
            border: '1px solid var(--hep-text-tertiary)',
            borderRadius: '2px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 100,
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className="hep-dropdown-option"
              onClick={() => handleSelect(option)}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                backgroundColor:
                  value?.value === option.value
                    ? 'rgba(49, 19, 93, 0.1)'
                    : 'transparent',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'rgba(49, 19, 93, 0.05)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  value?.value === option.value
                    ? 'rgba(49, 19, 93, 0.1)'
                    : 'transparent')
              }
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Number Input Component
export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}

export function NumberInput({
  value,
  onChange,
  placeholder = 'Enter number',
  disabled = false,
  min,
  max,
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <input
      type="number"
      className="hep-input-base hep-input-number"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      style={{ width: '100%' }}
    />
  );
}

// Multi-Select Component for House Rules
export interface MultiSelectProps {
  value: HouseRule[];
  onChange: (rules: HouseRule[]) => void;
  options: HouseRule[];
  placeholder?: string;
  disabled?: boolean;
}

export function HouseRulesMultiSelect({
  value,
  onChange,
  options,
  placeholder = 'Choose some options...',
  disabled = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (rule: HouseRule) => {
    const isSelected = value.some((r) => r.id === rule.id);
    if (isSelected) {
      onChange(value.filter((r) => r.id !== rule.id));
    } else {
      onChange([...value, rule]);
    }
  };

  const handleRemove = (rule: HouseRule, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((r) => r.id !== rule.id));
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <div
        className="hep-multiselect"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          padding: '5px 8px',
          minHeight: '40px',
          alignItems: 'center',
        }}
      >
        {value.length === 0 ? (
          <span style={{ color: 'var(--hep-text-placeholder)' }}>
            {placeholder}
          </span>
        ) : (
          value.map((rule) => (
            <span key={rule.id} className="hep-tag">
              {rule.name}
              <X
                size={12}
                className="hep-tag-remove"
                onClick={(e) => handleRemove(rule, e)}
              />
            </span>
          ))
        )}
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--hep-primary-white)',
            border: '1px solid var(--hep-input-border-purple)',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 100,
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {options.map((option) => {
            const isSelected = value.some((r) => r.id === option.id);
            return (
              <div
                key={option.id}
                onClick={() => handleToggleOption(option)}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: isSelected
                    ? 'rgba(75, 71, 206, 0.1)'
                    : 'transparent',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = isSelected
                    ? 'rgba(75, 71, 206, 0.15)'
                    : 'rgba(75, 71, 206, 0.05)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = isSelected
                    ? 'rgba(75, 71, 206, 0.1)'
                    : 'transparent')
                }
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  style={{ accentColor: 'var(--hep-input-border-purple)' }}
                />
                <span>{option.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
