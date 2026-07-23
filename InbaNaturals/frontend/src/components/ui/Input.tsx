import React, { ChangeEvent, ReactNode } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={inputId} className="mb-1 text-sm font-medium text-charcoal">
          {label} {props.required && <span className="text-terracotta">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-light">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full rounded-lg border ${error ? 'border-terracotta focus:ring-terracotta' : 'border-ivory-dark focus:ring-sage'} bg-white px-3 py-2 text-charcoal focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-terracotta">{error}</p>}
    </div>
  );
}
