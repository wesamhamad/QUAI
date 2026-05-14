import { useMemo } from 'react';
import {
  CheckIcon,
  DocumentIcon,
  PhotoIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Message } from '../types';

/**
 * Parse a pipe-delimited table row into cell strings.
 */
function parseTableRow(line: string): string[] {
  return line
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(cell => cell.trim());
}

/**
 * Check if a line is a markdown table separator row (e.g. |---|---|)
 */
function isTableSeparator(line: string): boolean {
  return /^\|?[\s\-:]+(\|[\s\-:]+)+\|?$/.test(line.trim());
}

/**
 * Lightweight markdown renderer for AI chat messages.
 * Handles: bold, links, numbered lists, bullet lists, tables, line breaks, and reference download links.
 */
function renderMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Split into lines and group into blocks
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Table: lines starting with | (collect consecutive pipe-rows)
    if (/^\|/.test(line.trim())) {
      const tableLines: string[] = [];
      while (i < lines.length && /^\|/.test(lines[i].trim())) {
        tableLines.push(lines[i]);
        i++;
      }

      // Need at least 2 lines for a table (header + separator or header + row)
      if (tableLines.length >= 2) {
        const headerRow = parseTableRow(tableLines[0]);
        // Check if 2nd line is separator
        const startIdx = isTableSeparator(tableLines[1]) ? 2 : 1;
        const bodyRows = tableLines.slice(startIdx).filter(l => !isTableSeparator(l)).map(parseTableRow);

        elements.push(
          <div key={key++} className="my-2 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sa-50 dark:bg-sa-950">
                  {headerRow.map((cell, ci) => (
                    <th key={ci} className="px-3 py-2 text-start font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 whitespace-nowrap">
                      {renderInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {bodyRows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else {
        // Single pipe line — render as regular text
        elements.push(
          <p key={key++} className="text-sm leading-relaxed">{renderInline(tableLines[0])}</p>
        );
      }
      continue;
    }

    // Numbered list item: "1. text" or "1- text"
    if (/^\d+[\.\-]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[\.\-]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+[\.\-]\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={key++} className="list-decimal list-inside space-y-1 my-1.5">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm leading-relaxed">{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullet list item: "- text" or "* text"
    if (/^[\-\*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[\-\*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[\-\*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-1 my-1.5">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm leading-relaxed">{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Empty line = paragraph break
    if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />);
      i++;
      continue;
    }

    // Regular text line
    elements.push(
      <p key={key++} className="text-sm leading-relaxed">{renderInline(line)}</p>
    );
    i++;
  }

  return <>{elements}</>;
}

/**
 * Render inline markdown: bold, links (markdown + raw URLs), emojis preserved.
 */
function renderInline(text: string): React.ReactNode {
  // Pattern matches: **bold**, [text](url), or raw http(s) URLs
  const pattern = /(\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s<\]]+))/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let k = 0;

  while ((match = pattern.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // Bold: **text**
      parts.push(<strong key={k++} className="font-semibold">{match[2]}</strong>);
    } else if (match[3] && match[4]) {
      // Markdown link: [text](url)
      parts.push(
        <a key={k++} href={match[4]} target="_blank" rel="noopener noreferrer"
          className="text-sa-600 dark:text-sa-400 underline hover:text-sa-700 dark:hover:text-sa-300">
          {match[3]}
        </a>
      );
    } else if (match[5]) {
      // Raw URL
      parts.push(
        <a key={k++} href={match[5]} target="_blank" rel="noopener noreferrer"
          className="text-sa-600 dark:text-sa-400 underline hover:text-sa-700 dark:hover:text-sa-300 break-all">
          {match[5]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

interface ChatMessageProps {
  message: Message;
  onQuickReply?: (text: string) => void;
}

function formatTime(timestamp: string) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function ReadReceipt({ status }: { status?: 'sent' | 'delivered' | 'read' }) {
  if (!status) return null;
  return (
    <span className="inline-flex items-center ms-1">
      {status === 'sent' && (
        <CheckIcon className="w-3 h-3 text-gray-400" />
      )}
      {status === 'delivered' && (
        <span className="inline-flex -space-x-1.5">
          <CheckIcon className="w-3 h-3 text-gray-400" />
          <CheckIcon className="w-3 h-3 text-gray-400" />
        </span>
      )}
      {status === 'read' && (
        <span className="inline-flex -space-x-1.5">
          <CheckIcon className="w-3 h-3 text-blue-500" />
          <CheckIcon className="w-3 h-3 text-blue-500" />
        </span>
      )}
    </span>
  );
}

function AttachmentBlock({ attachment, isUser }: { attachment: Message['attachment']; isUser: boolean }) {
  if (!attachment) return null;
  const Icon = attachment.type === 'image' ? PhotoIcon : attachment.type === 'document' ? DocumentIcon : PaperClipIcon;
  return (
    <div className={`mt-2 flex items-center gap-2 p-2 rounded-lg border ${
      isUser
        ? 'border-white/20 bg-white/10'
        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
    }`}>
      <div className={`p-1.5 rounded-lg ${isUser ? 'bg-white/20' : 'bg-sa-100 dark:bg-sa-900/30'}`}>
        <Icon className={`w-4 h-4 ${isUser ? 'text-white' : 'text-sa-600 dark:text-sa-400'}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-medium truncate ${isUser ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
          {attachment.name}
        </p>
        <p className={`text-[10px] ${isUser ? 'text-white/70' : 'text-gray-400'}`}>
          {attachment.size}
        </p>
      </div>
    </div>
  );
}

function CardBlock({ message, isAr }: { message: Message; isAr: boolean }) {
  if (!message.card) return null;
  const card = message.card;
  return (
    <div className="mt-2 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
      <div className="px-3 py-2 bg-sa-50 dark:bg-sa-950 border-b border-gray-200 dark:border-gray-600">
        <p className="text-sm font-semibold text-sa-700 dark:text-sa-300">
          {isAr ? card.title : card.titleEn}
        </p>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {card.items.map((item, i) => (
          <div key={i} className="px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {isAr ? item.label : item.labelEn}
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {isAr ? item.value : item.valueEn}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListBlock({ message, isAr }: { message: Message; isAr: boolean }) {
  if (!message.list) return null;
  const list = message.list;
  return (
    <div className="mt-2 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
      <div className="px-3 py-2 bg-sa-50 dark:bg-sa-950 border-b border-gray-200 dark:border-gray-600">
        <p className="text-sm font-semibold text-sa-700 dark:text-sa-300">
          {isAr ? list.title : list.titleEn}
        </p>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {list.rows.map((row, i) => (
          <div key={i} className="px-3 py-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {isAr ? row.label : row.labelEn}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isAr ? row.description : row.descriptionEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChatMessage({ message, onQuickReply }: ChatMessageProps) {
  const { lang, dir } = useLanguage();
  const isAr = lang === 'ar';
  const isUser = message.role === 'user';
  const isEscalation = message.type === 'escalation';

  const content = isAr ? message.content : message.contentEn;

  // Memoize markdown rendering for assistant messages
  const renderedContent = useMemo(() => {
    if (isUser || !content) return null;
    return renderMarkdown(content);
  }, [content, isUser]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-[fadeIn_0.3s_ease-out]`}>
      <div className={`max-w-[80%] sm:max-w-[70%] ${isUser ? '' : 'flex gap-2'}`}>
        {/* Avatar for assistant */}
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-sa-500 flex items-center justify-center shrink-0 mt-1">
            <span className="text-white font-bold text-xs">Q</span>
          </div>
        )}

        <div>
          {/* Message bubble */}
          <div
            className={`rounded-2xl px-4 py-2.5 ${
              isUser
                ? 'bg-sa-500 text-white rounded-ee-sm'
                : isEscalation
                  ? 'bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-gray-900 dark:text-white rounded-es-sm'
                  : 'bg-sa-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-es-sm'
            }`}
            dir={message.language === 'ar' ? 'rtl' : 'ltr'}
          >
            {isEscalation && (
              <div className="flex items-center gap-1.5 mb-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-medium">{isAr ? 'تحويل للمرشد' : 'Advisor Escalation'}</span>
              </div>
            )}
            {isUser
              ? <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
              : <div className="text-sm leading-relaxed chat-markdown">{renderedContent}</div>
            }
            {message.card && <CardBlock message={message} isAr={isAr} />}
            {message.list && <ListBlock message={message} isAr={isAr} />}
            {message.attachment && <AttachmentBlock attachment={message.attachment} isUser={isUser} />}
          </div>

          {/* Timestamp + Read Receipt */}
          <div className={`flex items-center gap-1 mt-1 ${isUser ? (dir === 'rtl' ? 'justify-start' : 'justify-end') : (dir === 'rtl' ? 'justify-end ms-10' : 'justify-start ms-10')}`}>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              {formatTime(message.timestamp)}
            </p>
            {isUser && <ReadReceipt status={message.status} />}
          </div>

          {/* Quick replies */}
          {message.quickReplies && message.quickReplies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2 ms-10">
              {message.quickReplies.map(qr => (
                <button
                  key={qr.id}
                  onClick={() => onQuickReply?.(isAr ? qr.label : qr.labelEn)}
                  className="text-xs px-3 py-1.5 rounded-full border border-sa-300 dark:border-sa-700 text-sa-700 dark:text-sa-300 hover:bg-sa-50 dark:hover:bg-sa-950 transition-colors"
                >
                  {isAr ? qr.label : qr.labelEn}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
