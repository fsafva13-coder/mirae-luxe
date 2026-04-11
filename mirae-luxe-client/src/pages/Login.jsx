import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { usersAPI } from '../services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    console.log('Attempting login with:', formData.email);
    
    const response = await usersAPI.login({
      email: formData.email,
      password: formData.password
    });

    console.log('Full login response:', response); // Check what we get

    if (!response || !response.data) {
      throw new Error('Invalid response from server');
    }

    const responseData = response.data;

    // Store token
    const token = responseData.token || responseData.data?.token || responseData.accessToken;
    
    if (!token) {
      throw new Error('No token received from server');
    }

    localStorage.setItem('token', token);

    // UPDATED: Better handling of user data
    // The backend might return user data in different structures
    let userData;
    
    if (responseData.user) {
      userData = responseData.user;
    } else if (responseData.data && responseData.data.user) {
      userData = responseData.data.user;
    } else {
      // If no user object, the response itself might be the user data
      userData = responseData;
    }

    console.log('User data extracted:', userData); // Debug log

    // Create comprehensive user object with all fields
    const userToStore = {
      userId: userData.userId || userData.id || userData.UserId,
      firstName: userData.firstName || userData.FirstName || '',
      lastName: userData.lastName || userData.LastName || '',
      email: userData.email || userData.Email || formData.email,
      phoneNumber: userData.phoneNumber || userData.PhoneNumber || userData.phone || '',
      address: userData.address || userData.Address || '',
      city: userData.city || userData.City || '',
      postalCode: userData.postalCode || userData.PostalCode || '',
      isMember: userData.isMember || userData.IsMember || false,
      membershipStartDate: userData.membershipStartDate || userData.MembershipStartDate || null,
      membershipEndDate: userData.membershipEndDate || userData.MembershipEndDate || null,
      createdDate: userData.createdDate || userData.CreatedDate || new Date().toISOString()
    };

    localStorage.setItem('user', JSON.stringify(userToStore));
    console.log('User stored in localStorage:', userToStore);

    alert('Login successful!');
    navigate('/my-account');
    
  } catch (err) {
    console.error('Login error:', err);
    console.error('Error response:', err.response?.data);
    
    const errorMessage = err.response?.data?.message 
      || err.response?.data?.error
      || err.message 
      || 'Invalid email or password';
      
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

const handleRegister = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    console.log('Attempting registration with:', formData.email); // Debug log
    
    const response = await usersAPI.register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode
    });

    console.log('Registration response:', response); // Debug log

    // Registration successful
    alert('Account created successfully! Please sign in.');
    
    // Switch to login form
    setIsLogin(true);
    
    // Clear form
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      city: '',
      postalCode: ''
    });
    
  } catch (err) {
    console.error('Registration error:', err);
    console.error('Error response:', err.response?.data);
    
    const errorMessage = err.response?.data?.message 
      || err.response?.data?.error
      || err.message 
      || 'Registration failed. Please try again.';
      
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container" data-aos="fade-up">
          <div className="login-card">
            <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="subtitle">
              {isLogin ? 'Sign in to your MIRAÉ LUXE account' : 'Join the MIRAÉ LUXE community'}
            </p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {isLogin ? (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary btn-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <p className="toggle-text">
                  Don't have an account?{' '}
                  <span onClick={() => setIsLogin(false)}>Create one</span>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="form-control"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="8"
                  />
                  <small>Minimum 8 characters, include uppercase, lowercase, and number</small>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      className="form-control"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary btn-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <p className="toggle-text">
                  Already have an account?{' '}
                  <span onClick={() => setIsLogin(true)}>Sign in</span>
                </p>
              </form>
            )}
          </div>

          <div className="login-benefits">
            <h3>Why Create an Account?</h3>
            <ul>
              <li>✓ Fast checkout</li>
              <li>✓ Order tracking</li>
              <li>✓ Wishlist & saved items</li>
              <li>✓ Exclusive member offers</li>
              <li>✓ Order history</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;