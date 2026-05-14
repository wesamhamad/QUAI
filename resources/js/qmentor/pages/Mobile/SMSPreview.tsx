import { smsMessages } from './data/mockMessageData';

interface SMSPreviewProps {
  t: (ar: string, en: string) => string;
}

export default function SMSPreview({ t }: SMSPreviewProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t('معاينة الرسائل النصية القصيرة للتنبيهات الحرجة', 'Preview of SMS text messages for critical alerts')}
      </p>

      {/* Phone Frame */}
      <div className="mx-auto max-w-[360px]">
        <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
          <div className="flex justify-center mb-2">
            <div className="w-28 h-6 bg-black rounded-full" />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-[1.75rem] overflow-hidden h-[480px] flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              <div className="flex-1 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mb-1">
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-300">QM</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">QMentor</p>
              </div>
              <div className="w-5" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {smsMessages.map((sms) => (
                <div key={sms.id}>
                  <div className="flex justify-center mb-2">
                    <span className="text-xs text-gray-400">{sms.time}</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[90%]">
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                      {t(sms.textAr, sms.textEn)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 py-2 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm text-gray-400">
                {t('رسالة نصية', 'Text Message')}
              </div>
              <div className="w-8 h-8 rounded-full bg-sa-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
