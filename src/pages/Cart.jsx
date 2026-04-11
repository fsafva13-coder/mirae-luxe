import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { cartAPI, membershipAPI } from '../services/api'; // ← added membershipAPI
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    fetchCart();
    checkMembership(); // ← added
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], itemCount: 0, subtotal: 0 });
    } finally {
      setLoading(false);
    }
  };

  // ← ADDED: check real membership status from backend
  const checkMembership = async () => {
    try {
      const response = await membershipAPI.getStatus();
      setIsMember(response.data.isMember || false);

      // Keep localStorage in sync
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        user.isMember = response.data.isMember || false;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      // Fall back to localStorage if API unavailable
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setIsMember(user.isMember || false);
        }
      } catch (e) {}
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await cartAPI.updateQuantity({ cartItemId, quantity: newQuantity });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await cartAPI.removeItem(cartItemId);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    try {
      await cartAPI.clearCart();
      fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const subtotal = cart?.subtotal || 0;
  const memberDiscount = isMember ? subtotal * 0.15 : 0;
  const shipping = isMember ? 0 : subtotal >= 200 ? 0 : 20; // members always free shipping
  const total = subtotal - memberDiscount + shipping;
  const giftEligible = isMember || subtotal >= 120;

  return (
    <div className="cart-page">
      <div className="container">
        <h1 data-aos="fade-up">Shopping Cart</h1>

        {!cart || cart.itemCount === 0 ? (
          <div className="empty-cart" data-aos="fade-up">
            <FiShoppingBag size={80} />
            <h2>Your cart is empty</h2>
            <p>Discover our curated selection of premium beauty products</p>
            <Link to="/shop">
              <button className="btn-primary">Start Shopping</button>
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section" data-aos="fade-right">
              <div className="cart-header">
                <h3>{cart.itemCount} {cart.itemCount === 1 ? 'Item' : 'Items'}</h3>
                <button className="clear-cart-btn" onClick={handleClearCart}>
                  Clear Cart
                </button>
              </div>

              <div className="cart-items">
                {cart.items.map(item => (
                  <div key={item.cartItemId} className="cart-item">
                    <img src={item.imageUrl1} alt={item.name} />
                    <div className="item-details">
                      <p className="item-brand">{item.brand}</p>
                      <h4>{item.name}</h4>
                      {item.selectedShade && item.selectedShade !== '' && (
                        <p className="item-shade">Shade: {item.selectedShade}</p>
                      )}
                      <p className="item-price">AED {item.price.toFixed(2)}</p>
                    </div>
                    <div className="item-quantity">
                      <button onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1)}>+</button>
                    </div>
                    <div className="item-subtotal">
                      <p>AED {item.subtotal.toFixed(2)}</p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.cartItemId)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-summary" data-aos="fade-left">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>AED {subtotal.toFixed(2)}</span>
              </div>

              {isMember && (
                <div className="summary-row discount">
                  <span>Member Discount (15%)</span>
                  <span>-AED {memberDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `AED ${shipping.toFixed(2)}`}</span>
              </div>

              {shipping > 0 && (
                <div className="shipping-notice">
                  <p>Add AED {(200 - subtotal).toFixed(2)} more for free shipping</p>
                </div>
              )}

              {giftEligible && (
                <div className="gift-notice">
                  <p>🎁 You qualify for a free gift!</p>
                </div>
              )}

              <div className="summary-total">
                <span>Total</span>
                <span>AED {total.toFixed(2)}</span>
              </div>

              <button
                className="btn-primary checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>

              {/* ← Only show membership promo if genuinely not a member */}
              {!isMember && (
                <div className="membership-promo">
                  <p>Join membership and save 15% on this order!</p>
                  <Link to="/membership">
                    <button className="btn-outline">Learn More</button>
                  </Link>
                </div>
              )}

              <Link to="/shop" className="continue-shopping">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;