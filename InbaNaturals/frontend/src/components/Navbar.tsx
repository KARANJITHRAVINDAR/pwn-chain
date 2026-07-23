import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Menu, X, MessageCircle, User, LogOut, LayoutDashboard, ShoppingBag, Wallet } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { WHATSAPP_NUMBER } from '../config';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Combos', to: '/combos' },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <>
      {/* ─── Main Sticky Header ─── */}
      <header className="sticky top-0 z-40 bg-ivory/90 backdrop-blur-md border-b border-ivory-dark shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" aria-label="InbaNaturals home">
              <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center shadow-sm group-hover:bg-sage-dark transition-colors">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M9 2 C5 2, 2 5.5, 2 9 C2 12.5, 5 16, 9 16 C13 16, 16 12.5, 16 9 C14 9, 9 13, 6 8 C8 6, 13 7, 16 9 C16 5.5, 13 2, 9 2Z" fill="#FAF6EE" fillOpacity="0.9" />
                </svg>
              </div>
              <span className="font-serif text-xl font-bold text-charcoal tracking-tight">
                Inba<span className="text-sage">Naturals</span>
              </span>
            </Link>

            {/* Desktop Nav — hidden on mobile */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-sage border-b-2 border-sage pb-0.5'
                        : 'text-charcoal-light hover:text-charcoal'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right-side actions */}
            <div className="flex items-center gap-2">
              {/* WhatsApp pill — hidden on small screens */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-sage text-sage hover:bg-sage hover:text-white transition-all duration-200"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>

              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-sage text-white font-serif font-bold text-lg hover:bg-sage-dark transition-colors cursor-pointer"
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </button>
                  
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-ivory-dark py-2 z-50 animate-[fadeIn_0.2s_ease-out]">
                        <div className="px-4 py-2 border-b border-ivory-dark mb-1">
                          <p className="text-sm font-medium text-charcoal truncate">{user.full_name || user.username}</p>
                          <p className="text-xs text-charcoal-light truncate">{user.email}</p>
                        </div>
                        <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-charcoal hover:bg-ivory-dark">
                          <ShoppingBag size={16} /> My Orders
                        </Link>
                        <Link to="/wallet" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-charcoal hover:bg-ivory-dark">
                          <Wallet size={16} /> Wallet (₹{user.wallet_balance})
                        </Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-sage hover:bg-sage/10 font-medium border-t border-ivory-dark mt-1 pt-2">
                            <LayoutDashboard size={16} /> Admin Portal
                          </Link>
                        )}
                        <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-terracotta hover:bg-red-50 text-left border-t border-ivory-dark mt-1 pt-2">
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className="text-sm font-medium text-charcoal-light hover:text-charcoal transition-colors px-2">
                    Login
                  </Link>
                  <Link to="/register" className="text-sm font-medium bg-sage text-white px-3 py-1.5 rounded-lg hover:bg-sage-dark transition-colors">
                    Register
                  </Link>
                </div>
              )}

              {/* Cart icon */}
              <button
                className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-ivory-dark transition-colors cursor-pointer"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={20} className="text-charcoal" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger button — only on mobile */}
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-ivory-dark transition-colors cursor-pointer"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
              >
                <Menu size={22} className="text-charcoal" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mobile Slide-in Drawer ─── */}
      {/* Rendered as a sibling OUTSIDE the header so backdrop-filter doesn't clip the z-index */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[9999] flex md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          {/* Dark backdrop — click anywhere to close */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel slides in from right */}
          <div
            className="absolute top-0 right-0 h-full w-72 max-w-[80vw] bg-white shadow-2xl flex flex-col"
            style={{ animation: 'slideInRight 0.25s ease-out' }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-ivory-dark">
              <span className="font-serif text-lg font-bold text-charcoal">
                Inba<span className="text-sage">Naturals</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 rounded-xl bg-ivory hover:bg-ivory-dark flex items-center justify-center text-charcoal transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {navLinks.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3.5 rounded-2xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-sage/10 text-sage font-semibold'
                        : 'text-charcoal hover:bg-ivory-dark'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Drawer footer with WhatsApp CTA */}
            <div className="px-5 py-5 border-t border-ivory-dark space-y-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-sage hover:bg-sage-dark text-white rounded-2xl text-sm font-semibold transition-colors"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>
              <p className="text-[10px] text-center text-charcoal-light">
                © {new Date().getFullYear()} InbaNaturals · Made with 🌿
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Inline keyframe for the drawer slide animation */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
