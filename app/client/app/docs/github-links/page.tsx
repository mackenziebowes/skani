import { Breadcrumbs } from "@/components/docs/Breadcrumbs";
import { SectionTitle } from "@/components/docs/SectionTitle";
import { Step } from "@/components/docs/Step";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNav } from "@/components/docs/DocsNav";
import { DocsFooter } from "@/components/docs/DocsFooter";
import { docsNavSections } from "@/lib/docs-nav";

export default function GitHubLinksPage() {
	return (
		<div className="flex-1 max-w-[1600px] mx-auto w-full flex">
			<DocsNav sections={docsNavSections} activeLink="/docs/github-links" />

			<main className="flex-1 py-12 px-6 lg:px-16 max-w-4xl">
				<article className="prose prose-neutral dark:prose-invert">
					<Breadcrumbs
						items={[
							{ label: "DOCS" },
							{ label: "GUIDES" },
							{ label: "GITHUB LINKS", active: true },
						]}
					/>

					<div className="relative mb-20">
						<h1 className="font-serif text-5xl md:text-6xl mb-6">
							Converting GitHub Links
						</h1>
						<p className="text-lg text-gray-400 font-light leading-relaxed max-w-2xl">
							Learn how to convert GitHub repository URLs into skani-compatible format for
							installing agent skills.
						</p>
					</div>

					<SectionTitle>Understanding GitHub URL Formats</SectionTitle>

					<p>
						GitHub repositories may store agent skills at various locations. Skani
						supports two main formats for specifying which skill to install:
					</p>

					<section className="relative border-l border-gray-800 ml-4 md:ml-0 pl-8 md:pl-12 space-y-20 pb-20">
						<div className="absolute -left-[5px] top-0 w-[9px] h-[9px] bg-gray-800 rounded-full" />

						<Step number="01" title="Root-Level Skills">
							<p className="text-gray-400 font-light mb-6 max-w-xl">
								When a skill is at the root of a repository, use the simple
								owner/repo format. The skill is expected to be in the
								<code className="text-xs border border-gray-700 bg-gray-900 px-1.5 py-0.5 rounded text-gray-300">
									.claude/skills
								</code>{" "}
								directory.
							</p>

							<div className="mb-6">
								<p className="text-sm text-gray-500 mb-2">GitHub URL:</p>
								<CodeBlock
									code="https://github.com/owner/repo"
									showDots={false}
								/>
							</div>

							<div className="mb-6">
								<p className="text-sm text-gray-500 mb-2">Skani command:</p>
								<CodeBlock
									code="skani install owner/repo"
									showDots={false}
								/>
							</div>

							<div className="mb-6">
								<p className="text-sm text-gray-500 mb-2">
									With specific version:
								</p>
								<CodeBlock
									code="skani install owner/repo@v1.2.3"
									showDots={false}
								/>
							</div>

							<div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
								<p className="text-sm text-amber-200">
									<strong>Expected structure:</strong> Repository root should
									contain <code>.claude/skills/</code> directory with
									individual skill folders.
								</p>
							</div>
						</Step>

						<Step number="02" title="Skills in Subdirectories">
							<p className="text-gray-400 font-light mb-6 max-w-xl">
								When a skill is nested in subdirectories (like in templates or
								examples), use the <code>github:</code> prefix format.
								This gives you full control over the exact path to install.
							</p>

							<div className="mb-6">
								<p className="text-sm text-gray-500 mb-2">
									GitHub URL example:
								</p>
								<CodeBlock
									code="https://github.com/owner/repo/tree/main/templates/agent-skills/my-skill"
									showDots={false}
								/>
							</div>

							<div className="mb-6">
								<p className="text-sm text-gray-500 mb-2">
									Conversion to skani format:
								</p>
								<CodeBlock
									code="github:owner/repo/templates/agent-skills/my-skill"
									showDots={false}
								/>
							</div>

							<div className="mb-6">
								<p className="text-sm text-gray-500 mb-2">
									With version (branch or tag):
								</p>
								<CodeBlock
									code="github:owner/repo/templates/agent-skills/my-skill@main"
									showDots={false}
								/>
							</div>
						</Step>

						<Step number="03" title="Conversion Examples">
							<p className="text-gray-400 font-light mb-6 max-w-xl">
								Here are common conversion scenarios showing GitHub URLs and
								their corresponding skani commands.
							</p>

							<div className="space-y-6">
								<div className="bg-card border border-border rounded-lg p-4">
									<p className="text-sm text-gray-500 mb-2">
										Root repository:
									</p>
									<CodeBlock
										code="https://github.com/anomalyco/omarchy"
										showDots={false}
									/>
									<p className="text-xs text-gray-500 mt-3 mb-1">
										↓ converts to ↓
									</p>
									<CodeBlock
										code="skani install anomalyco/omarchy"
										showDots={false}
									/>
								</div>

								<div className="bg-card border border-border rounded-lg p-4">
									<p className="text-sm text-gray-500 mb-2">
										Skill in templates directory:
									</p>
									<CodeBlock
										code="https://github.com/mackenziebowes/temple/tree/main/templates/agent-skills/nextjs-seo-housekeeping"
										showDots={false}
									/>
									<p className="text-xs text-gray-500 mt-3 mb-1">
										↓ converts to ↓
									</p>
									<CodeBlock
										code="skani install github:mackenziebowes/temple/templates/agent-skills/nextjs-seo-housekeeping@main"
										showDots={false}
									/>
								</div>

								<div className="bg-card border border-border rounded-lg p-4">
									<p className="text-sm text-gray-500 mb-2">
										Skill with specific tag:
									</p>
									<CodeBlock
										code="https://github.com/owner/repo/tree/v1.2.3"
										showDots={false}
									/>
									<p className="text-xs text-gray-500 mt-3 mb-1">
										↓ converts to ↓
									</p>
									<CodeBlock
										code="skani install owner/repo@v1.2.3"
										showDots={false}
									/>
								</div>
							</div>
						</Step>
					</section>

					<SectionTitle>Quick Reference</SectionTitle>

					<table className="w-full border-collapse">
						<thead>
							<tr className="border-b border-gray-800">
								<th className="text-left py-3 px-4 text-sm font-semibold">
									GitHub URL
								</th>
								<th className="text-left py-3 px-4 text-sm font-semibold">
									Skani Format
								</th>
								<th className="text-left py-3 px-4 text-sm font-semibold">
									Use Case
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-b border-gray-800/50">
								<td className="py-3 px-4">
									<code className="text-sm">
										github.com/owner/repo
									</code>
								</td>
								<td className="py-3 px-4">
									<code className="text-sm">owner/repo</code>
								</td>
								<td className="py-3 px-4 text-sm text-gray-400">
									Root-level skill
								</td>
							</tr>
							<tr className="border-b border-gray-800/50">
								<td className="py-3 px-4">
									<code className="text-sm">
										github.com/owner/repo/tree/main/path/to/skill
									</code>
								</td>
								<td className="py-3 px-4">
									<code className="text-sm">
										github:owner/repo/path/to/skill@main
									</code>
								</td>
								<td className="py-3 px-4 text-sm text-gray-400">
									Subdirectory skill
								</td>
							</tr>
							<tr className="border-b border-gray-800/50">
								<td className="py-3 px-4">
									<code className="text-sm">
										github.com/owner/repo/tree/v1.2.3
									</code>
								</td>
								<td className="py-3 px-4">
									<code className="text-sm">owner/repo@v1.2.3</code>
								</td>
								<td className="py-3 px-4 text-sm text-gray-400">
									Specific version tag
								</td>
							</tr>
						</tbody>
					</table>

					<DocsFooter
						previous={{ title: "CLI Commands", href: "/docs/cli-commands" }}
						next={{ title: "skani.json", href: "/docs/skani-json" }}
					/>
				</article>
			</main>
		</div>
	);
}
