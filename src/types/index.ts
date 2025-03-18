
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  productsCount: number;
  createdAt: string;
}

export interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  lowStockItems: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
}
