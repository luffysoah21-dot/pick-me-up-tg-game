import { memo, useEffect } from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error';
  onClose: () => void;
}

function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(onClose, 3200);
    return () => window.clearTimeout(timeout);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex items-center justify-center">
      <div className="pointer-events-auto max-w-md rounded-3xl border border-white/15 bg-slate-950/95 px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <p className={`text-sm font-black ${type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>
          {message}
        </p>
      </div>
    </div>
  );
}

export default memo(Toast);
