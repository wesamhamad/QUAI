import { telegramMessages } from './data/mockMessageData';
import type { ChatMessage } from './types';

interface TelegramPreviewProps {
  t: (ar: string, en: string) => string;
}

function TelegramBubble({ msg, t }: { msg: ChatMessage; t: (ar: string, en: string) => string }) {
  const isBot = msg.sender === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-2`}>
      <div className="max-w-[80%]">
        <div className={`rounded-lg px-3 py-2 ${
          isBot
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
            : 'bg-[#EFFDDE] dark:bg-[#2B5278] text-gray-900 dark:text-white rounded-tr-none'
        }`}>
          {isBot && (
            <p className="text-xs font-semibold text-blue-500 mb-1">QMentor Bot</p>
          )}
          <p className="text-sm whitespace-pre-line">{t(msg.textAr, msg.textEn)}</p>
          <p className="text-[10px] text-gray-400 mt-1 text-end">{msg.time}</p>
        </div>

        {/* Inline Keyboard Buttons */}
        {msg.buttons && (
          <div className="mt-1 space-y-1">
            {msg.buttons.map((btn, i) => (
              <button
                key={i}
                className="w-full text-center text-sm py-2 rounded-lg bg-white dark:bg-gray-700 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors"
              >
                {t(btn.labelAr, btn.labelEn)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TelegramPreview({ t }: TelegramPreviewProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t('معاينة بوت كيومنتور على تيليجرام مع أزرار التفاعل', 'Preview of QMentor Telegram bot with inline keyboard buttons')}
      </p>

      {/* Phone Frame */}
      <div className="mx-auto max-w-[360px]">
        <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
          <div className="flex justify-center mb-2">
            <div className="w-28 h-6 bg-black rounded-full" />
          </div>

          <div className="bg-[#17212B] rounded-[1.75rem] overflow-hidden h-[560px] flex flex-col">
            {/* Telegram Header */}
            <div className="bg-[#242F3D] px-4 py-3 flex items-center gap-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                QM
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">QMentor Bot</p>
                <p className="text-blue-300 text-xs">{t('بوت', 'bot')}</p>
              </div>
              <div className="flex gap-4 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7a2 2 0 100-4 2 2 0 000 4zm0 7a2 2 0 100-4 2 2 0 000 4zm0 7a2 2 0 100-4 2 2 0 000 4z"/></svg>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-3 py-3 bg-[#0E1621]">
              {telegramMessages.map((msg) => (
                <TelegramBubble key={msg.id} msg={msg} t={t} />
              ))}
            </div>

            {/* Input Bar */}
            <div className="bg-[#17212B] px-3 py-2 flex items-center gap-2 border-t border-gray-700">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div className="flex-1 bg-[#242F3D] rounded-full px-4 py-2 text-sm text-gray-500">
                {t('اكتب رسالة...', 'Message...')}
              </div>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
