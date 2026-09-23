/**
 * Recovery for stale lazy-route chunks.
 *
 * After a rebuild the hashed chunk filenames change, so a tab that is still
 * running the previous build asks for a file that no longer exists the moment
 * the user navigates to a not-yet-loaded route ("Failed to fetch dynamically
 * imported module: .../index-XXXX.js"). The page shell itself is fine, so the
 * fix is simply to reload once and pick up the current manifest.
 */

const GUARD_KEY = 'qmentor:chunk-reload-at';
const GUARD_WINDOW_MS = 10_000;

export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '');

  return (
    /Failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /'text\/html' is not a valid JavaScript MIME type/i.test(message)
  );
}

/**
 * Reloads once per GUARD_WINDOW_MS so a genuinely broken deploy shows the
 * error boundary instead of looping the browser.
 */
export function reloadForStaleChunk(): boolean {
  try {
    const last = Number(sessionStorage.getItem(GUARD_KEY) ?? 0);
    if (Date.now() - last < GUARD_WINDOW_MS) return false;
    sessionStorage.setItem(GUARD_KEY, String(Date.now()));
  } catch {
    // Private mode / blocked storage: fall through and reload anyway.
  }

  window.location.reload();
  return true;
}

export function installChunkReloadHandler(): void {
  // Vite fires this for every failed preload of a lazy chunk.
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    reloadForStaleChunk();
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (isChunkLoadError(event.reason)) {
      event.preventDefault();
      reloadForStaleChunk();
    }
  });
}
