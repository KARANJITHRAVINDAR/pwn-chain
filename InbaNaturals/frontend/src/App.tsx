import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFAB from './components/WhatsAppFAB';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import CombosPage from './pages/CombosPage';
import FAQPage from './pages/FAQPage';
import BlogListingPage from './pages/BlogListingPage';
import BlogPostDetailPage from './pages/BlogPostDetailPage';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/ScrollToTop';

// Placeholder policy pages
function PolicyPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-20">
      <h1 className="font-serif text-4xl text-charcoal mb-4">{title}</h1>
      <div className="bg-white rounded-2xl p-8 border border-ivory-dark shadow-sm space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <h3 className="font-serif text-lg text-charcoal mb-1">Section {i + 1}</h3>
            <p className="text-charcoal-light text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/combos" element={<CombosPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/blog" element={<BlogListingPage />} />
              <Route path="/blog/:id" element={<BlogPostDetailPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/shipping" element={<PolicyPage title="Shipping Policy" />} />
              <Route path="/returns" element={<PolicyPage title="Returns & Refunds" />} />
              <Route path="/privacy" element={<PolicyPage title="Privacy Policy" />} />
              <Route path="/terms" element={<PolicyPage title="Terms of Service" />} />
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center text-center px-4">
                  <div>
                    <p className="text-sage font-medium text-sm uppercase tracking-widest mb-2">404</p>
                    <h1 className="font-serif text-5xl text-charcoal mb-3">Page Not Found</h1>
                    <p className="text-charcoal-light mb-6">The page you're looking for doesn't exist.</p>
                    <a href="/" className="bg-sage text-white px-6 py-3 rounded-2xl font-medium hover:bg-sage-dark transition-colors">
                      Back to Home
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
          <WhatsAppFAB />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

