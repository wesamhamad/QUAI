import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { RoleProvider } from './contexts/RoleContext';
import { ToastProvider } from './components/shared/Toast';
import './styles/qmentor.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const basename = window.location.pathname.startsWith('/qspark-plus')
  ? '/qspark-plus'
  : '/qmentor';

ReactDOM.createRoot(document.getElementById('qmentor-app')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <ThemeProvider>
            <RoleProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </RoleProvider>
          </ThemeProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Dismiss the blade-level page-loader overlay the moment the SPA has
// committed its first frame — on mobile, `window.load` can stay pending for
// many seconds behind external fonts / large chunks, leaving the overlay
// stuck on top of an already-rendered dashboard.
requestAnimationFrame(() => {
  (window as unknown as { __qHidePageLoader?: () => void }).__qHidePageLoader?.();
});
