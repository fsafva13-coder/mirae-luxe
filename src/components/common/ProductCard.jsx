import React from 'react';
import { Link, useNavigate } from 'react-router-dom';      
import { cartAPI, wishlistAPI } from '../../services/api';
import './ProductCard.css';
import ProductImage from './ProductImage'; 

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const navigate = useNavigate();
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

const handleAddToCart = async (e) => {
  e.preventDefault(); // Prevent navigation
  e.stopPropagation(); // Stop event bubbling
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    await cartAPI.addToCart({
      productId: product.productId,
      quantity: 1
    });

    alert(`${product.name} added to cart!`);
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

const handleAddToWishlist = async (e) => {
  e.preventDefault(); // Prevent navigation
  e.stopPropagation(); // Stop event bubbling
  
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
    console.error('Error adding to wishlist:', error);
    if (error.response?.status === 401) {
      alert('Please login to add items to wishlist');
      navigate('/login');
    } else if (error.response?.status === 400) {
      alert('Item already in wishlist');
    } else {
      alert('Failed to add to wishlist. Please try again.');
    }
  }
};

  return (
    <div className="product-card">
      <Link to={`/product/${product.productId}`} className="product-card-link">
        <div className="product-image-container">
          <ProductImage 
            src={product.imageUrl1} 
            alt={product.name}
            className="product-image"
          />
          {/* ✅ NO BADGES ON IMAGE */}
          <div className="product-hover-overlay">
            <button 
              className="quick-action-btn"
              onClick={handleAddToWishlist}
              title="Add to Wishlist"
            >
              ♡
            </button>
            <button 
              className="quick-action-btn"
              onClick={handleAddToCart}
              title="Add to Cart"
            >
              🛒
            </button>
          </div>
        </div>

        <div className="product-info">
          <span className="product-brand">{product.brand}</span>
          <h3 className="product-name">{product.name}</h3>

          {/* ✅ BADGES IN DESCRIPTION AREA */}
          {(product.isVegan || product.isCrueltyFree) && (
            <div className="product-badges">
              {product.isVegan && (
                <span className="product-badge vegan">🌱 Vegan</span>
              )}
              {product.isCrueltyFree && (
                <span className="product-badge cruelty-free">🐰 Cruelty-Free</span>
              )}
            </div>
          )}

          {product.rating > 0 && (
            <div className="product-rating">
              <div className="stars">
                {renderStars(product.rating)}
              </div>
              <span className="rating-count">({product.reviewCount})</span>
            </div>
          )}

          <div className="product-price">
            AED {product.price.toFixed(2)}
          </div>

          {product.stockQuantity !== undefined && (
            <div className="stock-status">
              {product.stockQuantity === 0 ? (
                <span className="out-of-stock">Out of Stock</span>
              ) : product.stockQuantity < 10 ? (
                <span className="low-stock">Only {product.stockQuantity} left!</span>
              ) : (
                <span className="in-stock">In Stock</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;