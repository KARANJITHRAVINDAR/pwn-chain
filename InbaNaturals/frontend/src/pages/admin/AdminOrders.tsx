import { useState, useEffect, Fragment } from 'react';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../components/ui/Toast';
import type { Order } from '../../types';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders', {
        params: filter !== 'all' ? { status: filter } : {}
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders();
  }, [filter]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/admin/orders/${id}/status`, null, { params: { status } });
      showToast('Order status updated', 'success');
      fetchOrders();
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'confirmed': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const parseItems = (itemsStr: string) => {
    try {
      return JSON.parse(itemsStr);
    } catch {
      return [];
    }
  };

  const filters = ['all', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (loading && orders.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal">Orders</h1>
        
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === f
                  ? 'bg-sage text-white'
                  : 'bg-white border border-ivory-dark text-charcoal-light hover:border-sage hover:text-sage'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-ivory-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-ivory/50 border-b border-ivory-dark">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider">Order #</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider text-right">Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-dark">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-charcoal-light">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <Fragment key={order.id}>
                    <tr className="hover:bg-floral/30 transition-colors cursor-pointer" onClick={() => toggleExpand(order.id)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sage text-xl">{expandedId === order.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}</span>
                          <span className="font-bold text-charcoal">{order.order_number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-charcoal">{order.shipping_name}</p>
                        <p className="text-xs text-charcoal-light">User ID: {order.user_id}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-charcoal text-right">
                        ₹{order.total.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <select
                          className="px-3 py-1.5 rounded-lg border border-ivory-dark bg-ivory text-xs font-semibold text-charcoal outline-none focus:border-sage transition-colors"
                          value={order.status.toLowerCase()}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                    
                    {expandedId === order.id && (
                      <tr className="bg-ivory/30">
                        <td colSpan={6} className="px-6 py-4 border-b border-ivory-dark">
                          <div className="grid md:grid-cols-2 gap-6 bg-white p-4 rounded-xl border border-ivory-dark shadow-sm">
                            <div>
                              <h4 className="text-xs font-bold text-charcoal-light uppercase tracking-wider mb-3">Order Items</h4>
                              <div className="space-y-2">
                                {parseItems(order.items).map((item: any, i: number) => (
                                  <div key={i} className="flex justify-between text-sm items-center">
                                    <span className="text-charcoal"><span className="font-medium">{item.quantity}x</span> {item.name} ({item.size_label || 'Standard'})</span>
                                    <span className="text-charcoal-light font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-charcoal-light uppercase tracking-wider mb-3">Shipping Details</h4>
                              <p className="text-sm text-charcoal mb-1"><span className="text-charcoal-light">Phone:</span> {order.shipping_phone}</p>
                              <p className="text-sm text-charcoal"><span className="text-charcoal-light">Address:</span> {order.shipping_address}</p>
                              {order.notes && (
                                <div className="mt-3 p-3 bg-floral rounded-lg border border-ivory-dark">
                                  <p className="text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-1">Notes</p>
                                  <p className="text-sm text-charcoal italic">"{order.notes}"</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
