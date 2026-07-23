import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-current border-t-transparent text-sage ${sizes[size]} ${className}`} role="status" aria-label="loading">
      <span className="sr-only">Loading...</span>
    </div>
  );
}
