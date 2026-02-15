import { Breadcrumbs } from "@/components/docs/Breadcrumbs";
import { SectionTitle } from "@/components/docs/SectionTitle";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsFooter } from "@/components/docs/DocsFooter";

const exampleConfig = `{
  "version": "1.0.0",
  "environment": {
    "name": "my-project",
    "created": "2024-02-12T00:00:00Z",
    "updated": "2024-02-12T00:00:00Z"
  },
  "skills": [
    {
      "id": "omarchy",
      "name": "Omarchy",
      "version": "1.2.3",
      "source": {
        "type": "github",
        "owner": "anomalyco",
        "repo": "omarchy",
        "ref": "v1.2.3",
        "path": ".claude/skills/Omarchy"
      },
      "installedAt": "2024-02-12T10:30:00Z"
    }
  ]
}`;

export default function SkaniJsonPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    name: 'skani.json Configuration - Skani',
    description: 'The skani.json file is heart of Skani. It tracks which skills are installed and their exact versions, enabling reproducible environments.',
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
              { label: "SKANI.JSON", active: true },
            ]}
          />

          <div className="mb-12">
            <h1 className="font-serif text-4xl font-bold mb-2">skani.json</h1>
            <p className="text-gray-400">
              The heart of Skani. Tracks installed skills and versions for reproducible
              environments.
            </p>
          </div>

          <div className="space-y-8">
            <SectionTitle>Structure</SectionTitle>
            <p className="text-gray-300 mb-4">
              The <code className="bg-muted px-2 py-1 rounded">skani.json</code> file lives in your project root and
              contains the following structure:
            </p>
            <CodeBlock code={exampleConfig} showDots={false} />

            <SectionTitle>Fields</SectionTitle>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">
                  version
                </h3>
                <p className="text-gray-400 mb-4">
                  Version of the skani.json file format. Currently <code className="bg-muted px-2 py-1 rounded">1.0.0</code>.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">
                  environment
                </h3>
                <p className="text-gray-400 mb-4">
                  Metadata about your project environment. Includes name, created, and
                  updated timestamps.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">
                  skills
                </h3>
                <p className="text-gray-400 mb-4">
                  Array of installed skills. Each skill includes id, name, version,
                  source URL, and installation timestamp.
                </p>
              </div>
            </div>
          </div>

          <DocsFooter
            previous={{ title: "CLI Commands", href: "/docs/cli-commands" }}
            next={{ title: "Skill Kits", href: "/docs/skill-kits" }}
          />
        </article>
      </main>
    </>
  );
}
