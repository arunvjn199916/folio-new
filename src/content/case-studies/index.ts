import type { CaseStudy } from "./types";
import { kairo } from "./kairo";
import { kosh } from "./kosh";
import { tandem } from "./tandem";
import { secondly } from "./secondly";

/** Written case studies by project slug; projects without one render the simple shell. */
export const caseStudies: Record<string, CaseStudy> = Object.fromEntries([kairo, kosh, tandem, secondly].map((c) => [c.slug, c]));
