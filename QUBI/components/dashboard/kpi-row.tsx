"use client";

import { StatCard } from "@/components/ui/stat-card";
import {
  BarChart3,
  TrendingUp,
  Database,
  Hash,
  Percent,
  Activity,
} from "lucide-react";
import type { KPIConfig } from "@/lib/types";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "bar-chart": BarChart3,
  "trending-up": TrendingUp,
  database: Database,
  hash: Hash,
  percent: Percent,
  activity: Activity,
};

interface KPIRowProps {
  kpis: KPIConfig[];
  className?: string;
}

export function KPIRow({ kpis, className }: KPIRowProps) {
  return (
    <section aria-label="Key performance indicators" className={className}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {kpis.map((kpi, i) => (
          <StatCard
            key={i}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon ? ICON_MAP[kpi.icon] : undefined}
            trend={kpi.trend}
          />
        ))}
      </div>
    </section>
  );
}
