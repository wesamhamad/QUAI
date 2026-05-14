import { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Conversation } from '../types';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

function timeAgo(timestamp: string, isAr: boolean): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return isAr ? 'الآن' : 'Just now';
  if (mins < 60) return isAr ? `منذ ${mins} د` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return isAr ? `منذ ${hrs} س` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return isAr ? `منذ ${days} ي` : `${days}d ago`;
}

export default function ConversationSidebar({ conversations, activeId, onSelect, onNew }: ConversationSidebarProps) {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pinned' | 'archived'>('all');

  const filtered = conversations.filter(c => {
    if (filter === 'pinned' && !c.pinned) return false;
    if (filter === 'archived' && !c.archived) return false;
    if (filter === 'all' && c.archived) return false;
    if (search) {
      const q = search.toLowerCase();
      return (c.title + c.titleEn + c.lastMessage + c.lastMessageEn).toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-e border-gray-200 dark:border-gray-700">
      {/* New conversation button */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sa-500 text-white text-sm font-medium hover:bg-sa-600 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          {t('محادثة جديدة', 'New Conversation')}
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <MagnifyingGlassIcon className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('بحث في المحادثات...', 'Search conversations...')}
            className="w-full ps-9 pe-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sa-500"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex px-3 gap-1 mb-1">
        {([
          ['all', t('الكل', 'All'), ChatBubbleLeftRightIcon],
          ['pinned', t('مثبّتة', 'Pinned'), MapPinIcon],
          ['archived', t('مؤرشفة', 'Archived'), ArchiveBoxIcon],
        ] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === key
                ? 'bg-sa-100 dark:bg-sa-950 text-sa-700 dark:text-sa-300'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 scrollbar-thin">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">
            {t('لا توجد محادثات', 'No conversations')}
          </p>
        ) : (
          filtered.map(conv => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full text-start px-3 py-2.5 rounded-xl transition-colors ${
                activeId === conv.id
                  ? 'bg-sa-50 dark:bg-sa-950 border border-sa-200 dark:border-sa-800'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {conv.pinned && <MapPinIcon className="w-3 h-3 inline-block me-1 text-sa-500" />}
                  {isAr ? conv.title : conv.titleEn}
                </p>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0">
                  {timeAgo(conv.timestamp, isAr)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {isAr ? conv.lastMessage : conv.lastMessageEn}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
