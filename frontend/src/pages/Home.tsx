export default function HomePage() {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      
      {/* Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1E1B4B, #312E81)",
        borderRadius: 16, padding: 20,
        border: "1px solid rgba(139,92,246,0.3)",
      }}>
        <div style={{ color: "rgba(167,139,250,0.7)", fontSize: 12, textAlign: "right" }}>
          عالم الظلال
        </div>
        <div style={{
          fontSize: 32, fontWeight: 900, textAlign: "right",
          background: "linear-gradient(90deg, #A78BFA, #FCD34D)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Pick Me Up
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, textAlign: "right", marginTop: 8 }}>
          هوية الظلال تنتظر. استدعِ، ارتقِ، وكن أسطورة.
        </div>
      </div>

      {/* Stats */}
      <div style={{
        background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 16,
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8,
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        {[
          { label: "الانتصارات", value: "0", color: "#34D399" },
          { label: "الهزائم",    value: "0", color: "#F87171" },
          { label: "الرتبة",    value: "B", color: "#60A5FA" },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: 28, fontWeight: 900 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{
          background: "linear-gradient(135deg, #7C3AED, #4338CA)",
          borderRadius: 14, padding: 16,
        }}>
          <div style={{ fontSize: 24 }}>✨</div>
          <div style={{ color: "#fff", fontWeight: 700, marginTop: 4 }}>الاستدعاء</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>احصل على أبطال</div>
        </div>
        <div style={{
          background: "linear-gradient(135deg, #1D4ED8, #1E3A8A)",
          borderRadius: 14, padding: 16,
        }}>
          <div style={{ fontSize: 24 }}>🏯</div>
          <div style={{ color: "#fff", fontWeight: 700, marginTop: 4 }}>برج التحدي</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>تحديات عالية</div>
        </div>
      </div>

      {/* Crystals */}
      <div style={{
        background: "rgba(251,191,36,0.1)", borderRadius: 14, padding: 14,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        border: "1px solid rgba(251,191,36,0.2)",
      }}>
        <div style={{ color: "#FCD34D", fontWeight: 900, fontSize: 22 }}>💎 300</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>رصيد الكريستال</div>
      </div>

    </div>
  );
}
