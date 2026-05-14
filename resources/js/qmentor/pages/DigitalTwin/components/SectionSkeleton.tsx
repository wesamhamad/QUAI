function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />;
}

export function ChartSkeleton() {
  return (
    <div className="space-y-3">
      <Pulse className="h-4 w-32" />
      <div className="flex items-end gap-2 h-40">
        {[40, 60, 35, 75, 50, 65, 45].map((h, i) => (
          <Pulse key={i} className="flex-1 rounded-t-lg" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <Pulse className="h-4 w-24 mb-3" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Pulse className="h-4 w-16" />
          <Pulse className="h-4 flex-1" />
          <Pulse className="h-4 w-12" />
          <Pulse className="h-4 w-10" />
        </div>
      ))}
    </div>
  );
}

export function GaugeSkeleton() {
  return (
    <div className="flex flex-col items-center">
      <Pulse className="w-24 h-24 rounded-full" />
      <Pulse className="h-3 w-16 mt-2" />
    </div>
  );
}

export function CardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
          <Pulse className="h-4 w-3/4" />
          <Pulse className="h-3 w-full" />
          <Pulse className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function TimelineSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Pulse className="w-3 h-3 rounded-full shrink-0 mt-1" />
          <div className="flex-1 space-y-2">
            <Pulse className="h-4 w-2/3" />
            <Pulse className="h-3 w-full" />
            <Pulse className="h-2 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SectionSkeleton({ type = 'chart' }: { type?: 'chart' | 'table' | 'gauge' | 'cards' | 'timeline' }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Pulse className="w-8 h-8 rounded-lg" />
        <Pulse className="h-5 w-32" />
      </div>
      {type === 'chart' && <ChartSkeleton />}
      {type === 'table' && <TableSkeleton />}
      {type === 'gauge' && (
        <div className="grid grid-cols-3 gap-4">
          <GaugeSkeleton />
          <GaugeSkeleton />
          <GaugeSkeleton />
        </div>
      )}
      {type === 'cards' && <CardsSkeleton />}
      {type === 'timeline' && <TimelineSkeleton />}
    </div>
  );
}
