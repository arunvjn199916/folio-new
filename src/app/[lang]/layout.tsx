import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist, Instrument_Serif, Caveat, DM_Mono, Noto_Sans_Tamil, Noto_Sans_Devanagari, Atkinson_Hyperlegible_Next } from "next/font/google";
import { Grainient } from "@/components/global/Grainient";
import { DotGlow } from "@/components/global/DotGlow";
import { SmoothScroll } from "@/components/global/SmoothScroll";
import { Nav } from "@/components/global/Nav";
import { MusicPlayer } from "@/components/global/MusicPlayer";
import { Loader } from "@/components/loader/Loader";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { A11yPanel } from "@/components/a11y/A11yPanel";
import { A11yOverlays } from "@/components/a11y/A11yOverlays";
import { I18nProvider } from "@/i18n/client";
import { getDictionary, getLocale } from "@/i18n/server";
import { locales, localeMeta } from "@/i18n/config";
import { headScript } from "@/lib/preferences/headScript";
import { InlineScript } from "@/components/global/InlineScript";
import "../globals.css";
import "../a11y.css";

const clash = localFont({
  src: "../../fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash",
  weight: "200 700",
  display: "swap",
});
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });
const dmMono = DM_Mono({ variable: "--font-dm-mono", subsets: ["latin"], weight: ["400", "500"] });
// Clash/Geist are Latin-only; these cover Tamil and Hindi text (unicode-range scoped, so
// they only download when those scripts actually appear on the page).
const notoTamil = Noto_Sans_Tamil({ variable: "--font-noto-tamil", subsets: ["tamil"], weight: ["400", "600", "700"] });
const notoDeva = Noto_Sans_Devanagari({ variable: "--font-noto-deva", subsets: ["devanagari"], weight: ["400", "600", "700"] });
// Used only by the "Readable font" accessibility adjustment.
const readable = Atkinson_Hyperlegible_Next({ variable: "--font-readable", subsets: ["latin"], preload: false, adjustFontFallback: false });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary();
  return {
    metadataBase: new URL("https://arunfolioproductdesigner.netlify.app"),
    title: dict.ui.meta.title,
    description: dict.ui.meta.description,
    openGraph: { title: dict.ui.meta.title, description: dict.ui.meta.description, type: "website", locale: localeMeta[locale].og },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [localeMeta[l].htmlLang, `/${l}`])),
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0d15" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const dict = await getDictionary();
  const fonts = [clash, geist, instrument, caveat, dmMono, notoTamil, notoDeva, readable].map((f) => f.variable).join(" ");

  return (
    // data-theme / data-a11y-* are set by the head script before paint, so the server
    // markup intentionally differs from the DOM React hydrates.
    <html lang={localeMeta[locale].htmlLang} className={fonts} suppressHydrationWarning>
      <head>
        <InlineScript html={headScript} />
      </head>
      <body>
        <I18nProvider locale={locale} dict={dict}>
          <a href="#main" className="skip-link">
            {dict.ui.skipToContent}
          </a>
          <Grainient />
          <DotGlow />
          <SmoothScroll />
          <Loader />
          <Nav />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <MusicPlayer />
          <ChatWidget />
          <A11yPanel />
          <A11yOverlays />
        </I18nProvider>
      </body>
    </html>
  );
}
