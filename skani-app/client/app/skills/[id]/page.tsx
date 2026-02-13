import { notFound } from "next/navigation";
import { fetchSkill } from "@/lib/api/skills";
import { CopyButton } from "@/components/skill/CopyButton";
import { Badge } from "@/components/ui/badge";

interface SkillDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function SkillDetailPage({ params }: SkillDetailPageProps) {
	const { id } = await params;
	
	let skill;
	let error = null;
	
	try {
		skill = await fetchSkill(id);
	} catch (e) {
		error = e;
	}

	if (error || !skill) {
		return (
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-2">Skill Not Found</h1>
				<p className="text-muted-foreground">
					The skills registry is temporarily unavailable. Check back soon!
				</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<article className="max-w-3xl mx-auto">
				<div className="mb-8">
					<div className="flex items-start justify-between mb-4">
						<div>
							<h1 className="text-3xl font-bold mb-2">{skill.name}</h1>
							<p className="text-muted-foreground">{skill.description}</p>
						</div>
						<Badge variant="secondary" className="text-sm">
							v{skill.latestVersion}
						</Badge>
					</div>
					<div className="flex flex-wrap gap-2 mb-6">
						{skill.tags.map((tag) => (
							<Badge key={tag} variant="outline">
								{tag}
							</Badge>
						))}
					</div>
				</div>

				<div className="mb-8">
					<h2 className="text-lg font-semibold mb-3">Install</h2>
					<div className="bg-muted rounded-lg p-4 flex items-center justify-between gap-4">
						<code className="font-mono text-sm">{skill.installCommand}</code>
						<CopyButton text={skill.installCommand} />
					</div>
				</div>

				<div className="mb-8">
					<h2 className="text-lg font-semibold mb-3">Author</h2>
					<div className="flex items-center gap-2">
						<span>{skill.author.name}</span>
						<a
							href={`https://github.com/${skill.author.github}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline"
						>
							@{skill.author.github}
						</a>
					</div>
				</div>

				<div className="mb-8">
					<h2 className="text-lg font-semibold mb-3">Repository</h2>
					<a
						href={`https://github.com/${skill.repository.owner}/${skill.repository.repo}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary hover:underline"
					>
						github:{skill.repository.owner}/{skill.repository.repo}
					</a>
				</div>

				<div className="mb-8">
					<h2 className="text-lg font-semibold mb-3">Documentation</h2>
					<div className="prose prose-sm dark:prose-invert max-w-none">
						<pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg text-sm">
							{skill.documentation}
						</pre>
					</div>
				</div>

				<div>
					<h2 className="text-lg font-semibold mb-3">Versions</h2>
					<div className="space-y-2">
						{skill.versions.map((version) => (
							<div key={version.version} className="flex items-center justify-between py-2 border-b last:border-0">
								<div>
									<span className="font-mono">{version.version}</span>
									{version.changelog && (
										<span className="text-sm text-muted-foreground ml-2">
											- {version.changelog}
										</span>
									)}
								</div>
								<span className="text-sm text-muted-foreground">
									{new Date(version.released).toLocaleDateString()}
								</span>
							</div>
						))}
					</div>
				</div>
			</article>
		</div>
	);
}
