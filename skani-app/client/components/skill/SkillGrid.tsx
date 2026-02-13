import { SkillSearchResult } from "@/lib/types/skill";
import { SkillCard } from "./SkillCard";

interface SkillGridProps {
	skills: SkillSearchResult[];
}

export function SkillGrid({ skills }: SkillGridProps) {
	if (skills.length === 0) {
		return (
			<div className="text-center py-12 text-muted-foreground">
				No skills found
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{skills.map((skill) => (
				<SkillCard key={skill.id} skill={skill} />
			))}
		</div>
	);
}
