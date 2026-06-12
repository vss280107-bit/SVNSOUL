import { useState } from 'react';
import { useCart } from '../context/CartContext';

export function ProductImage({ category, colorHex = '#111', size = 180 }) {
  const c = colorHex || '#111';
  const d = '#2a2a2a';
  const imgs = {
    tops: <svg viewBox="0 0 120 120" width={size} height={size}><path d="M30 36 L8 56 L24 62 L24 92 L96 92 L96 62 L112 56 L90 36 L76 26 Q60 36 44 26Z" fill={c}/><path d="M44 26 Q60 18 76 26" fill="none" stroke={d} strokeWidth="1.5"/><rect x="55" y="50" width="10" height="6" rx="1" fill={d} opacity="0.5"/></svg>,
    bottoms: <svg viewBox="0 0 120 120" width={size} height={size}><path d="M30 20 L90 20 L88 26 L32 26Z" fill={d} opacity="0.7"/><path d="M32 26 L86 26 L89 115 L68 115 L62 68 L58 68 L52 115 L31 115Z" fill={c}/><line x1="40" y1="26" x2="38" y2="72" stroke={d} strokeWidth="1" opacity="0.5"/><line x1="80" y1="26" x2="82" y2="72" stroke={d} strokeWidth="1" opacity="0.5"/></svg>,
    outerwear: <svg viewBox="0 0 120 120" width={size} height={size}><path d="M28 36 L6 54 L20 60 L20 94 L100 94 L100 60 L114 54 L92 36 L80 28 L60 33 L40 28Z" fill={c}/><line x1="60" y1="33" x2="60" y2="94" stroke={d} strokeWidth="2.5"/><line x1="20" y1="60" x2="100" y2="60" stroke={d} strokeWidth="1" opacity="0.4"/><rect x="20" y="62" width="14" height="12" rx="1" fill={d} opacity="0.5"/></svg>,
    accessories: <svg viewBox="0 0 120 120" width={size} height={size}><ellipse cx="60" cy="66" rx="46" ry="28" fill={c}/><path d="M14 66 Q14 34 60 30 Q106 34 106 66" fill={c}/><path d="M14 68 L4 76 L60 80 L116 76 L106 68" fill={d} opacity="0.5"/><text x="48" y="60" fontSize="8" fill={d} opacity="0.8" fontFamily="monospace" fontWeight="bold">SVN</text></svg>,
  };
  return imgs[category] || imgs.tops;
}

export function Stars({ rating, size = 11 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} viewBox="0 0 10 10" width={size} height={size}>
          <polygon points="5,1 6.2,3.8 9.2,3.8 6.9,5.7 7.7,8.6 5,7 2.3,8.6 3.1,5.7 0.8,3.8 3.8,3.8" fill={i <= Math.round(rating) ? '#888' : '#222'}/>
        </svg>
      ))}
    </span>
  );
}

export function Tag({ label }) {
  const map = {
    bestseller: { bg: '#0f1f0f', color: '#4a7a4a', border: '#1a3a1a' },
    new: { bg: '#0f0f20', color: '#5a6aaa', border: '#1a1a40' },
    limited: { bg: '#1f0f0f', color: '#8a4a4a', border: '#3a1a1a' },
  };
  const s = map[label] || { bg: '#151515', color: '#555', border: '#222' };
  return (
    <span style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 2, background: s.bg, color: s.color, border: '1px solid ' + s.border }}>
      {label}
    </span>
  );
}

export default function ProductCard({ product, setPage }) {
  const { wishlist, toggleWishlist } = useCart();
  const [hovered, setHovered] = useState(false);
  const inWish = wishlist.includes(product._id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const primaryVariant = product.variants?.[0];
  const primaryColor = primaryVariant?.colorHex || '#111';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: '#0c0c0c', border: '1px solid ' + (hovered ? '#242424' : '#161616'), borderRadius: 3, overflow: 'hidden', transition: 'border-color 0.3s', cursor: 'pointer' }}
    >
      <div
        onClick={() => setPage({ name: 'product', params: { id: product._id } })}
        style={{ position: 'relative', background: '#0f0f0f', padding: 28, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}
      >
        <ProductImage category={product.category} colorHex={primaryColor} size={140} />
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 5 }}>
          {(product.tags || []).map(t => <Tag key={t} label={t} />)}
        </div>
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product._id); }}
          style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: inWish ? '#c0c0c0' : '#333', lineHeight: 1 }}
        >
          {inWish ? '♥' : '♡'}
        </button>
        {discount > 0 && (
          <div style={{ position: 'absolute', bottom: 10, right: 10, background: '#0f1f0f', border: '1px solid #1a3a1a', padding: '2px 7px', borderRadius: 2, fontSize: 10, color: '#4a8a4a' }}>
            -{discount}%
          </div>
        )}
      </div>

      <div style={{ padding: '14px 16px' }}>
        <p style={{ fontSize: 10, color: '#383838', letterSpacing: '0.12em', marginBottom: 5, textTransform: 'uppercase' }}>{product.category}</p>
        <p
          onClick={() => setPage({ name: 'product', params: { id: product._id } })}
          style={{ fontSize: 14, color: '#d0d0d0', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8, lineHeight: 1.3 }}
        >
          {product.name}
        </p>
        {product.reviewCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <Stars rating={product.rating} />
            <span style={{ fontSize: 10, color: '#3a3a3a' }}>({product.reviewCount})</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#e0e0e0' }}>₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: 12, color: '#333', textDecoration: 'line-through', marginLeft: 8 }}>₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <button
            onClick={() => setPage({ name: 'product', params: { id: product._id } })}
            style={{ background: '#141414', border: '1px solid #222', color: '#888', padding: '6px 12px', fontSize: 10, letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}
          >
            SELECT
          </button>
        </div>
      </div>
    </div>
  );
}
