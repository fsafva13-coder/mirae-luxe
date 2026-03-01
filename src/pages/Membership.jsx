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
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsLoggedIn(true);
      fetchMembershipStatus();
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, []);

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