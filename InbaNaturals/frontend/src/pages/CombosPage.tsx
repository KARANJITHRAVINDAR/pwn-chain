import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { getWhatsAppComboLink, WHATSAPP_NUMBER } from '../config';
import api from '../api/client';
import type { ProductListItem } from '../types';
import LeafDivider from '../components/LeafDivider';
import { Check, ShoppingBag, MessageSquare, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComboDefinition {
  id: string;
  name: string;
  tagline: string;
  productIds: string[];
  discountPercent: number; // e.g. 20 for 20%
}

const combos: ComboDefinition[] = [
  {
    id: 'hair-combo',
    name: 'Hair Care Combo',
    tagline: 'Deep nourishment & conditioning for complete hair revival',
    productIds: ['hair-oil', 'hair-pack'],
    discountPercent: 22,
  },
  {
    id: 'glow-combo',
    name: 'Glow Combo',
    tagline: 'Purifying clay mask combined with our youth-boosting Vitamin C serum',
    productIds: ['face-pack', 'face-serum'],
    discountPercent: 21,
  },
];

export default function CombosPage() {
  const { addToCart, cart, cartTotal, cartCount, clearCart } = useCart();
  const [products, setProducts] = useState<ProductListItem[]>([]);

  useEffect(() => {
    api.get('/products', { params: { page_size: 50 } })
      .then(r => setProducts(r.data))
      .catch(console.error);
  }, []);
  
  // State to track which products are active in which combo.
  // By default, all products in each combo are selected.
  const [comboSelections, setComboSelections] = useState<Record<string, string[]>>({
    'hair-combo': ['hair-oil', 'hair-pack'],
    'glow-combo': ['face-pack', 'face-serum'],
  });

  const handleProductToggle = (comboId: string, productId: string) => {
    setComboSelections((prev) => {
      const selected = prev[comboId] || [];
      const updated = selected.includes(productId)
        ? selected.filter((id) => id !== productId)
        : [...selected, productId];
      return { ...prev, [comboId]: updated };
    });
  };

  const calculateComboPrices = (combo: ComboDefinition) => {
    const selectedIds = comboSelections[combo.id] || [];
    let originalTotal = 0;
    
    selectedIds.forEach((id) => {
      const prod = products.find((p) => p.slug === id);
      if (prod) {
        originalTotal += prod.price || 0;
      }
    });

    const isAllSelected = selectedIds.length === combo.productIds.length;
    // Apply discount only if all items in the combo are selected
    const discount = isAllSelected ? combo.discountPercent : 0;
    const finalTotal = Math.round(originalTotal * (1 - discount / 100));

    return {
      originalTotal,
      finalTotal,
      discountApplied: discount,
      savings: originalTotal - finalTotal,
    };
  };

  const handleAddComboToCart = (combo: ComboDefinition) => {
    const selectedIds = comboSelections[combo.id] || [];
    if (selectedIds.length === 0) return;
    
    // Add individual selected items since the backend cart expects actual product IDs
    selectedIds.forEach((id) => {
      const prod = products.find((p) => p.slug === id);
      if (prod) {
        addToCart({
          product_id: prod.id,
          name: prod.name,
          slug: prod.slug,
          price: prod.price,
          original_price: prod.original_price,
          image: prod.image_url,
          size_index: 0,
          size_label: 'Standard',
          quantity: 1,
        });
      }
    });
  };

  const handleOrderComboWhatsApp = (combo: ComboDefinition) => {
    const selectedIds = comboSelections[combo.id] || [];
    if (selectedIds.length === 0) return;
    
    const selectedProductNames = selectedIds.map(
      (id) => products.find((p) => p.slug === id)?.name || id
    );

    const waLink = getWhatsAppComboLink(combo.name, selectedProductNames);
    window.open(waLink, '_blank');
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="bg-ivory-dark py-14 text-center border-b border-ivory-dark">
        <span className="text-sage text-xs font-medium uppercase tracking-widest">Special Offers</span>
        <h1 className="font-serif text-5xl text-charcoal mt-2 mb-3">Combo Offers & Bundles</h1>
        <LeafDivider />
        <p className="text-charcoal-light mt-4 max-w-md mx-auto text-sm leading-relaxed">
          Unlock maximum savings when you purchase our customized product bundles. Customize your combo below!
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        <div className="grid md:grid-cols-2 gap-8">
          {combos.map((combo) => {
            const selectedIds = comboSelections[combo.id] || [];
            const { originalTotal, finalTotal, discountApplied, savings } = calculateComboPrices(combo);

            return (
              <div
                key={combo.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-dark shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:scale-[1.01]"
              >
                <div>
                  {/* Badges & Title */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs bg-sage/10 text-sage font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
                      Bundle Deal
                    </span>
                    {discountApplied > 0 && (
                      <span className="text-xs bg-terracotta text-white font-bold px-3 py-1 rounded-full animate-pulse">
                        Save {discountApplied}%
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-charcoal font-bold mb-2">
                    {combo.name}
                  </h3>
                  <p className="text-charcoal-light text-sm mb-6 leading-relaxed">
                    {combo.tagline}
                  </p>

                  {/* Combined Thumbnails */}
                  <div className="flex gap-3 mb-6 bg-ivory p-4 rounded-2xl border border-ivory-dark">
                    {combo.productIds.map((id) => {
                      const prod = products.find((p) => p.slug === id);
                      const isSelected = selectedIds.includes(id);
                      if (!prod) return null;
                      return (
                        <div
                          key={id}
                          onClick={() => handleProductToggle(combo.id, id)}
                          className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                            isSelected ? 'border-sage scale-105 shadow-sm' : 'border-transparent opacity-40 hover:opacity-60'
                          }`}
                        >
                          <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-sage text-white rounded-full flex items-center justify-center">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Customizer Toggles */}
                  <div className="space-y-3 mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                      Customize Bundle Products:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {combo.productIds.map((id) => {
                        const prod = products.find((p) => p.slug === id);
                        const isSelected = selectedIds.includes(id);
                        if (!prod) return null;
                        return (
                          <button
                            key={id}
                            onClick={() => handleProductToggle(combo.id, id)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-sage text-white'
                                : 'bg-ivory text-charcoal-light border border-ivory-dark hover:bg-ivory-dark'
                            }`}
                          >
                            <span className="text-lg">{isSelected ? '✓' : '+'}</span>
                            {prod.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="mt-8 pt-6 border-t border-ivory-dark space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-xs text-charcoal-light uppercase font-medium tracking-wider">Combo Price</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-bold text-terracotta">₹{finalTotal}</span>
                        {discountApplied > 0 && (
                          <span className="text-charcoal-light text-base line-through">₹{originalTotal}</span>
                        )}
                      </div>
                    </div>
                    {discountApplied > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-sage font-medium">Instant Savings</p>
                        <p className="text-lg font-semibold text-sage">-₹{savings}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleAddComboToCart(combo)}
                      disabled={selectedIds.length === 0}
                      className="w-full flex items-center justify-center gap-1.5 bg-sage hover:bg-sage-dark text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-xs sm:text-sm hover:scale-[1.02] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <ShoppingBag size={16} />
                      Add Bundle
                    </button>
                    <button
                      onClick={() => handleOrderComboWhatsApp(combo)}
                      disabled={selectedIds.length === 0}
                      className="w-full flex items-center justify-center gap-1.5 bg-terracotta hover:bg-terracotta-dark text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-xs sm:text-sm hover:scale-[1.02] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <MessageSquare size={16} />
                      WhatsApp Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Mini Cart / Running Total Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-charcoal text-white border-t border-white/10 px-4 py-4 md:py-5 shadow-2xl transition-all duration-300 transform translate-y-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative bg-white/10 p-2.5 rounded-xl border border-white/20">
              <ShoppingBag size={20} className="text-sage-light" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-terracotta text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-charcoal">
                  {cartCount}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs text-white/50 font-medium">Running Total</p>
              <p className="text-lg md:text-xl font-bold text-white">₹{cartTotal}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartCount > 0 && (
              <button
                onClick={clearCart}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
                title="Clear Cart"
              >
                <Trash2 size={18} />
              </button>
            )}
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/75 hover:text-white mr-2"
            >
              Continue Shopping <ArrowRight size={14} />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hi! I'd like to check out my cart total of ₹${cartTotal}. Items in cart: ${cart
                  .map((item) => `${item.name} (${item.size_label}) x${item.quantity}`)
                  .join(', ')}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white font-bold py-3 px-6 rounded-xl transition-all text-xs md:text-sm hover:scale-[1.03] ${
                cartCount === 0 ? 'opacity-40 pointer-events-none' : ''
              }`}
            >
              Checkout on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
