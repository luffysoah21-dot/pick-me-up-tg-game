import { useState } from "react";
import HeroesPage from "./pages/HeroesPage";
import Summon from "./pages/Summon";
import Tower from "./pages/Tower";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import AdminPanel from "./pages/AdminPanel";

const TABS = [
  { id: "home",   label: "الرئيسية", icon: "🏠" },
  { id: "summon", label: "استدعاء",  icon: "✨" },
  { id: "heroes", label: "أبطالي",   icon: "⚔️" },
  { id: "tower",  label: "البرج",    icon: "🏯" },
  { id: "admin", label: "إدارة", icon: "👑" },
  { id: "profile",label: "الملف",   icon: "👤" },
];

export default function App() {
  const [tab, setTab] = useState("home");

  const pages: Record<string, JSX.Element> = {
    home:    <Home />,
    summon:  <Summon />,
    heroes:  <HeroesPage />,
    tower:   <Tower />,
    profile: <Profile />,
    admin: <AdminPanel />,
  };

  return (
    <div style={{ background: "#0F0C1E", minHeight: "100vh", color: "#fff" }}>
      <div style={{ paddingBottom: 70 }}>
        {pages[tab] ?? <Home />}
      </div>
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#0F0C1E", borderTop: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "10px 4px 14px", background: "transparent",
            border: "none", cursor: "pointer", color: tab === t.id ? "#A78BFA" : "rgba(255,255,255,0.4)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <span style={{ fontSize: 10 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
