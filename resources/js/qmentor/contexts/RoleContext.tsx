import { createContext, useContext, useState, type ReactNode } from 'react';

/**
 * The four seats at the table:
 *   student    — their own record only.
 *   instructor — a faculty member as teacher: the students in the sections
 *                they teach this term (TaughtRoster on the server).
 *   advisor    — the same faculty member as academic advisor: their assigned
 *                advisees (AdviseeDirectory on the server).
 *   admin      — the super admin: everything.
 *
 * A faculty member who both teaches and advises switches between the two
 * middle seats; the server says which apply (teaches_count / advises_count).
 */
export type Role = 'student' | 'instructor' | 'advisor' | 'admin';

const ALL_ROLES: Role[] = ['student', 'instructor', 'advisor', 'admin'];

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
  teaches_count?: number;
  advises_count?: number;
}

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  /** Whether the switcher is shown at all: super admins (any role) and
   *  faculty who both teach and advise (instructor ↔ advisor). */
  canSwitchRole: boolean;
  /** True for the QMentor admin account — confined to the مدير view, read-only. */
  viewOnly: boolean;
  /** The roles this person may switch to. */
  allowedRoles: Role[];
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

/** The roles the server-identified user may wear. */
function resolveAllowedRoles(user: QmentorUser | null): Role[] {
  // Super admins (and unauthenticated previews) may pick any role.
  if (!user || user.is_super_admin) return ALL_ROLES;
  if (!user.is_student && !user.is_faculty && !user.is_admin) return ALL_ROLES;

  // The plain admin account is pinned to the (read-only) مدير view.
  if (isAdminOnlyUser(user)) return ['admin'];

  // Faculty actively impersonating a student (?as=) see that student's dashboard.
  if (user.is_faculty && user.is_student && user.student_id) return ['student'];

  // Students are pinned: the role decides whose records the screens ask for.
  if (user.is_student && !user.is_faculty) return ['student'];

  // Faculty: one seat per hat they actually hold. A faculty member with
  // neither list (nothing synced yet) still gets the instructor seat, so the
  // app opens on an honest empty roster rather than on nothing.
  const roles: Role[] = [];
  if ((user.teaches_count ?? 0) > 0 || (user.advises_count ?? 0) === 0) roles.push('instructor');
  if ((user.advises_count ?? 0) > 0) roles.push('advisor');
  return roles;
}

/** Resolve the initial role from the server-provided user, honouring a saved
 *  choice only when it is one of the roles this person may wear. */
function resolveInitialRole(allowed: Role[]): Role {
  const user = getQmentorUser();

  if (typeof window !== 'undefined' && allowed.length > 1) {
    const stored = localStorage.getItem('qmentor-role') as Role | null;
    if (stored && allowed.includes(stored)) return stored;
    if (stored) localStorage.removeItem('qmentor-role');
  }

  if (allowed.length === 1) return allowed[0];

  // Faculty with both hats land on the advisor desk; super admins default there too.
  if (user?.is_faculty && !user?.is_super_admin) {
    return (user.advises_count ?? 0) > 0 ? 'advisor' : 'instructor';
  }

  return 'advisor';
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const user = getQmentorUser();
  const allowedRoles = resolveAllowedRoles(user);
  // The plain admin account is read-only and pinned to the مدير view.
  const viewOnly = isAdminOnlyUser(user);
  const canSwitchRole = allowedRoles.length > 1;

  const [role, setRoleState] = useState<Role>(() => resolveInitialRole(allowedRoles));

  const setRole = (newRole: Role) => {
    if (!canSwitchRole || !allowedRoles.includes(newRole)) return; // pinned, or not a seat this person holds
    setRoleState(newRole);
    localStorage.setItem('qmentor-role', newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, canSwitchRole, allowedRoles, viewOnly }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
