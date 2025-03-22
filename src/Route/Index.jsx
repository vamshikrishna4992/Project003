import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import ProductList from '../Pages/ProductList';
import ProductDetail from '../Pages/ProductDetailes';
import Cart from '../Pages/Cart';
import Checkout from '../Pages/Checkout';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import About from '../Pages/About';
import Contact from '../Pages/Contact';
import Software from '../Pages/Software';
import Tracking from '../Pages/Tracking';
import NotFound from '../Pages/Notfound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products/:category" element={<ProductList />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/software" element={<Software />} />
      <Route path="/tracking" element={<Tracking />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;