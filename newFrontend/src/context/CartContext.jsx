import { createContext, useState, useEffect, useContext } from 'react';
import * as cartApi from '../api/cart';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const data = await cartApi.getCart();
      setCart(data.cart);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user?._id]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const data = await cartApi.addToCart(productId, quantity);
      await fetchCart();
      return { success: true, cart: data.cart };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to add to cart'
      };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      await cartApi.updateCartItem(productId, quantity);
      await fetchCart();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update'
      };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartApi.removeFromCart(productId);
      await fetchCart();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to remove'
      };
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      await fetchCart();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to clear cart'
      };
    }
  };

  const cartCount = cart?.totalItems ?? cart?.items?.reduce((sum, i) => sum + (i.quantity || 0), 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
