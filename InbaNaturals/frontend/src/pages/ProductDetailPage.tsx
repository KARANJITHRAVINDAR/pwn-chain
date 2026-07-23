import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ShoppingBag, Zap, ChevronLeft, ArrowRight, Loader2 } from 'lucide-react';
import LeafDivider from '../components/LeafDivider';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import api from '../api/client';
import type { Product, ProductListItem, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

// Fallback secondary images since backend doesn't store them yet
import hairOilImg2 from '../assets/images/products/hair-oil-2.jpg';
import hairPackImg2 from '../assets/images/products/hair-pack-2.jpg';
import facePackImg2 from '../assets/images/products/face-pack-2.jpg';
import faceSerumImg2 from '../assets/images/products/face-serum-2.jpg';

const secondaryImages: Record<string, string> = {
  'hair-oil': hairOilImg2,
  'hair-pack': hairPackImg2,
  'face-pack': facePackImg2,
  'face-serum': faceSerumImg2,
};
import { useCart } from '../context/CartContext';
import { getWhatsAppProductLink } from '../config';

type Tab = 'description' | 'howToUse' | 'ingredients';



export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<ProductListItem[]>([]);

  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const { addToCart } = useCart();

  const { user } = useAuth();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Review Form State
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/slug/${id}`)
      .then(r => {
        setProduct(r.data);
        return api.get('/products', { params: { category: r.data.category } });
      })
      .then(r => setRelatedProducts(r.data.filter((p: ProductListItem) => p.slug !== id).slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    setReviewsLoading(true);
    api.get(`/products/${product.id}/reviews`)
      .then(r => setReviews(r.data))
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    );
  }

  if (!product) return <Navigate to="/shop" replace />;

  const parsedSizes = (() => {
    try {
      return JSON.parse(product.sizes || '[]');
    } catch {
      return [];
    }
  })();

  // Recalculate average rating dynamically
  const reviewsCount = reviews.length;
  const averageRating = reviewsCount > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount).toFixed(1)
    : '0.0';

  // Product gallery thumbnails
  const thumbnails = [
    product.image_url,
    secondaryImages[product.slug] || product.image_url,
  ];

  const tabContent: Record<Tab, string> = {
    description: product.description,
    howToUse: product.how_to_use,
    ingredients: product.ingredients,
  };

  const handleAddToCart = () => {
    addToCart({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      original_price: product.original_price,
      image: product.image_url,
      size_index: selectedSize,
      size_label: parsedSizes[selectedSize] || 'Standard',
      quantity: 1,
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.post(`/products/${product!.id}/reviews`, {
        rating: reviewerRating,
        comment: reviewerComment,
      });
      setReviews(prev => [res.data, ...prev]);
      setReviewerRating(5);
      setReviewerComment('');
      showToast('Review submitted! Awaiting approval.', 'success');
    } catch (err: any) {
      if (err.response?.status === 409) {
        showToast('You have already reviewed this product.', 'error');
      } else {
        showToast('Failed to submit review.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
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
              <span className="text-3xl font-semibold text-terracotta">₹{product.price.toLocaleString('en-IN')}</span>
              {product.original_price && (
                <>
                  <span className="text-charcoal-light text-lg line-through">₹{product.original_price.toLocaleString('en-IN')}</span>
                  <span className="text-xs bg-terracotta/10 text-terracotta font-medium px-2 py-0.5 rounded-full">Save {Math.round((1 - product.price / product.original_price) * 100)}%</span>
                </>
              )}
            </div>

            <p className="text-charcoal-light text-sm leading-relaxed border-l-2 border-sage pl-4 py-1">
              {product.tagline}
            </p>

            {/* Size selector */}
            <div>
              <p className="text-sm font-medium text-charcoal mb-3">
                Size: <span className="text-sage">{parsedSizes[selectedSize] || 'Standard'}</span>
              </p>
              <div className="flex gap-3 flex-wrap">
                {parsedSizes.length > 0 ? parsedSizes.map((size: string, i: number) => (
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
                )) : (
                  <button className="px-5 py-2.5 rounded-xl border-2 border-sage bg-sage/10 text-sage text-sm font-medium">Standard</button>
                )}
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
                href={getWhatsAppProductLink(product.name, parsedSizes[selectedSize] || 'Standard')}
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
              {reviewsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-sage animate-spin" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-ivory-dark text-center">
                  <p className="text-charcoal-light">No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-5 shadow-sm border border-ivory-dark animate-fade-in relative">
                    {!review.is_approved && (
                      <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                        Pending Approval
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3 pr-24">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-sage/20 flex items-center justify-center font-serif font-bold text-sage">
                          {review.username ? review.username[0].toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal text-sm">{review.username}</p>
                          <p className="text-charcoal-light text-xs">
                            {review.created_at ? new Date(review.created_at).toLocaleDateString('en-IN') : 'Just now'}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-charcoal-light text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form */}
            <div className="bg-white rounded-3xl p-6 border border-ivory-dark shadow-sm h-fit sticky top-24">
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">Write a Review</h3>
              
              {!user ? (
                <div className="text-center py-8">
                  <p className="text-charcoal-light text-sm mb-4">Please login to write a review.</p>
                  <Link
                    to="/login"
                    className="inline-block bg-sage hover:bg-sage-dark text-white font-semibold py-2 px-6 rounded-full transition-colors duration-200 text-sm"
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-charcoal-light text-xs mb-5">Share your experience with other customers.</p>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
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
                      disabled={isSubmitting}
                      className="w-full bg-sage hover:bg-sage-dark text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Review'}
                    </button>
                  </form>
                </>
              )}
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
