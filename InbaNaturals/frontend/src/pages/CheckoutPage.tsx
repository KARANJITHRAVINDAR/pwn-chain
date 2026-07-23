import { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import api from '../api/client';
import LeafDivider from '../components/LeafDivider';
import { Loader2, ArrowRight, ShieldCheck, MapPin, Phone, User as UserIcon } from 'lucide-react';
import type { Wallet } from '../types';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, loading: cartLoading, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    shipping_name: user?.full_name || '',
    shipping_phone: '',
    shipping_address: '',
    notes: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.get('/wallet');
        setWallet(res.data);
      } catch (err) {
        console.error('Failed to fetch wallet:', err);
        showToast('Failed to load wallet balance', 'error');
      } finally {
        setWalletLoading(false);
      }
    };
    fetchWallet();
  }, [showToast]);

  if (cartLoading || walletLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-floral flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    );
  }

  // Redirect if cart is empty
  if (cart.length === 0) {
    return <Navigate to="/shop" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const balance = wallet?.balance || 0;
  const canAfford = balance >= cartTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAfford) {
      showToast('Insufficient wallet balance', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/orders', formData);
      await clearCart(); // Clear local/backend cart
      showToast(`Order placed successfully! Order #${res.data.order_number}`, 'success');
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      console.error('Failed to place order:', err);
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-floral">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">Checkout</h1>
          <LeafDivider />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Shipping & Payment */}
          <div className="flex-1 space-y-8">
            {/* Shipping Details */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-ivory-dark">
              <h3 className="text-2xl font-display font-bold text-charcoal mb-6 flex items-center gap-3">
                <MapPin className="text-sage" /> Shipping Information
              </h3>
              
              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="shipping_name" className="block text-sm font-medium text-charcoal mb-1 flex items-center gap-2">
                      <UserIcon size={16} className="text-charcoal-light" /> Full Name
                    </label>
                    <input
                      type="text"
                      id="shipping_name"
                      name="shipping_name"
                      required
                      value={formData.shipping_name}
                      onChange={handleChange}
                      className="w-full bg-ivory border border-ivory-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="shipping_phone" className="block text-sm font-medium text-charcoal mb-1 flex items-center gap-2">
                      <Phone size={16} className="text-charcoal-light" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      id="shipping_phone"
                      name="shipping_phone"
                      required
                      value={formData.shipping_phone}
                      onChange={handleChange}
                      className="w-full bg-ivory border border-ivory-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="shipping_address" className="block text-sm font-medium text-charcoal mb-1 flex items-center gap-2">
                    <MapPin size={16} className="text-charcoal-light" /> Delivery Address
                  </label>
                  <textarea
                    id="shipping_address"
                    name="shipping_address"
                    required
                    rows={3}
                    value={formData.shipping_address}
                    onChange={handleChange}
                    className="w-full bg-ivory border border-ivory-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all resize-none"
                    placeholder="Enter your complete delivery address"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-charcoal mb-1">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full bg-ivory border border-ivory-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all resize-none"
                    placeholder="Any special instructions for delivery?"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-ivory-dark">
              <h3 className="text-2xl font-display font-bold text-charcoal mb-6 flex items-center gap-3">
                <ShieldCheck className="text-sage" /> Payment Method
              </h3>
              
              <div className={`border-2 rounded-xl p-5 flex items-center justify-between transition-colors ${
                canAfford ? 'border-sage bg-sage/5' : 'border-terracotta bg-terracotta/5'
              }`}>
                <div>
                  <h4 className="font-bold text-charcoal mb-1">Pay with InbaNaturals Wallet</h4>
                  <p className="text-sm text-charcoal-light">
                    Available Balance: <span className="font-bold">₹{balance.toLocaleString('en-IN')}</span>
                  </p>
                </div>
                
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  canAfford ? 'border-sage bg-sage text-white' : 'border-charcoal-light'
                }`}>
                  {canAfford && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                </div>
              </div>

              {!canAfford && (
                <div className="mt-4 p-4 rounded-xl bg-terracotta/10 border border-terracotta/20 text-terracotta flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-sm font-medium">Insufficient balance. Please add funds to your wallet.</span>
                  <Link to="/wallet" className="px-4 py-2 bg-terracotta text-white text-sm font-bold rounded-full hover:bg-terracotta-dark transition-colors whitespace-nowrap">
                    Add Funds
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-96 shrink-0">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-ivory-dark sticky top-24">
              <h3 className="text-2xl font-display font-bold text-charcoal mb-6">Order Summary</h3>
              
              {/* Cart Items Summary */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-ivory-dark shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-charcoal text-sm leading-tight line-clamp-2">{item.name}</h5>
                      <p className="text-xs text-charcoal-light mt-1">Size: {item.size_label}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs font-medium text-charcoal-light">Qty: {item.quantity}</span>
                        <span className="text-sm font-bold text-charcoal">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 py-6 border-t border-ivory-dark mb-6">
                <div className="flex justify-between text-charcoal-light">
                  <span>Subtotal</span>
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
                
                {canAfford && (
                  <div className="pt-2 flex justify-between items-center text-xs text-charcoal-light">
                    <span>Remaining Wallet Balance</span>
                    <span className="font-medium text-charcoal">₹{(balance - cartTotal).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!canAfford || isSubmitting}
                className="w-full bg-sage text-white py-4 rounded-full font-medium hover:bg-sage-dark transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Place Order <ArrowRight size={20} /></>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
