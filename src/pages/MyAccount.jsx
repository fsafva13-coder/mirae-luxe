import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyAccount.css';

const MyAccount = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: ''
  });

  // Existing auth check useEffect
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

  // Initialize edit form when user loads
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Handle profile update
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
      // Future backend call:
      // await usersAPI.updateProfile(updatedUser);

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
        <div className="spinner" style={{ 
          border: '4px solid var(--soft-beige)', 
          borderTop: '4px solid var(--muted-bronze)', 
          borderRadius: '50%', 
          width: '50px', 
          height: '50px', 
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p>Loading your account...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="my-account-page">
      <div className="container">
        <div className="account-layout">

          {/* Sidebar */}
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

          {/* Main Content */}
          <main className="account-content">
            {/* Profile Tab */}
{activeTab === 'profile' && (
  <div className="profile-section">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
      <h2 style={{ margin: 0 }}>Profile Information</h2>
      <button 
        className="btn-edit"
        onClick={() => setIsEditMode(!isEditMode)}
      >
        {isEditMode ? 'Cancel' : 'Edit Profile'}
      </button>
    </div>
    
    {isEditMode ? (
      // EDIT MODE - Show input fields
      <form onSubmit={handleProfileUpdate} className="edit-form">
        <div className="info-grid">
          <div className="info-item-edit">
            <label>First Name</label>
            <input 
              type="text"
              value={editFormData.firstName}
              onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
              className="edit-input"
            />
          </div>
          
          <div className="info-item-edit">
            <label>Last Name</label>
            <input 
              type="text"
              value={editFormData.lastName}
              onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
              className="edit-input"
            />
          </div>
          
          <div className="info-item-edit">
            <label>Email</label>
            <input 
              type="email"
              value={editFormData.email}
              disabled
              className="edit-input disabled"
              title="Email cannot be changed"
            />
          </div>
          
          <div className="info-item-edit">
            <label>Phone</label>
            <input 
              type="tel"
              value={editFormData.phoneNumber}
              onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
              className="edit-input"
              placeholder="Enter phone number"
            />
          </div>
          
          <div className="info-item-edit" style={{ gridColumn: '1 / -1' }}>
            <label>Address</label>
            <input 
              type="text"
              value={editFormData.address}
              onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
              className="edit-input"
              placeholder="Enter your address"
            />
          </div>
          
          <div className="info-item-edit">
            <label>City</label>
            <input 
              type="text"
              value={editFormData.city}
              onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
              className="edit-input"
              placeholder="Enter city"
            />
          </div>
          
          <div className="info-item-edit">
            <label>Member Since</label>
            <input 
              type="text"
              value={new Date(user.createdDate || Date.now()).toLocaleDateString()}
              disabled
              className="edit-input disabled"
            />
          </div>
        </div>
        
        <div className="edit-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    ) : (
      // VIEW MODE - Show data
      <div className="info-grid">
        <div className="info-item">
          <label>First Name</label>
          <p>{user.firstName || 'Not provided'}</p>
        </div>
        <div className="info-item">
          <label>Last Name</label>
          <p>{user.lastName || 'Not provided'}</p>
        </div>
        <div className="info-item">
          <label>Email</label>
          <p>{user.email}</p>
        </div>
        <div className="info-item">
          <label>Phone</label>
          <p>{user.phoneNumber || 'Not provided'}</p>
        </div>
        <div className="info-item">
          <label>Address</label>
          <p>{user.address || 'Not provided'}</p>
        </div>
        <div className="info-item">
          <label>City</label>
          <p>{user.city || 'Not provided'}</p>
        </div>
        <div className="info-item">
          <label>Member Since</label>
          <p>{new Date(user.createdDate || Date.now()).toLocaleDateString()}</p>
        </div>
      </div>
    )}
  </div>
)}
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="orders-section">
                <h2>Recent Orders</h2>
                <p className="no-orders">No orders yet. Start shopping to see your orders here!</p>
                <button className="btn-primary" onClick={() => navigate('/shop')}>
                  Browse Products
                </button>
              </div>
            )}

{/* Membership Tab */}
{activeTab === 'membership' && (
  <div className="membership-section">
    <h2>Membership Status</h2>
    
    {user.isMember ? (
      <div className="membership-active">
        <div className="status-badge-active">✓ Active Premium Member</div>
        <div className="membership-details">
          <p><strong>Join Date:</strong> {new Date(user.membershipStartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Expiry Date:</strong> {new Date(user.membershipEndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Days Remaining:</strong> {Math.ceil((new Date(user.membershipEndDate) - new Date()) / (1000 * 60 * 60 * 24))} days</p>
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
        
        <button className="btn-primary" style={{ marginTop: '30px' }}>
          Renew Membership
        </button>
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
          <strong>Just AED 99/year</strong> - Save AED 900+ annually on average
        </p>
        
        <button 
          className="btn-primary" 
          onClick={() => navigate('/membership')}
          style={{ marginTop: '25px' }}
        >
          Join Now - AED 99/year
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