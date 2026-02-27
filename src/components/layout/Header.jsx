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
              <a onClick={() => handleNavClick('/')}>Home</a>
              <a onClick={() => handleNavClick('/shop')}>Shop All</a>
              <a onClick={() => handleNavClick('/skin-quiz')}>Skin Quiz</a>
              <a onClick={() => handleNavClick('/membership')}>Membership</a>
              <a onClick={() => handleNavClick('/about')}>About</a>
              <a onClick={() => handleNavClick('/contact')}>Contact</a>
            </nav>

            {/* Icons */}
            <div className="header-icons">
              <div onClick={() => handleNavClick('/my-account')} style={{ cursor: 'pointer' }}>
                <FiUser size={20} />
              </div>
              <div onClick={() => handleNavClick('/wishlist')} style={{ cursor: 'pointer', position: 'relative' }}>
                <FiHeart size={20} />
                {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
              </div>
              <div onClick={() => handleNavClick('/cart')} style={{ cursor: 'pointer', position: 'relative' }}>
                <FiShoppingCart size={20} />
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