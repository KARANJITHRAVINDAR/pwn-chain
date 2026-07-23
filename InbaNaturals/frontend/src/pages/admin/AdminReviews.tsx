import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../components/ui/Toast';
import StarRating from '../../components/StarRating';

interface AdminReview {
  id: number;
  product_id: number;
  user_id: number;
  username: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const { showToast } = useToast();

  const fetchReviews = async () => {
    try {
      const params: Record<string, boolean> = {};
      if (filter === 'pending') params.approved = false;
      if (filter === 'approved') params.approved = true;
      
      const res = await api.get('/admin/reviews', { params });
      setReviews(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchReviews();
  }, [filter]);

  const toggleApproval = async (id: number, currentStatus: boolean) => {
    try {
      await api.put(`/admin/reviews/${id}/approve`, null, { 
        params: { is_approved: !currentStatus } 
      });
      showToast(`Review ${!currentStatus ? 'approved' : 'unapproved'}`, 'success');
      fetchReviews();
    } catch (err) {
      console.error(err);
      showToast('Failed to update review status', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this review permanently?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      showToast('Review deleted', 'success');
      fetchReviews();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete review', 'error');
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal">Reviews</h1>
        
        <div className="flex gap-2">
          {['all', 'pending', 'approved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
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
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider">Product ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider text-center">Rating</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider w-1/3">Comment</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-dark">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-charcoal-light">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-floral/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-charcoal">{review.username}</p>
                      <p className="text-xs text-charcoal-light">
                        {review.created_at ? new Date(review.created_at).toLocaleDateString('en-IN') : 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-charcoal">{review.product_id}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <StarRating rating={review.rating} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-charcoal leading-relaxed line-clamp-2" title={review.comment}>
                        {review.comment}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {review.is_approved ? (
                        <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase tracking-wider">Approved</span>
                      ) : (
                        <span className="inline-flex px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase tracking-wider">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleApproval(review.id, review.is_approved)}
                          className={`p-2 rounded-lg transition-colors ${
                            review.is_approved 
                              ? 'text-amber-500 hover:bg-amber-100' 
                              : 'text-green-600 hover:bg-green-100'
                          }`}
                          title={review.is_approved ? "Unapprove" : "Approve"}
                        >
                          {review.is_approved ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
