import { getKitByName } from "@/lib/api/kits";
import { CopyButton } from "@/components/skill/CopyButton";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function KitDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const kit = getKitByName(name);

  if (!kit) {
    notFound();
  }

  const installCmd = `skani registry install ${kit.environment.name}`;
  const replaceCmd = `skani registry install ${kit.environment.name} --replace`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    name: `${kit.environment.name} - Skani Kit`,
    description: `Skill kit with ${kit.skills.length} skills`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/registry/kits"
            className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block"
          >
            ← Back to Kits
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{kit.environment.name}</h1>
              <p className="text-muted-foreground">
                Version {kit.version} • {kit.skills.length} skills
              </p>
            </div>
            <span className="text-xs font-mono bg-muted px-3 py-1 rounded">
              v{kit.version}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">Installation</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Install this kit using the Skani CLI:
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Merge with existing skills:</p>
                  <div className="flex items-center gap-2 bg-muted rounded-md p-3 font-mono text-sm">
                    <span className="flex-1">{installCmd}</span>
                    <CopyButton text={installCmd} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Replace existing skills:</p>
                  <div className="flex items-center gap-2 bg-muted rounded-md p-3 font-mono text-sm">
                    <span className="flex-1">{replaceCmd}</span>
                    <CopyButton text={replaceCmd} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">Included Skills</h2>
              <div className="space-y-2">
                {kit.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <span className="font-medium">{skill.id}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({skill.source.owner}/{skill.source.repo})
                      </span>
                    </div>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {skill.version}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Kit Info</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Version</dt>
                  <dd className="font-mono">{kit.version}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Created</dt>
                  <dd>{new Date(kit.environment.created).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd>{new Date(kit.environment.updated).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Skills</dt>
                  <dd>{kit.skills.length}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
