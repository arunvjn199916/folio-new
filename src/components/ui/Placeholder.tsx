import "server-only";
import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";
import { cn } from "@/lib/utils";
import { PlaceholderLabel } from "./PlaceholderLabel";

// Shows the real image when it exists in /public, otherwise a labelled gradient block
// at the same aspect ratio — so swapping in final images never shifts the layout.
// Server-only: checks the file system at build time.
export function Media({
  src,
  alt,
  label,
  tint = "linear-gradient(135deg,#cdb8ff,#a8d8ff)",
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority,
}: {
  src?: string;
  alt: string;
  label: string;
  tint?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const exists = src ? existsSync(path.join(process.cwd(), "public", src)) : false;
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ background: tint }}>
      {exists && src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <PlaceholderLabel label={label} />
      )}
    </div>
  );
}

export const hasImage = (src: string) => existsSync(path.join(process.cwd(), "public", src));
