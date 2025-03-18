
import { User, Product, Category, Stats, InventoryItem, Purchase, Sale, Transfer, Vendor } from '../types';

// Mock data for demo
const MOCK_USERS: User[] = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' },
  { id: 2, username: 'user1', email: 'user1@example.com', role: 'user' },
  { id: 3, username: 'user2', email: 'user2@example.com', role: 'user' },
];

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Glass Partitions', description: 'Partition systems for bathrooms', productsCount: 3, createdAt: '2023-01-15T10:00:00Z' },
  { id: 2, name: 'Accessories', description: 'Bathroom fittings and accessories', productsCount: 1, createdAt: '2023-01-20T14:30:00Z' },
];

const MOCK_INVENTORY: InventoryItem[] = [
  { 
    id: 1, 
    name: 'Frameless Glass Partition', 
    description: '10mm tempered glass with hardware', 
    location: 'bangalore', 
    quantity: 50, 
    unit: 'pieces', 
    unitPrice: 1200, 
    inStock: true 
  },
  { 
    id: 2, 
    name: 'Framed Glass Partition', 
    description: '8mm tempered glass with aluminum frame', 
    location: 'hyderabad', 
    quantity: 25, 
    unit: 'pieces', 
    unitPrice: 900, 
    inStock: true 
  },
  { 
    id: 3, 
    name: 'Glass Hardware Kit', 
    description: 'Complete hardware set for glass partitions', 
    location: 'bangalore', 
    quantity: 0, 
    unit: 'sets', 
    unitPrice: 500, 
    inStock: false 
  },
  { 
    id: 4, 
    name: 'Rubber Gaskets', 
    description: 'Rubber gaskets for glass partitions', 
    location: 'hyderabad', 
    quantity: 0, 
    unit: 'meters', 
    unitPrice: 100, 
    inStock: false 
  },
];

const MOCK_PURCHASES: Purchase[] = [
  {
    id: 1,
    invoiceNumber: 'PUR-001',
    date: '2024-01-15T00:00:00Z',
    vendorId: 1,
    location: 'bangalore',
    totalAmount: 136000,
    items: [
      { productId: 1, productName: 'Frameless Glass Partition', quantity: 100, unitPrice: 800, total: 80000 },
      { productId: 2, productName: 'Framed Glass Partition', quantity: 80, unitPrice: 700, total: 56000 }
    ]
  },
  {
    id: 2,
    invoiceNumber: 'PUR-002',
    date: '2024-01-20T00:00:00Z',
    vendorId: 1,
    location: 'hyderabad',
    totalAmount: 106000,
    items: [
      { productId: 1, productName: 'Frameless Glass Partition', quantity: 80, unitPrice: 800, total: 64000 },
      { productId: 2, productName: 'Framed Glass Partition', quantity: 60, unitPrice: 700, total: 42000 }
    ]
  }
];

const MOCK_SALES: Sale[] = [
  {
    id: 1,
    invoiceNumber: 'INV-001',
    date: '2024-02-05T00:00:00Z',
    customerName: 'John Doe',
    customerPhone: '1234567890',
    location: 'bangalore',
    totalAmount: 58500,
    items: [
      { productName: 'Frameless Glass Partition - 30 pieces @ ₹1200', quantity: 30, unitPrice: 1200 },
      { productName: 'Framed Glass Partition - 25 pieces @ ₹900', quantity: 25, unitPrice: 900 }
    ]
  },
  {
    id: 2,
    invoiceNumber: 'INV-002',
    date: '2024-02-08T00:00:00Z',
    customerName: 'Alice Johnson',
    customerPhone: '5555555555',
    location: 'hyderabad',
    totalAmount: 60000,
    items: [
      { productName: 'Frameless Glass Partition - 35 pieces @ ₹1200', quantity: 35, unitPrice: 1200 },
      { productName: 'Framed Glass Partition - 20 pieces @ ₹900', quantity: 20, unitPrice: 900 }
    ]
  }
];

const MOCK_TRANSFERS: Transfer[] = [
  {
    id: 1,
    productName: 'Frameless Glass Partition',
    quantity: 10,
    fromLocation: 'bangalore',
    toLocation: 'hyderabad',
    date: '2025-03-18T00:00:00Z',
    status: 'completed'
  },
  {
    id: 2,
    productName: 'Framed Glass Partition',
    quantity: 5,
    fromLocation: 'hyderabad',
    toLocation: 'bangalore',
    date: '2025-03-18T00:00:00Z',
    status: 'pending'
  }
];

