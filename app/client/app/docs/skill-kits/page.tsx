import { Breadcrumbs } from "@/components/docs/Breadcrumbs";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { DocsFooter } from "@/components/docs/DocsFooter";

const kitCommands = [
  {
    name: "kit list",
    usage: "skani kit list",
    description: "List all available kits in current directory.",
    example: "skani kit list",
  },
  {
    name: "kit install",
    usage: "skani kit install <name> [--replace]",
    description:
      "Install skills from a kit file. Use --replace to clear existing skills first.",
    example:
      "skani kit install superpowers --replace",
  },
  {
    name: "kit restore",
    usage: "skani kit restore",
    description:
      "Restore skani.json from most recent backup created by kit install.",
    example: "skani kit restore",
  },
];

export default function SkillKitsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    name: 'Skill Kits - Skani',
    description: 'Documentation for Skani skill kits - shareable skill bundles for rapid installation',
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
              { label: "REFERENCE" },
              { label: "SKILL KITS", active: true },
            ]}
          />

          <div className="mb-12">
            <h1 className="font-serif text-4xl font-bold mb-2">Skill Kits</h1>
            <p className="text-gray-400">
              Shareable skill bundles for rapid installation
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-gray-300 mb-4">
              Skill kits are shareable <code className="bg-muted px-2 py-1 rounded">.skani.json</code> files that allow you to rapidly install a curated set of skills. Instead of installing skills individually, you can share kits with your team to bootstrap development environments consistently.
            </p>
            <p className="text-gray-300 mb-4">
              Kits use the same format as <code className="bg-muted px-2 py-1 rounded">skani.json</code>, but are saved with a <code className="bg-muted px-2 py-1 rounded">.skani.json</code> extension to distinguish them as sharable bundles.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Creating a Kit</h2>
            <p className="text-gray-300 mb-4">
              To create a skill kit, simply copy your existing <code className="bg-muted px-2 py-1 rounded">skani.json</code> file to a new file with a <code className="bg-muted px-2 py-1 rounded">.skani.json</code> extension:
            </p>
            <CodeBlock code="cp skani.json my-kit.skani.json" showDots={false} />
            <p className="text-gray-300 mb-4 mt-4">
              Share the <code className="bg-muted px-2 py-1 rounded">.skani.json</code> file with your team or include it in your project repository.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Installing a Kit</h2>
            <p className="text-gray-300 mb-4">
              Use the <code className="bg-muted px-2 py-1 rounded">kit install</code> command to install skills from a kit:
            </p>

            <div className="space-y-6">
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
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Installation Modes</h2>
            <p className="text-gray-300 mb-4">
              The <code className="bg-muted px-2 py-1 rounded">kit install</code> command supports two installation modes:
            </p>

            <div className="space-y-4">
              <div className="border border-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-2 text-amber-600">Merge Mode (Default)</h4>
                <p className="text-gray-300 mb-4">
                  Installs kit skills alongside existing ones. Skills with the same ID are skipped to prevent duplicates.
                </p>
                <CodeBlock code="skani kit install my-kit" showDots={false} />
              </div>

              <div className="border border-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-2 text-amber-600">Replace Mode</h4>
                <p className="text-gray-300 mb-4">
                  Clears all existing skills, backs up your <code className="bg-muted px-2 py-1 rounded">skani.json</code> to <code className="bg-muted px-2 py-1 rounded">previous.skani.json</code>, then installs the kit. Use this for a clean slate.
                </p>
                <CodeBlock code="skani kit install my-kit --replace" showDots={false} />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Backup & Restore</h2>
            <p className="text-gray-300 mb-4">
              When using replace mode, your current <code className="bg-muted px-2 py-1 rounded">skani.json</code> is automatically backed up to <code className="bg-muted px-2 py-1 rounded">previous.skani.json</code>. You can restore your previous setup at any time:
            </p>
            <CodeBlock code="skani kit restore" showDots={false} />
            <p className="text-gray-300 mt-4 text-sm">
              Note: Restore only works if a backup exists from a previous kit install with <code className="bg-muted px-2 py-1 rounded">--replace</code>.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Example Kit</h2>
            <p className="text-gray-300 mb-4">
              Here's an example of what a <code className="bg-muted px-2 py-1 rounded">.skani.json</code> kit file looks like:
            </p>
            <div className="border border-gray-800 rounded-lg p-6">
              <pre className="text-sm overflow-x-auto">
                <code className="text-gray-300">
{`{
  "version": "1.0.0",
  "environment": {
    "name": "my-project",
    "created": "2026-02-15T00:00:00.000Z",
    "updated": "2026-02-15T00:00:00.000Z"
  },
  "skills": [
    {
      "id": "owner-repo-skill-name",
      "name": "skill-name",
      "version": "main",
      "source": {
        "url": "https://github.com/owner/repo/tree/main/skills/skill-name",
        "type": "github",
        "owner": "owner",
        "repo": "repo",
        "ref": "main",
        "path": "skills/skill-name"
      },
      "installedAt": "2026-02-15T00:00:00.000Z"
    }
  ]
}`}
                </code>
              </pre>
            </div>
          </div>

          <DocsFooter
            previous={{ title: "CLI Commands", href: "/docs/cli-commands" }}
            next={{ title: "skani.json", href: "/docs/skani-json" }}
          />
        </article>
      </main>

      <OnThisPage
        sections={[
          "Overview",
          "Creating a Kit",
          "Installing a Kit",
          "kit list",
          "kit install",
          "kit restore",
          "Installation Modes",
          "Backup & Restore",
          "Example Kit",
        ]}
      />
    </>
  );
}
