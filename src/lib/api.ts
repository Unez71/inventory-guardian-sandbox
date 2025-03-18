
import { supabase } from "../integrations/supabase/client";
import { User, Product, Category, Stats, InventoryItem, Purchase, Sale, Transfer, Vendor } from '../types';

// Authentication functions
export const loginApi = async (username: string, password: string) => {
  // Simple validation for demo purposes
  if (username === 'admin' && password === 'password123') {
    const user = {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin'
    };
    return {
      user,
      token: 'mock-jwt-token',
    };
  }
  
  throw new Error('Invalid credentials');
};

export const logoutApi = async () => {
  return { success: true };
};

// Fetch data from Supabase
export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) throw error;
  
  // Transform to match our Category type
  const categories: Category[] = data.map(cat => ({
    id: cat.id,
    name: cat.name,
    description: cat.description || "",
    productsCount: 0, // We'll update this count below
    createdAt: cat.created_at
  }));

  // Get product counts for each category
  for (let category of categories) {
    const { count, error: countError } = await supabase
      .from('inventory')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', category.id);
    
    if (!countError && count !== null) {
      category.productsCount = count;
    }
  }
  
  return categories;
};

export const fetchInventory = async () => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*');
  
  if (error) throw error;
  
  // Transform to match our InventoryItem type
  const inventory: InventoryItem[] = data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || "",
    location: item.location,
    quantity: item.quantity,
    unit: item.unit,
    unitPrice: Number(item.unit_price),
    inStock: item.quantity > 0
  }));
  
  return inventory;
};

export const fetchVendors = async () => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*');
  
  if (error) throw error;
  
  // Transform to match our Vendor type
  const vendors: Vendor[] = data.map(vendor => ({
    id: vendor.id,
    name: vendor.name,
    location: vendor.location || "",
    phone: vendor.phone || "",
    email: vendor.email || ""
  }));
  
  return vendors;
};

export const fetchPurchases = async () => {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      purchase_items(*)
    `);
  
  if (error) throw error;
  
  // Transform to match our Purchase type
  const purchases: Purchase[] = await Promise.all(data.map(async (purchase) => {
    // Get product names for each purchase item
    const purchaseItems = await Promise.all(purchase.purchase_items.map(async (item: any) => {
      const { data: productData } = await supabase
        .from('inventory')
        .select('name')
        .eq('id', item.product_id)
        .single();
      
      return {
        productId: item.product_id,
        productName: productData?.name || "Unknown Product",
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        total: Number(item.total)
      };
    }));
    
    return {
      id: purchase.id,
      invoiceNumber: purchase.invoice_number,
      date: purchase.date,
      vendorId: purchase.vendor_id,
      location: purchase.location,
      totalAmount: Number(purchase.total_amount),
      items: purchaseItems
    };
  }));
  
  return purchases;
};

export const fetchSales = async () => {
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      sale_items(*)
    `);
  
  if (error) throw error;
  
  // Transform to match our Sale type
  const sales: Sale[] = data.map(sale => ({
    id: sale.id,
    invoiceNumber: sale.invoice_number,
    date: sale.date,
    customerName: sale.customer_name,
    customerPhone: sale.customer_phone || "",
    location: sale.location,
    totalAmount: Number(sale.total_amount),
    items: sale.sale_items.map((item: any) => ({
      productName: item.product_name,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price)
    }))
  }));
  
  return sales;
};

export const fetchTransfers = async () => {
  const { data, error } = await supabase
    .from('transfers')
    .select('*');
  
  if (error) throw error;
  
  // Transform to match our Transfer type
  const transfers: Transfer[] = data.map(transfer => ({
    id: transfer.id,
    productName: transfer.product_name,
    quantity: transfer.quantity,
    fromLocation: transfer.from_location,
    toLocation: transfer.to_location,
    date: transfer.date,
    status: transfer.status as 'completed' | 'pending'
  }));
  
  return transfers;
};

