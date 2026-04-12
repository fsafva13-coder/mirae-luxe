import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="contact-page">
      <section className="contact-hero" data-aos="fade-in">
        <div className="container">
          <h1 data-aos="fade-up">Get in Touch</h1>
          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
            We'd love to hear from you
          </p>
        </div>
      </section>

      <div className="container">
        <div className="contact-content">
          <div className="contact-form-section" data-aos="fade-right">
            <h2>Send Us a Message</h2>
            
            {submitted && (
              <div className="success-message">
                Thank you! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
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
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="form-control"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn-primary btn-full">
                Send Message
              </button>
            </form>
          </div>

          <div className="contact-info-section" data-aos="fade-left">
            <h2>Contact Information</h2>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">
                  <FiMail size={28} />
                </div>
                <h4>Email</h4>
                <p>miraeluxee.ae@gmail.com</p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <FiPhone size={28} />
                </div>
                <h4>Phone</h4>
                <p>+971 4 XXX XXXX</p>
                <p>Mon-Sat: 9AM - 6PM GST</p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <FiMapPin size={28} />
                </div>
                <h4>Location</h4>
                <p>Dubai, United Arab Emirates</p>
                <p>🇦🇪</p>
              </div>
            </div>

            <div className="social-section">
              <h3>Follow Us</h3>
              <p>Stay connected for updates, launches, and exclusive offers</p>
              <div className="social-links">
                <a href="https://instagram.com/miraeluxe.ae" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </div>
            </div>

            <div className="faq-quick">
              <h3>Quick Help</h3>
              <ul>
                <li>📦 Shipping: Free on orders over AED 200</li>
                <li>↩️ Returns: 30-day return policy</li>
                <li>💳 Payment: Secure checkout</li>
                <li>👑 Membership: AED 99/year</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;