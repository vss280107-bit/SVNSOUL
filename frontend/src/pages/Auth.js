import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const inp = { background: '#0e0e0e', border: '1px solid #1a1a1a', color: '#d0d0d0', padding: '12px 14px', fontSize: 13, fontFamily: 'inherit', borderRadius: 2, outline: 'none', width: '100%', boxSizing: 'border-box', marginBottom: 14 };

export default function Auth({ setPage, initialMode = 'customer' }) {
  const [mode, setMode] = useState(initialMode); // 'customer' | 'admin' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      if (mode === 'register') {
        await register(form.name, form.email, form.password, form.phone);
        setPage({ name: 'account', params: {} });
      } else {
        const user = await login(form.email, form.password);
        if (mode === 'admin' && user.role !== 'admin') { setErr('This account does not have admin access.'); setLoading(false); return; }
        setPage({ name: user.role === 'admin' ? 'admin' : 'account', params: {} });
      }
    } catch (e) { setErr(e.response?.data?.message || 'Login failed. Check credentials.'); }
    setLoading(false);
  };

  const modeTab = (m, label) => (
    <button type="button" onClick={() => { setMode(m); setErr(''); }} style={{ flex: 1, background: mode === m ? '#1a1a1a' : 'none', border: 'none', borderRight: m !== 'register' ? '1px solid #161616' : 'none', color: mode === m ? '#e0e0e0' : '#363636', padding: '12px', fontSize: 10, letterSpacing: '0.14em', cursor: 'pointer', fontFamily: 'inherit' }}>{label}</button>
  );

  return (
    <div style={{ maxWidth: 420, margin: '64px auto', padding: '0 20px', fontFamily: 'monospace' }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ width: 38, height: 38, background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <svg viewBox="0 0 24 24" width="22" height="22"><text x="1" y="17" fontSize="13" fill="#a0a0a0" fontFamily="'Courier New',monospace" fontWeight="bold">S7</text></svg>
        </div>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#e0e0e0', letterSpacing: '0.12em' }}>SVNSOUL</p>
      </div>

      <div style={{ border: '1px solid #161616', borderRadius: 3, overflow: 'hidden', marginBottom: 28, display: 'flex' }}>
        {modeTab('customer', 'CUSTOMER')}
        {modeTab('admin', 'ADMIN')}
        {modeTab('register', 'REGISTER')}
      </div>

      <div style={{ background: '#090909', border: '1px solid #161616', borderRadius: 3, padding: 28 }}>
        {mode === 'admin' && (
          <div style={{ background: '#120e04', border: '1px solid #2a1e08', borderRadius: 2, padding: '10px 14px', marginBottom: 22 }}>
            <p style={{ fontSize: 10, color: '#7a6020', letterSpacing: '0.1em' }}>⚠ ADMIN ACCESS — Authorized personnel only</p>
          </div>
        )}
        <p style={{ fontSize: 11, color: '#363636', letterSpacing: '0.2em', marginBottom: 24 }}>
          {mode === 'register' ? 'CREATE ACCOUNT' : mode === 'admin' ? 'ADMIN SIGN IN' : 'CUSTOMER SIGN IN'}
        </p>
        <form onSubmit={submit}>
          {mode === 'register' && (
            <>
              <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.12em', marginBottom: 6 }}>FULL NAME</p>
              <input value={form.name} onChange={update('name')} style={inp} required />
              <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.12em', marginBottom: 6 }}>PHONE (optional)</p>
              <input value={form.phone} onChange={update('phone')} style={inp} />
            </>
          )}
          <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.12em', marginBottom: 6 }}>EMAIL</p>
          <input type="email" value={form.email} onChange={update('email')} style={inp} required />
          <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.12em', marginBottom: 6 }}>PASSWORD</p>
          <input type="password" value={form.password} onChange={update('password')} style={inp} required />

          {err && <div style={{ background: '#130808', border: '1px solid #2a1414', borderRadius: 2, padding: '10px 14px', marginBottom: 16 }}><p style={{ fontSize: 12, color: '#7a3a3a' }}>{err}</p></div>}

          <button type="submit" disabled={loading} style={{ width: '100%', background: mode === 'admin' ? '#100c04' : '#161616', border: '1px solid ' + (mode === 'admin' ? '#2a1e08' : '#262626'), color: mode === 'admin' ? '#9a7a30' : '#e0e0e0', padding: '13px', fontSize: 11, letterSpacing: '0.2em', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>
            {loading ? 'SIGNING IN…' : mode === 'register' ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
        </form>

        <div style={{ marginTop: 20, background: '#0a0a0a', border: '1px solid #141414', borderRadius: 2, padding: 14 }}>
          <p style={{ fontSize: 10, color: '#2a2a2a', letterSpacing: '0.1em', marginBottom: 6 }}>DEMO CREDENTIALS</p>
          {mode === 'admin'
            ? <p style={{ fontSize: 11, color: '#444' }}>admin@svnsoul.in &nbsp;/&nbsp; admin123</p>
            : <p style={{ fontSize: 11, color: '#444' }}>Register a new account above to test customer flow</p>
          }
        </div>
      </div>
    </div>
  );
}
