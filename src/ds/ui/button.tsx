import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// shadcn Button, re-tokened for Aura. Adds an `ai` variant (gradient, for actions that
// hand work to the model) and a `loading` state that keeps the width stable.
export const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-ds-md text-sm font-medium transition-[color,background-color,box-shadow,opacity] duration-(--ds-duration-fast) outline-none select-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-ds-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-ds-primary text-ds-primary-foreground shadow-ds-1 hover:bg-ds-primary/90",
        secondary: "bg-ds-secondary text-ds-secondary-foreground hover:bg-ds-secondary/80",
        outline: "border border-ds-input bg-ds-background shadow-ds-1 hover:bg-ds-accent hover:text-ds-accent-foreground",
        ghost: "hover:bg-ds-accent hover:text-ds-accent-foreground",
        destructive: "bg-ds-destructive text-ds-destructive-foreground shadow-ds-1 hover:bg-ds-destructive/90",
        link: "text-ds-primary underline-offset-4 hover:underline",
        ai: "bg-(image:--ds-ai-gradient) text-white shadow-ds-2 hover:opacity-95",
      },
      size: {
        sm: "h-8 gap-1.5 px-3 text-[13px]",
        default: "h-9 px-4",
        lg: "h-10 px-6",
        icon: "size-9",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render as the child element (e.g. a link) instead of a <button>. */
    asChild?: boolean;
    /** Shows a spinner, keeps the width, and disables the button. */
    loading?: boolean;
  };

export function Button({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <span className="inline-flex items-center gap-2 opacity-0">{children}</span>
          <span aria-hidden className="absolute inset-0 grid place-items-center">
            <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          </span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}
