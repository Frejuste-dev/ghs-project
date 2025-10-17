import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = props.id || props.name;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-secondary-700"
          >
            {label}
            {props.required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full h-10 pl-3 pr-10 text-base rounded-lg border transition-all duration-200',
              'bg-white text-secondary-900 appearance-none cursor-pointer',
              'focus-ring',
              error
                ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
                : 'border-secondary-300 focus:border-primary-500',
              disabled && 'bg-secondary-100 cursor-not-allowed opacity-60',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary-400">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>

        {error && (
          <p className="text-sm text-danger-600 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-danger-600" />
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-sm text-secondary-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };