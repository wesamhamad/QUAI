import React from 'react';
import { GraduationCap, BarChart3, Heart, Briefcase, Bot, Pin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AIRecommendation } from '../types';

interface Props {
  recommendations: AIRecommendation[];
}

const priorityStyles = {
  urgent: { bg: 'bg-error-100 dark:bg-red-900/40', border: 'border-error-500', text: 'text-error-600 dark:text-red-300', label: 'عاجل' },
  important: { bg: 'bg-gold-100 dark:bg-gold-900/40', border: 'border-gold-500', text: 'text-gold-700 dark:text-gold-300', label: 'مهم' },
  suggestion: { bg: 'bg-info-100 dark:bg-blue-900/40', border: 'border-info-500', text: 'text-info-600 dark:text-blue-300', label: 'اقتراح' },
};

const categoryIcons: Record<string, LucideIcon> = {
  academic: GraduationCap,
  behavioral: BarChart3,
  wellness: Heart,
  career: Briefcase,
};

export default function AIRecommendations({ recommendations }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gold-100 dark:bg-gold-900 flex items-center justify-center text-gold-600 dark:text-gold-400"><Bot className="w-4 h-4" /></span>
          توصيات الذكاء الاصطناعي
        </h2>
        <span className="text-[10px] bg-sa-100 dark:bg-sa-900/50 text-sa-700 dark:text-sa-300 px-2 py-1 rounded-full font-medium">
          مدعوم من QMentor AI
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map(rec => {
          const style = priorityStyles[rec.priority];
          return (
            <div
              key={rec.id}
              className={`${style.bg} border-r-4 ${style.border} rounded-xl p-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {React.createElement(categoryIcons[rec.category] ?? Pin, { className: 'w-4 h-4' })}
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{rec.title}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${style.text} font-medium`}>{style.label}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{rec.description}</p>
                </div>
                <button className="shrink-0 bg-white dark:bg-gray-700 text-sa-600 dark:text-sa-400 text-xs font-medium px-3 py-1.5 rounded-lg border border-sa-200 dark:border-sa-700 hover:bg-sa-50 dark:hover:bg-sa-900/30 transition-colors">
                  {rec.actionLabel}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
