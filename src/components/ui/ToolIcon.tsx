import {
  siFigma,
  siCursor,
  siClaude,
  siGooglegemini,
  siPerplexity,
  siV0,
  siNotebooklm,
  siGithub,
  siNetlify,
  siFramer,
  siLottiefiles,
  siNotion,
  siMiro,
  siBehance,
  siX,
  type SimpleIcon,
} from "simple-icons";
import { cn } from "@/lib/utils";

const icons: Record<string, SimpleIcon> = {
  figma: siFigma,
  cursor: siCursor,
  claude: siClaude,
  claudecode: siClaude,
  googlegemini: siGooglegemini,
  gemini: siGooglegemini,
  perplexity: siPerplexity,
  v0: siV0,
  notebooklm: siNotebooklm,
  github: siGithub,
  netlify: siNetlify,
  framer: siFramer,
  lottiefiles: siLottiefiles,
  notion: siNotion,
  miro: siMiro,
  behance: siBehance,
  x: siX,
};

// Brands not in simple-icons get a plain monogram tile instead of their logo.
const monograms: Record<string, { text: string; color: string }> = {
  adobeillustrator: { text: "Ai", color: "#ff9a00" },
  adobephotoshop: { text: "Ps", color: "#31a8ff" },
  linkedin: { text: "in", color: "#ffffff" },
  chatgpt: { text: "GPT", color: "#10a37f" },
  adobexd: { text: "Xd", color: "#ff61f6" },
  balsamiq: { text: "B", color: "#cc0100" },
};

export function ToolIcon({ slug, size = 20, mono, className }: { slug: string; size?: number; mono?: boolean; className?: string }) {
  const key = slug.toLowerCase();
  const icon = icons[key];
  if (icon) {
    return (
      <svg role="img" aria-label={icon.title} viewBox="0 0 24 24" width={size} height={size} className={className}>
        <path d={icon.path} fill={mono ? "currentColor" : `#${icon.hex}`} />
      </svg>
    );
  }
  const m = monograms[key];
  if (!m) return null;
  return (
    <span
      role="img"
      aria-label={key}
      className={cn("grid place-items-center rounded-[5px] font-sans font-bold", className)}
      style={{ width: size, height: size, fontSize: size * (m.text.length > 2 ? 0.34 : 0.48), background: "#1a1822", color: m.color }}
    >
      {m.text}
    </span>
  );
}

export const toolSlug = (name: string) =>
  ({ Figma: "figma", Cursor: "cursor", Claude: "claude", "Claude Code": "claudecode", "Adobe XD": "adobexd", ChatGPT: "chatgpt", Gemini: "googlegemini", GitHub: "github", Netlify: "netlify", Framer: "framer", Miro: "miro" })[
    name
  ] ?? name.toLowerCase();
