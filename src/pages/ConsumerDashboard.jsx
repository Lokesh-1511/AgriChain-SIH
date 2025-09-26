import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import mockProducts from '../data/mockProducts.json';
import styles from '../styles/ConsumerDashboard.module.css';
import QRPreview from '../components/QRPreview';
import ChatWidget from '../components/ChatWidget';

const ConsumerProductCard = ({ product, onShowQR }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart(product);
    setAddingToCart(false);
  };

  const handleTrace = () => {
    navigate(`/trace/${product.id}`);
  };

  const handleQRPreview = (e) => {
    e.stopPropagation();
    onShowQR(product);
  };

  const getAgriScoreColor = (score) => {
    if (score >= 90) return styles.scoreExcellent;
    if (score >= 80) return styles.scoreGood;
    if (score >= 70) return styles.scoreFair;
    return styles.scorePoor;
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        <img 
          src={product.image} 
          alt={product.name}
          onError={(e) => {
            e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="%23666">${product.category}</text></svg>`;
          }}
        />
        <div className={styles.productBadges}>
          <span className={`${styles.agriScoreBadge} ${getAgriScoreColor(product.agriScore)}`}>
            Agri Score: {product.agriScore}
          </span>
        </div>
      </div>

      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productDescription}>{product.description}</p>
        
        <div className={styles.productMeta}>
          <div className={styles.farmerInfo}>
            <span className={styles.farmerName}>{product.farmer.name}</span>
            <span className={styles.farmerLocation}>{product.location}</span>
          </div>
          <div className={styles.harvestDate}>
            Harvested: {new Date(product.harvestDate).toLocaleDateString()}
          </div>
        </div>

        <div className={styles.productPricing}>
          <span className={styles.price}>₹{product.price}</span>
          <span className={styles.unit}>per {product.unit}</span>
          <span className={styles.availability}>
            {product.quantity} {product.unit} available
          </span>
        </div>

        <div className={styles.certifications}>
          {product.certifications.map((cert, index) => (
            <span key={index} className={styles.certBadge}>{cert}</span>
          ))}
        </div>

        <div className={styles.productActions}>
          <button 
            className={styles.addToCartBtn}
            onClick={handleAddToCart}
            disabled={addingToCart || product.quantity === 0}
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
          <button 
            className={styles.traceBtn}
            onClick={handleTrace}
          >
            👁️ Trace
          </button>
          <button 
            className={styles.qrBtn}
            onClick={handleQRPreview}
            title="View QR Code"
          >
            📱 QR
          </button>
        </div>
      </div>
    </div>
  );
};

const ConsumerDashboard = () => {
  const [products] = useState(mockProducts.products);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts.products);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { cart } = useCart();
  const navigate = useNavigate();

  const handleShowQR = (product) => {
    setSelectedProduct(product);
    setShowQRModal(true);
  };

  const handleCloseQR = () => {
    setShowQRModal(false);
    setSelectedProduct(null);
  };

  // Filter products based on selected filters
  const applyFilters = () => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Location filter
    if (selectedLocation !== 'All Locations') {
      filtered = filtered.filter(product => product.location === selectedLocation);
    }

    // Price range filter
    if (priceRange.min !== '') {
      filtered = filtered.filter(product => product.price >= parseInt(priceRange.min));
    }
    if (priceRange.max !== '') {
      filtered = filtered.filter(product => product.price <= parseInt(priceRange.max));
    }

    setFilteredProducts(filtered);
  };

  // Apply filters whenever filter criteria changes
  React.useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedLocation, priceRange]);

  return (
    <div className={styles.consumerDashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>AgriChain Marketplace</h1>
          <p>Fresh produce directly from farmers</p>
          <div className={styles.cartIcon} onClick={() => navigate('/cart')}>
            <span className={styles.cartBadge}>{cart.totalItems}</span>
            🛒 Cart
          </div>
        </div>
      </header>

      <div className={styles.filtersSection}>
        <div className={styles.filtersContainer}>
          <h2>Filter Products</h2>
          
          {/* Category Tabs */}
          <div className={styles.categoryTabs}>
            {mockProducts.categories.map(category => (
              <button
                key={category}
                className={`${styles.categoryTab} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className={styles.filtersRow}>
            {/* Location Filter */}
            <div className={styles.filterGroup}>
              <label>Location:</label>
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)}
                className={styles.locationSelect}
              >
                {mockProducts.locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className={styles.filterGroup}>
              <label>Price Range (₹):</label>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className={styles.priceInput}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className={styles.priceInput}
                />
              </div>
            </div>

            <div className={styles.resultCount}>
              {filteredProducts.length} products found
            </div>
          </div>
        </div>
      </div>

      <main className={styles.productsSection}>
        <div className={styles.productsGrid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ConsumerProductCard 
                key={product.id} 
                product={product} 
                onShowQR={handleShowQR}
              />
            ))
          ) : (
            <div className={styles.noProducts}>
              <h3>No products found</h3>
              <p>Try adjusting your filters to see more results</p>
            </div>
          )}
        </div>
      </main>
      
      {/* QR Modal */}
      {showQRModal && selectedProduct && (
        <QRPreview
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          onClose={handleCloseQR}
        />
      )}
      
      {/* Chat Widget */}
      <ChatWidget 
        userType="consumer"
        intentPresets={[
          { text: '🛒 Find Fresh Products', intent: 'find_products' },
          { text: '📍 Track My Order', intent: 'track_order' },
          { text: '💳 Payment Help', intent: 'payment_help' },
          { text: '🔍 Product Quality Info', intent: 'quality_info' },
          { text: '🚚 Delivery Options', intent: 'delivery_info' },
          { text: '💰 Best Deals Today', intent: 'deals_offers' }
        ]}
      />
    </div>
  );
};

export default ConsumerDashboard;