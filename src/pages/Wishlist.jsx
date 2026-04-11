import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { wishlistAPI, cartAPI } from '../services/api';
import './Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await wishlistAPI.removeFromWishlist(itemId);
      fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove item');
    }
  };

  const handleMoveToCart = async (itemId) => {
    try {
      await wishlistAPI.moveToCart(itemId);
      alert('Item moved to cart!');
      fetchWishlist();
    } catch (error) {
      console.error('Error moving to cart:', error);
      alert('Failed to move to cart');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1 data-aos="fade-up">My Wishlist</h1>

        {!wishlist || wishlist.items.length === 0 ? (
          <div className="empty-wishlist" data-aos="fade-up">
            <FiHeart size={80} />
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite products here</p>
            <Link to="/shop">
              <button className="btn-primary">Discover Products</button>
            </Link>
          </div>
        ) : (
          <div className="wishlist-content">
            <p className="wishlist-count" data-aos="fade-up">
              {wishlist.items.length} {wishlist.items.length === 1 ? 'item' : 'items'} saved
            </p>

            <div className="wishlist-grid">
              {wishlist.items.map(item => (
                <div key={item.wishlistItemId} className="wishlist-item" data-aos="fade-up">
                  <Link to={`/product/${item.productId}`} className="item-image">
                    <img src={item.imageUrl1} alt={item.name} />
                    {!item.inStock && (
                      <div className="out-of-stock-overlay">
                        <span>Out of Stock</span>
                      </div>
                    )}
                  </Link>

                  <div className="item-info">
                    <p className="item-brand">{item.brand}</p>
                    <Link to={`/product/${item.productId}`}>
                      <h3>{item.name}</h3>
                    </Link>
                    <p className="item-category">{item.subCategory}</p>
                    <p className="item-price">AED {item.price.toFixed(2)}</p>

                    <div className="item-actions">
                      <button
                        className="btn-primary"
                        onClick={() => handleMoveToCart(item.wishlistItemId)}
                        disabled={!item.inStock}
                      >
                        <FiShoppingCart /> Move to Cart
                      </button>
                      <button
                        className="btn-remove"
                        onClick={() => handleRemove(item.wishlistItemId)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;