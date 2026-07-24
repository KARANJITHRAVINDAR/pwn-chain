import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-ivory-dark shadow-sm hidden lg:flex flex-col">
      <div className="p-6 border-b border-ivory-dark flex items-center justify-center">
        <h2 className="font-serif text-2xl text-sage">Admin Portal</h2>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                isActive
                  ? 'bg-sage/10 text-sage'
                  : 'text-charcoal-light hover:bg-ivory-dark hover:text-charcoal'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-ivory-dark">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-terracotta hover:bg-red-50 rounded-xl transition-colors font-medium"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
