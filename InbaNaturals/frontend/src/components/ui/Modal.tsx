import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Panel */}
      <div 
        className="relative w-full max-w-md h-full bg-white shadow-xl flex flex-col animate-[slideIn_0.3s_ease-out]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ivory-dark">
          {title && <h2 className="font-serif text-xl text-charcoal">{title}</h2>}
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-charcoal-light hover:text-charcoal hover:bg-ivory-dark rounded-full transition-colors focus:outline-none"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
        
        {footer && (
          <div className="p-6 border-t border-ivory-dark bg-ivory">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
