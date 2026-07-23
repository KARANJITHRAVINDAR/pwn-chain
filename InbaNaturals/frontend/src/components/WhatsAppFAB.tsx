import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../config';

const WHATSAPP_MESSAGE = encodeURIComponent("Hi! I'd like to know more about InbaNaturals products.");

export default function WhatsAppFAB() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-terracotta/30 bg-terracotta hover:bg-terracotta-dark hover:shadow-xl transition-all duration-300 hover:scale-110 animate-bounce"
    >
      <MessageCircle size={28} className="text-white fill-white" />
      <span className="sr-only">Chat on WhatsApp</span>
    </a>
  );
}

