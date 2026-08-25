import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartPage = () => {
  const { cartItems, removeFromCart, totalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container cart-empty-container">
        <ShoppingBag size={64} className="empty-cart-icon" />
        <h2>Your Fresh Basket is Empty</h2>
        <p>Looks like you haven't added any fresh groceries to your cart yet.</p>
        <Link to="/shop" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1 className="page-title">Your Shopping Basket</h1>

      <div className="cart-layout">
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item-row">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <span className="cart-item-unit">{item.unit}</span>
                <span className="cart-item-price">₹{item.price}</span>
              </div>
              <div className="cart-item-qty">
                <span>Qty: {item.qty}</span>
              </div>
              <div className="cart-item-subtotal">
                ₹{item.price * item.qty}
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="remove-btn"
                title="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary-box">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span className="free-delivery">FREE</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total-row">
            <span>Total Payable</span>
            <span>₹{totalPrice}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="checkout-btn"
          >
            Proceed to Checkout
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
