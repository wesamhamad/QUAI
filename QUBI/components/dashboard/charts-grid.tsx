"use client";

import * as React from "react";
import { Eye, EyeOff, LayoutGrid, SlidersHorizontal, X } from "lucide-react";
import type { ChartConfig } from "@/lib/types";
import { DGABarChart } from "@/components/charts/dga-bar-chart";
import { DGALineChart } from "@/components/charts/dga-line-chart";
import { DGAAreaChart } from "@/components/charts/dga-area-chart";
import { DGAPieChart } from "@/components/charts/dga-pie-chart";
import { DGADonutChart } from "@/components/charts/dga-donut-chart";
import { DGAScatterChart } from "@/components/charts/dga-scatter-chart";
import { DGAHeatmap } from "@/components/charts/dga-heatmap";
import { DGAStackedBarChart } from "@/components/charts/dga-stacked-bar-chart";
import { DGATreemap } from "@/components/charts/dga-treemap";
import { DGARadarChart } from "@/components/charts/dga-radar-chart";
import { DGAFrequencyMatrix } from "@/components/charts/dga-frequency-matrix";
import { DGAHorizontalBarChart } from "@/components/charts/dga-horizontal-bar-chart";
import { DGAFunnelChart } from "@/components/charts/dga-funnel-chart";
import { DGARadialBarChart } from "@/components/charts/dga-radial-bar-chart";
import { DGAGaugeChart } from "@/components/charts/dga-gauge-chart";
import { DGAGroupedBarChart } from "@/components/charts/dga-grouped-bar-chart";
import { DGAComposedChart } from "@/components/charts/dga-composed-chart";
import { ChartWrapper } from "@/components/charts/chart-wrapper";
import { Button } from "@/components/ui/button";

interface ChartsGridProps {
  charts: ChartConfig[];
  className?: string;
}

const CHART_TYPE_LABELS: Record<string, string> = {
  bar: "أعمدة",
  line: "خطي",
  area: "مساحة",
  pie: "دائري",
  donut: "حلقي",
  scatter: "تشتت",
  heatmap: "خريطة حرارية",
  stacked_bar: "أعمدة مكدسة",
  treemap: "خريطة شجرية",
  radar: "رادار",
  frequency_matrix: "مصفوفة التكرار",
  horizontal_bar: "أعمدة أفقية",
  funnel: "قمع",
  radial_bar: "أشرطة دائرية",
  gauge: "مقياس",
  grouped_bar: "أعمدة متجاورة",
  composed: "مركّب",
};

const CHART_TYPE_ICONS: Record<string, string> = {
  bar: "📊", line: "📈", area: "📉", pie: "🥧", donut: "🍩",
  scatter: "⚬", heatmap: "🟩", stacked_bar: "📊",
  treemap: "🗺️", radar: "🎯", frequency_matrix: "🔢", horizontal_bar: "📊",
  funnel: "🔻", radial_bar: "🎡", gauge: "⏱️", grouped_bar: "📊", composed: "📊",
};

