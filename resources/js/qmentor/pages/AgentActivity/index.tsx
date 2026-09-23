import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import PageHeader from '../../components/shared/PageHeader';
import CohortProgress from './components/CohortProgress';
import FacultyRunner from './components/FacultyRunner';
import LiveOverview from './components/LiveOverview';

/**
 * مركز نشاط الوكيل — the chain's live progress and what the agent did,
 * read from its own tables (sync runs, approvals, alerts, the autonomy
 * matrix). The sample task list and simulated feed are gone.
 */
export default function AgentActivity() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <PageHeader
          title={t('مركز نشاط الوكيل الذكي', 'AI Agent Activity Center')}
          subtitle={t('حشد البيانات، التقييم، التنبيهات، طلبات الموافقة والتحليل — كما سجّلتها المنصة', 'Pre-load, scoring, alerts, approvals and analyses — as the platform recorded them')}
          accentColor="bg-sa-500"
          breadcrumbs={[{ label: t('الرئيسية', 'Home'), href: '/' }, { label: t('نشاط الوكيل', 'Agent Activity') }]}
          actions={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-sa-50 dark:bg-sa-950 border border-sa-200 dark:border-sa-800">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sa-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-sa-500" /></span>
              <Shield className="w-3.5 h-3.5 text-sa-600 dark:text-sa-400" />
              <span className="text-xs text-sa-700 dark:text-sa-300 font-medium">{t('يُقرأ من سجلات المنصة', 'Read from platform records')}</span>
            </motion.div>
          }
        />
        <CohortProgress />
        <FacultyRunner />
        <LiveOverview />
      </div>
    </div>
  );
}
