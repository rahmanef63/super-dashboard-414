import { ChevronsUpDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarDashboardPlaceholderProps {
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
  showDropdownIcon?: boolean;
  badge?: React.ReactNode;
  variant?: "normal" | "error";
  className?: string;
}

export function SidebarDashboardPlaceholder({
  icon: Icon = undefined,
  title = "Marketing",
  subtitle = "Dashboard",
  showDropdownIcon = true,
  badge,
  variant = "normal",
  className,
}: SidebarDashboardPlaceholderProps) {
  return (
    <SidebarMenuButton
      size="lg"
      className={cn(
        variant === "error"
          ? "border border-destructive bg-destructive/10 text-destructive"
          : "",
        className
      )}
    >
      <div className={cn(
        "flex aspect-square size-8 items-center justify-center rounded-lg",
        variant === "error"
          ? "bg-destructive text-destructive-foreground"
          : "bg-primary text-primary-foreground"
      )}>
        {Icon ? <Icon className="size-4" /> : null}
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{title}</span>
        <span className="truncate text-xs">{subtitle}</span>
      </div>
      {badge && badge}
      {showDropdownIcon && <ChevronsUpDown className="ml-auto size-4" />}
    </SidebarMenuButton>
  );
}
