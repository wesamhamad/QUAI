"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  LayoutDashboard,
  Brain,
  Database,
  BarChart3,
  ClipboardList,
  Sparkles,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { ChartsGrid } from "@/components/dashboard/charts-grid";
import { DataTable } from "@/components/dashboard/data-table";
import type { DashboardConfig, InsightItem } from "@/lib/types";
import { Button } from "@/components/ui/button";

function InsightsPanel({ insights }: { insights: InsightItem[] }) {
  if (!insights || insights.length === 0) return null;

  const cardStyles: Record<string, string> = {
    high: "bg-gradient-to-br from-dga-primary-50 to-dga-primary-100/50 border-dga-primary-200",
    medium: "bg-gradient-to-br from-dga-gold-50 to-dga-gold-100/50 border-dga-gold-200",
    low: "bg-gradient-to-br from-dga-gray-50 to-dga-gray-100/50 border-dga-gray-200",
  };

  const iconBg: Record<string, string> = {
    high: "bg-dga-primary-100 text-dga-primary-600",
    medium: "bg-dga-gold-100 text-dga-gold-600",
    low: "bg-dga-gray-200 text-dga-gray-500",
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-dga-gold-100 p-2">
          <Lightbulb className="h-5 w-5 text-dga-gold-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-dga-gray-900">أبرز المؤشرات</h2>
          <p className="text-xs text-dga-gray-500">رؤى مستخلصة تلقائيًا لدعم اتخاذ القرار</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {insights.map((ins, i) => (
          <div
            key={i}
            className={`rounded-xl border p-5 transition-shadow hover:shadow-md ${
              cardStyles[ins.importance] || cardStyles.medium
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`rounded-lg p-2 shrink-0 ${iconBg[ins.importance] || iconBg.medium}`}>
                <span className="text-lg">{ins.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-dga-gray-900 leading-relaxed">{ins.title}</p>
                <p className="mt-2 text-sm text-dga-gray-700 leading-loose">{ins.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const params = useParams();
  const datasetId = params.id as string;

  const [config, setConfig] = React.useState<DashboardConfig | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/dashboard/${datasetId}/config`);
        if (!res.ok) throw new Error(`فشل تحميل لوحة البيانات (${res.status})`);
        const data = await res.json();

        const dashConfig: DashboardConfig = {
          dataset_id: data.dataset_id,
          title: data.title || "لوحة البيانات",
          kpis: data.kpis || [],
          filters: data.filters || [],
          insights: data.insights || [],
          charts: (data.charts || []).map((c: Record<string, unknown>, i: number) => ({
            id: c.id || `chart-${i}`,
            chart_type: c.chart_type || "bar",
            title: c.title || "",
            description: c.description || "",
            x_column: c.x_column,
            y_column: c.y_column,
            columns: c.columns,
            data: c.data || [],
          })),
          table_columns: data.table_columns,
          table_data: data.table_data,
        };

        setConfig(dashConfig);
      } catch (err) {
        setError(err instanceof Error ? err.message : "فشل التحميل");
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, [datasetId]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex h-96 flex-col items-center justify-center gap-4" role="status">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-dga-primary-100" />
            <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-dga-primary-500" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-dga-gray-800">جارٍ تحليل بياناتك...</p>
            <p className="mt-1 text-sm text-dga-gray-500">تنظيف البيانات وإنشاء الرسوم البيانية والرؤى</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !config) {
    return (
      <PageWrapper>
        <div className="flex h-96 flex-col items-center justify-center gap-4" role="alert">
          <div className="rounded-full bg-dga-error-50 p-4">
            <AlertCircle className="h-10 w-10 text-dga-error-500" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-dga-gray-800">فشل تحميل لوحة البيانات</p>
            <p className="mt-1 max-w-md text-sm text-dga-gray-500">
              {error || "تعذّر الاتصال بالخادم. تأكد من تشغيل الخادم الخلفي."}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.href = "/"}>الرئيسية</Button>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="ml-2 h-4 w-4" />
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const hasCharts = config.charts && config.charts.length > 0;
  const hasKpis = config.kpis && config.kpis.length > 0;
  const hasInsights = config.insights && config.insights.length > 0;
  const hasTableData = config.table_data && config.table_columns;

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-center gap-4">
          <div className="rounded-xl bg-gradient-to-br from-dga-primary-500 to-dga-primary-700 p-3 shadow-sm">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-dga-gray-900">{config.title}</h1>
            <p className="text-sm text-dga-gray-500">تم إنشاؤها تلقائيًا من بياناتك</p>
          </div>
          <div className="flex gap-2">
            <a href={`/dashboard/${datasetId}/data`} className="inline-flex items-center gap-2 rounded-lg border border-dga-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-dga-gray-700 shadow-sm hover:bg-dga-gray-50 transition-colors">
              <Database className="h-4 w-4" />التحليل
            </a>
            <a href={`/dashboard/${datasetId}/clean`} className="inline-flex items-center gap-2 rounded-lg border border-dga-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-dga-gray-700 shadow-sm hover:bg-dga-gray-50 transition-colors">
              <ClipboardList className="h-4 w-4" />التنظيف
            </a>
            <a href={`/dashboard/${datasetId}/insights`} className="inline-flex items-center gap-2 rounded-lg border border-dga-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-dga-gray-700 shadow-sm hover:bg-dga-gray-50 transition-colors">
              <Sparkles className="h-4 w-4" />الرؤى
            </a>
            <a href={`/dashboard/${datasetId}/query`} className="inline-flex items-center gap-2 rounded-lg bg-dga-primary-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-dga-primary-700 transition-colors">
              <Brain className="h-4 w-4" />اسأل الذكاء الاصطناعي
            </a>
          </div>
        </header>

        {/* KPIs */}
        {hasKpis && <KPIRow kpis={config.kpis} />}

        {/* Top Insights */}
        {hasInsights && <InsightsPanel insights={config.insights!} />}

        {/* Charts */}
        {hasCharts ? (
          <ChartsGrid charts={config.charts} />
        ) : (
          <div className="rounded-xl border-2 border-dashed border-dga-gray-200 bg-white p-12 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-dga-gray-300" />
            <p className="mt-4 text-lg font-medium text-dga-gray-600">لم يتم إنشاء رسوم بيانية</p>
            <p className="mt-1 text-sm text-dga-gray-400">جرّب ميزة الاستفسار بالذكاء الاصطناعي لاستكشاف بياناتك.</p>
          </div>
        )}

        {/* Data Table */}
        {hasTableData && (
          <div>
            <h2 className="mb-3 text-base font-semibold text-dga-gray-800">معاينة البيانات</h2>
            <DataTable data={config.table_data!} columns={config.table_columns!} />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
