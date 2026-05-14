"use client";

import * as React from "react";
import { PageWrapper } from "@/components/layout/page-wrapper";
import {
  LayoutDashboard,
  Loader2,
  Trash2,
  ExternalLink,
  BarChart3,
  Calendar,
  Database,
  Plus,
} from "lucide-react";
import type { SavedDashboard } from "@/lib/types";

export default function MyDashboardsPage() {
  const [dashboards, setDashboards] = React.useState<SavedDashboard[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/dashboards")
      .then((r) => r.json())
      .then((data) => setDashboards(data))
      .catch(() => setDashboards([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف لوحة البيانات هذه؟")) return;
    try {
      await fetch(`/api/dashboard/${id}`, { method: "DELETE" });
      setDashboards((prev) => prev.filter((d) => d.id !== id));
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-dga-primary-500" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-dga-primary-500 to-dga-primary-700 p-3 shadow-sm">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-dga-gray-900">لوحاتي</h1>
              <p className="text-sm text-dga-gray-500">
                جميع لوحات البيانات المحفوظة ({dashboards.length})
              </p>
            </div>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-dga-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-dga-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            إنشاء لوحة جديدة
          </a>
        </header>

        {dashboards.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-dga-gray-200 bg-white p-12 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-dga-gray-300" />
            <p className="mt-4 text-lg font-medium text-dga-gray-600">
              لا توجد لوحات بيانات محفوظة
            </p>
            <p className="mt-1 text-sm text-dga-gray-400">
              قم بالاتصال بقاعدة بيانات أو رفع ملف لإنشاء أول لوحة بيانات.
            </p>
            <a
              href="/"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-dga-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-dga-primary-600"
            >
              <Plus className="h-4 w-4" />
              ابدأ الآن
            </a>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboards.map((d) => (
              <div
                key={d.id}
                className="group relative rounded-xl border border-dga-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-dga-primary-50 p-2.5">
                    <BarChart3 className="h-5 w-5 text-dga-primary-600" />
                  </div>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="rounded p-1.5 text-dga-gray-400 opacity-0 group-hover:opacity-100 hover:bg-dga-error-50 hover:text-dga-error-500 transition-all"
                    aria-label="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="mt-3 text-sm font-bold text-dga-gray-900 truncate">
                  {d.title}
                </h3>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-dga-gray-500">
                  <span className="flex items-center gap-1">
                    <Database className="h-3.5 w-3.5" />
                    {d.record_count.toLocaleString()} سجل
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-3.5 w-3.5" />
                    {d.chart_count} رسم بياني
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(d.created_at).toLocaleDateString("ar-SA")}
                  </span>
                </div>

                {d.table_names.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {d.table_names.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded bg-dga-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-dga-gray-600"
                      >
                        {t.replace("tbl_", "")}
                      </span>
                    ))}
                    {d.table_names.length > 3 && (
                      <span className="text-[10px] text-dga-gray-400">
                        +{d.table_names.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <a
                  href={`/dashboard/${d.dataset_id}`}
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-dga-primary-50 px-3 py-2 text-sm font-medium text-dga-primary-700 hover:bg-dga-primary-100 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  فتح اللوحة
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
