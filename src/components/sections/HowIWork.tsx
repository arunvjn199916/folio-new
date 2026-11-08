import { getDictionary } from "@/i18n/server";
import { ProcessSteps } from "./ProcessSteps";

/** Home "How I work" (reference: "FROM BOTTLENECK TO RESULT."). */
export async function HowIWork() {
  const { process, processNotes, ui } = await getDictionary();
  return (
    <ProcessSteps
      eyebrow={ui.processCard.title}
      heading={ui.processCard.heading}
      line={ui.processCard.line}
      steps={process.map((s, i) => ({ title: s, note: processNotes[i] ?? "" }))}
    />
  );
}
