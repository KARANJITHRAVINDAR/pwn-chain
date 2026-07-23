import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Are your products 100% natural?',
    answer: 'Yes! All InbaNaturals products are formulated with 100% pure botanical extracts, therapeutic-grade essential oils, and organic cold-pressed oils. We do not use any parabens, sulfates, silicones, synthetic fragrances, or artificial colors.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3–5 business days within major metropolitan areas in India, and 5–7 business days for other regions. Once shipped, you will receive a tracking link via WhatsApp and email.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer an easy 7-day return policy. If you receive a damaged or incorrect product, simply contact us via email or WhatsApp within 7 days of delivery, and we will arrange a replacement or refund immediately.',
  },
  {
    question: 'How do I use the Hair Oil for best results?',
    answer: 'For best results, apply 5–6 drops directly to your scalp and massage gently in circular motions. Leave it on for at least 30 minutes, or overnight for deep conditioning, then wash off with a mild natural shampoo. Use 2–3 times a week.',
  },
  {
    question: 'Can I use the Face Pack on sensitive skin?',
    answer: 'Yes! Our Face Pack is based on gentle Kaolin clay and soothing botanicals. However, we always recommend doing a 24-hour patch test on your inner arm or jawline before first use to ensure no allergic sensitivity.',
  },
  {
    question: 'Are InbaNaturals products safe for colored or chemically treated hair?',
    answer: 'Absolutely. Because our Hair Oil and Hair Pack are entirely free of sulfates, silicones, and harsh salts, they are completely safe and highly nourishing for color-treated or chemically smoothed hair.',
  },
  {
    question: 'How long do these natural products last?',
    answer: 'Since we use natural preservatives derived from plants, our products have a shelf life of 12 months from the date of manufacture. We recommend storing them in a cool, dry place away from direct sunlight.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently, we only ship within India. However, we are actively working on international shipping regulations and hope to deliver InbaNaturals worldwide very soon!',
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      {faqData.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-ivory-dark overflow-hidden transition-all duration-300 shadow-sm"
          >
            {/* Accordion Header */}
            <h3>
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                id={`faq-header-${index}`}
                className="w-full flex items-center justify-between text-left px-6 py-5 font-serif text-lg font-bold text-charcoal hover:bg-ivory transition-colors focus:outline-none focus:ring-2 focus:ring-sage cursor-pointer"
              >
                <span>{item.question}</span>
                <span
                  className={`ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-sage/10 text-sage font-bold transition-transform duration-300 transform ${
                    isOpen ? 'rotate-180 bg-terracotta/10 text-terracotta' : ''
                  }`}
                >
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>

            {/* Accordion Panel */}
            <div
              id={`faq-panel-${index}`}
              role="region"
              aria-labelledby={`faq-header-${index}`}
              hidden={!isOpen}
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-60 opacity-100 border-t border-ivory-dark' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
            >
              <div className="px-6 py-5 text-charcoal-light text-sm leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
