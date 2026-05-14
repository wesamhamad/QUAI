import type { Role } from '../contexts/RoleContext';

const roleRoutes: Record<Role, string[] | '*'> = {
  student: ['/', '/student-dashboard', '/indicator-detail', '/action-plan', '/chatbot', '/schedule', '/contact-advisor', '/study-plan', '/grades', '/settings'],
  agent: ['/', '/digital-twin', '/risk-analytics', '/alerts', '/chatbot', '/study-plan', '/agent-activity'],
  advisor: ['/', '/digital-twin', '/advisor-dashboard', '/risk-analytics', '/faculty', '/alerts', '/chatbot', '/peer-tutoring', '/recovery', '/settings'],
  admin: '*',
};

export function canAccess(role: Role, path: string): boolean {
  const routes = roleRoutes[role];
  if (routes === '*') return true;
  return routes.includes(path);
}

export function getAccessibleRoutes(role: Role): string[] | '*' {
  return roleRoutes[role];
}
