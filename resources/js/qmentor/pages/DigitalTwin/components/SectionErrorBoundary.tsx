import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  sectionName: string;
}

interface State {
  hasError: boolean;
}

export default class SectionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-error-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-error-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              تعذر تحميل {this.props.sectionName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">حدث خطأ غير متوقع</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sa-600 dark:text-sa-400 bg-sa-50 dark:bg-sa-900/30 rounded-lg hover:bg-sa-100 dark:hover:bg-sa-900/50 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              إعادة المحاولة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
