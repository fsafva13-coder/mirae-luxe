import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { productsAPI, cartAPI, wishlistAPI } from '../services/api';
import './Shop.css';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loadCount, setLoadCount] = useState(200); // Load all products
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: '',
    skinType: '',
    vegan: false,
    crueltyFree: false
  });

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Gradually show products (20 at a time)
  useEffect(() => {
    setDisplayedProducts(products.slice(0, loadCount));
  }, [products, loadCount]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.skinType) params.skinType = filters.skinType;
      if (filters.vegan) params.vegan = true;
      if (filters.crueltyFree) params.crueltyFree = true;
      
      const response = await productsAPI.getAll(params);
      let filteredProducts = response.data;

      if (filters.priceRange) {
        filteredProducts = filteredProducts.filter(product => {
          switch (filters.priceRange) {
            case 'under-100': return product.price < 100;
            case '100-150': return product.price >= 100 && product.price <= 150;
            case '150-200': return product.price >= 150 && product.price <= 200;
            case 'above-200': return product.price > 200;
            default: return true;
          }
        });
      }

      setProducts(filteredProducts);
      setLoadCount(20); // Reset to 20 when filters change
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setLoadCount(prev => prev + 20);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));

    if (filterType === 'category') {
      if (value) {
        setSearchParams({ category: value });
      } else {
        setSearchParams({});
      }
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to add items to cart');
        navigate('/login');
        return;
      }

      const cartData = {
        productId: product.productId,
        quantity: 1,
        selectedShade: product.availableShades?.[0] || 'N/A'
      };
      
      console.log('Adding to cart:', cartData);
      
      const response = await cartAPI.addToCart(cartData);
      
      console.log('✅ Cart response:', response.data);
      
      alert(`✅ ${product.name} added to cart!`);
      
    } catch (error) {
      console.error('Cart error:', error);
      
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        alert(`Validation Error:\n${errorMessages}`);
      } else {
        alert('Failed to add to cart. Please try again.');
      }
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to add items to wishlist');
        navigate('/login');
        return;
      }

      await wishlistAPI.addToWishlist({ productId });
      alert('✅ Added to wishlist!');
      
    } catch (error) {
      console.error('Wishlist error:', error);
      
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else if (error.response?.status === 400) {
        alert('Item already in wishlist');
      } else {
        alert('Failed to add to wishlist');
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      skinType: '',
      vegan: false,
      crueltyFree: false
    });
    setSearchParams({});
  };

  return (
    <div className="shop-page">
      <div className="container">
        <section className="shop-hero" data-aos="fade-down">
          <h1>Shop All Products</h1>
          <p>Discover your perfect beauty essentials</p>
        </section>

        <div className="shop-content">
          <aside className="filters-sidebar" data-aos="fade-right">
            <div className="filters-header">
              <h3>Filters</h3>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All
              </button>
            </div>

            <div className="filter-group">
              <h4>Category</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === ''}
                    onChange={() => handleFilterChange('category', '')}
                  />
                  <span>All Products</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === 'Skincare'}
                    onChange={() => handleFilterChange('category', 'Skincare')}
                  />
                  <span>Skincare</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === 'Makeup'}
                    onChange={() => handleFilterChange('category', 'Makeup')}
                  />
                  <span>Makeup</span>
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === ''}
                    onChange={() => handleFilterChange('priceRange', '')}
                  />
                  <span>All Prices</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === 'under-100'}
                    onChange={() => handleFilterChange('priceRange', 'under-100')}
                  />
                  <span>Under AED 100</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === '100-150'}
                    onChange={() => handleFilterChange('priceRange', '100-150')}
                  />
                  <span>AED 100 - 150</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === '150-200'}
                    onChange={() => handleFilterChange('priceRange', '150-200')}
                  />
                  <span>AED 150 - 200</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === 'above-200'}
                    onChange={() => handleFilterChange('priceRange', 'above-200')}
                  />
                  <span>Above AED 200</span>
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h4>Skin Type</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="skinType"
                    checked={filters.skinType === ''}
                    onChange={() => handleFilterChange('skinType', '')}
                  />
                  <span>All Skin Types</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="skinType"
                    checked={filters.skinType === 'Oily'}
                    onChange={() => handleFilterChange('skinType', 'Oily')}
                  />
                  <span>Oily</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="skinType"
                    checked={filters.skinType === 'Dry'}
                    onChange={() => handleFilterChange('skinType', 'Dry')}
                  />
                  <span>Dry</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="skinType"
                    checked={filters.skinType === 'Combination'}
                    onChange={() => handleFilterChange('skinType', 'Combination')}
                  />
                  <span>Combination</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="skinType"
                    checked={filters.skinType === 'Sensitive'}
                    onChange={() => handleFilterChange('skinType', 'Sensitive')}
                  />
                  <span>Sensitive</span>
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h4>Preferences</h4>
              <div className="filter-options">
                <label className="filter-option checkbox-option">
                  <input
                    type="checkbox"
                    checked={filters.vegan}
                    onChange={(e) => handleFilterChange('vegan', e.target.checked)}
                  />
                  <span>Vegan</span>
                </label>
                <label className="filter-option checkbox-option">
                  <input
                    type="checkbox"
                    checked={filters.crueltyFree}
                    onChange={(e) => handleFilterChange('crueltyFree', e.target.checked)}
                  />
                  <span>Cruelty-Free</span>
                </label>
              </div>
            </div>
          </aside>

          <main className="products-section">
            <div className="products-header">
              <h2>
                {filters.category || 'All Products'} 
                <span className="product-count">({products.length} items)</span>
              </h2>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="products-grid" data-aos="fade-up">
                  {displayedProducts.map((product, index) => (
                    <div 
                      key={product.productId}
                      data-aos="zoom-in"
                      data-aos-delay={50 * (index % 8)}
                    >
                      <ProductCard 
                        product={product}
                        index={index}
                        onAddToCart={() => handleAddToCart(product)}
                        onAddToWishlist={() => handleAddToWishlist(product.productId)}
                      />
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {loadCount < products.length && (
                  <div style={{ textAlign: 'center', margin: '40px 0' }}>
                    <button 
                      onClick={loadMore}
                      className="btn-primary"
                      style={{
                        padding: '12px 40px',
                        backgroundColor: '#8B7355',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500',
                        transition: 'background-color 0.3s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#6F5C45'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#8B7355'}
                    >
                      Load More Products ({products.length - loadCount} remaining)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-products">
                <p>No products found matching your filters.</p>
                <button className="btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;