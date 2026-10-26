"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/client";

export default function NotFound() {
  const { dict, href } = useI18n();
  return (
    <section className="grid min-h-svh place-items-center px-6 text-center">
      <div>
        <p className="font-display text-[120px] leading-none font-semibold text-ink/10">404</p>
        <p className="mt-2 font-serif text-[28px]">{dict.ui.notFound.title}</p>
        <Link href={href("/")} className="mt-6 inline-flex rounded-full bg-ink px-5 py-2.5 text-[14px] text-on-ink">
          {dict.ui.notFound.home}
        </Link>
      </div>
    </section>
  );
}
