import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, cartAPI, wishlistAPI, reviewsAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
  }, [id]);

const fetchProductDetails = async () => {
  try {
    const response = await productsAPI.getById(id);
    
    // ✅ FIX: Extract the product object from response.data.product
    setProduct(response.data.product);

    // Fetch related products
    const relatedResponse = await productsAPI.getAll({
      category: response.data.product.category
    });
    
    const related = relatedResponse.data
      .filter(p => p.productId !== response.data.product.productId)
      .slice(0, 4);
    
    setRelatedProducts(related);
  } catch (error) {
    console.error('Error fetching product:', error);
    alert('Product not found');
    navigate('/shop');
  } finally {
    setLoading(false);
  }
};

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await reviewsAPI.getProductReviews(id);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // ✅ FIXED: Actually call cart API instead of alert
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to add items to cart');
        navigate('/login');
        return;
      }

      await cartAPI.addToCart({
        productId: product.productId,
        quantity: quantity
      });

      alert(`${quantity} x ${product.name} added to cart!`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      if (error.response?.status === 401) {
        alert('Please login to add items to cart');
        navigate('/login');
      } else {
        alert('Failed to add to cart. Please try again.');
      }
    }
  };

  // ✅ FIXED: Actually call wishlist API instead of alert
  const handleAddToWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to add items to wishlist');
        navigate('/login');
        return;
      }

      await wishlistAPI.addToWishlist({ productId: product.productId });
      alert('Added to wishlist!');
      
} catch (error) {
  console.error('Error adding to cart:', error);
  if (error.response?.status === 401) {
    alert('Please login to add items to cart');
    navigate('/login');
  } else if (error.response?.status === 400) {
    alert(error.response.data?.message || 'This item is out of stock');  // ← specific message
  } else {
    alert('Failed to add to cart. Please try again.');
  }
}
  };

  const getProductImages = () => {
    if (!product) return [];
    return [
      product.imageUrl1,
      product.imageUrl2,
      product.imageUrl3
    ].filter(Boolean);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return <div className="error-message">Product not found</div>;
  }

  const images = getProductImages();

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" data-aos="fade-down">
          <span onClick={() => navigate('/')}>Home</span> / 
          <span onClick={() => navigate('/shop')}>Shop</span> / 
          <span onClick={() => navigate(`/shop?category=${product.category}`)}>{product.category}</span> / 
          <span className="current">{product.name}</span>
        </nav>

        {/* Product Details */}
        <section className="product-details-section" data-aos="fade-up">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image-container">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="main-image"
              />
              {product.isVegan && (
                <span className="badge vegan-badge">VEGAN</span>
              )}
              {product.isCrueltyFree && (
                <span className="badge cruelty-free-badge">CRUELTY-FREE</span>
              )}
            </div>

            {images.length > 1 && (
              <div className="thumbnail-gallery">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-header">
              <span className="product-brand">{product.brand}</span>
              <h1 className="product-title">{product.name}</h1>
              <p className="product-category">{product.category} • {product.subCategory}</p>
            </div>

{/* Rating */}
{product.rating > 0 && (
  <div className="product-rating">
    <div className="stars">
      {renderStars(product.rating)}
    </div>
    <span className="rating-text">
      {(product.rating || 0).toFixed(1)} ({product.reviewCount || 0} reviews)
    </span>
  </div>
)}

{/* Price */}
<div className="product-price-section">
  <span className="price">AED {(product.price || 0).toFixed(2)}</span>
  {product.stockQuantity < 10 && product.stockQuantity > 0 && (
    <span className="low-stock-warning">Only {product.stockQuantity} left in stock!</span>
  )}
</div>

            {/* Description */}
            <div className="product-description">
              <h3>About This Product</h3>
              <p>{product.description}</p>
            </div>

            {/* Skin Type */}
            {product.skinType && (
              <div className="product-meta">
                <h4>Best For:</h4>
                <p>{product.skinType}</p>
              </div>
            )}

            {/* Key Ingredients */}
            {product.keyIngredients && (
              <div className="product-meta">
                <h4>Key Ingredients:</h4>
                <p>{product.keyIngredients}</p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-selector">
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stockQuantity}
                />
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity}
                >
                  +
                </button>
              </div>
            </div>

            {/* ✅ FIXED: Action Buttons - ALWAYS VISIBLE */}
            <div className="product-actions">
              <button 
                className="btn-primary add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
              >
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button 
                className="btn-outline wishlist-btn"
                onClick={handleAddToWishlist}
              >
                ♡ Add to Wishlist
              </button>
            </div>

            {/* Features */}
            <div className="product-features">
              {product.isVegan && (
                <div className="feature-badge">
                  <span>🌱</span> Vegan
                </div>
              )}
              {product.isCrueltyFree && (
                <div className="feature-badge">
                  <span>🐰</span> Cruelty-Free
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="reviews-section" data-aos="fade-up">
          <h2>Customer Reviews</h2>
          {reviewsLoading ? (
            <p>Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.reviewId} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.reviewerInitials}
                      </div>
                      <div>
                        <h4>{review.reviewerName}</h4>
                        {review.isVerifiedPurchase && (
                          <span className="verified-badge">✓ Verified Purchase</span>
                        )}
                      </div>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <h3 className="review-title">{review.title}</h3>
                  <p className="review-comment">{review.comment}</p>
                  <div className="review-footer">
                    <span className="review-date">
                      {new Date(review.reviewDate).toLocaleDateString()}
                    </span>
                    <span className="helpful-count">
                      {review.helpfulCount} found this helpful
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
          )}
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products-section" data-aos="fade-up">
            <h2>You May Also Like</h2>
            <div className="related-products-grid">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.productId} 
                  product={relatedProduct}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;