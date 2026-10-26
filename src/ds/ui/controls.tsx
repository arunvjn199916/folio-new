"use client";

import {
  Checkbox as CheckboxPrimitive,
  RadioGroup as RadioGroupPrimitive,
  Switch as SwitchPrimitive,
  Slider as SliderPrimitive,
  Toggle as TogglePrimitive,
  ToggleGroup as ToggleGroupPrimitive,
  Tabs as TabsPrimitive,
  Accordion as AccordionPrimitive,
  Collapsible as CollapsiblePrimitive,
} from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown } from "lucide-react";
import { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

// Form controls and disclosure: Checkbox, RadioGroup, Switch, Slider, Toggle,
// ToggleGroup, Tabs, Accordion, Collapsible — shadcn structure, Aura tokens.

const focus = "outline-none focus-visible:ring-3 focus-visible:ring-ds-ring/30";

/* ── Checkbox ── */
export function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded-[4px] border border-ds-input bg-ds-background shadow-ds-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-ds-primary data-[state=checked]:bg-ds-primary data-[state=checked]:text-ds-primary-foreground",
        focus,
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="grid place-content-center text-current">
        <Check className="size-3.5" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

/* ── RadioGroup ── */
export function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />;
}
export function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn("aspect-square size-4 shrink-0 rounded-full border border-ds-input bg-ds-background shadow-ds-1 disabled:opacity-50 data-[state=checked]:border-ds-primary", focus, className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="grid place-items-center">
        <span className="size-2 rounded-full bg-ds-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

/* ── Switch ── */
export function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent shadow-ds-1 transition-colors disabled:opacity-50 data-[state=checked]:bg-ds-primary data-[state=unchecked]:bg-ds-input",
        focus,
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-4 rounded-full bg-white shadow-ds-2 transition-transform duration-(--ds-duration-base) ease-(--ds-ease-emphasized) data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0.5" />
    </SwitchPrimitive.Root>
  );
}

/* ── Slider ── */
export function Slider({ className, defaultValue, value, min = 0, max = 100, "aria-label": label, thumbLabels, ...props }: React.ComponentProps<typeof SliderPrimitive.Root> & { /** Per-thumb names for range sliders. */ thumbLabels?: string[] }) {
  const thumbs = (value ?? defaultValue ?? [min]).length;
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn("relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative grow overflow-hidden rounded-full bg-ds-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5">
        <SliderPrimitive.Range className="absolute bg-ds-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbs }, (_, i) => (
        <SliderPrimitive.Thumb key={i} aria-label={thumbLabels?.[i] ?? label} className={cn("block size-4 shrink-0 rounded-full border border-ds-primary bg-ds-background shadow-ds-2 transition-[box-shadow]", focus)} />
      ))}
    </SliderPrimitive.Root>
  );
}

/* ── Toggle / ToggleGroup ── */
export const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-ds-md text-sm font-medium whitespace-nowrap transition-colors hover:bg-ds-muted hover:text-ds-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-ds-accent data-[state=on]:text-ds-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 " +
    focus,
  {
    variants: {
      variant: { default: "bg-transparent", outline: "border border-ds-input bg-transparent shadow-ds-1" },
      size: { sm: "h-8 min-w-8 px-1.5", default: "h-9 min-w-9 px-2", lg: "h-10 min-w-10 px-2.5" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
export function Toggle({ className, variant, size, ...props }: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return <TogglePrimitive.Root data-slot="toggle" className={cn(toggleVariants({ variant, size }), className)} {...props} />;
}
const ToggleGroupContext = createContext<VariantProps<typeof toggleVariants>>({ size: "default", variant: "default" });
export function ToggleGroup({ className, variant, size, children, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root data-slot="toggle-group" className={cn("flex w-fit items-center rounded-ds-md data-[variant=outline]:shadow-ds-1", className)} data-variant={variant} {...props}>
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}
export function ToggleGroupItem({ className, children, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  const ctx = useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(toggleVariants(ctx), "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-ds-md last:rounded-r-ds-md data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l", className)}
      data-variant={ctx.variant}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

/* ── Tabs ── */
export function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props} />;
}
export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List data-slot="tabs-list" className={cn("inline-flex h-9 w-fit items-center justify-center rounded-ds-lg bg-ds-muted p-[3px] text-ds-muted-foreground", className)} {...props} />;
}
export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-ds-md px-3 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] disabled:opacity-50 data-[state=active]:bg-ds-background data-[state=active]:text-ds-foreground data-[state=active]:shadow-ds-1 [&_svg]:size-4",
        focus,
        className,
      )}
      {...props}
    />
  );
}
export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />;
}

/* ── Accordion ── */
export function Accordion(props: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}
export function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn("border-b last:border-b-0", className)} {...props} />;
}
export function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn("flex flex-1 items-start justify-between gap-4 rounded-ds-md py-4 text-left text-sm font-medium transition-all hover:underline disabled:opacity-50 [&[data-state=open]>svg]:rotate-180", focus, className)}
        {...props}
      >
        {children}
        <ChevronDown className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-ds-muted-foreground transition-transform duration-(--ds-duration-base)" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}
export function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content data-slot="accordion-content" className="overflow-hidden text-sm" {...props}>
      <div className={cn("pt-0 pb-4 text-ds-muted-foreground", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

/* ── Collapsible ── */
export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
export const CollapsibleContent = CollapsiblePrimitive.Content;
