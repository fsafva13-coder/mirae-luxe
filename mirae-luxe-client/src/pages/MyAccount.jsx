import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI, membershipAPI } from '../services/api';
import './MyAccount.css';

const MyAccount = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [membershipData, setMembershipData] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login', { state: { from: '/my-account' } });
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { state: { from: '/my-account' } });
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      setEditFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        city: user.city || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
    if (activeTab === 'membership') {
      fetchMembership();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await ordersAPI.getHistory();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchMembership = async () => {
    try {
      const response = await membershipAPI.getStatus();
      setMembershipData(response.data);

      const userData = localStorage.getItem('user');
      if (userData) {
        const u = JSON.parse(userData);
        u.isMember = response.data.isMember;
        localStorage.setItem('user', JSON.stringify(u));
        setUser(prev => ({ ...prev, isMember: response.data.isMember }));
      }
    } catch (error) {
      console.error('Error fetching membership:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedUser = {
        ...user,
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        phoneNumber: editFormData.phoneNumber,
        address: editFormData.address,
        city: editFormData.city
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p>Loading your account...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="my-account-page">
      <div className="container">
        <div className="account-layout">

          <aside className="account-sidebar">
            <div className="user-info">
              <div className="user-avatar">
                {user.firstName?.[0] || 'U'}{user.lastName?.[0] || 'U'}
              </div>
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.email}</p>
              {user.isMember && (
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
            </nav>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </aside>

          <main className="account-content">

            {activeTab === 'profile' && (
              <div className="profile-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <h2 style={{ margin: 0 }}>Profile Information</h2>
                  <button className="btn-edit" onClick={() => setIsEditMode(!isEditMode)}>
                    {isEditMode ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {isEditMode ? (
                  <form onSubmit={handleProfileUpdate} className="edit-form">
                    <div className="info-grid">
                      <div className="info-item-edit">
                        <label>First Name</label>
                        <input type="text" value={editFormData.firstName}
                          onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                          className="edit-input" />
                      </div>
                      <div className="info-item-edit">
                        <label>Last Name</label>
                        <input type="text" value={editFormData.lastName}
                          onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                          className="edit-input" />
                      </div>
                      <div className="info-item-edit">
                        <label>Email</label>
                        <input type="email" value={editFormData.email} disabled
                          className="edit-input disabled" title="Email cannot be changed" />
                      </div>
                      <div className="info-item-edit">
                        <label>Phone</label>
                        <input type="tel" value={editFormData.phoneNumber}
                          onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                          className="edit-input" placeholder="Enter phone number" />
                      </div>
                      <div className="info-item-edit" style={{ gridColumn: '1 / -1' }}>
                        <label>Address</label>
                        <input type="text" value={editFormData.address}
                          onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                          className="edit-input" placeholder="Enter your address" />
                      </div>
                      <div className="info-item-edit">
                        <label>City</label>
                        <input type="text" value={editFormData.city}
                          onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                          className="edit-input" placeholder="Enter city" />
                      </div>
                    </div>
                    <div className="edit-actions">
                      <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="info-grid">
                    <div className="info-item"><label>First Name</label><p>{user.firstName || 'Not provided'}</p></div>
                    <div className="info-item"><label>Last Name</label><p>{user.lastName || 'Not provided'}</p></div>
                    <div className="info-item"><label>Email</label><p>{user.email}</p></div>
                    <div className="info-item"><label>Phone</label><p>{user.phoneNumber || 'Not provided'}</p></div>
                    <div className="info-item"><label>Address</label><p>{user.address || 'Not provided'}</p></div>
                    <div className="info-item"><label>City</label><p>{user.city || 'Not provided'}</p></div>
                    <div className="info-item">
                      <label>Member Since</label>
                      <p>{new Date(user.createdDate || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-section">
                <h2>Recent Orders</h2>

                {ordersLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="spinner"></div>
                    <p>Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div>
                    <p className="no-orders">No orders yet. Start shopping to see your orders here!</p>
                    <button className="btn-primary" onClick={() => navigate('/shop')}>
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order.orderId} className="order-card">
                        <div className="order-header">
                          <div>
                            <h4>Order #{order.orderId}</h4>
                            <p className="order-date">
                              {new Date(order.orderDate).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span className={`order-status status-${order.status?.toLowerCase()}`}>
                              {order.status}
                            </span>
                            <p className="order-total">AED {order.finalTotal?.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="order-items-preview">
                          {order.items?.slice(0, 3).map((item, index) => (
                            <div key={index} className="order-item-row">
                              <img
                                src={item.imageUrl1}
                                alt={item.name}
                                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                              <div>
                                <p style={{ margin: 0, fontSize: '14px' }}>{item.name}</p>
                                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                                  {item.isFreeGift ? '🎁 Free Gift' : `Qty: ${item.quantity} × AED ${item.price?.toFixed(2)}`}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '8px 0 0' }}>
                              +{order.items.length - 3} more item(s)
                            </p>
                          )}
                        </div>

                        <div className="order-footer">
                          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
                            Tracking: <strong>{order.trackingNumber}</strong>
                          </p>
                          {order.discountAmount > 0 && (
                            <p style={{ fontSize: '13px', color: 'green', margin: 0 }}>
                              Saved: AED {order.discountAmount?.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'membership' && (
              <div className="membership-section">
                <h2>Membership Status</h2>

                {membershipData?.isMember ? (
                  <div className="membership-active">
                    <div className="status-badge-active">✓ Active Premium Member</div>
                    <div className="membership-details">
                      <p><strong>Join Date:</strong> {new Date(membershipData.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p><strong>Expiry Date:</strong> {new Date(membershipData.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p><strong>Days Remaining:</strong> {membershipData.daysRemaining} days</p>
                    </div>
                    <div className="membership-benefits-box">
                      <h3>Your Benefits</h3>
                      <ul className="benefits-list-account">
                        <li>✓ 15% off on all products</li>
                        <li>✓ Free gift with every order</li>
                        <li>✓ Early access to new launches</li>
                        <li>✓ Free shipping on all orders</li>
                        <li>✓ Exclusive member-only events</li>
                        <li>✓ Birthday month special discount</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="membership-inactive">
                    <div className="status-badge-inactive">Not a Premium Member</div>
                    <div className="membership-benefits-box" style={{ marginTop: '30px' }}>
                      <h3>Unlock Exclusive Benefits</h3>
                      <ul className="benefits-list-account">
                        <li>✓ 15% off on all products</li>
                        <li>✓ Free gift with every order</li>
                        <li>✓ Early access to new launches</li>
                        <li>✓ Free shipping on all orders</li>
                        <li>✓ Exclusive member-only events</li>
                        <li>✓ Birthday month special discount</li>
                      </ul>
                    </div>
                    <p style={{ fontSize: '18px', marginTop: '30px', color: 'var(--muted-bronze)' }}>
                      <strong>Just AED 99/year</strong> — Save AED 900+ annually on average
                    </p>
                    <button
                      className="btn-primary"
                      onClick={() => navigate('/membership')}
                      style={{ marginTop: '25px' }}
                    >
                      Join Now — AED 99/year
                    </button>
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