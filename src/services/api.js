import axios from 'axios';

// Base API URL (your backend)
const API_BASE_URL = 'https://localhost:7001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints
export const productsAPI = {
  getAll: (params) => api.get('/Products', { params }),
  getById: (id) => api.get(`/Products/${id}`),
  getCategories: () => api.get('/Products/Categories'),
  getMiniGifts: () => api.get('/Products/MiniGifts'),
};

export const usersAPI = {
  register: (data) => api.post('/Users/Register', data),
  login: (data) => api.post('/Users/Login', data),
  getProfile: () => api.get('/Users/Profile'),
  updateProfile: (data) => api.put('/Users/Profile', data),
};

export const cartAPI = {
  getCart: () => api.get('/Cart'),
  addItem: (data) => api.post('/Cart/AddItem', data),
  updateQuantity: (data) => api.put('/Cart/UpdateQuantity', data),
  removeItem: (id) => api.delete(`/Cart/RemoveItem/${id}`),
  clearCart: () => api.delete('/Cart/Clear'),
};

export const ordersAPI = {
  checkout: (data) => api.post('/Orders/Checkout', data),
  getHistory: () => api.get('/Orders/History'),
  getOrder: (id) => api.get(`/Orders/${id}`),
  trackOrder: (trackingNumber) => api.get(`/Orders/Track/${trackingNumber}`),
};

export const membershipAPI = {
  getStatus: () => api.get('/Membership/Status'),
  join: (data) => api.post('/Membership/Join', data),
  renew: () => api.post('/Membership/Renew'),
  getBenefits: () => api.get('/Membership/Benefits'),
  getSavings: () => api.get('/Membership/Savings'),
};

export const reviewsAPI = {
  getProductReviews: (productId) => api.get(`/Reviews/Product/${productId}`),
  addReview: (data) => api.post('/Reviews', data),
  updateReview: (id, data) => api.put(`/Reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/Reviews/${id}`),
  getPendingReminder: () => api.get('/Reviews/PendingReminder'),
  dismissReminder: () => api.post('/Reviews/DismissReminder'),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/Wishlist'),
  addToWishlist: (data) => api.post('/Wishlist/Add', data),
  removeFromWishlist: (id) => api.delete(`/Wishlist/Remove/${id}`),
  checkIfInWishlist: (productId) => api.get(`/Wishlist/Check/${productId}`),
  moveToCart: (id) => api.post(`/Wishlist/MoveToCart/${id}`),
};

export const quizAPI = {
  submitQuiz: (data) => api.post('/Quiz/Submit', data),
  getHistory: () => api.get('/Quiz/History'),
};

export default api;