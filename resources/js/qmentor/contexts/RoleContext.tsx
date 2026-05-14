import { createContext, useContext, useState, type ReactNode } from 'react';

export type Role = 'student' | 'agent' | 'advisor' | 'admin';

interface QmentorUser {
  id?: number;
  name?: string;
  email?: string;
  student_id?: string | null;
  user_type?: string | null;
  is_student?: boolean;
  is_faculty?: boolean;
  /** The plain "Admin" role — pinned to the read-only مدير view. */
  is_admin?: boolean;
  is_super_admin?: boolean;
}

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  /** True when the server has identified the user as a student.
   *  Students cannot switch roles — only super admins can. */
  canSwitchRole: boolean;
  /** True for the QMentor admin account — confined to the مدير view, read-only. */
  viewOnly: boolean;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

function getQmentorUser(): QmentorUser | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as { __qmentor_user?: QmentorUser }).__qmentor_user ?? null;
}

/** The plain "Admin" account (not a super admin) — pinned to the مدير view. */
function isAdminOnlyUser(user: QmentorUser | null): boolean {
  return !!user?.is_admin && !user?.is_super_admin;
}

/** Faculty who are not super admins are confined to the agent/advisor views —
 *  the student and admin roles are reserved for super admins. The plain admin
 *  account is handled separately ({@see isAdminOnlyUser}). */
function isFacultyOnlyUser(user: QmentorUser | null): boolean {
  return !!user?.is_faculty && !user?.is_super_admin && !user?.is_admin;
}

/** Whether a given role may be assumed by this user. */
function canAssumeRole(user: QmentorUser | null, role: Role): boolean {
  if (isAdminOnlyUser(user)) {
    return role === 'admin';
  }
  if (isFacultyOnlyUser(user)) {
    return role === 'agent' || role === 'advisor';
  }
  return true;
}

/** Resolve the initial role from the server-provided user, falling back to
 *  localStorage only for users that are allowed to switch roles. */
function resolveInitialRole(): Role {
  const user = getQmentorUser();

  // Students are pinned to the student role — ignore any localStorage carry-over.
  if (user?.is_student && !user?.is_super_admin && !user?.is_faculty) {
    return 'student';
  }

  // The plain admin account is pinned to the (read-only) مدير view.
  if (isAdminOnlyUser(user)) {
    return 'admin';
  }

  // Faculty actively impersonating a student see that student's dashboard.
  if (user?.is_faculty && user?.is_student && user?.student_id) {
    return 'student';
  }

  // Faculty (and super admins) may switch roles. Faculty defaults to advisor;
  // honor a previously-saved choice but drop a stale 'student' carry-over from
  // an earlier impersonation session, and never let faculty land on a role
  // reserved for super admins (e.g. a stale 'admin' from a prior session).
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('qmentor-role') as Role | null;
    if (stored && ['student', 'agent', 'advisor', 'admin'].includes(stored)) {
      if (stored === 'student' && user?.is_faculty && !user?.student_id) {
        localStorage.removeItem('qmentor-role');
      } else if (!canAssumeRole(user, stored)) {
        localStorage.removeItem('qmentor-role');
      } else {
        return stored;
      }
    }
  }

  // Default for faculty / super admins / unknown: advisor view.
  return 'advisor';
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const user = getQmentorUser();
  // Faculty impersonating a student is locked to that student's view; everyone
  // else who isn't a regular student can switch freely.
  const isImpersonating = !!(user?.is_faculty && user?.student_id);
  // The plain admin account is read-only and pinned to the مدير view.
  const viewOnly = isAdminOnlyUser(user);
  const canSwitchRole = (!!user?.is_super_admin || !user?.is_student) && !isImpersonating && !viewOnly;

  const [role, setRoleState] = useState<Role>(resolveInitialRole);

  const setRole = (newRole: Role) => {
    if (!canSwitchRole) return; // students, impersonating faculty and the admin account are pinned
    if (!canAssumeRole(user, newRole)) return; // faculty can't assume admin/student
    setRoleState(newRole);
    localStorage.setItem('qmentor-role', newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, canSwitchRole, viewOnly }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
