import { createContext, useContext, useState, type ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  size?: string;
  quantity: number;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string, size?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCart((prev) => {
      const quantityToAdd = newItem.quantity ?? 1;
      const existing = prev.find(
        (item) => item.id === newItem.id && item.size === newItem.size
      );
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (id: string, size?: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartTotal = cart.reduce((acc, item) => {
    const numPrice = parseInt(item.price.replace(/\D/g, '')) || 0;
    return acc + numPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
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
