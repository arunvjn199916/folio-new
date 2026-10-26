import { DocsShell } from "@/ds/docs/DocsShell";

// Every design-system page sits inside the Aura root and docs navigation.
export default function DesignSystemLayout({ children }: LayoutProps<"/[lang]/design-system">) {
  return <DocsShell>{children}</DocsShell>;
}
