import { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, DollarSign, MessageSquare, Loader2 } from 'lucide-react';
import api from '../../api/client';

interface DashboardStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  pending_reviews: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: 'Total Users', value: stats.total_users, icon: <Users size={24} className="text-sage" /> },
    { label: 'Total Products', value: stats.total_products, icon: <Package size={24} className="text-sage" /> },
    { label: 'Total Orders', value: stats.total_orders, icon: <ShoppingCart size={24} className="text-sage" /> },
    { label: 'Total Revenue', value: `₹${stats.total_revenue.toLocaleString('en-IN')}`, icon: <DollarSign size={24} className="text-sage" /> },
    { label: 'Pending Reviews', value: stats.pending_reviews, icon: <MessageSquare size={24} className="text-sage" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-charcoal mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-ivory-dark flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center mb-4">
              {card.icon}
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-1">{card.value}</h3>
            <p className="text-sm font-semibold text-charcoal-light uppercase tracking-wider">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
