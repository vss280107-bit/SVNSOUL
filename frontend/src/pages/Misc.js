import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

// ── ORDER CONFIRM ────────────────────────────────────────────
export function OrderConfirm({ setPage, order }) {
  return (
    <div style={{ maxWidth: 540, margin: '80px auto', textAlign: 'center', padding: '0 24px', fontFamily: 'monospace' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#091409', border: '1px solid #1a3a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 26, color: '#4a9a4a' }}>✓</div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e0e0e0', letterSpacing: '0.08em', marginBottom: 12 }}>ORDER PLACED!</h1>
      {order && <p style={{ fontSize: 13, color: '#555', marginBottom: 6 }}>Order #{order.orderNumber}</p>}
      <p style={{ fontSize: 13, color: '#444', lineHeight: 2, marginBottom: 36 }}>You'll receive a confirmation SMS and email shortly. Track your shipment from your account page.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => setPage({ name: 'account', params: {} })} style={{ background: '#161616', border: '1px solid #262626', color: '#d0d0d0', padding: '12px 26px', fontSize: 11, letterSpacing: '0.16em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>VIEW ORDERS</button>
        <button onClick={() => setPage({ name: 'shop', params: {} })} style={{ background: 'none', border: '1px solid #161616', color: '#555', padding: '12px 26px', fontSize: 11, letterSpacing: '0.16em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>CONTINUE SHOPPING</button>
      </div>
    </div>
  );
}

// ── CART ─────────────────────────────────────────────────────
export function Cart({ setPage }) {
  const { cart, removeFromCart, updateQty, cartSubtotal } = useCart();
  if (cart.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', fontFamily: 'monospace' }}>
      <p style={{ fontSize: 36, color: '#1e1e1e', marginBottom: 24 }}>◻</p>
      <h2 style={{ fontSize: 18, color: '#d0d0d0', letterSpacing: '0.1em', marginBottom: 12 }}>YOUR BAG IS EMPTY</h2>
      <p style={{ fontSize: 12, color: '#363636', marginBottom: 32 }}>Add something you love.</p>
      <button onClick={() => setPage({ name: 'shop', params: {} })} style={{ background: '#161616', border: '1px solid #262626', color: '#d0d0d0', padding: '12px 28px', fontSize: 11, letterSpacing: '0.16em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>START SHOPPING</button>
    </div>
  );
  const shipping = cartSubtotal >= 2000 ? 0 : 99;
  const gst = Math.round(cartSubtotal * 0.18);
  return (
    <div style={{ maxWidth: 1000, margin: '44px auto', padding: '0 24px', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.1em', color: '#e0e0e0', marginBottom: 36 }}>YOUR BAG ({cart.reduce((s, i) => s + i.qty, 0)} items)</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40 }}>
        <div>
          {cart.map(item => (
            <div key={item.key} style={{ display: 'flex', gap: 20, borderBottom: '1px solid #111', paddingBottom: 24, marginBottom: 24 }}>
              <div style={{ background: '#0c0c0c', border: '1px solid #161616', borderRadius: 3, width: 90, height: 90, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, cursor: 'pointer' }} onClick={() => setPage({ name: 'product', params: { id: item.product._id } })}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: item.colorHex || '#111' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, color: '#e0e0e0', fontWeight: 700, marginBottom: 5 }}>{item.product.name}</p>
                <p style={{ fontSize: 12, color: '#444', marginBottom: 14 }}>Size: {item.size} · Color: {item.color}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1a1a1a', borderRadius: 2 }}>
                    <button onClick={() => updateQty(item.key, item.qty - 1)} style={{ background: 'none', border: 'none', color: '#555', padding: '6px 13px', cursor: 'pointer', fontSize: 15, fontFamily: 'inherit' }}>−</button>
                    <span style={{ padding: '6px 12px', fontSize: 13, color: '#d0d0d0' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.key, item.qty + 1)} style={{ background: 'none', border: 'none', color: '#555', padding: '6px 13px', cursor: 'pointer', fontSize: 15, fontFamily: 'inherit' }}>+</button>
                  </div>
                  <p style={{ fontSize: 15, color: '#e0e0e0', fontWeight: 700 }}>₹{(item.price * item.qty).toLocaleString()}</p>
                  <button onClick={() => removeFromCart(item.key)} style={{ background: 'none', border: 'none', color: '#2a2a2a', fontSize: 18, cursor: 'pointer', padding: '4px' }}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: '#090909', border: '1px solid #161616', borderRadius: 3, padding: 22, height: 'fit-content' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#e0e0e0', letterSpacing: '0.12em', marginBottom: 18 }}>ORDER SUMMARY</p>
          {[['Subtotal', '₹' + cartSubtotal.toLocaleString()], ['Shipping', shipping === 0 ? 'FREE' : '₹' + shipping], ['GST (18%)', '₹' + gst.toLocaleString()]].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><span style={{ fontSize: 12, color: '#555' }}>{l}</span><span style={{ fontSize: 12, color: '#888' }}>{v}</span></div>
          ))}
          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 14, marginTop: 6, display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#e0e0e0' }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#e0e0e0' }}>₹{(cartSubtotal + shipping + gst).toLocaleString()}</span>
          </div>
          <button onClick={() => setPage({ name: 'checkout', params: {} })} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2e2e2e', color: '#e0e0e0', padding: '14px', fontSize: 11, letterSpacing: '0.2em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2, marginBottom: 10 }}>PROCEED TO CHECKOUT</button>
          <button onClick={() => setPage({ name: 'shop', params: {} })} style={{ width: '100%', background: 'none', border: '1px solid #161616', color: '#444', padding: '10px', fontSize: 11, letterSpacing: '0.16em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>CONTINUE SHOPPING</button>
        </div>
      </div>
    </div>
  );
}

// ── WISHLIST ─────────────────────────────────────────────────
export function Wishlist({ setPage }) {
  const { wishlist, toggleWishlist } = useCart();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (wishlist.length > 0) api.get('/products').then(r => setProducts(r.data.products.filter(p => wishlist.includes(p._id))));
  }, [wishlist]);
  return (
    <div style={{ maxWidth: 1100, margin: '44px auto', padding: '0 24px', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.1em', color: '#e0e0e0', marginBottom: 36 }}>WISHLIST ({wishlist.length})</h1>
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <p style={{ fontSize: 13, color: '#363636', marginBottom: 24 }}>Nothing saved yet. Heart items to save them.</p>
          <button onClick={() => setPage({ name: 'shop', params: {} })} style={{ background: '#161616', border: '1px solid #262626', color: '#d0d0d0', padding: '11px 26px', fontSize: 11, letterSpacing: '0.16em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>BROWSE SHOP</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
          {products.map(p => <ProductCard key={p._id} product={p} setPage={setPage} />)}
        </div>
      )}
    </div>
  );
}

// ── FAQ ───────────────────────────────────────────────────────
export function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    ['How do I find my size?', 'Check our Size Guide for detailed measurements in cm and inches. If between sizes, size up for relaxed fit.'],
    ['How long does shipping take?', 'Standard delivery: 4–6 business days. Express (₹149): 1–2 days. Free shipping on orders above ₹2,000.'],
    ['Can I return or exchange?', 'Unworn items with tags can be returned within 7 days. Initiate from your account page.'],
    ['Do you offer COD?', 'Yes. COD, UPI, Razorpay (cards/wallets/netbanking) all accepted.'],
    ['How do I track my order?', 'After shipping, you get SMS/email with a tracking link. Also visible in your account under orders.'],
    ['Do you restock sold-out items?', 'Most pieces are limited drops and won\'t restock. Wishlist items to stay notified.'],
    ['Is GST invoice provided?', 'Yes — automatically generated and emailed for every order.'],
    ['How do I use a promo code?', 'Enter at checkout under Promo Code. Codes are: FLAT10, NEWUSER, SVN20, PHANTOM.'],
  ];
  return (
    <div style={{ maxWidth: 700, margin: '64px auto', padding: '0 24px', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.1em', color: '#e0e0e0', marginBottom: 44 }}>FREQUENTLY ASKED</h1>
      {faqs.map(([q, a], i) => (
        <div key={i} style={{ borderBottom: '1px solid #111' }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: '18px 0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'inherit', fontFamily: 'inherit' }}>
            <span style={{ fontSize: 13, color: '#d0d0d0' }}>{q}</span>
            <span style={{ color: '#363636', fontSize: 18, flexShrink: 0, marginLeft: 12 }}>{open === i ? '−' : '+'}</span>
          </button>
          {open === i && <p style={{ fontSize: 13, color: '#555', lineHeight: 2.1, paddingBottom: 18 }}>{a}</p>}
        </div>
      ))}
    </div>
  );
}

// ── SIZE GUIDE ───────────────────────────────────────────────
export function SizeGuide() {
  const [unit, setUnit] = useState('cm');
  const tops = [['XS','86-91',42,65],['S','91-96',44,67],['M','96-101',46,69],['L','101-106',48,71],['XL','106-111',50,73],['XXL','111-116',52,75]];
  const conv = (n) => unit === 'cm' ? n : typeof n === 'string' ? n.split('-').map(x => (x/2.54).toFixed(1)).join('-') : (n/2.54).toFixed(1);
  return (
    <div style={{ maxWidth: 760, margin: '64px auto', padding: '0 24px', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.1em', color: '#e0e0e0', marginBottom: 36 }}>SIZE GUIDE</h1>
      <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
        {['cm', 'in'].map(u => <button key={u} onClick={() => setUnit(u)} style={{ background: unit === u ? '#1a1a1a' : 'none', border: '1px solid ' + (unit === u ? '#2a2a2a' : '#161616'), color: unit === u ? '#e0e0e0' : '#444', padding: '8px 20px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>{u.toUpperCase()}</button>)}
      </div>
      <p style={{ fontSize: 12, color: '#555', letterSpacing: '0.12em', marginBottom: 16 }}>TOPS — ALL MEASUREMENTS IN {unit.toUpperCase()}</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 40 }}>
        <thead><tr style={{ borderBottom: '1px solid #1a1a1a' }}>{['SIZE','CHEST','SHOULDER','LENGTH'].map(h => <th key={h} style={{ textAlign: 'left', fontSize: 10, color: '#363636', letterSpacing: '0.12em', paddingBottom: 12 }}>{h}</th>)}</tr></thead>
        <tbody>{tops.map(([s,c,sh,l]) => <tr key={s} style={{ borderBottom: '1px solid #0e0e0e' }}><td style={{ padding: '12px 0', fontSize: 13, color: '#d0d0d0', fontWeight: 700 }}>{s}</td><td style={{ padding: '12px 0', fontSize: 13, color: '#555' }}>{conv(c)}</td><td style={{ padding: '12px 0', fontSize: 13, color: '#555' }}>{conv(sh)}</td><td style={{ padding: '12px 0', fontSize: 13, color: '#555' }}>{conv(l)}</td></tr>)}</tbody>
      </table>
      <div style={{ background: '#090909', border: '1px solid #141414', borderRadius: 3, padding: 20 }}>
        <p style={{ fontSize: 12, color: '#555', marginBottom: 8 }}>💡 FIT TIPS</p>
        <p style={{ fontSize: 12, color: '#363636', lineHeight: 2 }}>· Oversized tees and hoodies run true to size on our boxy pattern — no need to size up for the relaxed look.<br/>· Joggers and cargo pants: if between sizes, size up for comfort around the waist.<br/>· Jackets: true to size. Layer underneath? Size up.</p>
      </div>
    </div>
  );
}

// ── RETURNS ───────────────────────────────────────────────────
export function Returns() {
  return (
    <div style={{ maxWidth: 680, margin: '64px auto', padding: '0 24px', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.1em', color: '#e0e0e0', marginBottom: 44 }}>RETURNS & REFUNDS</h1>
      {[['7-DAY RETURN POLICY', 'Items can be returned within 7 days of delivery. Items must be unworn, unwashed, and have all original tags attached.'], ['HOW TO INITIATE', 'Log into your account → Order History → Initiate Return. We\'ll arrange a free pickup within 48 hours.'], ['REFUND TIMELINE', 'Refunds are processed within 5–7 business days after we receive and inspect the returned item.'], ['NON-RETURNABLE', 'Accessories and items marked Final Sale cannot be returned. Customized items are also non-returnable.'], ['EXCHANGES', 'Size exchanges are free within 7 days, subject to availability. Email support@svnsoul.in.']].map(([t, b]) => (
        <div key={t} style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 10, color: '#888', letterSpacing: '0.18em', fontWeight: 700, marginBottom: 10 }}>{t}</p>
          <p style={{ fontSize: 13, color: '#444', lineHeight: 2.1 }}>{b}</p>
        </div>
      ))}
    </div>
  );
}
