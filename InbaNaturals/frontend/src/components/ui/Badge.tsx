import React from 'react';

interface BadgeProps {
  status: string;
}

export default function Badge({ status }: BadgeProps) {
  const normalizedStatus = status.toLowerCase();
  
  const colors: Record<string, string> = {
    confirmed: 'bg-sage/10 text-sage',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
  };

  const defaultColor = 'bg-gray-100 text-gray-700';
  const colorClass = colors[normalizedStatus] || defaultColor;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}>
      {status}
    </span>
  );
}
