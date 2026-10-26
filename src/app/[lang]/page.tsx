import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Toolkit } from "@/components/sections/Toolkit";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Media } from "@/components/ui/Placeholder";
import { getDictionary } from "@/i18n/server";

export default async function Home() {
  const { ui } = await getDictionary();
  return (
    <>
      <Hero
        portrait={
          <Media
            src="portrait.webp"
            alt={ui.hero.portraitAlt}
            label="Portrait 4:5"
            className="absolute inset-0"
            tint="linear-gradient(160deg,#cdb8ff,#ffb6d9)"
            sizes="330px"
            priority
          />
        }
      />
      <About />
      <Work />
      <Experience />
      <Skills />
      <Toolkit />
      <Testimonials />
      <Contact />
    </>
  );
}
