import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
       <div className="footer-content">

  <div className="footer-column">
    <h5>MIRAÉ LUXE</h5>
    <p>
      Premium skincare and makeup curated for the modern beauty enthusiast. 
      Vegan, cruelty-free, and luxuriously effective.
    </p>
<div className="social-icons">
  <a 
    href="https://instagram.com/miraeluxe.ae" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ color: '#C19A6B' }}
  >
    <FaInstagram size={24} />
  </a>
  <a 
    href="mailto:miraeluxe.ae@gmail.com"
    style={{ color: '#C19A6B' }}
  >
    <FiMail size={24} />
  </a>
</div>
  </div>

  <div className="footer-column">
    <h5>Quick Links</h5>
    <ul>
      <li>
        <Link to="/shop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Shop All
        </Link>
      </li>
      <li>
        <Link to="/skin-quiz" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Skin Quiz
        </Link>
      </li>
      <li>
        <Link to="/membership" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Membership
        </Link>
      </li>
      <li>
        <Link to="/about" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          About Us
        </Link>
      </li>
    </ul>
  </div>

  <div className="footer-column">
    <h5>Customer Care</h5>
    <ul>
      <li>
        <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Contact Us
        </Link>
      </li>
      <li>
        <Link to="/my-account" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          My Account
        </Link>
      </li>
      <li>
        <Link to="/orders" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Order Tracking
        </Link>
      </li>
      <li>
        <Link to="/wishlist" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Wishlist
        </Link>
      </li>
    </ul>
  </div>

  <div className="footer-column">
    <h5>Connect</h5>
    <p><strong>Email:</strong></p>
    <p>miraeluxe.ae@gmail.com</p>
    <p className="mt-3"><strong>Location:</strong></p>
    <p>Dubai, UAE 🇦🇪</p>
  </div>
</div>

        <div className="footer-bottom">
          <p>&copy; 2026 MIRAÉ LUXE. All rights reserved.</p>
          <p className="disclaimer">
            Educational project - University of West London
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;