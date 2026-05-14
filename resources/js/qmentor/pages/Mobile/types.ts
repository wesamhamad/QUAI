export interface ScreenAuditItem {
  id: string;
  nameAr: string;
  nameEn: string;
  path: string;
  mobile: 'pass' | 'warn' | 'fail';
  tablet: 'pass' | 'warn' | 'fail';
  desktop: 'pass' | 'warn' | 'fail';
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  textAr: string;
  textEn: string;
  time: string;
  type?: 'text' | 'button' | 'image';
  buttons?: { labelAr: string; labelEn: string }[];
}

export interface PushNotification {
  id: string;
  platform: 'ios' | 'android';
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  appName: string;
  time: string;
  icon: 'grade' | 'attendance' | 'advisor' | 'deadline';
}

export interface SMSMessage {
  id: string;
  sender: string;
  textAr: string;
  textEn: string;
  time: string;
}

export type MobileTab = 'audit' | 'nav' | 'whatsapp' | 'telegram' | 'push' | 'sms';