export const fetchStats = async () => {
  // Get total products (inventory items)
  const { count: totalProducts } = await supabase
    .from('inventory')
    .select('*', { count: 'exact', head: true });
  
  // Get total categories
  const { count: totalCategories } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });
  
  // Get low stock items
  const { count: lowStockItems } = await supabase
    .from('inventory')
    .select('*', { count: 'exact', head: true })
    .lt('quantity', 6);
  
  // Get total sales amount
  const { data: salesData } = await supabase
    .from('sales')
    .select('total_amount');
  
  const totalSales = salesData?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
  
  // Get total purchases amount
  const { data: purchasesData } = await supabase
    .from('purchases')
    .select('total_amount');
  
  const totalPurchases = purchasesData?.reduce((sum, purchase) => sum + Number(purchase.total_amount), 0) || 0;
  
  // Get total inventory quantity
  const { data: inventoryData } = await supabase
    .from('inventory')
    .select('quantity');
  
  const totalInventory = inventoryData?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  // Mock data for users (we don't have a users table yet)
  const totalUsers = 3;
  
  const stats: Stats = {
    totalProducts: totalProducts || 0,
    totalCategories: totalCategories || 0,
    totalUsers,
    lowStockItems: lowStockItems || 0,
    totalSales,
    totalPurchases,
    totalInventory
  };
  
  return stats;
};

export const fetchItemById = async (id: number) => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  // Transform to match our InventoryItem type
  const item: InventoryItem = {
    id: data.id,
    name: data.name,
    description: data.description || "",
    location: data.location,
    quantity: data.quantity,
    unit: data.unit,
    unitPrice: Number(data.unit_price),
    inStock: data.quantity > 0
  };
  
  return item;
};

export const fetchCategoryById = async (id: number) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  // Get product count for this category
  const { count, error: countError } = await supabase
    .from('inventory')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', data.id);
  
  // Transform to match our Category type
  const category: Category = {
    id: data.id,
    name: data.name,
    description: data.description || "",
    productsCount: count || 0,
    createdAt: data.created_at
  };
  
  return category;
};

