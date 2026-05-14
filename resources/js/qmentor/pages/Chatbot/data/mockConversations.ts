import type { Conversation } from '../types';

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'استفسار عن المعدل التراكمي',
    titleEn: 'GPA Inquiry',
    lastMessage: 'معدلك التراكمي الحالي هو ٣.٢ من ٤.٠',
    lastMessageEn: 'Your current GPA is 3.2 out of 4.0',
    timestamp: '2026-04-12T10:30:00',
    pinned: true,
    archived: false,
    messages: [
      {
        id: 'msg-1-1',
        conversationId: 'conv-1',
        role: 'user',
        type: 'text',
        content: 'كم معدلي التراكمي؟',
        contentEn: 'What is my GPA?',
        timestamp: '2026-04-12T10:28:00',
        language: 'ar',
        status: 'read',
      },
      {
        id: 'msg-1-2',
        conversationId: 'conv-1',
        role: 'assistant',
        type: 'card',
        content: 'إليك ملخص معدلك التراكمي:',
        contentEn: 'Here is your GPA summary:',
        timestamp: '2026-04-12T10:28:15',
        language: 'ar',
        card: {
          title: 'المعدل التراكمي',
          titleEn: 'GPA Summary',
          items: [
            { label: 'المعدل التراكمي', labelEn: 'Cumulative GPA', value: '٣.٢٠', valueEn: '3.20' },
            { label: 'معدل الفصل الحالي', labelEn: 'Current Semester', value: '٣.٤٥', valueEn: '3.45' },
            { label: 'الساعات المكتسبة', labelEn: 'Earned Hours', value: '٨٩', valueEn: '89' },
            { label: 'التقدير', labelEn: 'Standing', value: 'جيد جداً', valueEn: 'Very Good' },
          ],
        },
        quickReplies: [
          { id: 'qr-1', label: 'كيف أرفع معدلي؟', labelEn: 'How to improve my GPA?' },
          { id: 'qr-2', label: 'عرض التفاصيل بالفصل', labelEn: 'Show semester breakdown' },
          { id: 'qr-3', label: 'ما المواد المتبقية؟', labelEn: 'What courses remain?' },
        ],
      },
      {
        id: 'msg-1-3',
        conversationId: 'conv-1',
        role: 'user',
        type: 'text',
        content: 'كيف أرفع معدلي؟',
        contentEn: 'How to improve my GPA?',
        timestamp: '2026-04-12T10:29:00',
        language: 'ar',
        status: 'read',
      },
      {
        id: 'msg-1-4',
        conversationId: 'conv-1',
        role: 'assistant',
        type: 'text',
        content: 'لرفع معدلك التراكمي، أنصحك بالتالي:\n\n١. التركيز على المواد ذات الساعات الأعلى - لأن تأثيرها أكبر على المعدل\n٢. إعادة المواد التي حصلت فيها على تقدير منخفض\n٣. الاستفادة من ساعات المذاكرة المشتركة\n٤. زيارة مركز الدعم الأكاديمي\n\nمعدلك الحالي ٣.٢ وهو جيد جداً. مع التركيز يمكنك الوصول إلى ٣.٥ بنهاية الفصل القادم.',
        contentEn: 'To improve your GPA, I recommend:\n\n1. Focus on high-credit courses — they have more impact on GPA\n2. Retake courses where you scored low\n3. Join study groups and peer tutoring sessions\n4. Visit the academic support center\n\nYour current GPA of 3.2 is Very Good. With focus, you could reach 3.5 by end of next semester.',
        timestamp: '2026-04-12T10:30:00',
        language: 'ar',
        quickReplies: [
          { id: 'qr-4', label: 'حدد لي موعد مع المرشد', labelEn: 'Schedule advisor meeting' },
          { id: 'qr-5', label: 'أرني مواد الإعادة المتاحة', labelEn: 'Show retake options' },
        ],
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'جدولي الدراسي',
    titleEn: 'My Class Schedule',
    lastMessage: 'لديك ٥ مواد هذا الفصل',
    lastMessageEn: 'You have 5 courses this semester',
    timestamp: '2026-04-11T14:20:00',
    pinned: false,
    archived: false,
    messages: [
      {
        id: 'msg-2-1',
        conversationId: 'conv-2',
        role: 'user',
        type: 'text',
        content: 'أرني جدولي الدراسي',
        contentEn: 'Show my class schedule',
        timestamp: '2026-04-11T14:18:00',
        language: 'ar',
        status: 'read',
      },
      {
        id: 'msg-2-2',
        conversationId: 'conv-2',
        role: 'assistant',
        type: 'list',
        content: 'إليك جدولك الدراسي للفصل الحالي:',
        contentEn: 'Here is your schedule for the current semester:',
        timestamp: '2026-04-11T14:18:20',
        language: 'ar',
        list: {
          title: 'الجدول الدراسي - الفصل الثاني ١٤٤٧',
          titleEn: 'Class Schedule - Spring 2026',
          rows: [
            { label: 'CS 301 - هندسة البرمجيات', labelEn: 'CS 301 - Software Engineering', description: 'أحد، ثلاثاء ١٠:٠٠-١١:٣٠ | قاعة ٢٠٥', descriptionEn: 'Sun, Tue 10:00-11:30 | Room 205' },
            { label: 'CS 320 - قواعد البيانات', labelEn: 'CS 320 - Database Systems', description: 'أحد، ثلاثاء ١٢:٠٠-١:٣٠ | قاعة ١٠٣', descriptionEn: 'Sun, Tue 12:00-1:30 | Room 103' },
            { label: 'MATH 203 - الإحصاء', labelEn: 'MATH 203 - Statistics', description: 'إثنين، أربعاء ٩:٠٠-١٠:٣٠ | قاعة ٤١٢', descriptionEn: 'Mon, Wed 9:00-10:30 | Room 412' },
            { label: 'CS 340 - الشبكات', labelEn: 'CS 340 - Computer Networks', description: 'إثنين، أربعاء ١١:٠٠-١٢:٣٠ | قاعة ٣٠١', descriptionEn: 'Mon, Wed 11:00-12:30 | Room 301' },
            { label: 'ENG 201 - الكتابة التقنية', labelEn: 'ENG 201 - Technical Writing', description: 'أربعاء ٢:٠٠-٤:٠٠ | قاعة ١١٨', descriptionEn: 'Wed 2:00-4:00 | Room 118' },
          ],
        },
        quickReplies: [
          { id: 'qr-6', label: 'هل يوجد تعارض؟', labelEn: 'Any conflicts?' },
          { id: 'qr-7', label: 'أضف إلى التقويم', labelEn: 'Add to calendar' },
        ],
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'البحث عن مدرس خصوصي',
    titleEn: 'Finding a Tutor',
    lastMessage: 'وجدت ٣ مدرسين متاحين لمادة الإحصاء',
    lastMessageEn: 'Found 3 available tutors for Statistics',
    timestamp: '2026-04-10T09:15:00',
    pinned: false,
    archived: false,
    messages: [
      {
        id: 'msg-3-1',
        conversationId: 'conv-3',
        role: 'user',
        type: 'text',
        content: 'أحتاج مدرس لمادة الإحصاء',
        contentEn: 'I need a tutor for Statistics',
        timestamp: '2026-04-10T09:14:00',
        language: 'ar',
        status: 'read',
      },
      {
        id: 'msg-3-2',
        conversationId: 'conv-3',
        role: 'assistant',
        type: 'list',
        content: 'وجدت المدرسين التالين المتاحين لمادة الإحصاء MATH 203:',
        contentEn: 'Found the following available tutors for Statistics MATH 203:',
        timestamp: '2026-04-10T09:15:00',
        language: 'ar',
        list: {
          title: 'مدرسون متاحون',
          titleEn: 'Available Tutors',
          rows: [
            { label: 'سلطان مالك', labelEn: 'Sultan Malek', description: 'معدل ٣.٨ | متاح أحد وثلاثاء ٣-٥ م | تقييم ٤.٩', descriptionEn: 'GPA 3.8 | Available Sun & Tue 3-5 PM | Rating 4.9' },
            { label: 'دانة فهد', labelEn: 'Dana Fahd', description: 'معدل ٣.٧ | متاح إثنين وأربعاء ٤-٦ م | تقييم ٤.٧', descriptionEn: 'GPA 3.7 | Available Mon & Wed 4-6 PM | Rating 4.7' },
            { label: 'بندر رشيد', labelEn: 'Bandar Rasheed', description: 'معدل ٣.٦ | متاح يومياً ٢-٤ م | تقييم ٤.٥', descriptionEn: 'GPA 3.6 | Available Daily 2-4 PM | Rating 4.5' },
          ],
        },
        quickReplies: [
          { id: 'qr-8', label: 'احجز مع سلطان', labelEn: 'Book with Sultan' },
          { id: 'qr-9', label: 'تفاصيل أكثر', labelEn: 'More details' },
        ],
      },
    ],
  },
  {
    id: 'conv-4',
    title: 'Academic Calendar Dates',
    titleEn: 'Academic Calendar Dates',
    lastMessage: 'Here are the key dates for this semester',
    lastMessageEn: 'Here are the key dates for this semester',
    timestamp: '2026-04-08T16:45:00',
    pinned: false,
    archived: true,
    messages: [
      {
        id: 'msg-4-1',
        conversationId: 'conv-4',
        role: 'user',
        type: 'text',
        content: 'When are the important dates this semester?',
        contentEn: 'When are the important dates this semester?',
        timestamp: '2026-04-08T16:44:00',
        language: 'en',
        status: 'read',
      },
      {
        id: 'msg-4-2',
        conversationId: 'conv-4',
        role: 'assistant',
        type: 'card',
        content: 'Here are the key academic dates:',
        contentEn: 'Here are the key academic dates:',
        timestamp: '2026-04-08T16:45:00',
        language: 'en',
        card: {
          title: 'التقويم الأكاديمي',
          titleEn: 'Academic Calendar',
          items: [
            { label: 'آخر يوم للحذف', labelEn: 'Last Drop Date', value: '١٥ أبريل ٢٠٢٦', valueEn: 'April 15, 2026' },
            { label: 'بداية الاختبارات النهائية', labelEn: 'Finals Start', value: '٢٥ مايو ٢٠٢٦', valueEn: 'May 25, 2026' },
            { label: 'نهاية الاختبارات', labelEn: 'Finals End', value: '٥ يونيو ٢٠٢٦', valueEn: 'June 5, 2026' },
            { label: 'إعلان النتائج', labelEn: 'Results Announced', value: '١٢ يونيو ٢٠٢٦', valueEn: 'June 12, 2026' },
          ],
        },
        quickReplies: [
          { id: 'qr-10', label: 'Set reminders', labelEn: 'Set reminders' },
          { id: 'qr-11', label: 'Download calendar', labelEn: 'Download calendar' },
        ],
      },
    ],
  },
];

export const quickActions = [
  { id: 'qa-gpa', icon: 'AcademicCapIcon', label: 'معدلي التراكمي', labelEn: 'Check my GPA', query: 'كم معدلي التراكمي؟', queryEn: 'What is my GPA?' },
  { id: 'qa-schedule', icon: 'CalendarDaysIcon', label: 'جدولي الدراسي', labelEn: 'Show my schedule', query: 'أرني جدولي الدراسي', queryEn: 'Show my class schedule' },
  { id: 'qa-tutor', icon: 'UsersIcon', label: 'ابحث عن مدرس', labelEn: 'Find a tutor', query: 'أحتاج مدرس خصوصي', queryEn: 'I need a tutor' },
  { id: 'qa-calendar', icon: 'ClockIcon', label: 'التقويم الأكاديمي', labelEn: 'Academic calendar', query: 'ما مواعيد التقويم الأكاديمي؟', queryEn: 'What are the academic calendar dates?' },
  { id: 'qa-advisor', icon: 'UserCircleIcon', label: 'تحدث مع المرشد', labelEn: 'Talk to my advisor', query: 'أريد التحدث مع مرشدي الأكاديمي', queryEn: 'I want to talk to my academic advisor' },
];

export function getMockResponse(query: string, lang: 'ar' | 'en'): Omit<import('../types').Message, 'id' | 'conversationId' | 'timestamp'> {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('معدل') || lowerQuery.includes('gpa')) {
    return {
      role: 'assistant',
      type: 'card',
      content: 'إليك ملخص معدلك التراكمي:',
      contentEn: 'Here is your GPA summary:',
      language: lang,
      card: {
        title: 'المعدل التراكمي',
        titleEn: 'GPA Summary',
        items: [
          { label: 'المعدل التراكمي', labelEn: 'Cumulative GPA', value: '٣.٢٠', valueEn: '3.20' },
          { label: 'معدل الفصل الحالي', labelEn: 'Current Semester', value: '٣.٤٥', valueEn: '3.45' },
          { label: 'الساعات المكتسبة', labelEn: 'Earned Hours', value: '٨٩', valueEn: '89' },
          { label: 'التقدير', labelEn: 'Standing', value: 'جيد جداً', valueEn: 'Very Good' },
        ],
      },
      quickReplies: [
        { id: 'qr-r1', label: 'كيف أرفع معدلي؟', labelEn: 'How to improve my GPA?' },
        { id: 'qr-r2', label: 'عرض التفاصيل بالفصل', labelEn: 'Show semester breakdown' },
      ],
    };
  }

  if (lowerQuery.includes('جدول') || lowerQuery.includes('schedule')) {
    return {
      role: 'assistant',
      type: 'list',
      content: 'إليك جدولك الدراسي للفصل الحالي:',
      contentEn: 'Here is your schedule for the current semester:',
      language: lang,
      list: {
        title: 'الجدول الدراسي',
        titleEn: 'Class Schedule',
        rows: [
          { label: 'CS 301 - هندسة البرمجيات', labelEn: 'CS 301 - Software Engineering', description: 'أحد، ثلاثاء ١٠:٠٠-١١:٣٠', descriptionEn: 'Sun, Tue 10:00-11:30' },
          { label: 'CS 320 - قواعد البيانات', labelEn: 'CS 320 - Database Systems', description: 'أحد، ثلاثاء ١٢:٠٠-١:٣٠', descriptionEn: 'Sun, Tue 12:00-1:30' },
          { label: 'MATH 203 - الإحصاء', labelEn: 'MATH 203 - Statistics', description: 'إثنين، أربعاء ٩:٠٠-١٠:٣٠', descriptionEn: 'Mon, Wed 9:00-10:30' },
          { label: 'CS 340 - الشبكات', labelEn: 'CS 340 - Computer Networks', description: 'إثنين، أربعاء ١١:٠٠-١٢:٣٠', descriptionEn: 'Mon, Wed 11:00-12:30' },
          { label: 'ENG 201 - الكتابة التقنية', labelEn: 'ENG 201 - Technical Writing', description: 'أربعاء ٢:٠٠-٤:٠٠', descriptionEn: 'Wed 2:00-4:00' },
        ],
      },
      quickReplies: [
        { id: 'qr-r3', label: 'هل يوجد تعارض؟', labelEn: 'Any conflicts?' },
        { id: 'qr-r4', label: 'أضف إلى التقويم', labelEn: 'Add to calendar' },
      ],
    };
  }

  if (lowerQuery.includes('مدرس') || lowerQuery.includes('tutor')) {
    return {
      role: 'assistant',
      type: 'list',
      content: 'وجدت المدرسين التالين المتاحين:',
      contentEn: 'Found the following available tutors:',
      language: lang,
      list: {
        title: 'مدرسون متاحون',
        titleEn: 'Available Tutors',
        rows: [
          { label: 'سلطان مالك', labelEn: 'Sultan Malek', description: 'معدل ٣.٨ | تقييم ٤.٩', descriptionEn: 'GPA 3.8 | Rating 4.9' },
          { label: 'دانة فهد', labelEn: 'Dana Fahd', description: 'معدل ٣.٧ | تقييم ٤.٧', descriptionEn: 'GPA 3.7 | Rating 4.7' },
          { label: 'بندر رشيد', labelEn: 'Bandar Rasheed', description: 'معدل ٣.٦ | تقييم ٤.٥', descriptionEn: 'GPA 3.6 | Rating 4.5' },
        ],
      },
      quickReplies: [
        { id: 'qr-r5', label: 'احجز جلسة', labelEn: 'Book a session' },
        { id: 'qr-r6', label: 'تفاصيل أكثر', labelEn: 'More details' },
      ],
    };
  }

  if (lowerQuery.includes('تقويم') || lowerQuery.includes('calendar') || lowerQuery.includes('مواعيد') || lowerQuery.includes('dates')) {
    return {
      role: 'assistant',
      type: 'card',
      content: 'إليك أهم مواعيد التقويم الأكاديمي:',
      contentEn: 'Here are the key academic dates:',
      language: lang,
      card: {
        title: 'التقويم الأكاديمي',
        titleEn: 'Academic Calendar',
        items: [
          { label: 'آخر يوم للحذف', labelEn: 'Last Drop Date', value: '١٥ أبريل ٢٠٢٦', valueEn: 'April 15, 2026' },
          { label: 'بداية الاختبارات', labelEn: 'Finals Start', value: '٢٥ مايو ٢٠٢٦', valueEn: 'May 25, 2026' },
          { label: 'نهاية الاختبارات', labelEn: 'Finals End', value: '٥ يونيو ٢٠٢٦', valueEn: 'June 5, 2026' },
          { label: 'إعلان النتائج', labelEn: 'Results', value: '١٢ يونيو ٢٠٢٦', valueEn: 'June 12, 2026' },
        ],
      },
      quickReplies: [
        { id: 'qr-r7', label: 'ذكرني قبل الموعد', labelEn: 'Set reminders' },
      ],
    };
  }

  if (lowerQuery.includes('مرشد') || lowerQuery.includes('advisor') || lowerQuery.includes('تحدث')) {
    return {
      role: 'assistant',
      type: 'escalation',
      content: 'سأقوم بتحويلك إلى مرشدك الأكاديمي د. عبدالله ناصر. المرشد متاح حالياً خلال ساعات العمل (٨ ص - ٤ م).\n\nيمكنك أيضاً حجز موعد مباشرة.',
      contentEn: 'I will connect you with your academic advisor Dr. Abdullah Nasser. The advisor is available during office hours (8 AM - 4 PM).\n\nYou can also book an appointment directly.',
      language: lang,
      quickReplies: [
        { id: 'qr-r8', label: 'احجز موعد', labelEn: 'Book appointment' },
        { id: 'qr-r9', label: 'أرسل رسالة', labelEn: 'Send message' },
      ],
    };
  }

  // Default response
  return {
    role: 'assistant',
    type: 'text',
    content: 'شكراً لسؤالك! أنا مساعدك الأكاديمي الذكي في QMentor. يمكنني مساعدتك في:\n\n• الاستفسار عن معدلك التراكمي\n• عرض جدولك الدراسي\n• البحث عن مدرسين\n• التقويم الأكاديمي\n• التواصل مع مرشدك\n\nكيف يمكنني مساعدتك؟',
    contentEn: 'Thank you for your question! I am your QMentor AI academic assistant. I can help you with:\n\n• Checking your GPA\n• Viewing your class schedule\n• Finding tutors\n• Academic calendar\n• Connecting with your advisor\n\nHow can I help you?',
    language: lang,
    quickReplies: [
      { id: 'qr-d1', label: 'معدلي التراكمي', labelEn: 'Check my GPA' },
      { id: 'qr-d2', label: 'جدولي الدراسي', labelEn: 'My schedule' },
      { id: 'qr-d3', label: 'ابحث عن مدرس', labelEn: 'Find a tutor' },
    ],
  };
}
