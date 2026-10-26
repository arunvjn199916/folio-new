import { getDictionary } from "@/i18n/server";
import { BlurHeading, Reveal } from "@/components/ui/Motion";
import { PlaceholderLabel } from "@/components/ui/PlaceholderLabel";

// Sanjay — "what people say": handwritten notes pinned with a paper clip and a small
// polaroid of the person; each sits slightly askew and straightens up on hover.
export async function Testimonials() {
  const { testimonials, ui } = await getDictionary();
  return (
    <section id="testimonials" className="px-6 py-28">
      <div className="text-center">
        <p className="eyebrow flex items-center justify-center gap-2 text-blue">
          <span className="size-1.5 rounded-full bg-blue" /> {ui.testimonialsUi.eyebrow}
        </p>
        <BlurHeading className="mt-3 font-display text-[clamp(32px,3.8vw,50px)] leading-none font-semibold tracking-[-0.02em]">
          {ui.testimonialsUi.title}
        </BlurHeading>
        <p className="mx-auto mt-3 max-w-[420px] text-[14px] text-ink-2">
          {ui.testimonialsUi.sub}
        </p>
      </div>
      <Reveal
        stagger={0.12}
        className="mx-auto mt-16 grid max-w-[1150px] gap-10 md:grid-cols-3"
      >
        {testimonials.map((t, i) => (
          <div key={i} data-reveal>
            <figure
              className="group relative bg-note p-6 pt-10 shadow-[0_24px_50px_-28px_rgba(26,24,34,0.5)] transition-[translate,rotate] duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] rotate-(--tilt) hover:-translate-y-2 hover:rotate-0"
              style={{ ["--tilt" as string]: `${[-2, 1.5, -1][i % 3]}deg` }}
            >
              {/* paper clip */}
              <svg
                aria-hidden
                width="26"
                height="60"
                viewBox="0 0 26 60"
                className="absolute -top-6 left-8"
              >
                <path
                  d="M8 44V12a5 5 0 0 1 10 0v34a8 8 0 0 1-16 0V16"
                  fill="none"
                  stroke="#9a98a6"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex gap-4">
                <div className="w-[76px] shrink-0 -rotate-3 bg-photo p-1.5 pb-5 shadow-md">
                  <div
                    className="relative aspect-square"
                    style={{ background: t.tint }}
                  >
                    <PlaceholderLabel label="" />
                  </div>
                  <p className="mt-1 text-center font-script text-[13px] leading-none text-on-photo">
                    {t.name.split(" ")[0]}
                  </p>
                </div>
                <blockquote className="font-script text-[21px] leading-[1.25] text-ink">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
              <figcaption className="mt-5 border-t border-dashed border-ink/15 pt-3 text-[12px] text-ink-3">
                <span className="font-semibold text-ink-2">{t.name}</span> ·{" "}
                {t.role}
              </figcaption>
            </figure>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
