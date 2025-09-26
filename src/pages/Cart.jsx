import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Cart.module.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(item.id);
      return;
    }
    setQuantity(newQuantity);
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className={styles.cartItem}>
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
        <h3 className={styles.itemName}>{item.name}</h3>
        <p className={styles.itemFarmer}>by {item.farmer.name}</p>
        <p className={styles.itemLocation}>{item.location}</p>
        <span className={styles.itemPrice}>₹{item.price} per {item.unit}</span>
      </div>

      <div className={styles.quantityControls}>
        <button 
          onClick={() => handleQuantityChange(quantity - 1)}
          className={styles.quantityBtn}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className={styles.quantity}>{quantity}</span>
        <button 
          onClick={() => handleQuantityChange(quantity + 1)}
          className={styles.quantityBtn}
        >
          +
        </button>
      </div>

      <div className={styles.itemTotal}>
        ₹{(item.price * quantity).toLocaleString()}
      </div>

      <button 
        onClick={() => removeFromCart(item.id)}
        className={styles.removeBtn}
        title="Remove from cart"
      >
        ×
      </button>
    </div>
  );
};

const Cart = () => {
  const { cart, clearCart, applyDiscount, getCartSubtotal, getCartTotal } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const navigate = useNavigate();

  const mockDiscountCodes = {
    'FIRST10': 50,
    'FARMER20': 100,
    'FRESH15': 75
  };

  const handleApplyDiscount = () => {
    if (mockDiscountCodes[discountCode]) {
      applyDiscount(mockDiscountCodes[discountCode]);
      setDiscountApplied(true);
      setDiscountError('');
    } else {
      setDiscountError('Invalid discount code');
      setDiscountApplied(false);
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  if (cart.items.length === 0) {
    return (
      <div className={styles.cart}>
        <div className={styles.emptyCart}>
          <div className={styles.emptyCartIcon}>🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some fresh products from our marketplace</p>
          <button 
            onClick={() => navigate('/consumer')}
            className={styles.continueShopping}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cart}>
      <div className={styles.cartContainer}>
        <header className={styles.cartHeader}>
          <h1>Your Cart ({cart.totalItems} items)</h1>
          <button 
            onClick={clearCart}
            className={styles.clearCartBtn}
          >
            Clear Cart
          </button>
        </header>

        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            {cart.items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className={styles.cartSummary}>
            <h3>Order Summary</h3>
            
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>₹{getCartSubtotal().toLocaleString()}</span>
            </div>

            {cart.discount > 0 && (
              <div className={styles.summaryRow}>
                <span>Discount:</span>
                <span className={styles.discount}>-₹{cart.discount}</span>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span>Delivery:</span>
              <span>Free</span>
            </div>

            <hr className={styles.summaryDivider} />

            <div className={styles.summaryRow}>
              <strong>Total:</strong>
              <strong>₹{getCartTotal().toLocaleString()}</strong>
            </div>

            <div className={styles.discountSection}>
              <h4>Have a discount code?</h4>
              <div className={styles.discountInput}>
                <input
                  type="text"
                  placeholder="Enter code (try: FIRST10, FARMER20, FRESH15)"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  className={styles.discountField}
                />
                <button 
                  onClick={handleApplyDiscount}
                  className={styles.applyDiscountBtn}
                  disabled={!discountCode || discountApplied}
                >
                  Apply
                </button>
              </div>
              {discountError && <p className={styles.error}>{discountError}</p>}
              {discountApplied && <p className={styles.success}>Discount applied successfully!</p>}
            </div>

            <button 
              onClick={handleCheckout}
              className={styles.checkoutBtn}
              disabled={cart.items.length === 0}
            >
              Proceed to Checkout
            </button>

            <button 
              onClick={() => navigate('/consumer')}
              className={styles.continueShoppingBtn}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;