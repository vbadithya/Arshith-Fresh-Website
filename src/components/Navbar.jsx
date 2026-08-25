import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, User, Search, LogOut, Leaf } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <header className="header">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <Leaf className="logo-icon" />
          <span>Arshith<span className="logo-accent">Fresh</span></span>
        </Link>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search fresh groceries, fruits, vegetables..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <Search size={18} />
          </button>
        </form>

        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/admin" className="nav-link" style={{ fontWeight: '600', color: '#16a34a' }}>Admin Panel</Link>
          
          <Link to="/cart" className="cart-btn">
            <ShoppingBag size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user.name}</span>
              <button onClick={logout} className="logout-btn" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              <User size={18} />
              <span>Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
