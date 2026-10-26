import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { locales, localeMeta } from "@/i18n/config";

const base = "https://arunfolioproductdesigner.netlify.app";
const paths = ["", "/ai-workflow", ...projects.map((p) => `/work/${p.slug}`)];

// Every page in every language, each listing its translations (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
    locales.map((l) => ({
      url: `${base}/${l}${path}`,
      alternates: { languages: Object.fromEntries(locales.map((x) => [localeMeta[x].htmlLang, `${base}/${x}${path}`])) },
    })),
  );
}
