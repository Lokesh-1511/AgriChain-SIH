import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/OrderTracking.module.css';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load order from localStorage
    const orders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    const foundOrder = orders.find(o => o.id === orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
    }
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <div className={styles.orderTracking}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.orderTracking}>
        <div className={styles.orderNotFound}>
          <h2>Order Not Found</h2>
          <p>We couldn't find an order with ID: {orderId}</p>
          <button onClick={() => navigate('/consumer')}>
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const orderSteps = [
    {
      id: 'confirmed',
      title: 'Order Confirmed',
      description: 'Your order has been placed successfully',
      icon: '✅',
      completed: true,
      timestamp: order.orderDate
    },
    {
      id: 'processing',
      title: 'Processing',
      description: 'Farmer is preparing your order',
      icon: '📦',
      completed: true,
      timestamp: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes later
    },
    {
      id: 'shipped',
      title: 'Shipped',
      description: 'Your order is on the way',
      icon: '🚚',
      completed: false,
      timestamp: null
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Order delivered successfully',
      icon: '🏠',
      completed: false,
      timestamp: null
    }
  ];

  const getStepStatus = (step) => {
    if (step.completed) return 'completed';
    if (step.id === 'shipped' && orderSteps.find(s => s.id === 'processing').completed) {
      return 'active';
    }
    return 'pending';
  };

  return (
    <div className={styles.orderTracking}>
      <div className={styles.trackingContainer}>
        {/* Order Header */}
        <div className={styles.orderHeader}>
          <div className={styles.orderInfo}>
            <h1>Order #{order.id}</h1>
            <p>Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
            <div className={styles.orderStatus}>
              <span className={`${styles.statusBadge} ${styles.confirmed}`}>
                Confirmed
              </span>
            </div>
          </div>
          
          <div className={styles.orderValue}>
            <span className={styles.totalAmount}>₹{order.total.toLocaleString()}</span>
            <p>{order.items.length} items</p>
          </div>
        </div>

        {/* Tracking Progress */}
        <div className={styles.trackingProgress}>
          <h2>Order Progress</h2>
          <div className={styles.progressSteps}>
            {orderSteps.map((step, index) => (
              <div key={step.id} className={`${styles.progressStep} ${styles[getStepStatus(step)]}`}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepContent}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  {step.timestamp && (
                    <span className={styles.stepTime}>
                      {new Date(step.timestamp).toLocaleString()}
                    </span>
                  )}
                </div>
                {index < orderSteps.length - 1 && (
                  <div className={`${styles.stepConnector} ${step.completed ? styles.completed : ''}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Information */}
        <div className={styles.deliveryInfo}>
          <h2>Delivery Information</h2>
          <div className={styles.deliveryCard}>
            <div className={styles.deliveryAddress}>
              <h3>Delivery Address</h3>
              <p><strong>{order.deliveryInfo.fullName}</strong></p>
              <p>{order.deliveryInfo.phone}</p>
              <p>{order.deliveryInfo.address}</p>
              <p>{order.deliveryInfo.city}, {order.deliveryInfo.state} - {order.deliveryInfo.pincode}</p>
            </div>
            
            <div className={styles.estimatedDelivery}>
              <h3>Estimated Delivery</h3>
              <p className={styles.deliveryDate}>
                {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className={styles.deliveryTime}>By 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className={styles.orderItems}>
          <h2>Order Items</h2>
          <div className={styles.itemsList}>
            {order.items.map(item => (
              <div key={item.id} className={styles.orderItem}>
                <div className={styles.itemImage}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="12" fill="%23666">Product</text></svg>`;
                    }}
                  />
                </div>
                
                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p>by {item.farmer.name}</p>
                  <p>{item.location}</p>
                  <div className={styles.itemMeta}>
                    <span>Quantity: {item.quantity}</span>
                    <span>₹{item.price} per {item.unit}</span>
                  </div>
                </div>
                
                <div className={styles.itemPrice}>
                  ₹{(item.quantity * item.price).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain Information */}
        <div className={styles.blockchainInfo}>
          <h2>Blockchain Transaction</h2>
          <div className={styles.blockchainCard}>
            <div className={styles.txInfo}>
              <div className={styles.txRow}>
                <span>Transaction Hash:</span>
                <code className={styles.txHash}>{order.txHash}</code>
              </div>
              <div className={styles.txRow}>
                <span>Network:</span>
                <span>AgriChain Testnet</span>
              </div>
              <div className={styles.txRow}>
                <span>Status:</span>
                <span className={styles.confirmed}>Confirmed</span>
              </div>
              <div className={styles.txRow}>
                <span>Smart Contract:</span>
                <span>Escrow Active</span>
              </div>
            </div>
            
            <button className={styles.viewOnExplorer}>
              View on Blockchain Explorer
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button 
            onClick={() => navigate('/consumer')}
            className={styles.continueShoppingBtn}
          >
            Continue Shopping
          </button>
          
          <button className={styles.supportBtn}>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;