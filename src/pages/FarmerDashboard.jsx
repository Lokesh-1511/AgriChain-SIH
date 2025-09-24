import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Modal from '../components/Modal';
import ProductCard from '../components/ProductCard';
import styles from '../styles/FarmerDashboard.module.css';

const FarmerDashboard = () => {
  const { t } = useLanguage();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPostProductModal, setShowPostProductModal] = useState(false);
  const [farmerData, setFarmerData] = useState(null);
  const [products, setProducts] = useState([]);
  
  const [postProductForm, setPostProductForm] = useState({
    name: '',
    price: '',
    quantity: '',
    unit: 'kg',
    category: '',
    image: null,
    imagePreview: null
  });

  // Load farmer data and products from localStorage
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setFarmerData(currentUser);
    
    const storedProducts = JSON.parse(localStorage.getItem(`farmer_products_${currentUser.email}`) || '[]');
    setProducts(storedProducts);
  }, []);

  // Mock Agri Score calculation
  const calculateAgriScore = () => {
    const baseScore = 650;
    const productBonus = products.length * 15;
    const verificationBonus = farmerData?.farmerId ? 100 : 0;
    return Math.min(baseScore + productBonus + verificationBonus, 850);
  };

  const handlePostProductSubmit = (e) => {
    e.preventDefault();
    
    const newProduct = {
      id: Date.now().toString(),
      ...postProductForm,
      farmerId: farmerData?.farmerId || 'UNVERIFIED',
      farmerName: farmerData?.name || 'Unknown',
      datePosted: new Date().toISOString(),
      status: 'active'
    };
    
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    
    // Store in localStorage
    localStorage.setItem(`farmer_products_${farmerData.email}`, JSON.stringify(updatedProducts));
    
    // Reset form and close modal
    setPostProductForm({
      name: '',
      price: '',
      quantity: '',
      unit: 'kg',
      category: '',
      image: null,
      imagePreview: null
    });
    setShowPostProductModal(false);
    
    // Show success message
    alert('Product posted successfully!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPostProductForm(prev => ({
          ...prev,
          image: file,
          imagePreview: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem(`farmer_products_${farmerData.email}`, JSON.stringify(updatedProducts));
    }
  };

  const handleEditProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setPostProductForm({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        unit: product.unit,
        category: product.category,
        image: product.image,
        imagePreview: product.imagePreview
      });
      setShowPostProductModal(true);
    }
  };

  const agriScore = calculateAgriScore();
  const scorePercentage = (agriScore / 850) * 100;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'products', label: 'Products', icon: '🌾' },
    { id: 'transactions', label: 'Transactions', icon: '💰' },
    { id: 'claims', label: 'Claims', icon: '📋' },
    { id: 'schemes', label: 'Schemes', icon: '🎯' }
  ];

  const categories = [
    'Grains', 'Vegetables', 'Fruits', 'Pulses', 'Spices', 'Dairy', 'Other'
  ];

  const units = ['kg', 'quintal', 'ton', 'piece', 'dozen', 'liter'];

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
              <div className={styles.scoreRing}>
                <svg className={styles.scoreCircle} viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="6"
                    strokeDasharray={`${scorePercentage * 2.83} 283`}
                    strokeLinecap="round"
                    className={styles.progressCircle}
                  />
                </svg>
                <div className={styles.scoreText}>
                  <span className={styles.score}>{agriScore}</span>
                  <span className={styles.scoreLabel}>Agri Score</span>
                </div>
              </div>
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
          
          {activeTab === 'products' && (
            <button 
              className={styles.postProductButton}
              onClick={() => setShowPostProductModal(true)}
            >
              + Post Product
            </button>
          )}
        </header>

        <div className={styles.contentArea}>
          {activeTab === 'overview' && (
            <div className={styles.overviewContent}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <h3>Total Products</h3>
                  <p className={styles.statValue}>{products.length}</p>
                </div>
                <div className={styles.statCard}>
                  <h3>Active Listings</h3>
                  <p className={styles.statValue}>{products.filter(p => p.status === 'active').length}</p>
                </div>
                <div className={styles.statCard}>
                  <h3>Total Revenue</h3>
                  <p className={styles.statValue}>₹0</p>
                </div>
                <div className={styles.statCard}>
                  <h3>Agri Score</h3>
                  <p className={styles.statValue}>{agriScore}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className={styles.productsContent}>
              {products.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No products posted yet.</p>
                  <button 
                    className={styles.postProductButton}
                    onClick={() => setShowPostProductModal(true)}
                  >
                    Post Your First Product
                  </button>
                </div>
              ) : (
                <div className={styles.productsList}>
                  {products.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className={styles.placeholderContent}>
              <p>Transactions feature coming soon...</p>
            </div>
          )}

          {activeTab === 'claims' && (
            <div className={styles.placeholderContent}>
              <p>Claims feature coming soon...</p>
            </div>
          )}

          {activeTab === 'schemes' && (
            <div className={styles.placeholderContent}>
              <p>Government schemes feature coming soon...</p>
            </div>
          )}
        </div>
      </main>

      {/* Post Product Modal */}
      {showPostProductModal && (
        <Modal
          title="Post New Product"
          onClose={() => setShowPostProductModal(false)}
        >
          <form onSubmit={handlePostProductSubmit} className={styles.postProductForm}>
            <div className={styles.formGroup}>
              <label htmlFor="productName">Product Name *</label>
              <input
                type="text"
                id="productName"
                value={postProductForm.name}
                onChange={(e) => setPostProductForm(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="e.g., Fresh Tomatoes"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="price">Price (₹) *</label>
                <input
                  type="number"
                  id="price"
                  value={postProductForm.price}
                  onChange={(e) => setPostProductForm(prev => ({ ...prev, price: e.target.value }))}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  value={postProductForm.quantity}
                  onChange={(e) => setPostProductForm(prev => ({ ...prev, quantity: e.target.value }))}
                  required
                  min="1"
                  placeholder="1"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="unit">Unit *</label>
                <select
                  id="unit"
                  value={postProductForm.unit}
                  onChange={(e) => setPostProductForm(prev => ({ ...prev, unit: e.target.value }))}
                  required
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={postProductForm.category}
                onChange={(e) => setPostProductForm(prev => ({ ...prev, category: e.target.value }))}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="productImage">Product Image</label>
              <input
                type="file"
                id="productImage"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.imageInput}
              />
              {postProductForm.imagePreview && (
                <div className={styles.imagePreview}>
                  <img src={postProductForm.imagePreview} alt="Product preview" />
                </div>
              )}
            </div>

            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => setShowPostProductModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                Post Product
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FarmerDashboard;