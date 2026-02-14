import { Breadcrumbs } from "@/components/docs/Breadcrumbs";
import { SectionTitle } from "@/components/docs/SectionTitle";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { DocsNav } from "@/components/docs/DocsNav";
import { DocsFooter } from "@/components/docs/DocsFooter";
import { docsNavSections } from "@/lib/docs-nav";

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
      <div className="flex-1 max-w-[1600px] mx-auto w-full flex">
      <DocsNav sections={docsNavSections} activeLink="/docs/skani-json" />

      <main className="flex-1 py-12 px-6 lg:px-16 max-w-4xl">
        <article className="prose prose-neutral dark:prose-invert">
          <Breadcrumbs
            items={[
              { label: "DOCS" },
              { label: "EXCAVATION" },
              { label: "CONFIGURATION", active: true },
            ]}
          />

          <h1 className="text-3xl font-bold mb-2">skani.json</h1>

          <p className="lead text-gray-400">
            The <code>skani.json</code> file is heart of Skani. It tracks which
            skills are installed and their exact versions, enabling reproducible
            environments.
          </p>

          <SectionTitle>File Location</SectionTitle>
          <p>
            The <code>skani.json</code> file should be placed in the root of
            your project, alongside other configuration files like{" "}
            <code>package.json</code> or <code>tsconfig.json</code>.
          </p>

          <SectionTitle>Structure</SectionTitle>

          <h3>Top-Level Fields</h3>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>version</code>
                </td>
                <td>string</td>
                <td>Schema version (currently &quote;1.0.0&quote;)</td>
              </tr>
              <tr>
                <td>
                  <code>environment</code>
                </td>
                <td>object</td>
                <td>Metadata about this environment</td>
              </tr>
              <tr>
                <td>
                  <code>skills</code>
                </td>
                <td>array</td>
                <td>List of installed skills</td>
              </tr>
            </tbody>
          </table>

          <h3>Environment Object</h3>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>name</code>
                </td>
                <td>string</td>
                <td>Human-readable name for this environment</td>
              </tr>
              <tr>
                <td>
                  <code>created</code>
                </td>
                <td>string</td>
                <td>ISO 8601 timestamp of creation</td>
              </tr>
              <tr>
                <td>
                  <code>updated</code>
                </td>
                <td>string</td>
                <td>ISO 8601 timestamp of last modification</td>
              </tr>
            </tbody>
          </table>

          <h3>Skill Object</h3>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>id</code>
                </td>
                <td>string</td>
                <td>Unique identifier for skill</td>
              </tr>
              <tr>
                <td>
                  <code>name</code>
                </td>
                <td>string</td>
                <td>Human-readable name</td>
              </tr>
              <tr>
                <td>
                  <code>version</code>
                </td>
                <td>string</td>
                <td>Installed version (pinned)</td>
              </tr>
              <tr>
                <td>
                  <code>source</code>
                </td>
                <td>object</td>
                <td>Source configuration for fetching</td>
              </tr>
              <tr>
                <td>
                  <code>installedAt</code>
                </td>
                <td>string</td>
                <td>ISO 8601 timestamp of installation</td>
              </tr>
            </tbody>
          </table>

          <h3>Source Object</h3>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>type</code>
                </td>
                <td>string</td>
                <td>Source type (currently &quote;github&quote;)</td>
              </tr>
              <tr>
                <td>
                  <code>owner</code>
                </td>
                <td>string</td>
                <td>GitHub repository owner</td>
              </tr>
              <tr>
                <td>
                  <code>repo</code>
                </td>
                <td>string</td>
                <td>Repository name</td>
              </tr>
              <tr>
                <td>
                  <code>ref</code>
                </td>
                <td>string</td>
                <td>Git reference (tag, branch, or commit)</td>
              </tr>
              <tr>
                <td>
                  <code>path</code>
                </td>
                <td>string</td>
                <td>Path to skill within repository</td>
              </tr>
            </tbody>
          </table>

          <SectionTitle>Example</SectionTitle>
          <div className="not-prose bg-muted rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm font-mono">{exampleConfig}</pre>
          </div>

          <SectionTitle>Version Control</SectionTitle>
          <p>
            We recommend committing <code>skani.json</code> to version control.
            This allows team members and CI/CD systems to reproduce your skill
            environment exactly.
          </p>

          <CodeBlock code="git add skani.json" showDots={false} />

          <SectionTitle>Skill Installation Location</SectionTitle>
          <p>
            When skills are installed, they are placed in{" "}
            <code>.claude/skills/</code> directory at the root of your project.
            This directory structure is standard for agent skills.
          </p>

          <div className="not-prose bg-muted rounded-lg p-4">
            <pre className="text-sm font-mono">{`.claude/
└── skills/
    ├── omarchy/
    │   ├── SKILL.md
    │   ├── templates/
    │   └── scripts/
    └── another-skill/
        └── SKILL.md`}</pre>
          </div>

          <DocsFooter
            previous={{ title: "GitHub Links", href: "/docs/github-links" }}
            next={{ title: "Quick Start", href: "/docs/getting-started" }}
          />
        </article>
      </main>

      <OnThisPage
        sections={[
          "File Location",
          "Structure",
          "Top-Level Fields",
          "Environment Object",
          "Skill Object",
          "Source Object",
          "Example",
          "Version Control",
          "Skill Installation Location",
        ]}
      />
    </div>
    </>
  );
}