function renderChart(chart: ChartConfig) {
  const yKeys = chart.columns?.length
    ? chart.columns
    : chart.y_column
      ? [chart.y_column]
      : [];

  switch (chart.chart_type) {
    case "bar":
      return (
        <DGABarChart
          title={chart.title}
          description={chart.description}
          data={chart.data}
          xKey={chart.x_column ?? "name"}
          yKeys={yKeys}
        />
      );
    case "stacked_bar":
      return (
        <DGAStackedBarChart
          title={chart.title}
          description={chart.description}
          data={chart.data}
          xKey={chart.x_column ?? "name"}
          yKeys={yKeys}
        />
      );
    case "line":
      return (
        <DGALineChart
          title={chart.title}
          description={chart.description}
          data={chart.data}
          xKey={chart.x_column ?? "name"}
          yKeys={yKeys}
        />
      );
    case "area":
      return (
        <DGAAreaChart
          title={chart.title}
          description={chart.description}
          data={chart.data}
          xKey={chart.x_column ?? "name"}
          yKeys={yKeys}
        />
      );
    case "pie":
      return (
        <DGAPieChart
          title={chart.title}
          description={chart.description}
          data={chart.data}
          nameKey={chart.x_column ?? "name"}
          valueKey={chart.y_column ?? "value"}
        />
      );
    case "donut":
      return (
        <DGADonutChart
          title={chart.title}
          description={chart.description}
          data={chart.data}
          nameKey={chart.x_column ?? "name"}
          valueKey={chart.y_column ?? "count"}
        />
      );
    case "scatter":
      return (
        <DGAScatterChart
          title={chart.title}
          description={chart.description}
          data={chart.data}
          xKey={chart.x_column ?? "x"}
          yKey={chart.y_column ?? "y"}
        />
      );
    case "heatmap":
      return (
        <DGAHeatmap
          title={chart.title}
          description={chart.description}
          data={chart.data}
          xKey={chart.x_column ?? "x"}
          yKey={chart.y_column ?? "y"}
          valueKey="value"
        />
      );
    case "frequency_matrix":
      return (
        <DGAFrequencyMatrix
          title={chart.title}
          description={chart.description}
          data={chart.data}
          xKey={chart.x_column ?? "x"}
          yKey={chart.y_column ?? "y"}
          valueKey="value"
        />
      );
    case "treemap":
      return (
        <DGATreemap
          title={chart.title}
          description={chart.description}
          data={chart.data}
          nameKey={chart.x_column ?? "name"}
          valueKey={chart.y_column ?? "count"}
        />
      );
    case "radar":
      return (
        <DGARadarChart
          title={chart.title}
          description={chart.description}
          data={chart.data}
          nameKey={chart.x_column ?? "name"}
          valueKey={chart.y_column ?? "value"}
        />
      );
    case "horizontal_bar":
      return (
        <DGAHorizontalBarChart
          title={chart.title}
          description={chart.description}
          data={chart.data}
          nameKey={chart.x_column ?? "name"}
          valueKey={chart.y_column ?? "count"}
        />
      );
    case "funnel":
      return (
        <DGAFunnelChart
          title={chart.title}
          description={chart.description}
          data={chart.data}
          nameKey={chart.x_column ?? "name"}
          valueKey={chart.y_column ?? "count"}
        />
      );
    case "radial_bar":
      return (
        <DGARadialBarChart
          title={chart.title}
          description={chart.description}
          data={chart.data}
          nameKey={chart.x_column ?? "name"}
          valueKey={chart.y_column ?? "value"}
        />
      );
    case "gauge":
      return (
        <DGAGaugeChart
          title={chart.title}
          description={chart.description}
          data={chart.data}
          nameKey={chart.x_column ?? "name"}
          valueKey={chart.y_column ?? "value"}
        />
      );
    case "grouped_bar":
      return (
        <DGAGroupedBarChart
          title={chart.title}
          description={chart.description}
          data={chart.data}
          xKey={chart.x_column ?? "name"}
          yKeys={yKeys}
        />
      );
    case "composed":
      return (
        <DGAComposedChart
          title={chart.title}
          description={chart.description}
          data={chart.data}
          xKey={chart.x_column ?? "name"}
          yKeys={yKeys}
        />
      );
    default:
      return (
        <ChartWrapper title={chart.title} description="نوع رسم غير مدعوم">
          <div className="flex h-full items-center justify-center text-dga-gray-400">
            نوع الرسم &quot;{chart.chart_type}&quot; غير مدعوم
          </div>
        </ChartWrapper>
      );
  }
}

