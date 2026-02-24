import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { membershipAPI } from '../services/api';
import './Membership.css';

const Membership = () => {
  const navigate = useNavigate();
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Will get from auth context later

  useEffect(() => {
    if (isLoggedIn) {
      fetchMembershipStatus();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const fetchMembershipStatus = async () => {
    try {
      const response = await membershipAPI.getStatus();
      setMembershipStatus(response.data);
    } catch (error) {
      console.error('Error fetching membership:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMembership = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/membership' } });
      return;
    }

    try {
      const response = await membershipAPI.join({ paymentMethod: 'Card' });
      alert('Membership activated successfully!');
      fetchMembershipStatus();
    } catch (error) {
      console.error('Error joining membership:', error);
      alert('Failed to activate membership. Please try again.');
    }
  };

  const handleRenewMembership = async () => {
    try {
      await membershipAPI.renew();
      alert('Membership renewed successfully!');
      fetchMembershipStatus();
    } catch (error) {
      console.error('Error renewing membership:', error);
      alert('Failed to renew membership. Please try again.');
    }
  };

  const isMember = membershipStatus?.isMember;

  return (
    <div className="membership-page">
      {/* Hero Section */}
      <section className="membership-hero" data-aos="fade-in">
        <div className="container">
          <h1 data-aos="fade-up">MIRAÉ LUXE Membership</h1>
          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
            Elevate your beauty experience with exclusive perks and savings
          </p>
        </div>
      </section>

      <div className="container">
        {/* Membership Status */}
        {isMember && (
          <div className="membership-status-card" data-aos="fade-up">
            <div className="status-header">
              <h2>Your Membership</h2>
              <span className="status-badge active">ACTIVE</span>
            </div>
            <div className="status-details">
              <div className="status-item">
                <span className="label">Member Since:</span>
                <span className="value">
                  {new Date(membershipStatus.joinDate).toLocaleDateString()}
                </span>
              </div>
              <div className="status-item">
                <span className="label">Expires:</span>
                <span className="value">
                  {new Date(membershipStatus.expiryDate).toLocaleDateString()}
                </span>
              </div>
              <div className="status-item">
                <span className="label">Days Remaining:</span>
                <span className="value">{membershipStatus.daysRemaining} days</span>
              </div>
            </div>
            <button className="btn-outline" onClick={handleRenewMembership}>
              Renew Membership
            </button>
          </div>
        )}

        {/* Pricing Card */}
        <div className="pricing-section" data-aos="fade-up">
          <div className="pricing-card">
            <div className="pricing-badge">BEST VALUE</div>
            <h2>Annual Membership</h2>
            <div className="price-display">
              <span className="currency">AED</span>
              <span className="amount">99</span>
              <span className="period">/year</span>
            </div>
            <p className="savings-text">Save AED 900+ annually on average</p>
            {!isMember && (
              <button className="btn-primary btn-large" onClick={handleJoinMembership}>
                {isLoggedIn ? 'Join Now' : 'Sign In to Join'}
              </button>
            )}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="benefits-section">
          <h2 className="section-title" data-aos="fade-up">Membership Benefits</h2>
          
          <div className="benefits-grid">
            <div className="benefit-card" data-aos="fade-up" data-aos-delay="100">
              <div className="benefit-icon">💰</div>
              <h3>15% Off Every Order</h3>
              <p>Automatic discount applied to all purchases. Save on every item, every time.</p>
              <div className="benefit-example">
                <span>Example: Save AED 30 on a AED 200 order</span>
              </div>
            </div>

            <div className="benefit-card" data-aos="fade-up" data-aos-delay="200">
              <div className="benefit-icon">🎁</div>
              <h3>Free Gift Every Order</h3>
              <p>Receive a complimentary mini product with every purchase, no minimum required.</p>
              <div className="benefit-example">
                <span>Worth AED 25-50 per gift</span>
              </div>
            </div>

            <div className="benefit-card" data-aos="fade-up" data-aos-delay="300">
              <div className="benefit-icon">⭐</div>
              <h3>Early Access</h3>
              <p>Be the first to shop new product launches and limited editions.</p>
              <div className="benefit-example">
                <span>24-48 hours before public release</span>
              </div>
            </div>

            <div className="benefit-card" data-aos="fade-up" data-aos-delay="400">
              <div className="benefit-icon">🎉</div>
              <h3>Exclusive Sales</h3>
              <p>Access member-only promotions and special event pricing.</p>
              <div className="benefit-example">
                <span>Up to 25% off during member sales</span>
              </div>
            </div>

            <div className="benefit-card" data-aos="fade-up" data-aos-delay="500">
              <div className="benefit-icon">💬</div>
              <h3>Priority Support</h3>
              <p>Get faster responses from our customer service team.</p>
              <div className="benefit-example">
                <span>Dedicated member support line</span>
              </div>
            </div>

            <div className="benefit-card" data-aos="fade-up" data-aos-delay="600">
              <div className="benefit-icon">🎂</div>
              <h3>Birthday Surprise</h3>
              <p>Receive a special gift during your birthday month.</p>
              <div className="benefit-example">
                <span>Exclusive birthday gift worth AED 75</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="comparison-section" data-aos="fade-up">
          <h2 className="section-title">Member vs Non-Member</h2>
          
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="header-cell"></div>
              <div className="header-cell">Non-Member</div>
              <div className="header-cell highlight">Member</div>
            </div>

            <div className="comparison-row">
              <div className="row-label">Discount on Orders</div>
              <div className="row-cell">0%</div>
              <div className="row-cell highlight">15%</div>
            </div>

            <div className="comparison-row">
              <div className="row-label">Free Gift</div>
              <div className="row-cell">On orders AED 120+</div>
              <div className="row-cell highlight">Every Order</div>
            </div>

            <div className="comparison-row">
              <div className="row-label">Early Access</div>
              <div className="row-cell">✗</div>
              <div className="row-cell highlight">✓</div>
            </div>

            <div className="comparison-row">
              <div className="row-label">Exclusive Sales</div>
              <div className="row-cell">✗</div>
              <div className="row-cell highlight">✓</div>
            </div>

            <div className="comparison-row">
              <div className="row-label">Priority Support</div>
              <div className="row-cell">✗</div>
              <div className="row-cell highlight">✓</div>
            </div>

            <div className="comparison-row">
              <div className="row-label">Birthday Gift</div>
              <div className="row-cell">✗</div>
              <div className="row-cell highlight">✓</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section" data-aos="fade-up">
          <h2 className="section-title">Frequently Asked Questions</h2>
          
          <div className="faq-list">
            <div className="faq-item">
              <h4>How does the 15% discount work?</h4>
              <p>The discount is automatically applied to your cart at checkout. No codes needed!</p>
            </div>

            <div className="faq-item">
              <h4>Can I cancel my membership?</h4>
              <p>Yes, you can cancel anytime. Your benefits remain active until the expiration date.</p>
            </div>

            <div className="faq-item">
              <h4>How do I choose my free gift?</h4>
              <p>During checkout, you'll be able to select from our available mini products.</p>
            </div>

            <div className="faq-item">
              <h4>When does my membership renew?</h4>
              <p>Memberships are valid for one year from the purchase date. You can renew anytime.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!isMember && (
          <div className="cta-section" data-aos="fade-up">
            <div className="cta-content">
              <h2>Ready to Join?</h2>
              <p>Start saving and enjoying exclusive perks today</p>
              <button className="btn-primary btn-large" onClick={handleJoinMembership}>
                {isLoggedIn ? 'Join for AED 99/Year' : 'Sign In to Join'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Membership;