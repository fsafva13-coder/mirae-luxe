import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist);
    if (onAddToWishlist) {
      onAddToWishlist(product.productId);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="product-card hover-lift" data-aos="fade-up">
      <Link to={`/product/${product.productId}`} className="product-link">
        <div className="product-image">
          <img 
            src={product.imageUrl1 || '/images/placeholder.jpg'} 
            alt={product.name}
            loading="lazy"
          />
          {product.isVegan && (
            <span className="badge badge-vegan">Vegan</span>
          )}
          {product.isCrueltyFree && (
            <span className="badge badge-cruelty-free">Cruelty-Free</span>
          )}
        </div>

        <div className="product-info">
          <p className="product-brand">{product.brand}</p>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.subCategory}</p>
          
          {product.rating > 0 && (
            <div className="product-rating">
              <span className="stars">{'★'.repeat(Math.round(product.rating))}</span>
              <span className="rating-count">({product.reviewCount})</span>
            </div>
          )}

          <div className="product-footer">
            <p className="product-price">AED {product.price.toFixed(2)}</p>
          </div>
        </div>
      </Link>

      <div className="product-actions">
        <button 
          className="btn-icon wishlist-btn"
          onClick={handleWishlistToggle}
          title="Add to Wishlist"
        >
          {isInWishlist ? (
            <FaHeart size={18} color="#8B7355" />
          ) : (
            <FiHeart size={18} />
          )}
        </button>
        <button 
          className="btn-icon cart-btn"
          onClick={handleAddToCart}
          title="Add to Cart"
        >
          <FiShoppingCart size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;