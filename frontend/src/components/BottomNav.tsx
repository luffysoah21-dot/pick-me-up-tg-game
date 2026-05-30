import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'الرئيسية' },
  { to: '/summon', label: 'استدعاء' },
  { to: '/party', label: 'فريقي' },
  { to: '/tower', label: 'البرج' },
  { to: '/profile', label: 'الملف' },
];

export default function BottomNav() {
  return (
    <footer className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-3 shadow-2xl shadow-slate-950/30">
      <div className="flex items-center justify-between gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex-1 rounded-3xl px-3 py-2 text-center text-xs font-semibold transition ${
                isActive ? 'bg-violet-500/15 text-violet-100' : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </footer>
  );
}
