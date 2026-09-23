import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import DigitalRecordProcess from './DigitalRecordProcess';

/**
 * سجلك الرقمي rendered inside the twin. The Blade page is the single source
 * of truth for the record (skills register + AI labour-market analysis), so
 * it is embedded as-is via `?embed=1`, which renders it without the app's
 * sidebar/topbar. A cold record can take 10–20s (fresh OpenAI analysis), so
 * the frame narrates the wait with the same pop-up the standalone page shows
 * on a full navigation — the embed layout drops that overlay with the rest of
 * the chrome, and a blank frame for twenty seconds reads as a broken tab.
 */
export default function DigitalRecordFrame({ studentId }: { studentId?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [skipped, setSkipped] = useState(false);
  // No student id (the student view): the page resolves the viewer's own record.
  const src = studentId
    ? `/digital-record?embed=1&student=${encodeURIComponent(studentId)}`
    : '/digital-record?embed=1';

  // A student switch is a fresh load: narrate it again rather than leaving the
  // previous student's record on screen with no sign that a new one is coming.
  useEffect(() => {
    setLoaded(false);
    setSkipped(false);
  }, [src]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">السجل الرقمي</h3>
        <a
          href={src.replace('embed=1&', '').replace('?embed=1', '')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-sa-600 dark:text-sa-400 hover:text-sa-700 dark:hover:text-sa-300"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          فتح في صفحة مستقلة
        </a>
      </div>

      <div className="relative" style={{ height: 'calc(100vh - 220px)', minHeight: 640 }}>
        {!loaded && !skipped && <div className="absolute inset-0 bg-white dark:bg-gray-800" />}
        <DigitalRecordProcess open={!loaded && !skipped} onSkip={() => setSkipped(true)} />
        <iframe
          src={src}
          title="السجل الرقمي"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
