import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, DevicePhoneMobileIcon, DeviceTabletIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { screenAuditData } from './data/mockMessageData';

interface ResponsiveAuditProps {
  t: (ar: string, en: string) => string;
}

function StatusBadge({ status }: { status: 'pass' | 'warn' | 'fail' }) {
  if (status === 'pass') return <CheckCircleIcon className="w-5 h-5 text-emerald-500" />;
  if (status === 'warn') return <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />;
  return <XCircleIcon className="w-5 h-5 text-red-500" />;
}

export default function ResponsiveAudit({ t }: ResponsiveAuditProps) {
  const passCount = screenAuditData.filter(s => s.mobile === 'pass' && s.tablet === 'pass' && s.desktop === 'pass').length;
  const total = screenAuditData.length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: DevicePhoneMobileIcon, label: t('الجوال (375px)', 'Mobile (375px)'), count: screenAuditData.filter(s => s.mobile === 'pass').length },
          { icon: DeviceTabletIcon, label: t('الجهاز اللوحي (768px)', 'Tablet (768px)'), count: screenAuditData.filter(s => s.tablet === 'pass').length },
          { icon: ComputerDesktopIcon, label: t('سطح المكتب (1280px)', 'Desktop (1280px)'), count: screenAuditData.filter(s => s.desktop === 'pass').length },
        ].map((item) => (
          <div key={item.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sa-50 dark:bg-sa-950">
              <item.icon className="w-6 h-6 text-sa-600 dark:text-sa-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{item.count}/{total}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('التقدم الكلي', 'Overall Progress')}</span>
          <span className="text-sm font-bold text-sa-600 dark:text-sa-400">{Math.round((passCount / total) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div className="bg-sa-500 h-2.5 rounded-full transition-all" style={{ width: `${(passCount / total) * 100}%` }} />
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <th className="px-4 py-3 text-start text-gray-600 dark:text-gray-400 font-medium">{t('الشاشة', 'Screen')}</th>
                <th className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 font-medium">
                  <DevicePhoneMobileIcon className="w-4 h-4 mx-auto" />
                </th>
                <th className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 font-medium">
                  <DeviceTabletIcon className="w-4 h-4 mx-auto" />
                </th>
                <th className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 font-medium">
                  <ComputerDesktopIcon className="w-4 h-4 mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {screenAuditData.map((screen) => (
                <tr key={screen.id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900 dark:text-white">{t(screen.nameAr, screen.nameEn)}</span>
                    <span className="block text-xs text-gray-400">{screen.path}</span>
                  </td>
                  <td className="px-4 py-3 text-center"><div className="flex justify-center"><StatusBadge status={screen.mobile} /></div></td>
                  <td className="px-4 py-3 text-center"><div className="flex justify-center"><StatusBadge status={screen.tablet} /></div></td>
                  <td className="px-4 py-3 text-center"><div className="flex justify-center"><StatusBadge status={screen.desktop} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
