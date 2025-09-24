import React from 'react';
import styles from '../styles/ProductCard.module.css';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'sold':
        return styles.statusSold;
      case 'expired':
        return styles.statusExpired;
      default:
        return styles.statusDefault;
    }
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        {product.imagePreview ? (
          <img 
            src={product.imagePreview} 
            alt={product.name}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span className={styles.placeholderIcon}>🌾</span>
          </div>
        )}
        <div className={`${styles.statusBadge} ${getStatusColor(product.status)}`}>
          {product.status}
        </div>
      </div>

      <div className={styles.productInfo}>
        <div className={styles.productHeader}>
          <h3 className={styles.productName}>{product.name}</h3>
          <span className={styles.category}>{product.category}</span>
        </div>

        <div className={styles.productDetails}>
          <div className={styles.priceQuantity}>
            <span className={styles.price}>
              {formatPrice(product.price)}
              <span className={styles.unit}>/{product.unit}</span>
            </span>
            <span className={styles.quantity}>
              {product.quantity} {product.unit} available
            </span>
          </div>

          <div className={styles.metadata}>
            <span className={styles.datePosted}>
              Posted: {formatDate(product.datePosted)}
            </span>
            <span className={styles.farmerId}>
              ID: {product.farmerId}
            </span>
          </div>
        </div>

        <div className={styles.productActions}>
          <button 
            className={styles.editButton}
            onClick={() => onEdit(product.id)}
            aria-label="Edit product"
          >
            ✏️ Edit
          </button>
          <button 
            className={styles.deleteButton}
            onClick={() => onDelete(product.id)}
            aria-label="Delete product"
          >
            🗑️ Delete
          </button>
          <button 
            className={styles.viewButton}
            onClick={() => alert('View details feature coming soon!')}
            aria-label="View product details"
          >
            👁️ View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;