import React from 'react';
import './GlowingButton.css';

const GlowingButton = ({ children, onClick, type = "button", className = "", disabled = false, fullWidth = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`glowing-btn ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default GlowingButton;
