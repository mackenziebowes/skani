import { PillButton } from "./PillButton";
import { ArtifactCard } from "./ArtifactCard";

interface HeroProps {
  heading: string;
  italicText?: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  codes?: Array<{
    type: "comment" | "keyword" | "string" | "plain";
    content: string;
  }>;
}

export function Hero({
  heading,
  italicText = "(in code)",
  description,
  ctaText = "Get Started",
  ctaHref = "/docs/getting-started",
  codes,
}: HeroProps) {
  const defaultCodes = [
    { type: "comment" as const, content: "// Agent Skill Manifest: v1.0.4" },
    { type: "comment" as const, content: "// Captured: 2024-05-12" },
    { type: "plain" as const, content: "" },
    { type: "keyword" as const, content: "skill" },
    { type: "string" as const, content: '"vision-core"' },
    { type: "plain" as const, content: "{" },
    { type: "plain" as const, content: "capabilities:" },
    { type: "string" as const, content: '["ocr", "detect"]' },
    { type: "plain" as const, content: "runtime:" },
    { type: "string" as const, content: '"python-3.11"' },
    { type: "plain" as const, content: "memory_alloc:" },
    { type: "string" as const, content: '"512mb"' },
    { type: "plain" as const, content: "persistence:" },
    { type: "keyword" as const, content: "true" },
    { type: "plain" as const, content: "}" },
  ];

  return (
    <section className="py-20 lg:py-[120px] pb-24 lg:pb-[160px] relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div className="space-y-10">
          <h1 className="font-serif text-[56px] lg:text-[88px] leading-[0.95] font-normal">
            {heading}
            <br />
            {italicText && (
              <span className="italic font-normal text-muted-foreground">
                {italicText}
              </span>
            )}
          </h1>
          <p className="text-lg text-muted-foreground max-w-full lg:max-w-[480px]">
            {description}
          </p>
          <PillButton href={ctaHref}>{ctaText}</PillButton>
        </div>
        <div className="flex justify-center items-center h-[400px] lg:h-[600px] order-last">
          <ArtifactCard codes={codes || defaultCodes} />
        </div>
      </div>
    </section>
  );
}
