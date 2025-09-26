import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Modal from '../components/Modal';
import ProductCard from '../components/ProductCard';
import ProgressRing from '../components/ProgressRing';
import SchemeCard from '../components/SchemeCard';
import ChatWidget from '../components/ChatWidget';
import { fetchProducts, fetchTransactions, fetchDashboardStats, postProduct, updateProduct, deleteProduct } from '../utils/fakeApi';
import styles from '../styles/FarmerDashboard.module.css';

const FarmerDashboard = () => {
  const { t } = useLanguage();
  // Cache busting comment - 2025-09-26
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [farmerData, setFarmerData] = useState(null);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);

  // Claims state
  const [claims, setClaims] = useState([]);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimForm, setClaimForm] = useState({
    type: '',
    description: '',
    images: [],
    imagesPreviews: []
  });

  // Product management state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    quantity: '',
    description: '',
    variety: '',
    organic: false,
    harvestDate: '',
    images: [],
    imagesPreviews: []
  });

  // Load farmer data, products, and dashboard stats
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('agrichain-user') || '{}');
    console.log('FarmerDashboard: Current user:', currentUser);
    setFarmerData(currentUser);
    
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('FarmerDashboard: Starting to load dashboard data...');
        
        // Load farmer's products - use a fallback ID if no user email
        const farmerId = currentUser.email || currentUser.id || 'farmer1@example.com';
        console.log('FarmerDashboard: Loading products for farmer:', farmerId);
        
        const productsResponse = await fetchProducts({ farmer_id: farmerId });
        console.log('FarmerDashboard: Products response:', productsResponse);
        if (productsResponse.success) {
          setProducts(productsResponse.data);
        }

        // Load transactions
        console.log('FarmerDashboard: Loading transactions for farmer:', farmerId);
        const transactionsResponse = await fetchTransactions({ farmer_id: farmerId });
        console.log('FarmerDashboard: Transactions response:', transactionsResponse);
        if (transactionsResponse.success) {
          setTransactions(transactionsResponse.data);
        }

        // Load dashboard statistics
        console.log('FarmerDashboard: Loading dashboard stats...');
        const statsResponse = await fetchDashboardStats(farmerId, 'farmer');
        console.log('FarmerDashboard: Stats response:', statsResponse);
        if (statsResponse.success) {
          setDashboardStats(statsResponse.data);
        }

        // Load stored claims from localStorage
        const claimsKey = `farmer_claims_${farmerId}`;
        const storedClaims = JSON.parse(localStorage.getItem(claimsKey) || '[]');
        setClaims(storedClaims);
        
        console.log('FarmerDashboard: Dashboard loading completed successfully');
      } catch (err) {
        console.error('FarmerDashboard: Error loading dashboard:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    // Always try to load dashboard data, even without user email
    console.log('FarmerDashboard: Starting dashboard load...');
    loadDashboardData();
  }, []);

  // Claim handlers
  const handleClaimSubmit = (e) => {
    e.preventDefault();
    const newClaim = {
      id: Date.now(),
      ...claimForm,
      status: 'Pending',
      submittedDate: new Date().toLocaleDateString(),
      amount: Math.floor(Math.random() * 15000) + 5000
    };

    const updatedClaims = [...claims, newClaim];
    setClaims(updatedClaims);
    localStorage.setItem(`farmer_claims_${farmerData.email}`, JSON.stringify(updatedClaims));
    
    setShowClaimModal(false);
    setClaimForm({ type: '', description: '', images: [], imagesPreviews: [] });
  };

  const handleClaimImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setClaimForm(prev => ({
          ...prev,
          images: [...prev.images, file],
          imagesPreviews: [...prev.imagesPreviews, e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Product management handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const farmerId = farmerData.email || farmerData.id || 'farmer1@example.com';
      const productData = {
        ...productForm,
        farmer_id: farmerId,
        farmer_name: farmerData.name || 'Unknown Farmer',
        agriScore: Math.floor(Math.random() * 20) + 80, // Random score 80-100
        location: farmerData.location || 'Unknown Location',
        price: parseFloat(productForm.price),
        quantity: parseInt(productForm.quantity)
      };

      if (editingProduct) {
        // Update existing product
        const response = await updateProduct(editingProduct.id, productData);
        if (response.success) {
          setProducts(products.map(p => p.id === editingProduct.id ? response.data : p));
        }
      } else {
        // Create new product
        const response = await postProduct(productData);
        if (response.success) {
          setProducts([...products, response.data]);
        }
      }

      setShowProductModal(false);
      setEditingProduct(null);
      resetProductForm();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      category: product.category || 'Vegetables',
      price: product.price || '',
      unit: product.unit || 'kg',
      quantity: product.quantity || '',
      description: product.description || '',
      variety: product.variety || '',
      organic: product.organic || false,
      harvestDate: product.harvestDate || '',
      images: product.images || [],
      imagesPreviews: product.images || []
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setProducts(products.filter(p => p.id !== productId));
        // In a real app, you'd call deleteProduct API
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      category: 'Vegetables',
      price: '',
      unit: 'kg',
      quantity: '',
      description: '',
      variety: '',
      organic: false,
      harvestDate: '',
      images: [],
      imagesPreviews: []
    });
  };

  const handleProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductForm(prev => ({
          ...prev,
          images: [...prev.images, file],
          imagesPreviews: [...prev.imagesPreviews, e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Calculate Agri Score and metrics using dashboard stats or defaults
  const metrics = {
    timely_delivery: 85,
    quality: 92,
    feedback: 88,
    sales: 78
  };
  
  const agriScore = Math.round((metrics.timely_delivery + metrics.quality + metrics.feedback + metrics.sales) / 4);

  // Use dashboard stats if available for better metrics
  // Ensure transactions is always an array to prevent filter errors
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safeProducts = Array.isArray(products) ? products : [];
  
  const displayStats = dashboardStats || {
    totalProducts: safeProducts.length,
    totalOrders: safeTransactions.length,
    totalRevenue: safeTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
    pendingOrders: safeTransactions.filter(t => t.status === 'pending').length
  };

  // Generate fallback chart data if dashboard stats don't have monthly data
  const chartData = dashboardStats?.monthlyStats || [
    { month: 'Jan', value: 2500 },
    { month: 'Feb', value: 3200 },
    { month: 'Mar', value: 2800 },
    { month: 'Apr', value: 3800 },
    { month: 'May', value: 3500 }
  ];

  // Government schemes data
  const schemes = [
    {
      id: 1,
      title: 'PM-KISAN',
      description: 'Direct income support of ₹6000 per year to small and marginal farmers',
      eligibility: 'High',
      maxBenefit: 6000,
      category: 'Income Support',
      deadline: '2024-12-31',
      icon: '🌾',
      benefits: ['₹6000/year', 'Direct transfer', 'No documentation'],
      aiReasons: ['Perfect match based on your land size (2.5 acres) and crop history'],
      status: 'not-applied'
    },
    {
      id: 2,
      title: 'Crop Insurance Scheme',
      description: 'Insurance coverage for crop loss due to natural disasters',
      eligibility: 'Medium',
      maxBenefit: 200000,
      category: 'Insurance',
      deadline: '2024-11-15',
      icon: '🛡️',
      benefits: ['Up to ₹2L coverage', 'Natural disaster protection', 'Premium support'],
      aiReasons: ['Recommended due to your rice cultivation in monsoon-dependent region'],
      status: 'applied'
    },
    {
      id: 3,
      title: 'Soil Health Card',
      description: 'Free soil testing and nutrient management advice',
      eligibility: 'High',
      maxBenefit: 5000,
      category: 'Advisory',
      deadline: '2024-10-30',
      icon: '🔬',
      benefits: ['Free soil testing', 'Fertilizer recommendations', 'Yield optimization'],
      aiReasons: ['High priority - your soil test is overdue by 8 months'],
      status: 'not-applied'
    },
    {
      id: 4,
      title: 'Solar Pump Subsidy',
      description: 'Subsidized solar water pumps for irrigation',
      eligibility: 'Low',
      maxBenefit: 150000,
      category: 'Equipment',
      deadline: '2025-01-31',
      icon: '☀️',
      benefits: ['60% subsidy', 'Reduced electricity cost', 'Eco-friendly'],
      aiReasons: ['Low priority as you already have electric pump connection'],
      status: 'not-applied'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'products', label: 'Products', icon: '🌾' },
    { id: 'transactions', label: 'Transactions', icon: '💰' },
    { id: 'claims', label: 'Claims', icon: '📋' },
    { id: 'schemes', label: 'Schemes', icon: '🎯' }
  ];

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <button 
            className={styles.toggleButton}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        
        <div className={styles.profileSection}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              {farmerData?.name?.charAt(0)?.toUpperCase() || 'F'}
            </div>
            {!sidebarCollapsed && (
              <div className={styles.profileInfo}>
                <h3 className={styles.farmerName}>{farmerData?.name || 'Farmer'}</h3>
                <p className={styles.farmerId}>{farmerData?.farmerId || 'Not Verified'}</p>
              </div>
            )}
          </div>
          
          {!sidebarCollapsed && (
            <div className={styles.agriScore}>
              <ProgressRing 
                value={agriScore}
                max={100}
                size={120}
                strokeWidth={8}
                color="#16a34a"
                backgroundColor="#e5e7eb"
              >
                <div className={styles.scoreContent}>
                  <span className={styles.score}>{agriScore}</span>
                  <span className={styles.scoreLabel}>Agri Score</span>
                </div>
              </ProgressRing>
            </div>
          )}
        </div>
        
        <nav className={styles.navigation}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.navIcon}>{tab.icon}</span>
              {!sidebarCollapsed && <span className={styles.navLabel}>{tab.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.dashboardHeader}>
          <h1 className={styles.pageTitle}>
            {tabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
          </h1>
        </header>

        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <h3>Failed to load dashboard</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryButton}>
              Retry
            </button>
          </div>
        ) : (
          <div className={styles.contentArea}>
          {activeTab === 'overview' && (
            <div className={styles.overviewContent}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <h3>Timely Delivery</h3>
                  <div className={styles.metricBar}>
                    <div 
                      className={styles.metricFill} 
                      style={{width: `${metrics.timely_delivery}%`}}
                    ></div>
                  </div>
                  <p className={styles.statValue}>{metrics.timely_delivery}%</p>
                </div>
                <div className={styles.statCard}>
                  <h3>Quality Score</h3>
                  <div className={styles.metricBar}>
                    <div 
                      className={styles.metricFill} 
                      style={{width: `${metrics.quality}%`}}
                    ></div>
                  </div>
                  <p className={styles.statValue}>{metrics.quality}%</p>
                </div>
                <div className={styles.statCard}>
                  <h3>Customer Feedback</h3>
                  <div className={styles.metricBar}>
                    <div 
                      className={styles.metricFill} 
                      style={{width: `${metrics.feedback}%`}}
                    ></div>
                  </div>
                  <p className={styles.statValue}>{metrics.feedback}%</p>
                </div>
                <div className={styles.statCard}>
                  <h3>Sales Performance</h3>
                  <div className={styles.metricBar}>
                    <div 
                      className={styles.metricFill} 
                      style={{width: `${metrics.sales}%`}}
                    ></div>
                  </div>
                  <p className={styles.statValue}>{metrics.sales}%</p>
                </div>
              </div>

              {/* Enhanced Agri Score Section */}
              <div className={styles.agriScoreSection}>
                <h2>Agri Score Analysis</h2>
                <div className={styles.scoreDisplay}>
                  <ProgressRing 
                    value={agriScore}
                    max={100}
                    size={200}
                    strokeWidth={12}
                    color="#16a34a"
                    backgroundColor="#e5e7eb"
                  >
                    <div className={styles.scoreContent}>
                      <span className={styles.bigScore}>{agriScore}</span>
                      <span className={styles.scoreLabel}>Agri Score</span>
                      <span className={styles.scoreGrade}>Excellent</span>
                    </div>
                  </ProgressRing>
                  <div className={styles.scoreBreakdown}>
                    <h3>Score Breakdown:</h3>
                    <ul>
                      <li>Timely Delivery: {metrics.timely_delivery}%</li>
                      <li>Quality: {metrics.quality}%</li>
                      <li>Feedback: {metrics.feedback}%</li>
                      <li>Sales: {metrics.sales}%</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className={styles.transactionsContent}>
              <div className={styles.transactionsSummary}>
                <h2>Transactions Overview</h2>
                <div className={styles.summaryCards}>
                  <div className={styles.summaryCard}>
                    <h3>Total Transactions</h3>
                    <p className={styles.summaryValue}>{displayStats.totalOrders}</p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h3>Monthly Revenue</h3>
                    <p className={styles.summaryValue}>₹{displayStats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h3>Products Sold</h3>
                    <p className={styles.summaryValue}>{displayStats.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className={styles.transactionsList}>
                <h3>Recent Transactions</h3>
                <div className={styles.transactionsTable}>
                  <div className={styles.tableHeader}>
                    <span>Date</span>
                    <span>Buyer</span>
                    <span>Product</span>
                    <span>Quantity</span>
                    <span>Amount</span>
                    <span>Status</span>
                  </div>
                  {transactions.map(transaction => (
                    <div key={transaction.id} className={styles.tableRow}>
                      <span>{transaction.date}</span>
                      <span>{transaction.buyer}</span>
                      <span>{transaction.productName}</span>
                      <span>{transaction.quantity} {transaction.unit}</span>
                      <span>₹{transaction.totalAmount.toLocaleString()}</span>
                      <span className={`${styles.status} ${styles[transaction.status.toLowerCase()]}`}>
                        {transaction.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simple Revenue Chart */}
              <div className={styles.chartSection}>
                <h3>Weekly Revenue Trend</h3>
                <div className={styles.simpleChart}>
                  <svg viewBox="0 0 400 200" className={styles.chartSvg}>
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="400" height="200" fill="url(#grid)" />
                    
                    {/* Chart line */}
                    <polyline
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={chartData.map((point, index) => 
                        `${50 + index * 45},${180 - (point.revenue || point.value || 0) / 4000 * 160}`
                      ).join(' ')}
                    />
                    
                    {/* Data points */}
                    {chartData.map((point, index) => (
                      <circle
                        key={index}
                        cx={50 + index * 45}
                        cy={180 - (point.revenue || point.value || 0) / 4000 * 160}
                        r="4"
                        fill="#16a34a"
                        stroke="white"
                        strokeWidth="2"
                      />
                    ))}
                    
                    {/* X-axis labels */}
                    {chartData.map((point, index) => (
                      <text
                        key={index}
                        x={50 + index * 45}
                        y="195"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#6b7280"
                      >
                        {point.month || point.day || `${index + 1}`}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className={styles.productsContent}>
              <div className={styles.productsHeader}>
                <h2>My Products</h2>
                <button 
                  className={styles.addProductButton}
                  onClick={() => {
                    setEditingProduct(null);
                    resetProductForm();
                    setShowProductModal(true);
                  }}
                >
                  + Add New Product
                </button>
              </div>

              {products.length === 0 ? (
                <div className={styles.emptyState}>
                  <h3>No products listed yet</h3>
                  <p>Start by adding your first product to the marketplace</p>
                  <button 
                    className={styles.addProductButton}
                    onClick={() => {
                      setEditingProduct(null);
                      resetProductForm();
                      setShowProductModal(true);
                    }}
                  >
                    Add Your First Product
                  </button>
                </div>
              ) : (
                <div className={styles.productsGrid}>
                  {products.map(product => (
                    <ProductCard 
                      key={product.id}
                      product={{
                        ...product,
                        imagePreview: product.image || product.imagePreview,
                        status: product.status || 'active',
                        datePosted: product.datePosted || product.createdAt || new Date().toISOString(),
                        farmerId: product.farmer_id || 'FARMER001'
                      }}
                      onEdit={() => handleEditProduct(product)}
                      onDelete={() => handleDeleteProduct(product.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'claims' && (
            <div className={styles.claimsContent}>
              <div className={styles.claimsHeader}>
                <h2>Insurance Claims</h2>
                <button 
                  className={styles.newClaimButton}
                  onClick={() => setShowClaimModal(true)}
                >
                  + New Claim
                </button>
              </div>

              {claims.length === 0 ? (
                <div className={styles.emptyState}>
                  <h3>No claims submitted yet</h3>
                  <p>Submit insurance claims for crop damage or loss</p>
                  <button 
                    className={styles.newClaimButton}
                    onClick={() => setShowClaimModal(true)}
                  >
                    Submit Your First Claim
                  </button>
                </div>
              ) : (
                <div className={styles.claimsGrid}>
                  {claims.map(claim => (
                    <div key={claim.id} className={styles.claimCard}>
                      <div className={styles.claimHeader}>
                        <h3>{claim.type}</h3>
                        <span className={`${styles.claimStatus} ${styles[claim.status.toLowerCase()]}`}>
                          {claim.status}
                        </span>
                      </div>
                      <p className={styles.claimDescription}>{claim.description}</p>
                      <div className={styles.claimInfo}>
                        <span>Submitted: {claim.submittedDate}</span>
                        <span>Amount: ₹{claim.amount.toLocaleString()}</span>
                      </div>
                      {claim.imagesPreviews && claim.imagesPreviews.length > 0 && (
                        <div className={styles.claimImages}>
                          {claim.imagesPreviews.slice(0, 3).map((img, idx) => (
                            <img key={idx} src={img} alt={`Claim evidence ${idx + 1}`} />
                          ))}
                          {claim.imagesPreviews.length > 3 && (
                            <div className={styles.moreImages}>
                              +{claim.imagesPreviews.length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'schemes' && (
            <div className={styles.schemesContent}>
              <div className={styles.schemesHeader}>
                <h2>Government Schemes</h2>
                <p>AI-powered eligibility analysis based on your profile</p>
              </div>
              
              <div className={styles.schemesGrid}>
                {schemes.map((scheme, index) => (
                  <SchemeCard 
                    key={scheme.id} 
                    scheme={scheme}
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        )}
      </main>

      {/* Claims Modal */}
      {showClaimModal && (
        <Modal onClose={() => setShowClaimModal(false)}>
          <form className={styles.claimForm} onSubmit={handleClaimSubmit}>
            <h2>Submit Insurance Claim</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="claimType">Claim Type *</label>
              <select
                id="claimType"
                value={claimForm.type}
                onChange={(e) => setClaimForm(prev => ({ ...prev, type: e.target.value }))}
                required
              >
                <option value="">Select Claim Type</option>
                <option value="Crop Damage">Crop Damage</option>
                <option value="Weather Loss">Weather Loss</option>
                <option value="Pest Attack">Pest Attack</option>
                <option value="Equipment Damage">Equipment Damage</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="claimDescription">Description *</label>
              <textarea
                id="claimDescription"
                value={claimForm.description}
                onChange={(e) => setClaimForm(prev => ({ ...prev, description: e.target.value }))}
                required
                rows="4"
                placeholder="Describe the damage or loss in detail..."
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="claimImages">Evidence Images</label>
              <input
                type="file"
                id="claimImages"
                accept="image/*"
                multiple
                onChange={handleClaimImageChange}
                className={styles.imageInput}
              />
              {claimForm.imagesPreviews.length > 0 && (
                <div className={styles.claimImagePreviews}>
                  {claimForm.imagesPreviews.map((img, idx) => (
                    <img key={idx} src={img} alt={`Evidence ${idx + 1}`} />
                  ))}
                </div>
              )}
            </div>

            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => setShowClaimModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                Submit Claim
              </button>
            </div>
          </form>
        </Modal>
      )}
      
      {/* Product Modal */}
      {showProductModal && (
        <Modal onClose={() => setShowProductModal(false)}>
          <form className={styles.productForm} onSubmit={handleProductSubmit}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="productName">Product Name *</label>
                <input
                  id="productName"
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Fresh Organic Tomatoes"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="productCategory">Category *</label>
                <select
                  id="productCategory"
                  value={productForm.category}
                  onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                  required
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Herbs">Herbs</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="productPrice">Price per Unit *</label>
                <input
                  id="productPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="₹0.00"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="productUnit">Unit</label>
                <select
                  id="productUnit"
                  value={productForm.unit}
                  onChange={(e) => setProductForm(prev => ({ ...prev, unit: e.target.value }))}
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="l">liter</option>
                  <option value="piece">piece</option>
                  <option value="dozen">dozen</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="productQuantity">Available Quantity *</label>
                <input
                  id="productQuantity"
                  type="number"
                  min="0"
                  value={productForm.quantity}
                  onChange={(e) => setProductForm(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="e.g., 100"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="productVariety">Variety</label>
                <input
                  id="productVariety"
                  type="text"
                  value={productForm.variety}
                  onChange={(e) => setProductForm(prev => ({ ...prev, variety: e.target.value }))}
                  placeholder="e.g., Cherry, Roma, Beefsteak"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="harvestDate">Harvest Date</label>
                <input
                  id="harvestDate"
                  type="date"
                  value={productForm.harvestDate}
                  onChange={(e) => setProductForm(prev => ({ ...prev, harvestDate: e.target.value }))}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="productDescription">Description</label>
              <textarea
                id="productDescription"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your product, growing methods, quality, etc."
                rows="3"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={productForm.organic}
                  onChange={(e) => setProductForm(prev => ({ ...prev, organic: e.target.checked }))}
                />
                Certified Organic
              </label>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="productImages">Product Images</label>
              <input
                id="productImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleProductImageChange}
              />
              {productForm.imagesPreviews.length > 0 && (
                <div className={styles.productImagePreviews}>
                  {productForm.imagesPreviews.map((img, idx) => (
                    <img key={idx} src={img} alt={`Product ${idx + 1}`} />
                  ))}
                </div>
              )}
            </div>

            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                  resetProductForm();
                }}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
            </div>
          </form>
        </Modal>
      )}
      
      {/* Chat Widget */}
      <ChatWidget 
        userType="farmer"
        intentPresets={[
          { text: '📊 Market Prices', intent: 'market_prices' },
          { text: '📦 List New Product', intent: 'list_product' },
          { text: '💰 Check Wallet', intent: 'wallet_balance' },
          { text: '📈 Sales Analytics', intent: 'sales_analytics' },
          { text: '🌾 Crop Advisory', intent: 'crop_advisory' },
          { text: '📞 Support Help', intent: 'support' }
        ]}
      />
    </div>
  );
};

export default FarmerDashboard;
