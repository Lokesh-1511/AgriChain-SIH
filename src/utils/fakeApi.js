// fakeApi.js - Client-side API simulator with Promise-based functions
// Simulates real API behavior with latency, error handling, and localStorage persistence

// Utility function to simulate network latency
const simulateLatency = (min = 100, max = 300) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`API: Simulating ${delay}ms delay`);
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Utility function to simulate occasional API errors (reduced chance for debugging)
const maybeThrowError = () => {
  if (Math.random() < 0.01) { // Reduced from 5% to 1%
    throw new Error('Network error: Unable to connect to server');
  }
};

// Import mock data
import mockProducts from '../data/mockProducts.json';
import mockFarmers from '../data/mockFarmers.json';
import mockTrace from '../data/mockTrace.json';
import mockTransactions from '../data/mockTransactions.json';
import mockSchemes from '../data/mockSchemes.json';

// Initialize localStorage with mock data if not exists
const initializeLocalStorage = () => {
  if (!localStorage.getItem('agrichain-products')) {
    localStorage.setItem('agrichain-products', JSON.stringify(mockProducts));
  }
  if (!localStorage.getItem('agrichain-farmers')) {
    localStorage.setItem('agrichain-farmers', JSON.stringify(mockFarmers));
  }
  if (!localStorage.getItem('agrichain-traces')) {
    localStorage.setItem('agrichain-traces', JSON.stringify(mockTrace));
  }
  if (!localStorage.getItem('agrichain-transactions')) {
    localStorage.setItem('agrichain-transactions', JSON.stringify(mockTransactions));
  }
  if (!localStorage.getItem('agrichain-schemes')) {
    localStorage.setItem('agrichain-schemes', JSON.stringify(mockSchemes));
  }
};

// Initialize data on module load
initializeLocalStorage();

// Helper function to get data from localStorage
const getStorageData = (key) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      console.warn(`No data found for key: ${key}, returning empty object`);
      return {};
    }
    const parsed = JSON.parse(data);
    return parsed || {};
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return {};
  }
};

// Helper function to reset corrupted data
const resetStorageIfCorrupted = () => {
  try {
    // Test if all required data exists and is valid
    const keys = ['agrichain-products', 'agrichain-farmers', 'agrichain-traces', 'agrichain-transactions', 'agrichain-schemes'];
    for (const key of keys) {
      const data = getStorageData(key);
      if (!data || typeof data !== 'object') {
        console.warn(`Corrupted data detected for ${key}, reinitializing...`);
        localStorage.removeItem(key);
      }
    }
    // Reinitialize any missing data
    initializeLocalStorage();
  } catch (error) {
    console.error('Error checking storage data:', error);
    // Clear all and reinitialize
    localStorage.clear();
    initializeLocalStorage();
  }
};

// Check and fix storage on module load
resetStorageIfCorrupted();

// Helper function to save data to localStorage
const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// =================================
// PRODUCT API FUNCTIONS
// =================================

export const fetchProducts = async (params = {}) => {
  console.log('API: fetchProducts called with params:', params);
  await simulateLatency();
  maybeThrowError();
  
  console.log('API: Getting products data from storage...');
  const productsData = getStorageData('agrichain-products');
  console.log('API: Raw products data:', productsData);
  
  // Handle both array format and object format from mockProducts.json
  let products;
  if (productsData.products) {
    // Original mockProducts.json format with products array
    products = productsData.products;
  } else if (Array.isArray(productsData)) {
    // Array format
    products = productsData;
  } else {
    // Fallback to empty array
    products = [];
  }
  
  // Apply filters if provided
  if (params.category) {
    products = products.filter(p => 
      p.category.toLowerCase().includes(params.category.toLowerCase())
    );
  }
  
  if (params.farmer_id) {
    products = products.filter(p => p.farmer_id === params.farmer_id);
  }
  
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.variety.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  console.log('API: Returning products:', paginatedProducts.length, 'of', products.length);
  return {
    success: true,
    data: paginatedProducts,
    pagination: {
      page,
      limit,
      total: products.length,
      totalPages: Math.ceil(products.length / limit),
      hasNext: endIndex < products.length,
      hasPrev: page > 1
    }
  };
};