const MOCK_VENDORS: Vendor[] = [
  {
    id: 1,
    name: 'Glass Solutions Pvt Ltd',
    location: 'Bangalore, Karnataka',
    phone: '9876543210',
    email: 'info@glasssolutions.com'
  },
  {
    id: 2,
    name: 'Aluminum Frames Co',
    location: 'Hyderabad, Telangana',
    phone: '9876543211',
    email: 'info@aluminumframes.com'
  }
];

const MOCK_STATS: Stats = {
  totalProducts: MOCK_INVENTORY.length,
  totalCategories: MOCK_CATEGORIES.length,
  totalUsers: MOCK_USERS.length,
  lowStockItems: MOCK_INVENTORY.filter(p => p.quantity <= 5).length,
  totalSales: 118500,
  totalPurchases: 242000,
  totalInventory: 210
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

export const fetchInventory = async () => {
  await delay(600);
  return MOCK_INVENTORY;
};

export const fetchCategories = async () => {
  await delay(400);
  return MOCK_CATEGORIES;
};

export const fetchUsers = async () => {
  await delay(500);
  return MOCK_USERS;
};

export const fetchPurchases = async () => {
  await delay(500);
  return MOCK_PURCHASES;
};

export const fetchSales = async () => {
  await delay(500);
  return MOCK_SALES;
};

export const fetchTransfers = async () => {
  await delay(400);
  return MOCK_TRANSFERS;
};

export const fetchVendors = async () => {
  await delay(400);
  return MOCK_VENDORS;
};

export const fetchItemById = async (id: number) => {
  await delay(300);
  const item = MOCK_INVENTORY.find(p => p.id === id);
  if (!item) throw new Error('Item not found');
  return item;
};

export const fetchCategoryById = async (id: number) => {
  await delay(300);
  const category = MOCK_CATEGORIES.find(c => c.id === id);
  if (!category) throw new Error('Category not found');
  return category;
};

// Data mutation functions (these would connect to an API in a real app)
export const createInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
  await delay(800);
  const newItem: InventoryItem = {
    ...item,
    id: Math.max(...MOCK_INVENTORY.map(p => p.id)) + 1,
  };
  MOCK_INVENTORY.push(newItem);
  return newItem;
};

export const updateInventoryItem = async (id: number, updates: Partial<InventoryItem>) => {
  await delay(800);
  const index = MOCK_INVENTORY.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Item not found');
  
  MOCK_INVENTORY[index] = {
    ...MOCK_INVENTORY[index],
    ...updates,
  };
  
  return MOCK_INVENTORY[index];
};

export const deleteInventoryItem = async (id: number) => {
  await delay(600);
  const index = MOCK_INVENTORY.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Item not found');
  
  MOCK_INVENTORY.splice(index, 1);
  return { success: true };
};

export const createPurchase = async (purchase: Omit<Purchase, 'id'>) => {
  await delay(700);
  const newPurchase: Purchase = {
    ...purchase,
    id: Math.max(...MOCK_PURCHASES.map(p => p.id)) + 1,
  };
  MOCK_PURCHASES.push(newPurchase);
  return newPurchase;
};

export const createSale = async (sale: Omit<Sale, 'id'>) => {
  await delay(700);
  const newSale: Sale = {
    ...sale,
    id: Math.max(...MOCK_SALES.map(s => s.id)) + 1,
  };
  MOCK_SALES.push(newSale);
  return newSale;
};

export const createTransfer = async (transfer: Omit<Transfer, 'id'>) => {
  await delay(500);
  const newTransfer: Transfer = {
    ...transfer,
    id: Math.max(...MOCK_TRANSFERS.map(t => t.id)) + 1,
  };
  MOCK_TRANSFERS.push(newTransfer);
  return newTransfer;
};

export const updateTransfer = async (id: number, updates: Partial<Transfer>) => {
  await delay(500);
  const index = MOCK_TRANSFERS.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Transfer not found');
  
  MOCK_TRANSFERS[index] = {
    ...MOCK_TRANSFERS[index],
    ...updates,
  };
  
  return MOCK_TRANSFERS[index];
};

export const createVendor = async (vendor: Omit<Vendor, 'id'>) => {
  await delay(500);
  const newVendor: Vendor = {
    ...vendor,
    id: Math.max(...MOCK_VENDORS.map(v => v.id)) + 1,
  };
  MOCK_VENDORS.push(newVendor);
  return newVendor;
};

export const updateVendor = async (id: number, updates: Partial<Vendor>) => {
  await delay(500);
  const index = MOCK_VENDORS.findIndex(v => v.id === id);
  if (index === -1) throw new Error('Vendor not found');
  
  MOCK_VENDORS[index] = {
    ...MOCK_VENDORS[index],
    ...updates,
  };
  
  return MOCK_VENDORS[index];
};
