import './bootstrap';
import { initTheme } from './utils/theme';
import { initSidebar } from './sidebar';

// Initialize theme immediately (before full DOM load to prevent flash)
initTheme();

// Initialize sidebar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
});
