import { BlurHeading } from "@/components/ui/Motion";
import { cn } from "@/lib/utils";

/**
 * v2 section header: accent-dot eyebrow + uppercase display heading on the left,
 * optional supporting line on the right (stacks on phones).
 */
export function SectionHead({
  eyebrow,
  title,
  sub,
  size = "l",
  className,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  size?: "l" | "m";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12", className)}>
      <div className="min-w-0">
        <p className="eyebrow flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--c-globe-lit)/0.8)]" />
          {eyebrow}
        </p>
        <BlurHeading className={cn("mt-4 text-ink", size === "l" ? "display-l" : "display-m")}>{title}</BlurHeading>
      </div>
      {sub && <p className="max-w-[380px] shrink-0 text-[16px] leading-[1.5] text-ink-2 md:pb-2 md:text-[17px]">{sub}</p>}
    </div>
  );
}
