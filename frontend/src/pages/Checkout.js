import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProductImage } from '../components/ProductCard';
import api from '../utils/api';

const inp = { background: '#0e0e0e', border: '1px solid #1a1a1a', color: '#d0d0d0', padding: '11px 14px', fontSize: 13, fontFamily: 'inherit', borderRadius: 2, outline: 'none', width: '100%', boxSizing: 'border-box' };

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout({ setPage }) {
  const { cart, cartSubtotal, clearCart, PROMO_CODES } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState({ name: user?.name || '', phone: '', email: user?.email || '', line1: '', line2: '', city: '', state: '', pin: '' });
  const [payMethod, setPayMethod] = useState('razorpay');
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoErr, setPromoErr] = useState('');
  const [processing, setProcessing] = useState(false);
  const [err, setErr] = useState('');

  const shipping = cartSubtotal >= 2000 ? 0 : 99;
  const gst = Math.round(cartSubtotal * 0.18);
  const discount = promoApplied ? Math.round(cartSubtotal * PROMO_CODES[promoApplied]) : 0;
  const total = cartSubtotal + shipping + gst - discount;

  const applyPromo = () => {
    const code = promo.toUpperCase().trim();
    if (PROMO_CODES[code]) { setPromoApplied(code); setPromoErr(''); }
    else setPromoErr('Invalid promo code. Try NEWUSER, FLAT10, SVN20');
  };

  const buildOrderPayload = (paymentInfo) => ({
    items: cart.map(i => ({ product: i.product._id, name: i.product.name, image: '', size: i.size, color: i.color, colorHex: i.colorHex, qty: i.qty, price: i.price })),
    shippingAddress: addr,
    pricing: { subtotal: cartSubtotal, shipping, gst, discount, total, promoCode: promoApplied || '' },
    payment: paymentInfo,
  });

  const handleRazorpay = async () => {
    setProcessing(true); setErr('');
    const ok = await loadRazorpay();
    if (!ok) { setErr('Could not load Razorpay. Check internet connection.'); setProcessing(false); return; }
    try {
      const { data } = await api.post('/orders/razorpay/create-order', { amount: total });
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: 'INR',
        name: 'SVNSOUL',
        description: 'Order Payment',
        order_id: data.order.id,
        prefill: { name: addr.name, email: addr.email, contact: addr.phone },
        theme: { color: '#1a1a1a', backdrop_color: '#080808' },
        handler: async function(response) {
          try {
            // Create order in DB first
            const { data: orderData } = await api.post('/orders', buildOrderPayload({ method: 'razorpay' }));
            // Verify payment
            await api.post('/orders/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.order._id,
            });
            clearCart();
            setPage({ name: 'order-confirm', params: { order: orderData.order } });
          } catch (e) { setErr('Payment verification failed. Contact support.'); }
          setProcessing(false);
        },
        modal: { ondismiss: () => setProcessing(false) }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) { setErr(e.response?.data?.message || 'Payment initiation failed'); setProcessing(false); }
  };

  const handleCOD = async () => {
    setProcessing(true); setErr('');
    try {
      const { data } = await api.post('/orders', buildOrderPayload({ method: 'cod' }));
      clearCart();
      setPage({ name: 'order-confirm', params: { order: data.order } });
    } catch (e) { setErr(e.response?.data?.message || 'Order placement failed'); }
    setProcessing(false);
  };

  const placeOrder = () => {
    if (payMethod === 'razorpay' || payMethod === 'upi' || payMethod === 'card') handleRazorpay();
    else handleCOD();
  };

  if (cart.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'monospace' }}>
      <p style={{ fontSize: 14, color: '#363636', marginBottom: 20 }}>Your bag is empty.</p>
      <button onClick={() => setPage({ name: 'shop', params: {} })} style={{ background: '#161616', border: '1px solid #242424', color: '#d0d0d0', padding: '12px 28px', fontSize: 11, letterSpacing: '0.18em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>SHOP NOW</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1040, margin: '44px auto', padding: '0 24px', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.1em', color: '#e0e0e0', marginBottom: 36 }}>CHECKOUT</h1>

      {/* Steps */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 40 }}>
        {['Address', 'Payment', 'Review'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: step > i+1 ? '#0f1f0f' : step === i+1 ? '#1a1a1a' : '#090909', border: '1px solid ' + (step >= i+1 ? '#3a3a3a' : '#161616'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: step > i+1 ? '#4a8a4a' : step === i+1 ? '#e0e0e0' : '#2a2a2a' }}>{step > i+1 ? '✓' : i+1}</div>
              <span style={{ fontSize: 11, color: step === i+1 ? '#d0d0d0' : '#363636', letterSpacing: '0.12em' }}>{s.toUpperCase()}</span>
            </div>
            {i < 2 && <div style={{ width: 36, height: 1, background: '#161616', margin: '0 14px' }} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40 }}>
        {/* Left */}
        <div>
          {step === 1 && (
            <div>
              <p style={{ fontSize: 12, color: '#666', letterSpacing: '0.14em', marginBottom: 22 }}>DELIVERY ADDRESS</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[['Full Name', 'name'], ['Phone', 'phone'], ['Email', 'email'], ['Flat / House No.', 'line1'], ['Street / Area / Landmark', 'line2'], ['City', 'city'], ['State', 'state'], ['PIN Code', 'pin']].map(([label, field]) => (
                  <div key={field} style={{ gridColumn: ['email', 'line2'].includes(field) ? '1/-1' : 'auto' }}>
                    <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.12em', marginBottom: 6 }}>{label.toUpperCase()}</p>
                    <input value={addr[field]} onChange={e => setAddr(a => ({ ...a, [field]: e.target.value }))} style={inp} />
                  </div>
                ))}
              </div>
              <button onClick={() => { if (!addr.name || !addr.phone || !addr.line1 || !addr.city || !addr.pin) { alert('Please fill all required fields'); return; } setStep(2); }} style={{ marginTop: 24, background: '#1e1e1e', border: '1px solid #2e2e2e', color: '#e0e0e0', padding: '13px 32px', fontSize: 11, letterSpacing: '0.18em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>CONTINUE →</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <p style={{ fontSize: 12, color: '#666', letterSpacing: '0.14em', marginBottom: 22 }}>PAYMENT METHOD</p>
              {[['razorpay', 'Razorpay — Cards, UPI, Netbanking, Wallets', '✓ Recommended'], ['upi', 'UPI / QR Code', ''], ['card', 'Credit / Debit Card', ''], ['cod', 'Cash on Delivery', '₹0 extra']].map(([val, label, note]) => (
                <button key={val} onClick={() => setPayMethod(val)} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', background: payMethod === val ? '#0e0e0e' : 'none', border: '1px solid ' + (payMethod === val ? '#2a2a2a' : '#141414'), borderRadius: 3, padding: '16px 20px', marginBottom: 10, cursor: 'pointer', color: 'inherit', fontFamily: 'inherit', textAlign: 'left' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid ' + (payMethod === val ? '#888' : '#2a2a2a'), background: payMethod === val ? '#888' : 'none', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: 13, color: payMethod === val ? '#d0d0d0' : '#555', letterSpacing: '0.06em' }}>{label}</span>
                    {note && <span style={{ fontSize: 10, color: '#4a6a4a', marginLeft: 10, letterSpacing: '0.08em' }}>{note}</span>}
                  </div>
                </button>
              ))}
              {payMethod === 'razorpay' && (
                <div style={{ background: '#090909', border: '1px solid #161616', borderRadius: 3, padding: '14px 18px', marginTop: 10 }}>
                  <p style={{ fontSize: 11, color: '#4a6a4a', letterSpacing: '0.1em' }}>🔒 Secured by Razorpay. Test mode: use card 4111 1111 1111 1111, any future expiry, any CVV.</p>
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: '1px solid #161616', color: '#444', padding: '12px 24px', fontSize: 11, letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>← BACK</button>
                <button onClick={() => setStep(3)} style={{ flex: 1, background: '#1e1e1e', border: '1px solid #2e2e2e', color: '#e0e0e0', padding: '13px', fontSize: 11, letterSpacing: '0.18em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>REVIEW ORDER →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p style={{ fontSize: 12, color: '#666', letterSpacing: '0.14em', marginBottom: 22 }}>ORDER REVIEW</p>
              {cart.map(i => (
                <div key={i.key} style={{ display: 'flex', gap: 16, borderBottom: '1px solid #111', paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ background: '#0c0c0c', border: '1px solid #161616', borderRadius: 3, padding: 10, flexShrink: 0 }}>
                    <ProductImage category={i.product.category} colorHex={i.colorHex} size={52} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: '#d0d0d0', marginBottom: 4 }}>{i.product.name}</p>
                    <p style={{ fontSize: 11, color: '#444' }}>Size {i.size} · {i.color} · Qty {i.qty}</p>
                  </div>
                  <p style={{ fontSize: 13, color: '#a0a0a0' }}>₹{(i.price * i.qty).toLocaleString()}</p>
                </div>
              ))}
              <div style={{ background: '#090909', border: '1px solid #161616', borderRadius: 3, padding: '14px 18px', marginBottom: 20 }}>
                <p style={{ fontSize: 11, color: '#555', marginBottom: 6 }}>Delivering to: <span style={{ color: '#888' }}>{addr.name}, {addr.line1}, {addr.city} - {addr.pin}</span></p>
                <p style={{ fontSize: 11, color: '#555' }}>Payment: <span style={{ color: '#888' }}>{payMethod === 'cod' ? 'Cash on Delivery' : payMethod === 'razorpay' ? 'Razorpay' : payMethod.toUpperCase()}</span></p>
              </div>
              {err && <div style={{ background: '#1a0a0a', border: '1px solid #3a1a1a', borderRadius: 3, padding: '12px 16px', marginBottom: 16 }}><p style={{ fontSize: 12, color: '#8a4a4a' }}>⚠ {err}</p></div>}
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(2)} style={{ background: 'none', border: '1px solid #161616', color: '#444', padding: '12px 24px', fontSize: 11, letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>← BACK</button>
                <button onClick={placeOrder} disabled={processing} style={{ flex: 1, background: processing ? '#0f1f0f' : '#0f2a0f', border: '1px solid ' + (processing ? '#1a3a1a' : '#1a4a1a'), color: '#4a9a4a', padding: '14px', fontSize: 11, letterSpacing: '0.2em', cursor: processing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>
                  {processing ? 'PROCESSING…' : 'PLACE ORDER — ₹' + total.toLocaleString()}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div style={{ background: '#090909', border: '1px solid #161616', borderRadius: 3, padding: 22, height: 'fit-content' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#e0e0e0', letterSpacing: '0.12em', marginBottom: 18 }}>ORDER TOTAL</p>
          <div style={{ fontSize: 12, color: '#555' }}>
            {cart.map(i => (
              <div key={i.key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.product.name} ×{i.qty}</span>
                <span style={{ color: '#888', flexShrink: 0 }}>₹{(i.price * i.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #141414', paddingTop: 14, marginTop: 10 }}>
            <Row label="Subtotal" val={'₹' + cartSubtotal.toLocaleString()} />
            <Row label="Shipping" val={shipping === 0 ? 'FREE' : '₹' + shipping} valColor={shipping === 0 ? '#4a8a4a' : undefined} />
            <Row label="GST (18%)" val={'₹' + gst.toLocaleString()} />
            {discount > 0 && <Row label={'Discount (' + promoApplied + ')'} val={'-₹' + discount.toLocaleString()} valColor="#4a8a4a" />}
          </div>
          {/* Promo */}
          <div style={{ borderTop: '1px solid #141414', paddingTop: 14, marginTop: 8, marginBottom: 14 }}>
            <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.12em', marginBottom: 8 }}>PROMO CODE</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Enter code" style={{ flex: 1, background: '#0e0e0e', border: '1px solid #1a1a1a', color: '#d0d0d0', padding: '8px 10px', fontSize: 11, fontFamily: 'inherit', borderRadius: 2, outline: 'none' }} />
              <button onClick={applyPromo} style={{ background: '#141414', border: '1px solid #1e1e1e', color: '#888', padding: '8px 12px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2, letterSpacing: '0.1em' }}>APPLY</button>
            </div>
            {promoErr && <p style={{ fontSize: 11, color: '#6a3a3a', marginTop: 6 }}>{promoErr}</p>}
            {promoApplied && <p style={{ fontSize: 11, color: '#4a7a4a', marginTop: 6 }}>✓ {promoApplied} applied</p>}
          </div>
          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 14, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#e0e0e0' }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#e0e0e0' }}>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, val, valColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
      <span style={{ fontSize: 12, color: '#555' }}>{label}</span>
      <span style={{ fontSize: 12, color: valColor || '#888' }}>{val}</span>
    </div>
  );
}
