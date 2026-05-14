import type { TaskExecutionHistory } from '../types';

export const executionHistory: TaskExecutionHistory[] = [
  { date: 'Apr 1', completed: 4120, failed: 12, alerts: 145 },
  { date: 'Apr 2', completed: 4350, failed: 8, alerts: 167 },
  { date: 'Apr 3', completed: 3980, failed: 15, alerts: 134 },
  { date: 'Apr 4', completed: 4210, failed: 6, alerts: 178 },
  { date: 'Apr 5', completed: 4560, failed: 9, alerts: 201 },
  { date: 'Apr 6', completed: 1890, failed: 3, alerts: 56 },
  { date: 'Apr 7', completed: 2340, failed: 5, alerts: 78 },
  { date: 'Apr 8', completed: 4670, failed: 11, alerts: 189 },
  { date: 'Apr 9', completed: 4890, failed: 7, alerts: 234 },
  { date: 'Apr 10', completed: 5120, failed: 4, alerts: 312 },
  { date: 'Apr 11', completed: 4780, failed: 10, alerts: 198 },
  { date: 'Apr 12', completed: 5340, failed: 6, alerts: 267 },
  { date: 'Apr 13', completed: 3890, failed: 8, alerts: 156 },
];

export const categoryPerformance = [
  { category: 'Data Collection', categoryAr: 'جمع البيانات', successRate: 99.2, avgResponse: 12, tasksToday: 909 },
  { category: 'Risk Assessment', categoryAr: 'تقييم المخاطر', successRate: 97.8, avgResponse: 25, tasksToday: 2499 },
  { category: 'Low/Med Alerts', categoryAr: 'تنبيهات منخفضة', successRate: 96.5, avgResponse: 4, tasksToday: 355 },
  { category: 'High Alerts', categoryAr: 'تنبيهات عالية', successRate: 95.2, avgResponse: 8, tasksToday: 51 },
  { category: 'Critical Alerts', categoryAr: 'تنبيهات حرجة', successRate: 98.0, avgResponse: 3, tasksToday: 6 },
  { category: 'Chatbot', categoryAr: 'المحادثة الذكية', successRate: 96.1, avgResponse: 4, tasksToday: 1343 },
  { category: 'Study Plan', categoryAr: 'الخطة الدراسية', successRate: 93.4, avgResponse: 9, tasksToday: 537 },
  { category: 'Administration', categoryAr: 'الإدارة', successRate: 99.1, avgResponse: 45, tasksToday: 1751 },
];

export const responseTimeTrend = [
  { time: '00:00', avgMs: 450, p95Ms: 1200 },
  { time: '02:00', avgMs: 380, p95Ms: 980 },
  { time: '04:00', avgMs: 320, p95Ms: 850 },
  { time: '06:00', avgMs: 520, p95Ms: 1400 },
  { time: '08:00', avgMs: 890, p95Ms: 2100 },
  { time: '10:00', avgMs: 1200, p95Ms: 2800 },
  { time: '12:00', avgMs: 980, p95Ms: 2400 },
  { time: '14:00', avgMs: 1100, p95Ms: 2600 },
  { time: '16:00', avgMs: 850, p95Ms: 2000 },
  { time: '18:00', avgMs: 620, p95Ms: 1500 },
  { time: '20:00', avgMs: 480, p95Ms: 1100 },
  { time: '22:00', avgMs: 410, p95Ms: 950 },
];
