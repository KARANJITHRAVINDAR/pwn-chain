import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, Loader2 } from 'lucide-react';
import LeafDivider from '../components/LeafDivider';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, updateQuantity, removeFromCart, cartTotal, loading } = useCart();

  if (!user) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-floral flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-display font-bold text-charcoal mb-4">Your Cart</h2>
        <LeafDivider />
        <p className="text-charcoal-light mt-6 mb-8 text-lg">Please login to view and checkout your cart items.</p>
        <Link
          to="/login"
          className="bg-sage text-white px-8 py-3 rounded-full font-medium hover:bg-sage-dark transition-colors duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2"
        >
          Login to Continue <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-floral flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-display font-bold text-charcoal mb-4">Your Cart</h2>
        <LeafDivider />
        <p className="text-charcoal-light mt-6 mb-8 text-lg">Your cart is empty.</p>
        <Link
          to="/shop"
          className="bg-sage text-white px-8 py-3 rounded-full font-medium hover:bg-sage-dark transition-colors duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2"
        >
          Continue Shopping <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-floral">
      <div className="container-custom relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
            <Loader2 className="w-8 h-8 text-sage animate-spin" />
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">Your Cart</h1>
          <LeafDivider />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-ivory-dark overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-ivory-dark text-sm font-semibold text-charcoal-light uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              <div className="divide-y divide-ivory-dark">
                {cart.map((item) => (
                  <div key={item.id} className="py-6 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 relative">
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-ivory shrink-0 border border-ivory-dark">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <Link to={`/product/${item.slug}`} className="font-display font-bold text-lg text-charcoal hover:text-sage transition-colors">
                          {item.name}
                        </Link>
                        <p className="text-sm text-charcoal-light mt-1">Size: {item.size_label}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center font-medium text-charcoal hidden md:block">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <div className="flex items-center bg-ivory rounded-full p-1 border border-ivory-dark">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1 || loading}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-light hover:bg-white hover:text-charcoal transition-colors disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium text-charcoal">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={loading}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-light hover:bg-white hover:text-charcoal transition-colors disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center justify-between md:justify-end gap-4">
                      <span className="font-bold text-charcoal md:text-lg">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to remove this item?')) {
                            removeFromCart(item.id);
                          }
                        }}
                        disabled={loading}
                        className="text-terracotta/70 hover:text-terracotta transition-colors p-2 md:p-0 absolute top-4 right-0 md:relative md:top-auto disabled:opacity-50"
                        title="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:w-96 shrink-0">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-ivory-dark sticky top-24">
              <h3 className="text-2xl font-display font-bold text-charcoal mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-charcoal-light">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-medium text-charcoal">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-charcoal-light">
                  <span>Shipping</span>
                  <span className="text-sage font-medium">Free</span>
                </div>
                <div className="pt-4 border-t border-ivory-dark flex justify-between items-center">
                  <span className="text-lg font-bold text-charcoal">Total</span>
                  <span className="text-2xl font-display font-bold text-sage">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-sage text-white py-4 rounded-full font-medium hover:bg-sage-dark transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