export const fetchProductById = async (productId) => {
  await simulateLatency();
  maybeThrowError();
  
  const productsData = getStorageData('agrichain-products');
  
  // Handle both array format and object format
  let products;
  if (productsData.products) {
    products = productsData.products;
  } else if (Array.isArray(productsData)) {
    products = productsData;
  } else {
    products = [];
  }
  
  const product = products.find(p => p.id == productId); // Use == for type flexibility
  
  if (!product) {
    throw new Error(`Product with ID ${productId} not found`);
  }
  
  return {
    success: true,
    data: product
  };
};

export const postProduct = async (productData) => {
  await simulateLatency(500, 1200); // Longer delay for POST operations
  maybeThrowError();
  
  const productsData = getStorageData('agrichain-products');
  
  // Handle both array format and object format
  let products;
  let updateData;
  
  if (productsData.products) {
    products = productsData.products;
    updateData = productsData;
  } else if (Array.isArray(productsData)) {
    products = productsData;
    updateData = productsData;
  } else {
    products = [];
    updateData = { products: [] };
  }
  
  const newProduct = {
    id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...productData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active'
  };
  
  products.push(newProduct);
  
  // Update the data structure appropriately
  if (updateData.products) {
    updateData.products = products;
  } else {
    updateData = products;
  }
  
  if (!setStorageData('agrichain-products', updateData)) {
    throw new Error('Failed to save product data');
  }
  
  return {
    success: true,
    data: newProduct,
    message: 'Product created successfully'
  };
};

export const updateProduct = async (productId, updates) => {
  await simulateLatency(400, 800);
  maybeThrowError();
  
  const productsData = getStorageData('agrichain-products');
  
  // Handle both array format and object format
  let products, updateData;
  if (productsData.products) {
    products = productsData.products;
    updateData = productsData;
  } else if (Array.isArray(productsData)) {
    products = productsData;
    updateData = productsData;
  } else {
    throw new Error('Invalid products data format');
  }
  
  const productIndex = products.findIndex(p => p.id == productId);
  
  if (productIndex === -1) {
    throw new Error(`Product with ID ${productId} not found`);
  }
  
  products[productIndex] = {
    ...products[productIndex],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  // Update the data structure appropriately
  if (updateData.products) {
    updateData.products = products;
  } else {
    updateData = products;
  }
  
  if (!setStorageData('agrichain-products', updateData)) {
    throw new Error('Failed to update product data');
  }
  
  return {
    success: true,
    data: products[productIndex],
    message: 'Product updated successfully'
  };
};

// Delete Product by ID
export const deleteProduct = async (productId) => {
  await simulateLatency();
  maybeThrowError();
  
  console.log(`API: Deleting product with ID: ${productId}`);
  
  if (!productId) {
    throw new Error('Product ID is required');
  }
  
  const data = getStorageData('agrichain-products');
  const products = Array.isArray(data) ? data : (data.products || []);
  
  const productIndex = products.findIndex(p => p.id.toString() === productId.toString());
  if (productIndex === -1) {
    throw new Error('Product not found');
  }
  
  const deletedProduct = products[productIndex];
  products.splice(productIndex, 1);
  
  const updateData = Array.isArray(data) ? products : { ...data, products };
  
  if (!setStorageData('agrichain-products', updateData)) {
    throw new Error('Failed to delete product data');
  }
  
  return {
    success: true,
    data: deletedProduct,
    message: 'Product deleted successfully'
  };
};

// =================================
// FARMER API FUNCTIONS  
// =================================

export const fetchFarmers = async (params = {}) => {
  await simulateLatency();
  maybeThrowError();
  
  const farmersData = getStorageData('agrichain-farmers');
  let farmers = farmersData.farmers || (Array.isArray(farmersData) ? farmersData : []);
  
  // Apply filters
  if (params.state) {
    farmers = farmers.filter(f => 
      f.location.state.toLowerCase() === params.state.toLowerCase()
    );
  }
  
  if (params.verified !== undefined) {
    farmers = farmers.filter(f => f.verification_status === params.verified);
  }
  
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    farmers = farmers.filter(f =>
      f.name.toLowerCase().includes(searchTerm) ||
      f.location.district.toLowerCase().includes(searchTerm) ||
      f.specializations.some(s => s.toLowerCase().includes(searchTerm))
    );
  }
  
  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedFarmers = farmers.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: paginatedFarmers,
    pagination: {
      page,
      limit,
      total: farmers.length,
      totalPages: Math.ceil(farmers.length / limit),
      hasNext: endIndex < farmers.length,
      hasPrev: page > 1
    }
  };
};

