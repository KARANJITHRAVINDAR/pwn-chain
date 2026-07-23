import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Loader2, ArrowLeft, CheckCircle2, XCircle, Clock, MapPin, Package, Phone, User as UserIcon } from 'lucide-react';
import type { Order } from '../types';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id, navigate]);

  if (loading || !order) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-floral flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    );
  }

  // Parse items from JSON string if needed
  let items = [];
  try {
    items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  } catch (e) {
    console.error('Failed to parse order items', e);
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sage/20 text-sage-dark font-semibold text-sm border border-sage/30">
            <CheckCircle2 size={16} /> Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-terracotta/20 text-terracotta font-semibold text-sm border border-terracotta/30">
            <XCircle size={16} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm border border-amber-200">
            <Clock size={16} /> {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-floral">
      <div className="container-custom max-w-5xl mx-auto">
        <Link to="/orders" className="inline-flex items-center gap-2 text-charcoal-light hover:text-sage transition-colors mb-8 font-medium">
          <ArrowLeft size={20} /> Back to My Orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-ivory-dark mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-sage/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <p className="text-charcoal-light font-medium mb-1 flex items-center gap-2">
              <Package size={16} /> Order Details
            </p>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
              Order #{order.order_number}
            </h1>
            <p className="text-charcoal-light flex items-center gap-2">
              <Clock size={16} /> Placed on {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              }) : 'N/A'}
            </p>
          </div>
          
          <div className="relative z-10 text-left md:text-right">
            <div className="mb-2">
              {getStatusBadge(order.status)}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content: Items List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-ivory-dark">
              <h3 className="text-2xl font-display font-bold text-charcoal mb-6">Order Items</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-ivory-dark text-sm font-semibold text-charcoal-light uppercase tracking-wider">
                      <th className="pb-4 pr-4">Product</th>
                      <th className="pb-4 px-4">Size</th>
                      <th className="pb-4 px-4 text-center">Qty</th>
                      <th className="pb-4 px-4 text-right">Price</th>
                      <th className="pb-4 pl-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-dark">
                    {items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-4">
                            {item.image && (
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-ivory-dark shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <span className="font-bold text-charcoal text-sm">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-charcoal-light">{item.size_label || 'Standard'}</td>
                        <td className="py-4 px-4 text-sm text-charcoal text-center">{item.quantity}</td>
                        <td className="py-4 px-4 text-sm text-charcoal text-right font-medium">₹{Number(item.price).toLocaleString('en-IN')}</td>
                        <td className="py-4 pl-4 text-sm font-bold text-charcoal text-right">
                          ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Shipping & Totals */}
          <div className="lg:col-span-1 space-y-8">
            {/* Totals */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-ivory-dark">
              <h3 className="text-2xl font-display font-bold text-charcoal mb-6">Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-charcoal-light">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sage">
                    <span>Discount</span>
                    <span className="font-medium">-₹{order.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal-light">
                  <span>Shipping</span>
                  <span className="text-sage font-medium">Free</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-ivory-dark flex justify-between items-center">
                <span className="text-lg font-bold text-charcoal">Total</span>
                <span className="text-3xl font-display font-bold text-sage">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-ivory-dark">
              <h3 className="text-xl font-display font-bold text-charcoal mb-6">Shipping Address</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <UserIcon size={18} className="text-sage mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-1">Name</p>
                    <p className="font-medium text-charcoal break-words">{order.shipping_name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-sage mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-charcoal break-words">{order.shipping_phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-sage mt-0.5 shrink-0" />
                  <div className="w-full min-w-0">
                    <p className="text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-1">Address</p>
                    <p className="text-charcoal whitespace-pre-wrap leading-relaxed break-words">{order.shipping_address}</p>
                  </div>
                </div>
                
                {order.notes && (
                  <div className="pt-4 border-t border-ivory-dark mt-4">
                    <p className="text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-2">Order Notes</p>
                    <p className="text-sm text-charcoal italic bg-floral p-3 rounded-lg border border-ivory-dark">
                      "{order.notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
