import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { productsAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      // Fetch products and get top rated ones
      const response = await productsAPI.getAll({});
      const products = response.data;
      
      // Sort by rating and get top 4
      const topProducts = products
        .filter(p => p.rating > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
      
      setBestSellers(topProducts);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      setBestSellers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
    alert(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = (productId) => {
    console.log('Add to wishlist:', productId);
    alert('Added to wishlist!');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" data-aos="fade-in">
        <div className="hero-content">
          <h1 data-aos="fade-down" data-aos-delay="200">MIRAÉ LUXE</h1>
          <p data-aos="fade-up" data-aos-delay="400">Elevate Your Beauty Ritual</p>
          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="600">
            Premium Skincare & Makeup | Vegan • Cruelty-Free
          </p>
          <Link to="/shop" data-aos="zoom-in" data-aos-delay="800">
            <button className="btn-primary btn-pulse">SHOP NOW</button>
          </Link>
        </div>
      </section>

      {/* Best Sellers Section - NEW! */}
      <section className="best-sellers section-padding">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>Best Sellers</h2>
            <p>Our most-loved products, handpicked by our community</p>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : bestSellers.length > 0 ? (
            <div className="best-sellers-grid">
              {bestSellers.map((product, index) => (
                <div key={product.productId} data-aos="fade-up" data-aos-delay={index * 100}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products-message" data-aos="fade-up">
              <p>Our best sellers will appear here soon!</p>
              <Link to="/shop">
                <button className="btn-outline">Explore All Products</button>
              </Link>
            </div>
          )}

          {bestSellers.length > 0 && (
            <div className="text-center mt-5" data-aos="fade-up">
              <Link to="/shop">
                <button className="btn-outline">View All Products</button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="features section-padding">
        <div className="container">
          <h2 className="text-center mb-5" data-aos="fade-up">Why MIRAÉ LUXE</h2>
          <div className="features-grid">
            <div className="feature-card hover-lift" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-icon">✨</div>
              <h3>Clean Beauty</h3>
              <p>Vegan and cruelty-free formulas crafted with integrity</p>
            </div>
            <div className="feature-card hover-lift" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-icon">🎁</div>
              <h3>Curated Selection</h3>
              <p>Premium products handpicked for exceptional results</p>
            </div>
            <div className="feature-card hover-lift" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-icon">👑</div>
              <h3>Exclusive Perks</h3>
              <p>Join membership for 15% off + free gifts on every order</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="category-showcase section-padding bg-beige">
        <div className="container">
          <h2 className="text-center mb-5" data-aos="fade-up">Shop By Category</h2>
          <div className="category-grid">
            <Link to="/shop?category=Skincare" className="category-card hover-scale" data-aos="zoom-in" data-aos-delay="100">
              <div className="category-overlay">
                <h3>Skincare</h3>
                <p>Nourish & Restore</p>
              </div>
            </Link>
            <Link to="/shop?category=Makeup" className="category-card hover-scale" data-aos="zoom-in" data-aos-delay="200">
              <div className="category-overlay">
                <h3>Makeup</h3>
                <p>Enhance & Glamorize</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="membership-cta section-padding" data-aos="fade-up">
        <div className="container">
          <div className="membership-content">
            <div className="membership-text" data-aos="slide-in-left">
              <h2>Become a Member</h2>
              <p className="lead">Unlock exclusive benefits and elevate your beauty experience</p>
              <ul className="benefits-list">
                <li>✓ 15% off every order</li>
                <li>✓ Free mini product with every purchase</li>
                <li>✓ Early access to new launches</li>
                <li>✓ Member-only sales & events</li>
              </ul>
              <Link to="/membership">
                <button className="btn-primary mt-3">JOIN FOR AED 99/YEAR</button>
              </Link>
            </div>
            <div className="membership-image" data-aos="slide-in-right">
              <div className="membership-badge">
                <span className="badge-text">PREMIUM</span>
                <span className="badge-price">AED 99</span>
                <span className="badge-period">/year</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skin Quiz CTA */}
      <section className="cta-section section-padding bg-beige" data-aos="fade-up">
        <div className="container text-center">
          <h2 data-aos="fade-up">Find Your Perfect Match</h2>
          <p data-aos="fade-up" data-aos-delay="200">
            Take our 2-minute skin quiz for personalized recommendations
          </p>
          <Link to="/skin-quiz" data-aos="zoom-in" data-aos-delay="400">
            <button className="btn-outline hover-glow">TAKE SKIN QUIZ</button>
          </Link>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section section-padding">
        <div className="container">
          <h2 className="text-center mb-5" data-aos="fade-up">Our Values</h2>
          <div className="values-grid">
            <div className="value-item" data-aos="flip-left" data-aos-delay="100">
              <div className="value-icon">🌿</div>
              <h4>Sustainable</h4>
              <p>Eco-conscious packaging and practices</p>
            </div>
            <div className="value-item" data-aos="flip-left" data-aos-delay="200">
              <div className="value-icon">🐰</div>
              <h4>Cruelty-Free</h4>
              <p>Never tested on animals</p>
            </div>
            <div className="value-item" data-aos="flip-left" data-aos-delay="300">
              <div className="value-icon">🌱</div>
              <h4>Vegan</h4>
              <p>Plant-based ingredients only</p>
            </div>
            <div className="value-item" data-aos="flip-left" data-aos-delay="400">
              <div className="value-icon">✨</div>
              <h4>Premium Quality</h4>
              <p>Luxury formulations that deliver</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;