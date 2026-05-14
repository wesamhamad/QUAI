import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn("min-h-full bg-dga-gray-50 p-6", className)}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  );
}
