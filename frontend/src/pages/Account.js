import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const STATUS_COLORS = { placed: '#5a6aaa', confirmed: '#4a8a4a', processing: '#8a7a2a', shipped: '#4a7a9a', out_for_delivery: '#7a5a9a', delivered: '#4a9a6a', cancelled: '#8a4a4a', returned: '#6a3a3a' };

export default function Account({ setPage }) {
  const { user, logout } = useAuth();
  const { wishlist } = useCart();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then(r => { setOrders(r.data.orders); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const doLogout = () => { logout(); setPage({ name: 'home', params: {} }); };

  return (
    <div style={{ maxWidth: 860, margin: '44px auto', padding: '0 24px', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
        <div>
          <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.22em', marginBottom: 8 }}>MY ACCOUNT</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e0e0e0', letterSpacing: '0.08em', margin: 0 }}>WELCOME, {user?.name?.toUpperCase()}</h1>
        </div>
        <button onClick={doLogout} style={{ background: 'none', border: '1px solid #1e1e1e', color: '#444', padding: '9px 20px', fontSize: 10, letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>LOGOUT</button>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 36 }}>
        {[['ORDERS', orders.length, 'orders'], ['WISHLIST', wishlist.length, 'wishlist'], ['ACCOUNT', '◎', 'profile']].map(([l, v, t]) => (
          <button key={l} onClick={() => setTab(t)} style={{ background: '#090909', border: '1px solid ' + (tab === t ? '#2a2a2a' : '#141414'), borderRadius: 3, padding: '22px 18px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: 'inherit' }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#e0e0e0', margin: '0 0 8px' }}>{v}</p>
            <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.14em' }}>{l}</p>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #161616', marginBottom: 28 }}>
        {['orders', 'wishlist', 'profile'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', borderBottom: '2px solid ' + (tab === t ? '#888' : 'transparent'), color: tab === t ? '#d0d0d0' : '#363636', padding: '10px 20px', fontSize: 11, letterSpacing: '0.14em', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase' }}>{t}</button>
        ))}
      </div>

      {tab === 'orders' && (
        <div>
          {loading && <p style={{ fontSize: 13, color: '#363636' }}>Loading orders…</p>}
          {!loading && orders.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <p style={{ fontSize: 14, color: '#363636', marginBottom: 20 }}>No orders placed yet.</p>
              <button onClick={() => setPage({ name: 'shop', params: {} })} style={{ background: '#161616', border: '1px solid #242424', color: '#d0d0d0', padding: '11px 26px', fontSize: 11, letterSpacing: '0.14em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>START SHOPPING</button>
            </div>
          )}
          {orders.map(o => (
            <div key={o._id} style={{ background: '#090909', border: '1px solid #141414', borderRadius: 3, padding: 22, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <p style={{ fontSize: 14, color: '#e0e0e0', fontWeight: 700, marginBottom: 4 }}>#{o.orderNumber}</p>
                  <p style={{ fontSize: 11, color: '#444' }}>{new Date(o.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 15, color: '#a0a0a0', marginBottom: 8 }}>₹{(o.pricing?.total || 0).toLocaleString()}</p>
                  <span style={{ fontSize: 10, border: '1px solid', borderColor: STATUS_COLORS[o.status] || '#222', color: STATUS_COLORS[o.status] || '#555', padding: '3px 10px', borderRadius: 2, letterSpacing: '0.1em' }}>
                    {o.status.toUpperCase().replace('_', ' ')}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: '#3a3a3a', marginBottom: 14 }}>{(o.items || []).map(i => i.name + ' ×' + i.qty).join(' · ')}</p>
              {/* Status timeline */}
              <div style={{ display: 'flex', gap: 0, alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                {['placed', 'confirmed', 'shipped', 'delivered'].map((s, i) => {
                  const done = ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].indexOf(o.status) >= ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].indexOf(s);
                  return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: done ? '#4a8a4a' : '#1a1a1a', border: '1px solid ' + (done ? '#2a5a2a' : '#2a2a2a') }} />
                      <span style={{ fontSize: 9, color: done ? '#4a7a4a' : '#2a2a2a', letterSpacing: '0.1em' }}>{s.toUpperCase()}</span>
                      {i < 3 && <div style={{ width: 20, height: 1, background: done ? '#1a3a1a' : '#161616' }} />}
                    </div>
                  );
                })}
              </div>
              {o.tracking?.trackingId && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: '#0a0a0a', border: '1px solid #161616', borderRadius: 2 }}>
                  <p style={{ fontSize: 11, color: '#555' }}>Tracking: <span style={{ color: '#4a7a9a' }}>{o.tracking.courier} — {o.tracking.trackingId}</span></p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'wishlist' && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ fontSize: 14, color: '#d0d0d0', marginBottom: 8 }}>{wishlist.length} saved items</p>
          <p style={{ fontSize: 12, color: '#363636', marginBottom: 24 }}>Your wishlist is stored locally. Sign in on any device to access.</p>
          <button onClick={() => setPage({ name: 'wishlist', params: {} })} style={{ background: '#161616', border: '1px solid #242424', color: '#d0d0d0', padding: '11px 26px', fontSize: 11, letterSpacing: '0.14em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>VIEW WISHLIST →</button>
        </div>
      )}

      {tab === 'profile' && (
        <div style={{ background: '#090909', border: '1px solid #141414', borderRadius: 3, padding: 28 }}>
          <p style={{ fontSize: 12, color: '#555', letterSpacing: '0.12em', marginBottom: 22 }}>PROFILE DETAILS</p>
          {[['Name', user?.name], ['Email', user?.email], ['Role', user?.role?.toUpperCase()]].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #111', paddingBottom: 14, marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: '#444' }}>{l}</span>
              <span style={{ fontSize: 12, color: '#a0a0a0' }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
