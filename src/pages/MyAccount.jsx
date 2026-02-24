import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersAPI, membershipAPI, ordersAPI } from '../services/api';
import './MyAccount.css';

const MyAccount = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [profileRes, membershipRes, ordersRes] = await Promise.all([
        usersAPI.getProfile(),
        membershipAPI.getStatus().catch(() => null),
        ordersAPI.getHistory().catch(() => ({ data: [] }))
      ]);

      setUser(profileRes.data);
      setMembership(membershipRes?.data);
      setRecentOrders(ordersRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="my-account-page">
      <div className="container">
        <h1 data-aos="fade-up">My Account</h1>

        <div className="account-content">
          {/* Sidebar */}
          <aside className="account-sidebar" data-aos="fade-right">
            <div className="user-info">
              <div className="user-avatar">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <h3>{user?.firstName} {user?.lastName}</h3>
              <p>{user?.email}</p>
              {membership?.isMember && (
                <span className="member-badge">PREMIUM MEMBER</span>
              )}
            </div>

            <nav className="account-nav">
              <button
                className={activeTab === 'profile' ? 'active' : ''}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={activeTab === 'orders' ? 'active' : ''}
                onClick={() => setActiveTab('orders')}
              >
                Orders
              </button>
              <button
                className={activeTab === 'membership' ? 'active' : ''}
                onClick={() => setActiveTab('membership')}
              >
                Membership
              </button>
              <Link to="/wishlist" className="nav-link">Wishlist</Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="account-main" data-aos="fade-left">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="account-section">
                <h2>Profile Information</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Name</label>
                    <p>{user?.firstName} {user?.lastName}</p>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <p>{user?.email}</p>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <p>{user?.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div className="info-item">
                    <label>Address</label>
                    <p>{user?.address || 'Not provided'}</p>
                  </div>
                  <div className="info-item">
                    <label>City</label>
                    <p>{user?.city || 'Not provided'}</p>
                  </div>
                  <div className="info-item">
                    <label>Member Since</label>
                    <p>{new Date(user?.createdDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="account-section">
                <h2>Recent Orders</h2>
                {recentOrders.length > 0 ? (
                  <div className="orders-list">
                    {recentOrders.map(order => (
                      <div key={order.orderId} className="order-card">
                        <div className="order-header">
                          <div>
                            <p className="order-number">Order #{order.trackingNumber}</p>
                            <p className="order-date">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`order-status ${order.orderStatus.toLowerCase()}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <div className="order-details">
                          <p>{order.itemCount} items</p>
                          <p className="order-total">AED {order.totalAmount.toFixed(2)}</p>
                        </div>
                        <Link to={`/orders/${order.orderId}`} className="view-order-btn">
                          View Details
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No orders yet</p>
                    <Link to="/shop">
                      <button className="btn-primary">Start Shopping</button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Membership Tab */}
            {activeTab === 'membership' && (
              <div className="account-section">
                <h2>Membership</h2>
                {membership?.isMember ? (
                  <div className="membership-info">
                    <div className="membership-status-card">
                      <span className="status-badge active">ACTIVE</span>
                      <h3>Premium Member</h3>
                      <div className="membership-details">
                        <p><strong>Member Since:</strong> {new Date(membership.joinDate).toLocaleDateString()}</p>
                        <p><strong>Expires:</strong> {new Date(membership.expiryDate).toLocaleDateString()}</p>
                        <p><strong>Days Remaining:</strong> {membership.daysRemaining} days</p>
                      </div>
                      <Link to="/membership">
                        <button className="btn-outline">View Benefits</button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="membership-cta">
                    <h3>Join MIRAÉ LUXE Membership</h3>
                    <p>Get 15% off every order + free gifts!</p>
                    <Link to="/membership">
                      <button className="btn-primary">Join Now - AED 99/Year</button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;