import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProductImage, Stars, Tag } from '../components/ProductCard';

export default function ProductPage({ productId, setPage }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selSize, setSelSize] = useState(null);
  const [selColor, setSelColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('desc');
  const [added, setAdded] = useState(false);
  const [showSize, setShowSize] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    api.get('/products/' + productId).then(r => { setProduct(r.data.product); setLoading(false); }).catch(() => setLoading(false));
  }, [productId]);

  if (loading) return <div style={{ textAlign: 'center', padding: 100, color: '#363636', fontFamily: 'monospace' }}>LOADING…</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: 100, color: '#363636', fontFamily: 'monospace' }}>Product not found.</div>;

  const inWish = wishlist.includes(product._id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  // Unique colors and sizes
  const colors = [...new Map(product.variants.map(v => [v.color, { color: v.color, colorHex: v.colorHex }])).values()];
  const sizesForColor = selColor ? product.variants.filter(v => v.color === selColor).map(v => ({ size: v.size, stock: v.stock })) : [];
  const selectedVariant = product.variants.find(v => v.size === selSize && v.color === selColor);

  const handleAdd = () => {
    if (!selSize || !selColor) { alert('Please select a size and color'); return; }
    addToCart(product, selSize, selColor, selectedVariant?.colorHex || '#111', qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const submitReview = async () => {
    if (!user) { setPage({ name: 'login', params: {} }); return; }
    setSubmitting(true);
    try {
      const r = await api.post('/products/' + product._id + '/reviews', review);
      setProduct(r.data.product);
      setReview({ rating: 5, comment: '' });
    } catch (e) { alert(e.response?.data?.message || 'Error submitting review'); }
    setSubmitting(false);
  };

  const inp = { background: '#0e0e0e', border: '1px solid #1a1a1a', color: '#d0d0d0', padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', borderRadius: 2, outline: 'none', width: '100%', boxSizing: 'border-box' };

  return (
    <div style={{ maxWidth: 1100, margin: '44px auto', padding: '0 24px' }}>
      <button onClick={() => setPage({ name: 'shop', params: {} })} style={{ background: 'none', border: 'none', color: '#363636', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.14em', marginBottom: 36 }}>← BACK TO SHOP</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
        {/* Images */}
        <div>
          <div style={{ background: '#0c0c0c', border: '1px solid #161616', borderRadius: 3, padding: 56, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 360, position: 'relative' }}>
            <ProductImage category={product.category} colorHex={selectedVariant?.colorHex || colors[0]?.colorHex || '#111'} size={220} />
            <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 6 }}>{(product.tags || []).map(t => <Tag key={t} label={t} />)}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 12 }}>
            {['front', 'back', 'detail'].map((angle, i) => (
              <div key={angle} style={{ background: '#0c0c0c', border: '1px solid #161616', borderRadius: 3, padding: 16, display: 'flex', justifyContent: 'center', opacity: 0.5 + i * 0.1, cursor: 'pointer' }}>
                <ProductImage category={product.category} colorHex={selectedVariant?.colorHex || '#111'} size={52} />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.18em', marginBottom: 8, textTransform: 'uppercase' }}>{product.category}</p>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.06em', color: '#e0e0e0', marginBottom: 14, lineHeight: 1.2 }}>{product.name}</h1>
          {product.reviewCount > 0 && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
              <Stars rating={product.rating} size={13} />
              <span style={{ fontSize: 12, color: '#444' }}>{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 28 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#e0e0e0' }}>₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && <>
              <span style={{ fontSize: 16, color: '#333', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString()}</span>
              <span style={{ fontSize: 12, background: '#0f1a0f', color: '#4a7a4a', padding: '2px 9px', borderRadius: 2 }}>SAVE {discount}%</span>
            </>}
          </div>

          {/* Color */}
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.16em', marginBottom: 12 }}>COLOR {selColor && <span style={{ color: '#666' }}>— {selColor}</span>}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {colors.map(c => (
                <button key={c.color} onClick={() => { setSelColor(c.color); setSelSize(null); }} style={{ width: 30, height: 30, borderRadius: '50%', background: c.colorHex, border: '2px solid ' + (selColor === c.color ? '#888' : '#1e1e1e'), cursor: 'pointer', outline: selColor === c.color ? '1px solid #555' : 'none', outlineOffset: 2 }} title={c.color} />
              ))}
            </div>
          </div>

          {/* Size */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.16em' }}>SIZE</p>
              <button onClick={() => setShowSize(!showSize)} style={{ background: 'none', border: 'none', color: '#444', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.12em' }}>SIZE GUIDE ↗</button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {selColor ? sizesForColor.map(({ size, stock }) => (
                <button key={size} onClick={() => stock > 0 && setSelSize(size)} style={{ width: 46, height: 46, border: '1px solid ' + (selSize === size ? '#888' : '#1e1e1e'), background: selSize === size ? '#1e1e1e' : 'none', color: stock === 0 ? '#252525' : selSize === size ? '#e0e0e0' : '#555', fontSize: 12, cursor: stock === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', borderRadius: 2, textDecoration: stock === 0 ? 'line-through' : 'none' }}>{size}</button>
              )) : <p style={{ fontSize: 12, color: '#363636' }}>Select a color first</p>}
            </div>
            {showSize && (
              <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: 3, padding: 14, marginTop: 14 }}>
                <p style={{ fontSize: 10, color: '#555', letterSpacing: '0.12em', marginBottom: 10 }}>TOPS — CHEST (CM)</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[['XS','86-91'],['S','91-96'],['M','96-101'],['L','101-106'],['XL','106-111']].map(([s,m]) => (
                    <div key={s} style={{ textAlign: 'center', background: '#0e0e0e', border: '1px solid #161616', padding: '6px 12px', borderRadius: 2 }}>
                      <p style={{ fontSize: 11, color: '#a0a0a0', fontWeight: 700, margin: '0 0 2px' }}>{s}</p>
                      <p style={{ fontSize: 10, color: '#363636' }}>{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Qty + Add */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1a1a1a', borderRadius: 2 }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', color: '#666', padding: '10px 16px', cursor: 'pointer', fontSize: 16, fontFamily: 'inherit' }}>−</button>
              <span style={{ padding: '10px 14px', fontSize: 14, color: '#d0d0d0', minWidth: 32, textAlign: 'center' }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ background: 'none', border: 'none', color: '#666', padding: '10px 16px', cursor: 'pointer', fontSize: 16, fontFamily: 'inherit' }}>+</button>
            </div>
            <button onClick={handleAdd} style={{ flex: 1, background: added ? '#0f1f0f' : '#161616', border: '1px solid ' + (added ? '#1e3e1e' : '#2a2a2a'), color: added ? '#4a8a4a' : '#d0d0d0', padding: '10px 20px', fontSize: 11, letterSpacing: '0.18em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2, transition: 'all 0.3s' }}>
              {added ? '✓ ADDED TO BAG' : 'ADD TO BAG'}
            </button>
            <button onClick={() => toggleWishlist(product._id)} style={{ background: 'none', border: '1px solid #1a1a1a', borderRadius: 2, padding: '10px 16px', color: inWish ? '#d0d0d0' : '#363636', cursor: 'pointer', fontSize: 18 }}>{inWish ? '♥' : '♡'}</button>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
            {['Free shipping ₹2000+', '7-day returns', 'GST invoice'].map(b => (
              <span key={b} style={{ fontSize: 10, color: '#363636', border: '1px solid #161616', padding: '4px 10px', borderRadius: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{b}</span>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ borderTop: '1px solid #161616' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #161616', marginBottom: 22 }}>
              {[['desc', 'Details'], ['reviews', 'Reviews (' + product.reviewCount + ')'], ['ship', 'Shipping']].map(([key, label]) => (
                <button key={key} onClick={() => setTab(key)} style={{ background: 'none', border: 'none', borderBottom: '2px solid ' + (tab === key ? '#888' : 'transparent'), color: tab === key ? '#d0d0d0' : '#363636', padding: '12px 18px', fontSize: 11, letterSpacing: '0.14em', cursor: 'pointer', fontFamily: 'inherit' }}>{label}</button>
              ))}
            </div>
            {tab === 'desc' && <p style={{ fontSize: 13, color: '#555', lineHeight: 2.1 }}>{product.description}</p>}
            {tab === 'reviews' && (
              <div>
                {product.reviews.length === 0 && <p style={{ fontSize: 13, color: '#363636', marginBottom: 20 }}>No reviews yet. Be the first.</p>}
                {product.reviews.map((r, i) => (
                  <div key={i} style={{ borderBottom: '1px solid #111', paddingBottom: 14, marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                      <span style={{ fontSize: 12, color: '#d0d0d0' }}>{r.userName}</span>
                      <span style={{ fontSize: 10, color: '#363636' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <Stars rating={r.rating} />
                    <p style={{ fontSize: 13, color: '#555', marginTop: 8, lineHeight: 1.9 }}>{r.comment}</p>
                  </div>
                ))}
                {user && (
                  <div style={{ marginTop: 22, background: '#090909', border: '1px solid #161616', borderRadius: 3, padding: 18 }}>
                    <p style={{ fontSize: 11, color: '#555', letterSpacing: '0.12em', marginBottom: 14 }}>WRITE A REVIEW</p>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => setReview(r => ({ ...r, rating: n }))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: n <= review.rating ? '#888' : '#222' }}>★</button>
                      ))}
                    </div>
                    <textarea value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))} placeholder="Share your experience…" rows={3} style={{ ...inp, marginBottom: 12, resize: 'vertical' }} />
                    <button onClick={submitReview} disabled={submitting} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#d0d0d0', padding: '9px 22px', fontSize: 11, letterSpacing: '0.14em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>{submitting ? 'SUBMITTING…' : 'SUBMIT REVIEW'}</button>
                  </div>
                )}
              </div>
            )}
            {tab === 'ship' && (
              <div style={{ fontSize: 13, color: '#555', lineHeight: 2.4 }}>
                <p>· Free standard delivery on orders above ₹2,000</p>
                <p>· Standard: 4–6 business days via Delhivery / Shiprocket</p>
                <p>· Express: 1–2 business days (₹149)</p>
                <p>· Easy 7-day returns for unworn, tagged items</p>
                <p>· GST invoice generated automatically</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
