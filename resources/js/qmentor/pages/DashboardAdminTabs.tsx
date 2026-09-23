import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, ExternalLink, LayoutDashboard, Search, Sparkles, Zap, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { StaggerContainer, StaggerItem } from '../lib/motion';

/**
 * What the two student tabs become for an admin.
 *
 * «سجلك الرقمي» is written to one student; an admin has none. What an admin
 * has is the roster QMentor shows — so the tab opens on that list, the way
 * التوأم الرقمي does, and one click opens one record on the digital-record
 * page. «منصة التعلم» likewise: QSpark itself sends an admin to its admin
 * dashboard (dashboardRedirectFor), so the tab reflects that — the platform's
 * live figures and the doors into it — not a student's slides.
 */

type RosterRow = { id: string; name: string; name_en?: string; major?: string; major_en?: string; faculty?: string; faculty_en?: string; gpa?: number; group?: string };
type RosterGroups = Record<string, { label: string; students: RosterRow[] }>;

function readRoster(): RosterGroups | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as { __qmentor_roster?: RosterGroups | null }).__qmentor_roster ?? null;
}

function readLinks(): { qspark?: string; digitalRecord?: string; qsparkAdmin?: string; qsparkFaculty?: string; agentCore?: string } {
  if (typeof window === 'undefined') return {};
  return (window as unknown as { __qmentor_links?: Record<string, string> }).__qmentor_links ?? {};
}

function initials(name: string): string {
  const parts = name.replace(/\b(بن|بنت)\b/g, '').trim().split(/\s+/);
  const family = (parts[parts.length - 1] ?? '').replace(/^(ال|آل)/, '');
  return `${(parts[0] ?? '').slice(0, 1)} ${family.slice(0, 1)}`.trim();
}

// ─────────────────────────────────────────────────────────────────────────
// سجلك الرقمي — the roster, for an admin
// ─────────────────────────────────────────────────────────────────────────

