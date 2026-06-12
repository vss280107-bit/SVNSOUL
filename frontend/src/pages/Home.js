import { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const heroSlides = [
  { headline: 'WEAR THE VOID', sub: 'New season. No compromise.', tag: 'SS25 COLLECTION' },
  { headline: 'PHANTOM DROP', sub: 'Heavyweight. 400GSM. Unisex.', tag: 'HOODIE SERIES' },
  { headline: 'ECLIPSE CARGO', sub: 'Technical. Tactical. Timeless.', tag: 'BOTTOMS' },
];

export default function Home({ setPage }) {
  const [slide, setSlide] = useState(0);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?featured=true').then(r => { setFeatured(r.data.products.slice(0, 4)); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % 3), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{ height: '90vh', minHeight: 500, background: '#060606', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 20%, #060606 80%)' }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '0 20px', zIndex: 1 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.35em', color: '#333', marginBottom: 28 }}>{heroSlides[slide].tag}</p>
          <h1 style={{ fontSize: 'clamp(52px,11vw,120px)', fontFamily: "'Courier New',monospace", fontWeight: 700, letterSpacing: '0.07em', color: '#e4e4e4', lineHeight: 1, margin: '0 0 22px', transition: 'opacity 0.5s' }}>
            {heroSlides[slide].headline}
          </h1>
          <p style={{ fontSize: 13, color: '#444', letterSpacing: '0.22em', marginBottom: 44 }}>{heroSlides[slide].sub}</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setPage({ name: 'shop', params: {} })} style={{ background: '#161616', border: '1px solid #303030', color: '#d0d0d0', padding: '14px 38px', fontSize: 11, letterSpacing: '0.22em', fontFamily: 'inherit', cursor: 'pointer', borderRadius: 2 }}>SHOP NOW</button>
            <button onClick={() => setPage({ name: 'about', params: {} })} style={{ background: 'none', border: '1px solid #1e1e1e', color: '#555', padding: '14px 38px', fontSize: 11, letterSpacing: '0.22em', fontFamily: 'inherit', cursor: 'pointer', borderRadius: 2 }}>OUR STORY</button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 32, display: 'flex', gap: 10 }}>
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 28 : 8, height: 8, borderRadius: 4, background: i === slide ? '#606060' : '#252525', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.35s' }} />
          ))}
        </div>
      </section>

      {/* Marquee */}
      <div style={{ background: '#0c0c0c', borderTop: '1px solid #161616', borderBottom: '1px solid #161616', overflow: 'hidden', padding: '11px 0' }}>
        <style>{`@keyframes svnMarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
        <div style={{ display: 'flex', gap: 48, animation: 'svnMarquee 20s linear infinite', whiteSpace: 'nowrap' }}>
          {['FREE SHIPPING ₹2000+', 'NEW EVERY FRIDAY', 'QUALITY OVER QUANTITY', 'PHANTOM HOODIE IN STOCK', 'CODE FLAT10 FOR 10% OFF', 'FREE 7-DAY RETURNS', 'GST INVOICE PROVIDED', 'SHIPROCKET POWERED'].concat(['FREE SHIPPING ₹2000+', 'NEW EVERY FRIDAY', 'QUALITY OVER QUANTITY', 'PHANTOM HOODIE IN STOCK']).map((t, i) => (
            <span key={i} style={{ fontSize: 10, letterSpacing: '0.22em', color: '#333' }}>{t} &nbsp;·</span>
          ))}
        </div>
      </div>

      {/* Featured */}
      <section style={{ maxWidth: 1240, margin: '80px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', color: '#363636', marginBottom: 10 }}>HANDPICKED</p>
            <h2 style={{ fontSize: 30, fontWeight: 700, color: '#e0e0e0', letterSpacing: '0.07em', margin: 0 }}>FEATURED DROPS</h2>
          </div>
          <button onClick={() => setPage({ name: 'shop', params: {} })} style={{ background: 'none', border: 'none', color: '#444', fontSize: 11, letterSpacing: '0.18em', cursor: 'pointer', fontFamily: 'inherit' }}>VIEW ALL →</button>
        </div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 20 }}>
            {[1,2,3,4].map(i => <div key={i} style={{ height: 320, background: '#0c0c0c', border: '1px solid #161616', borderRadius: 3, animation: 'pulse 1.5s infinite' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 20 }}>
            {featured.map(p => <ProductCard key={p._id} product={p} setPage={setPage} />)}
          </div>
        )}
      </section>

      {/* Brand Banner */}
      <section style={{ maxWidth: 1240, margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: 3, padding: '56px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.25em', color: '#363636', marginBottom: 18 }}>OUR PHILOSOPHY</p>
            <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '0.06em', color: '#e0e0e0', lineHeight: 1.15, marginBottom: 22 }}>BUILT FOR THOSE WHO OPERATE IN SILENCE</h2>
            <p style={{ fontSize: 13, color: '#404040', lineHeight: 2.1, marginBottom: 30 }}>SVNSOUL was born from a frustration with fast fashion. We source 280–400GSM cotton from mills in Tirupur, pre-wash everything, and stress-test every seam. Small drops. No overstock. When it's gone, it's gone.</p>
            <button onClick={() => setPage({ name: 'about', params: {} })} style={{ background: 'none', border: '1px solid #1e1e1e', padding: '11px 26px', color: '#666', fontSize: 11, letterSpacing: '0.18em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>READ THE STORY</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[['40+', 'Pieces per drop'], ['100%', 'Quality tested'], ['7-day', 'Easy returns'], ['₹0', 'Shipping ₹2K+']].map(([n, l]) => (
              <div key={n} style={{ background: '#0d0d0d', border: '1px solid #161616', borderRadius: 3, padding: '22px 18px' }}>
                <p style={{ fontSize: 26, fontWeight: 700, color: '#e0e0e0', margin: '0 0 7px' }}>{n}</p>
                <p style={{ fontSize: 10, color: '#383838', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section style={{ maxWidth: 1240, margin: '0 auto 60px', padding: '0 24px' }}>
        <div style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: 3, padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#e0e0e0', letterSpacing: '0.06em', marginBottom: 4 }}>NEW USER OFFER — 15% OFF</p>
            <p style={{ fontSize: 12, color: '#444' }}>No minimum. First order only. Limited time.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ background: '#111', border: '1px dashed #2a2a2a', padding: '10px 22px', borderRadius: 3 }}>
              <span style={{ fontSize: 16, letterSpacing: '0.22em', color: '#909090', fontWeight: 700 }}>NEWUSER</span>
            </div>
            <button onClick={() => setPage({ name: 'shop', params: {} })} style={{ background: '#1e1e1e', border: '1px solid #2e2e2e', color: '#d0d0d0', padding: '11px 24px', fontSize: 11, letterSpacing: '0.18em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>SHOP NOW</button>
          </div>
        </div>
      </section>

      {/* WhatsApp float */}
      <a href="https://wa.me/919876543210?text=Hi%20SVNSOUL%2C%20I%20need%20help" target="_blank" rel="noreferrer"
        style={{ position: 'fixed', bottom: 28, right: 28, background: '#1a2e1a', border: '1px solid #2a4a2a', borderRadius: '50%', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, textDecoration: 'none', zIndex: 999 }}>
        💬
      </a>
    </div>
  );
}
