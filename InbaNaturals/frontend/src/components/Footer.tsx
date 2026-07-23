import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone } from 'lucide-react';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About Us', to: '/about' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Contact', to: '/contact' },
];

const policyLinks = [
  { label: 'Shipping Policy', to: '/shipping' },
  { label: 'Returns & Refunds', to: '/returns' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
];

const products = [
  { label: 'Hair Oil', to: '/product/hair-oil' },
  { label: 'Hair Pack', to: '/product/hair-pack' },
  { label: 'Face Pack', to: '/product/face-pack' },
  { label: 'Face Serum', to: '/product/face-serum' },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/80">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand column */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-sage flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M9 2 C5 2, 2 5.5, 2 9 C2 12.5, 5 16, 9 16 C13 16, 16 12.5, 16 9 C14 9, 9 13, 6 8 C8 6, 13 7, 16 9 C16 5.5, 13 2, 9 2Z" fill="#FAF6EE" fillOpacity="0.9"/>
              </svg>
            </div>
            <span className="font-serif text-lg font-bold text-white tracking-tight">
              Inba<span className="text-sage-light">Naturals</span>
            </span>
          </Link>
          <p className="text-sm text-white/60 leading-relaxed mb-5">
            Rooted in nature, crafted with love. Premium botanical beauty products made for conscious souls who choose clean, green, and radiant.
          </p>
          {/* Social icons */}
          <div className="flex gap-3">
            {[
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>, label: 'Instagram', href: '#' },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>, label: 'Facebook', href: '#' },
              { icon: <MessageCircle size={18} />, label: 'WhatsApp', href: 'https://wa.me/910000000000' },
            ].map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-sage transition-colors duration-200 flex items-center justify-center"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-serif text-white font-semibold text-base mb-4">Quick Links</h4>
          <ul className="space-y-2.5">
            {quickLinks.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="text-sm text-white/60 hover:text-sage-light transition-colors duration-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div>
          <h4 className="font-serif text-white font-semibold text-base mb-4">Our Products</h4>
          <ul className="space-y-2.5">
            {products.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="text-sm text-white/60 hover:text-sage-light transition-colors duration-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <h4 className="font-serif text-white font-semibold text-base mt-6 mb-4">Policies</h4>
          <ul className="space-y-2.5">
            {policyLinks.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="text-sm text-white/60 hover:text-sage-light transition-colors duration-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-serif text-white font-semibold text-base mb-4">Get in Touch</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-white/60">
              <Phone size={16} className="text-sage-light mt-0.5 shrink-0" />
              <span>+91 00000 00000</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-white/60">
              <Mail size={16} className="text-sage-light mt-0.5 shrink-0" />
              <span>hello@inbanaturals.com</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-white/60">
              <MessageCircle size={16} className="text-sage-light mt-0.5 shrink-0" />
              <a href="https://wa.me/910000000000" target="_blank" rel="noopener noreferrer" className="hover:text-sage-light transition-colors">
                Chat on WhatsApp
              </a>
            </li>
          </ul>
          {/* Newsletter mini */}
          <div className="mt-6">
            <p className="text-xs text-white/50 mb-2 uppercase tracking-wider font-medium">Newsletter</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/10 border border-white/20 text-white text-sm rounded-xl px-3 py-2 placeholder-white/30 focus:outline-none focus:border-sage-light transition-colors"
              />
              <button className="bg-sage hover:bg-sage-dark text-white text-sm px-4 py-2 rounded-xl transition-colors">
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} InbaNaturals. All rights reserved.</p>
          <p>Crafted with 🌿 and love for natural beauty</p>
        </div>
      </div>
    </footer>
  );
}
