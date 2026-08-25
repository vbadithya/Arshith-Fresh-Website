import React, { useState, useEffect } from 'react';
import { Box, Layers, ShoppingCart, Server, Plus, RefreshCw, Trash2, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [dbOnline, setDbOnline] = useState(false);

  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [orders, setOrders] = useState([]);

  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    _id: '',
    name: '',
    category: '',
    unit: '1 kg',
    price: '',
    originalPrice: '',
    countInStock: '',
    brand: 'Arshith Fresh',
    image: '',
    description: ''
  });

  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [collectionForm, setCollectionForm] = useState({
    title: '',
    type: 'automated',
    image: '',
    condition: ''
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    checkDb();
    fetchProducts();
    fetchCollections();
    fetchOrders();
  };

  const checkDb = async () => {
    try {
      const res = await fetch(API_BASE);
      if (res.ok) {
        setDbStatus('MongoDB Connected (Port 5000)');
        setDbOnline(true);
      } else {
        throw new Error();
      }
    } catch {
      setDbStatus('Backend Server Offline');
      setDbOnline(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch {
      setProducts([
        { _id: '1', name: 'Chilli Powder Soft Grinding', category: 'Spice Powders', price: 240, originalPrice: 280, countInStock: 45, unit: '500 g', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=80' },
        { _id: '2', name: 'Pure Organic Cow Ghee', category: 'Ghee & Honey', price: 650, originalPrice: 720, countInStock: 20, unit: '1 kg', image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=80' }
      ]);
    }
  };

  const fetchCollections = async () => {
    try {
      const res = await fetch(`${API_BASE}/collections`);
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
      }
    } catch {
      setCollections([
        { _id: 'c1', title: 'Spice Powders (Podulu)', collectionType: 'automated', conditionsSummary: 'Tag includes Podulu', productsCount: 13, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=80' }
      ]);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`, { headers: { 'x-admin-dev': 'true' } });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      setOrders([]);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      name: productForm.name,
      category: productForm.category,
      unit: productForm.unit,
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice) || 0,
      countInStock: Number(productForm.countInStock),
      brand: productForm.brand,
      image: productForm.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=80',
      description: productForm.description
    };

    try {
      const url = productForm._id ? `${API_BASE}/products/${productForm._id}` : `${API_BASE}/products`;
      const method = productForm._id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-dev': 'true' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowProductModal(false);
        fetchProducts();
      } else {
        alert('Error saving product');
      }
    } catch {
      alert('Could not save product. Check backend server.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE', headers: { 'x-admin-dev': 'true' } });
      fetchProducts();
    } catch {
      alert('Error deleting product');
    }
  };

  const handleSaveCollection = async (e) => {
    e.preventDefault();
    const payload = {
      title: collectionForm.title,
      collectionType: collectionForm.type,
      image: collectionForm.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=80',
      disjunctive: true,
      rules: collectionForm.condition ? [{ column: 'tag', relation: 'contains', condition: collectionForm.condition }] : []
    };

    try {
      const res = await fetch(`${API_BASE}/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-dev': 'true' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowCollectionModal(false);
        fetchCollections();
      }
    } catch {
      alert('Error creating collection');
    }
  };

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Arshith Fresh Admin Panel</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Manage products, collections, and database stats live</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '13px' }}>
            {dbOnline ? <CheckCircle2 size={16} color="#16a34a" /> : <AlertCircle size={16} color="#ef4444" />}
            <span>{dbStatus}</span>
          </div>
          <button onClick={loadAllData} className="hero-cta-btn" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e2e8f0', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{ padding: '12px 20px', border: 'none', background: 'none', fontWeight: '600', cursor: 'pointer', borderBottom: activeTab === 'dashboard' ? '3px solid #16a34a' : 'none', color: activeTab === 'dashboard' ? '#16a34a' : '#64748b' }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          style={{ padding: '12px 20px', border: 'none', background: 'none', fontWeight: '600', cursor: 'pointer', borderBottom: activeTab === 'products' ? '3px solid #16a34a' : 'none', color: activeTab === 'products' ? '#16a34a' : '#64748b' }}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('collections')}
          style={{ padding: '12px 20px', border: 'none', background: 'none', fontWeight: '600', cursor: 'pointer', borderBottom: activeTab === 'collections' ? '3px solid #16a34a' : 'none', color: activeTab === 'collections' ? '#16a34a' : '#64748b' }}
        >
          Collections ({collections.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          style={{ padding: '12px 20px', border: 'none', background: 'none', fontWeight: '600', cursor: 'pointer', borderBottom: activeTab === 'orders' ? '3px solid #16a34a' : 'none', color: activeTab === 'orders' ? '#16a34a' : '#64748b' }}
        >
          Orders ({orders.length})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span style={{ fontSize: '13px' }}>TOTAL PRODUCTS</span>
                <Box size={20} color="#16a34a" />
              </div>
              <h2 style={{ fontSize: '28px', marginTop: '8px', fontWeight: 'bold' }}>{products.length}</h2>
            </div>
            <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span style={{ fontSize: '13px' }}>COLLECTIONS</span>
                <Layers size={20} color="#3b82f6" />
              </div>
              <h2 style={{ fontSize: '28px', marginTop: '8px', fontWeight: 'bold' }}>{collections.length}</h2>
            </div>
            <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span style={{ fontSize: '13px' }}>ORDERS</span>
                <ShoppingCart size={20} color="#9333ea" />
              </div>
              <h2 style={{ fontSize: '28px', marginTop: '8px', fontWeight: 'bold' }}>{orders.length}</h2>
            </div>
            <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span style={{ fontSize: '13px' }}>BACKEND API</span>
                <Server size={20} color="#ea580c" />
              </div>
              <h2 style={{ fontSize: '20px', marginTop: '8px', fontWeight: 'bold', color: dbOnline ? '#16a34a' : '#ef4444' }}>
                {dbOnline ? 'Port 5000' : 'Offline'}
              </h2>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Recent Products</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textTransform: 'uppercase', fontSize: '12px', color: '#64748b' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                      <strong>{p.name}</strong>
                    </td>
                    <td style={{ padding: '12px' }}>{p.category}</td>
                    <td style={{ padding: '12px' }}>₹{p.price}</td>
                    <td style={{ padding: '12px' }}>{p.countInStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2>Products List</h2>
            <button
              onClick={() => {
                setProductForm({ _id: '', name: '', category: '', unit: '1 kg', price: '', originalPrice: '', countInStock: '', brand: 'Arshith Fresh', image: '', description: '' });
                setShowProductModal(true);
              }}
              className="hero-cta-btn"
              style={{ padding: '8px 16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> Add Product
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textTransform: 'uppercase', fontSize: '12px', color: '#64748b' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Stock</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={p.image} alt={p.name} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                    <strong>{p.name}</strong>
                  </td>
                  <td style={{ padding: '12px' }}>{p.category}</td>
                  <td style={{ padding: '12px' }}>₹{p.price}</td>
                  <td style={{ padding: '12px' }}>{p.countInStock}</td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => {
                        setProductForm({ ...p });
                        setShowProductModal(true);
                      }}
                      style={{ background: 'none', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Collections Tab */}
      {activeTab === 'collections' && (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2>Collections List</h2>
            <button
              onClick={() => {
                setCollectionForm({ title: '', type: 'automated', image: '', condition: '' });
                setShowCollectionModal(true);
              }}
              className="hero-cta-btn"
              style={{ padding: '8px 16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> New Collection
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textTransform: 'uppercase', fontSize: '12px', color: '#64748b' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Collection</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Condition</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Products Count</th>
              </tr>
            </thead>
            <tbody>
              {collections.map(c => (
                <tr key={c._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={c.image || 'https://via.placeholder.com/40'} alt={c.title} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                    <strong>{c.title}</strong>
                  </td>
                  <td style={{ padding: '12px' }}>{c.collectionType}</td>
                  <td style={{ padding: '12px' }}><code>{c.conditionsSummary || '-'}</code></td>
                  <td style={{ padding: '12px' }}><strong>{c.productsCount || 0}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h2>Customer Orders</h2>
          {orders.length === 0 ? (
            <p style={{ marginTop: '16px', color: '#64748b' }}>No orders found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textTransform: 'uppercase', fontSize: '12px', color: '#64748b' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Order ID</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Total Price</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Paid</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Delivered</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px' }}><strong>#{o._id.substring(0, 8)}</strong></td>
                    <td style={{ padding: '12px' }}>₹{o.totalPrice}</td>
                    <td style={{ padding: '12px' }}>{o.isPaid ? 'Yes' : 'No'}</td>
                    <td style={{ padding: '12px' }}>{o.isDelivered ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {showProductModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '480px', maxWidth: '90%' }}>
            <h3>{productForm._id ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSaveProduct} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Product Name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <input type="text" placeholder="Category" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} required style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input type="number" placeholder="Price (₹)" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <input type="number" placeholder="Stock Count" value={productForm.countInStock} onChange={e => setProductForm({ ...productForm, countInStock: e.target.value })} required style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              </div>
              <input type="text" placeholder="Image URL" value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowProductModal(false)} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', background: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="hero-cta-btn" style={{ padding: '8px 16px' }}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Collection Modal */}
      {showCollectionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '440px', maxWidth: '90%' }}>
            <h3>New Collection</h3>
            <form onSubmit={handleSaveCollection} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Collection Title" value={collectionForm.title} onChange={e => setCollectionForm({ ...collectionForm, title: e.target.value })} required style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <input type="text" placeholder="Tag / Keyword Condition (e.g. Podulu)" value={collectionForm.condition} onChange={e => setCollectionForm({ ...collectionForm, condition: e.target.value })} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <input type="text" placeholder="Image URL" value={collectionForm.image} onChange={e => setCollectionForm({ ...collectionForm, image: e.target.value })} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCollectionModal(false)} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', background: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="hero-cta-btn" style={{ padding: '8px 16px' }}>Save Collection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
