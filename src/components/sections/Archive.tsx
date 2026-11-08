import { archive } from "@/content/projects";
import { getDictionary } from "@/i18n/server";
import { img } from "@/content/images";
import { SectionHead } from "@/components/ui/SectionHead";
import { PrismFolderMount } from "./PrismFolderMount";

/** v2 archive: its own section below Projects — header + the openable screen folder. */
export async function Archive() {
  const { ui } = await getDictionary();
  const windows = archive.map((a) => ({ ...a, src: img(a.src) }));
  return (
    <section id="archive" className="relative px-4 pb-16 md:px-12 md:pb-20">
      <SectionHead eyebrow={ui.archive.eyebrow} title={ui.archive.title} sub={ui.archive.sub} size="m" />
      <PrismFolderMount windows={windows} labels={ui.work.folder} />
    </section>
  );
}
