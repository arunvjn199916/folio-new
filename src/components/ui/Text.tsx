import type { ReactNode } from "react";
import type { Segment } from "@/content/profile";
import { cn } from "@/lib/utils";

export function RichText({ segments, highlightClass = "highlighter" }: { segments: Segment[]; highlightClass?: string }) {
  return (
    <>
      {segments.map((s, i) =>
        s.highlight ? (
          <mark key={i} className={cn("bg-transparent text-inherit", highlightClass)}>
            {s.text}
          </mark>
        ) : s.bold ? (
          <strong key={i} className="font-semibold text-ink">
            {s.text}
          </strong>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  );
}

// External links always open safely and only ever point at URLs from content/.
export function ExternalLink({
  href,
  children,
  className,
  ...rest
}: { href: string; children: ReactNode; className?: string } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "target" | "rel"
>) {
  const internal = href.startsWith("/") || href.startsWith("#") || href.startsWith("mailto:");
  return (
    <a
      href={href}
      className={className}
      {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      {...rest}
    >
      {children}
    </a>
  );
}
