import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Heart, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import LeafDivider from '../components/LeafDivider';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import api from '../api/client';
import type { ProductListItem } from '../types';
import { INSTAGRAM_URL } from '../config';
import hairOilImg from '../assets/images/products/hair-oil-main.jpg';
import hairPackImg from '../assets/images/products/hair-pack-main.jpg';
import facePackImg from '../assets/images/products/face-pack-main.jpg';
import faceSerumImg from '../assets/images/products/face-serum-main.jpg';
import FAQAccordion from '../components/FAQAccordion';

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    quote: 'The Hair Oil is absolutely divine! My hair has never felt so nourished and the fragrance is so calming. I\'ve been using it for 3 months and the difference is incredible.',
  },
  {
    name: 'Ananya Reddy',
    location: 'Hyderabad',
    rating: 5,
    quote: 'The Face Serum gives me such a beautiful glow every morning. It absorbs so quickly and my skin feels plump and hydrated all day long. Love it!',
  },
  {
    name: 'Meera Iyer',
    location: 'Bangalore',
    rating: 5,
    quote: 'Tried the Face Pack and Hair Pack together as a weekend ritual. My skin and hair feel completely transformed. 100% natural and it truly shows!',
  },
];

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<ProductListItem[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.get('/products', { params: { featured: 'true' } })
      .then(r => setFeaturedProducts(r.data))
      .catch(console.error);
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section
        id="hero"
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #EEF4EC 0%, #FAF6EE 50%, #F5EDE0 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 -translate-y-1/2 translate-x-1/3" style={{ background: '#7A9471' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 translate-y-1/2 -translate-x-1/3" style={{ background: '#C97C5D' }} />

        {/* Botanical SVG accent top-left */}
        <svg className="absolute top-8 left-8 opacity-10" width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
          <circle cx="60" cy="60" r="50" stroke="#7A9471" strokeWidth="1" strokeDasharray="4 6"/>
          <path d="M60 20 C40 30, 20 50, 30 80 C40 100, 80 100, 90 80 C100 50, 80 30, 60 20Z" stroke="#7A9471" strokeWidth="1.5" fill="none"/>
          <line x1="60" y1="20" x2="60" y2="100" stroke="#7A9471" strokeWidth="1" strokeDasharray="3 5"/>
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center py-20">
          {/* Text */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 text-sage text-sm font-medium uppercase tracking-widest mb-4">
              <Leaf size={14} /> Pure. Natural. Botanical.
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal leading-tight mb-6">
              Glow from the{' '}
              <span className="italic text-sage">inside</span>{' '}
              out.
            </h1>
            <p className="text-charcoal-light text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Discover our handcrafted botanical beauty rituals — made with the purest ingredients from nature, for skin and hair that truly thrives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white font-medium px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-base"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 border-2 border-sage text-sage hover:bg-sage hover:text-white font-medium px-8 py-4 rounded-2xl transition-all duration-300 text-base"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Hero image placeholder */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main placeholder */}
              <div className="w-80 h-80 md:w-96 md:h-96 rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white/60">
                <img
                  src={hairOilImg}
                  alt="InbaNaturals hero product"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-5 py-3 border border-ivory-dark">
                <p className="text-xs text-charcoal-light font-medium">⭐ Rated</p>
                <p className="font-serif text-charcoal font-bold text-lg">4.9/5</p>
                <p className="text-xs text-sage">by 200+ customers</p>
              </div>
              {/* Floating ingredient tag */}
              <div className="absolute -top-4 -right-4 bg-terracotta text-white text-sm font-medium px-4 py-2 rounded-2xl shadow-lg">
                🌿 100% Natural
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section id="featured-products" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sage text-xs font-medium uppercase tracking-widest">Our Collection</span>
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal mt-2 mb-3">Featured Products</h2>
          <LeafDivider />
          <p className="text-charcoal-light mt-4 max-w-xl mx-auto leading-relaxed">
            Each product is thoughtfully formulated with nature's finest — no harmful chemicals, no compromise.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 border-2 border-sage text-sage hover:bg-sage hover:text-white font-medium px-8 py-3 rounded-2xl transition-all duration-300"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── SPECIAL COMBO OFFERS ─── */}
      <section id="special-combos" className="py-20 bg-ivory-dark border-t border-b border-ivory-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sage text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-1">
              <Sparkles size={12} className="text-terracotta" /> Best Value Packages
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal mt-2 mb-3">Special Combo Offers</h2>
            <LeafDivider />
            <p className="text-charcoal-light mt-4 max-w-xl mx-auto leading-relaxed">
              Carefully paired botanical sets that complement each other for maximum beauty benefits and savings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Combo 1 */}
            <div className="bg-white rounded-3xl p-6 border border-ivory-dark shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:scale-[1.02]">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] bg-terracotta text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Save 22%
                  </span>
                  <span className="text-xs text-sage font-semibold uppercase tracking-widest">Hair Care Set</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-2">Hair Care Combo</h3>
                <p className="text-charcoal-light text-sm mb-6 leading-relaxed">
                  Hair Oil + Hair Pack: A complete deep conditioning package to strengthen roots and restore silky texture.
                </p>
                <div className="flex gap-2 mb-6">
                  <img src={hairOilImg} alt="Abha Herbal Hair Oil" className="w-14 h-14 rounded-xl object-cover border border-ivory-dark" />
                  <img src={hairPackImg} alt="Clear Scalp Anti-Dandruff Hair Pack" className="w-14 h-14 rounded-xl object-cover border border-ivory-dark" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-ivory-dark">
                <div>
                  <span className="text-charcoal-light text-xs line-through">₹898</span>
                  <span className="text-2xl font-bold text-terracotta ml-2">₹699</span>
                </div>
                <Link to="/combos" className="bg-sage hover:bg-sage-dark text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors">
                  Customize Bundle
                </Link>
              </div>
            </div>

            {/* Combo 2 */}
            <div className="bg-white rounded-3xl p-6 border border-ivory-dark shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:scale-[1.02]">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] bg-terracotta text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Save 21%
                  </span>
                  <span className="text-xs text-sage font-semibold uppercase tracking-widest">Skin Glow Set</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-2">Glow Combo</h3>
                <p className="text-charcoal-light text-sm mb-6 leading-relaxed">
                  Face Pack + Face Serum: Our Ayurvedic brightening clay mask paired with premium vitamin C hydration.
                </p>
                <div className="flex gap-2 mb-6">
                  <img src={facePackImg} alt="Vitamin C Glow Face Pack" className="w-14 h-14 rounded-xl object-cover border border-ivory-dark" />
                  <img src={faceSerumImg} alt="Botanical Radiance Face Serum" className="w-14 h-14 rounded-xl object-cover border border-ivory-dark" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-ivory-dark">
                <div>
                  <span className="text-charcoal-light text-xs line-through">₹948</span>
                  <span className="text-2xl font-bold text-terracotta ml-2">₹749</span>
                </div>
                <Link to="/combos" className="bg-sage hover:bg-sage-dark text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors">
                  Customize Bundle
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link to="/combos" className="inline-flex items-center gap-2 border-2 border-sage text-sage hover:bg-sage hover:text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-300">
              Customize All Combos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section id="why-choose-us" className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sage text-xs font-medium uppercase tracking-widest">Why InbaNaturals</span>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal mt-2 mb-3">Rooted in Nature</h2>
            <LeafDivider />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf size={32} className="text-sage" />,
                title: '100% Natural Ingredients',
                desc: 'Every formula starts with ethically sourced botanicals — no parabens, no sulfates, no synthetic fragrances. Just pure plant goodness.',
              },
              {
                icon: <Shield size={32} className="text-sage" />,
                title: 'Dermatologist Tested',
                desc: 'All our products undergo rigorous testing to ensure they are safe, effective, and gentle for all skin and hair types.',
              },
              {
                icon: <Heart size={32} className="text-sage" />,
                title: 'Made with Love',
                desc: "We never test on animals. Our products are certified cruelty-free and vegan, because beauty should never come at another's expense.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300 border border-ivory-dark"
              >
                <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  {icon}
                </div>
                <h3 className="font-serif text-xl text-charcoal font-semibold mb-3">{title}</h3>
                <p className="text-charcoal-light text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS CAROUSEL ─── */}
      <section id="testimonials-home" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sage text-xs font-medium uppercase tracking-widest">Real Stories</span>
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal mt-2 mb-3">What Our Customers Say</h2>
          <LeafDivider />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-md p-10 border border-ivory-dark text-center min-h-56 flex flex-col items-center justify-center">
            <StarRating rating={testimonials[currentTestimonial].rating} />
            <p className="font-serif text-xl md:text-2xl text-charcoal italic mt-5 mb-6 leading-relaxed">
              "{testimonials[currentTestimonial].quote}"
            </p>
            <div>
              <p className="font-semibold text-charcoal text-sm">{testimonials[currentTestimonial].name}</p>
              <p className="text-charcoal-light text-xs mt-0.5">{testimonials[currentTestimonial].location}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-sage text-sage hover:bg-sage hover:text-white transition-colors flex items-center justify-center"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentTestimonial ? 'bg-sage w-6' : 'bg-sage/30'}`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-sage text-sage hover:bg-sage hover:text-white transition-colors flex items-center justify-center"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/testimonials" className="text-sage text-sm font-medium hover:underline inline-flex items-center gap-1">
            See all reviews <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ─── INSTAGRAM GRID ─── */}
      <section id="instagram-feed" className="py-20 bg-ivory-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-sage text-xs font-medium uppercase tracking-widest">Follow Our Journey</span>
            <h2 className="font-serif text-4xl text-charcoal mt-2 mb-1">@inbanaturals</h2>
            <LeafDivider />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {Array.from({ length: 6 }).map((_, i) => {
              const likes = [142, 98, 245, 112, 87, 310][i];
              const comments = [18, 5, 23, 14, 9, 31][i];
              return (
                <a
                  key={i}
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-ivory border border-ivory-dark shadow-sm hover:shadow-md"
                >
                  <img
                    src={[hairOilImg, hairPackImg, facePackImg, faceSerumImg, hairOilImg, hairPackImg][i]}
                    alt={`Instagram post ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-all duration-300 flex flex-col items-center justify-center gap-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[11px] font-semibold text-white flex items-center gap-2 mt-1">
                      <span>❤️ {likes}</span>
                      <span>💬 {comments}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          <div className="text-center">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-sage text-sage hover:bg-sage hover:text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 text-sm hover:scale-[1.03]"
            >
              Follow us @inbanaturals
            </a>
          </div>
        </div>
      </section>

      {/* ─── FAQ ACCORDION ─── */}
      <section id="faq-home" className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-sage text-xs font-medium uppercase tracking-widest">Common Questions</span>
            <h2 className="font-serif text-4xl text-charcoal mt-2 mb-1">Frequently Asked Questions</h2>
            <LeafDivider />
          </div>
          <FAQAccordion />
          <div className="text-center mt-8">
            <Link to="/faq" className="text-sage text-sm font-medium hover:underline inline-flex items-center gap-1">
              View all FAQs <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section id="newsletter" className="py-16" style={{ background: 'linear-gradient(135deg, #7A9471, #5A7453)' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <span className="text-white/70 text-xs uppercase tracking-widest">Stay in the loop</span>
          <h2 className="font-serif text-3xl md:text-4xl text-white mt-2 mb-3">Join the Glow Community</h2>
          <p className="text-white/70 mb-8 leading-relaxed">
            Get 10% off your first order, exclusive rituals, and botanical beauty tips delivered to your inbox.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white text-sm backdrop-blur-sm"
            />
            <button
              type="submit"
              className="bg-white text-sage font-semibold px-7 py-3.5 rounded-2xl hover:bg-ivory-dark transition-colors duration-200 text-sm whitespace-nowrap"
            >
              Subscribe ✨
            </button>
          </form>
          <p className="text-white/50 text-xs mt-3">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </section>

    </div>
  );
}