export function AdminRosterTab() {
  const { t, lang } = useLanguage();
  const roster = readRoster();
  const links = readLinks();
  const base = links.digitalRecord || '/digital-record';
  const [q, setQ] = useState('');

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return Object.entries(roster ?? {}).map(([key, g]) => ({
      key,
      label: g.label,
      students: g.students.filter(r => {
        if (!needle) return true;
        const hay = [r.name, r.name_en, r.id, r.major, r.major_en, r.faculty].filter(Boolean).join(' ').toLowerCase();
        return hay.includes(needle);
      }),
    }));
  }, [roster, q]);

  const total = Object.values(roster ?? {}).reduce((n, g) => n + g.students.length, 0);
  const shown = groups.reduce((n, g) => n + g.students.length, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-bl from-emerald-600 via-sa-700 to-sa-900 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute -top-12 -end-12 w-56 h-56 rounded-full bg-white/5" />
        <div className="relative flex items-start gap-4">
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center"><Award className="w-7 h-7" /></div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wide text-sa-200">{t('سجلك الرقمي', 'Digital Record')}</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-0.5">{t('سجلات الطلاب', 'Student records')}</h2>
            <p className="text-sm text-sa-100/90 mt-1 leading-relaxed">
              {t('اختر طالباً لفتح سجله الرقمي: مهاراته وساعاته المعتمدة، وفجواته أمام سوق العمل، وما يقرّره المرشد الذكي بشأن شهاداته.', 'Pick a student to open their digital record: skills and accepted hours, labour-market gaps, and what the smart mentor decides about their certificates.')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex-1 min-w-[260px]">
          <Search className="absolute top-1/2 -translate-y-1/2 end-3 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={t('ابحث بالاسم أو الرقم الجامعي أو التخصص…', 'Search by name, ID or major…')}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 ps-3 pe-10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sa-500"
          />
        </label>
        {q.trim() !== '' && <span className="text-sm text-gray-500 dark:text-gray-400">{shown} {t('من', 'of')} {total}</span>}
      </div>

      {!roster && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('لا تتوفر قائمة طلاب لهذا الحساب.', 'No roster is available for this account.')}</p>
      )}

      {groups.map(g => g.students.length > 0 && (
        <section key={g.key}>
          <div className="flex items-baseline gap-3 mb-3">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">{g.label}</h3>
          </div>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {g.students.map(r => {
              const gpa = Number(r.gpa ?? 0);
              const gpaTone = gpa > 0 && gpa < 2 ? 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400' : gpa > 0 && gpa < 2.75 ? 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400' : 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-300';
              return (
                <StaggerItem key={r.id}>
                  <a
                    href={`${base}?student=${encodeURIComponent(r.id)}`}
                    className="group flex h-full flex-col gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-sa-400"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sa-50 dark:bg-sa-950 text-sa-700 dark:text-sa-300 font-extrabold">{initials(r.name)}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate">{lang === 'ar' ? r.name : (r.name_en || r.name)}</p>
                        <p className="text-[11px] text-gray-400 qm-tabular" dir="ltr">{r.id}</p>
                      </div>
                      <ArrowUpRight className="ms-auto w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-sa-500 transition-colors" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{[lang === 'ar' ? r.major : (r.major_en || r.major), lang === 'ar' ? r.faculty : (r.faculty_en || r.faculty)].filter(Boolean).join(' · ')}</p>
                    <div className="mt-auto flex items-center justify-between">
                      {gpa > 0 ? <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${gpaTone}`}>{t('معدل', 'GPA')} {gpa.toFixed(2)}</span> : <span />}
                      <span className="text-[11px] font-bold text-sa-700 dark:text-sa-300">{t('عرض السجل', 'Open record')}</span>
                    </div>
                  </a>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>
      ))}

      {roster && shown === 0 && (
        <p className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center text-sm text-gray-500">{t('لا يطابق أي طالب هذا البحث.', 'No student matches this search.')}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// منصة التعلم — the admin's reflection of QSpark
// ─────────────────────────────────────────────────────────────────────────

export function AdminLearningTab() {
  const { t } = useLanguage();
  const links = readLinks();

  const doors = [
    { icon: LayoutDashboard, title: t('لوحة مدير QSpark', 'QSpark admin dashboard'), desc: t('الزيارات وجلسات اللعب، الطلاب الأعلى والأكثر تحسّناً، توزيع المعدلات والحضور، والطلاب المعرّضون للخطر — كما تفتحها من QSpark نفسها.', 'Visits and play sessions, top and most-improved students, GPA and attendance distributions, students at risk — as QSpark opens it.'), href: links.qsparkAdmin || '/qspark/admin/dashboard' },
    { icon: BookOpen, title: t('بنك الأسئلة ولوحة أعضاء هيئة التدريس', 'Question bank & faculty desk'), desc: t('أسئلة الاختبارات لكل مقرر وملف، توليدها ومراجعتها وتصديرها.', 'Quiz questions per course and file — generate, review, export.'), href: links.qsparkFaculty || '/qspark/faculty/dashboard' },
    { icon: Sparkles, title: t('قرارات المرشد الذكي من QSpark', 'Smart mentor decisions from QSpark'), desc: t('الأسئلة التي يتعثّر فيها الطلاب، وما غيّره الوكيل في الصعوبة وعدد الأسئلة والوقت، ومن رصده متعثّراً.', 'The questions students stumble on, what the agent changed (difficulty, count, time) and whom it flagged.'), to: '/agent-core' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-bl from-sa-700 via-sa-800 to-emerald-900 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute -top-12 -end-12 w-56 h-56 rounded-full bg-white/5" />
        <div className="relative flex items-start gap-4">
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center"><Zap className="w-7 h-7" /></div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wide text-sa-200">{t('منصة التعلم والتجربة الأكاديمية', 'Learning & Academic Experience Platform')}</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-0.5">{t('QSpark — نظرة المدير', 'QSpark — the admin view')}</h2>
            <p className="text-sm text-sa-100/90 mt-1 leading-relaxed">
              {t('ما تقرؤه المنصة عن لعب الطلاب واختباراتهم، وما يقرّره المرشد الذكي بناءً عليه — والأبواب إلى لوحات QSpark نفسها.', 'What the platform reads from students’ play and quizzes, what the smart mentor decides on it — and the doors into QSpark’s own dashboards.')}
            </p>
          </div>
        </div>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {doors.map(d => {
          const Icon = d.icon;
          const inner = (
            <>
              <div className="flex items-start justify-between mb-3">
                <span className="inline-flex rounded-xl p-2.5 bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400"><Icon className="h-5 w-5" strokeWidth={1.75} /></span>
                {d.to ? <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-sa-500 transition-colors" /> : <ExternalLink className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-sa-500 transition-colors" />}
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{d.title}</h3>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{d.desc}</p>
            </>
          );
          const cls = 'group relative block h-full rounded-2xl border-t-[3px] border-t-sa-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5';
          return (
            <StaggerItem key={d.title}>
              {d.to ? <Link to={d.to} className={cls}>{inner}</Link> : <a href={d.href} className={cls}>{inner}</a>}
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  );
}
