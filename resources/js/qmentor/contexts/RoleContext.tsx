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
  is_super_admin?: boolean;
}

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  /** True when the server has identified the user as a student.
   *  Students cannot switch roles — only super admins can. */
  canSwitchRole: boolean;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

function getQmentorUser(): QmentorUser | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as { __qmentor_user?: QmentorUser }).__qmentor_user ?? null;
}

/** Resolve the initial role from the server-provided user, falling back to
 *  localStorage only for users that are allowed to switch roles. */
function resolveInitialRole(): Role {
  const user = getQmentorUser();

  // Students are pinned to the student role — ignore any localStorage carry-over.
  if (user?.is_student && !user?.is_super_admin && !user?.is_faculty) {
    return 'student';
  }

  // Faculty actively impersonating a student see that student's dashboard.
  if (user?.is_faculty && user?.is_student && user?.student_id) {
    return 'student';
  }

  // Faculty (and super admins) may switch roles. Faculty defaults to advisor;
  // honor a previously-saved choice but drop a stale 'student' carry-over from
  // an earlier impersonation session.
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('qmentor-role') as Role | null;
    if (stored && ['student', 'agent', 'advisor', 'admin'].includes(stored)) {
      if (stored === 'student' && user?.is_faculty && !user?.student_id) {
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
  const canSwitchRole = (!!user?.is_super_admin || !user?.is_student) && !isImpersonating;

  const [role, setRoleState] = useState<Role>(resolveInitialRole);

  const setRole = (newRole: Role) => {
    if (!canSwitchRole) return; // students and impersonating faculty are pinned
    setRoleState(newRole);
    localStorage.setItem('qmentor-role', newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, canSwitchRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
