import { useState } from 'react';
import { Mail, MessageSquare, Phone, Video, Send, FileText, User, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

type Channel = 'email' | 'sms' | 'teams' | 'in-app';
type TemplateKey = 'early-warning' | 'check-in' | 'congratulations' | 'custom';

interface MockStudent {
  id: string;
  name: string;
  nameEn: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

const mockStudents: MockStudent[] = [
  { id: '441001234', name: 'أحمد محمد عتيب', nameEn: 'Ahmed Mohammed Otaib', riskLevel: 'critical' },
  { id: '441005678', name: 'سارة خالد ناصر', nameEn: 'Sara Khalid Nasser', riskLevel: 'high' },
  { id: '441002345', name: 'فهد عبدالله قحطان', nameEn: 'Fahad Abdullah Qahtan', riskLevel: 'medium' },
  { id: '441003456', name: 'نورة سعد دوسر', nameEn: 'Noura Saad Dosar', riskLevel: 'low' },
  { id: '441004567', name: 'عمر يوسف شمر', nameEn: 'Omar Youssef Shammar', riskLevel: 'high' },
];

const channelConfig: { key: Channel; icon: typeof Mail; labelAr: string; labelEn: string }[] = [
  { key: 'email', icon: Mail, labelAr: 'بريد إلكتروني', labelEn: 'Email' },
  { key: 'sms', icon: MessageSquare, labelAr: 'رسالة نصية', labelEn: 'SMS' },
  { key: 'teams', icon: Video, labelAr: 'تيمز', labelEn: 'Teams' },
  { key: 'in-app', icon: Phone, labelAr: 'داخل التطبيق', labelEn: 'In-App' },
];

const riskColors: Record<MockStudent['riskLevel'], string> = {
  critical: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
  high: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
  medium: 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400',
  low: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
};

export default function StudentMessaging() {
  const { t, lang } = useLanguage();

  const [selectedStudent, setSelectedStudent] = useState<MockStudent | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [channel, setChannel] = useState<Channel>('email');
  const [templateKey, setTemplateKey] = useState<TemplateKey>('early-warning');
  const [messageText, setMessageText] = useState('');
  const [sentStatus, setSentStatus] = useState(false);

  const studentName = selectedStudent
    ? lang === 'ar' ? selectedStudent.name : selectedStudent.nameEn
    : t('{name}', '{name}');

  const templates: Record<TemplateKey, { labelAr: string; labelEn: string; bodyAr: string; bodyEn: string }> = {
    'early-warning': {
      labelAr: 'تنبيه مبكر',
      labelEn: 'Early Warning',
      bodyAr: `عزيزي ${studentName}، لاحظنا أن مؤشر أدائك الأكاديمي يحتاج إلى اهتمام. نود مساعدتك في وضع خطة لتحسين وضعك الدراسي. يرجى التواصل معنا لتحديد موعد اجتماع في أقرب وقت.`,
      bodyEn: `Dear ${studentName}, we noticed your academic performance indicator needs attention. We would like to help you develop a plan to improve your academic standing. Please reach out to schedule a meeting at your earliest convenience.`,
    },
    'check-in': {
      labelAr: 'متابعة دورية',
      labelEn: 'Check-in',
      bodyAr: `مرحباً ${studentName}، هذه رسالة متابعة دورية للاطمئنان على مسيرتك الأكاديمية. كيف تسير أمورك الدراسية هذا الفصل؟ لا تتردد في التواصل معنا إذا احتجت أي دعم.`,
      bodyEn: `Hi ${studentName}, this is a routine check-in to see how you are doing academically. How are your studies going this semester? Do not hesitate to reach out if you need any support.`,
    },
    'congratulations': {
      labelAr: 'تهنئة',
      labelEn: 'Congratulations',
      bodyAr: `تهانينا ${studentName}! أداؤك في هذا الفصل كان متميزاً. نحن فخورون بتقدمك الأكاديمي ونشجعك على مواصلة هذا المستوى الرائع. استمر في التألق!`,
      bodyEn: `Congratulations ${studentName}! Your performance this semester has been outstanding. We are proud of your academic progress and encourage you to keep up the excellent work. Keep shining!`,
    },
    'custom': {
      labelAr: 'رسالة مخصصة',
      labelEn: 'Custom',
      bodyAr: '',
      bodyEn: '',
    },
  };

  const handleTemplateChange = (key: TemplateKey) => {
    setTemplateKey(key);
    const tmpl = templates[key];
    setMessageText(lang === 'ar' ? tmpl.bodyAr : tmpl.bodyEn);
  };

  const handleStudentSelect = (student: MockStudent) => {
    setSelectedStudent(student);
    setStudentSearch('');
    // Re-apply template with new student name
    if (templateKey !== 'custom') {
      const name = lang === 'ar' ? student.name : student.nameEn;
      const tmpl = templates[templateKey];
      // Rebuild with actual name by replacing the placeholder pattern
      const body = lang === 'ar' ? tmpl.bodyAr : tmpl.bodyEn;
      setMessageText(body.replace(studentName, name));
    }
  };

  // After student selection, re-derive template text
  const applyTemplate = (key: TemplateKey) => {
    setTemplateKey(key);
    const tmpl = templates[key];
    setMessageText(lang === 'ar' ? tmpl.bodyAr : tmpl.bodyEn);
  };

  const handleSend = () => {
    if (!selectedStudent || !messageText.trim()) return;
    setSentStatus(true);
    setTimeout(() => setSentStatus(false), 3000);
  };

  const filteredStudents = mockStudents.filter(s => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return s.name.includes(q) || s.nameEn.toLowerCase().includes(q) || s.id.includes(q);
  });

  const riskLabel = (level: MockStudent['riskLevel']) => {
    const labels: Record<MockStudent['riskLevel'], string> = {
      critical: t('حرج', 'Critical'),
      high: t('مرتفع', 'High'),
      medium: t('متوسط', 'Medium'),
      low: t('منخفض', 'Low'),
    };
    return labels[level];
  };

  const channelLabel = channelConfig.find(c => c.key === channel);

  const selectClasses = 'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-sa-500';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sa-100 dark:bg-sa-900/30 flex items-center justify-center">
          <Send className="w-5 h-5 text-sa-600 dark:text-sa-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('إرسال رسالة للطالب', 'Send Message to Student')}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('تواصل مع طلابك عبر قنوات متعددة', 'Reach out to your students via multiple channels')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Compose */}
        <div className="space-y-5">
          {/* Student Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
              <User className="w-4 h-4 text-sa-500" />
              {t('اختيار الطالب', 'Select Student')}
            </label>

            {selectedStudent ? (
              <div className="flex items-center justify-between p-3 rounded-lg bg-sa-50 dark:bg-sa-900/20 border border-sa-200 dark:border-sa-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sa-200 dark:bg-sa-800 flex items-center justify-center text-xs font-bold text-sa-700 dark:text-sa-300">
                    {(lang === 'ar' ? selectedStudent.name : selectedStudent.nameEn).charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {lang === 'ar' ? selectedStudent.name : selectedStudent.nameEn}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedStudent.id}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${riskColors[selectedStudent.riskLevel]}`}>
                    {riskLabel(selectedStudent.riskLevel)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {t('تغيير', 'Change')}
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  placeholder={t('ابحث بالاسم أو الرقم الجامعي...', 'Search by name or student ID...')}
                  className={selectClasses}
                />
                <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredStudents.map(student => (
                    <button
                      key={student.id}
                      onClick={() => {
                        handleStudentSelect(student);
                        applyTemplate(templateKey);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-start"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                          {(lang === 'ar' ? student.name : student.nameEn).charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {lang === 'ar' ? student.name : student.nameEn}
                          </p>
                          <p className="text-[10px] text-gray-400">{student.id}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${riskColors[student.riskLevel]}`}>
                        {riskLabel(student.riskLevel)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Channel Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              {t('قناة الإرسال', 'Delivery Channel')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {channelConfig.map(ch => {
                const Icon = ch.icon;
                const isActive = channel === ch.key;
                return (
                  <button
                    key={ch.key}
                    onClick={() => setChannel(ch.key)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                      isActive
                        ? 'border-sa-500 bg-sa-50 dark:bg-sa-900/20 shadow-sm'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-sa-600 dark:text-sa-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <span className={`text-xs font-medium ${isActive ? 'text-sa-700 dark:text-sa-300' : 'text-gray-600 dark:text-gray-400'}`}>
                      {t(ch.labelAr, ch.labelEn)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template Picker */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
              <FileText className="w-4 h-4 text-sa-500" />
              {t('قالب الرسالة', 'Message Template')}
            </label>
            <select
              value={templateKey}
              onChange={e => applyTemplate(e.target.value as TemplateKey)}
              className={selectClasses}
            >
              {(Object.keys(templates) as TemplateKey[]).map(key => (
                <option key={key} value={key}>
                  {t(templates[key].labelAr, templates[key].labelEn)}
                </option>
              ))}
            </select>
          </div>

          {/* Message Composer */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              {t('نص الرسالة', 'Message Body')}
            </label>
            <textarea
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-sa-500 resize-none"
              placeholder={t('اكتب رسالتك هنا...', 'Type your message here...')}
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">
              {messageText.length} {t('حرف', 'characters')}
            </p>
          </div>
        </div>

        {/* Right Column: Preview + Send */}
        <div className="space-y-5">
          {/* Preview Pane */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              {t('معاينة الرسالة', 'Message Preview')}
            </h3>

            <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
              {/* Preview Header */}
              <div className="px-4 py-3 bg-sa-500 dark:bg-sa-600">
                <div className="flex items-center gap-2">
                  {channelLabel && <channelLabel.icon className="w-4 h-4 text-white/80" />}
                  <span className="text-xs font-medium text-white/90">
                    {channelLabel ? t(channelLabel.labelAr, channelLabel.labelEn) : ''}
                  </span>
                </div>
              </div>

              {/* Preview To */}
              <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {t('إلى', 'To')}
                </span>
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {selectedStudent
                    ? `${lang === 'ar' ? selectedStudent.name : selectedStudent.nameEn} (${selectedStudent.id})`
                    : t('لم يتم اختيار طالب', 'No student selected')}
                </span>
              </div>

              {/* Preview Body */}
              <div className="px-4 py-4">
                {messageText.trim() ? (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {messageText}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                    {t('لا يوجد محتوى للمعاينة', 'No content to preview')}
                  </p>
                )}
              </div>

              {/* Preview Footer */}
              <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  {t('المرسل: مكتب الإرشاد الأكاديمي — جامعة القصيم', 'From: Academic Advisory Office — Qassim University')}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              {t('معلومات الإرسال', 'Delivery Info')}
            </h3>
            <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>{t('الطالب', 'Student')}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedStudent ? (lang === 'ar' ? selectedStudent.name : selectedStudent.nameEn) : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('القناة', 'Channel')}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {channelLabel ? t(channelLabel.labelAr, channelLabel.labelEn) : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('القالب', 'Template')}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {t(templates[templateKey].labelAr, templates[templateKey].labelEn)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('طول الرسالة', 'Message Length')}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {messageText.length} {t('حرف', 'chars')}
                </span>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!selectedStudent || !messageText.trim()}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              !selectedStudent || !messageText.trim()
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-sa-500 hover:bg-sa-600 text-white shadow-sm hover:shadow-md'
            }`}
          >
            <Send className="w-4 h-4" />
            {t('إرسال الرسالة', 'Send Message')}
          </button>
        </div>
      </div>

      {/* Confirmation Toast */}
      {sentStatus && (
        <div className="fixed bottom-6 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl bg-success-600 text-white text-sm font-medium shadow-lg animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5" />
          {t(
            `تم إرسال الرسالة بنجاح إلى ${selectedStudent ? selectedStudent.name : ''}`,
            `Message sent successfully to ${selectedStudent ? selectedStudent.nameEn : ''}`
          )}
        </div>
      )}
    </div>
  );
}
