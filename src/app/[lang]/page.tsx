import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Archive } from "@/components/sections/Archive";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Experience } from "@/components/sections/Experience";
import { Crawl } from "@/components/sections/Crawl";
import { HowIWork } from "@/components/sections/HowIWork";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { showTestimonials } from "@/content/extras";

// v2 home, in the reference's order: hero → about → projects → archive → case studies →
// experience → story crawl → how I work → testimonials (once real) → contact.
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <CaseStudies />
      <Archive />
      <Experience />
      <Crawl />
      <HowIWork />
      {showTestimonials && <Testimonials />}
      <Contact />
    </>
  );
}
