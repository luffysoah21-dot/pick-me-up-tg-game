import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { useTelegram } from '../telegram';

export default function Home() {
  const { openFullExperience, isTelegram } = useTelegram();
  const { gems, tickets, collection, dailyMessage, claimDailyReward, lastDailyClaim } = useGameStore();

  const uniqueHeroes = useMemo(() => {
    const map = new Map<string, number>();
    collection.forEach((hero) => map.set(hero.id, (map.get(hero.id) ?? 0) + 1));
    return map.size;
  }, [collection]);

  return (
    <section className="space-y-6 text-right">
      <div className="rounded-[2rem] border border-emerald-400/15 bg-slate-950/90 p-6 shadow-xl shadow-emerald-500/10">
        <span className="inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
          ردهة الظلال
        </span>
        <h2 className="mt-4 text-3xl font-black text-white tracking-tight sm:text-4xl">
          مرحباً بك في Pick Me Up
        </h2>
        <p className="mt-4 max-w-2xl text-slate-400 leading-7">
          ابدأ رحلتك في عالم فانتازي مظلم، استدعي أبطالك، واصعد برج التحدي حتى تصل إلى قمة المجد.
          الواجهة مصممة للهواتف والمدعومة باللغة العربية من اليمين إلى اليسار.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-xl shadow-slate-950/40">
          <p className="text-sm text-slate-500">الجواهر</p>
          <p className="mt-3 text-3xl font-black text-emerald-200">{gems}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-xl shadow-slate-950/40">
          <p className="text-sm text-slate-500">تذاكر الاستدعاء</p>
          <p className="mt-3 text-3xl font-black text-violet-200">{tickets}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-xl shadow-slate-950/40">
          <p className="text-sm text-slate-500">أبطال في المجموعة</p>
          <p className="mt-3 text-3xl font-black text-slate-100">{uniqueHeroes}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Link
          to="/summon"
          className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 text-right shadow-2xl shadow-slate-950/40 transition hover:border-emerald-400/40 hover:bg-slate-900"
        >
          <p className="text-sm text-slate-500">أول خطوة</p>
          <h3 className="mt-3 text-2xl font-semibold text-emerald-200">استدعاء الأبطال</h3>
          <p className="mt-2 text-slate-400">افتح بوابة الحظ واستعرض أبطالك الجدد.</p>
        </Link>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40">
          <p className="text-sm text-slate-500">مكافأة يومية</p>
          <h3 className="mt-3 text-2xl font-semibold text-violet-200">مكافأتك الآن</h3>
          <p className="mt-2 text-slate-400">احصل على موارد إضافية كل يوم لزيادة فرصتك في الاستدعاء.</p>
          <button
            type="button"
            onClick={claimDailyReward}
            className="mt-6 inline-flex rounded-3xl bg-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-400"
          >
            {lastDailyClaim === new Date().toISOString().slice(0, 10) ? 'تم الحصول اليوم' : 'احصل على المكافأة'}
          </button>
          {dailyMessage && <p className="mt-4 text-sm text-slate-300">{dailyMessage}</p>}
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40">
          <p className="text-sm text-slate-500">ابدأ اللعب</p>
          <h3 className="mt-3 text-2xl font-semibold text-emerald-200">تشغيل داخل Telegram</h3>
          <p className="mt-2 text-slate-400">اضغط الزر لفتح التطبيق في وضع Telegram Mini App.</p>
          <button
            type="button"
            onClick={openFullExperience}
            disabled={!isTelegram}
            className="mt-6 inline-flex rounded-3xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isTelegram ? 'ابدأ اللعب داخل Telegram' : 'افتح من Telegram'}
          </button>
          {!isTelegram && (
            <p className="mt-4 text-sm text-amber-200">هذا التطبيق يعمل فقط داخل Telegram Mini App.</p>
          )}
        </div>
      </div>
    </section>
  );
}
