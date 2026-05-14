import { whatsappMessages } from './data/mockMessageData';
import type { ChatMessage } from './types';

interface WhatsAppPreviewProps {
  t: (ar: string, en: string) => string;
}

function WhatsAppBubble({ msg, t }: { msg: ChatMessage; t: (ar: string, en: string) => string }) {
  const isBot = msg.sender === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-2`}>
      <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
        isBot
          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
          : 'bg-[#DCF8C6] dark:bg-emerald-800 text-gray-900 dark:text-white rounded-tr-none'
      }`}>
        <p className="text-sm whitespace-pre-line">{t(msg.textAr, msg.textEn)}</p>
        <p className={`text-[10px] mt-1 text-end ${isBot ? 'text-gray-400' : 'text-emerald-700 dark:text-emerald-300'}`}>
          {msg.time} {!isBot && '✓✓'}
        </p>
      </div>
    </div>
  );
}

export default function WhatsAppPreview({ t }: WhatsAppPreviewProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t('معاينة رسائل بوت كيومنتور على واتساب', 'Preview of QMentor bot messages on WhatsApp')}
      </p>

      {/* Phone Frame */}
      <div className="mx-auto max-w-[360px]">
        <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
          <div className="flex justify-center mb-2">
            <div className="w-28 h-6 bg-black rounded-full" />
          </div>

          <div className="bg-[#ECE5DD] dark:bg-gray-900 rounded-[1.75rem] overflow-hidden h-[560px] flex flex-col">
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] dark:bg-[#1F2C34] px-4 py-3 flex items-center gap-3">
              <div className="w-2 h-2" />
              <div className="w-9 h-9 rounded-full bg-sa-500 flex items-center justify-center text-white font-bold text-sm">
                QM
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">QMentor Bot</p>
                <p className="text-emerald-200 text-xs">{t('متصل', 'online')}</p>
              </div>
              <div className="flex gap-4 text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z"/></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7a2 2 0 100-4 2 2 0 000 4zm0 7a2 2 0 100-4 2 2 0 000 4zm0 7a2 2 0 100-4 2 2 0 000 4z"/></svg>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'p\' width=\'40\' height=\'40\' patternUnits=\'userSpaceOnUse\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'1\' fill=\'%2300000008\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill=\'url(%23p)\' width=\'200\' height=\'200\'/%3E%3C/svg%3E")' }}>
              {/* Date chip */}
              <div className="flex justify-center mb-3">
                <span className="bg-white/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full shadow-sm">
                  {t('اليوم', 'Today')}
                </span>
              </div>
              {whatsappMessages.map((msg) => (
                <WhatsAppBubble key={msg.id} msg={msg} t={t} />
              ))}
            </div>

            {/* Input Bar */}
            <div className="bg-[#F0F0F0] dark:bg-[#1F2C34] px-2 py-2 flex items-center gap-2">
              <div className="flex-1 bg-white dark:bg-gray-700 rounded-full px-4 py-2 text-sm text-gray-400">
                {t('اكتب رسالة...', 'Type a message...')}
              </div>
              <div className="w-10 h-10 rounded-full bg-[#075E54] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
