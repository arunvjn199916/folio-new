import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getDictionary, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";
import { img } from "@/content/images";
import { BlurHeading, Reveal } from "@/components/ui/Motion";

/*
  v2 home About (reference: eezyinn /agency/ hero). A rounded dark panel with the portrait
  shown whole (4:5 frame = the photo's own ratio, so nothing is cropped). Personal facts that
  appear nowhere else on the home page — never the hero's name/role, Experience's companies,
  the crawl's career story or How I work's process.
*/
export async function About() {
  const { aboutPage, profile, ui } = await getDictionary();
  const locale = await getLocale();
  // portrait.webp is used only here: the hero traces reachout.webp and /about uses about-portrait.webp
  const portrait = img("portrait.webp");

  return (
    <section id="about" className="px-4 py-12 md:px-12 md:py-20">
      <div className="dark-stage relative isolate grid grid-cols-1 overflow-hidden rounded-[32px] bg-night text-on-night md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] md:rounded-[48px]">
        <span aria-hidden className="absolute -bottom-40 -left-20 -z-10 h-[480px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(220,2,8,0.35),transparent)] blur-2xl" />

        {/* photo card — the whole portrait, not a crop */}
        {portrait && (
          <div className="relative m-4 aspect-[4/5] overflow-hidden rounded-[24px] max-md:mx-auto max-md:w-[min(100%-2rem,420px)] md:order-2 md:m-6 md:self-center md:rounded-[32px]">
            <Image src={portrait} alt={profile.name} fill sizes="(max-width: 768px) 100vw, 36vw" className="object-cover" />
            <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(10,0,1,0.55))]" />
            <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-white uppercase backdrop-blur">
              <span className="size-1.5 rounded-full bg-[#ffef93]" /> {profile.location}
            </span>
          </div>
        )}

        <div className="relative flex flex-col justify-center p-6 pt-2 md:order-1 md:p-14">
          <p className="eyebrow flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#ffef93] shadow-[0_0_8px_rgba(255,239,147,0.8)]" />
            {ui.about.tape}
          </p>
          <BlurHeading className="display-l mt-4 max-w-[14ch]">{aboutPage.homeTitle}</BlurHeading>
          <Reveal>
            <p data-reveal className="mt-5 max-w-[540px] text-[17px] leading-[1.55] text-on-night/80 md:text-[20px]">
              {aboutPage.hook}
            </p>
            <ul data-reveal className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {aboutPage.traits.map((tr, i) => (
                <li key={tr.title} className="rounded-[20px] border border-on-night/15 bg-black/30 p-4 backdrop-blur-md">
                  <span className="font-mono text-[11px] text-[#ffef93]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-2 block text-[15px] leading-tight font-bold tracking-[-0.01em]">{tr.title}</span>
                  <span className="mt-1.5 block text-[13px] leading-snug text-on-night/70">{tr.body}</span>
                </li>
              ))}
            </ul>
            <div data-reveal className="mt-8 flex flex-wrap gap-3">
              <Link href={localePath(locale, "/about")} className="btn-accent !bg-[#ffef93] !text-[#100001]">
                {aboutPage.more} <ArrowRight size={18} strokeWidth={2.4} />
              </Link>
              <a href={profile.links.resume} target="_blank" rel="noopener" className="btn-outline !border-on-night/30 !bg-transparent !text-on-night hover:!border-on-night">
                {ui.nav.resume} <ArrowUpRight size={18} />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
