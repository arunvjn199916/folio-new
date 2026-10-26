"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ALargeSmall,
  ArrowRightToLine,
  AudioLines,
  BookOpen,
  BotMessageSquare,
  ChevronRight,
  Contrast,
  Droplet,
  Droplets,
  EyeOff,
  Eye,
  Focus,
  Glasses,
  Hand,
  Heading,
  Highlighter,
  ImageOff,
  Link,
  Link2,
  Maximize2,
  MessageSquareText,
  Minus,
  Monitor,
  Moon,
  MousePointer2,
  MousePointerClick,
  MoveHorizontal,
  Palette,
  Pause,
  Plus,
  RotateCcw,
  Rows3,
  ScanEye,
  SquareDashed,
  Sun,
  Target,
  Type,
  VolumeX,
  X,
  Zap,
  ZoomIn,
  type LucideProps,
} from "lucide-react";
import { useI18n } from "@/i18n/client";
import { a11y, useA11y } from "@/lib/a11y/store";
import { PROFILE_IDS, STEPS, SWATCHES, type A11ySettings, type ProfileId } from "@/lib/a11y/model";
import { theme, type ThemePref } from "@/lib/theme";
import { LanguageSwitcher } from "@/components/global/LanguageSwitcher";
import { OPEN_CHAT_EVENT } from "@/components/chat/ChatWidget";
import { OPEN_A11Y_EVENT } from "./A11yTrigger";
import { cn } from "@/lib/utils";

type Icon = ComponentType<LucideProps>;
const PROFILE_ICONS: Record<ProfileId, Icon> = {
  seizure: Zap,
  lowVision: Eye,
  adhd: Focus,
  cognitive: Target,
  keyboard: ArrowRightToLine,
  screenReader: AudioLines,
  olderAdults: Glasses,
};
const SECTION_IDS = ["top", "about", "work", "experience", "skills", "tools", "contact"] as const;