// Data mutation functions
export const createInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
  const { data, error } = await supabase
    .from('inventory')
    .insert({
      name: item.name,
      description: item.description,
      location: item.location,
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.unitPrice,
      category_id: null // We would need the category_id here
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Transform to match our InventoryItem type
  const newItem: InventoryItem = {
    id: data.id,
    name: data.name,
    description: data.description || "",
    location: data.location,
    quantity: data.quantity,
    unit: data.unit,
    unitPrice: Number(data.unit_price),
    inStock: data.quantity > 0
  };
  
  return newItem;
};

export const updateInventoryItem = async (id: number, updates: Partial<InventoryItem>) => {
  const { data, error } = await supabase
    .from('inventory')
    .update({
      name: updates.name,
      description: updates.description,
      location: updates.location,
      quantity: updates.quantity,
      unit: updates.unit,
      unit_price: updates.unitPrice,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  // Transform to match our InventoryItem type
  const updatedItem: InventoryItem = {
    id: data.id,
    name: data.name,
    description: data.description || "",
    location: data.location,
    quantity: data.quantity,
    unit: data.unit,
    unitPrice: Number(data.unit_price),
    inStock: data.quantity > 0
  };
  
  return updatedItem;
};

export const deleteInventoryItem = async (id: number) => {
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  
  return { success: true };
};

export const createPurchase = async (purchase: Omit<Purchase, 'id'>) => {
  // First, insert the purchase
  const { data: purchaseData, error: purchaseError } = await supabase
    .from('purchases')
    .insert({
      invoice_number: purchase.invoiceNumber,
      date: purchase.date,
      vendor_id: purchase.vendorId,
      location: purchase.location,
      total_amount: purchase.totalAmount
    })
    .select()
    .single();
  
  if (purchaseError) throw purchaseError;
  
  // Then, insert each purchase item
  for (const item of purchase.items) {
    const { error: itemError } = await supabase
      .from('purchase_items')
      .insert({
        purchase_id: purchaseData.id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total: item.total
      });
    
    if (itemError) throw itemError;
    
    // Update inventory quantity
    const { error: updateError } = await supabase.rpc('update_inventory_quantity', {
      p_product_id: item.productId,
      p_quantity: item.quantity
    });
    
    if (updateError) throw updateError;
  }
  
  return {
    ...purchase,
    id: purchaseData.id
  };
};

export const createSale = async (sale: Omit<Sale, 'id'>) => {
  // First, insert the sale
  const { data: saleData, error: saleError } = await supabase
    .from('sales')
    .insert({
      invoice_number: sale.invoiceNumber,
      date: sale.date,
      customer_name: sale.customerName,
      customer_phone: sale.customerPhone,
      location: sale.location,
      total_amount: sale.totalAmount
    })
    .select()
    .single();
  
  if (saleError) throw saleError;
  
  // Then, insert each sale item
  for (const item of sale.items) {
    const { error: itemError } = await supabase
      .from('sale_items')
      .insert({
        sale_id: saleData.id,
        product_name: item.productName,
        quantity: item.quantity,
        unit_price: item.unitPrice
      });
    
    if (itemError) throw itemError;
    
    // Here we would normally update inventory quantity, but we need a product_id
    // which we don't have in the current SaleItem type
  }
  
  return {
    ...sale,
    id: saleData.id
  };
};

export const createTransfer = async (transfer: Omit<Transfer, 'id'>) => {
  const { data, error } = await supabase
    .from('transfers')
    .insert({
      product_name: transfer.productName,
      quantity: transfer.quantity,
      from_location: transfer.fromLocation,
      to_location: transfer.toLocation,
      date: transfer.date,
      status: transfer.status
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Transform to match our Transfer type
  const newTransfer: Transfer = {
    id: data.id,
    productName: data.product_name,
    quantity: data.quantity,
    fromLocation: data.from_location,
    toLocation: data.to_location,
    date: data.date,
    status: data.status
  };
  
  return newTransfer;
};

export const updateTransfer = async (id: number, updates: Partial<Transfer>) => {
  const { data, error } = await supabase
    .from('transfers')
    .update({
      product_name: updates.productName,
      quantity: updates.quantity,
      from_location: updates.fromLocation,
      to_location: updates.toLocation,
      date: updates.date,
      status: updates.status
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  // Transform to match our Transfer type
  const updatedTransfer: Transfer = {
    id: data.id,
    productName: data.product_name,
    quantity: data.quantity,
    fromLocation: data.from_location,
    toLocation: data.to_location,
    date: data.date,
    status: data.status
  };
  
  return updatedTransfer;
};

export const createVendor = async (vendor: Omit<Vendor, 'id'>) => {
  const { data, error } = await supabase
    .from('vendors')
    .insert({
      name: vendor.name,
      location: vendor.location,
      phone: vendor.phone,
      email: vendor.email
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Transform to match our Vendor type
  const newVendor: Vendor = {
    id: data.id,
    name: data.name,
    location: data.location || "",
    phone: data.phone || "",
    email: data.email || ""
  };
  
  return newVendor;
};

export const updateVendor = async (id: number, updates: Partial<Vendor>) => {
  const { data, error } = await supabase
    .from('vendors')
    .update({
      name: updates.name,
      location: updates.location,
      phone: updates.phone,
      email: updates.email
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  // Transform to match our Vendor type
  const updatedVendor: Vendor = {
    id: data.id,
    name: data.name,
    location: data.location || "",
    phone: data.phone || "",
    email: data.email || ""
  };
  
  return updatedVendor;
};

// Create a stored procedure to update inventory quantity
const createUpdateInventoryQuantityFunction = async () => {
  const { error } = await supabase.rpc('create_update_inventory_quantity_function');
  if (error) console.error("Error creating function:", error);
};

// Create the function if it doesn't exist
createUpdateInventoryQuantityFunction();
