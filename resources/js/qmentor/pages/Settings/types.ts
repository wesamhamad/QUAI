export interface UserProfile {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  role: 'student' | 'advisor' | 'admin';
  department: string;
  departmentEn: string;
  studentId: string;
  avatarUrl?: string;
}

export interface UserPreferences {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
    alerts: boolean;
    grades: boolean;
    appointments: boolean;
    announcements: boolean;
  };
  calendarIntegration: boolean;
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
  };
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  locationEn: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface FAQItem {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}

export interface SearchResult {
  id: string;
  type: 'student' | 'course' | 'page' | 'help';
  titleAr: string;
  titleEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
  href: string;
}

export type SettingsTab = 'profile' | 'preferences' | 'security' | 'help' | 'about';
