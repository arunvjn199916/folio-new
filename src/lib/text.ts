// Text helpers that respect how scripts are shaped.
//
// Brahmic scripts (Devanagari, Tamil, …) build each visible letter from several code
// points — consonant + vowel sign + virama + conjunct — and the font shapes them together.
// Wrapping individual characters (or even graphemes) in separate inline-blocks breaks that
// shaping, so animations split those scripts by word and everything else by grapheme.

const BRAHMIC = /[ऀ-෿]/; // Devanagari … Sinhala, incl. Tamil (U+0B80–U+0BFF)

export const isComplexScript = (text: string) => BRAHMIC.test(text);

/** User-perceived characters (keeps emoji, accents and combining marks intact). */
export function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)].map((s) => s.segment);
  }
  return [...text];
}

/** Units to animate inside one word: the whole word for Brahmic text, else its graphemes. */
export const animationUnits = (word: string) => (isComplexScript(word) ? [word] : graphemes(word));

/** GSAP SplitText `type` that is safe for the given text. */
export const splitTypeFor = (text: string, wanted: "words" | "chars") =>
  wanted === "chars" && !isComplexScript(text) ? "words,chars" : "words";
