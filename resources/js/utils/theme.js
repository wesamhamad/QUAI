/**
 * QUAI Unified Theme Management
 * Uses `data-theme` attribute on <html> and localStorage key `quai-theme`.
 */

const THEME_KEY = 'quai-theme';

/**
 * Initialize theme from localStorage or system preference.
 * Should be called on DOMContentLoaded.
 */
export function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
        applyTheme(saved);
        return saved;
    }

    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDark ? 'dark' : 'light';
    applyTheme(theme);
    return theme;
}

/**
 * Toggle between light and dark themes.
 * Returns the new theme name.
 */
export function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    return next;
}

/**
 * Get current theme
 */
export function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
}

/**
 * Apply a specific theme
 */
export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update theme toggle icon if present
    updateToggleIcon(theme);
}

/**
 * Update the sun/moon icons on theme toggle button(s)
 */
function updateToggleIcon(theme) {
    const sunIcons = document.querySelectorAll('.q-icon-sun');
    const moonIcons = document.querySelectorAll('.q-icon-moon');

    sunIcons.forEach(el => {
        el.style.display = theme === 'dark' ? 'block' : 'none';
    });
    moonIcons.forEach(el => {
        el.style.display = theme === 'dark' ? 'none' : 'block';
    });
}

/**
 * Bind theme toggle to a button element
 */
export function bindThemeToggle(selector) {
    const btn = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!btn) return;

    btn.addEventListener('click', () => {
        toggleTheme();
    });
}
