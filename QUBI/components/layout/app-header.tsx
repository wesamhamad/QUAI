"use client";

import { ChevronLeft } from "lucide-react";

interface AppHeaderProps {
  breadcrumbs?: { label: string; href?: string }[];
}

export function AppHeader({ breadcrumbs = [{ label: "لوحة البيانات" }] }: AppHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-dga-gray-200 bg-white px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronLeft className="h-3.5 w-3.5 text-dga-gray-400" />}
            {crumb.href ? (
              <a
                href={crumb.href}
                className="text-dga-gray-500 hover:text-dga-gray-900 transition-colors"
              >
                {crumb.label}
              </a>
            ) : (
              <span className="font-medium text-dga-gray-900">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* User area */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dga-primary-100 text-sm font-medium text-dga-primary-700">
          م
        </div>
      </div>
    </header>
  );
}
