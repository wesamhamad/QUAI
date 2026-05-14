import React, { useState } from 'react';
import { GraduationCap, BarChart3, Handshake, AlertTriangle, CalendarDays } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TimelineEvent } from '../types';

interface Props {
  events: TimelineEvent[];
}

const typeStyles = {
  academic: { bg: 'bg-sa-100 dark:bg-sa-900/50', icon: GraduationCap, text: 'text-sa-700 dark:text-sa-300', label: 'أكاديمي', line: 'bg-sa-500' },
  behavioral: { bg: 'bg-info-100 dark:bg-blue-900/50', icon: BarChart3, text: 'text-info-600 dark:text-blue-300', label: 'سلوكي', line: 'bg-info-500' },
  intervention: { bg: 'bg-lavender-100 dark:bg-purple-900/50', icon: Handshake, text: 'text-lavender-600 dark:text-purple-300', label: 'تدخل', line: 'bg-lavender-500' },
  alert: { bg: 'bg-error-100 dark:bg-red-900/50', icon: AlertTriangle, text: 'text-error-500 dark:text-red-300', label: 'تنبيه', line: 'bg-error-500' },
};

type FilterType = 'all' | TimelineEvent['type'];

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
}

export default function ActivityTimeline({ events }: Props) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = filter === 'all' ? events : events.filter(e => e.type === filter);
  const sorted = [...filtered].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'الكل' },
    { key: 'academic', label: 'أكاديمي' },
    { key: 'behavioral', label: 'سلوكي' },
    { key: 'intervention', label: 'تدخل' },
    { key: 'alert', label: 'تنبيهات' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center"><CalendarDays className="w-4 h-4" /></span>
        السجل الزمني
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === f.key
                ? 'bg-sa-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute top-0 bottom-0 right-4 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-4">
          {sorted.map(event => {
            const style = typeStyles[event.type];
            return (
              <div key={event.id} className="relative flex gap-4 pr-4">
                {/* Dot */}
                <div className={`absolute right-2.5 top-1.5 w-3 h-3 rounded-full ${style.line} ring-2 ring-white dark:ring-gray-800 z-10`} />

                {/* Content */}
                <div className={`${style.bg} rounded-xl p-3 flex-1 mr-4 transition-all hover:shadow-sm`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <style.icon className="w-4 h-4" />
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{event.title}</h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${style.text} font-medium shrink-0`}>{style.label}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">
                    {formatDate(event.timestamp)} • {formatTime(event.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
