import { notFound } from "next/navigation";

// Any unknown path under a locale renders the localised v2 not-found page.
// It always 404s, so there is nothing to validate for instant navigation.
export const instant = false;

export default function CatchAll() {
  notFound();
}
