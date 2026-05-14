import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, CheckCircle, AlertTriangle, Zap, Activity, Clock } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { allTasks } from '../data/agentTasks';

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <>{count.toLocaleString()}</>;
}

export default function HeaderStats() {
  const { t } = useLanguage();

  const totalTasks = allTasks.length;
  const autonomousCount = allTasks.filter(task => task.mode === 'autonomous').length;
  const humanRequiredCount = allTasks.filter(task => task.mode === 'human_approves' || task.mode === 'human_only').length;
  const activeCount = allTasks.filter(task => task.status === 'running').length;
  const successRate = 97.3;

  const stats = [
    {
      icon: Bot,
      valueNum: totalTasks,
      labelAr: 'إجمالي المهام',
      labelEn: 'Total Tasks',
    },
    {
      icon: Zap,
      valueNum: autonomousCount,
      labelAr: 'مستقلة بالكامل',
      labelEn: 'Autonomous',
    },
    {
      icon: AlertTriangle,
      valueNum: humanRequiredCount,
      labelAr: 'تحتاج بشري',
      labelEn: 'Human Required',
    },
    {
      icon: CheckCircle,
      valueNum: successRate,
      suffix: '%',
      labelAr: 'معدل النجاح',
      labelEn: 'Success Rate',
    },
    {
      icon: Activity,
      valueNum: activeCount,
      labelAr: 'مهام نشطة',
      labelEn: 'Active Now',
      pulse: true,
    },
    {
      icon: Clock,
      valueNum: 1247,
      labelAr: 'مكتملة اليوم',
      labelEn: 'Completed Today',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow border-t-2 border-t-sa-500"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-sa-50 dark:bg-sa-950">
                <Icon className="w-4 h-4 text-sa-600 dark:text-sa-400" />
              </div>
              {stat.pulse && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sa-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sa-500" />
                </span>
              )}
            </div>

            <p className="text-2xl font-bold text-sa-700 dark:text-sa-300">
              <AnimatedCounter target={stat.valueNum} />
              {stat.suffix || ''}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
              {t(stat.labelAr, stat.labelEn)}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
