import { Breadcrumbs } from "@/components/docs/Breadcrumbs";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { DocsNav } from "@/components/docs/DocsNav";
import { DocsFooter } from "@/components/docs/DocsFooter";
import { docsNavSections } from "@/lib/docs-nav";

const commands = [
  {
    name: "init",
    usage: "skani init [project-name]",
    description: "Initialize a new skani.json file in the current directory.",
    example: "skani init my-project",
  },
  {
    name: "install",
    usage: "skani install <skill>[@version]",
    description:
      "Install a skill from GitHub. The skill can be specified as owner/repo, with an optional version tag.",
    example: "skani install anomalyco/omarchy@v1.2.3",
  },
  {
    name: "install-all",
    usage: "skani install-all",
    description:
      "Install all skills listed in skani.json. Useful for reproducing environments.",
    example: "skani install-all",
  },
  {
    name: "list",
    usage: "skani list",
    description: "List all installed skills with their versions and sources.",
    example: "skani list",
  },
  {
    name: "remove",
    usage: "skani remove <skill-id>",
    description:
      "Remove an installed skill from both filesystem and skani.json.",
    example: "skani remove omarchy",
  },
  {
    name: "search",
    usage: "skani search <query>",
    description:
      "Search for skills in the central registry by name, description, or tags.",
    example: "skani search hyprland",
  },
  {
    name: "info",
    usage: "skani info <skill-id>",
    description:
      "Display detailed information about a skill including versions and install command.",
    example: "skani info omarchy",
  },
  {
    name: "update",
    usage: "skani update <skill-id>",
    description: "Update an installed skill to the latest version available.",
    example: "skani update omarchy",
  },
];

export default function CLICommandsPage() {
  return (
    <div className="flex-1 max-w-[1600px] mx-auto w-full flex">
      <DocsNav sections={docsNavSections} activeLink="/docs/cli-commands" />

      <main className="flex-1 py-12 px-6 lg:px-16 max-w-4xl">
        <article className="prose prose-neutral dark:prose-invert">
          <Breadcrumbs
            items={[
              { label: "DOCS" },
              { label: "EXCAVATION" },
              { label: "CLI REFERENCE", active: true },
            ]}
          />

          <div className="mb-12">
            <h1 className="font-serif text-4xl font-bold mb-2">CLI Commands</h1>
            <p className="text-gray-400">
              Reference for all available Skani CLI commands
            </p>
          </div>

          <div className="not-prose space-y-6">
            {commands.map((cmd) => (
              <div
                key={cmd.name}
                id={cmd.name}
                className="border border-gray-800 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-semibold font-mono">
                    {cmd.name}
                  </h2>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {cmd.usage}
                  </code>
                </div>
                <p className="text-gray-400 mb-4">{cmd.description}</p>
                <CodeBlock code={cmd.example} showDots={false} />
              </div>
            ))}
          </div>

          <DocsFooter
            previous={{ title: "Quick Start", href: "/docs/getting-started" }}
            next={{ title: "skani.json", href: "/docs/skani-json" }}
          />
        </article>
      </main>

      <OnThisPage sections={commands.map((cmd) => cmd.name)} />
    </div>
  );
}