export const fetchFarmerById = async (farmerId) => {
  await simulateLatency();
  maybeThrowError();
  
  const farmersData = getStorageData('agrichain-farmers');
  const farmer = farmersData.farmers?.find(f => f.farmer_id === farmerId);
  
  if (!farmer) {
    throw new Error(`Farmer with ID ${farmerId} not found`);
  }
  
  return {
    success: true,
    data: farmer
  };
};

export const updateFarmerProfile = async (farmerId, updates) => {
  await simulateLatency(400, 800);
  maybeThrowError();
  
  const farmersData = getStorageData('agrichain-farmers');
  const farmerIndex = farmersData.farmers?.findIndex(f => f.farmer_id === farmerId);
  
  if (farmerIndex === -1) {
    throw new Error(`Farmer with ID ${farmerId} not found`);
  }
  
  farmersData.farmers[farmerIndex] = {
    ...farmersData.farmers[farmerIndex],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  if (!setStorageData('agrichain-farmers', farmersData)) {
    throw new Error('Failed to update farmer data');
  }
  
  return {
    success: true,
    data: farmersData.farmers[farmerIndex],
    message: 'Farmer profile updated successfully'
  };
};

// =================================
// TRACEABILITY API FUNCTIONS
// =================================

export const fetchTraceData = async (productId) => {
  await simulateLatency(600, 1000); // Longer delay for complex trace data
  maybeThrowError();
  
  const tracesData = getStorageData('agrichain-traces');
  
  // Handle both array format and object format from mockTrace.json
  let trace;
  if (tracesData.products) {
    // Original mockTrace.json format with products object
    trace = tracesData.products[productId];
  } else if (Array.isArray(tracesData)) {
    // Array format
    trace = tracesData.find(t => t.product_id === productId || t.id === productId);
  } else {
    // Direct object format
    trace = tracesData[productId];
  }
  
  if (!trace) {
    throw new Error(`Trace data for product ${productId} not found`);
  }
  
  return {
    success: true,
    data: trace
  };
};

export const addTraceStep = async (productId, stepData) => {
  await simulateLatency(500, 900);
  maybeThrowError();
  
  const tracesData = getStorageData('agrichain-traces');
  
  // Handle both array format and object format
  let trace;
  let updateData;
  
  if (tracesData.products) {
    // Original mockTrace.json format
    trace = tracesData.products[productId];
    if (!trace) {
      throw new Error(`Trace data for product ${productId} not found`);
    }
    
    const newStep = {
      step_id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...stepData,
      timestamp: new Date().toISOString(),
      blockchain_hash: `0x${Math.random().toString(16).substr(2, 64)}`
    };
    
    trace.timeline.push(newStep);
    trace.updated_at = new Date().toISOString();
    updateData = tracesData;
  } else if (Array.isArray(tracesData)) {
    // Array format
    const traceIndex = tracesData.findIndex(t => t.product_id === productId);
    if (traceIndex === -1) {
      throw new Error(`Trace data for product ${productId} not found`);
    }
    
    const newStep = {
      step_id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...stepData,
      timestamp: new Date().toISOString(),
      blockchain_hash: `0x${Math.random().toString(16).substr(2, 64)}`
    };
    
    tracesData[traceIndex].steps.push(newStep);
    tracesData[traceIndex].updated_at = new Date().toISOString();
    updateData = tracesData;
  } else {
    throw new Error('Invalid trace data format');
  }
  
  if (!setStorageData('agrichain-traces', updateData)) {
    throw new Error('Failed to add trace step');
  }
  
  return {
    success: true,
    data: trace,
    message: 'Trace step added successfully'
  };
};

// =================================
// TRANSACTION API FUNCTIONS
// =================================

export const fetchTransactions = async (params = {}) => {
  await simulateLatency();
  maybeThrowError();
  
  const transactionsData = getStorageData('agrichain-transactions');
  
  // Handle both array format and object format
  let transactions;
  if (transactionsData.transactions) {
    // Original mockTransactions.json format with transactions array
    transactions = transactionsData.transactions;
  } else if (Array.isArray(transactionsData)) {
    // Array format
    transactions = transactionsData;
  } else {
    // Fallback to empty array
    transactions = [];
  }
  
  // Apply filters
  if (params.farmer_id) {
    transactions = transactions.filter(t => t.farmer_id === params.farmer_id);
  }
  
  if (params.product_id) {
    transactions = transactions.filter(t => t.product_id === params.product_id);
  }
  
  if (params.status) {
    transactions = transactions.filter(t => t.status === params.status);
  }
  
  // Sort by date (newest first)
  transactions.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
  
  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedTransactions = transactions.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: paginatedTransactions,
    pagination: {
      page,
      limit,
      total: transactions.length,
      totalPages: Math.ceil(transactions.length / limit),
      hasNext: endIndex < transactions.length,
      hasPrev: page > 1
    }
  };
};

