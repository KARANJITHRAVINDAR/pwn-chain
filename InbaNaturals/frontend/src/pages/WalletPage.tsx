import { useState, useEffect } from 'react';
import { useToast } from '../components/ui/Toast';
import api from '../api/client';
import type { Wallet } from '../types';
import LeafDivider from '../components/LeafDivider';
import { Wallet as WalletIcon, Loader2, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Add funds form state
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const fetchWallet = async () => {
    try {
      const res = await api.get('/wallet');
      setWallet(res.data);
    } catch (err) {
      console.error('Failed to fetch wallet:', err);
      showToast('Failed to load wallet data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Please enter a valid amount greater than 0', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/wallet/add-funds', {
        amount: numAmount,
        description: description.trim() || 'Manual deposit',
      });
      setWallet(res.data);
      setAmount('');
      setDescription('');
      showToast('Funds added successfully!', 'success');
    } catch (err) {
      console.error('Failed to add funds:', err);
      showToast('Failed to add funds', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !wallet) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-floral flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-floral">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4 flex items-center justify-center gap-4">
            <WalletIcon size={40} className="text-sage" /> My Wallet
          </h1>
          <LeafDivider />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Balance and Add Funds */}
          <div className="lg:col-span-1 space-y-8">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-sage to-sage-dark rounded-3xl p-8 shadow-md text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              
              <h3 className="text-white/90 text-sm uppercase tracking-wider font-semibold mb-2 relative z-10">Available Balance</h3>
              <div className="text-5xl font-display font-bold relative z-10">
                ₹{wallet?.balance?.toLocaleString('en-IN') || 0}
              </div>
            </div>

            {/* Add Funds Form */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-ivory-dark">
              <h3 className="text-2xl font-display font-bold text-charcoal mb-6">Add Funds</h3>
              <form onSubmit={handleAddFunds} className="space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-charcoal mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full bg-ivory border border-ivory-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
                    placeholder="e.g. 500"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-charcoal mb-1">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-ivory border border-ivory-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
                    placeholder="e.g. Birthday money"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-sage text-white py-3 rounded-xl font-medium hover:bg-sage-dark transition-colors duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus size={20} /> Add Funds
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Transaction History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-ivory-dark h-full">
              <h3 className="text-2xl font-display font-bold text-charcoal mb-6">Transaction History</h3>
              
              {!wallet?.transactions || wallet.transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-ivory rounded-full flex items-center justify-center mx-auto mb-4">
                    <WalletIcon className="text-charcoal-light w-8 h-8" />
                  </div>
                  <p className="text-charcoal-light">No transactions found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-ivory-dark">
                        <th className="py-4 px-4 font-semibold text-charcoal-light uppercase text-xs tracking-wider">Date</th>
                        <th className="py-4 px-4 font-semibold text-charcoal-light uppercase text-xs tracking-wider">Type</th>
                        <th className="py-4 px-4 font-semibold text-charcoal-light uppercase text-xs tracking-wider">Description</th>
                        <th className="py-4 px-4 font-semibold text-charcoal-light uppercase text-xs tracking-wider text-right">Amount</th>
                        <th className="py-4 px-4 font-semibold text-charcoal-light uppercase text-xs tracking-wider text-right">Balance After</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ivory-dark">
                      {wallet.transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-floral/30 transition-colors">
                          <td className="py-4 px-4 whitespace-nowrap text-sm text-charcoal">
                            {tx.created_at ? new Date(tx.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric', month: 'short', day: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            }) : 'N/A'}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                              tx.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {tx.type === 'credit' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                              {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-charcoal-light max-w-[200px] truncate" title={tx.description}>
                            {tx.description}
                          </td>
                          <td className={`py-4 px-4 whitespace-nowrap text-right font-medium ${
                            tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-right font-bold text-charcoal">
                            ₹{tx.balance_after.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
