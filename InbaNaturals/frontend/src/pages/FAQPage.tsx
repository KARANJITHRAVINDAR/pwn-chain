import FAQAccordion from '../components/FAQAccordion';
import LeafDivider from '../components/LeafDivider';

export default function FAQPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Page header */}
      <div className="bg-ivory-dark py-14 text-center border-b border-ivory-dark">
        <span className="text-sage text-xs font-medium uppercase tracking-widest">Help & Support</span>
        <h1 className="font-serif text-5xl text-charcoal mt-2 mb-3">Frequently Asked Questions</h1>
        <LeafDivider />
        <p className="text-charcoal-light mt-4 max-w-md mx-auto text-sm leading-relaxed">
          Find instant answers to common questions about our products, ingredients, shipping, and returns.
        </p>
      </div>

      <div className="mt-12">
        <FAQAccordion />
      </div>

      {/* WhatsApp Help CTA */}
      <div className="max-w-md mx-auto mt-14 text-center px-4">
        <div className="bg-white rounded-3xl p-8 border border-ivory-dark shadow-sm">
          <h3 className="font-serif text-xl font-bold text-charcoal mb-2">Still have questions?</h3>
          <p className="text-charcoal-light text-sm mb-6 leading-relaxed">
            We are always happy to help. Chat with us directly on WhatsApp for personalized support.
          </p>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-sage hover:bg-sage-dark text-white font-medium px-8 py-3.5 rounded-2xl transition-colors duration-200"
          >
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
