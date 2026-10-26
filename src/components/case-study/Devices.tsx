import Image from "next/image";
import { img } from "@/content/images";
import { PlaceholderLabel } from "@/components/ui/PlaceholderLabel";
import { cn } from "@/lib/utils";

// Our own device art (no vendor frame images): a phone with a dynamic island and a
// browser window. Screens are exported at 390×844 / 1440×900, so the frames hold those
// ratios exactly and the exported image sits inside without cropping.

export function Phone({ src, alt, className, sizes = "280px", priority }: { src: string; alt: string; className?: string; sizes?: string; priority?: boolean }) {
  const url = img(src);
  return (
    <div
      className={cn(
        "relative rounded-[15%/7%] bg-[#0e0d12] p-[3.2%] shadow-[0_30px_60px_-30px_rgba(20,16,40,0.55),inset_0_0_0_1.5px_#3a3842,inset_0_0_0_3px_#16151b]",
        className,
      )}
    >
      <div className="relative aspect-[390/844] overflow-hidden rounded-[12.5%/5.8%] bg-[#f4f3f1]">
        {url ? <Image src={url} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" /> : <PlaceholderLabel label={alt} />}
        <span aria-hidden className="absolute top-[1.6%] left-1/2 h-[3.3%] w-[30%] -translate-x-1/2 rounded-full bg-[#0e0d12]" />
      </div>
    </div>
  );
}

export function Browser({ src, alt, className, sizes = "(max-width: 768px) 100vw, 1100px" }: { src: string; alt: string; className?: string; sizes?: string }) {
  const url = img(src);
  return (
    <div className={cn("overflow-hidden rounded-[14px] border border-black/10 bg-white shadow-[0_30px_70px_-35px_rgba(20,16,40,0.45)]", className)}>
      <div className="flex h-8 items-center gap-1.5 border-b border-black/[0.06] bg-[#f5f4f7] px-3">
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />
        ))}
        <span className="mx-auto h-4 w-[40%] rounded-full bg-black/[0.06]" />
      </div>
      <div className="relative aspect-[1440/900] bg-[#f4f3f1]">
        {url ? <Image src={url} alt={alt} fill sizes={sizes} className="object-cover object-top" /> : <PlaceholderLabel label={alt} />}
      </div>
    </div>
  );
}
