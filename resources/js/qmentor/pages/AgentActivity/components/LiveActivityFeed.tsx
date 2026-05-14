import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, AlertTriangle, AlertOctagon, ChevronDown, ChevronUp, Bot, BellRing, UserCheck, User, Radio } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { mockActivityFeed } from '../data/mockActivityFeed';
import type { ActivityEntry } from '../types';

const typeConfig = {
  success: { icon: CheckCircle, className: 'text-sa-600', bgClass: 'hover:bg-sa-50/50' },
  info: { icon: Info, className: 'text-blue-500', bgClass: 'hover:bg-blue-50/50' },
  warning: { icon: AlertTriangle, className: 'text-amber-500', bgClass: 'hover:bg-amber-50/50' },
  alert: { icon: AlertOctagon, className: 'text-red-500', bgClass: 'hover:bg-red-50/50' },
};

const modeIcons: Record<string, typeof Bot> = {
  autonomous: Bot,
  agent_notify: BellRing,
  human_approves: UserCheck,
  human_only: User,
};

const modeColors: Record<string, string> = {
  autonomous: 'text-sa-600 bg-sa-50 border-sa-200',
  agent_notify: 'text-blue-600 bg-blue-50 border-blue-200',
  human_approves: 'text-amber-600 bg-amber-50 border-amber-200',
  human_only: 'text-gray-500 bg-gray-50 border-gray-200',
};

function FeedItem({ entry, onSelect }: { entry: ActivityEntry; onSelect: (entry: ActivityEntry) => void }) {
  const { lang } = useLanguage();
  const config = typeConfig[entry.type];
  const Icon = config.icon;
  const ModeIcon = modeIcons[entry.autonomyMode] || Bot;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${config.bgClass} border border-transparent hover:border-gray-200`}
      onClick={() => onSelect(entry)}
    >
      <div className="relative mt-0.5">
        <Icon className={`w-4 h-4 ${config.className}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 leading-relaxed">
          {lang === 'ar' ? entry.messageAr : entry.message}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${modeColors[entry.autonomyMode]}`}>
            <ModeIcon className="w-2.5 h-2.5" />
          </span>
          {entry.duration && (
            <span className="text-[10px] text-gray-400">{entry.duration}</span>
          )}
        </div>
      </div>

      <span className="text-[11px] text-gray-400 shrink-0 mt-0.5 font-mono">
        {entry.timestamp}
      </span>
    </motion.div>
  );
}

interface Props {
  onSelectEntry?: (entry: ActivityEntry) => void;
}

export default function LiveActivityFeed({ onSelectEntry }: Props) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [newItemFlash, setNewItemFlash] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleItems = expanded ? mockActivityFeed : mockActivityFeed.slice(0, 10);

  useEffect(() => {
    const interval = setInterval(() => {
      setNewItemFlash(true);
      setTimeout(() => setNewItemFlash(false), 1000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-gray-900">
            {t('سجل النشاط المباشر', 'Live Activity Feed')}
          </h3>
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-sa-500 animate-pulse" />
            <span className="text-xs text-sa-600 font-medium">{t('مباشر', 'Live')}</span>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ${newItemFlash ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
          {mockActivityFeed.length} {t('حدث', 'events')}
        </span>
      </div>

      <div ref={scrollRef} className="space-y-0.5 p-2 max-h-[460px] overflow-y-auto">
        <AnimatePresence>
          {visibleItems.map(entry => (
            <FeedItem key={entry.id} entry={entry} onSelect={onSelectEntry || (() => {})} />
          ))}
        </AnimatePresence>
      </div>

      {mockActivityFeed.length > 10 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 py-2.5 text-xs text-gray-500 hover:text-gray-700 border-t border-gray-100 transition-colors hover:bg-gray-50"
        >
          {expanded ? (
            <><ChevronUp className="w-3.5 h-3.5" /> {t('عرض أقل', 'Show Less')}</>
          ) : (
            <><ChevronDown className="w-3.5 h-3.5" /> {t('عرض الكل', 'Show All')} ({mockActivityFeed.length})</>
          )}
        </button>
      )}
    </div>
  );
}
