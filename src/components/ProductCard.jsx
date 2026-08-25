import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, Star } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image || 'https://via.placeholder.com/200?text=Fresh+Product'}
          alt={product.name}
          className="product-image"
        />
        {product.originalPrice > product.price && (
          <span className="badge-discount">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </span>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-unit">{product.unit || '1 unit'}</p>

        <div className="product-rating">
          <Star size={14} fill="#f59e0b" color="#f59e0b" />
          <span>{product.rating || 4.8} ({product.numReviews || 12})</span>
        </div>

        <div className="product-footer">
          <div className="price-tag">
            <span className="current-price">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">₹{product.originalPrice}</span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="add-cart-btn"
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
