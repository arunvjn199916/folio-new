import { getDictionary } from "@/i18n/server";
import { Media } from "@/components/ui/Placeholder";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Motion";

/*
  v2 testimonials (in place of the reference's client tiles): recommendation cards, each
  with a thumbnail (photo, or initials until one is provided), the quote, and name + role.
  Only approved quotes render.
*/
export async function Testimonials() {
  const { testimonials, ui } = await getDictionary();
  const t = ui.testimonialsUi;
  return (
    <section id="testimonials" className="px-4 py-24 md:px-12 md:py-32">
      <SectionHead eyebrow={t.eyebrow} title={t.title} sub={t.sub} />
      <Reveal className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-6">
        {testimonials.filter((q) => q.approved).map((q, i) => (
          <figure key={i} data-reveal className="flex h-full flex-col justify-between gap-10 rounded-[28px] border border-ink/10 bg-card p-6 md:p-10">
            <blockquote className="text-[clamp(20px,1.9vw,28px)] leading-[1.35] font-medium tracking-[-0.02em] text-ink">“{q.quote}”</blockquote>
            <figcaption className="flex items-center gap-4">
              {q.photo ? (
                <Media src={q.photo} alt="" label="" tint={q.tint} className="size-16 shrink-0 rounded-[16px]" sizes="64px" />
              ) : (
                <span aria-hidden className="grid size-16 shrink-0 place-items-center rounded-[16px] font-display text-[20px] font-extrabold text-white" style={{ background: q.tint }}>
                  {q.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              )}
              <span>
                <span className="block text-[16px] font-bold text-ink">{q.name}</span>
                <span className="block text-[14px] text-ink-2">{q.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  );
}
