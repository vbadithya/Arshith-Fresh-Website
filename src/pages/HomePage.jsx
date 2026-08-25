import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Loader } from '../components/Loader';
import { Truck, ShieldCheck, Clock, RefreshCw } from 'lucide-react';

// Fallback sample items if backend DB is empty
const SAMPLE_PRODUCTS = [
  {
    _id: '1',
    name: 'Fresh Farm Organic Apples',
    category: 'Fruits',
    price: 140,
    originalPrice: 180,
    unit: '1 kg',
    rating: 4.9,
    numReviews: 24,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: '2',
    name: 'Cold Pressed Wood Pressed Sesame Oil',
    category: 'Oils',
    price: 320,
    originalPrice: 380,
    unit: '1 Litre',
    rating: 4.8,
    numReviews: 18,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: '3',
    name: 'Organic Green Spinach Bunch',
    category: 'Vegetables',
    price: 40,
    originalPrice: 50,
    unit: '250 g',
    rating: 4.7,
    numReviews: 15,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: '4',
    name: 'Pure Raw Wild Honey',
    category: 'Essentials',
    price: 260,
    originalPrice: 310,
    unit: '500 g',
    rating: 5.0,
    numReviews: 42,
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=400&q=80',
  },
];

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(SAMPLE_PRODUCTS);
        }
      })
      .catch(() => setProducts(SAMPLE_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      {/* Hero Banner Section */}
      <section className="hero-banner">
        <div className="container hero-content">
          <span className="hero-badge">100% Organic & Farm Fresh</span>
          <h1>Freshness Delivered Straight To Your Home</h1>
          <p>Hand-picked fruits, green vegetables, cold-pressed oils & daily household essentials.</p>
          <a href="/shop" className="hero-cta-btn">Explore Fresh Market</a>
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-bar container">
        <div className="feature-item">
          <Truck className="feature-icon" />
          <div>
            <h4>Express Delivery</h4>
            <p>Delivered within 2 hours</p>
          </div>
        </div>
        <div className="feature-item">
          <ShieldCheck className="feature-icon" />
          <div>
            <h4>Guaranteed Quality</h4>
            <p>100% Organic certified</p>
          </div>
        </div>
        <div className="feature-item">
          <Clock className="feature-icon" />
          <div>
            <h4>Daily Harvest</h4>
            <p>Fresh daily farm pick</p>
          </div>
        </div>
        <div className="feature-item">
          <RefreshCw className="feature-icon" />
          <div>
            <h4>Easy Returns</h4>
            <p>No questions asked return</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container section-products">
        <h2 className="section-title">Trending Organic Pickings</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
