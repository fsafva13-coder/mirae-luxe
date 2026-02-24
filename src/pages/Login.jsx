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
    setLoading(true);
    setError('');

    try {
      const response = await usersAPI.login({
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      const from = location.state?.from || '/';
      navigate(from);
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await usersAPI.register(formData);
      alert('Registration successful! Please login.');
      setIsLogin(true);
      setFormData({ ...formData, password: '' });
    } catch (error) {
      setError(error.response?.data?.errors?.[0] || 'Registration failed. Please try again.');
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