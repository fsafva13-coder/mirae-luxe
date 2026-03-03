import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiStar, FiGift, FiTruck, FiCalendar, FiUsers } from 'react-icons/fi';
import './Membership.css';

const Membership = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(userData);
        setUserEmail(user.email);
        setIsMember(user.isMember || false);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleJoinClick = () => {
    if (!isLoggedIn) {
      // User not logged in - redirect to login
      navigate('/login', { 
        state: { 
          from: '/membership', 
          message: 'Please login to purchase membership' 
        } 
      });
      return;
    }

    if (isMember) {
      // Already a member
      alert('You are already a premium member! Check your account for membership details.');
      navigate('/my-account');
      return;
    }

    // User is logged in but not a member - show coming soon message
    alert('Membership payment integration coming soon!\n\nFor now, this is a demo. In production, this would redirect to a payment gateway to process your AED 99/year membership.');
    
    // TODO: In production, navigate to payment:
    // navigate('/membership-checkout');
  };

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
        {/* Benefits Section */}
        <section className="benefits-section" data-aos="fade-up">
          <h2 className="section-title">Member Benefits</h2>
          <div className="benefits-grid">
            <div className="benefit-card" data-aos="zoom-in" data-aos-delay="100">
              <div className="benefit-icon">
                <FiStar size={56} />
              </div>
              <h3>15% Off All Products</h3>
              <p>Enjoy exclusive member pricing on our entire collection of premium skincare and makeup</p>
            </div>

            <div className="benefit-card" data-aos="zoom-in" data-aos-delay="200">
              <div className="benefit-icon">
                <FiGift size={56} />
              </div>
              <h3>Free Gift Every Order</h3>
              <p>Receive a complimentary luxury sample or full-size product with every purchase</p>
            </div>

            <div className="benefit-card" data-aos="zoom-in" data-aos-delay="300">
              <div className="benefit-icon">
                <FiTruck size={56} />
              </div>
              <h3>Free Shipping</h3>
              <p>Complimentary shipping on all orders, no minimum purchase required</p>
            </div>

            <div className="benefit-card" data-aos="zoom-in" data-aos-delay="400">
              <div className="benefit-icon">
                <FiCalendar size={56} />
              </div>
              <h3>Early Access</h3>
              <p>Be the first to shop new launches and limited edition collections</p>
            </div>

            <div className="benefit-card" data-aos="zoom-in" data-aos-delay="500">
              <div className="benefit-icon">
                <FiUsers size={56} />
              </div>
              <h3>Exclusive Events</h3>
              <p>Invitations to member-only beauty workshops, masterclasses, and brand events</p>
            </div>

            <div className="benefit-card" data-aos="zoom-in" data-aos-delay="600">
              <div className="benefit-icon">
                <FiGift size={56} />
              </div>
              <h3>Birthday Treat</h3>
              <p>Special birthday month discount and a complimentary gift to celebrate your day</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing-section" data-aos="fade-up">
          <div className="pricing-card">
            <div className="pricing-badge">BEST VALUE</div>
            <h2>Annual Membership</h2>
            <div className="price-display">
              <span className="currency">AED</span>
              <span className="amount">99</span>
              <span className="period">/year</span>
            </div>
            <p className="savings-text">Save AED 900+ annually on average</p>
            
            <button 
              className="btn-primary btn-large" 
              onClick={handleJoinClick}
            >
              {!isLoggedIn ? 'Sign In to Join' : isMember ? 'View My Membership' : 'Join Now - AED 99/year'}
            </button>

            {isLoggedIn && (
              <p style={{ 
                marginTop: '15px', 
                fontSize: '14px', 
                color: 'var(--muted-bronze)',
                textAlign: 'center'
              }}>
                {isMember ? `✓ You're a premium member!` : `Logged in as: ${userEmail}`}
              </p>
            )}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="comparison-section" data-aos="fade-up">
          <h2 className="section-title">Member vs Non-Member</h2>
          
          <div className="comparison-table">
            {/* Header Row */}
            <div className="comparison-header">
              <div className="header-cell"></div>
              <div className="header-cell">Non-Member</div>
              <div className="header-cell highlight">Premium Member</div>
            </div>

            {/* Comparison Rows */}
            <div className="comparison-row">
              <div className="row-label">Product Discount</div>
              <div className="row-cell">Standard Price</div>
              <div className="row-cell highlight">15% Off Always</div>
            </div>

            <div className="comparison-row">
              <div className="row-label">Shipping</div>
              <div className="row-cell">AED 20 (under AED 200)</div>
              <div className="row-cell highlight">Always Free</div>
            </div>

            <div className="comparison-row">
              <div className="row-label">Gifts</div>
              <div className="row-cell">Occasional Promotions</div>
              <div className="row-cell highlight">Every Order</div>
            </div>

            <div className="comparison-row">
              <div className="row-label">New Launches</div>
              <div className="row-cell">Regular Access</div>
              <div className="row-cell highlight">Early Access</div>
            </div>

            <div className="comparison-row">
              <div className="row-label">Events & Workshops</div>
              <div className="row-cell">Public Events Only</div>
              <div className="row-cell highlight">Exclusive Access</div>
            </div>

            <div className="comparison-row">
              <div className="row-label">Birthday Perks</div>
              <div className="row-cell">-</div>
              <div className="row-cell highlight">Special Discount + Gift</div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section" data-aos="fade-up">
          <h2 className="section-title">Frequently Asked Questions</h2>
          
          <div className="faq-list">
            <div className="faq-item" data-aos="fade-up" data-aos-delay="100">
              <h4>How does the membership work?</h4>
              <p>Once you join for AED 99/year, you instantly unlock all premium benefits including 15% off all products, free shipping, complimentary gifts, and exclusive access to events and new launches.</p>
            </div>

            <div className="faq-item" data-aos="fade-up" data-aos-delay="200">
              <h4>When do I start saving?</h4>
              <p>Your benefits activate immediately after purchase. You can start enjoying member discounts and perks on your very next order.</p>
            </div>

            <div className="faq-item" data-aos="fade-up" data-aos-delay="300">
              <h4>Can I cancel anytime?</h4>
              <p>Yes, you can cancel your membership at any time. However, the annual fee is non-refundable. Your benefits will continue until your membership expiry date.</p>
            </div>

            <div className="faq-item" data-aos="fade-up" data-aos-delay="400">
              <h4>How much can I save?</h4>
              <p>With 15% off all products plus free shipping, most members save AED 900+ per year on average. The membership pays for itself after just a few orders!</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!isMember && (
          <section className="cta-section" data-aos="fade-up">
            <div className="cta-content">
              <h2>Ready to Join?</h2>
              <p>Start saving and enjoying exclusive perks today</p>
              <button 
                className="btn-primary btn-large" 
                onClick={handleJoinClick}
              >
                {isLoggedIn ? 'Join for AED 99/Year' : 'Sign In to Join'}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Membership;