"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DBType {
  id: string;
  label: string;
  defaultPort: number;
}

const DB_TYPES: DBType[] = [
  { id: "postgresql", label: "PostgreSQL", defaultPort: 5432 },
  { id: "mysql", label: "MySQL", defaultPort: 3306 },
  { id: "sqlite", label: "SQLite", defaultPort: 0 },
  { id: "sqlserver", label: "SQL Server", defaultPort: 1433 },
  { id: "oracle", label: "Oracle", defaultPort: 1521 },
];

interface ConnectionForm {
  dbType: string;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

interface TableInfo {
  name: string;
  row_count: number;
  column_count: number;
  columns: string[];
  has_relationships: boolean;
  related_tables: string[];
  ai_recommended: boolean;
  recommendation_reason: string;
}

type Status = "idle" | "testing" | "discovered" | "error" | "importing";

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className || ""}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export function DatabaseConnection() {
  const [form, setForm] = useState<ConnectionForm>({
    dbType: "",
    host: "",
    port: "",
    database: "",
    username: "",
    password: "",
  });

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Discovery state
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set());
  const [tableSearch, setTableSearch] = useState("");

  const selectedDB = useMemo(
    () => DB_TYPES.find((db) => db.id === form.dbType),
    [form.dbType]
  );
  const isSQLite = form.dbType === "sqlite";

  const canTest = useMemo(() => {
    if (!form.dbType) return false;
    if (isSQLite) return !!form.database;
    return !!(form.host && form.port && form.database);
  }, [form, isSQLite]);

  const filteredTables = useMemo(() => {
    if (!tableSearch) return tables;
    const q = tableSearch.toLowerCase();
    return tables.filter((t) => t.name.toLowerCase().includes(q));
  }, [tables, tableSearch]);

  const recommendedTables = useMemo(
    () => tables.filter((t) => t.ai_recommended),
    [tables]
  );

  const handleDBTypeChange = useCallback((value: string | null) => {
    if (!value) return;
    const db = DB_TYPES.find((d) => d.id === value);
    setForm((prev) => ({
      ...prev,
      dbType: value,
      port: db && db.defaultPort > 0 ? String(db.defaultPort) : "",
      host: value === "sqlite" ? "" : prev.host,
      username: value === "sqlite" ? "" : prev.username,
      password: value === "sqlite" ? "" : prev.password,
    }));
    setStatus("idle");
    setError(null);
    setTables([]);
    setSelectedTables(new Set());
  }, []);

  const updateField = useCallback(
    (field: keyof ConnectionForm) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        if (status === "error") {
          setStatus("idle");
          setError(null);
        }
      },
    [status]
  );

  // Step 1: Discover schema
  const handleDiscover = useCallback(async () => {
    if (!canTest) return;
    setStatus("testing");
    setError(null);
    setTables([]);
    setSelectedTables(new Set());
    setTableSearch("");

    try {
      const res = await fetch("/api/ingest/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          db_type: form.dbType,
          host: form.host || "localhost",
          port: form.port ? parseInt(form.port, 10) : selectedDB?.defaultPort,
          database: form.database,
          username: form.username,
          password: form.password,
        }),
      });

      if (!res.ok) {
        let msg = "Connection failed.";
        try { const e = await res.json(); msg = e.detail || msg; } catch {}
        throw new Error(msg);
      }

      const data = await res.json();
      const discovered: TableInfo[] = data.tables || [];
      setTables(discovered);

      // Auto-select AI-recommended tables
      const autoSelected = new Set<string>(
        discovered.filter((t: TableInfo) => t.ai_recommended).map((t: TableInfo) => t.name)
      );
      setSelectedTables(autoSelected);
      setStatus("discovered");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
      setStatus("error");
    }
  }, [canTest, form, selectedDB]);

  // Toggle table selection
  const toggleTable = useCallback((name: string) => {
    setSelectedTables((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  const selectAllRecommended = useCallback(() => {
    setSelectedTables(new Set(recommendedTables.map((t) => t.name)));
  }, [recommendedTables]);

  const selectNone = useCallback(() => {
    setSelectedTables(new Set());
  }, []);

  // Step 2: Import selected tables and go to dashboard
  const handleImport = useCallback(async () => {
    if (selectedTables.size === 0) return;
    setStatus("importing");
    setError(null);

    try {
      const res = await fetch("/api/ingest/import-tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          db_type: form.dbType,
          host: form.host || "localhost",
          port: form.port ? parseInt(form.port, 10) : selectedDB?.defaultPort,
          database: form.database,
          username: form.username,
          password: form.password,
          tables: Array.from(selectedTables),
        }),
      });

      if (!res.ok) {
        let msg = "Import failed.";
        try { const e = await res.json(); msg = e.detail || msg; } catch {}
        throw new Error(msg);
      }

      const result = await res.json();
      if (result.dataset_id) {
        window.location.href = `/dashboard/${result.dataset_id}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
      setStatus("discovered");
    }
  }, [form, selectedDB, selectedTables]);

  return (
    <div className="space-y-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDiscover();
        }}
        className="space-y-4"
      >
        {/* DB Type */}
        <div className="space-y-1.5">
          <Label htmlFor="db-type" className="text-sm font-medium text-dga-gray-700">
            نوع قاعدة البيانات
          </Label>
          <Select value={form.dbType} onValueChange={handleDBTypeChange}>
            <SelectTrigger id="db-type" className="w-full border-dga-gray-300">
              <SelectValue placeholder="اختر نوع قاعدة البيانات" />
            </SelectTrigger>
            <SelectContent>
              {DB_TYPES.map((db) => (
                <SelectItem key={db.id} value={db.id}>
                  {db.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {form.dbType && (
          <>
            {!isSQLite && (
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="db-host" className="text-sm font-medium text-dga-gray-700">المضيف</Label>
                  <Input id="db-host" placeholder="localhost" value={form.host} onChange={updateField("host")} className="border-dga-gray-300" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="db-port" className="text-sm font-medium text-dga-gray-700">المنفذ</Label>
                  <Input id="db-port" type="number" placeholder={String(selectedDB?.defaultPort ?? "")} value={form.port} onChange={updateField("port")} className="border-dga-gray-300" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="db-name" className="text-sm font-medium text-dga-gray-700">
                {isSQLite ? "مسار الملف" : "اسم قاعدة البيانات"}
              </Label>
              <Input id="db-name" placeholder={isSQLite ? "/path/to/db.sqlite" : "my_database"} value={form.database} onChange={updateField("database")} className="border-dga-gray-300" />
            </div>

            {!isSQLite && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="db-user" className="text-sm font-medium text-dga-gray-700">اسم المستخدم</Label>
                  <Input id="db-user" placeholder="root" value={form.username} onChange={updateField("username")} autoComplete="username" className="border-dga-gray-300" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="db-pass" className="text-sm font-medium text-dga-gray-700">كلمة المرور</Label>
                  <div className="relative">
                    <Input id="db-pass" type={showPassword ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={updateField("password")} className="border-dga-gray-300 pr-10" autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dga-gray-400 hover:text-dga-gray-700" aria-label={showPassword ? "Hide" : "Show"}>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d={showPassword ? "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" : "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"} />{!showPassword && <circle cx="12" cy="12" r="3" />}</svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={!canTest || status === "testing" || status === "importing"}
              className="w-full bg-dga-primary-500 text-white hover:bg-dga-primary-600 disabled:opacity-50"
            >
              {status === "testing" ? (
                <><Spinner className="ml-2" />جارٍ اكتشاف الجداول...</>
              ) : (
                "اتصال واكتشاف الجداول"
              )}
            </Button>
          </>
        )}
      </form>

      {/* Error */}
      {status === "error" && error && (
        <div className="flex items-start gap-2 rounded-lg bg-dga-error-50 px-4 py-3 text-sm text-dga-error-700 border border-dga-error-200">
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
          <span>{error}</span>
        </div>
      )}

      {/* Discovery results */}
      {(status === "discovered" || status === "importing") && tables.length > 0 && (
        <div className="space-y-4">
          {/* Success banner */}
          <div className="flex items-center gap-2 rounded-lg bg-dga-success-50 px-4 py-3 text-sm border border-dga-success-200">
            <svg className="h-5 w-5 text-dga-success-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            <span className="text-dga-success-700 font-medium">
              تم الاتصال! تم العثور على {tables.length} جدول.
            </span>
          </div>

          {/* توصيات الذكاء الاصطناعي */}
          {recommendedTables.length > 0 && (
            <div className="rounded-lg bg-gradient-to-r from-dga-primary-50 to-dga-gold-50 p-4 border border-dga-primary-100">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-5 w-5 text-dga-gold-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z"/></svg>
                <span className="text-sm font-semibold text-dga-gray-800">
                  توصيات الذكاء الاصطناعي
                </span>
                <span className="text-xs text-dga-gray-500">
                  {recommendedTables.length} جداول مختارة لأفضل الرؤى
                </span>
              </div>
              <p className="text-xs text-dga-gray-600">
                هذه الجداول تحتوي على أكثر البيانات والعلاقات. يمكنك تعديل الاختيار أدناه.
              </p>
            </div>
          )}

          {/* Selection controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-dga-gray-800">
                اختر الجداول
              </span>
              <span className="rounded-full bg-dga-primary-100 px-2 py-0.5 text-xs font-medium text-dga-primary-700">
                {selectedTables.size} مختار
              </span>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={selectAllRecommended} className="text-xs text-dga-primary-600 hover:text-dga-primary-800 font-medium">
                اختيار الذكاء الاصطناعي
              </button>
              <span className="text-dga-gray-300">|</span>
              <button type="button" onClick={selectNone} className="text-xs text-dga-gray-500 hover:text-dga-gray-700 font-medium">
                مسح
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dga-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <Input placeholder="ابحث في الجداول..." value={tableSearch} onChange={(e) => setTableSearch(e.target.value)} className="border-dga-gray-300 pl-9" />
          </div>

          {/* Table list */}
          <div className="max-h-80 overflow-y-auto rounded-lg border border-dga-gray-200 bg-white divide-y divide-dga-gray-100">
            {filteredTables.map((t) => {
              const isSelected = selectedTables.has(t.name);
              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => toggleTable(t.name)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? "bg-dga-primary-25"
                      : "hover:bg-dga-gray-50"
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors ${
                    isSelected
                      ? "border-dga-primary-500 bg-dga-primary-500"
                      : "border-dga-gray-300 bg-white"
                  }`}>
                    {isSelected && (
                      <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium truncate ${isSelected ? "text-dga-primary-700" : "text-dga-gray-800"}`}>
                        {t.name}
                      </span>
                      {t.ai_recommended && (
                        <span className="shrink-0 rounded bg-dga-gold-100 px-1.5 py-0.5 text-[10px] font-semibold text-dga-gold-700 uppercase tracking-wide">
                          اختيار ذكي
                        </span>
                      )}
                      {t.has_relationships && (
                        <span className="shrink-0 rounded bg-dga-info-100 px-1.5 py-0.5 text-[10px] font-semibold text-dga-info-700 uppercase tracking-wide">
                          علاقات
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-dga-gray-500">
                      <span>{t.row_count.toLocaleString()} صف</span>
                      <span>{t.column_count} عمود</span>
                      {t.recommendation_reason && (
                        <span className="text-dga-primary-600">{t.recommendation_reason}</span>
                      )}
                    </div>
                    {t.related_tables.length > 0 && (
                      <div className="mt-1 text-xs text-dga-gray-400">
                        مرتبط بـ: {t.related_tables.slice(0, 3).join(", ")}
                        {t.related_tables.length > 3 && ` +${t.related_tables.length - 3} أخرى`}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Import button */}
          <Button
            type="button"
            disabled={selectedTables.size === 0 || status === "importing"}
            onClick={handleImport}
            className="w-full bg-dga-primary-600 text-white hover:bg-dga-primary-700 disabled:opacity-50"
          >
            {status === "importing" ? (
              <><Spinner className="ml-2" />جارٍ استيراد {selectedTables.size} جداول وإنشاء لوحة البيانات...</>
            ) : (
              <>إنشاء لوحة بيانات من {selectedTables.size} {selectedTables.size !== 1 ? "جداول" : "جدول"}</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
