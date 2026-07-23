import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import LeafDivider from '../components/LeafDivider';
import { Package, Loader2, ArrowRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { OrderListItem } from '../types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-floral flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage/20 text-sage-dark font-semibold text-xs border border-sage/30">
            <CheckCircle2 size={14} /> Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/20 text-terracotta font-semibold text-xs border border-terracotta/30">
            <XCircle size={14} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold text-xs border border-amber-200">
            <Clock size={14} /> {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-floral">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4 flex items-center justify-center gap-4">
            <Package size={40} className="text-sage" /> My Orders
          </h1>
          <LeafDivider />
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-ivory-dark text-center">
            <div className="w-20 h-20 bg-ivory rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-charcoal-light" />
            </div>
            <h3 className="text-2xl font-display font-bold text-charcoal mb-2">No orders yet</h3>
            <p className="text-charcoal-light mb-8 max-w-md mx-auto">
              Looks like you haven't placed any orders with us. Browse our shop to find something beautiful!
            </p>
            <Link
              to="/shop"
              className="bg-sage text-white px-8 py-3 rounded-full font-medium hover:bg-sage-dark transition-colors duration-300 shadow-md inline-flex items-center gap-2"
            >
              Start Shopping <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="group block bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-ivory-dark relative overflow-hidden"
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 p-6 text-charcoal-light opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                  <ArrowRight size={24} />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pr-8">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="font-display font-bold text-xl text-charcoal">
                        Order #{order.order_number}
                      </h4>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-charcoal-light flex items-center gap-2">
                      <Clock size={14} /> Placed on {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                  
                  <div className="md:text-right">
                    <p className="text-sm text-charcoal-light mb-1">Order Total</p>
                    <p className="font-display font-bold text-2xl text-charcoal">
                      ₹{order.total.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