export const createTransaction = async (transactionData) => {
  await simulateLatency(500, 1200);
  maybeThrowError();
  
  const transactionsData = getStorageData('agrichain-transactions');
  
  // Handle both array format and object format
  let transactions, updateData;
  if (transactionsData.transactions) {
    transactions = transactionsData.transactions;
    updateData = transactionsData;
  } else if (Array.isArray(transactionsData)) {
    transactions = transactionsData;
    updateData = transactionsData;
  } else {
    transactions = [];
    updateData = { transactions: [] };
  }
  
  const newTransaction = {
    transaction_id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...transactionData,
    transaction_date: new Date().toISOString(),
    status: transactionData.status || 'pending',
    blockchain_hash: `0x${Math.random().toString(16).substr(2, 64)}`,
    created_at: new Date().toISOString()
  };
  
  transactions.push(newTransaction);
  
  // Update the data structure appropriately
  if (updateData.transactions) {
    updateData.transactions = transactions;
  } else {
    updateData = transactions;
  }
  
  if (!setStorageData('agrichain-transactions', updateData)) {
    throw new Error('Failed to save transaction data');
  }
  
  return {
    success: true,
    data: newTransaction,
    message: 'Transaction created successfully'
  };
};

// =================================
// SCHEME API FUNCTIONS
// =================================

export const fetchSchemes = async (params = {}) => {
  await simulateLatency();
  maybeThrowError();
  
  const schemesData = getStorageData('agrichain-schemes');
  let schemes = schemesData.schemes || [];
  
  // Apply filters
  if (params.category) {
    schemes = schemes.filter(s => 
      s.category.toLowerCase() === params.category.toLowerCase()
    );
  }
  
  if (params.status) {
    schemes = schemes.filter(s => s.status === params.status);
  }
  
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    schemes = schemes.filter(s =>
      s.title.toLowerCase().includes(searchTerm) ||
      s.description.toLowerCase().includes(searchTerm) ||
      s.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  
  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedSchemes = schemes.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: paginatedSchemes,
    pagination: {
      page,
      limit,
      total: schemes.length,
      totalPages: Math.ceil(schemes.length / limit),
      hasNext: endIndex < schemes.length,
      hasPrev: page > 1
    }
  };
};

export const fetchSchemeById = async (schemeId) => {
  await simulateLatency();
  maybeThrowError();
  
  const schemesData = getStorageData('agrichain-schemes');
  const scheme = schemesData.schemes?.find(s => s.id === schemeId);
  
  if (!scheme) {
    throw new Error(`Scheme with ID ${schemeId} not found`);
  }
  
  return {
    success: true,
    data: scheme
  };
};

// =================================
// ANALYTICS API FUNCTIONS
// =================================

