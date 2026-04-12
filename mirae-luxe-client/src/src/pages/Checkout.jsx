import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, ordersAPI, membershipAPI } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [cartError, setCartError] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'Card'
  });

  useEffect(() => {
    fetchCart();
    checkMembership();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      if (!response.data || response.data.itemCount === 0) {
        navigate('/cart');
        return;
      }
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartError(true);
    } finally {
      setLoading(false);
    }
  };

  const checkMembership = async () => {
    try {
      const response = await membershipAPI.getStatus();
      setIsMember(response.data.isMember);
    } catch (error) {
      console.error('Error checking membership:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subtotal = cart?.subtotal || 0;
  const memberDiscount = isMember ? subtotal * 0.15 : 0;
  const shippingFee = isMember ? 0 : subtotal >= 200 ? 0 : 20; 
  const total = subtotal - memberDiscount + shippingFee;
  const giftEligible = isMember || subtotal >= 120;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.shippingAddress.trim()) {
      alert('Please enter a shipping address.');
      return;
    }

    setProcessing(true);
    try {
      const response = await ordersAPI.checkout({
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        shippingFee: shippingFee
      });

      alert(`Order placed successfully! Tracking number: ${response.data.trackingNumber}`);
      navigate('/my-account');

    } catch (error) {
      console.error('Error placing order:', error);
      if (error.response?.status === 400) {
        alert(error.response.data?.message || 'Cart is empty or invalid.');
      } else if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        navigate('/login');
      } else {
        alert('Failed to place order. Please make sure the backend is running.');
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="loading-container">
        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>
          Could not load your cart. Please make sure the backend is running.
        </p>
        <button
          className="btn-outline"
          style={{ marginTop: '16px' }}
          onClick={() => navigate('/cart')}
        >
          Back to Cart
        </button>
      </div>
    );
  }

  if (!cart || cart.itemCount === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 data-aos="fade-up">Checkout</h1>

        <div className="checkout-content">
          <div className="checkout-form-section" data-aos="fade-right">
            <form onSubmit={handleSubmit}>

              <div className="form-section">
                <h3>Shipping Address</h3>
                <div className="form-group">
                  <label>Full Address</label>
                  <textarea
                    name="shippingAddress"
                    className="form-control"
                    rows="4"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    placeholder="Street address, apartment, suite, etc."
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      checked={formData.paymentMethod === 'Card'}
                      onChange={handleChange}
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash"
                      checked={formData.paymentMethod === 'Cash'}
                      onChange={handleChange}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
                <p className="payment-note">
                  Note: This is a university project. Payment processing is simulated.
                </p>
              </div>

              <button
                type="submit"
                className="btn-primary btn-full"
                disabled={processing}
              >
                {processing ? 'Processing...' : `Place Order — AED ${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          <div className="order-summary-section" data-aos="fade-left">
            <div className="order-summary-card">
              <h3>Order Summary</h3>

              <div className="summary-items">
                {cart.items.map(item => (
                  <div key={item.cartItemId} className="summary-item">
                    <img src={item.imageUrl1} alt={item.name} />
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-qty">Qty: {item.quantity}</p>
                    </div>
                    <p className="item-price">AED {item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>AED {subtotal.toFixed(2)}</span>
                </div>

                {isMember && (
                  <div className="price-row discount">
                    <span>Member Discount (15%)</span>
                    <span>-AED {memberDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="price-row">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'FREE' : `AED ${shippingFee.toFixed(2)}`}</span>
                </div>

                {shippingFee > 0 && (
                  <div className="shipping-notice">
                    <p>Add AED {(200 - subtotal).toFixed(2)} more for free shipping</p>
                  </div>
                )}

                {giftEligible && (
                  <div className="gift-banner">
                    <p>🎁 Free gift included with your order!</p>
                  </div>
                )}

                <div className="price-row total">
                  <span>Total</span>
                  <span>AED {total.toFixed(2)}</span>
                </div>
              </div>

              {isMember && (
                <div className="member-benefits-box">
                  <h4>Member Benefits Applied:</h4>
                  <ul>
                    <li>✓ 15% discount — AED {memberDiscount.toFixed(2)} saved</li>
                    <li>✓ Free shipping</li>
                    <li>✓ Free gift included</li>
                  </ul>
                </div>
              )}

              {!isMember && subtotal >= 120 && (
                <div className="info-box">
                  <p>🎁 You qualify for a free gift!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;