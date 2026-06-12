import { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const inp = { background: '#0e0e0e', border: '1px solid #1a1a1a', color: '#d0d0d0', fontFamily: 'inherit', borderRadius: 2, outline: 'none' };
const filterBtn = (active) => ({ background: active ? '#1e1e1e' : 'none', border: '1px solid ' + (active ? '#2e2e2e' : '#161616'), color: active ? '#d0d0d0' : '#444', padding: '5px 12px', fontSize: 11, letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 });

export default function Shop({ setPage, initialParams = {} }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: initialParams.category || 'all', size: 'all', maxPrice: 6000 });
  const [sort, setSort] = useState(initialParams.sort || 'featured');
  const [search, setSearch] = useState(initialParams.search || '');

  const cats = ['all', 'tops', 'bottoms', 'outerwear', 'accessories'];
  const sizes = ['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category !== 'all') params.append('category', filters.category);
    if (filters.size !== 'all') params.append('size', filters.size);
    params.append('maxPrice', filters.maxPrice);
    if (sort !== 'featured') params.append('sort', sort);
    if (search) params.append('search', search);
    api.get('/products?' + params.toString())
      .then(r => { setProducts(r.data.products); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filters, sort, search]);

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '44px 24px' }}>
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.22em', marginBottom: 8 }}>BROWSE</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.08em', color: '#e0e0e0', margin: 0 }}>ALL PRODUCTS</h1>
        <p style={{ fontSize: 12, color: '#363636', marginTop: 6 }}>{loading ? '...' : products.length + ' items'}</p>
      </div>

      {/* Filter bar */}
      <div style={{ background: '#090909', border: '1px solid #161616', borderRadius: 3, padding: '20px 22px', marginBottom: 32 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
          {/* Search */}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" style={{ ...inp, padding: '7px 14px', fontSize: 12, width: 180 }} />

          {/* Category */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#363636', letterSpacing: '0.12em' }}>CAT:</span>
            {cats.map(c => <button key={c} style={filterBtn(filters.category === c)} onClick={() => setFilters(f => ({ ...f, category: c }))}>{c.toUpperCase()}</button>)}
          </div>

          {/* Size */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#363636', letterSpacing: '0.12em' }}>SIZE:</span>
            {sizes.slice(0, 8).map(s => <button key={s} style={filterBtn(filters.size === s)} onClick={() => setFilters(f => ({ ...f, size: s }))}>{s}</button>)}
          </div>

          {/* Price */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#363636', letterSpacing: '0.12em' }}>MAX:</span>
            <input type="range" min={500} max={6000} step={100} value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: +e.target.value }))} style={{ width: 100, accentColor: '#555' }} />
            <span style={{ fontSize: 11, color: '#888', minWidth: 52 }}>₹{filters.maxPrice.toLocaleString()}</span>
          </div>

          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...inp, padding: '7px 12px', fontSize: 11, cursor: 'pointer' }}>
            <option value="featured">FEATURED</option>
            <option value="newest">NEWEST</option>
            <option value="price-asc">PRICE ↑</option>
            <option value="price-desc">PRICE ↓</option>
            <option value="rating">TOP RATED</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
          {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: 320, background: '#0c0c0c', border: '1px solid #161616', borderRadius: 3 }} />)}
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 100, color: '#363636' }}>
          <p style={{ fontSize: 14, marginBottom: 16 }}>No products found.</p>
          <button onClick={() => { setFilters({ category: 'all', size: 'all', maxPrice: 6000 }); setSearch(''); }} style={{ background: 'none', border: '1px solid #1e1e1e', color: '#555', padding: '9px 20px', fontSize: 11, letterSpacing: '0.12em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>CLEAR FILTERS</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
          {products.map(p => <ProductCard key={p._id} product={p} setPage={setPage} />)}
        </div>
      )}
    </div>
  );
}
