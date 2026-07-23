import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

export interface CartItemDisplay {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  image: string;
  size_index: number;
  size_label: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItemDisplay[];
  addToCart: (item: Omit<CartItemDisplay, 'id'>) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItemDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/cart');
      const items = res.data.items.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        name: item.product_name,
        slug: item.product_slug,
        price: item.product_price,
        original_price: item.product_original_price,
        image: item.product_image,
        size_index: item.size,
        size_label: item.size_label,
        quantity: item.quantity,
      }));
      setCart(items);
    } catch (err) {
      console.error('Failed to refresh cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      // We could optionally clear local cart here, but let's keep it to allow guest usage
      // We will keep local cart if it exists, otherwise it will be empty
    }
  }, [user]);

  const addToCart = async (newItem: Omit<CartItemDisplay, 'id'>) => {
    if (user) {
      setLoading(true);
      try {
        await api.post('/cart', {
          product_id: newItem.product_id,
          size: newItem.size_index,
          quantity: newItem.quantity,
        });
        await refreshCart();
      } catch (err) {
        console.error('Failed to add to cart', err);
      } finally {
        setLoading(false);
      }
    } else {
      setCart((prev) => {
        const existing = prev.find(
          (item) => item.product_id === newItem.product_id && item.size_index === newItem.size_index
        );
        if (existing) {
          return prev.map((item) =>
            item.product_id === newItem.product_id && item.size_index === newItem.size_index
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        }
        return [...prev, { ...newItem, id: Date.now() + Math.random() }];
      });
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (user) {
      setLoading(true);
      try {
        await api.put(`/cart/${itemId}`, { quantity });
        await refreshCart();
      } catch (err) {
        console.error('Failed to update quantity', err);
      } finally {
        setLoading(false);
      }
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (user) {
      setLoading(true);
      try {
        await api.delete(`/cart/${itemId}`);
        await refreshCart();
      } catch (err) {
        console.error('Failed to remove from cart', err);
      } finally {
        setLoading(false);
      }
    } else {
      setCart((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  const clearCart = async () => {
    if (user) {
      setLoading(true);
      try {
        for (const item of cart) {
          await api.delete(`/cart/${item.id}`);
        }
        setCart([]);
      } catch (err) {
        console.error('Failed to clear cart', err);
      } finally {
        setLoading(false);
      }
    } else {
      setCart([]);
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        cartCount,
        cartTotal,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
