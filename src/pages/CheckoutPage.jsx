import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { createOrderApi } from '../services/api';
import { CheckCircle } from 'lucide-react';

export const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const orderData = {
      orderItems: cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      })),
      shippingAddress: {
        address,
        city,
        postalCode,
        country: 'India',
      },
      paymentMethod,
      itemsPrice: totalPrice,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: totalPrice,
    };

    try {
      if (user && user.token) {
        await createOrderApi(orderData, user.token);
      }
      clearCart();
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container order-success-container">
        <CheckCircle size={72} color="#10b981" />
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for shopping with Arshith Fresh. Your fresh groceries are being prepared.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container checkout-page">
      <h1 className="page-title">Delivery & Checkout</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              required
              placeholder="House No, Street, Landmark"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                required
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                required
                placeholder="500001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <h3>Payment Option</h3>
          <div className="payment-options">
            <label className="radio-label">
              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Cash on Delivery / UPI on Delivery</span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="place-order-btn">
            {loading ? 'Processing...' : `Place Order (₹${totalPrice})`}
          </button>
        </form>

        <div className="checkout-summary-box">
          <h3>Order Review</h3>
          {cartItems.map((item) => (
            <div key={item._id} className="checkout-item-line">
              <span>{item.name} x {item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="summary-divider"></div>
          <div className="summary-row total-row">
            <span>Total Payable</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
