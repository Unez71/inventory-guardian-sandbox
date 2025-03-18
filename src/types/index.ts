
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
  location?: string;
  unit?: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  description: string;
  location: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  inStock: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  productsCount: number;
  createdAt: string;
}

export interface Purchase {
  id: number;
  invoiceNumber: string;
  date: string;
  vendorId: number;
  location: string;
  totalAmount: number;
  items: PurchaseItem[];
}

export interface PurchaseItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: number;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  location: string;
  totalAmount: number;
  items: SaleItem[];
}

export interface SaleItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Transfer {
  id: number;
  productName: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  date: string;
  status: 'completed' | 'pending';
}

export interface Vendor {
  id: number;
  name: string;
  location: string;
  phone: string;
  email: string;
}

export interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  lowStockItems: number;
  totalSales: number;
  totalPurchases: number;
  totalInventory: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
}
