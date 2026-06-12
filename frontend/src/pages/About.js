const TEAM = [
  { name: 'Arav Shah', role: 'Founder & Creative Director', initials: 'AS' },
  { name: 'Nisha Rao', role: 'Head of Design', initials: 'NR' },
  { name: 'Dev Mehra', role: 'Operations Lead', initials: 'DM' },
];
export default function About() {
  return (
    <div style={{ maxWidth: 920, margin: '64px auto', padding: '0 24px', fontFamily: 'monospace' }}>
      <p style={{ fontSize: 10, letterSpacing: '0.28em', color: '#363636', marginBottom: 18 }}>ABOUT SVNSOUL</p>
      <h1 style={{ fontSize: 'clamp(32px,6vw,58px)', fontWeight: 700, letterSpacing: '0.06em', color: '#e0e0e0', lineHeight: 1.08, marginBottom: 52 }}>WE MAKE CLOTHES<br />FOR THE QUIET ONES.</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, marginBottom: 64 }}>
        <div>
          <p style={{ fontSize: 13, color: '#444', lineHeight: 2.3 }}>SVNSOUL started in a small flat in Mumbai in 2022 — a sketchbook, a sewing machine, and an obsession with getting the weight of a tee exactly right. We were frustrated by brands that talked about quality but shipped polyester with a logo slapped on.</p>
          <p style={{ fontSize: 13, color: '#444', lineHeight: 2.3, marginTop: 18 }}>Every piece we make starts with fabric, not trend. We source 280–400GSM cotton blends from mills in Tirupur, pre-wash everything, and stress-test every seam before it reaches you.</p>
        </div>
        <div>
          <p style={{ fontSize: 13, color: '#444', lineHeight: 2.3 }}>The name? Seven souls — the seven people in the room when we made the first piece and decided this needed to exist. It stuck.</p>
          <p style={{ fontSize: 13, color: '#444', lineHeight: 2.3, marginTop: 18 }}>We drop small. We don't restock most pieces. When it's gone, it's gone. That's not scarcity marketing — it's us keeping production tight and quality non-negotiable.</p>
        </div>
      </div>
      <div style={{ background: '#090909', border: '1px solid #141414', borderRadius: 3, padding: '40px 44px', marginBottom: 64 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.22em', color: '#363636', marginBottom: 30 }}>WHAT WE STAND FOR</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 30 }}>
          {[['WEIGHT', '280–400GSM only. No flimsy fabric.'], ['LONGEVITY', 'Pre-washed, pre-shrunk. Built to last.'], ['SMALL BATCHES', 'Limited drops. No overstock, ever.'], ['TRANSPARENCY', 'We show our fabric sources and margins.']].map(([t, d]) => (
            <div key={t}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: '0.14em', marginBottom: 8 }}>{t}</p>
              <p style={{ fontSize: 12, color: '#444', lineHeight: 1.9 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 10, letterSpacing: '0.22em', color: '#363636', marginBottom: 28 }}>THE TEAM</p>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {TEAM.map(m => (
          <div key={m.name} style={{ background: '#090909', border: '1px solid #141414', borderRadius: 3, padding: 26, flex: '1 1 200px' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#111', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#888', fontWeight: 700, marginBottom: 18 }}>{m.initials}</div>
            <p style={{ fontSize: 14, color: '#d0d0d0', fontWeight: 700, marginBottom: 5 }}>{m.name}</p>
            <p style={{ fontSize: 11, color: '#444' }}>{m.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
