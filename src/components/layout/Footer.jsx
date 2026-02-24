import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiMail } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Column 1: About */}
          <div className="footer-column">
            <h4>MIRAÉ LUXE</h4>
            <p>
              Premium skincare and makeup curated for the modern beauty enthusiast.
              Vegan, cruelty-free, and luxuriously effective.
            </p>
            <div className="social-links">
              <a href="https://instagram.com/miraeluxe.ae" target="_blank" rel="noopener noreferrer">
                <FiInstagram size={20} />
              </a>
              <a href="mailto:miraeluxee.ae@gmail.com">
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h5>Quick Links</h5>
            <ul>
              <li><Link to="/shop">Shop All</Link></li>
              <li><Link to="/skin-quiz">Skin Quiz</Link></li>
              <li><Link to="/membership">Membership</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="footer-column">
            <h5>Customer Care</h5>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/my-account">My Account</Link></li>
              <li><Link to="/orders">Order Tracking</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="footer-column">
            <h5>Connect</h5>
            <p className="footer-info">
              <strong>Email:</strong><br />
              miraeluxee.ae@gmail.com
            </p>
            <p className="footer-info">
              <strong>Location:</strong><br />
              Dubai, UAE 🇦🇪
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
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