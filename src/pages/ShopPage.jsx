import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Loader } from '../components/Loader';

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Oils', 'Essentials'];

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
  {
    _id: '5',
    name: 'Fresh Organic Bananas',
    category: 'Fruits',
    price: 60,
    originalPrice: 75,
    unit: '1 dozen',
    rating: 4.8,
    numReviews: 31,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80',
  },
  {
    _id: '6',
    name: 'Organic Red Tomatoes',
    category: 'Vegetables',
    price: 35,
    originalPrice: 45,
    unit: '1 kg',
    rating: 4.6,
    numReviews: 29,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
  },
];

export const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const categoryParam = selectedCategory === 'All' ? '' : selectedCategory;
    fetchProducts(keyword, categoryParam)
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          let filtered = SAMPLE_PRODUCTS;
          if (selectedCategory !== 'All') {
            filtered = filtered.filter((p) => p.category === selectedCategory);
          }
          if (keyword) {
            filtered = filtered.filter((p) =>
              p.name.toLowerCase().includes(keyword.toLowerCase())
            );
          }
          setProducts(filtered);
        }
      })
      .catch(() => setProducts(SAMPLE_PRODUCTS))
      .finally(() => setLoading(false));
  }, [keyword, selectedCategory]);

  return (
    <div className="container shop-page">
      <h1 className="page-title">Shop Fresh Groceries</h1>

      {/* Category Pills */}
      <div className="category-filter-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product List */}
      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>No products found matching your search.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
