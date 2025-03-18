
import { User, Product, Category, Stats } from '../types';

// Mock data for demo
const MOCK_USERS: User[] = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' },
  { id: 2, username: 'user1', email: 'user1@example.com', role: 'user' },
  { id: 3, username: 'user2', email: 'user2@example.com', role: 'user' },
];

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Electronics', description: 'Electronic devices and accessories', productsCount: 12, createdAt: '2023-01-15T10:00:00Z' },
  { id: 2, name: 'Clothing', description: 'Apparel and fashion items', productsCount: 24, createdAt: '2023-01-20T14:30:00Z' },
  { id: 3, name: 'Books', description: 'Books, e-books and publications', productsCount: 18, createdAt: '2023-02-05T09:15:00Z' },
  { id: 4, name: 'Home & Garden', description: 'Home decoration and garden tools', productsCount: 15, createdAt: '2023-02-10T11:45:00Z' },
];

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Smartphone XS', description: 'Latest model with advanced features', price: 699.99, stock: 25, category: MOCK_CATEGORIES[0], image: '/placeholder.svg', createdAt: '2023-03-01T08:00:00Z', updatedAt: '2023-03-10T15:30:00Z' },
  { id: 2, name: 'Laptop Pro', description: 'Powerful laptop for professionals', price: 1299.99, stock: 10, category: MOCK_CATEGORIES[0], image: '/placeholder.svg', createdAt: '2023-03-02T09:30:00Z', updatedAt: '2023-03-12T11:00:00Z' },
  { id: 3, name: 'Wireless Headphones', description: 'High-quality sound experience', price: 199.99, stock: 30, category: MOCK_CATEGORIES[0], image: '/placeholder.svg', createdAt: '2023-03-03T14:45:00Z', updatedAt: '2023-03-15T10:15:00Z' },
  { id: 4, name: 'Casual T-shirt', description: 'Comfortable cotton t-shirt', price: 24.99, stock: 50, category: MOCK_CATEGORIES[1], image: '/placeholder.svg', createdAt: '2023-03-05T10:00:00Z', updatedAt: '2023-03-18T16:45:00Z' },
  { id: 5, name: 'Designer Jeans', description: 'Premium denim jeans', price: 89.99, stock: 20, category: MOCK_CATEGORIES[1], image: '/placeholder.svg', createdAt: '2023-03-07T11:30:00Z', updatedAt: '2023-03-20T09:00:00Z' },
  { id: 6, name: 'Science Fiction Novel', description: 'Bestselling sci-fi book', price: 19.99, stock: 40, category: MOCK_CATEGORIES[2], image: '/placeholder.svg', createdAt: '2023-03-08T13:15:00Z', updatedAt: '2023-03-22T14:30:00Z' },
  { id: 7, name: 'Gardening Tool Set', description: 'Complete set for home gardening', price: 49.99, stock: 15, category: MOCK_CATEGORIES[3], image: '/placeholder.svg', createdAt: '2023-03-10T15:45:00Z', updatedAt: '2023-03-25T11:15:00Z' },
  { id: 8, name: 'Smart Watch', description: 'Fitness tracking and notifications', price: 149.99, stock: 5, category: MOCK_CATEGORIES[0], image: '/placeholder.svg', createdAt: '2023-03-12T16:00:00Z', updatedAt: '2023-03-28T13:00:00Z' },
];

const MOCK_STATS: Stats = {
  totalProducts: MOCK_PRODUCTS.length,
  totalCategories: MOCK_CATEGORIES.length,
  totalUsers: MOCK_USERS.length,
  lowStockItems: MOCK_PRODUCTS.filter(p => p.stock <= 10).length,
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication functions
export const loginApi = async (username: string, password: string) => {
  await delay(800); // Simulate network request
  
  // Simple validation for demo purposes
  if (username === 'admin' && password === 'password123') {
    const user = MOCK_USERS.find(u => u.username === username);
    return {
      user,
      token: 'mock-jwt-token',
    };
  }
  
  throw new Error('Invalid credentials');
};

export const logoutApi = async () => {
  await delay(300);
  return { success: true };
};

// Data fetching functions
export const fetchStats = async () => {
  await delay(500);
  return MOCK_STATS;
};

export const fetchProducts = async () => {
  await delay(600);
  return MOCK_PRODUCTS;
};

export const fetchCategories = async () => {
  await delay(400);
  return MOCK_CATEGORIES;
};

export const fetchUsers = async () => {
  await delay(500);
  return MOCK_USERS;
};

export const fetchProductById = async (id: number) => {
  await delay(300);
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  if (!product) throw new Error('Product not found');
  return product;
};

export const fetchCategoryById = async (id: number) => {
  await delay(300);
  const category = MOCK_CATEGORIES.find(c => c.id === id);
  if (!category) throw new Error('Category not found');
  return category;
};

// Data mutation functions (these would connect to an API in a real app)
export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  await delay(800);
  const newProduct: Product = {
    ...product,
    id: Math.max(...MOCK_PRODUCTS.map(p => p.id)) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  MOCK_PRODUCTS.push(newProduct);
  return newProduct;
};

export const updateProduct = async (id: number, updates: Partial<Product>) => {
  await delay(800);
  const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Product not found');
  
  MOCK_PRODUCTS[index] = {
    ...MOCK_PRODUCTS[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return MOCK_PRODUCTS[index];
};

export const deleteProduct = async (id: number) => {
  await delay(600);
  const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Product not found');
  
  MOCK_PRODUCTS.splice(index, 1);
  return { success: true };
};

export const createCategory = async (category: Omit<Category, 'id' | 'createdAt' | 'productsCount'>) => {
  await delay(700);
  const newCategory: Category = {
    ...category,
    id: Math.max(...MOCK_CATEGORIES.map(c => c.id)) + 1,
    createdAt: new Date().toISOString(),
    productsCount: 0,
  };
  MOCK_CATEGORIES.push(newCategory);
  return newCategory;
};

export const updateCategory = async (id: number, updates: Partial<Category>) => {
  await delay(700);
  const index = MOCK_CATEGORIES.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Category not found');
  
  MOCK_CATEGORIES[index] = {
    ...MOCK_CATEGORIES[index],
    ...updates,
  };
  
  return MOCK_CATEGORIES[index];
};

export const deleteCategory = async (id: number) => {
  await delay(500);
  const index = MOCK_CATEGORIES.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Category not found');
  
  // In a real app, we'd check if the category has products first
  MOCK_CATEGORIES.splice(index, 1);
  return { success: true };
};
