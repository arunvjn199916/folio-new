export function PlaceholderLabel({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <span className="rounded-full bg-surface/70 px-3 py-1 font-mono text-[11px] tracking-wide text-ink-2 backdrop-blur">
        {label}
      </span>
    </div>
  );
}
