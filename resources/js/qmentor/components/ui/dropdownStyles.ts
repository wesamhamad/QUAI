/**
 * Shared dropdown / floating-menu styles.
 *
 * Aligned with the DGA unified design system ("كود المنصات الرقمية الحكومية"):
 * consistent corner radius and elevation, the green-primary selected state,
 * adequate touch targets, and keyboard-visible focus rings on every item and
 * trigger. All custom floating menus (role switcher, student switcher, global
 * search results) compose these constants so they stay visually identical.
 *
 * Layout-specific concerns (panel width, absolute positioning, z-index) stay
 * with each consumer — these constants only cover the shared visual treatment.
 */

/** Trigger button that opens a floating menu. */
export const dropdownTrigger =
  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium ' +
  'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ' +
  'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sa-500';

/** Floating panel container (visual treatment only). */
export const dropdownPanel =
  'rounded-xl border border-gray-200 dark:border-gray-700 ' +
  'bg-white dark:bg-gray-800 shadow-lg py-1.5';

/** Section / group header inside a panel. */
export const dropdownHeader =
  'px-3 py-2 text-[11px] font-semibold uppercase tracking-wide ' +
  'text-gray-400 dark:text-gray-500';

/**
 * Base styles for a clickable menu item. Consumers add their own alignment
 * (`items-center` / `items-start`) and horizontal padding (`px-3` for compact
 * menus, `px-4` for wider dialog lists) since item content varies.
 */
export const dropdownItemBase =
  'w-full flex gap-2.5 py-2.5 text-sm transition-colors ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sa-500';

/** Selected / active menu item. */
export const dropdownItemActive =
  'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-300 font-medium';

/** Idle menu item (with hover state). */
export const dropdownItemInactive =
  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';

/** Convenience helper: full item class string for a given active state. */
export function dropdownItem(active: boolean, align: 'center' | 'start' = 'center') {
  const alignment = align === 'start' ? 'items-start' : 'items-center';
  return `${dropdownItemBase} px-3 ${alignment} ${active ? dropdownItemActive : dropdownItemInactive}`;
}
