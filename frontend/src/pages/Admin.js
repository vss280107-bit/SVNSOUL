import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ProductImage } from '../components/ProductCard';

const inp = { background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#d0d0d0', padding: '10px 13px', fontSize: 12, fontFamily: 'inherit', borderRadius: 2, outline: 'none', width: '100%', boxSizing: 'border-box' };
const tabBtn = (active) => ({ background: 'none', border: 'none', borderBottom: '2px solid ' + (active ? '#888' : 'transparent'), color: active ? '#d0d0d0' : '#363636', padding: '10px 20px', fontSize: 11, letterSpacing: '0.14em', cursor: 'pointer', fontFamily: 'inherit' });

const STATUS_STEPS = ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
const STATUS_COLORS = { placed: '#5a6aaa', confirmed: '#4a8a4a', processing: '#8a7a2a', shipped: '#4a7a9a', out_for_delivery: '#7a5a9a', delivered: '#4a9a6a', cancelled: '#8a4a4a', returned: '#6a3a3a' };

export default function Admin({ setPage }) {
  const { user } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [newProd, setNewProd] = useState({ name: '', category: 'tops', price: '', originalPrice: '', description: '', tags: '', isFeatured: false });
  const [variants, setVariants] = useState([{ size: 'M', color: 'Jet Black', colorHex: '#0d0d0d', stock: 10 }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts(); loadOrders();
  }, []);

  const loadProducts = () => api.get('/products').then(r => { setProducts(r.data.products); setStats(s => ({ ...s, products: r.data.count })); });
  const loadOrders = () => api.get('/orders').then(r => {
    setOrders(r.data.orders);
    const revenue = r.data.orders.reduce((s, o) => s + (o.pricing?.total || 0), 0);
    const pending = r.data.orders.filter(o => o.status === 'placed' || o.status === 'confirmed').length;
    setStats(s => ({ ...s, orders: r.data.orders.length, revenue, pending }));
  }).catch(() => {});

  const saveProduct = async () => {
    setLoading(true);
    try {
      const payload = { ...newProd, price: +newProd.price, originalPrice: +newProd.originalPrice || +newProd.price, tags: newProd.tags.split(',').map(t => t.trim()).filter(Boolean), variants };
      if (editProduct) { await api.put('/products/' + editProduct._id, payload); }
      else { await api.post('/products', payload); }
      await loadProducts();
      setShowAddProduct(false); setEditProduct(null);
      setNewProd({ name: '', category: 'tops', price: '', originalPrice: '', description: '', tags: '', isFeatured: false });
      setVariants([{ size: 'M', color: 'Jet Black', colorHex: '#0d0d0d', stock: 10 }]);
    } catch (e) { alert(e.response?.data?.message || 'Save failed'); }
    setLoading(false);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Deactivate this product?')) return;
    await api.delete('/products/' + id);
    await loadProducts();
  };

  const updateOrderStatus = async (orderId, status, note) => {
    await api.put('/orders/' + orderId + '/status', { status, note });
    await loadOrders();
  };

  const startEdit = (p) => {
    setEditProduct(p);
    setNewProd({ name: p.name, category: p.category, price: p.price, originalPrice: p.originalPrice || p.price, description: p.description, tags: (p.tags || []).join(', '), isFeatured: p.isFeatured });
    setVariants(p.variants && p.variants.length > 0 ? p.variants : [{ size: 'M', color: 'Jet Black', colorHex: '#0d0d0d', stock: 10 }]);
    setShowAddProduct(true);
  };

  return (
    <div style={{ maxWidth: 1240, margin: '44px auto', padding: '0 24px', fontFamily: 'monospace' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
        <div>
          <p style={{ fontSize: 10, color: '#4a6a2a', letterSpacing: '0.22em', marginBottom: 8 }}>ADMIN PORTAL ◈</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e0e0e0', letterSpacing: '0.08em', margin: 0 }}>DASHBOARD</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setPage({ name: 'home', params: {} })} style={{ background: 'none', border: '1px solid #1e1e1e', color: '#444', padding: '8px 18px', fontSize: 10, letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>VIEW STORE</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 36 }}>
        {[['PRODUCTS', stats.products, '#e0e0e0'], ['ORDERS', stats.orders, '#e0e0e0'], ['REVENUE', '₹' + stats.revenue.toLocaleString(), '#4a9a4a'], ['PENDING', stats.pending, '#9a8a4a']].map(([l, v, c]) => (
          <div key={l} style={{ background: '#090909', border: '1px solid #161616', borderRadius: 3, padding: '22px 18px' }}>
            <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.14em', marginBottom: 10 }}>{l}</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: c, margin: 0 }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #161616', marginBottom: 28 }}>
        {['dashboard', 'products', 'orders'].map(t => (
          <button key={t} style={tabBtn(tab === t)} onClick={() => setTab(t)}>{t.toUpperCase()}</button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 22 }}>
            <button onClick={() => { setShowAddProduct(!showAddProduct); setEditProduct(null); setNewProd({ name: '', category: 'tops', price: '', originalPrice: '', description: '', tags: '', isFeatured: false }); setVariants([{ size: 'M', color: 'Jet Black', colorHex: '#0d0d0d', stock: 10 }]); }} style={{ background: '#0f1f0f', border: '1px solid #1a3a1a', color: '#4a8a4a', padding: '10px 22px', fontSize: 11, letterSpacing: '0.14em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>
              {showAddProduct ? 'CANCEL' : '+ ADD PRODUCT'}
            </button>
          </div>

          {showAddProduct && (
            <div style={{ background: '#090909', border: '1px solid #161616', borderRadius: 3, padding: 28, marginBottom: 28 }}>
              <p style={{ fontSize: 12, color: '#666', letterSpacing: '0.14em', marginBottom: 22 }}>{editProduct ? 'EDIT PRODUCT' : 'NEW PRODUCT'}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                {[['Product Name', 'name', 'text'], ['Category', 'category', 'select'], ['Price (₹)', 'price', 'number'], ['Original Price (₹)', 'originalPrice', 'number']].map(([label, field, type]) => (
                  <div key={field}>
                    <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.12em', marginBottom: 6 }}>{label.toUpperCase()}</p>
                    {type === 'select' ? (
                      <select value={newProd[field]} onChange={e => setNewProd(p => ({ ...p, [field]: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                        {['tops', 'bottoms', 'outerwear', 'accessories'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <input type={type} value={newProd[field]} onChange={e => setNewProd(p => ({ ...p, [field]: e.target.value }))} style={inp} />
                    )}
                  </div>
                ))}
                <div style={{ gridColumn: '1/-1' }}>
                  <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.12em', marginBottom: 6 }}>DESCRIPTION</p>
                  <textarea value={newProd.description} onChange={e => setNewProd(p => ({ ...p, description: e.target.value }))} rows={3} style={{ ...inp, resize: 'vertical' }} />
                </div>
                <div>
                  <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.12em', marginBottom: 6 }}>TAGS (comma-separated: bestseller, new, limited)</p>
                  <input value={newProd.tags} onChange={e => setNewProd(p => ({ ...p, tags: e.target.value }))} style={inp} placeholder="bestseller, new" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 22 }}>
                  <input type="checkbox" checked={newProd.isFeatured} onChange={e => setNewProd(p => ({ ...p, isFeatured: e.target.checked }))} style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: 12, color: '#777' }}>Featured on homepage</span>
                </div>
              </div>

              {/* Variants */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <p style={{ fontSize: 11, color: '#555', letterSpacing: '0.12em' }}>VARIANTS (SIZE × COLOR × STOCK)</p>
                  <button onClick={() => setVariants(v => [...v, { size: 'M', color: 'Jet Black', colorHex: '#0d0d0d', stock: 10 }])} style={{ background: 'none', border: '1px solid #1a1a1a', color: '#555', padding: '5px 12px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>+ ADD VARIANT</button>
                </div>
                {variants.map((v, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 100px 36px', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                    <input value={v.size} onChange={e => setVariants(vars => vars.map((vv, j) => j === i ? { ...vv, size: e.target.value } : vv))} placeholder="Size" style={{ ...inp }} />
                    <input value={v.color} onChange={e => setVariants(vars => vars.map((vv, j) => j === i ? { ...vv, color: e.target.value } : vv))} placeholder="Color name" style={{ ...inp }} />
                    <input value={v.colorHex} onChange={e => setVariants(vars => vars.map((vv, j) => j === i ? { ...vv, colorHex: e.target.value } : vv))} placeholder="#hex" style={{ ...inp }} />
                    <input type="number" value={v.stock} onChange={e => setVariants(vars => vars.map((vv, j) => j === i ? { ...vv, stock: +e.target.value } : vv))} placeholder="Stock" style={{ ...inp }} />
                    <button onClick={() => setVariants(vars => vars.filter((_, j) => j !== i))} style={{ background: 'none', border: '1px solid #1e0e0e', color: '#5a2a2a', cursor: 'pointer', fontSize: 16, borderRadius: 2, height: 38 }}>×</button>
                  </div>
                ))}
              </div>

              <button onClick={saveProduct} disabled={loading} style={{ marginTop: 20, background: '#0f1f0f', border: '1px solid #1a3a1a', color: '#4a8a4a', padding: '11px 26px', fontSize: 11, letterSpacing: '0.14em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>
                {loading ? 'SAVING…' : editProduct ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {products.map(p => (
              <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#090909', border: '1px solid #141414', borderRadius: 3, padding: '14px 20px' }}>
                <div style={{ flexShrink: 0 }}><ProductImage category={p.category} colorHex={p.variants?.[0]?.colorHex} size={44} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: '#d0d0d0', marginBottom: 3 }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: '#363636' }}>{p.category} · ₹{p.price.toLocaleString()} · {p.variants?.length || 0} variants</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {(p.tags || []).map(t => <span key={t} style={{ fontSize: 9, background: '#0f1f0f', color: '#4a6a4a', border: '1px solid #1a3a1a', padding: '2px 7px', borderRadius: 2, letterSpacing: '0.1em' }}>{t.toUpperCase()}</span>)}
                  {p.isFeatured && <span style={{ fontSize: 9, background: '#1a1005', color: '#7a6a2a', border: '1px solid #3a2a10', padding: '2px 7px', borderRadius: 2, letterSpacing: '0.1em' }}>FEATURED</span>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => startEdit(p)} style={{ background: 'none', border: '1px solid #1e1e1e', color: '#666', padding: '6px 14px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2, letterSpacing: '0.1em' }}>EDIT</button>
                  <button onClick={() => deleteProduct(p._id)} style={{ background: 'none', border: '1px solid #2a1414', color: '#6a3a3a', padding: '6px 14px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2, letterSpacing: '0.1em' }}>REMOVE</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div>
          {orders.length === 0 && <p style={{ fontSize: 13, color: '#363636', padding: 40, textAlign: 'center' }}>No orders yet.</p>}
          {orders.map(o => (
            <div key={o._id} style={{ background: '#090909', border: '1px solid #141414', borderRadius: 3, padding: 22, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <p style={{ fontSize: 14, color: '#e0e0e0', fontWeight: 700, marginBottom: 4 }}>#{o.orderNumber}</p>
                  <p style={{ fontSize: 11, color: '#444' }}>{new Date(o.createdAt).toLocaleString('en-IN')} · {o.user?.name || 'Guest'} · {o.user?.email || ''}</p>
                  <p style={{ fontSize: 11, color: '#363636', marginTop: 4 }}>{o.shippingAddress?.city}, {o.shippingAddress?.state} — {o.payment?.method?.toUpperCase()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 15, color: '#a0a0a0', marginBottom: 6 }}>₹{(o.pricing?.total || 0).toLocaleString()}</p>
                  <span style={{ fontSize: 10, background: '#0a0a0a', color: STATUS_COLORS[o.status] || '#666', border: '1px solid ' + (STATUS_COLORS[o.status] || '#222'), padding: '3px 10px', borderRadius: 2, letterSpacing: '0.1em' }}>{o.status.toUpperCase().replace('_', ' ')}</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: '#3a3a3a', marginBottom: 14 }}>{(o.items || []).map(i => i.name + ' ×' + i.qty).join(', ')}</p>
              {/* Status update */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {STATUS_STEPS.map(s => (
                  <button key={s} onClick={() => updateOrderStatus(o._id, s, 'Updated by admin')} style={{ background: o.status === s ? '#0f1f0f' : 'none', border: '1px solid ' + (o.status === s ? '#1a3a1a' : '#161616'), color: o.status === s ? '#4a8a4a' : '#363636', padding: '5px 12px', fontSize: 9, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2, letterSpacing: '0.1em' }}>{s.replace('_', ' ').toUpperCase()}</button>
                ))}
                <button onClick={() => updateOrderStatus(o._id, 'cancelled', 'Cancelled by admin')} style={{ background: 'none', border: '1px solid #2a1010', color: '#5a2a2a', padding: '5px 12px', fontSize: 9, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2, letterSpacing: '0.1em' }}>CANCEL</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dashboard Tab */}
      {tab === 'dashboard' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: '#090909', border: '1px solid #141414', borderRadius: 3, padding: 22 }}>
              <p style={{ fontSize: 12, color: '#555', letterSpacing: '0.12em', marginBottom: 18 }}>RECENT ORDERS</p>
              {orders.slice(0, 5).map(o => (
                <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #0e0e0e', paddingBottom: 12, marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 12, color: '#d0d0d0' }}>#{o.orderNumber}</p>
                    <p style={{ fontSize: 10, color: '#363636' }}>{o.user?.name}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 12, color: '#888' }}>₹{(o.pricing?.total || 0).toLocaleString()}</p>
                    <span style={{ fontSize: 9, color: STATUS_COLORS[o.status] || '#555' }}>{o.status.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#090909', border: '1px solid #141414', borderRadius: 3, padding: 22 }}>
              <p style={{ fontSize: 12, color: '#555', letterSpacing: '0.12em', marginBottom: 18 }}>LOW STOCK ALERTS</p>
              {products.flatMap(p => (p.variants || []).filter(v => v.stock <= 3).map(v => ({ product: p.name, ...v }))).slice(0, 6).map((v, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #0e0e0e', paddingBottom: 10, marginBottom: 10 }}>
                  <p style={{ fontSize: 12, color: '#d0d0d0' }}>{v.product} — {v.size}/{v.color}</p>
                  <span style={{ fontSize: 12, color: v.stock === 0 ? '#6a3a3a' : '#8a7a2a' }}>{v.stock === 0 ? 'OUT' : v.stock + ' left'}</span>
                </div>
              ))}
              {products.flatMap(p => (p.variants || []).filter(v => v.stock <= 3)).length === 0 && <p style={{ fontSize: 12, color: '#363636' }}>All variants well-stocked ✓</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
