import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="container">
          <p>Free shipping on orders AED 200+ | Members get 15% off + free gift on every order!</p>
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
            <Link to="/" className="logo">
              <h1>MIRAÉ LUXE</h1>
            </Link>

            {/* Navigation */}
            <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/shop" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
              <Link to="/skin-quiz" onClick={() => setIsMenuOpen(false)}>Skin Quiz</Link>
              <Link to="/membership" onClick={() => setIsMenuOpen(false)}>Membership</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </nav>

            {/* Icons */}
            <div className="header-icons">
              <Link to="/my-account" className="icon-link">
                <FiUser size={20} />
              </Link>
              <Link to="/wishlist" className="icon-link">
                <FiHeart size={20} />
                {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
              </Link>
              <Link to="/cart" className="icon-link">
                <FiShoppingCart size={20} />
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;