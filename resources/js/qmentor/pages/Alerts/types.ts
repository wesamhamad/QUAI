export type AlertSeverity = 'info' | 'warning' | 'urgent' | 'critical';
export type AlertStatus = 'active' | 'acknowledged' | 'dismissed' | 'escalated' | 'resolved';
export type AlertType = 'gpa_drop' | 'attendance' | 'deadline' | 'academic_warning' | 'registration' | 'financial' | 'agent_action' | 'system' | 'caseload' | 'intervention';
export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'push';
export type AlertRole = 'student' | 'advisor' | 'agent' | 'admin' | 'all';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  studentId: string;
  studentName: string;
  studentNameEn: string;
  timestamp: string;
  escalation?: EscalationEntry[];
  targetRole?: AlertRole;
}

export interface EscalationEntry {
  id: string;
  stage: 'triggered' | 'advisor_notified' | 'dean_notified' | 'vp_notified' | 'action_taken' | 'resolved';
  stageAr: string;
  stageEn: string;
  timestamp: string;
  actor: string;
  actorEn: string;
  note: string;
  noteEn: string;
}

export interface AlertPreference {
  type: AlertType;
  labelAr: string;
  labelEn: string;
  enabled: boolean;
  channels: {
    in_app: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  threshold?: number;
}

export interface AlertAnalyticsData {
  byType: { type: string; typeEn: string; count: number }[];
  severityOverTime: { month: string; monthEn: string; info: number; warning: number; urgent: number; critical: number }[];
  responseTime: { range: string; rangeEn: string; count: number }[];
  topIndicators: { indicator: string; indicatorEn: string; count: number }[];
  resolutionRates: { month: string; monthEn: string; resolved: number; pending: number; escalated: number }[];
}