export function ChartsGrid({ charts, className }: ChartsGridProps) {
  const [hiddenIds, setHiddenIds] = React.useState<Set<string>>(new Set());
  const [showControls, setShowControls] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);

  const toggleChart = (id: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hideChart = (id: string) => {
    setHiddenIds((prev) => new Set(prev).add(id));
  };

  const showAll = () => setHiddenIds(new Set());
  const visibleCharts = charts.filter((c) => !hiddenIds.has(c.id));

  // Full-width chart types
  const isFullWidth = (ct: string) =>
    ct === "heatmap" || ct === "frequency_matrix" || ct === "stacked_bar" || ct === "grouped_bar" || ct === "composed";

  return (
    <section aria-label="الرسوم البيانية" className={className}>
      {/* Controls bar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-dga-primary-500" />
          <h2 className="text-base font-bold text-dga-gray-900">
            الرسوم البيانية
            <span className="mr-2 text-sm font-normal text-dga-gray-400">
              ({visibleCharts.length} من {charts.length})
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {hiddenIds.size > 0 && (
            <Button variant="ghost" size="sm" onClick={showAll} className="text-xs text-dga-primary-600">
              <Eye className="ml-1 h-3.5 w-3.5" />
              إظهار الكل ({hiddenIds.size})
            </Button>
          )}
          <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            onClick={() => setEditMode(!editMode)}
            className="text-xs"
          >
            {editMode ? (
              <>
                <Eye className="ml-1 h-3.5 w-3.5" />
                إنهاء التعديل
              </>
            ) : (
              <>
                <SlidersHorizontal className="ml-1 h-3.5 w-3.5" />
                تعديل العرض
              </>
            )}
          </Button>
          <Button
            variant={showControls ? "default" : "outline"}
            size="sm"
            onClick={() => setShowControls(!showControls)}
            className="text-xs"
          >
            <SlidersHorizontal className="ml-1 h-3.5 w-3.5" />
            تخصيص
          </Button>
        </div>
      </div>

      {/* Widget visibility panel */}
      {showControls && (
        <div className="mb-4 rounded-xl border border-dga-gray-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm font-medium text-dga-gray-600">إظهار / إخفاء الرسوم البيانية:</p>
          <div className="flex flex-wrap gap-2">
            {charts.map((chart) => {
              const isHidden = hiddenIds.has(chart.id);
              return (
                <button
                  key={chart.id}
                  onClick={() => toggleChart(chart.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    isHidden
                      ? "border-dga-gray-200 bg-dga-gray-50 text-dga-gray-400 line-through"
                      : "border-dga-primary-200 bg-dga-primary-50 text-dga-primary-700"
                  }`}
                >
                  {isHidden ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                  <span className="ml-1">
                    {CHART_TYPE_ICONS[chart.chart_type] || "📊"}
                  </span>
                  {chart.title}
                  <span className="opacity-50">
                    ({CHART_TYPE_LABELS[chart.chart_type] || chart.chart_type})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {visibleCharts.map((chart) => (
          <div
            key={chart.id}
            className={`relative group ${
              isFullWidth(chart.chart_type) ? "lg:col-span-2" : ""
            } ${editMode ? "ring-2 ring-dga-primary-200 ring-offset-2 rounded-xl" : ""}`}
          >
            {/* Per-chart hide button — visible in edit mode or on hover */}
            {editMode && (
              <button
                onClick={() => hideChart(chart.id)}
                className="absolute -left-2 -top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                title="إخفاء هذا الرسم"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {!editMode && (
              <button
                onClick={() => hideChart(chart.id)}
                className="absolute left-2 top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-dga-gray-100 text-dga-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 transition-all"
                title="إخفاء هذا الرسم"
              >
                <EyeOff className="h-3 w-3" />
              </button>
            )}
            {renderChart(chart)}
          </div>
        ))}
      </div>

      {/* Hidden charts summary */}
      {hiddenIds.size > 0 && !showControls && (
        <div className="mt-4 rounded-lg border border-dashed border-dga-gray-300 bg-dga-gray-50 p-3 text-center">
          <p className="text-sm text-dga-gray-500">
            {hiddenIds.size} رسم بياني مخفي —{" "}
            <button onClick={showAll} className="text-dga-primary-600 hover:underline font-medium">
              إظهار الكل
            </button>
            {" "}أو{" "}
            <button onClick={() => setShowControls(true)} className="text-dga-primary-600 hover:underline font-medium">
              تخصيص
            </button>
          </p>
        </div>
      )}
    </section>
  );
}
