import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        success: "bg-dga-success-50 text-dga-success-700 border border-dga-success-200",
        warning: "bg-dga-warning-50 text-dga-warning-700 border border-dga-warning-200",
        error: "bg-dga-error-50 text-dga-error-700 border border-dga-error-200",
        info: "bg-dga-info-50 text-dga-info-700 border border-dga-info-200",
        default: "bg-dga-gray-100 text-dga-gray-700 border border-dga-gray-200",
        primary: "bg-dga-primary-50 text-dga-primary-700 border border-dga-primary-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
