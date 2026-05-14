"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Upload,
  Settings,
  ChevronLeft,
  ChevronRight,
  Database,
  ClipboardList,
  AlertTriangle,
  CheckSquare,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "البداية", icon: Upload, href: "/" },
  { label: "لوحاتي", icon: LayoutDashboard, href: "/my-dashboards" },
  { label: "مصادر البيانات", icon: Database, href: "/dashboard/demo/data" },
  {
    label: "الإدارة",
    icon: Settings,
    href: "/admin/review",
    children: [
      { label: "المراجعة", icon: CheckSquare, href: "/admin/review" },
      { label: "الشكاوى", icon: AlertTriangle, href: "/admin/complaints-dashboard" },
      { label: "المهام", icon: ClipboardList, href: "/admin/service-tasks-dashboard" },
    ],
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col border-l border-dga-gray-200 bg-white transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo/Brand */}
      <div
        className="flex h-14 items-center gap-3 px-4"
        style={{
          background: "linear-gradient(135deg, #092A1E 0%, #1B8354 100%)",
        }}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-dga-gold-400" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="block text-base font-bold text-white tracking-tight">QUAI</span>
            <span className="block text-[10px] font-medium text-white/60 uppercase tracking-wider">مولّد لوحات البيانات</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const hasChildren = "children" in item && item.children;
          const active = isActive(item.href);

          if (hasChildren) {
            const childActive = item.children!.some((c) => isActive(c.href));

            return (
              <div key={item.label}>
                <button
                  onClick={() => setAdminOpen(!adminOpen)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    childActive
                      ? "bg-dga-primary-50 text-dga-primary-700"
                      : "text-dga-gray-600 hover:bg-dga-gray-50 hover:text-dga-gray-900",
                    collapsed && "justify-center"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-right">{item.label}</span>
                      <ChevronLeft
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          adminOpen && "-rotate-90"
                        )}
                      />
                    </>
                  )}
                </button>
                {adminOpen && !collapsed && (
                  <div className="mr-4 mt-1 space-y-0.5 border-r-2 border-dga-primary-100 pr-3">
                    {item.children!.map((child) => {
                      const cActive = isActive(child.href);
                      return (
                        <a
                          key={child.label}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                            cActive
                              ? "bg-dga-primary-50 font-medium text-dga-primary-700"
                              : "text-dga-gray-500 hover:bg-dga-gray-50 hover:text-dga-gray-800"
                          )}
                        >
                          <child.icon className="h-4 w-4 shrink-0" />
                          <span>{child.label}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-dga-primary-50 text-dga-primary-700"
                  : "text-dga-gray-600 hover:bg-dga-gray-50 hover:text-dga-gray-900",
                collapsed && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center border-t border-dga-gray-200 py-3 text-dga-gray-400 hover:text-dga-gray-700 transition-colors"
        aria-label={collapsed ? "توسيع القائمة" : "طي القائمة"}
      >
        {collapsed ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}
