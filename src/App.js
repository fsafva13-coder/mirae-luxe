import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Membership from './pages/Membership';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import SkinQuiz from './pages/SkinQuiz';
import MyAccount from './pages/MyAccount';
import Wishlist from './pages/Wishlist';
import QuizResults from './pages/QuizResults';
import ChatBot from './components/ChatBot/ChatBot';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Header />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/skin-quiz" element={<SkinQuiz />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/quiz-results" element={<QuizResults />} />
            {/* ← ADDED: order detail redirects to account page where orders are shown */}
            <Route path="/orders/:id" element={<MyAccount />} />
          </Routes>
        </main>

        <Footer />
      </Router>

      <ChatBot />
    </div>
  );
}

export default App;