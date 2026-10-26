"use client";

import {
  Dialog as DialogPrimitive,
  AlertDialog as AlertDialogPrimitive,
  Popover as PopoverPrimitive,
  Tooltip as TooltipPrimitive,
  HoverCard as HoverCardPrimitive,
} from "radix-ui";
import { Drawer as DrawerPrimitive } from "vaul";
import { X } from "lucide-react";
import { useDsPortal } from "../provider";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";

// Overlays: Dialog, AlertDialog, Sheet, Drawer, Popover, Tooltip, HoverCard.
// Each portals into the Aura root (useDsPortal) so it keeps the system's tokens.

const overlay = "fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] data-[state=open]:[animation:ds-in_var(--ds-duration-base)]";
const floating = "z-50 rounded-ds-md border bg-ds-popover text-ds-popover-foreground shadow-ds-3 outline-none data-[state=open]:ds-animate-in";

/* ── Dialog ── */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export function DialogContent({ className, children, showClose = true, ...props }: React.ComponentProps<typeof DialogPrimitive.Content> & { showClose?: boolean }) {
  return (
    <DialogPrimitive.Portal container={useDsPortal()}>
      <DialogPrimitive.Overlay className={overlay} />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-ds-xl border bg-ds-background p-6 shadow-ds-4 duration-(--ds-duration-base) sm:max-w-lg data-[state=open]:ds-animate-in",
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close className="absolute top-4 right-4 rounded-ds-sm p-1 text-ds-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ds-ring/30 focus-visible:outline-none">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
export function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)} {...props} />;
}
export function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}
export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("text-lg leading-none font-semibold", className)} {...props} />;
}
export function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-sm text-ds-muted-foreground", className)} {...props} />;
}

/* ── AlertDialog ── */
export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export function AlertDialogContent({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal container={useDsPortal()}>
      <AlertDialogPrimitive.Overlay className={overlay} />
      <AlertDialogPrimitive.Content
        className={cn("fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-ds-xl border bg-ds-background p-6 shadow-ds-4 sm:max-w-md data-[state=open]:ds-animate-in", className)}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  );
}
export const AlertDialogHeader = DialogHeader;
export const AlertDialogFooter = DialogFooter;
export function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return <AlertDialogPrimitive.Title className={cn("text-lg font-semibold", className)} {...props} />;
}
export function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return <AlertDialogPrimitive.Description className={cn("text-sm text-ds-muted-foreground", className)} {...props} />;
}
export function AlertDialogAction({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return <AlertDialogPrimitive.Action className={cn(buttonVariants(), className)} {...props} />;
}
export function AlertDialogCancel({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return <AlertDialogPrimitive.Cancel className={cn(buttonVariants({ variant: "outline" }), className)} {...props} />;
}

/* ── Sheet (side panel, built on Dialog) ── */
const sheetSide = {
  right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
  left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
  top: "inset-x-0 top-0 h-auto border-b",
  bottom: "inset-x-0 bottom-0 h-auto border-t",
} as const;
export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export function SheetContent({ className, children, side = "right", ...props }: React.ComponentProps<typeof DialogPrimitive.Content> & { side?: keyof typeof sheetSide }) {
  return (
    <DialogPrimitive.Portal container={useDsPortal()}>
      <DialogPrimitive.Overlay className={overlay} />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        className={cn("fixed z-50 flex flex-col gap-4 bg-ds-background p-6 shadow-ds-4 data-[state=open]:ds-animate-in", sheetSide[side], className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-4 right-4 rounded-ds-sm p-1 text-ds-muted-foreground hover:text-ds-foreground">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
export const SheetHeader = DialogHeader;
export const SheetTitle = DialogTitle;
export const SheetDescription = DialogDescription;

/* ── Drawer (vaul, drag to dismiss on touch) ── */
export const Drawer = DrawerPrimitive.Root;
export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerClose = DrawerPrimitive.Close;
export function DrawerContent({ className, children, ...props }: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPrimitive.Portal container={useDsPortal()}>
      <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/45" />
      <DrawerPrimitive.Content
        className={cn("fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[85vh] flex-col rounded-t-ds-xl border-t bg-ds-background", className)}
        {...props}
      >
        <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-ds-muted" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
}
export function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid gap-1.5 p-4 text-center", className)} {...props} />;
}
export function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />;
}
export function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return <DrawerPrimitive.Title className={cn("font-semibold", className)} {...props} />;
}
export function DrawerDescription({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return <DrawerPrimitive.Description className={cn("text-sm text-ds-muted-foreground", className)} {...props} />;
}

/* ── Popover ── */
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export function PopoverContent({ className, align = "center", sideOffset = 6, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal container={useDsPortal()}>
      <PopoverPrimitive.Content align={align} sideOffset={sideOffset} className={cn(floating, "w-72 p-4", className)} {...props} />
    </PopoverPrimitive.Portal>
  );
}

/* ── Tooltip ── */
export function TooltipProvider({ delayDuration = 200, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export function TooltipContent({ className, sideOffset = 6, children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal container={useDsPortal()}>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn("z-50 w-fit max-w-64 rounded-ds-sm bg-ds-foreground px-2.5 py-1.5 text-xs text-ds-background data-[state=delayed-open]:ds-animate-in", className)}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

/* ── HoverCard ── */
export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;
export function HoverCardContent({ className, align = "center", sideOffset = 6, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal container={useDsPortal()}>
      <HoverCardPrimitive.Content align={align} sideOffset={sideOffset} className={cn(floating, "w-64 p-4", className)} {...props} />
    </HoverCardPrimitive.Portal>
  );
}
