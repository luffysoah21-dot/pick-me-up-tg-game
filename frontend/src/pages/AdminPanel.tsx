import { useState, useEffect } from "react";
import { availableHeroes as HEROES } from "../data/heroes";

const ADMIN_ID = "7426054695";

export default function AdminPanel() {
  const tgId = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() ?? "";
  
  if (tgId !== ADMIN_ID) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#fff", direction: "rtl" }}>
        <div style={{ fontSize: 64 }}>🚫</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 16 }}>غير مصرح لك بالوصول</div>
        <div style={{ color: "rgba(255,255,255,0.4)", marginTop: 8 }}>هذه الصفحة للمشرفين فقط</div>
      </div>
    );
  }

  const [tab, setTab] = useState("give");
  const [msg, setMsg] = useState("");

  const notify = (text: string) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const addGems = (n: number) => {
    const cur = parseInt(localStorage.getItem("gems") ?? "0");
    localStorage.setItem("gems", String(cur + n));
    notify(`✅ تمت إضافة ${n} جواهر`);
  };

  const addGold = (n: number) => {
    const cur = parseInt(localStorage.getItem("gold") ?? "0");
    localStorage.setItem("gold", String(cur + n));
    notify(`✅ تمت إضافة ${n} ذهب`);
  };

  const resetAll = () => {
    localStorage.setItem("gems", "0");
    localStorage.setItem("gold", "0");
    notify("✅ تم تصفير الذهب والجواهر");
  };

  const clearHeroes = () => {
    localStorage.removeItem("my_heroes");
    localStorage.removeItem("my_team");
    notify("✅ تم حذف الأبطال والفريق");
  };

  return (
    <div style={{ padding: 16, direction: "rtl", color: "#fff", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 20, fontWeight: 900, textAlign: "center" }}>👑 لوحة الإدارة</div>
      
      {msg && (
        <div style={{ background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.4)", borderRadius: 10, padding: 12, textAlign: "center", color: "#34D399" }}>
          {msg}
        </div>
      )}

      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 16, border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 12 }}>💎 إضافة جواهر</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[10, 50, 100, 500, 1000, 9999].map(n => (
            <button key={n} onClick={() => addGems(n)} style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 8, padding: "8px 4px", color: "#60A5FA", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
              💎{n}+
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 16, border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 12 }}>🪙 إضافة ذهب</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[100, 500, 1000, 5000, 10000, 99999].map(n => (
            <button key={n} onClick={() => addGold(n)} style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "8px 4px", color: "#F59E0B", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
              🪙{n}+
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={resetAll} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: 12, color: "#F87171", cursor: "pointer", fontWeight: 700 }}>
          🔄 تصفير الذهب والجواهر
        </button>
        <button onClick={clearHeroes} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: 12, color: "#F87171", cursor: "pointer", fontWeight: 700 }}>
          🗑️ حذف الأبطال والفريق
        </button>
      </div>
    </div>
  );
}
