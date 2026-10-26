// Next.js "preventing flash before hydration" pattern: the script runs during HTML parsing
// (type text/javascript on the server) and is inert on the client (text/plain), so React
// neither warns about a <script> in the tree nor tries to re-run it.
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
