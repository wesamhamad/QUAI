import { useMemo, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { PencilIcon, CheckIcon, XMarkIcon, CameraIcon } from '@heroicons/react/24/outline';
import { useStudentProfile } from '../../hooks/useStudentData';
import type { UserProfile as UserProfileType } from './types';

interface ApiProfileShape {
  profile?: {
    name?: string;
    name_en?: string;
    email?: string;
    student_id?: string;
    major?: { name?: string; name_en?: string };
    faculty?: { name?: string; name_en?: string };
  };
}

interface QmentorWindowUser {
  name?: string;
  email?: string;
  student_id?: string | null;
  user_type?: string | null;
}

/** Resolve the displayed profile from (in order): the API /me response,
 *  the window.__qmentor_user object set by Blade, and finally a placeholder
 *  so the UI doesn't crash on first paint. */
function resolveProfile(api: ApiProfileShape | null): UserProfileType {
  const apiProfile = api?.profile ?? null;
  const winUser = (typeof window !== 'undefined'
    ? (window as unknown as { __qmentor_user?: QmentorWindowUser }).__qmentor_user
    : undefined) ?? {};

  const role: UserProfileType['role'] =
    winUser.user_type === 'admin' ? 'admin'
    : winUser.user_type === 'advisor' || winUser.user_type === 'instructor' ? 'advisor'
    : 'student';

  return {
    id: apiProfile?.student_id ?? winUser.student_id ?? '—',
    name: apiProfile?.name ?? winUser.name ?? '—',
    nameEn: apiProfile?.name_en ?? winUser.name ?? '—',
    email: apiProfile?.email ?? winUser.email ?? '—',
    role,
    department: apiProfile?.faculty?.name ?? '—',
    departmentEn: apiProfile?.faculty?.name_en ?? '—',
    studentId: apiProfile?.student_id ?? winUser.student_id ?? '—',
  };
}

const roleLabels: Record<UserProfileType['role'], { ar: string; en: string }> = {
  student: { ar: 'طالب', en: 'Student' },
  advisor: { ar: 'مرشد أكاديمي', en: 'Academic Advisor' },
  admin: { ar: 'مدير النظام', en: 'Administrator' },
};

export default function UserProfile() {
  const { t } = useLanguage();
  const profileResult = useStudentProfile<ApiProfileShape | null>(null);

  const resolved = useMemo(
    () => resolveProfile(profileResult.source === 'api' ? profileResult.data : null),
    [profileResult.source, profileResult.data]
  );

  const [profile, setProfile] = useState<UserProfileType>(resolved);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfileType>(resolved);

  // Sync state when the underlying API data lands (or changes user).
  useMemo(() => {
    if (!editing) {
      setProfile(resolved);
      setDraft(resolved);
    }
  }, [resolved, editing]);

  function handleSave() {
    setProfile(draft);
    setEditing(false);
    localStorage.setItem('qmentor-profile', JSON.stringify(draft));
  }

  function handleCancel() {
    setDraft(profile);
    setEditing(false);
  }

  return (
    <div className="space-y-6">
      {/* Avatar & Name Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('الملف الشخصي', 'User Profile')}
          </h3>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-sa-600 dark:text-sa-400 hover:bg-sa-50 dark:hover:bg-sa-950 transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              {t('تعديل', 'Edit')}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-sa-500 text-white hover:bg-sa-600 transition-colors"
              >
                <CheckIcon className="w-4 h-4" />
                {t('حفظ', 'Save')}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
                {t('إلغاء', 'Cancel')}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sa-500 to-sa-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {profile.name[0]}
            </div>
            {editing && (
              <button className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <CameraIcon className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label={t('الاسم', 'Name')}
                value={editing ? draft.name : profile.name}
                editing={editing}
                onChange={v => setDraft({ ...draft, name: v })}
              />
              <Field
                label={t('الاسم بالإنجليزية', 'Name (English)')}
                value={editing ? draft.nameEn : profile.nameEn}
                editing={editing}
                onChange={v => setDraft({ ...draft, nameEn: v })}
              />
              <Field
                label={t('البريد الإلكتروني', 'Email')}
                value={profile.email}
                editing={false}
              />
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('الدور', 'Role')}
                </label>
                <div className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-900 dark:text-white">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sa-100 text-sa-700 dark:bg-sa-900/30 dark:text-sa-300">
                    {t(roleLabels[profile.role].ar, roleLabels[profile.role].en)}
                  </span>
                </div>
              </div>
              <Field
                label={t('القسم', 'Department')}
                value={editing ? draft.department : profile.department}
                editing={editing}
                onChange={v => setDraft({ ...draft, department: v })}
              />
              <Field
                label={t('الرقم الجامعي', 'Student ID')}
                value={profile.studentId}
                editing={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </label>
      {editing && onChange ? (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-sa-500 focus:border-transparent outline-none transition-colors"
        />
      ) : (
        <div className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-900 dark:text-white">
          {value}
        </div>
      )}
    </div>
  );
}
