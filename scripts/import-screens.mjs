// Converts rendered UX Magic screens (PNG) into WebP under media/images/cases/<study>/.
//   node scripts/import-screens.mjs <png-dir> <study>
import sharp from "sharp";
import { mkdirSync, readdirSync } from "node:fs";
import { join, basename, extname } from "node:path";

const [dir, study] = process.argv.slice(2);
if (!dir || !study) throw new Error("usage: node scripts/import-screens.mjs <png-dir> <study>");
const out = join("media/images/cases", study);
mkdirSync(out, { recursive: true });
for (const f of readdirSync(dir).filter((f) => extname(f) === ".png")) {
  await sharp(join(dir, f)).webp({ quality: 82 }).toFile(join(out, `${basename(f, ".png")}.webp`));
}
console.log(`${study}: ${readdirSync(out).length} screens → ${out}`);
