import { Hero } from "@/components/sections/Hero";
import { Shift } from "@/components/sections/Shift";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Toolkit } from "@/components/sections/Toolkit";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Shift />
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
