import { useState } from 'react';
const inp = { background: '#0e0e0e', border: '1px solid #1a1a1a', color: '#d0d0d0', padding: '12px 14px', fontSize: 13, fontFamily: 'inherit', borderRadius: 2, outline: 'none', width: '100%', boxSizing: 'border-box', marginBottom: 14 };
export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const update = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));
  return (
    <div style={{ maxWidth: 820, margin: '64px auto', padding: '0 24px', fontFamily: 'monospace' }}>
      <p style={{ fontSize: 10, letterSpacing: '0.28em', color: '#363636', marginBottom: 14 }}>GET IN TOUCH</p>
      <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '0.06em', color: '#e0e0e0', marginBottom: 52 }}>CONTACT US</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
        <div>
          {sent ? (
            <div style={{ background: '#091409', border: '1px solid #1a3a1a', borderRadius: 3, padding: 36, textAlign: 'center' }}>
              <p style={{ fontSize: 24, color: '#4a8a4a', marginBottom: 14 }}>✓</p>
              <p style={{ fontSize: 13, color: '#4a8a4a', letterSpacing: '0.12em' }}>MESSAGE SENT</p>
              <p style={{ fontSize: 12, color: '#363636', marginTop: 8 }}>We'll respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }}>
              {[['Name', 'name', 'text'], ['Email', 'email', 'email'], ['Subject', 'subject', 'text']].map(([l, f, t]) => (
                <div key={f}><p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.12em', marginBottom: 6 }}>{l.toUpperCase()}</p><input type={t} value={form[f]} onChange={update(f)} required style={inp} /></div>
              ))}
              <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.12em', marginBottom: 6 }}>MESSAGE</p>
              <textarea value={form.message} onChange={update('message')} rows={5} required style={{ ...inp, resize: 'vertical' }} />
              <button type="submit" style={{ background: '#161616', border: '1px solid #262626', color: '#e0e0e0', padding: '13px 30px', fontSize: 11, letterSpacing: '0.2em', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>SEND MESSAGE</button>
            </form>
          )}
        </div>
        <div>
          {[['EMAIL', 'support@svnsoul.in'], ['PHONE', '+91 98765 43210'], ['HOURS', 'Mon–Sat, 10AM–7PM IST'], ['ADDRESS', 'Mumbai, Maharashtra, India']].map(([l, v]) => (
            <div key={l} style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.18em', marginBottom: 5 }}>{l}</p>
              <p style={{ fontSize: 13, color: '#888' }}>{v}</p>
            </div>
          ))}
          <div style={{ background: '#090909', border: '1px solid #141414', borderRadius: 3, padding: 20, marginTop: 10 }}>
            <p style={{ fontSize: 10, color: '#363636', letterSpacing: '0.14em', marginBottom: 16 }}>SOCIAL</p>
            {[['Instagram', '@svnsoul.official'], ['Pinterest', '@svnsoul'], ['X / Twitter', '@svnsoul']].map(([p, h]) => (
              <div key={p} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #111', paddingBottom: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#555' }}>{p}</span>
                <span style={{ fontSize: 12, color: '#4a6a9a' }}>{h}</span>
              </div>
            ))}
          </div>
          <a href="https://wa.me/919876543210" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, background: '#0a1a0a', border: '1px solid #1a3a1a', borderRadius: 3, padding: '14px 18px', textDecoration: 'none' }}>
            <span style={{ fontSize: 18 }}>💬</span>
            <div><p style={{ fontSize: 11, color: '#4a8a4a', letterSpacing: '0.1em', margin: 0 }}>WHATSAPP SUPPORT</p><p style={{ fontSize: 10, color: '#363636', margin: 0 }}>Quick replies, 10AM–7PM</p></div>
          </a>
        </div>
      </div>
    </div>
  );
}
