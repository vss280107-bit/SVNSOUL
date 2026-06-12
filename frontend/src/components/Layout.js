import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const S = {
  body: { minHeight: '100vh', background: '#080808', color: '#d0d0d0', fontFamily: "'Courier New', Courier, monospace" },
  topbar: { background: '#0f0f0f', borderBottom: '1px solid #1a1a1a', padding: '7px 0', textAlign: 'center', fontSize: 11, letterSpacing: '0.18em', color: '#555' },
  header: { position: 'sticky', top: 0, zIndex: 200, background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #1c1c1c' },
  headerInner: { maxWidth: 1240, margin: '0 auto', padding: '15px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 },
  logo: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', background: 'none', border: 'none', padding: 0 },
  logoBox: { width: 32, height: 32, background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 18, fontFamily: "'Courier New', monospace", fontWeight: 700, letterSpacing: '0.18em', color: '#e0e0e0' },
  nav: { display: 'flex', gap: 32, alignItems: 'center' },
  navBtn: (active) => ({ background: 'none', border: 'none', color: active ? '#e0e0e0' : '#555', fontSize: 12, letterSpacing: '0.14em', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', padding: '4px 0', borderBottom: active ? '1px solid #555' : '1px solid transparent' }),
  actions: { display: 'flex', gap: 14, alignItems: 'center' },
  searchWrap: { position: 'relative' },
  searchInput: { background: '#111', border: '1px solid #1e1e1e', color: '#d0d0d0', padding: '7px 14px', borderRadius: 3, fontSize: 12, fontFamily: 'inherit', width: 160, outline: 'none' },
  iconBtn: (active) => ({ background: 'none', border: 'none', cursor: 'pointer', color: active ? '#c0c0c0' : '#444', fontSize: 18, padding: '4px', lineHeight: 1 }),
  cartBtn: { position: 'relative', background: '#141414', border: '1px solid #242424', borderRadius: 3, padding: '7px 16px', cursor: 'pointer', color: '#d0d0d0', fontFamily: 'inherit', fontSize: 12, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8 },
  badge: { background: '#404040', color: '#e0e0e0', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  footer: { background: '#050505', borderTop: '1px solid #161616', marginTop: 100, padding: '56px 24px 28px' },
  footerGrid: { maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 48, marginBottom: 48 },
  footerHeading: { fontSize: 10, letterSpacing: '0.2em', color: '#444', marginBottom: 18, fontWeight: 700 },
  footerLink: { display: 'block', background: 'none', border: 'none', color: '#3a3a3a', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: '5px 0', textAlign: 'left', letterSpacing: '0.04em' },
  footerBottom: { maxWidth: 1240, margin: '0 auto', borderTop: '1px solid #111', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 },
  footerSmall: { fontSize: 11, color: '#2a2a2a', letterSpacing: '0.06em' },
};

export default function Layout({ page, setPage, children }) {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, wishlist } = useCart();
  const [search, setSearch] = useState('');
  const [mobileSearch, setMobileSearch] = useState(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      setPage({ name: 'shop', params: { search: search.trim() } });
      setSearch('');
    }
  };

  const nav = (name, params = {}) => setPage({ name, params });

  return (
    <div style={S.body}>
      <div style={S.topbar}>
        FREE SHIPPING ABOVE ₹2000 &nbsp;·&nbsp; CODE <span style={{ color: '#909090' }}>NEWUSER</span> FOR 15% OFF &nbsp;·&nbsp; 7-DAY RETURNS
      </div>

      <header style={S.header}>
        <div style={S.headerInner}>
          <button style={S.logo} onClick={() => nav('home')}>
            <div style={S.logoBox}>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <text x="1" y="17" fontSize="13" fill="#b0b0b0" fontFamily="'Courier New',monospace" fontWeight="bold">S7</text>
              </svg>
            </div>
            <span style={S.logoText}>SVNSOUL</span>
          </button>

          <nav style={S.nav}>
            {[['Shop', 'shop'], ['About', 'about'], ['Contact', 'contact']].map(([label, name]) => (
              <button key={name} style={S.navBtn(page?.name === name)} onClick={() => nav(name)}>{label}</button>
            ))}
            {isAdmin && <button style={{ ...S.navBtn(page?.name === 'admin'), color: '#7a6a4a' }} onClick={() => nav('admin')}>Admin ◈</button>}
          </nav>

          <div style={S.actions}>
            <div style={S.searchWrap}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search…"
                style={S.searchInput}
              />
            </div>
            <button style={S.iconBtn(wishlist.length > 0)} onClick={() => nav(user ? 'wishlist' : 'login')} title="Wishlist">
              {wishlist.length > 0 ? '♥' : '♡'}
            </button>
            <button style={S.iconBtn(false)} onClick={() => nav(user ? 'account' : 'login')} title="Account">◎</button>
            <button style={S.cartBtn} onClick={() => nav('cart')}>
              BAG
              {cartCount > 0 && <span style={S.badge}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <main style={{ minHeight: 'calc(100vh - 200px)' }}>{children}</main>

      <footer style={S.footer}>
        <div style={S.footerGrid}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ ...S.logoBox, width: 26, height: 26 }}>
                <svg viewBox="0 0 24 24" width="14" height="14">
                  <text x="1" y="16" fontSize="11" fill="#888" fontFamily="'Courier New',monospace" fontWeight="bold">S7</text>
                </svg>
              </div>
              <span style={{ fontSize: 14, fontFamily: "'Courier New',monospace", fontWeight: 700, letterSpacing: '0.15em', color: '#888' }}>SVNSOUL</span>
            </div>
            <p style={{ fontSize: 12, color: '#333', lineHeight: 1.9, marginBottom: 20 }}>Clothing born from the space between light and shadow. Built for those who move in silence.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {['IG', 'PT', 'TT'].map(s => (
                <a key={s} href="#" style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 3, padding: '6px 11px', color: '#444', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '0.1em', textDecoration: 'none' }}>{s}</a>
              ))}
            </div>
          </div>
          <div>
            <p style={S.footerHeading}>SHOP</p>
            {[['New Arrivals', 'shop', { sort: 'newest' }], ['Tops', 'shop', { category: 'tops' }], ['Bottoms', 'shop', { category: 'bottoms' }], ['Outerwear', 'shop', { category: 'outerwear' }], ['Accessories', 'shop', { category: 'accessories' }]].map(([l, p, params]) => (
              <button key={l} style={S.footerLink} onClick={() => nav(p, params || {})}>{l}</button>
            ))}
          </div>
          <div>
            <p style={S.footerHeading}>HELP</p>
            {[['Size Guide', 'size-guide'], ['FAQ', 'faq'], ['Returns & Refunds', 'returns'], ['Track Order', 'account'], ['Contact Us', 'contact']].map(([l, p]) => (
              <button key={l} style={S.footerLink} onClick={() => nav(p)}>{l}</button>
            ))}
          </div>
          <div>
            <p style={S.footerHeading}>REACH US</p>
            <p style={{ fontSize: 12, color: '#333', lineHeight: 2.2 }}>support@svnsoul.in<br />+91 98765 43210<br />Mon–Sat, 10AM–7PM IST</p>
            <a href="https://wa.me/919876543210" style={{ display: 'inline-block', marginTop: 14, fontSize: 12, color: '#3a6a3a', letterSpacing: '0.06em', textDecoration: 'none' }}>💬 WhatsApp Support</a>
          </div>
        </div>
        <div style={S.footerBottom}>
          <span style={S.footerSmall}>© 2025 SVNSOUL. ALL RIGHTS RESERVED.</span>
          <span style={S.footerSmall}>GST REGISTERED · RAZORPAY SECURED · SHIPROCKET POWERED</span>
        </div>
      </footer>
    </div>
  );
}
