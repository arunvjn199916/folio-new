import type { CaseStudy } from "./types";
import { kairo } from "./kairo";
import { kosh } from "./kosh";
import { tandem } from "./tandem";
import { secondly } from "./secondly";
import { orion } from "./orion";
import { myir } from "./myir";
import { magnil } from "./magnil";
import { zeroq } from "./zeroq";
import { baby } from "./baby";
import { harborWeb, harborApp } from "./harbor";

/** Written case studies by project slug; projects without one render the simple shell. */
export const caseStudies: Record<string, CaseStudy> = Object.fromEntries([kairo, kosh, tandem, secondly, orion, myir, magnil, zeroq, baby, harborWeb, harborApp].map((c) => [c.slug, c]));
