import { useState, useEffect } from 'react';
import { Loader2, Search, Shield, ShieldOff } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../components/ui/Toast';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  wallet_balance: number;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (user: AdminUser) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const msg = newRole === 'admin' 
      ? `Are you sure you want to promote ${user.username} to Admin?` 
      : `Are you sure you want to demote ${user.username} to User?`;
      
    if (!window.confirm(msg)) return;

    try {
      await api.put(`/admin/users/${user.id}/role`, null, { params: { role: newRole } });
      showToast(`User role updated to ${newRole}`, 'success');
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast('Failed to update role', 'error');
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal">Users</h1>
        
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-ivory-dark bg-white text-sm focus:outline-none focus:border-sage transition-colors"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-light" />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-ivory-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-ivory/50 border-b border-ivory-dark">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider text-center">Verified</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider text-right">Wallet</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider text-center">Joined</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider text-center">Role / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-dark">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-charcoal-light">
                    No users found matching "{search}".
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-floral/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center font-bold text-sage">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-charcoal">{user.username}</p>
                          <p className="text-xs text-charcoal-light">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal">{user.full_name || '—'}</td>
                    <td className="px-6 py-4 text-center">
                      {user.is_verified ? (
                        <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase tracking-wider">Yes</span>
                      ) : (
                        <span className="inline-flex px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] font-bold uppercase tracking-wider">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-charcoal text-right">
                      ₹{user.wallet_balance.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal text-center">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          user.role === 'admin' ? 'bg-sage text-white' : 'bg-ivory-dark text-charcoal-light'
                        }`}>
                          {user.role}
                        </span>
                        <button
                          onClick={() => toggleRole(user)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.role === 'admin' 
                              ? 'text-terracotta hover:bg-terracotta/10' 
                              : 'text-sage hover:bg-sage/10'
                          }`}
                          title={user.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                        >
                          {user.role === 'admin' ? <ShieldOff size={16} /> : <Shield size={16} />}
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
