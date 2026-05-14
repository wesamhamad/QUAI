import {
  HeartIcon,
  PencilSquareIcon,
  AcademicCapIcon,
  BanknotesIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  PhoneIcon,
  ClockIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import type { SupportResource } from '../types';

interface Props {
  resources: SupportResource[];
}

const iconMap: Record<string, typeof HeartIcon> = {
  counseling: HeartIcon,
  writing: PencilSquareIcon,
  tutoring: AcademicCapIcon,
  financial: BanknotesIcon,
  career: BriefcaseIcon,
  health: BuildingOffice2Icon,
};

const colorMap: Record<string, { bg: string; text: string }> = {
  counseling: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' },
  writing: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  tutoring: { bg: 'bg-sa-100 dark:bg-sa-900/30', text: 'text-sa-600 dark:text-sa-400' },
  financial: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
  career: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  health: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
};

export default function SupportResources({ resources }: Props) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map(resource => {
          const Icon = iconMap[resource.iconType] || BuildingOffice2Icon;
          const colors = colorMap[resource.iconType] || colorMap.health;

          return (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.text}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t(resource.titleAr, resource.titleEn)}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {t(resource.descriptionAr, resource.descriptionEn)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span dir="ltr">{t(resource.contactAr, resource.contactEn)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{t(resource.hoursAr, resource.hoursEn)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{t(resource.locationAr, resource.locationEn)}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
