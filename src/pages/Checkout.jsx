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
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      navigate('/cart');
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const response = await ordersAPI.checkout({
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        shippingFee: shipping
      });

      alert('Order placed successfully!');
      navigate(`/orders/${response.data.orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
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

  if (!cart || cart.itemCount === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = cart.subtotal;
  const memberDiscount = isMember ? subtotal * 0.15 : 0;
  const shipping = subtotal >= 200 ? 0 : 20;
  const total = subtotal - memberDiscount + shipping;
  const giftEligible = isMember || subtotal >= 120;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 data-aos="fade-up">Checkout</h1>

        <div className="checkout-content">
          {/* Checkout Form */}
          <div className="checkout-form-section" data-aos="fade-right">
            <form onSubmit={handleSubmit}>
              {/* Shipping Address */}
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

              {/* Payment Method */}
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

              <button type="submit" className="btn-primary btn-full" disabled={processing}>
                {processing ? 'Processing...' : `Place Order - AED ${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section" data-aos="fade-left">
            <div className="order-summary-card">
              <h3>Order Summary</h3>

              {/* Cart Items */}
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

              {/* Price Breakdown */}
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
                  <span>{shipping === 0 ? 'FREE' : `AED ${shipping.toFixed(2)}`}</span>
                </div>

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

              {/* Member Benefits */}
              {isMember && (
                <div className="member-benefits-box">
                  <h4>Member Benefits Applied:</h4>
                  <ul>
                    <li>✓ 15% discount: AED {memberDiscount.toFixed(2)} saved</li>
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