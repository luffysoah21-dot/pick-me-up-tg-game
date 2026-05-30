import { useEffect } from 'react';

interface TelegramLoaderProps {
  loading: boolean;
  error: string | null;
}

export default function TelegramLoader({ loading, error }: TelegramLoaderProps) {
  useEffect(() => {
    document.body.style.minHeight = '100vh';
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 px-4 py-10 text-right text-slate-100 sm:px-6">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/50">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4 text-right">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Telegram Mini App</p>
              <h1 className="mt-3 text-3xl font-black text-white">تهيئة Telegram</h1>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-violet-500/15 text-violet-200">
              <span className="text-2xl">📱</span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6 text-right">
            {loading ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-violet-400/30 bg-slate-900/80 text-violet-300 shadow-lg shadow-violet-500/10">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-violet-300 border-slate-700" />
                </div>
                <p className="text-lg font-semibold text-white">جارٍ الاتصال بـ Telegram...</p>
                <p className="text-sm text-slate-400">تأكد من تشغيل التطبيق داخل محادثة Telegram وربطه بالبوت.</p>
              </div>
            ) : error ? (
              <div className="space-y-4">
                <p className="text-lg font-semibold text-amber-300">تعذر تشغيل Telegram Mini App</p>
                <p className="text-sm text-slate-400 leading-7">{error}</p>
                <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                  افتح رابط التطبيق من داخل Telegram عبر البوت المرتبط، أو أعد تحميل الصفحة بعد التحقق من إعدادات البوت.
                </div>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex rounded-3xl bg-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-400"
                >
                  أعد المحاولة
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
