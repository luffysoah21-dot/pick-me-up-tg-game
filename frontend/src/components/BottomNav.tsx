import { memo } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'الرئيسية', icon: '🏠' },
  { to: '/summon', label: 'استدعاء', icon: '✨' },
  { to: '/party', label: 'فريقي', icon: '🛡️' },
  { to: '/tower', label: 'البرج', icon: '🏯' },
  { to: '/profile', label: 'الملف', icon: '👤' },
];

function BottomNav() {
  return (
    <footer className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/95 backdrop-blur-xl px-4 py-3 shadow-[0_-20px_50px_rgba(0,0,0,0.65)]">
      <div className="flex items-center justify-between gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex-1 rounded-3xl px-3 py-3 text-center text-[11px] font-semibold transition-all duration-150 ease-out active:scale-95 active:ring-2 active:ring-white/20 ${
                isActive
                  ? 'bg-[#ffd700]/15 text-[#ffd700] shadow-[0_0_18px_rgba(255,215,0,0.24)] animate-bounce-tab'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800/90 hover:text-white'
              }`
            }
          >
            <span className="block text-xl leading-none">{item.icon}</span>
            <span className="mt-1 block">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </footer>
  );
}

export default memo(BottomNav);
