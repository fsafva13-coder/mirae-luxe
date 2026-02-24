import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { productsAPI } from '../services/api';
import { SKIN_TYPES, SKINCARE_SUBCATEGORIES, MAKEUP_SUBCATEGORIES } from '../utils/constants';
import './Shop.css';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subCategory: '',
    skinType: '',
    isVegan: null,
    isCrueltyFree: null,
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.subCategory) params.subCategory = filters.subCategory;
      if (filters.skinType) params.skinType = filters.skinType;
      if (filters.isVegan !== null) params.isVegan = filters.isVegan;
      if (filters.isCrueltyFree !== null) params.isCrueltyFree = filters.isCrueltyFree;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.search) params.search = filters.search;

      const response = await productsAPI.getAll(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // For now, show empty array if API fails
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      subCategory: '',
      skinType: '',
      isVegan: null,
      isCrueltyFree: null,
      minPrice: '',
      maxPrice: '',
      search: ''
    });
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
    // Will implement cart functionality later
    alert(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = (productId) => {
    console.log('Add to wishlist:', productId);
    // Will implement wishlist functionality later
    alert('Added to wishlist!');
  };

  const subcategories = filters.category === 'Skincare' 
    ? SKINCARE_SUBCATEGORIES 
    : filters.category === 'Makeup' 
    ? MAKEUP_SUBCATEGORIES 
    : [];

  return (
    <div className="shop-page">
      {/* Page Header */}
      <div className="shop-header bg-beige">
        <div className="container">
          <h1 data-aos="fade-up">Shop All Products</h1>
          <p data-aos="fade-up" data-aos-delay="200">
            Discover our curated collection of premium skincare and makeup
          </p>
        </div>
      </div>

      <div className="container">
        <div className="shop-content">
          {/* Filter Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? 'active' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button className="clear-filters" onClick={clearFilters}>
                Clear All
              </button>
            </div>

            {/* Search */}
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="filter-group">
              <label>Category</label>
              <select
                className="form-control"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Skincare">Skincare</option>
                <option value="Makeup">Makeup</option>
              </select>
            </div>

            {/* Subcategory */}
            {subcategories.length > 0 && (
              <div className="filter-group">
                <label>Product Type</label>
                <select
                  className="form-control"
                  value={filters.subCategory}
                  onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                >
                  <option value="">All Types</option>
                  {subcategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Skin Type */}
            <div className="filter-group">
              <label>Skin Type</label>
              <select
                className="form-control"
                value={filters.skinType}
                onChange={(e) => handleFilterChange('skinType', e.target.value)}
              >
                <option value="">All Skin Types</option>
                {SKIN_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label>Price Range (AED)</label>
              <div className="price-inputs">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="filter-group">
              <label>Preferences</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.isVegan === true}
                    onChange={(e) => handleFilterChange('isVegan', e.target.checked ? true : null)}
                  />
                  <span>Vegan</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.isCrueltyFree === true}
                    onChange={(e) => handleFilterChange('isCrueltyFree', e.target.checked ? true : null)}
                  />
                  <span>Cruelty-Free</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="products-section">
            <div className="products-header">
              <p className="results-count">
                {loading ? 'Loading...' : `${products.length} Products Found`}
              </p>
              <button 
                className="filter-toggle btn-outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
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