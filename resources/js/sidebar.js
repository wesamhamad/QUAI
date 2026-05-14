/**
 * QUAI Dashboard Sidebar Controller
 * Handles collapse/expand, mobile overlay, and keyboard shortcuts.
 */

const SIDEBAR_KEY = 'quai-sidebar-collapsed';

let sidebar = null;
let overlay = null;
let isMobile = false;

/**
 * Initialize sidebar behavior.
 * Call after DOM is ready.
 */
export function initSidebar() {
    sidebar = document.getElementById('sidebar');
    overlay = document.getElementById('sidebarOverlay');

    if (!sidebar) return;

    // Restore collapsed state on desktop
    const savedCollapsed = localStorage.getItem(SIDEBAR_KEY) === 'true';
    if (savedCollapsed && !isMobileView()) {
        sidebar.classList.add('collapsed');
    }

    // Bind collapse toggle
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    if (collapseBtn) {
        collapseBtn.addEventListener('click', toggleCollapse);
    }

    // Bind mobile hamburger
    const hamburger = document.getElementById('sidebarToggle');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileSidebar);
    }

    // Overlay click closes sidebar
    if (overlay) {
        overlay.addEventListener('click', closeMobileSidebar);
    }

    // Escape key closes mobile sidebar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
            closeMobileSidebar();
        }
    });

    // Listen for resize to auto-close mobile sidebar
    window.addEventListener('resize', handleResize);
    handleResize();
}

/**
 * Toggle sidebar collapsed state (desktop)
 */
function toggleCollapse() {
    if (isMobileView()) return;

    sidebar.classList.toggle('collapsed');
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem(SIDEBAR_KEY, isCollapsed);
}

/**
 * Toggle mobile sidebar
 */
function toggleMobileSidebar() {
    if (sidebar.classList.contains('mobile-open')) {
        closeMobileSidebar();
    } else {
        openMobileSidebar();
    }
}

/**
 * Open mobile sidebar with overlay
 */
function openMobileSidebar() {
    sidebar.classList.add('mobile-open');
    if (overlay) overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
}

/**
 * Close mobile sidebar
 */
function closeMobileSidebar() {
    sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
}

/**
 * Check if viewport is mobile
 */
function isMobileView() {
    return window.innerWidth < 768;
}

/**
 * Handle resize events
 */
function handleResize() {
    const wasMobile = isMobile;
    isMobile = isMobileView();

    // Close mobile sidebar when resizing to desktop
    if (wasMobile && !isMobile) {
        closeMobileSidebar();
    }
}
