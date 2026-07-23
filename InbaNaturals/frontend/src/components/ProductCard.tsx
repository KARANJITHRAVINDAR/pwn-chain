import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getWhatsAppProductLink } from '../config';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-ivory-dark flex flex-col">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden">
        <div className="relative overflow-hidden bg-ivory-dark h-64">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.originalPrice && (
            <span className="absolute top-3 left-3 bg-terracotta text-white text-xs font-medium px-2 py-1 rounded-full">
              Sale
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-sage font-medium uppercase tracking-widest mb-1">
          {product.category === 'hair' ? 'Hair Care' : 'Skin Care'}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif text-xl text-charcoal font-semibold leading-tight hover:text-sage transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-charcoal-light text-sm mt-1 mb-4 flex-1 leading-relaxed line-clamp-2">
          {product.tagline}
        </p>

        <div className="flex flex-col gap-3 mt-auto">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-terracotta font-semibold text-lg">{product.price}</span>
              {product.originalPrice && (
                <span className="text-charcoal-light text-sm line-through">{product.originalPrice}</span>
              )}
            </div>
            <Link
              to={`/product/${product.id}`}
              className="text-sage text-sm font-medium hover:underline flex items-center gap-1"
            >
              Details →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, size: product.sizes[0], image: product.image })}
              className="flex items-center justify-center gap-1.5 bg-sage hover:bg-sage-dark text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-all hover:scale-[1.03] duration-200 cursor-pointer"
            >
              <ShoppingBag size={14} />
              Add
            </button>
            <a
              href={getWhatsAppProductLink(product.name, product.sizes[0] || 'Standard')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-all hover:scale-[1.03] duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008 0c3.205.001 6.222 1.246 8.49 3.52 2.27 2.272 3.513 5.293 3.511 8.497-.004 6.657-5.34 11.997-11.95 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.821 1.452 5.51 0 9.995-4.493 9.998-10.011.002-2.673-1.04-5.186-2.93-7.079-1.89-1.89-4.407-2.93-7.08-2.931-5.514 0-10.002 4.493-10.005 10.013-.001 1.737.479 3.427 1.39 4.908L1.008 22.91l4.088-1.072L6.647 19.15z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

