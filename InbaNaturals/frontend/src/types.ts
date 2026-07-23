export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  wallet_balance: number;
  is_verified: boolean;
  created_at: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  sizes: string;        // JSON array string e.g. '["50ml","100ml"]'
  ingredients: string;
  how_to_use: string;
  image_url: string;
  in_stock: boolean;
  stock_quantity: number;
  is_featured: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  original_price: number | null;
  category: string;
  image_url: string;
  in_stock: boolean;
  is_featured: boolean;
  created_at: string | null;
}

export interface CartItem {
  id: number;
  product_id: number;
  size: number;
  quantity: number;
  product_name: string;
  product_slug: string;
  product_price: number;
  product_original_price: number | null;
  product_image: string;
  product_category: string;
  size_label: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface OrderListItem {
  id: number;
  order_number: string;
  total: number;
  status: string;
  created_at: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  items: string;          // JSON string
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  notes: string;
  created_at: string | null;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  username: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string | null;
}

export interface WalletTransaction {
  id: number;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  balance_after: number;
  created_at: string | null;
}

export interface Wallet {
  balance: number;
  transactions: WalletTransaction[];
}

export interface DashboardStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  pending_reviews: number;
}
