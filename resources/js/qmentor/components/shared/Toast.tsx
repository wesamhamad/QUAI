import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, description?: string, duration?: number) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const icons: Record<ToastType, typeof CheckCircleIcon> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

const colors: Record<ToastType, string> = {
  success: 'border-success-500 bg-success-100/80 dark:bg-success-500/10 text-success-600 dark:text-success-500',
  error: 'border-error-500 bg-error-100/80 dark:bg-error-500/10 text-error-600 dark:text-error-500',
  warning: 'border-warning-500 bg-warning-100/80 dark:bg-warning-500/10 text-warning-600 dark:text-warning-500',
  info: 'border-info-500 bg-info-100/80 dark:bg-info-500/10 text-info-600 dark:text-info-500',
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timeout = setTimeout(() => onDismiss(toast.id), toast.duration ?? 4000);
    return () => clearTimeout(timeout);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)] px-4 py-3 rounded-xl border-s-4 shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 ${colors[toast.type]}`}
      role="alert"
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 p-0.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label="Dismiss"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, description?: string, duration?: number) => {
    const id = `toast-${++counter}`;
    setToasts(prev => [...prev.slice(-4), { id, type, title, description, duration }]);
  }, []);

  const value: ToastContextValue = {
    toast: addToast,
    success: (title, desc) => addToast('success', title, desc),
    error: (title, desc) => addToast('error', title, desc),
    warning: (title, desc) => addToast('warning', title, desc),
    info: (title, desc) => addToast('info', title, desc),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 start-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem toast={t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
