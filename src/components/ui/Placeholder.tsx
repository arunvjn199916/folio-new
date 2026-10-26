import Image from "next/image";
import { cn } from "@/lib/utils";
import { img } from "@/content/images";
import { PlaceholderLabel } from "./PlaceholderLabel";

// Shows the image when it exists in media/images (resolved to its hashed URL), otherwise a
// labelled gradient block at the same aspect ratio — so adding final images never shifts
// the layout.
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
  const url = img(src);
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ background: tint }}>
      {url ? <Image src={url} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" /> : <PlaceholderLabel label={label} />}
    </div>
  );
}
