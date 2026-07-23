export const WHATSAPP_NUMBER = '919999999999';
export const INSTAGRAM_HANDLE = 'inbanaturals';
export const INSTAGRAM_URL = 'https://instagram.com/inbanaturals';

export function getWhatsAppProductLink(name: string, size: string): string {
  const text = encodeURIComponent(`Hi! I'd like to order ${name} - ${size}. Please share payment details.`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function getWhatsAppComboLink(comboName: string, items: string[]): string {
  const text = encodeURIComponent(`Hi! I'd like to order the ${comboName} containing: ${items.join(', ')}. Please share payment details.`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
