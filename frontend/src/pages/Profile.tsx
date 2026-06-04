export default function Profile() {
  const stats = [
    { label: "الانتصارات", value: "0",   icon: "🏆", color: "#34D399" },
    { label: "الهزائم",    value: "0",   icon: "💀", color: "#F87171" },
    { label: "الكريستال",  value: "300", icon: "💎", color: "#FCD34D" },
    { label: "الأبطال",   value: "0",   icon: "⚔️", color: "#A78BFA" },
  ];
  return (
    <div style={{ padding: 16, direction: "rtl", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "linear-gradient(135deg, #1E1B4B, #312E81)", borderRadius: 16, padding: 24, textAlign: "center", border: "1px solid rgba(139,92,246,0.3)" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 12px" }}>👤</div>
        <div style={{ color: "#fff", fontSize: 20, fontWeight: 900 }}>Pick Me Up 2</div>
        <div style={{ display: "inline-block", marginTop: 6, background: "rgba(96,165,250,0.2)", color: "#60A5FA", padding: "2px 16px", borderRadius: 20, fontWeight: 700 }}>رتبة B</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
            <div style={{ color: s.color, fontSize: 22, fontWeight: 900 }}>{s.value}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
