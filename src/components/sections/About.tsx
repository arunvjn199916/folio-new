import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getDictionary, getLocale } from "@/i18n/server";
import { localePath } from "@/i18n/config";
import { img } from "@/content/images";
import { BlurHeading, Reveal } from "@/components/ui/Motion";

/*
  v2 home About (reference: eezyinn /agency/ hero "WE ARE EEZY INN."). A rounded dark
  panel with the portrait full-bleed behind a dark wash; name, one line, companies and
  "Know more" → the full About page. Dark in both themes, like the reference.
*/
export async function About() {
  const { aboutPage, about, profile, ui } = await getDictionary();
  const locale = await getLocale();
  const portrait = img("about-portrait.webp");

  return (
    <section id="about" className="px-4 py-12 md:px-12 md:py-20">
      <div className="dark-stage relative isolate flex min-h-[78svh] overflow-hidden rounded-[32px] bg-night text-on-night md:rounded-[48px]">
        {portrait && (
          <Image src={portrait} alt="" fill sizes="100vw" className="-z-20 object-cover object-[70%_30%] grayscale-[45%]" />
        )}
        {/* dark wash + brand glow so text always sits on a dark field */}
        <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,0,1,0.96)_0%,rgba(10,0,1,0.86)_38%,rgba(10,0,1,0.35)_75%,rgba(10,0,1,0.15)_100%)] max-md:bg-[linear-gradient(0deg,rgba(10,0,1,0.97)_0%,rgba(10,0,1,0.85)_55%,rgba(10,0,1,0.3)_100%)]" />
        <span aria-hidden className="absolute -bottom-40 -left-20 -z-10 h-[480px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(220,2,8,0.35),transparent)] blur-2xl" />

        <div className="relative mt-auto w-full max-w-[720px] p-6 md:p-14">
          <p className="eyebrow flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#ffef93] shadow-[0_0_8px_rgba(255,239,147,0.8)]" />
            {ui.about.tape}
          </p>
          <BlurHeading className="display-l mt-4">{aboutPage.title}</BlurHeading>
          <Reveal>
            <p data-reveal className="mt-5 max-w-[540px] text-[17px] leading-[1.55] text-on-night/80 md:text-[20px]">
              {aboutPage.line}
            </p>
            <ul data-reveal className="mt-8 flex flex-wrap gap-2">
              {about.workedWith.map((c) => (
                <li key={c} className="rounded-full border border-on-night/20 px-3.5 py-1.5 text-[12px] font-bold tracking-[0.04em] uppercase">
                  {c}
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
