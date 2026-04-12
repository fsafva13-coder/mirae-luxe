import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiGift, FiTruck, FiCalendar, FiUsers } from 'react-icons/fi';
import { membershipAPI } from '../services/api';
import './Membership.css';

const Membership = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(userData);
        setUserEmail(user.email);
        setIsMember(user.isMember || false);
      } catch (e) {}

      membershipAPI.getStatus()
        .then(response => {
          const backendIsMember = response.data.isMember || false;
          setIsMember(backendIsMember);

          try {
            const user = JSON.parse(userData);
            user.isMember = backendIsMember;
            localStorage.setItem('user', JSON.stringify(user));
          } catch (e) {}
        })
        .catch(err => {
          console.error('Could not verify membership status:', err);
        })
        .finally(() => {
          setStatusLoading(false);
        });
    } else {
      setStatusLoading(false);
    }
  }, []);

  const handleJoinClick = async () => {
    if (!isLoggedIn) {
      navigate('/login', {
        state: {
          from: '/membership',
          message: 'Please login to purchase membership'
        }
      });
      return;
    }

    if (isMember) {
      alert('You are already a premium member! Enjoy your exclusive benefits.');
      return;
    }

    setLoading(true);
    try {
      await membershipAPI.join({ plan: 'Annual' });

      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        user.isMember = true;
        localStorage.setItem('user', JSON.stringify(user));
      }

      setIsMember(true);
      alert('Welcome to MIRAÉ LUXE Membership! You now get 15% off all orders + a free gift with every order.');

    } catch (error) {
      console.error('Membership join error:', error);
      if (error.response?.status === 400) {
        setIsMember(true);
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          user.isMember = true;
          localStorage.setItem('user', JSON.stringify(user));
        }
        alert('You are already an active member!');
      } else if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        navigate('/login');
      } else {
        alert('Failed to activate membership. Please make sure the backend is running and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="membership-page">
      <section className="membership-hero" data-aos="fade-in">
        <div className="container">
          <h1 data-aos="fade-up">MIRAÉ LUXE Membership</h1>
          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
            Elevate your beauty experience with exclusive perks and savings
          </p>
        </div>
      </section>

      <div className="container">
        <section className="benefits-section" data-aos="fade-up">
          <h2 className="section-title">Member Benefits</h2>
          <div className="benefits-grid">
            <div className="benefit-card" data-aos="zoom-in" data-aos-delay="100">
              <div className="benefit-icon"><FiStar size={56} /></div>
              <h3>15% Off All Products</h3>
              <p>Enjoy exclusive member pricing on our entire collection of premium skincare and makeup</p>
            </div>
            <div className="benefit-card" data-aos="zoom-in" data-aos-delay="200">
              <div className="benefit-icon"><FiGift size={56} /></div>
              <h3>Free Gift Every Order</h3>
              <p>Receive a complimentary luxury sample or full-size product with every purchase</p>
            </div>
            <div className="benefit-card" data-aos="zoom-in" data-aos-delay="300">
              <div className="benefit-icon"><FiTruck size={56} /></div>
              <h3>Free Shipping</h3>
              <p>Complimentary shipping on all orders, no minimum purchase required</p>
            </div>
            <div className="benefit-card" data-aos="zoom-in" data-aos-delay="400">
              <div className="benefit-icon"><FiCalendar size={56} /></div>
              <h3>Early Access</h3>
              <p>Be the first to shop new launches and limited edition collections</p>
            </div>
            <div className="benefit-card" data-aos="zoom-in" data-aos-delay="500">
              <div className="benefit-icon"><FiUsers size={56} /></div>
              <h3>Exclusive Events</h3>
              <p>Invitations to member-only beauty workshops, masterclasses, and brand events</p>
            </div>
            <div className="benefit-card" data-aos="zoom-in" data-aos-delay="600">
              <div className="benefit-icon"><FiGift size={56} /></div>
              <h3>Birthday Treat</h3>
              <p>Special birthday month discount and a complimentary gift to celebrate your day</p>
            </div>
          </div>
        </section>

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

            {statusLoading ? (
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <p style={{ color: 'var(--muted-bronze)' }}>Checking membership status...</p>
              </div>
            ) : isMember ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: 'var(--soft-beige)',
                  border: '1px solid var(--muted-bronze)',
                  borderRadius: '8px',
                  padding: '16px 24px',
                  marginBottom: '16px'
                }}>
                  <p style={{ color: 'var(--muted-bronze)', fontWeight: '500', margin: 0 }}>
                    ✓ You are a Premium Member
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '6px 0 0' }}>
                    Enjoy your 15% discount and free gifts on every order
                  </p>
                </div>
                <button className="btn-outline" onClick={() => navigate('/shop')}>
                  Shop with Member Benefits
                </button>
              </div>
            ) : (
              <button
                className="btn-primary btn-large"
                onClick={handleJoinClick}
                disabled={loading}
              >
                {loading ? 'Activating...' : !isLoggedIn ? 'Sign In to Join' : 'Join Now - AED 99/year'}
              </button>
            )}

            {isLoggedIn && !isMember && !statusLoading && (
              <p style={{ marginTop: '15px', fontSize: '14px', color: 'var(--muted-bronze)', textAlign: 'center' }}>
                Logged in as: {userEmail}
              </p>
            )}
          </div>
        </section>

        <section className="comparison-section" data-aos="fade-up">
          <h2 className="section-title">Member vs Non-Member</h2>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="header-cell"></div>
              <div className="header-cell">Non-Member</div>
              <div className="header-cell highlight">Premium Member</div>
            </div>
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
              <div className="row-cell">—</div>
              <div className="row-cell highlight">Special Discount + Gift</div>
            </div>
          </div>
        </section>

        <section className="faq-section" data-aos="fade-up">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item" data-aos="fade-up" data-aos-delay="100">
              <h4>How does the membership work?</h4>
              <p>Once you join for AED 99/year, you instantly unlock all premium benefits including 15% off all products, free shipping, complimentary gifts, and exclusive access to events and new launches.</p>
            </div>
            <div className="faq-item" data-aos="fade-up" data-aos-delay="200">
              <h4>When do I start saving?</h4>
              <p>Your benefits activate immediately after joining. You can start enjoying member discounts and perks on your very next order.</p>
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

        {!isMember && !statusLoading && (
          <section className="cta-section" data-aos="fade-up">
            <div className="cta-content">
              <h2>Ready to Join?</h2>
              <p>Start saving and enjoying exclusive perks today</p>
              <button
                className="btn-primary btn-large"
                onClick={handleJoinClick}
                disabled={loading}
              >
                {loading ? 'Activating...' : isLoggedIn ? 'Join for AED 99/Year' : 'Sign In to Join'}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Membership;