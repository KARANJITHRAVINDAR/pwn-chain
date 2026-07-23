import { useState } from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';
import LeafDivider from '../components/LeafDivider';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

type FilterCategory = 'all' | 'hair' | 'face';
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name';

export default function ShopPage() {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [sort, setSort] = useState<SortOption>('default');
  const [search, setSearch] = useState('');

  const filtered = products
    .filter((p) => {
      const matchCat = filter === 'all' || p.category === filter;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'price-asc') return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''));
      if (sort === 'price-desc') return parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, ''));
      return 0;
    });

  return (
    <div className="min-h-screen">

      {/* Page header */}
      <div className="bg-ivory-dark py-14 text-center border-b border-ivory-dark">
        <span className="text-sage text-xs font-medium uppercase tracking-widest">Everything Natural</span>
        <h1 className="font-serif text-5xl text-charcoal mt-2 mb-3">Shop All Products</h1>
        <LeafDivider />
        <p className="text-charcoal-light mt-4 max-w-md mx-auto text-sm leading-relaxed">
          Handcrafted botanical beauty for your hair and skin — free from harmful chemicals, full of plant love.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Filter / Sort bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-ivory-dark p-4 mb-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-ivory-dark text-sm focus:outline-none focus:border-sage transition-colors bg-ivory text-charcoal placeholder-charcoal-light"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'hair', 'face'] as FilterCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                  filter === cat
                    ? 'bg-sage text-white shadow-sm'
                    : 'bg-ivory text-charcoal-light hover:bg-ivory-dark border border-ivory-dark'
                }`}
              >
                {cat === 'all' ? 'All' : cat === 'hair' ? 'Hair Care' : 'Skin Care'}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-charcoal-light shrink-0" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="bg-ivory border border-ivory-dark text-sm text-charcoal rounded-xl px-3 py-2.5 focus:outline-none focus:border-sage cursor-pointer"
            >
              <option value="default">Sort: Default</option>
              <option value="name">Name: A–Z</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-charcoal-light text-sm mb-6">
          Showing <span className="font-medium text-charcoal">{filtered.length}</span> product{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-charcoal-light">
            <p className="font-serif text-2xl mb-2">No products found</p>
            <p className="text-sm">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
