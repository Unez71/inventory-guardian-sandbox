
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface Product {
  id: string;
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
  id: string;
  name: string;
  description: string;
  location: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productsCount: number;
  createdAt: string;
}

export interface Purchase {
  id: string;
  invoiceNumber: string;
  date: string;
  vendorId: string;
  location: string;
  totalAmount: number;
  items: PurchaseItem[];
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
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
  id: string;
  productName: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  date: string;
  status: 'completed' | 'pending';
}

export interface Vendor {
  id: string;
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
