import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiChevronLeft } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { productsAPI, reviewsAPI } from '../services/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedShade, setSelectedShade] = useState('');
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data);
      setSelectedImage(0);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getProductReviews(id);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = () => {
    console.log('Add to cart:', { product, quantity, selectedShade });
    alert(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist);
    alert(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product not found</h2>
        <button className="btn-primary" onClick={() => navigate('/shop')}>
          Back to Shop
        </button>
      </div>
    );
  }

  const images = [product.imageUrl1, product.imageUrl2, product.imageUrl3].filter(Boolean);
  const shades = product.availableShades ? product.availableShades.split(',').map(s => s.trim()) : [];

  return (
    <div className="product-detail-page">
      {/* Back Button */}
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiChevronLeft /> Back
        </button>
      </div>

      <div className="container">
        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images" data-aos="fade-right">
            <div className="main-image">
              <img src={images[selectedImage]} alt={product.name} />
              {product.isVegan && <span className="badge badge-vegan">Vegan</span>}
              {product.isCrueltyFree && <span className="badge badge-cruelty-free">Cruelty-Free</span>}
            </div>
            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info-section" data-aos="fade-left">
            <p className="product-brand">{product.brand}</p>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-category">{product.subCategory}</p>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="product-rating">
                <span className="stars">{'★'.repeat(Math.round(product.rating))}</span>
                <span className="rating-text">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="product-price-section">
              <p className="price">AED {product.price.toFixed(2)}</p>
              <p className="size">{product.size}</p>
            </div>

            {/* Description */}
            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {/* Key Ingredients */}
            <div className="product-details">
              <h3>Key Ingredients</h3>
              <p>{product.keyIngredients}</p>
            </div>

            {/* Skin Type */}
            <div className="product-details">
              <h3>Suitable For</h3>
              <p>{product.skinType}</p>
            </div>

            {/* Shades Selection */}
            {shades.length > 0 && (
              <div className="shade-selector">
                <label>Select Shade:</label>
                <div className="shade-options">
                  {shades.map(shade => (
                    <button
                      key={shade}
                      className={`shade-btn ${selectedShade === shade ? 'active' : ''}`}
                      onClick={() => setSelectedShade(shade)}
                    >
                      {shade}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="stock-status">
              {product.stockQuantity > 0 ? (
                <span className="in-stock">✓ In Stock</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button
                className="btn-primary add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
              >
                <FiShoppingCart /> Add to Cart
              </button>
              <button className="btn-wishlist" onClick={handleWishlistToggle}>
                {isInWishlist ? <FaHeart size={22} /> : <FiHeart size={22} />}
              </button>
            </div>

            {/* Product Features */}
            <div className="product-features">
              <div className="feature-item">
                <span className="icon">✓</span>
                <span>Free shipping on orders over AED 200</span>
              </div>
              <div className="feature-item">
                <span className="icon">✓</span>
                <span>Members get 15% off + free gift</span>
              </div>
              {product.isVegan && (
                <div className="feature-item">
                  <span className="icon">🌱</span>
                  <span>100% Vegan</span>
                </div>
              )}
              {product.isCrueltyFree && (
                <div className="feature-item">
                  <span className="icon">🐰</span>
                  <span>Cruelty-Free</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section" data-aos="fade-up">
          <h2>Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review.reviewId} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="avatar">{review.reviewerInitials}</div>
                      <div>
                        <p className="reviewer-name">{review.reviewerName}</p>
                        <p className="review-date">
                          {new Date(review.reviewDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="review-rating">
                      {'★'.repeat(review.rating)}
                    </div>
                  </div>
                  <h4>{review.title}</h4>
                  <p>{review.comment}</p>
                  {review.isVerifiedPurchase && (
                    <span className="verified-badge">✓ Verified Purchase</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;