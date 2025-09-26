import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload;
    
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity || 1;
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + (action.payload.quantity || 1)
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
          totalItems: state.totalItems + (action.payload.quantity || 1)
        };
      }
    
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      const removedItem = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: filteredItems,
        totalItems: state.totalItems - (removedItem?.quantity || 0)
      };
    
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item => {
        if (item.id === action.payload.id) {
          const oldQuantity = item.quantity;
          const newQuantity = Math.max(0, action.payload.quantity);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
      
      const newTotalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: newTotalItems
      };
    
    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        discount: 0
      };
    
    case 'APPLY_DISCOUNT':
      return {
        ...state,
        discount: action.payload
      };
    
    default:
      return state;
  }
};

const initialState = {
  items: [],
  totalItems: 0,
  discount: 0
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('agrichain_cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      dispatch({ type: 'LOAD_CART', payload: parsedCart });
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('agrichain_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        farmer: product.farmer,
        unit: product.unit,
        agriScore: product.agriScore,
        location: product.location,
        quantity
      }
    });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const applyDiscount = (discountAmount) => {
    dispatch({ type: 'APPLY_DISCOUNT', payload: discountAmount });
  };

  const getCartTotal = () => {
    const subtotal = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    return Math.max(0, subtotal - cart.discount);
  };

  const getCartSubtotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyDiscount,
    getCartTotal,
    getCartSubtotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};