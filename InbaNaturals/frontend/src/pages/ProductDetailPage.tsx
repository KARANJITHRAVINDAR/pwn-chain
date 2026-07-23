import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ShoppingBag, Zap, ChevronLeft, ArrowRight } from 'lucide-react';
import LeafDivider from '../components/LeafDivider';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { getWhatsAppProductLink } from '../config';

type Tab = 'description' | 'howToUse' | 'ingredients';

interface ReviewItem {
  name: string;
  rating: number;
  date: string;
  comment: string;
}

const defaultReviews: Record<string, ReviewItem[]> = {
  'hair-oil': [
    { name: 'Kavya M.', rating: 5, date: 'June 2025', comment: 'Absolutely love this product! Noticed a difference within the first week. Will definitely repurchase.' },
    { name: 'Sneha R.', rating: 5, date: 'May 2025', comment: 'The texture is amazing and the scent is so pleasant. Very gentle and effective.' },
    { name: 'Divya P.', rating: 4, date: 'April 2025', comment: 'Great quality product. Shipping was fast and packaging was beautiful. Highly recommend InbaNaturals!' },
  ],
  'hair-pack': [
    { name: 'Aruna S.', rating: 5, date: 'June 2025', comment: 'Made my curls so soft and bouncy. Smells fantastic and easy to wash off.' },
    { name: 'Meera G.', rating: 4, date: 'May 2025', comment: 'Very deep conditioning pack. Helps smooth my frizz a lot. Excellent natural quality.' },
  ],
  'face-pack': [
    { name: 'Sonal T.', rating: 5, date: 'May 2025', comment: 'Glowing skin instantly. It gives a gentle tightening effect without drying my skin.' },
    { name: 'Kirti J.', rating: 5, date: 'April 2025', comment: 'Pure clay experience. Feels like a premium spa mask. Repurchasing immediately!' },
  ],
  'face-serum': [
    { name: 'Rahul V.', rating: 5, date: 'June 2025', comment: 'Remarkable brightness after 2 weeks. Lightweight serum, non sticky.' },
    { name: 'Pooja K.', rating: 5, date: 'May 2025', comment: 'The hydration holds all day. Fits perfectly into my skincare routing!' },
  ],
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const { addToCart } = useCart();

  // Initialize review list based on current product id
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(() => {
    return defaultReviews[id || ''] || defaultReviews['hair-oil'];
  });

  // Review Form State
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  if (!product) return <Navigate to="/shop" replace />;

  const relatedProducts = products.filter((p) => p.id !== id).slice(0, 3);

  // Recalculate average rating dynamically
  const reviewsCount = reviewsList.length;
  const averageRating = (
    reviewsList.reduce((acc, r) => acc + r.rating, 0) / (reviewsCount || 1)
  ).toFixed(1);

  // Placeholder thumbnails (same color, different text)
  const thumbnails = [
    product.image,
    product.image.replace('?text=', '?text=View+2+'),
    product.image.replace('?text=', '?text=View+3+'),
    product.image.replace('?text=', '?text=View+4+'),
  ];

  const tabContent: Record<Tab, string> = {
    description: product.description,
    howToUse: product.howToUse,
    ingredients: product.ingredients,
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes[selectedSize],
      image: product.image,
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    const newReview: ReviewItem = {
      name: reviewerName,
      rating: reviewerRating,
      date: 'Today',
      comment: reviewerComment,
    };

    setReviewsList((prev) => [newReview, ...prev]);
    setReviewerName('');
    setReviewerRating(5);
    setReviewerComment('');
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <nav className="flex items-center gap-2 text-xs text-charcoal-light">
          <Link to="/" className="hover:text-sage transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-sage transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-charcoal font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* ─── Image gallery ─── */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="w-full aspect-square rounded-2xl overflow-hidden border border-ivory-dark bg-ivory shadow-sm">
              <img
                src={thumbnails[selectedImage]}
                alt={`${product.name} view ${selectedImage + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {thumbnails.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === i ? 'border-sage shadow-sm' : 'border-ivory-dark hover:border-sage-light'
                  }`}
                >
                  <img src={src} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ─── Product info ─── */}
          <div className="space-y-5">
            {/* Back link */}
            <Link to="/shop" className="inline-flex items-center gap-1 text-sage text-sm hover:gap-2 transition-all">
              <ChevronLeft size={16} /> Back to Shop
            </Link>

            <div>
              <span className="text-sage text-xs font-medium uppercase tracking-widest">
                {product.category === 'hair' ? 'Hair Care' : 'Skin Care'}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl text-charcoal font-semibold mt-1 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Dynamic average rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={Math.round(parseFloat(averageRating))} />
              <span className="text-sm font-semibold text-charcoal">{averageRating}</span>
              <span className="text-sm text-charcoal-light">({reviewsCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-terracotta">{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-charcoal-light text-lg line-through">{product.originalPrice}</span>
                  <span className="text-xs bg-terracotta/10 text-terracotta font-medium px-2 py-0.5 rounded-full">Save {Math.round((1 - parseInt(product.price.replace(/\D/g,'')) / parseInt(product.originalPrice.replace(/\D/g,''))) * 100)}%</span>
                </>
              )}
            </div>

            <p className="text-charcoal-light text-sm leading-relaxed border-l-2 border-sage pl-4 py-1">
              {product.tagline}
            </p>

            {/* Size selector */}
            <div>
              <p className="text-sm font-medium text-charcoal mb-3">
                Size: <span className="text-sage">{product.sizes[selectedSize]}</span>
              </p>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((size, i) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(i)}
                    className={`px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                      selectedSize === i
                        ? 'border-sage bg-sage/10 text-sage'
                        : 'border-ivory-dark text-charcoal-light hover:border-sage-light'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-base cursor-pointer"
                >
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-charcoal hover:bg-charcoal-light text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-base">
                  <Zap size={20} />
                  Buy Now
                </button>
              </div>

              {/* Order via WhatsApp */}
              <a
                href={getWhatsAppProductLink(product.name, product.sizes[selectedSize])}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 bg-terracotta hover:bg-terracotta-dark text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-base animate-pulse shadow-md shadow-terracotta/20 hover:animate-none"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008 0c3.205.001 6.222 1.246 8.49 3.52 2.27 2.272 3.513 5.293 3.511 8.497-.004 6.657-5.34 11.997-11.95 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.821 1.452 5.51 0 9.995-4.493 9.998-10.011.002-2.673-1.04-5.186-2.93-7.079-1.89-1.89-4.407-2.93-7.08-2.931-5.514 0-10.002 4.493-10.005 10.013-.001 1.737.479 3.427 1.39 4.908L1.008 22.91l4.088-1.072L6.647 19.15z"/></svg>
                Order via WhatsApp
              </a>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-3">
              {[
                { emoji: '🌿', label: '100% Natural' },
                { emoji: '🚚', label: 'Free Shipping' },
                { emoji: '↩️', label: 'Easy Returns' },
              ].map(({ emoji, label }) => (
                <div key={label} className="bg-ivory rounded-xl p-3 text-center border border-ivory-dark">
                  <div className="text-xl mb-1">{emoji}</div>
                  <p className="text-xs font-medium text-charcoal">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div className="mt-14">
          <div className="flex gap-1 border-b border-ivory-dark mb-6 overflow-x-auto">
            {(['description', 'howToUse', 'ingredients'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 -mb-px ${
                  activeTab === tab
                    ? 'border-sage text-sage'
                    : 'border-transparent text-charcoal-light hover:text-charcoal'
                }`}
              >
                {tab === 'description' ? 'Description' : tab === 'howToUse' ? 'How to Use' : 'Ingredients'}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-ivory-dark max-w-3xl">
            <p className="text-charcoal-light text-sm leading-relaxed">{tabContent[activeTab]}</p>
          </div>
        </div>

        {/* ─── Reviews & Write a Review layout ─── */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-8 border-b border-ivory-dark pb-4">
            <h2 className="font-serif text-3xl text-charcoal">Customer Reviews</h2>
            <div className="flex items-center gap-2 bg-ivory-dark px-4 py-2 rounded-xl border border-ivory-dark">
              <StarRating rating={Math.round(parseFloat(averageRating))} />
              <span className="text-lg font-bold text-charcoal">{averageRating}</span>
              <span className="text-charcoal-light text-sm">/ 5.0</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-5">
              {reviewsList.map((review, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-ivory-dark animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-sage/20 flex items-center justify-center font-serif font-bold text-sage">
                        {review.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-charcoal text-sm">{review.name}</p>
                        <p className="text-charcoal-light text-xs">{review.date}</p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-charcoal-light text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>

            {/* Write a Review Form */}
            <div className="bg-white rounded-3xl p-6 border border-ivory-dark shadow-sm">
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">Write a Review</h3>
              <p className="text-charcoal-light text-xs mb-5">Share your experience with other customers.</p>

              {formSubmitted && (
                <div className="bg-sage/10 text-sage text-sm p-4 rounded-xl border border-sage/20 mb-4 animate-fade-in">
                  ✓ Review submitted successfully!
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label htmlFor="reviewer-name" className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                    Your Name
                  </label>
                  <input
                    id="reviewer-name"
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory text-charcoal text-sm placeholder-charcoal-light focus:outline-none focus:border-sage transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                    Rating
                  </label>
                  <StarRating
                    rating={reviewerRating}
                    interactive
                    onRatingChange={setReviewerRating}
                  />
                </div>

                <div>
                  <label htmlFor="reviewer-comment" className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                    Your Review
                  </label>
                  <textarea
                    id="reviewer-comment"
                    required
                    rows={4}
                    value={reviewerComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    placeholder="What did you think of the product?"
                    className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory text-charcoal text-sm placeholder-charcoal-light focus:outline-none focus:border-sage transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-sage hover:bg-sage-dark text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-sm cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ─── You May Also Like ─── */}
        <div className="mt-14">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl text-charcoal">You May Also Like</h2>
            <LeafDivider />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/shop" className="inline-flex items-center gap-2 text-sage text-sm font-medium hover:underline">
              View all products <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
