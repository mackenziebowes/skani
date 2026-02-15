import { Breadcrumbs } from "@/components/docs/Breadcrumbs";
import { AmberGlowBackground } from "@/components/docs/AmberGlowBackground";
import { SectionTitle } from "@/components/docs/SectionTitle";
import { Step } from "@/components/docs/Step";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { GlassPanel } from "@/components/docs/GlassPanel";
import { VersionRequirementCard } from "@/components/docs/VersionRequirementCard";
import { DocsFooter } from "@/components/docs/DocsFooter";

export default function GettingStartedPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    name: 'Getting Started - Skani',
    description: 'Setup guide for Skani - a tool for managing agent skills across development environments.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <main className="flex-1 py-12 px-6 lg:px-16 max-w-4xl">
        <article className="prose prose-neutral dark:prose-invert">
          <Breadcrumbs
            items={[
              { label: "DOCS" },
              { label: "PRESERVATION" },
              { label: "GETTING STARTED", active: true },
            ]}
          />

          <div className="relative mb-20">
            <AmberGlowBackground />
            <h1 className="font-serif text-5xl md:text-6xl mb-6 relative z-10">
              Getting Started
            </h1>
            <p className="text-lg text-gray-400 font-light leading-relaxed max-w-2xl relative z-10">
              Skani is a tool for managing agent skills across development
              environments. This guide will help you set up your environment
              and install your first skill.
            </p>
          </div>

          <div className="mt-16 mb-20">
            <SectionTitle>Prerequisites</SectionTitle>

            <GlassPanel>
              <p className="text-gray-400 mb-6 font-light">
                Before using Skani, your local environment needs to be prepared.
                Skani requires one of the following runtimes to be in your
                system path:
              </p>
              <div className="flex gap-4">
                <VersionRequirementCard name="Bun" version="v1.0+" />
                <div className="flex items-center text-gray-600 font-serif italic">
                  or
                </div>
                <VersionRequirementCard name="Node.js" version="v18.0+" />
              </div>
            </GlassPanel>
          </div>

          <section className="relative border-l border-gray-800 ml-4 md:ml-0 pl-8 md:pl-12 space-y-20 pb-20">
            <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] bg-gray-800 rounded-full" />

            <Step number="01" title="Initialize a Project">
              <p className="text-gray-400 font-light mb-6 max-w-xl">
                Run the following command in your project directory to create a{" "}
                <code className="text-xs border border-gray-700 bg-gray-900 px-1.5 py-0.5 rounded text-gray-300">
                  skani.json
                </code>{" "}
                file. This file tracks your project&apos;s installed skills.
              </p>

              <CodeBlock
                code="npx skani init my-project"
                successMessage="Project initialized in ./my-project
Created skani.json manifest"
              />
            </Step>

            <Step number="02" title="Install a Skill">
              <p className="text-gray-400 font-light mb-6 max-w-xl">
                Install skills directly from GitHub by providing the full URL
                to the skill directory.
              </p>

              <CodeBlock
                code="npx skani install https://github.com/obra/superpowers/tree/main/skills/test-driven-development"
                showDots={false}
              />
            </Step>

            <Step number="03" title="List Installed Skills">
              <p className="text-gray-400 font-light mb-6 max-w-xl">
                View all installed skills in your current environment.
              </p>

              <CodeBlock code="npx skani list" showDots={false} />
            </Step>
          </section>

          <DocsFooter
            previous={{ title: "Introduction", href: "/docs" }}
            next={{ title: "CLI Commands", href: "/docs/cli-commands" }}
          />
        </article>
      </main>
    </>
  );
}
