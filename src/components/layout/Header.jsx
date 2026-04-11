import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to handle navigation with scroll to top
  const handleNavClick = (path) => {
    setIsMenuOpen(false);
    navigate(path);
    scrollToTop();
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="container">
          <p>Free shipping on orders over AED 200 | Members get 15% off + free gift on every order!</p>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="container">
          <div className="header-content">
            {/* Mobile Menu Toggle */}
            <button className="menu-toggle" onClick={toggleMenu}>
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

{/* Logo */}
<Link to="/" onClick={scrollToTop} style={{ textDecoration: 'none' }}>
  <div className="logo">
    <img 
      src={require('../../assets/images/logo-icon.png')} 
      alt="MIRAÉ LUXE Logo" 
      className="logo-icon"
    />
    <img 
      src={require('../../assets/images/brand-text.png')} 
      alt="MIRAÉ LUXE" 
      className="brand-text"
    />
  </div>
</Link>

{/* Navigation */}
<nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
  <Link 
    to="/" 
    className={window.location.pathname === '/' ? 'active-link' : ''}
    onClick={() => { setIsMenuOpen(false); scrollToTop(); }}
  >
    Home
  </Link>
  <Link 
    to="/shop" 
    className={window.location.pathname === '/shop' ? 'active-link' : ''}
    onClick={() => { setIsMenuOpen(false); scrollToTop(); }}
  >
    Shop All
  </Link>
  <Link 
    to="/skin-quiz" 
    className={window.location.pathname === '/skin-quiz' ? 'active-link' : ''}
    onClick={() => { setIsMenuOpen(false); scrollToTop(); }}
  >
    Skin Quiz
  </Link>
  <Link 
    to="/membership" 
    className={window.location.pathname === '/membership' ? 'active-link' : ''}
    onClick={() => { setIsMenuOpen(false); scrollToTop(); }}
  >
    Membership
  </Link>
  <Link 
    to="/about" 
    className={window.location.pathname === '/about' ? 'active-link' : ''}
    onClick={() => { setIsMenuOpen(false); scrollToTop(); }}
  >
    About
  </Link>
  <Link 
    to="/contact" 
    className={window.location.pathname === '/contact' ? 'active-link' : ''}
    onClick={() => { setIsMenuOpen(false); scrollToTop(); }}
  >
    Contact
  </Link>
</nav>
            {/* Header Icons */}
<div className="header-icons">
  {/* Account Icon */}
  <div onClick={() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/my-account'); // Go to account if logged in
    } else {
      navigate('/login'); // Go to login if not logged in
    }
    scrollToTop();
  }}>
    <FiUser size={22} />
  </div>

  {/* Wishlist Icon */}
  <div onClick={() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/wishlist'); // Go to wishlist if logged in
    } else {
      navigate('/login', { state: { from: '/wishlist', message: 'Please login to view your wishlist' } }); // Ask to login
    }
    scrollToTop();
  }}>
    <FiHeart size={22} />
  </div>

  {/* Cart Icon */}
  <div onClick={() => { navigate('/cart'); scrollToTop(); }}>
    <FiShoppingCart size={22} />
    {cartCount > 0 && <span className="badge">{cartCount}</span>}
  </div>
</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;