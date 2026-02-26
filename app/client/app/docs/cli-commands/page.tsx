import { Breadcrumbs } from "@/components/docs/Breadcrumbs";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { DocsFooter } from "@/components/docs/DocsFooter";

const commands = [
  {
    name: "init",
    usage: "skani init [project-name]",
    description: "Initialize a new skani.json file in the current directory.",
    example: "skani init my-project",
  },
  {
    name: "install",
    usage: "skani install <GitHub URL> [--refresh]",
    description:
      "Install a skill from GitHub. Uses global cache if available. Use --refresh to force re-download.",
    example:
      "skani install https://github.com/obra/superpowers/tree/main/skills/test-driven-development",
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
      "Remove an installed skill from the project. Does not remove from global cache.",
    example: "skani remove omarchy",
  },
  {
    name: "search",
    usage: "skani search <query>",
    description:
      "Search for skills in central registry by name, description, or tags.",
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
    description:
      "Update an installed skill to the latest version. Always refreshes from remote.",
    example: "skani update omarchy",
  },
  {
    name: "registry list",
    usage: "skani registry list",
    description:
      "List all available kits from the remote registry.",
    example: "skani registry list",
  },
  {
    name: "registry install",
    usage: "skani registry install <name> [--replace] [--refresh]",
    description:
      "Install a kit from the remote registry. Use --replace to clear existing skills, --refresh to force re-download.",
    example: "skani registry install obra-superpowers-full --replace",
  },
  {
    name: "cache list",
    usage: "skani cache list",
    description:
      "List all skills in the global cache (~/.skani) with their sizes.",
    example: "skani cache list",
  },
  {
    name: "cache clean",
    usage: "skani cache clean",
    description:
      "Clear the entire global cache. Useful for freeing disk space or forcing fresh downloads.",
    example: "skani cache clean",
  },
];

const kitCommands = [
  {
    name: "kit list",
    usage: "skani kit list",
    description:
      "List all available local kit files (.skani.json) in current directory.",
    example: "skani kit list",
  },
  {
    name: "kit install",
    usage: "skani kit install <name> [--replace]",
    description:
      "Install skills from a local kit file. Use --replace for clean install.",
    example: "skani kit install superpowers --replace",
  },
  {
    name: "kit restore",
    usage: "skani kit restore",
    description:
      "Restore skani.json from most recent kit install backup.",
    example: "skani kit restore",
  },
];

export default function CLICommandsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    name: 'CLI Commands - Skani',
    description: 'Reference for all available Skani CLI commands',
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

          <div className="mb-8 p-6 border border-amber-900/30 rounded-lg bg-amber-950/10">
            <h2 className="text-lg font-semibold text-amber-500 mb-2">Global Cache</h2>
            <p className="text-gray-400 text-sm">
              Skills are cached at <code className="text-xs bg-muted px-1.5 py-0.5 rounded">~/.skani/registry/skill/&lt;id&gt;/</code>.
              When installing, if a skill is already cached, symlinks are created in your project instead of re-downloading.
              Use <code className="text-xs bg-muted px-1.5 py-0.5 rounded">--refresh</code> to force a fresh download.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-12">Core Commands</h2>
          <div className="not-prose space-y-6">
            {commands.map((cmd) => (
              <div
                key={cmd.name}
                id={cmd.name}
                className="border border-gray-800 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold font-mono">
                    {cmd.name}
                  </h3>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {cmd.usage}
                  </code>
                </div>
                <p className="text-gray-400 mb-4">{cmd.description}</p>
                <CodeBlock code={cmd.example} showDots={false} />
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-12">Local Kit Commands</h2>
          <p className="text-gray-400 mb-4">
            Work with local <code className="text-xs bg-muted px-1.5 py-0.5 rounded">.skani.json</code> kit files.
            For remote registry kits, use <code className="text-xs bg-muted px-1.5 py-0.5 rounded">registry install</code>.
          </p>
          <div className="not-prose space-y-6">
            {kitCommands.map((cmd) => (
              <div
                key={cmd.name}
                id={cmd.name}
                className="border border-gray-800 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold font-mono">
                    {cmd.name}
                  </h3>
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

      <OnThisPage sections={[...commands.map((cmd) => cmd.name), ...kitCommands.map((cmd) => cmd.name)]} />
    </>
  );
}
