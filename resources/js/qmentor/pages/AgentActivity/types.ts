export type AutonomyMode = 'autonomous' | 'agent_notify' | 'human_approves' | 'human_only';
export type TaskStatus = 'running' | 'completed' | 'scheduled' | 'idle' | 'failed';
export type ActivityType = 'success' | 'info' | 'warning' | 'alert';

export interface AgentTask {
  id: number;
  name: string;
  nameAr: string;
  category: string;
  mode: AutonomyMode;
  status: TaskStatus;
  frequency: string;
  frequencyAr: string;
  lastExecution: string;
  countToday: number;
  dataSources: string[];
  description: string;
  descriptionAr: string;
  successRate?: number;
  avgDuration?: string;
}

export interface TaskCategoryConfig {
  key: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
}

export interface TaskCategory extends TaskCategoryConfig {
  tasks: AgentTask[];
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  taskId: number;
  taskName: string;
  taskNameAr: string;
  category: string;
  categoryColor: string;
  studentName?: string;
  studentNameAr?: string;
  message: string;
  messageAr: string;
  type: ActivityType;
  autonomyMode: AutonomyMode;
  duration?: string;
  details?: string;
  detailsAr?: string;
}

export interface AutonomyStat {
  mode: AutonomyMode;
  count: number;
  percentage: number;
  labelAr: string;
  labelEn: string;
  color: string;
  icon: string;
}

export interface DailyActivity {
  day: string;
  tasks: number;
  alerts: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TaskExecutionHistory {
  date: string;
  completed: number;
  failed: number;
  alerts: number;
}

export type FilterCategory = string | 'all';
export type FilterMode = AutonomyMode | 'all';
export type FilterStatus = TaskStatus | 'all';
