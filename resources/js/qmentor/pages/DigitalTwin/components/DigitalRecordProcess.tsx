import React, { useEffect, useState } from 'react';
import { Sparkles, User, Zap, BarChart3, Briefcase, BookOpen, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * The «QULLMs يحضّر سجلك الرقمي» process, as a pop-up.
 *
 * The Blade page draws this overlay itself on a full navigation
 * (digital-record/_loader.blade.php), but inside the twin the record loads in
 * an iframe rendered by the chrome-less embed layout, so nothing narrates the
 * wait. This is that same five-step cascade in React: same steps, same order,
 * same pacing rules — slow while the server is still working, holding on the
 * last step with the "first analysis" note rather than pretending to finish,
 * and dismissable (skip / Esc) for anyone who does not want to watch it.
 */
const STEPS: { icon: LucideIcon; title: string; meta: string }[] = [
  { icon: User, title: 'جلب بياناتك من النظام الجامعي', meta: 'الملف الشخصي، الكلية، التخصص، المعدل التراكمي' },
  { icon: Zap, title: 'تحليل مهاراتك المعتمدة', meta: 'قراءة سجل المهارات وتصنيفها حسب الفصل' },
  { icon: BarChart3, title: 'مسح متطلبات سوق العمل السعودي', meta: 'جمع أبرز المهارات المطلوبة من البيانات الحيّة' },
  { icon: Briefcase, title: 'مطابقة الوظائف الأنسب لك', meta: 'حساب التوافق مع تخصصك وأعلى مقرراتك درجةً' },
  { icon: BookOpen, title: 'توليد توصياتك بالذكاء الاصطناعي', meta: 'دورات ووظائف مرشّحة لسد الفجوات المهارية' },
];

const STEP_MS = 750;

export default function DigitalRecordProcess({
  open,
  onSkip,
}: {
  /** The record is still loading — the overlay walks its steps while it is true. */
  open: boolean;
  onSkip: () => void;
}) {
  const [idx, setIdx] = useState(0);

  // Restart the cascade whenever a new load begins (a student switch reopens it).
  useEffect(() => {
    if (!open) return;
    setIdx(0);
    const timer = window.setInterval(() => {
      // Hold on the last step: the server is still working, and jumping to
      // "done" while the iframe is blank is the one thing this must not do.
      setIdx(i => (i < STEPS.length - 1 ? i + 1 : i));
    }, STEP_MS);
    return () => window.clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onSkip(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onSkip]);

  if (!open) return null;

  const atEnd = idx >= STEPS.length - 1;
  const progress = atEnd ? 92 : Math.round(((idx + 0.5) / STEPS.length) * 100);

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center p-5 bg-[rgba(15,32,23,0.55)] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dr-process-title"
      dir="rtl"
    >
      <div className="w-full max-w-[560px] rounded-3xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden animate-[fadeIn_.3s_ease-out]">
        {/* Head */}
        <div className="flex items-center gap-4 px-6 pt-6 pb-4 bg-gradient-to-bl from-[#14573A] via-[#1B8354] to-[#25935F] text-white">
          <span className="relative shrink-0 w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
            <span className="absolute -inset-1 rounded-full border-2 border-white/35 border-t-transparent animate-spin" />
          </span>
          <div className="min-w-0">
            <h2 id="dr-process-title" className="text-lg font-extrabold leading-tight">QULLMs يحضّر السجل الرقمي</h2>
            <p className="text-xs text-white/85 mt-1">نقرأ البيانات الجامعية ونقارنها لحظياً بسوق العمل السعودي…</p>
          </div>
        </div>

        {/* Steps */}
        <ol className="px-6 py-4 space-y-3">
          {STEPS.map((s, i) => {
            const state = i < idx ? 'done' : i === idx ? 'active' : 'pending';
            const Icon = s.icon;
            return (
              <li
                key={s.title}
                className={`grid grid-cols-[32px_1fr_22px] items-center gap-3 py-1.5 transition-opacity ${state === 'pending' ? 'opacity-45' : 'opacity-100'}`}
              >
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${state === 'pending' ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' : 'bg-sa-50 dark:bg-sa-950 text-sa-700 dark:text-sa-300'}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-gray-900 dark:text-white">{s.title}</span>
                  <span className="block text-[11px] text-gray-500 dark:text-gray-400">{s.meta}</span>
                </span>
                <span className="justify-self-center">
                  {state === 'done' && <Check className="w-3.5 h-3.5 text-sa-600 dark:text-sa-400" />}
                  {state === 'active' && <span className="block h-2.5 w-2.5 rounded-full bg-sa-500 animate-pulse" />}
                  {state === 'pending' && <span className="block h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600" />}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Progress */}
        <div className="h-1 bg-gray-100 dark:bg-gray-700">
          <div className="h-full bg-sa-500 transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* The wait note the Blade overlay shows once the steps run out. */}
        {atEnd && (
          <p role="status" className="px-6 pt-3 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
            التحليل يُبنى لأول مرة لهذا الطالب وقد يستغرق لحظات — النتيجة تُحفظ فتفتح فوراً في المرات القادمة.
          </p>
        )}

        <div className="flex items-center justify-between gap-3 px-6 py-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-400">
            <Zap className="w-3.5 h-3.5" />
            مدعوم بـ QULLMs · تحليل لحظي
          </span>
          <button
            type="button"
            onClick={onSkip}
            className="text-xs font-semibold text-sa-600 dark:text-sa-400 hover:text-sa-700 dark:hover:text-sa-300"
          >
            تخطي ومشاهدة السجل
          </button>
        </div>
      </div>
    </div>
  );
}
