import { useState, useEffect } from "react";
import { availableHeroes as HEROES } from "../data/heroes";

const ADMIN_ID = "7426054695";

interface TabType { id: string; label: string; icon: string; }

export default function AdminPanel() {
  const [tab, setTab] = useState("give");
  const [msg, setMsg] = useState("");
  const [amount, setAmount] = useState("0");
  const [refresh, setRefresh] = useState(0);

  const telegramId = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() ?? "";
  const authed = telegramId === ADMIN_ID;

  const notify = (text: string) => {
    setMsg(text);
    setRefresh(r => r + 1);
    setTimeout(() => setMsg(""), 3000);
  };

  const gems = () => Number(localStorage.getItem("gems") ?? 0);
  const gold = () => Number(localStorage.getItem("gold") ?? 0);
  const heroes = () => JSON.parse(localStorage.getItem("my_heroes") ?? "[]");

  const addGems = (n: number) => { localStorage.setItem("gems", String(gems() + n)); notify(`✅ +${n} 💎`); };
  const addGold = (n: number) => { localStorage.setItem("gold", String(gold() + n)); notify(`✅ +${n} 🪙`); };
  const setGems = (n: number) => { localStorage.setItem("gems", String(n)); notify(`✅ جواهر = ${n}`); };
  const setGold = (n: number) => { localStorage.setItem("gold", String(n)); notify(`✅ ذهب = ${n}`); };

  const addHero = (heroId: string) => {
    const h = HEROES.find(x => x.id === heroId);
    if (!h) return;
    const list = heroes();
    if (list.find((x: any) => x.id === heroId)) { notify("⚠️ موجود"); return; }
    list.push(h);
    localStorage.setItem("my_heroes", JSON.stringify(list));
    notify(`✅ أضيف ${h.name}`);
  };

  const removeHero = (heroId: string) => {
    const list = heroes().filter((x: any) => x.id !== heroId);
    localStorage.setItem("my_heroes", JSON.stringify(list));
    notify("🗑️ حُذف البطل");
  };

  const resetAll = () => {
    ["gems","gold","my_heroes","my_team","deadHeroes"].forEach(k => localStorage.removeItem(k));
    notify("🗑️ تم مسح كل البيانات");
  };

  if (!authed) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:"#0a0a1a", gap:16 }}>
      <div style={{ fontSize:64 }}>🔐</div>
      <div style={{ color:"#fff", fontSize:20, fontWeight:900 }}>غير مصرح</div>
      <div style={{ color:"#6b7280", fontSize:12 }}>ID: {telegramId || "غير معروف"}</div>
    </div>
  );

  return (
    <div style={{ background:"#0a0a1a", minHeight:"100vh", direction:"rtl", paddingBottom:20 }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#7c3aed,#4f46e5)", padding:"16px 20px", display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:32 }}>👑</span>
        <div>
          <div style={{ color:"#fbbf24", fontWeight:900, fontSize:18 }}>لوحة الإدارة</div>
          <div style={{ color:"#c4b5fd", fontSize:11 }}>ID: {telegramId}</div>
        </div>
      </div>

      {/* Notification */}
      {msg && (
        <div style={{ background:"#065f46", color:"#6ee7b7", padding:"12px 20px", textAlign:"center", fontWeight:700, fontSize:15 }}>{msg}</div>
      )}

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, padding:"12px 16px" }}>
        {[
          { icon:"💎", val: gems(), label:"جواهر" },
          { icon:"🪙", val: gold(), label:"ذهب" },
          { icon:"⚔️", val: heroes().length, label:"أبطال" },
        ].map(s => (
          <div key={s.label} style={{ background:"#1a1a2e", borderRadius:12, padding:10, textAlign:"center", border:"1px solid #2a2a4a" }}>
            <div style={{ fontSize:22 }}>{s.icon}</div>
            <div style={{ color:"#fbbf24", fontWeight:900, fontSize:18 }}>{s.val}</div>
            <div style={{ color:"#6b7280", fontSize:10 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:6, padding:"0 16px 12px" }}>
        {[["give","🎁 منح"],["heroes","⚔️ أبطال"],["danger","⚠️ خطر"]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex:1, padding:"8px 4px", borderRadius:10, border:"none", cursor:"pointer",
            background: tab===id ? "#7c3aed" : "#1a1a2e",
            color: tab===id ? "#fff" : "#6b7280", fontWeight:700, fontSize:12,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding:"0 16px" }}>
        {/* Give Tab */}
        {tab === "give" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ color:"#a5b4fc", fontWeight:700 }}>💎 إضافة جواهر</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
              {[10,50,100,500,1000,9999].map(n => (
                <button key={n} onClick={() => addGems(n)} style={{ padding:10, borderRadius:10, background:"#1e1b4b", color:"#a5b4fc", border:"1px solid #3730a3", cursor:"pointer", fontWeight:700 }}>+{n}💎</button>
              ))}
            </div>
            <div style={{ color:"#fbbf24", fontWeight:700, marginTop:4 }}>🪙 إضافة ذهب</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
              {[100,500,1000,5000,10000,99999].map(n => (
                <button key={n} onClick={() => addGold(n)} style={{ padding:10, borderRadius:10, background:"#1c1a00", color:"#fbbf24", border:"1px solid #92400e", cursor:"pointer", fontWeight:700 }}>+{n}🪙</button>
              ))}
            </div>
            <div style={{ color:"#fff", fontWeight:700, marginTop:4 }}>⚙️ تعيين مباشر</div>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              style={{ padding:10, borderRadius:10, background:"#1a1a2e", color:"#fff", border:"1px solid #374151", fontSize:16, width:"100%" }} />
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setGems(Number(amount))} style={{ flex:1, padding:12, borderRadius:10, background:"#4f46e5", color:"#fff", border:"none", cursor:"pointer", fontWeight:700 }}>تعيين 💎</button>
              <button onClick={() => setGold(Number(amount))} style={{ flex:1, padding:12, borderRadius:10, background:"#d97706", color:"#fff", border:"none", cursor:"pointer", fontWeight:700 }}>تعيين 🪙</button>
            </div>
          </div>
        )}

        {/* Heroes Tab */}
        {tab === "heroes" && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ color:"#fff", fontWeight:700, marginBottom:4 }}>⚔️ إدارة الأبطال</div>
            {HEROES.map(h => {
              const owned = heroes().find((x: any) => x.id === h.id);
              return (
                <div key={h.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#1a1a2e", borderRadius:12, padding:"10px 14px", border:`1px solid ${owned ? "#065f46" : "#2a2a4a"}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:28 }}>{h.image}</span>
                    <div>
                      <div style={{ color:"#fff", fontWeight:700, fontSize:13 }}>{h.name}</div>
                      <div style={{ color:"#6b7280", fontSize:10 }}>{h.rarity} • ⚔️{h.attack} 🛡️{h.defense} ❤️{h.hp}</div>
                    </div>
                  </div>
                  <button onClick={() => owned ? removeHero(h.id) : addHero(h.id)} style={{
                    padding:"6px 12px", borderRadius:8, border:"none", cursor:"pointer", fontWeight:700, fontSize:12,
                    background: owned ? "#7f1d1d" : "#065f46", color: owned ? "#fca5a5" : "#6ee7b7",
                  }}>{owned ? "🗑️" : "➕"}</button>
                </div>
              );
            })}
          </div>
        )}

        {/* Danger Tab */}
        {tab === "danger" && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ background:"#7f1d1d", borderRadius:12, padding:14, border:"1px solid #991b1b" }}>
              <div style={{ color:"#fca5a5", fontWeight:900, marginBottom:8 }}>⚠️ منطقة الخطر</div>
              <div style={{ color:"#f87171", fontSize:12, marginBottom:12 }}>هذه الإجراءات لا يمكن التراجع عنها</div>
              <button onClick={resetAll} style={{ width:"100%", padding:14, borderRadius:10, background:"#991b1b", color:"#fff", border:"none", cursor:"pointer", fontWeight:900, fontSize:15 }}>
                🗑️ مسح كل بيانات اللعبة
              </button>
            </div>
            <button onClick={() => { localStorage.setItem("gems","0"); localStorage.setItem("gold","0"); notify("✅ تم إعادة تعيين العملات"); }} style={{ padding:12, borderRadius:10, background:"#1a1a2e", color:"#f87171", border:"1px solid #991b1b", cursor:"pointer", fontWeight:700 }}>
              🔄 إعادة تعيين العملات فقط
            </button>
            <button onClick={() => { localStorage.removeItem("my_heroes"); localStorage.removeItem("my_team"); notify("✅ تم مسح الأبطال"); }} style={{ padding:12, borderRadius:10, background:"#1a1a2e", color:"#f87171", border:"1px solid #991b1b", cursor:"pointer", fontWeight:700 }}>
              🗡️ مسح الأبطال والفريق
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
