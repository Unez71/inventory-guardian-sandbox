
import { supabase } from "@/integrations/supabase/client";
import { 
  Category, 
  Product, 
  Transfer, 
  Vendor, 
  Sale, 
  Purchase,
  InventoryItem,
  Stats,
  User,
} from "@/types";

// Inventory API
export const fetchInventory = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*');
    
  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || "",
    location: item.location,
    quantity: item.quantity,
    unit: item.unit,
    unitPrice: parseFloat(item.unit_price),
    inStock: item.quantity > 0,
  }));
};

export const createInventoryItem = async (item: Partial<InventoryItem>): Promise<InventoryItem> => {
  const { data, error } = await supabase
    .from('inventory')
    .insert({
      name: item.name,
      description: item.description,
      location: item.location,
      quantity: item.quantity || 0,
      unit: item.unit,
      unit_price: item.unitPrice?.toString() || "0"
    })
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || "",
    location: data.location,
    quantity: data.quantity,
    unit: data.unit,
    unitPrice: parseFloat(data.unit_price),
    inStock: data.quantity > 0,
  };
};

export const updateInventoryItem = async (id: string, item: Partial<InventoryItem>): Promise<InventoryItem> => {
  const updateData: any = {};
  
  if (item.name !== undefined) updateData.name = item.name;
  if (item.description !== undefined) updateData.description = item.description;
  if (item.location !== undefined) updateData.location = item.location;
  if (item.quantity !== undefined) updateData.quantity = item.quantity;
  if (item.unit !== undefined) updateData.unit = item.unit;
  if (item.unitPrice !== undefined) updateData.unit_price = item.unitPrice.toString();
  
  const { data, error } = await supabase
    .from('inventory')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || "",
    location: data.location,
    quantity: data.quantity,
    unit: data.unit,
    unitPrice: parseFloat(data.unit_price),
    inStock: data.quantity > 0,
  };
};

// Transfers API
export const fetchTransfers = async (): Promise<Transfer[]> => {
  const { data, error } = await supabase
    .from('transfers')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return data.map(transfer => ({
    id: transfer.id,
    productName: transfer.product_name,
    quantity: transfer.quantity,
    fromLocation: transfer.from_location,
    toLocation: transfer.to_location,
    date: transfer.date,
    status: transfer.status as 'completed' | 'pending',
  }));
};

export const createTransfer = async (transfer: Partial<Transfer>): Promise<Transfer> => {
  const { data, error } = await supabase
    .from('transfers')
    .insert({
      product_name: transfer.productName,
      quantity: transfer.quantity,
      from_location: transfer.fromLocation,
      to_location: transfer.toLocation,
      status: transfer.status || 'pending',
    })
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    id: data.id,
    productName: data.product_name,
    quantity: data.quantity,
    fromLocation: data.from_location,
    toLocation: data.to_location,
    date: data.date,
    status: data.status as 'completed' | 'pending',
  };
};

export const updateTransfer = async (id: string, transfer: Partial<Transfer>): Promise<Transfer> => {
  const updateData: any = {};
  
  if (transfer.productName !== undefined) updateData.product_name = transfer.productName;
  if (transfer.quantity !== undefined) updateData.quantity = transfer.quantity;
  if (transfer.fromLocation !== undefined) updateData.from_location = transfer.fromLocation;
  if (transfer.toLocation !== undefined) updateData.to_location = transfer.toLocation;
  if (transfer.status !== undefined) updateData.status = transfer.status;
  
  const { data, error } = await supabase
    .from('transfers')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    id: data.id,
    productName: data.product_name,
    quantity: data.quantity,
    fromLocation: data.from_location,
    toLocation: data.to_location,
    date: data.date,
    status: data.status as 'completed' | 'pending',
  };
};

// Vendors API
export const fetchVendors = async (): Promise<Vendor[]> => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return data.map(vendor => ({
    id: vendor.id,
    name: vendor.name,
    location: vendor.location,
    phone: vendor.phone,
    email: vendor.email,
  }));
};

export const createVendor = async (vendor: Partial<Vendor>): Promise<Vendor> => {
  const { data, error } = await supabase
    .from('vendors')
    .insert({
      name: vendor.name,
      location: vendor.location,
      phone: vendor.phone,
      email: vendor.email,
    })
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    location: data.location,
    phone: data.phone,
    email: data.email,
  };
};

export const updateVendor = async (id: string, vendor: Partial<Vendor>): Promise<Vendor> => {
  const updateData: any = {};
  
  if (vendor.name !== undefined) updateData.name = vendor.name;
  if (vendor.location !== undefined) updateData.location = vendor.location;
  if (vendor.phone !== undefined) updateData.phone = vendor.phone;
  if (vendor.email !== undefined) updateData.email = vendor.email;
  
  const { data, error } = await supabase
    .from('vendors')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name,
    location: data.location,
    phone: data.phone,
    email: data.email,
  };
};

// Sales API
export const fetchSales = async (): Promise<Sale[]> => {
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      sale_items (*)
    `)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return data.map(sale => ({
    id: sale.id,
    invoiceNumber: sale.invoice_number,
    date: sale.date,
    customerName: sale.customer_name,
    customerPhone: sale.customer_phone,
    location: sale.location,
    totalAmount: parseFloat(sale.total_amount),
    items: sale.sale_items.map((item: any) => ({
      productName: item.product_name,
      quantity: item.quantity,
      unitPrice: parseFloat(item.unit_price),
    })),
  }));
};

// Purchases API
export const fetchPurchases = async (): Promise<Purchase[]> => {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      purchase_items (*)
    `)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return data.map(purchase => ({
    id: purchase.id,
    invoiceNumber: purchase.invoice_number,
    date: purchase.date,
    vendorId: purchase.vendor_id,
    location: purchase.location,
    totalAmount: parseFloat(purchase.total_amount),
    items: purchase.purchase_items.map((item: any) => ({
      productId: item.product_id,
      productName: item.product_name || "Product",
      quantity: item.quantity,
      unitPrice: parseFloat(item.unit_price),
      total: parseFloat(item.total),
    })),
  }));
};

// Categories API
export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
    
  if (error) throw error;
  
  return data.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description || "",
    productsCount: 0, // We would need a join or separate query to get this
    createdAt: category.created_at,
  }));
};

// Users API
export const fetchUsers = async (): Promise<User[]> => {
  // In a real app, this would be a call to get users from the auth system
  // For this demo, returning mock data
  return [
    {
      id: "1",
      username: "admin",
      email: "admin@example.com",
      role: "admin",
      avatar: ""
    },
    {
      id: "2",
      username: "user1",
      email: "user1@example.com",
      role: "user",
      avatar: ""
    }
  ];
};

// Mock authentication
export const loginUser = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  // In a real app, this would be a call to authenticate the user
  // Use both admin or admin@example.com as valid usernames
  if ((email === "admin@example.com" || email === "admin") && (password === "password" || password === "password123")) {
    return {
      user: {
        id: "1",
        username: "admin",
        email: "admin@example.com",
        role: "admin",
        avatar: ""
      },
      token: "mock-token-12345"
    };
  }
  throw new Error("Invalid credentials");
};

// Function to get dashboard stats
export const fetchStats = async (): Promise<Stats> => {
  // In a real app, this would fetch actual stats
  return {
    totalProducts: 148,
    totalCategories: 12,
    totalUsers: 8,
    lowStockItems: 23,
    totalSales: 45600,
    totalPurchases: 36200,
    totalInventory: 256
  };
};