export const fetchDashboardStats = async (userId, userType = 'farmer') => {
  await simulateLatency(800, 1400);
  maybeThrowError();
  
  if (userType === 'farmer') {
    // Get products data and handle structure
    const productsData = getStorageData('agrichain-products');
    const allProducts = productsData.products || (Array.isArray(productsData) ? productsData : []);
    const products = allProducts.filter(p => p.farmer_id === userId);
    
    // Get transactions data and handle structure
    const transactionsData = getStorageData('agrichain-transactions');
    const allTransactions = transactionsData.transactions || (Array.isArray(transactionsData) ? transactionsData : []);
    const transactions = allTransactions.filter(t => t.farmer_id === userId);
    
    const totalRevenue = transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const monthlyStats = {};
    transactions.forEach(t => {
      const month = new Date(t.transaction_date).toISOString().slice(0, 7);
      if (!monthlyStats[month]) {
        monthlyStats[month] = { revenue: 0, orders: 0 };
      }
      monthlyStats[month].revenue += t.amount || 0;
      monthlyStats[month].orders += 1;
    });
    
    return {
      success: true,
      data: {
        totalProducts: products.length,
        totalOrders: transactions.length,
        totalRevenue,
        pendingOrders: transactions.filter(t => t.status === 'pending').length,
        monthlyStats: Object.entries(monthlyStats).map(([month, stats]) => ({
          month,
          ...stats
        }))
      }
    };
  } else {
    // Consumer stats
    const transactionsData = getStorageData('agrichain-transactions');
    const allTransactions = transactionsData.transactions || (Array.isArray(transactionsData) ? transactionsData : []);
    const transactions = allTransactions.filter(t => t.buyer_id === userId);
    const totalSpent = transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    return {
      success: true,
      data: {
        totalPurchases: transactions.length,
        totalSpent,
        recentOrders: transactions.slice(0, 5),
        favoriteCategories: ['Organic Vegetables', 'Fruits', 'Grains']
      }
    };
  }
};

// =================================
// UTILITY FUNCTIONS
// =================================

export const searchAll = async (query, filters = {}) => {
  await simulateLatency(800, 1200);
  maybeThrowError();
  
  const searchTerm = query.toLowerCase();
  const results = {
    products: [],
    farmers: [],
    schemes: []
  };
  
  // Search products
  const productsData = getStorageData('agrichain-products');
  const products = productsData.products || (Array.isArray(productsData) ? productsData : []);
  results.products = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm) ||
    p.variety.toLowerCase().includes(searchTerm)
  ).slice(0, filters.productLimit || 5);
  
  // Search farmers
  const farmersData = getStorageData('agrichain-farmers');
  results.farmers = (farmersData.farmers || []).filter(f =>
    f.name.toLowerCase().includes(searchTerm) ||
    f.location.district.toLowerCase().includes(searchTerm) ||
    f.specializations.some(s => s.toLowerCase().includes(searchTerm))
  ).slice(0, filters.farmerLimit || 5);
  
  // Search schemes
  const schemesData = getStorageData('agrichain-schemes');
  results.schemes = (schemesData.schemes || []).filter(s =>
    s.title.toLowerCase().includes(searchTerm) ||
    s.description.toLowerCase().includes(searchTerm) ||
    s.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  ).slice(0, filters.schemeLimit || 5);
  
  return {
    success: true,
    data: results,
    query: query,
    totalResults: results.products.length + results.farmers.length + results.schemes.length
  };
};

export const clearAllData = async () => {
  await simulateLatency(200, 400);
  
  localStorage.removeItem('agrichain-products');
  localStorage.removeItem('agrichain-farmers');
  localStorage.removeItem('agrichain-traces');
  localStorage.removeItem('agrichain-transactions');
  localStorage.removeItem('agrichain-schemes');
  
  // Reinitialize with fresh mock data
  initializeLocalStorage();
  
  return {
    success: true,
    message: 'All data cleared and reinitialized'
  };
};

export const getDataStats = async () => {
  await simulateLatency(100, 300);
  
  const productsData = getStorageData('agrichain-products');
  const farmersData = getStorageData('agrichain-farmers');
  const tracesData = getStorageData('agrichain-traces');
  const transactionsData = getStorageData('agrichain-transactions');
  const schemesData = getStorageData('agrichain-schemes');
  
  const stats = {
    products: (productsData.products || (Array.isArray(productsData) ? productsData : [])).length,
    farmers: (farmersData.farmers || (Array.isArray(farmersData) ? farmersData : [])).length,
    traces: (tracesData.products ? Object.keys(tracesData.products).length : (Array.isArray(tracesData) ? tracesData.length : 0)),
    transactions: (transactionsData.transactions || (Array.isArray(transactionsData) ? transactionsData : [])).length,
    schemes: (schemesData.schemes || (Array.isArray(schemesData) ? schemesData : [])).length,
    lastUpdated: new Date().toISOString()
  };
  
  return {
    success: true,
    data: stats
  };
};