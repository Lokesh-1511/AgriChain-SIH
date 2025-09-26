import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import SmartContractModal from '../components/SmartContractModal';
import styles from '../styles/Checkout.module.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showSmartContract, setShowSmartContract] = useState(false);
  
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: 'John Doe',
    phone: '+91 9876543210',
    address: '123 Main Street, Sector 45',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122001',
    deliveryType: 'delivery', // 'delivery' or 'pickup'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'upi', // 'upi', 'wallet', 'card'
    upiId: '',
    walletBalance: 5000,
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  if (cart.items.length === 0) {
    return (
      <div className={styles.checkout}>
        <div className={styles.emptyCheckout}>
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/consumer')}>
            Go to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const handleDeliveryInfoChange = (field, value) => {
    setDeliveryInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentInfoChange = (field, value) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    setShowSmartContract(true);
  };

  const handleOrderComplete = (txHash) => {
    // Create mock order
    const order = {
      id: `ORD-${Date.now()}`,
      items: cart.items,
      total: getCartTotal(),
      status: 'confirmed',
      deliveryInfo,
      paymentInfo,
      txHash,
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('mockOrders', JSON.stringify(existingOrders));

    // Clear cart and navigate to tracking
    clearCart();
    navigate(`/order-tracking/${order.id}`);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <h2>Delivery Information</h2>
            
            <div className={styles.deliveryOptions}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="deliveryType"
                  value="delivery"
                  checked={deliveryInfo.deliveryType === 'delivery'}
                  onChange={(e) => handleDeliveryInfoChange('deliveryType', e.target.value)}
                />
                <span>Home Delivery (Free)</span>
              </label>
              
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="deliveryType"
                  value="pickup"
                  checked={deliveryInfo.deliveryType === 'pickup'}
                  onChange={(e) => handleDeliveryInfoChange('deliveryType', e.target.value)}
                />
                <span>Self Pickup</span>
              </label>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  value={deliveryInfo.fullName}
                  onChange={(e) => handleDeliveryInfoChange('fullName', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={deliveryInfo.phone}
                  onChange={(e) => handleDeliveryInfoChange('phone', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Address</label>
                <textarea
                  value={deliveryInfo.address}
                  onChange={(e) => handleDeliveryInfoChange('address', e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label>City</label>
                <input
                  type="text"
                  value={deliveryInfo.city}
                  onChange={(e) => handleDeliveryInfoChange('city', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>State</label>
                <input
                  type="text"
                  value={deliveryInfo.state}
                  onChange={(e) => handleDeliveryInfoChange('state', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>PIN Code</label>
                <input
                  type="text"
                  value={deliveryInfo.pincode}
                  onChange={(e) => handleDeliveryInfoChange('pincode', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <h2>Payment Method</h2>
            
            <div className={styles.paymentMethods}>
              <div className={`${styles.paymentOption} ${paymentInfo.method === 'upi' ? styles.selected : ''}`}
                   onClick={() => handlePaymentInfoChange('method', 'upi')}>
                <div className={styles.paymentIcon}>📱</div>
                <div>
                  <h3>UPI Payment</h3>
                  <p>Pay using any UPI app</p>
                </div>
              </div>

              <div className={`${styles.paymentOption} ${paymentInfo.method === 'wallet' ? styles.selected : ''}`}
                   onClick={() => handlePaymentInfoChange('method', 'wallet')}>
                <div className={styles.paymentIcon}>💳</div>
                <div>
                  <h3>Digital Wallet</h3>
                  <p>Balance: ₹{paymentInfo.walletBalance.toLocaleString()}</p>
                </div>
              </div>

              <div className={`${styles.paymentOption} ${paymentInfo.method === 'card' ? styles.selected : ''}`}
                   onClick={() => handlePaymentInfoChange('method', 'card')}>
                <div className={styles.paymentIcon}>💳</div>
                <div>
                  <h3>Credit/Debit Card</h3>
                  <p>All major cards accepted</p>
                </div>
              </div>
            </div>

            {paymentInfo.method === 'upi' && (
              <div className={styles.paymentDetails}>
                <div className={styles.formGroup}>
                  <label>UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@paytm"
                    value={paymentInfo.upiId}
                    onChange={(e) => handlePaymentInfoChange('upiId', e.target.value)}
                  />
                </div>
              </div>
            )}

            {paymentInfo.method === 'wallet' && (
              <div className={styles.paymentDetails}>
                <div className={styles.walletInfo}>
                  <p>Available Balance: ₹{paymentInfo.walletBalance.toLocaleString()}</p>
                  <p>Amount to pay: ₹{getCartTotal().toLocaleString()}</p>
                  {getCartTotal() > paymentInfo.walletBalance && (
                    <p className={styles.error}>Insufficient wallet balance</p>
                  )}
                </div>
              </div>
            )}

            {paymentInfo.method === 'card' && (
              <div className={styles.paymentDetails}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => handlePaymentInfoChange('cardNumber', e.target.value)}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentInfo.cardExpiry}
                      onChange={(e) => handlePaymentInfoChange('cardExpiry', e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={paymentInfo.cardCvv}
                      onChange={(e) => handlePaymentInfoChange('cardCvv', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className={styles.stepContent}>
            <h2>Order Review</h2>
            
            <div className={styles.orderSummary}>
              <h3>Items ({cart.totalItems})</h3>
              {cart.items.map(item => (
                <div key={item.id} className={styles.reviewItem}>
                  <img src={item.image} alt={item.name} onError={(e) => {
                    e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect width="60" height="60" fill="%23f0f0f0"/></svg>`;
                  }} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.quantity} × ₹{item.price}</p>
                  </div>
                  <span>₹{(item.quantity * item.price).toLocaleString()}</span>
                </div>
              ))}
              
              <div className={styles.reviewTotal}>
                <strong>Total: ₹{getCartTotal().toLocaleString()}</strong>
              </div>
            </div>

            <div className={styles.deliverySummary}>
              <h3>Delivery Information</h3>
              <p><strong>{deliveryInfo.fullName}</strong></p>
              <p>{deliveryInfo.phone}</p>
              <p>{deliveryInfo.address}</p>
              <p>{deliveryInfo.city}, {deliveryInfo.state} - {deliveryInfo.pincode}</p>
              <p>Delivery Type: {deliveryInfo.deliveryType === 'delivery' ? 'Home Delivery' : 'Self Pickup'}</p>
            </div>

            <div className={styles.paymentSummary}>
              <h3>Payment Method</h3>
              <p>
                {paymentInfo.method === 'upi' && `UPI: ${paymentInfo.upiId || 'Not specified'}`}
                {paymentInfo.method === 'wallet' && `Digital Wallet (Balance: ₹${paymentInfo.walletBalance.toLocaleString()})`}
                {paymentInfo.method === 'card' && `Card ending in ${paymentInfo.cardNumber.slice(-4) || 'XXXX'}`}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.checkout}>
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutSteps}>
          <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''} ${currentStep > 1 ? styles.completed : ''}`}>
            <span>1</span>
            <span>Delivery</span>
          </div>
          <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''} ${currentStep > 2 ? styles.completed : ''}`}>
            <span>2</span>
            <span>Payment</span>
          </div>
          <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}>
            <span>3</span>
            <span>Review</span>
          </div>
        </div>

        <div className={styles.checkoutContent}>
          <div className={styles.checkoutForm}>
            {renderStepContent()}

            <div className={styles.checkoutActions}>
              {currentStep > 1 && (
                <button 
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className={styles.backBtn}
                >
                  Back
                </button>
              )}
              
              {currentStep < 3 ? (
                <button 
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className={styles.nextBtn}
                >
                  Next
                </button>
              ) : (
                <button 
                  onClick={handlePlaceOrder}
                  className={styles.placeOrderBtn}
                  disabled={
                    (paymentInfo.method === 'wallet' && getCartTotal() > paymentInfo.walletBalance) ||
                    (paymentInfo.method === 'upi' && !paymentInfo.upiId)
                  }
                >
                  Place Order - ₹{getCartTotal().toLocaleString()}
                </button>
              )}
            </div>
          </div>

          <div className={styles.checkoutSidebar}>
            <h3>Order Summary</h3>
            <div className={styles.sidebarItems}>
              {cart.items.map(item => (
                <div key={item.id} className={styles.sidebarItem}>
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className={styles.sidebarTotal}>
              <strong>Total: ₹{getCartTotal().toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>

      {showSmartContract && (
        <SmartContractModal 
          onComplete={handleOrderComplete}
          onClose={() => setShowSmartContract(false)}
          orderTotal={getCartTotal()}
        />
      )}
    </div>
  );
};

export default Checkout;