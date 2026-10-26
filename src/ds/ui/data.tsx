"use client";

import { ScrollArea as ScrollAreaPrimitive, NavigationMenu as NavPrimitive } from "radix-ui";
import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";

// Data and navigation: Table, Breadcrumb, Pagination, ScrollArea, NavigationMenu.

/* ── Table ── */
export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}
export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}
export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}
export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr className={cn("border-b transition-colors hover:bg-ds-muted/60 data-[state=selected]:bg-ds-muted", className)} {...props} />;
}
export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return <th className={cn("h-10 px-3 text-left align-middle text-xs font-medium whitespace-nowrap text-ds-muted-foreground", className)} {...props} />;
}
export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("px-3 py-2.5 align-middle whitespace-nowrap", className)} {...props} />;
}
export function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption className={cn("mt-4 text-sm text-ds-muted-foreground", className)} {...props} />;
}

/* ── Breadcrumb ── */
export function Breadcrumb({ items, className }: { items: { label: string; href?: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ds-muted-foreground">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.label} className="inline-flex items-center gap-1.5">
              {last || !it.href ? (
                <span aria-current={last ? "page" : undefined} className={cn(last && "font-medium text-ds-foreground")}>
                  {it.label}
                </span>
              ) : (
                <a href={it.href} className="transition-colors hover:text-ds-foreground">
                  {it.label}
                </a>
              )}
              {!last && <ChevronRight aria-hidden className="size-3.5" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ── Pagination ── */
export function Pagination({ page, pages, onPage, className }: { page: number; pages: number; onPage: (p: number) => void; className?: string }) {
  // first, last, current ±1, with ellipses between gaps
  const shown = [...new Set([1, page - 1, page, page + 1, pages].filter((p) => p >= 1 && p <= pages))].sort((a, b) => a - b);
  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <button className={buttonVariants({ variant: "ghost", size: "sm" })} disabled={page <= 1} onClick={() => onPage(page - 1)}>
        <ChevronLeft /> Previous
      </button>
      {shown.map((p, i) => (
        <span key={p} className="flex items-center gap-1">
          {i > 0 && p - shown[i - 1] > 1 && <MoreHorizontal aria-hidden className="size-4 text-ds-muted-foreground" />}
          <button
            aria-current={p === page ? "page" : undefined}
            className={buttonVariants({ variant: p === page ? "outline" : "ghost", size: "icon-sm" })}
            onClick={() => onPage(p)}
          >
            {p}
          </button>
        </span>
      ))}
      <button className={buttonVariants({ variant: "ghost", size: "sm" })} disabled={page >= pages} onClick={() => onPage(page + 1)}>
        Next <ChevronRight />
      </button>
    </nav>
  );
}

/* ── ScrollArea ── */
export function ScrollArea({ className, children, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root className={cn("relative overflow-hidden", className)} {...props}>
      <ScrollAreaPrimitive.Viewport tabIndex={0} className="size-full rounded-[inherit] outline-none focus-visible:ring-3 focus-visible:ring-ds-ring/30">{children}</ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar orientation="vertical" className="flex w-2.5 touch-none border-l border-l-transparent p-px select-none">
        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-ds-border" />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

/* ── NavigationMenu ── */
export function NavigationMenu({ className, children, ...props }: React.ComponentProps<typeof NavPrimitive.Root>) {
  return (
    <NavPrimitive.Root className={cn("relative flex max-w-max flex-1 items-center justify-center", className)} {...props}>
      {children}
      <div className="absolute top-full left-0 isolate z-50 flex justify-center">
        <NavPrimitive.Viewport className="relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full origin-top overflow-hidden rounded-ds-md border bg-ds-popover shadow-ds-3 md:w-(--radix-navigation-menu-viewport-width)" />
      </div>
    </NavPrimitive.Root>
  );
}
export function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavPrimitive.List>) {
  return <NavPrimitive.List className={cn("flex flex-1 list-none items-center justify-center gap-1", className)} {...props} />;
}
export const NavigationMenuItem = NavPrimitive.Item;
export function NavigationMenuTrigger({ className, children, ...props }: React.ComponentProps<typeof NavPrimitive.Trigger>) {
  return (
    <NavPrimitive.Trigger className={cn(buttonVariants({ variant: "ghost" }), "group data-[state=open]:bg-ds-accent", className)} {...props}>
      {children}
      <ChevronDown aria-hidden className="relative top-px ml-1 size-3 transition duration-(--ds-duration-base) group-data-[state=open]:rotate-180" />
    </NavPrimitive.Trigger>
  );
}
export function NavigationMenuContent({ className, ...props }: React.ComponentProps<typeof NavPrimitive.Content>) {
  return <NavPrimitive.Content className={cn("top-0 left-0 w-full p-2 md:absolute md:w-auto", className)} {...props} />;
}
export function NavigationMenuLink({ className, ...props }: React.ComponentProps<typeof NavPrimitive.Link>) {
  return (
    <NavPrimitive.Link
      className={cn("flex flex-col gap-1 rounded-ds-sm p-2 text-sm transition-colors outline-none hover:bg-ds-accent focus-visible:ring-3 focus-visible:ring-ds-ring/30 data-[active=true]:bg-ds-accent", className)}
      {...props}
    />
  );
}
