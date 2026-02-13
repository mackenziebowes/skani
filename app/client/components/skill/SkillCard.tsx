import Link from "next/link";
import { SkillSearchResult } from "@/lib/types/skill";

interface SkillCardProps {
	skill: SkillSearchResult;
}

export function SkillCard({ skill }: SkillCardProps) {
	return (
		<Link href={`/skills/${skill.id}`}>
			<div className="group rounded-lg border bg-card p-6 hover:border-primary transition-colors">
				<div className="flex items-start justify-between mb-3">
					<h3 className="text-lg font-semibold group-hover:text-primary">{skill.name}</h3>
					<span className="text-xs font-mono bg-muted px-2 py-1 rounded">{skill.latestVersion}</span>
				</div>
				<p className="text-sm text-muted-foreground mb-4 line-clamp-2">{skill.description}</p>
				<div className="flex flex-wrap gap-2">
					{skill.tags.slice(0, 4).map((tag) => (
						<span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
							{tag}
						</span>
					))}
				</div>
			</div>
		</Link>
	);
}
