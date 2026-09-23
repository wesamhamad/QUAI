import type { Role } from '../contexts/RoleContext';

// The pages written in the second person to one student (حالة المخاطر،
// جدولي، تواصل مع مرشدي، خطتي…). Nobody else reads them: an admin reading
// «جدولك الأسبوعي» is reading nobody's.
const STUDENT_ONLY = ['/student-dashboard', '/indicator-detail', '/action-plan', '/schedule', '/contact-advisor', '/study-plan'];

// What each seat may open. The server scopes the DATA behind every page by
// the same model (student: self; instructor: TaughtRoster; advisor:
// AdviseeDirectory; admin: everything) — this only decides which screens are
// offered. Decided 2026-09-16.
const roleRoutes: Record<Role, string[] | '*'> = {
  // The student: their own pages, their twin and alerts, the chatbot.
  student: ['/', ...STUDENT_ONLY, '/grades', '/digital-twin', '/alerts', '/chatbot', '/peer-tutoring', '/recovery', '/mobile', '/settings'],
  // The instructor: «طلاب مقرراتي» and the twin of any of them, alerts.
  instructor: ['/', '/instructor', '/digital-twin', '/alerts', '/peer-tutoring', '/settings'],
  // The advisor: their caseload desk (with the at-risk and recovery tabs),
  // one advisee's plan, the twin, alerts.
  advisor: ['/', '/advisor-dashboard', '/advisee', '/digital-twin', '/alerts', '/recovery', '/peer-tutoring', '/settings'],
  // The admin (product owner) sees what the university sees — every board,
  // the operations of the agent — and the chatbot. Not the student's
  // second-person pages, and not the seat-scoped desks («طلاب مقرراتي»،
  // «طلابي»): an admin has no taught roster and no caseload of their own.
  // The demo build keeps its own boards for the admin too: faculty, benchmarking, recovery, peer tutoring, mobile previews.
  admin: ['/', '/agent-core', '/digital-twin', '/risk-analytics', '/at-risk', '/faculty', '/benchmarking', '/recovery', '/peer-tutoring', '/mobile', '/alerts', '/chatbot', '/agent-activity', '/system-usage', '/settings'],
};

export function canAccess(role: Role, path: string): boolean {
  const routes = roleRoutes[role];
  if (routes === '*') return true;
  return routes.includes(path);
}

export function getAccessibleRoutes(role: Role): string[] | '*' {
  return roleRoutes[role];
}
