"use client";

import { Avatar as AvatarPrimitive, Label as LabelPrimitive, Separator as SeparatorPrimitive, Progress as ProgressPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Small shadcn primitives in one file: Badge, Card, Input, Textarea, Label, Separator,
// Skeleton, Avatar, Alert, Kbd, Progress. All re-tokened for Aura.

/* ── Badge ── */
export const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ds-primary text-ds-primary-foreground",
        secondary: "border-transparent bg-ds-secondary text-ds-secondary-foreground",
        outline: "text-ds-foreground",
        destructive: "border-transparent bg-ds-destructive/12 text-ds-destructive",
        success: "border-transparent bg-ds-success/12 text-ds-success",
        warning: "border-transparent bg-ds-warning/14 text-ds-warning",
        ai: "border-ds-ai-accent/25 bg-ds-ai text-ds-ai-accent",
      },
    },
    defaultVariants: { variant: "default" },
  },
);
export function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/* ── Card ── */
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card" className={cn("flex flex-col gap-5 rounded-ds-lg border bg-ds-card py-5 text-ds-card-foreground shadow-ds-1", className)} {...props} />;
}
export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("grid gap-1 px-5", className)} {...props} />;
}
export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="card-title" className={cn("leading-tight font-semibold", className)} {...props} />;
}
export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("text-sm text-ds-muted-foreground", className)} {...props} />;
}
export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-5", className)} {...props} />;
}
export function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center gap-2 px-5", className)} {...props} />;
}

/* ── Input / Textarea ── */
const field =
  "w-full min-w-0 rounded-ds-md border border-ds-input bg-ds-background px-3 text-sm shadow-ds-1 transition-[border-color,box-shadow] duration-(--ds-duration-fast) outline-none placeholder:text-ds-muted-foreground focus-visible:border-ds-ring focus-visible:ring-3 focus-visible:ring-ds-ring/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-ds-destructive aria-invalid:ring-ds-destructive/20";
export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return <input type={type} data-slot="input" className={cn(field, "h-9 py-1 file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium", className)} {...props} />;
}
export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(field, "field-sizing-content min-h-16 py-2", className)} {...props} />;
}

/* ── Label ── */
export function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:opacity-50 group-data-[disabled=true]:opacity-50", className)}
      {...props}
    />
  );
}

/* ── Separator ── */
export function Separator({ className, orientation = "horizontal", decorative = true, ...props }: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn("shrink-0 bg-ds-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", className)}
      {...props}
    />
  );
}

/* ── Skeleton ── */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn("rounded-ds-md bg-[linear-gradient(90deg,var(--ds-muted)_25%,var(--ds-accent)_50%,var(--ds-muted)_75%)] bg-[length:200%_100%] [animation:ds-shimmer_1.6s_linear_infinite]", className)}
      {...props}
    />
  );
}

/* ── Avatar ── */
export function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return <AvatarPrimitive.Root data-slot="avatar" className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)} {...props} />;
}
export function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full", className)} {...props} />;
}
export function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return <AvatarPrimitive.Fallback data-slot="avatar-fallback" className={cn("flex size-full items-center justify-center rounded-full bg-ds-muted text-xs font-medium", className)} {...props} />;
}

/* ── Alert ── */
export const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-ds-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-ds-card text-ds-card-foreground",
        destructive: "border-ds-destructive/30 bg-ds-destructive/6 text-ds-destructive [&>[data-slot=alert-description]]:text-ds-destructive/90",
        warning: "border-ds-warning/30 bg-ds-warning/8 text-ds-warning",
        ai: "border-ds-ai-accent/25 bg-ds-ai text-ds-ai-foreground [&>svg]:text-ds-ai-accent",
      },
    },
    defaultVariants: { variant: "default" },
  },
);
export function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}
export function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-title" className={cn("col-start-2 line-clamp-1 min-h-4 font-medium", className)} {...props} />;
}
export function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-description" className={cn("col-start-2 grid gap-1 text-sm text-ds-muted-foreground", className)} {...props} />;
}

/* ── Kbd ── */
export function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn("pointer-events-none inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded-ds-sm border bg-ds-muted px-1 font-mono text-[11px] font-medium text-ds-muted-foreground select-none", className)}
      {...props}
    />
  );
}

/* ── Progress ── */
export function Progress({ className, value, indicatorClassName, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }) {
  return (
    <ProgressPrimitive.Root data-slot="progress" className={cn("relative h-2 w-full overflow-hidden rounded-full bg-ds-muted", className)} value={value} {...props}>
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full w-full flex-1 bg-ds-primary transition-transform duration-(--ds-duration-slow) ease-(--ds-ease-standard)", indicatorClassName)}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
