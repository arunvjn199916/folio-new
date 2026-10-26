"use client";

import { DropdownMenu as DropdownPrimitive, ContextMenu as ContextPrimitive, Select as SelectPrimitive } from "radix-ui";
import { Command as CommandPrimitive } from "cmdk";
import { Check, ChevronDown, ChevronRight, ChevronUp, Search } from "lucide-react";
import { useDsPortal } from "../provider";
import { cn } from "@/lib/utils";

// Menus and pickers: DropdownMenu, ContextMenu, Select, Command (⌘K palette).

const content = "z-50 min-w-[8rem] overflow-hidden rounded-ds-md border bg-ds-popover p-1 text-ds-popover-foreground shadow-ds-3 data-[state=open]:ds-animate-in";
const item =
  "relative flex cursor-default items-center gap-2 rounded-ds-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-ds-accent data-[highlighted]:text-ds-accent-foreground data-[variant=destructive]:text-ds-destructive [&_svg]:size-4 [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-ds-muted-foreground";

/* ── DropdownMenu ── */
export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;
export const DropdownMenuGroup = DropdownPrimitive.Group;
export const DropdownMenuSub = DropdownPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownPrimitive.RadioGroup;
export function DropdownMenuContent({ className, sideOffset = 4, ...props }: React.ComponentProps<typeof DropdownPrimitive.Content>) {
  return (
    <DropdownPrimitive.Portal container={useDsPortal()}>
      <DropdownPrimitive.Content sideOffset={sideOffset} className={cn(content, className)} {...props} />
    </DropdownPrimitive.Portal>
  );
}
export function DropdownMenuItem({ className, variant, inset, ...props }: React.ComponentProps<typeof DropdownPrimitive.Item> & { variant?: "default" | "destructive"; inset?: boolean }) {
  return <DropdownPrimitive.Item data-variant={variant} className={cn(item, inset && "pl-8", className)} {...props} />;
}
export function DropdownMenuCheckboxItem({ className, children, ...props }: React.ComponentProps<typeof DropdownPrimitive.CheckboxItem>) {
  return (
    <DropdownPrimitive.CheckboxItem className={cn(item, "pl-8", className)} {...props}>
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownPrimitive.ItemIndicator>
          <Check />
        </DropdownPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownPrimitive.CheckboxItem>
  );
}
export function DropdownMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof DropdownPrimitive.RadioItem>) {
  return (
    <DropdownPrimitive.RadioItem className={cn(item, "pl-8", className)} {...props}>
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownPrimitive.ItemIndicator>
          <span className="size-2 rounded-full bg-ds-primary" />
        </DropdownPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownPrimitive.RadioItem>
  );
}
export function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof DropdownPrimitive.Label>) {
  return <DropdownPrimitive.Label className={cn("px-2 py-1.5 text-xs font-medium text-ds-muted-foreground", className)} {...props} />;
}
export function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownPrimitive.Separator>) {
  return <DropdownPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-ds-border", className)} {...props} />;
}
export function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("ml-auto text-xs tracking-widest text-ds-muted-foreground", className)} {...props} />;
}
export function DropdownMenuSubTrigger({ className, children, ...props }: React.ComponentProps<typeof DropdownPrimitive.SubTrigger>) {
  return (
    <DropdownPrimitive.SubTrigger className={cn(item, "data-[state=open]:bg-ds-accent", className)} {...props}>
      {children}
      <ChevronRight className="ml-auto" />
    </DropdownPrimitive.SubTrigger>
  );
}
export function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<typeof DropdownPrimitive.SubContent>) {
  return (
    <DropdownPrimitive.Portal container={useDsPortal()}>
      <DropdownPrimitive.SubContent className={cn(content, className)} {...props} />
    </DropdownPrimitive.Portal>
  );
}

/* ── ContextMenu ── */
export const ContextMenu = ContextPrimitive.Root;
export const ContextMenuTrigger = ContextPrimitive.Trigger;
export function ContextMenuContent({ className, ...props }: React.ComponentProps<typeof ContextPrimitive.Content>) {
  return (
    <ContextPrimitive.Portal container={useDsPortal()}>
      <ContextPrimitive.Content className={cn(content, className)} {...props} />
    </ContextPrimitive.Portal>
  );
}
export function ContextMenuItem({ className, variant, ...props }: React.ComponentProps<typeof ContextPrimitive.Item> & { variant?: "default" | "destructive" }) {
  return <ContextPrimitive.Item data-variant={variant} className={cn(item, className)} {...props} />;
}
export function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof ContextPrimitive.Separator>) {
  return <ContextPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-ds-border", className)} {...props} />;
}
export const ContextMenuShortcut = DropdownMenuShortcut;

/* ── Select ── */
export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;
export function SelectTrigger({ className, size = "default", children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger> & { size?: "sm" | "default" }) {
  return (
    <SelectPrimitive.Trigger
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-2 rounded-ds-md border border-ds-input bg-ds-background px-3 py-2 text-sm whitespace-nowrap shadow-ds-1 outline-none focus-visible:border-ds-ring focus-visible:ring-3 focus-visible:ring-ds-ring/20 disabled:opacity-50 data-[placeholder]:text-ds-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
export function SelectContent({ className, children, position = "popper", ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal container={useDsPortal()}>
      <SelectPrimitive.Content
        position={position}
        className={cn(content, "relative max-h-(--radix-select-content-available-height)", position === "popper" && "w-full min-w-(--radix-select-trigger-width) data-[side=bottom]:translate-y-1", className)}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex justify-center py-1">
          <ChevronUp className="size-4" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-0.5">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex justify-center py-1">
          <ChevronDown className="size-4" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
export function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return <SelectPrimitive.Label className={cn("px-2 py-1.5 text-xs text-ds-muted-foreground", className)} {...props} />;
}
export function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item className={cn(item, "w-full pr-8", className)} {...props}>
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
export function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-ds-border", className)} {...props} />;
}

/* ── Command (⌘K) ── */
export function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return <CommandPrimitive className={cn("flex h-full w-full flex-col overflow-hidden rounded-ds-lg bg-ds-popover text-ds-popover-foreground", className)} {...props} />;
}
export function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex h-11 items-center gap-2 border-b px-3">
      <Search className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input className={cn("flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-ds-muted-foreground disabled:opacity-50", className)} {...props} />
    </div>
  );
}
export function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return <CommandPrimitive.List className={cn("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto p-1", className)} {...props} />;
}
export function CommandEmpty(props: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty className="py-6 text-center text-sm text-ds-muted-foreground" {...props} />;
}
export function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn("overflow-hidden p-1 text-ds-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-ds-muted-foreground", className)}
      {...props}
    />
  );
}
export function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-ds-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-ds-accent data-[selected=true]:text-ds-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-ds-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
export function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return <CommandPrimitive.Separator role="none" className={cn("-mx-1 h-px bg-ds-border", className)} {...props} />;
}
export const CommandShortcut = DropdownMenuShortcut;
