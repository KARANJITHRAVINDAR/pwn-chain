import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  padding?: boolean;
  hover?: boolean;
  className?: string;
  children: ReactNode;
}

export default function Card({
  title,
  padding = true,
  hover = false,
  className = '',
  children,
}: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-ivory-dark shadow-sm ${hover ? 'transition-shadow hover:shadow-md' : ''} ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-ivory-dark">
          <h3 className="font-serif text-xl text-charcoal">{title}</h3>
        </div>
      )}
      <div className={padding ? 'p-6' : ''}>
        {children}
      </div>
    </div>
  );
}
