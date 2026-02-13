import { fetchSkills } from "@/lib/api/skills";
import { SkillGrid } from "@/components/skill/SkillGrid";

export default async function SkillsPage() {
	let skills;
	let error = null;
	
	try {
		skills = await fetchSkills();
	} catch (e) {
		error = e;
	}

	if (error || !skills) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">Available Skills</h1>
					<p className="text-muted-foreground">
						The skills registry is temporarily unavailable. Check back soon!
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Available Skills</h1>
				<p className="text-muted-foreground">
					Browse and install agent skills from the central registry
				</p>
			</div>
			<SkillGrid skills={skills} />
		</div>
	);
}
