"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { DatabaseConnection } from "@/components/database-connection";
import { Upload, Database, Sparkles, BarChart3, Shield, Zap } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"upload" | "connect">("upload");

  return (
    <div className="min-h-full bg-dga-gray-50">
      {/* Hero Section */}
      <div
        className="relative overflow-hidden px-6 pb-10 pt-10 sm:px-8 sm:pb-14 sm:pt-14"
        style={{
          background: "linear-gradient(135deg, #092A1E 0%, #166A45 40%, #25935F 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/20" />
          <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-white/10" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            تحليل البيانات بالذكاء الاصطناعي
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            حوّل بياناتك إلى
            <br />
            <span className="text-dga-gold-400">لوحات معلومات تفاعلية</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/75 sm:text-lg">
            ارفع ملفًا أو اتصل بقاعدة البيانات. QUAI يقوم تلقائيًا بتحليل البيانات،
            تنظيفها، واكتشاف الرؤى وإنشاء لوحات بيانات ذكية.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: Zap, label: "تحليل تلقائي" },
              { icon: Shield, label: "تنظيف البيانات" },
              { icon: BarChart3, label: "رسوم بيانية ذكية" },
              { icon: Sparkles, label: "رؤى بالذكاء الاصطناعي" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Switcher + Content */}
      <div className="mx-auto mt-8 max-w-3xl px-4 pb-12 sm:px-6">
        <div className="mb-0 flex overflow-hidden rounded-t-xl border border-b-0 border-dga-gray-200 bg-white shadow-sm">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex flex-1 items-center justify-center gap-2.5 px-6 py-4 text-sm font-semibold transition-all ${
              activeTab === "upload"
                ? "border-b-2 border-dga-primary-500 bg-dga-primary-25 text-dga-primary-700"
                : "border-b-2 border-transparent text-dga-gray-500 hover:bg-dga-gray-50 hover:text-dga-gray-700"
            }`}
          >
            <Upload className="h-5 w-5" />
            رفع ملف
          </button>
          <button
            onClick={() => setActiveTab("connect")}
            className={`flex flex-1 items-center justify-center gap-2.5 px-6 py-4 text-sm font-semibold transition-all ${
              activeTab === "connect"
                ? "border-b-2 border-dga-primary-500 bg-dga-primary-25 text-dga-primary-700"
                : "border-b-2 border-transparent text-dga-gray-500 hover:bg-dga-gray-50 hover:text-dga-gray-700"
            }`}
          >
            <Database className="h-5 w-5" />
            اتصال بقاعدة البيانات
          </button>
        </div>

        <div className="rounded-b-xl border border-t-0 border-dga-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {activeTab === "upload" ? <FileUpload /> : <DatabaseConnection />}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-dga-gray-400">
            الصيغ المدعومة: CSV، Excel (.xlsx)، JSON، Parquet — الحد الأقصى: 100 ميجابايت
          </p>
          <p className="mt-1 text-xs text-dga-gray-400">
            قواعد البيانات المدعومة: PostgreSQL، MySQL، SQLite، SQL Server، Oracle
          </p>
        </div>
      </div>
    </div>
  );
}
