import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../components/ui/Toast';
import type { Product } from '../../types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'hair',
    tagline: '',
    description: '',
    ingredients: '',
    how_to_use: '',
    price: '',
    original_price: '',
    sizes: 'Standard',
    image_url: '',
    in_stock: true,
    stock_quantity: '100',
    is_featured: false,
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products', { params: { page_size: 100 } });
      setProducts(res.data.items || res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        slug: product.slug,
        category: product.category,
        tagline: product.tagline,
        description: product.description,
        ingredients: product.ingredients,
        how_to_use: product.how_to_use,
        price: product.price.toString(),
        original_price: product.original_price?.toString() || '',
        sizes: (() => {
          try {
            return JSON.parse(product.sizes || '[]').join(', ');
          } catch {
            return product.sizes || '';
          }
        })(),
        image_url: product.image_url,
        in_stock: product.in_stock,
        stock_quantity: product.stock_quantity.toString(),
        is_featured: product.is_featured,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        slug: '',
        category: 'hair',
        tagline: '',
        description: '',
        ingredients: '',
        how_to_use: '',
        price: '',
        original_price: '',
        sizes: 'Standard',
        image_url: '',
        in_stock: true,
        stock_quantity: '100',
        is_featured: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, name, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        ...formData,
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : null,
        stock_quantity: Number(formData.stock_quantity),
        sizes: JSON.stringify(sizesArray),
      };

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, payload);
        showToast('Product updated successfully', 'success');
      } else {
        await api.post('/admin/products', payload);
        showToast('Product created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.detail || 'Failed to save product', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      showToast('Product deleted', 'success');
      fetchProducts();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete product', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal">Products</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-sage hover:bg-sage-dark text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 transition-colors text-sm"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-ivory-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-ivory/50 border-b border-ivory-dark">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider text-right">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider text-center">Stock</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider text-center">Featured</th>
                <th className="px-6 py-4 text-xs font-semibold text-charcoal-light uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-dark">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-floral/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-ivory-dark" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-ivory flex items-center justify-center text-charcoal-light border border-ivory-dark">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-charcoal">{product.name}</p>
                        <p className="text-xs text-charcoal-light">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-charcoal capitalize">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-charcoal text-right">₹{product.price}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                      product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {product.is_featured ? (
                      <span className="inline-flex px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase tracking-wider">Yes</span>
                    ) : (
                      <span className="text-charcoal-light text-sm">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-sage hover:bg-sage/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
            <div className="p-6 border-b border-ivory-dark flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold text-charcoal">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-charcoal-light hover:text-charcoal p-1">
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="product-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Name</label>
                    <input type="text" required value={formData.name} onChange={handleNameChange} className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory text-sm focus:outline-none focus:border-sage" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Slug</label>
                    <input type="text" required value={formData.slug} onChange={(e) => setFormData(prev => ({...prev, slug: e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory text-sm focus:outline-none focus:border-sage" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Price (₹)</label>
                    <input type="number" required value={formData.price} onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory text-sm focus:outline-none focus:border-sage" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Orig. Price (₹)</label>
                    <input type="number" value={formData.original_price} onChange={(e) => setFormData(prev => ({...prev, original_price: e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory text-sm focus:outline-none focus:border-sage" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Category</label>
                    <select required value={formData.category} onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory text-sm focus:outline-none focus:border-sage">
                      <option value="hair">Hair Care</option>
                      <option value="face">Face Care</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Image URL</label>
                  <input type="text" value={formData.image_url} onChange={(e) => setFormData(prev => ({...prev, image_url: e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory text-sm focus:outline-none focus:border-sage" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Sizes (comma-separated)</label>
                  <input type="text" value={formData.sizes} onChange={(e) => setFormData(prev => ({...prev, sizes: e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory text-sm focus:outline-none focus:border-sage" placeholder="e.g. 50ml, 100ml, 200ml" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Tagline</label>
                  <input type="text" required value={formData.tagline} onChange={(e) => setFormData(prev => ({...prev, tagline: e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory text-sm focus:outline-none focus:border-sage" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea required rows={3} value={formData.description} onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory text-sm focus:outline-none focus:border-sage resize-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">Ingredients</label>
                    <textarea required rows={3} value={formData.ingredients} onChange={(e) => setFormData(prev => ({...prev, ingredients: e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory text-sm focus:outline-none focus:border-sage resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">How to Use</label>
                    <textarea required rows={3} value={formData.how_to_use} onChange={(e) => setFormData(prev => ({...prev, how_to_use: e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory text-sm focus:outline-none focus:border-sage resize-none" />
                  </div>
                </div>

                <div className="flex items-center gap-6 bg-floral p-4 rounded-xl border border-ivory-dark">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.in_stock} onChange={(e) => setFormData(prev => ({...prev, in_stock: e.target.checked}))} className="w-4 h-4 text-sage accent-sage rounded border-gray-300" />
                    <span className="text-sm font-semibold text-charcoal">In Stock</span>
                  </label>
                  
                  <div className="flex items-center gap-3 border-l border-ivory-dark pl-6">
                    <label className="text-xs font-semibold text-charcoal uppercase tracking-wider">Stock Qty:</label>
                    <input type="number" required value={formData.stock_quantity} onChange={(e) => setFormData(prev => ({...prev, stock_quantity: e.target.value}))} className="w-24 px-3 py-1.5 rounded-lg border border-ivory-dark bg-white text-sm focus:outline-none focus:border-sage" />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer border-l border-ivory-dark pl-6">
                    <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData(prev => ({...prev, is_featured: e.target.checked}))} className="w-4 h-4 text-sage accent-sage rounded border-gray-300" />
                    <span className="text-sm font-semibold text-charcoal">Featured Product</span>
                  </label>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-ivory-dark bg-floral/50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-medium text-charcoal-light hover:bg-ivory-dark transition-colors text-sm">
                Cancel
              </button>
              <button type="submit" form="product-form" className="px-6 py-2.5 rounded-xl font-semibold bg-sage hover:bg-sage-dark text-white transition-colors text-sm">
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