/*
  accessiBe reference: header (close · language · title · Reset / Statement / Hide), an
  AI Assistant card, one-tap profiles (OFF/ON), then Content, Colour and Orientation
  tiles. Every control maps to the typed settings model; nothing here touches the DOM
  directly — applyA11y + a11y.css do. Opened from the nav button (OPEN_A11Y_EVENT) or
  Alt+A from anywhere (which also un-hides the nav button).
*/
export function A11yPanel() {
  const { dict } = useI18n();
  const t = dict.ui.a11y;
  const s = useA11y();
  const [open, setOpen] = useState(false);
  const [statement, setStatement] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  // whatever had focus when the panel opened (the nav button, usually) gets it back on close
  const returnFocus = useRef<HTMLElement | null>(null);

  // Apply saved settings once on load (the head script already did, this syncs the store).
  useEffect(() => a11y.set({}), []);

  const openPanel = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) returnFocus.current = document.activeElement;
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setStatement(false);
    requestAnimationFrame(() => returnFocus.current?.focus());
  }, []);

  useEffect(() => {
    window.addEventListener(OPEN_A11Y_EVENT, openPanel);
    return () => window.removeEventListener(OPEN_A11Y_EVENT, openPanel);
  }, [openPanel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "a" || e.key === "A" || e.code === "KeyA")) {
        e.preventDefault();
        if (a11y.get().hidden) a11y.set({ hidden: false });
        if (open) close();
        else openPanel();
      } else if (e.key === "Escape" && open) {
        if (statement) setStatement(false);
        else close();
      } else if (e.key === "Tab" && open && panel.current) {
        // keep focus inside the dialog
        const f = panel.current.querySelectorAll<HTMLElement>('button, [href], select, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, statement, close, openPanel]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus());
  }, [open]);

  const set = (patch: Partial<A11ySettings>) => a11y.set(patch);
  const flip = (key: keyof A11ySettings) => set({ [key]: !s[key] } as Partial<A11ySettings>);

  const stepper = (key: keyof typeof STEPS, dir: 1 | -1) => {
    const cfg = STEPS[key];
    const cur = s[key] as number;
    let next: number;
    if (key === "lineHeight") next = cur === 0 ? (dir > 0 ? STEPS.lineHeight.base : 0) : cur + dir * cfg.step;
    else next = cur + dir * cfg.step;
    if (key === "lineHeight" && next < STEPS.lineHeight.base) next = 0;
    next = Math.round(Math.min(cfg.max, Math.max(cfg.min, next)) * 100) / 100;
    set({ [key]: next } as Partial<A11ySettings>);
  };
  const stepLabel = (key: keyof typeof STEPS) => {
    const v = s[key] as number;
    if (key === "lineHeight") return v === 0 ? t.default : `${v}×`;
    if (key === "letterSpacing") return v === 0 ? t.default : `+${Math.round(v * 100)}%`;
    return v === 1 ? t.default : `${Math.round(v * 100)}%`;
  };

  return (
    <div className="a11y-ui">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-title"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            data-lenis-prevent
            className="fixed inset-2 z-[90] flex flex-col overflow-hidden rounded-[28px] bg-[#eef0f6] text-[#14121a] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.5)] sm:inset-auto sm:top-4 sm:right-4 sm:bottom-4 sm:w-[460px]"
          >
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* header */}
              <div className="bg-gradient-to-b from-[#6b4cff] to-[#7b5cff] px-5 pt-4 pb-20 text-white">
                <div className="flex items-center justify-between">
                  <button data-autofocus onClick={close} aria-label={t.close} className="grid size-9 place-items-center rounded-full hover:bg-white/15">
                    <X size={22} />
                  </button>
                  <LanguageSwitcher variant="panel" />
                </div>
                <h2 id="a11y-title" className="mt-3 text-center font-display text-[26px] font-semibold">
                  {t.title}
                </h2>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <HeaderButton icon={RotateCcw} label={t.reset} onClick={() => a11y.reset()} />
                  <HeaderButton icon={MessageSquareText} label={t.statement} onClick={() => setStatement(true)} />
                  <HeaderButton
                    icon={EyeOff}
                    label={t.hide}
                    onClick={() => {
                      set({ hidden: true });
                      close();
                    }}
                  />
                </div>
              </div>

              <div className="-mt-14 space-y-4 px-4 pb-6">
                {/* AI assistant */}
                <button
                  onClick={() => {
                    close();
                    window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
                  }}
                  className="flex w-full items-center gap-4 rounded-[20px] border border-black/10 bg-white p-4 text-left shadow-sm transition hover:border-[#7b5cff]"
                >
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#e8e3ff] text-[#5b3df5]">
                    <BotMessageSquare size={26} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-semibold">{t.assistantTitle}</span>
                    <span className="block text-[13px] text-black/60">{t.assistantSub}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[13px] font-medium whitespace-nowrap">
                    {t.startChat} <ChevronRight size={16} />
                  </span>
                </button>

                {/* profiles */}
                <Card title={t.profilesTitle}>
                  <ul className="divide-y divide-black/[0.07]">
                    {PROFILE_IDS.map((id) => {
                      const P = PROFILE_ICONS[id];
                      const on = s.profiles.includes(id);
                      return (
                        <li key={id} className="flex items-center gap-4 py-3.5">
                          <OnOff on={on} onLabel={t.on} offLabel={t.off} label={t.profiles[id].title} onChange={(v) => a11y.toggleProfile(id, v)} />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[15px] font-medium">{t.profiles[id].title}</span>
                            <span className="block text-[12.5px] text-black/55">{t.profiles[id].sub}</span>
                          </span>
                          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-black/[0.05]">
                            <P size={17} />
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </Card>

                {/* content */}
                <Card title={t.content}>
                  <div className="grid grid-cols-3 gap-2.5">
                    <Stepper wide icon={Maximize2} label={t.controls.contentScale} value={stepLabel("contentScale")} onDec={() => stepper("contentScale", -1)} onInc={() => stepper("contentScale", 1)} dec={t.decrease} inc={t.increase} />
                    <Tile icon={Type} label={t.controls.readableFont} active={s.readableFont} onClick={() => flip("readableFont")} />
                    <Tile icon={Heading} label={t.controls.highlightTitles} active={s.highlightTitles} onClick={() => flip("highlightTitles")} />
                    <Tile icon={Link} label={t.controls.highlightLinks} active={s.highlightLinks} onClick={() => flip("highlightLinks")} />
                    <Tile icon={ZoomIn} label={t.controls.textMagnifier} active={s.textMagnifier} onClick={() => flip("textMagnifier")} />
                    <Stepper wide icon={ALargeSmall} label={t.controls.fontScale} value={stepLabel("fontScale")} onDec={() => stepper("fontScale", -1)} onInc={() => stepper("fontScale", 1)} dec={t.decrease} inc={t.increase} />
                    <Tile icon={AlignCenter} label={t.controls.alignCenter} active={s.align === "center"} onClick={() => set({ align: s.align === "center" ? "default" : "center" })} />
                    <Stepper wide icon={Rows3} label={t.controls.lineHeight} value={stepLabel("lineHeight")} onDec={() => stepper("lineHeight", -1)} onInc={() => stepper("lineHeight", 1)} dec={t.decrease} inc={t.increase} />
                    <Tile icon={AlignLeft} label={t.controls.alignLeft} active={s.align === "left"} onClick={() => set({ align: s.align === "left" ? "default" : "left" })} />
                    <Stepper wide icon={MoveHorizontal} label={t.controls.letterSpacing} value={stepLabel("letterSpacing")} onDec={() => stepper("letterSpacing", -1)} onInc={() => stepper("letterSpacing", 1)} dec={t.decrease} inc={t.increase} />
                    <Tile icon={AlignRight} label={t.controls.alignRight} active={s.align === "right"} onClick={() => set({ align: s.align === "right" ? "default" : "right" })} />
                  </div>
                </Card>

                {/* colour */}
                <Card title={t.color}>
                  <ThemeRow labels={dict.ui.theme} />
                  <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                    <Tile icon={Moon} label={t.controls.darkContrast} active={s.contrast === "dark"} onClick={() => set({ contrast: s.contrast === "dark" ? "none" : "dark" })} />
                    <Tile icon={Sun} label={t.controls.lightContrast} active={s.contrast === "light"} onClick={() => set({ contrast: s.contrast === "light" ? "none" : "light" })} />
                    <Tile icon={Contrast} label={t.controls.highContrast} active={s.contrast === "high"} onClick={() => set({ contrast: s.contrast === "high" ? "none" : "high" })} />
                    <Tile icon={Droplet} label={t.controls.highSaturation} active={s.saturation === "high"} onClick={() => set({ saturation: s.saturation === "high" ? "none" : "high" })} />
                    <Swatches label={t.controls.textColor} value={s.textColor} onPick={(c) => set({ textColor: c, inkAuto: false })} cancel={t.cancel} />
                    <Tile icon={Droplets} label={t.controls.monochrome} active={s.saturation === "mono"} onClick={() => set({ saturation: s.saturation === "mono" ? "none" : "mono" })} />
                    <Swatches label={t.controls.titleColor} value={s.titleColor} onPick={(c) => set({ titleColor: c, inkAuto: false })} cancel={t.cancel} />
                    <Tile icon={Palette} label={t.controls.lowSaturation} active={s.saturation === "low"} onClick={() => set({ saturation: s.saturation === "low" ? "none" : "low" })} />
                    <Swatches label={t.controls.bgColor} value={s.bgColor} onPick={(c) => a11y.setBackground(c)} cancel={t.cancel} />
                  </div>
                </Card>

                {/* orientation */}
                <Card title={t.orientation}>
                  <div className="grid grid-cols-3 gap-2.5">
                    <Tile icon={VolumeX} label={t.controls.muteSounds} active={s.muteSounds} onClick={() => flip("muteSounds")} />
                    <Tile icon={ImageOff} label={t.controls.hideImages} active={s.hideImages} onClick={() => flip("hideImages")} />
                    <Tile icon={BookOpen} label={t.controls.readMode} active={s.readMode} onClick={() => flip("readMode")} />
                    <Tile icon={Highlighter} label={t.controls.readingGuide} active={s.readingGuide} onClick={() => flip("readingGuide")} />
                    <div className="col-span-2 flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#f4f5f9] p-3">
                      <span className="flex items-center gap-2 text-[13px] font-medium">
                        <Link2 size={16} /> {t.controls.usefulLinks}
                      </span>
                      <select
                        aria-label={t.controls.usefulLinks}
                        defaultValue=""
                        onChange={(e) => {
                          const id = e.target.value;
                          if (!id) return;
                          close();
                          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                          e.target.value = "";
                        }}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-[13px]"
                      >
                        <option value="">{t.controls.selectOption}</option>
                        {SECTION_IDS.map((id) => (
                          <option key={id} value={id}>
                            {t.links[id]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Tile icon={Pause} label={t.controls.stopAnimations} active={s.stopAnimations} onClick={() => flip("stopAnimations")} />
                    <Tile icon={SquareDashed} label={t.controls.readingMask} active={s.readingMask} onClick={() => flip("readingMask")} />
                    <Tile icon={MousePointerClick} label={t.controls.highlightHover} active={s.highlightHover} onClick={() => flip("highlightHover")} />
                    <Tile icon={ScanEye} label={t.controls.highlightFocus} active={s.highlightFocus} onClick={() => flip("highlightFocus")} />
                    <Tile icon={MousePointer2} label={t.controls.bigBlackCursor} active={s.cursor === "black"} onClick={() => set({ cursor: s.cursor === "black" ? "default" : "black" })} />
                    <Tile icon={Hand} label={t.controls.bigWhiteCursor} active={s.cursor === "white"} onClick={() => set({ cursor: s.cursor === "white" ? "default" : "white" })} />
                  </div>
                </Card>
              </div>
            </div>

            <button
              onClick={() => setStatement(true)}
              className="flex items-center justify-center gap-1 bg-[#6b4cff] py-3 text-[14px] font-medium text-white hover:bg-[#5b3df5]"
            >
              {t.footer} <ChevronRight size={15} />
            </button>

            {/* statement */}
            <AnimatePresence>
              {statement && (
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="a11y-statement-title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex items-end bg-black/40 sm:items-center"
                >
                  <motion.div initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} className="m-3 max-h-[80%] overflow-y-auto rounded-[22px] bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 id="a11y-statement-title" className="font-display text-[20px] font-semibold">
                        {t.statementTitle}
                      </h3>
                      <button onClick={() => setStatement(false)} aria-label={t.statementClose} className="grid size-8 place-items-center rounded-full hover:bg-black/5">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="mt-3 space-y-3 text-[14px] leading-relaxed text-black/75">
                      {t.statementBody.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* screen-reader confirmation when the interface is hidden */}
      <p className="sr-only" aria-live="polite">
        {s.hidden ? t.hiddenNote : ""}
      </p>
    </div>
  );
}

function HeaderButton({ icon: I, label, onClick }: { icon: Icon; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center justify-center gap-1.5 rounded-full bg-white px-2 py-2.5 text-[12.5px] font-medium text-[#5b3df5] transition hover:bg-white/90">
      <I size={15} /> <span className="truncate">{label}</span>
    </button>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[22px] bg-white p-4 shadow-sm">
      <h3 className="mb-3 px-1 text-[16px] font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function OnOff({ on, onChange, onLabel, offLabel, label }: { on: boolean; onChange: (v: boolean) => void; onLabel: string; offLabel: string; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="relative grid h-9 w-[104px] shrink-0 grid-cols-2 items-center rounded-full bg-[#eef0f6] p-1 text-[11px] font-bold"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={cn("absolute top-1 bottom-1 w-[48px] rounded-full shadow", on ? "right-1 bg-[#6b4cff]" : "left-1 bg-white")}
      />
      <span className={cn("relative z-10 text-center", on ? "text-black/45" : "text-black")}>{offLabel}</span>
      <span className={cn("relative z-10 text-center", on ? "text-white" : "text-black/45")}>{onLabel}</span>
    </button>
  );
}

function Tile({ icon: I, label, active, onClick }: { icon: Icon; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-2xl border-2 p-2 text-center text-[12.5px] leading-tight transition",
        active ? "border-[#6b4cff] bg-[#efeaff] text-[#3d22c9]" : "border-transparent bg-[#f4f5f9] hover:border-black/10",
      )}
    >
      <I size={19} />
      {label}
    </button>
  );
}

function Stepper({
  icon: I,
  label,
  value,
  onDec,
  onInc,
  dec,
  inc,
  wide,
}: {
  icon: Icon;
  label: string;
  value: string;
  onDec: () => void;
  onInc: () => void;
  dec: string;
  inc: string;
  wide?: boolean;
}) {
  return (
    <div className={cn("flex flex-col justify-center gap-2.5 rounded-2xl bg-[#f4f5f9] p-3", wide && "col-span-2")}>
      <span className="flex items-center justify-center gap-2 text-[13px] font-medium">
        <I size={16} /> {label}
      </span>
      <div className="flex items-center justify-between">
        <button onClick={onDec} aria-label={`${dec} ${label}`} className="grid size-8 place-items-center rounded-full bg-[#6b4cff] text-white hover:bg-[#5b3df5]">
          <Minus size={15} />
        </button>
        <span className="text-[12.5px] font-medium text-[#5b3df5]" aria-live="polite">
          {value}
        </span>
        <button onClick={onInc} aria-label={`${inc} ${label}`} className="grid size-8 place-items-center rounded-full bg-[#6b4cff] text-white hover:bg-[#5b3df5]">
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

function Swatches({ label, value, onPick, cancel }: { label: string; value: string | null; onPick: (c: string | null) => void; cancel: string }) {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#f4f5f9] p-3">
      <span className="text-[13px] font-medium">{label}</span>
      <div className="flex flex-wrap justify-center gap-1.5" role="radiogroup" aria-label={label}>
        {SWATCHES.map((c) => (
          <button
            key={c}
            role="radio"
            aria-checked={value === c}
            aria-label={c}
            onClick={() => onPick(c)}
            className={cn("size-6 rounded-full border border-black/15 transition", value === c && "ring-2 ring-[#6b4cff] ring-offset-2")}
            style={{ background: c }}
          />
        ))}
      </div>
      <button onClick={() => onPick(null)} className="text-[12px] text-black/55 hover:text-black">
        {cancel}
      </button>
    </div>
  );
}

const getThemePref = () => theme.get();
const serverThemePref = () => "system" as ThemePref;

function ThemeRow({ labels }: { labels: { label: string; system: string; light: string; dark: string } }) {
  const pref = useSyncExternalStore(theme.subscribe, getThemePref, serverThemePref);
  const options: { id: ThemePref; label: string; icon: Icon }[] = [
    { id: "system", label: labels.system, icon: Monitor },
    { id: "light", label: labels.light, icon: Sun },
    { id: "dark", label: labels.dark, icon: Moon },
  ];
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#f4f5f9] p-2">
      <span className="pl-2 text-[13px] font-medium">{labels.label}</span>
      <div role="radiogroup" aria-label={labels.label} className="ml-auto flex gap-1 rounded-full bg-white p-1">
        {options.map((o) => (
          <button
            key={o.id}
            role="radio"
            aria-checked={pref === o.id}
            onClick={() => theme.set(o.id)}
            className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition", pref === o.id ? "bg-[#6b4cff] text-white" : "text-black/60 hover:text-black")}
          >
            <o.icon size={13} /> {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
