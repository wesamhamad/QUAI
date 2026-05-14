import { SkeletonCard, SkeletonTable, SkeletonChart, SkeletonText } from './SkeletonLoader';

/** Dashboard page skeleton: banner + grid of cards */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="h-36 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

/** Tab-based page skeleton: header + tab bar + content */
export function TabbedPageSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="h-4 w-80 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
      {/* Tab bar skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1.5">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`h-10 rounded-xl animate-pulse ${i === 0 ? 'w-24 bg-sa-200 dark:bg-sa-800' : 'w-20 bg-gray-100 dark:bg-gray-700'}`} />
          ))}
        </div>
      </div>
      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: cards }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

/** Detail page skeleton: sidebar + main content */
export function DetailPageSkeleton() {
  return (
    <div className="flex gap-6">
      <div className="hidden lg:block w-72 shrink-0 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
        ))}
      </div>
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-40 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-28 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonChart />
        <SkeletonTable rows={4} cols={5} />
      </div>
    </div>
  );
}

/** Chat page skeleton */
export function ChatSkeleton() {
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <div className="hidden lg:block w-72 shrink-0 border-e border-gray-200 dark:border-gray-700 p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
        ))}
      </div>
      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 space-y-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
              <div className={`h-16 rounded-2xl animate-pulse ${i % 2 === 0 ? 'w-2/3 bg-sa-100 dark:bg-sa-900' : 'w-1/2 bg-gray-200 dark:bg-gray-700'}`} />
            </div>
          ))}
        </div>
        <div className="mt-4 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    </div>
  );
}

/** Stats + table skeleton (e.g., Advisor Dashboard) */
export function DashboardWithTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="h-4 w-80 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SkeletonTable rows={6} cols={5} />
        </div>
        <div className="space-y-4">
          <SkeletonChart />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
