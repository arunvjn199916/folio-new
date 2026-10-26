"use client";

import { DayPicker } from "react-day-picker";
import { OTPInput, OTPInputContext } from "input-otp";
import { Group, Panel, Separator as PanelSeparator } from "react-resizable-panels";
import { Toaster as Sonner, toast } from "sonner";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { useContext } from "react";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";

// Calendar (react-day-picker), InputOTP (input-otp), Resizable (react-resizable-panels),
// Toaster (sonner) — the shadcn components that wrap third-party libraries.

/* ── Calendar ── */
export function Calendar({ className, classNames, showOutsideDays = true, ...props }: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-fit p-3 [--cell:2.25rem]", className)}
      classNames={{
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex w-full flex-col gap-3",
        nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between",
        button_previous: cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "size-(--cell) aria-disabled:opacity-40"),
        button_next: cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "size-(--cell) aria-disabled:opacity-40"),
        month_caption: "flex h-(--cell) items-center justify-center px-(--cell)",
        caption_label: "text-sm font-medium",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-(--cell) text-[0.8rem] font-normal text-ds-muted-foreground select-none",
        week: "mt-1.5 flex w-full",
        day: "group relative size-(--cell) p-0 text-center text-sm select-none",
        day_button:
          "inline-flex size-(--cell) items-center justify-center rounded-ds-md transition-colors hover:bg-ds-accent focus-visible:ring-3 focus-visible:ring-ds-ring/30 focus-visible:outline-none group-data-[selected]:bg-ds-primary group-data-[selected]:text-ds-primary-foreground",
        range_middle: "[&>button]:!rounded-none [&>button]:!bg-ds-accent [&>button]:!text-ds-accent-foreground",
        today: "[&>button]:font-semibold [&>button]:underline [&>button]:decoration-ds-primary [&>button]:underline-offset-4",
        outside: "text-ds-muted-foreground",
        disabled: "text-ds-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => (orientation === "left" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />),
      }}
      {...props}
    />
  );
}

/* ── InputOTP ── */
export function InputOTP({ className, containerClassName, ...props }: React.ComponentProps<typeof OTPInput> & { containerClassName?: string }) {
  return <OTPInput containerClassName={cn("flex items-center gap-2 has-disabled:opacity-50", containerClassName)} className={cn("disabled:cursor-not-allowed", className)} {...props} />;
}
export function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center", className)} {...props} />;
}
export function InputOTPSlot({ index, className }: { index: number; className?: string }) {
  const ctx = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = ctx?.slots[index] ?? {};
  return (
    <div
      data-active={isActive}
      className={cn(
        "relative flex size-10 items-center justify-center border-y border-r border-ds-input text-sm shadow-ds-1 transition-all first:rounded-l-ds-md first:border-l last:rounded-r-ds-md data-[active=true]:z-10 data-[active=true]:border-ds-ring data-[active=true]:ring-3 data-[active=true]:ring-ds-ring/20",
        className,
      )}
    >
      {char}
      {hasFakeCaret && <span className="pointer-events-none absolute inset-0 flex items-center justify-center"><span className="h-4 w-px bg-ds-foreground [animation:ds-caret_1s_steps(1)_infinite]" /></span>}
    </div>
  );
}
export function InputOTPSeparator() {
  return <span role="separator" className="h-px w-2.5 bg-ds-muted-foreground" />;
}

/* ── Resizable ── */
export function ResizablePanelGroup({ className, ...props }: React.ComponentProps<typeof Group>) {
  return <Group className={cn("flex h-full w-full aria-[orientation=vertical]:flex-col", className)} {...props} />;
}
export const ResizablePanel = Panel;
export function ResizableHandle({ withHandle, className, ...props }: React.ComponentProps<typeof PanelSeparator> & { withHandle?: boolean }) {
  return (
    <PanelSeparator className={cn("relative flex w-px items-center justify-center bg-ds-border focus-visible:ring-3 focus-visible:ring-ds-ring/30 focus-visible:outline-none", className)} {...props}>
      {withHandle && (
        <div className="z-10 flex h-5 w-3.5 items-center justify-center rounded-ds-sm border bg-ds-border">
          <GripVertical className="size-2.5" />
        </div>
      )}
    </PanelSeparator>
  );
}

/* ── Toaster (sonner) ── */
export function Toaster(props: React.ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "!bg-ds-popover !text-ds-popover-foreground !border-ds-border !shadow-ds-3 !rounded-ds-lg",
          description: "!text-ds-muted-foreground",
          actionButton: "!bg-ds-primary !text-ds-primary-foreground",
          cancelButton: "!bg-ds-muted !text-ds-muted-foreground",
        },
      }}
      {...props}
    />
  );
}
export { toast };
