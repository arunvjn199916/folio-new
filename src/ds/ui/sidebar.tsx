"use client";

import { createContext, useContext, useState } from "react";
import { PanelLeft } from "lucide-react";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./overlays";
import { cn } from "@/lib/utils";

// App sidebar (shadcn's Sidebar, simplified): collapses to an icon rail, groups with
// labels, active item, and tooltips for icon-only items when collapsed.

const SidebarContext = createContext<{ collapsed: boolean; toggle: () => void }>({ collapsed: false, toggle: () => {} });
export const useSidebar = () => useContext(SidebarContext);

export function SidebarProvider({ children, defaultCollapsed = false, className }: { children: React.ReactNode; defaultCollapsed?: boolean; className?: string }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed((c) => !c) }}>
      <div data-collapsed={collapsed} className={cn("group/sidebar flex h-full w-full", className)}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ className, children, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      className={cn(
        "flex h-full w-60 shrink-0 flex-col border-r bg-ds-muted/50 transition-[width] duration-(--ds-duration-base) ease-(--ds-ease-standard) group-data-[collapsed=true]/sidebar:w-14",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}
export function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center gap-2 p-3", className)} {...props} />;
}
export function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden p-2", className)} {...props} />;
}
export function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("border-t p-2", className)} {...props} />;
}
export function SidebarGroup({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5">
      {label && <p className="px-2 pb-1 text-[11px] font-medium tracking-wide text-ds-muted-foreground uppercase group-data-[collapsed=true]/sidebar:sr-only">{label}</p>}
      {children}
    </div>
  );
}
export function SidebarItem({ icon: Icon, label, active, badge, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; active?: boolean; badge?: React.ReactNode; onClick?: () => void }) {
  const { collapsed } = useSidebar();
  const item = (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-8 w-full items-center gap-2.5 rounded-ds-md px-2 text-sm text-ds-foreground/80 transition-colors outline-none hover:bg-ds-accent hover:text-ds-foreground focus-visible:ring-3 focus-visible:ring-ds-ring/30 aria-[current=page]:bg-ds-background aria-[current=page]:font-medium aria-[current=page]:text-ds-foreground aria-[current=page]:shadow-ds-1",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="truncate group-data-[collapsed=true]/sidebar:sr-only">{label}</span>
      {badge && <span className="ml-auto group-data-[collapsed=true]/sidebar:hidden">{badge}</span>}
    </button>
  );
  if (!collapsed) return item;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{item}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle, collapsed } = useSidebar();
  return (
    <Button variant="ghost" size="icon-sm" onClick={toggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} className={className}>
      <PanelLeft />
    </Button>
  );
}
