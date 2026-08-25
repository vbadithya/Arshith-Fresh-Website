import React from 'react';
import { Leaf, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="logo">
            <Leaf className="logo-icon" />
            <span>Arshith<span className="logo-accent">Fresh</span></span>
          </div>
          <p>Farm fresh organic fruits, vegetables, oils & daily essentials delivered directly to your doorstep.</p>
        </div>
        
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/shop">Shop Groceries</a></li>
            <li><a href="/cart">Cart</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact & Support</h4>
          <p>Email: support@arshithfresh.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Arshith Fresh. Made with <Heart size={14} color="#e63946" /> for healthy living.</p>
      </div>
    </footer>
  );
};
