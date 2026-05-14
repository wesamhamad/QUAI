import { useState, useRef, useEffect } from 'react';
import {
  PaperAirplaneIcon,
  MicrophoneIcon,
  PaperClipIcon,
  XMarkIcon,
  PhotoIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { AttachmentData } from '../types';

interface ChatInputProps {
  onSend: (text: string, attachment?: AttachmentData) => void;
  disabled?: boolean;
}

const MAX_CHARS = 500;

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const { t, dir } = useLanguage();
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState<AttachmentData | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const attachRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  // Close attach menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (attachRef.current && !attachRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSend = () => {
    const trimmed = text.trim();
    if ((!trimmed && !attachment) || disabled) return;
    onSend(trimmed || (attachment ? attachment.name : ''), attachment ?? undefined);
    setText('');
    setAttachment(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMockAttach = (type: 'image' | 'document') => {
    const mockFiles = {
      image: { name: type === 'image' ? 'screenshot.png' : 'photo.jpg', type: 'image' as const, size: '2.4 MB' },
      document: { name: 'transcript.pdf', type: 'document' as const, size: '156 KB' },
    };
    setAttachment(mockFiles[type]);
    setShowAttachMenu(false);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
      {/* Attachment preview */}
      {attachment && (
        <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
          <div className="p-1.5 rounded-lg bg-sa-100 dark:bg-sa-900/30">
            {attachment.type === 'image' ? (
              <PhotoIcon className="w-4 h-4 text-sa-600 dark:text-sa-400" />
            ) : (
              <DocumentIcon className="w-4 h-4 text-sa-600 dark:text-sa-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{attachment.name}</p>
            <p className="text-[10px] text-gray-400">{attachment.size}</p>
          </div>
          <button
            onClick={() => setAttachment(null)}
            className="p-1 rounded text-gray-400 hover:text-error-500 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Attachment */}
        <div className="relative" ref={attachRef}>
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
            title={t('إرفاق ملف', 'Attach file')}
          >
            <PaperClipIcon className="w-5 h-5" />
          </button>

          {/* Attachment menu */}
          {showAttachMenu && (
            <div className="absolute bottom-full mb-1 start-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-1.5 min-w-[160px] z-10">
              <button
                onClick={() => handleMockAttach('image')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <PhotoIcon className="w-4 h-4 text-blue-500" />
                {t('صورة / لقطة شاشة', 'Photo / Screenshot')}
              </button>
              <button
                onClick={() => handleMockAttach('document')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <DocumentIcon className="w-4 h-4 text-amber-500" />
                {t('مستند', 'Document')}
              </button>
            </div>
          )}
        </div>

        {/* Text area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            placeholder={t('اكتب رسالتك...', 'Type your message...')}
            disabled={disabled}
            rows={1}
            dir={dir}
            className="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sa-500 focus:border-transparent disabled:opacity-50 transition-colors"
          />
          {text.length > 0 && (
            <span className="absolute bottom-1 end-2 text-[10px] text-gray-400">
              {text.length}/{MAX_CHARS}
            </span>
          )}
        </div>

        {/* Voice */}
        <button
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
          title={t('إدخال صوتي', 'Voice input')}
        >
          <MicrophoneIcon className="w-5 h-5" />
        </button>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={(!text.trim() && !attachment) || disabled}
          className="p-2.5 rounded-xl bg-sa-500 text-white hover:bg-sa-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          title={t('إرسال', 'Send')}
        >
          <PaperAirplaneIcon className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
}
