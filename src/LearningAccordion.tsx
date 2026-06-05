import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { LearningData } from "@/types/optimization";

interface LearningAccordionProps {
  learning: LearningData;
}

export function LearningAccordion({ learning }: LearningAccordionProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <header className="mb-3">
        <h3 className="text-sm font-semibold tracking-tight">Optimization rationale</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Why the compiler made these decisions — and how to iterate further.
        </p>
      </header>

      <Accordion type="multiple" defaultValue={["structural"]} className="w-full">
        <AccordionItem value="structural" className="border-border">
          <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-foreground hover:no-underline">
            <span className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground">01</span>
              Structural Changes
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-[13px] leading-relaxed text-muted-foreground">
            {learning.whatChanged}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="behavioral" className="border-border">
          <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-foreground hover:no-underline">
            <span className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground">02</span>
              Behavioral Mechanics
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-[13px] leading-relaxed text-muted-foreground">
            {learning.whyItWorks}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="iterative" className="border-b-0 border-border">
          <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-foreground hover:no-underline">
            <span className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground">03</span>
              Iterative Action Tips
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2">
              {learning.tips.map((tip, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-[13px] leading-relaxed text-muted-foreground"
                >
                  <span className="font-mono text-[10px] text-primary">→</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
