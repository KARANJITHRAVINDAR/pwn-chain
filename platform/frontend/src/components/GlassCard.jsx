import React from 'react';
import './GlassCard.css';

const GlassCard = ({ children, className = '' }) => {
  return (
    <div className={`glass-panel pwn-card ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
