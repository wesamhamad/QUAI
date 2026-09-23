import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { AgentSource } from '../../hooks/useAgentCore';
import { sourceIcons } from './content';

interface OrbitProps {
  sources: AgentSource[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** One line under the hub name — this term's headline number. */
  hubLine?: string;
}

/**
 * The agent in the centre, its systems on a ring around it, a spoke from each
 * to the centre with data beads running inward. Geometry is computed from the
 * measured width so the same picture fits a phone and a wall screen; the
 * beads and the pulse are CSS (see .qm-orbit-* in qmentor.css).
 */
export default function Orbit({ sources, selectedId, onSelect, hubLine }: OrbitProps) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(560);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width ?? 560;
      setWidth(Math.max(300, Math.min(w, 680)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const size = width;
  const n = Math.max(sources.length, 1);
  const r = size * 0.40;
  const hub = size * 0.30;
  const nodeW = Math.max(92, size * 0.20);
  const start = -Math.PI / 2;
  const compact = size < 440;

  return (
    <div ref={ref} className="w-full flex justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* ring */}
        <div
          className="qm-orbit-ring absolute rounded-full border border-dashed border-sa-300/70 dark:border-sa-700/70"
          style={{ left: size / 2 - r, top: size / 2 - r, width: r * 2, height: r * 2 }}
          aria-hidden="true"
        />
        <div
          className="absolute rounded-full border border-sa-200/60 dark:border-sa-800/60"
          style={{ left: size / 2 - r * 0.62, top: size / 2 - r * 0.62, width: r * 1.24, height: r * 1.24 }}
          aria-hidden="true"
        />

        {/* spokes — one per system, beads flow toward the centre */}
        {sources.map((s, i) => {
          const a = start + (i * 2 * Math.PI) / n;
          const dim = selectedId !== null && selectedId !== s.id;
          return (
            <span
              key={`spoke-${s.id}`}
              className={`qm-orbit-spoke absolute ${s.available ? '' : 'is-off'} ${dim ? 'is-dim' : ''} ${selectedId === s.id ? 'is-on' : ''}`}
              style={{
                left: size / 2,
                top: size / 2,
                width: r,
                transform: `rotate(${a}rad)`,
                ['--qm-d' as string]: `${(i * 0.55) % 3.3}s`,
                ['--qm-hub' as string]: `${hub / 2}px`,
              }}
              aria-hidden="true"
            />
          );
        })}

        {/* hub — the agent */}
        <div
          className="qm-orbit-hub absolute z-20 rounded-full flex flex-col items-center justify-center text-center text-white select-none"
          style={{ left: size / 2 - hub / 2, top: size / 2 - hub / 2, width: hub, height: hub }}
        >
          <span className="flex items-center justify-center rounded-full bg-white/15" style={{ width: hub * 0.26, height: hub * 0.26 }}>
            <Sparkles style={{ width: hub * 0.14, height: hub * 0.14 }} strokeWidth={1.8} />
          </span>
          <span className="mt-1 font-extrabold leading-tight" style={{ fontSize: Math.max(13, hub * 0.105) }}>
            {t('المرشد الذكي', 'Smart Mentor')}
          </span>
          <span className="font-semibold opacity-90 tracking-wide" style={{ fontSize: Math.max(10, hub * 0.075) }}>+QSpark</span>
          {hubLine && !compact && (
            <span className="mt-1 px-2 py-0.5 rounded-full bg-white/15 font-medium" style={{ fontSize: Math.max(9, hub * 0.062) }}>
              {hubLine}
            </span>
          )}
        </div>

        {/* nodes — the systems on the ring */}
        {sources.map((s, i) => {
          const a = start + (i * 2 * Math.PI) / n;
          const x = size / 2 + Math.cos(a) * r;
          const y = size / 2 + Math.sin(a) * r;
          const Icon = sourceIcons[s.id] ?? Sparkles;
          const active = selectedId === s.id;
          const dim = selectedId !== null && !active;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              aria-pressed={active}
              title={t(s.label, s.label_en)}
              className={`qm-orbit-node absolute z-10 flex flex-col items-center gap-1 rounded-2xl border bg-white dark:bg-gray-800 px-2 py-2 text-center transition-all duration-200
                ${active
                  ? 'border-sa-500 shadow-lg shadow-sa-500/20 -translate-y-0.5 ring-2 ring-sa-500/30'
                  : 'border-gray-200 dark:border-gray-700 shadow-sm hover:border-sa-400 hover:shadow-md hover:-translate-y-0.5'}
                ${dim ? 'opacity-55' : 'opacity-100'}`}
              style={{ left: x - nodeW / 2, top: y - (compact ? 30 : 38), width: nodeW }}
            >
              <span className={`relative inline-flex items-center justify-center rounded-xl ${active ? 'bg-sa-500 text-white' : 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400'}`}
                style={{ width: compact ? 28 : 34, height: compact ? 28 : 34 }}>
                <Icon style={{ width: compact ? 14 : 17, height: compact ? 14 : 17 }} strokeWidth={1.9} />
                <span
                  className={`absolute -top-0.5 -end-0.5 h-2 w-2 rounded-full ring-2 ring-white dark:ring-gray-800 ${s.available ? 'bg-success-500' : 'bg-gold-400'}`}
                  aria-hidden="true"
                />
              </span>
              {!compact && (
                <span className="text-[11px] font-bold leading-tight text-gray-900 dark:text-white line-clamp-2">
                  {t(s.label, s.label_en)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
