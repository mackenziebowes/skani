import { SkillMetadata } from "../types/skill";

interface SkillsDotShSkill {
	rank: number;
	name: string;
	ownerRepo: string;
	installs: string;
}

async function fetchSkillsFromSkillsDotSh(): Promise<SkillsDotShSkill[]> {
	try {
		const response = await fetch("https://skills.sh");
		const html = await response.text();
		
		const skills: SkillsDotShSkill[] = [];
		
		const regex = /<td>(\d+)<\/td>\s*<td>([^<]+)<\/td>\s*<td>([^<]+)<\/td>\s*<td>([\d.]+K)<\/td>/g;
		
		let match;
		let rank = 1;
		while ((match = regex.exec(html)) !== null) {
			skills.push({
				rank: parseInt(match[1]),
				name: match[2].trim(),
				ownerRepo: match[3].trim(),
				installs: match[4]
			});
			rank++;
		}
		
		return skills.slice(0, 50);
	} catch (error) {
		console.error("Failed to fetch skills from skills.sh:", error);
		return [];
	}
}

export async function getTopSkills(limit: number = 20): Promise<SkillMetadata[]> {
	const skillsFromSh = await fetchSkillsFromSkillsDotSh();
	
	return skillsFromSh.slice(0, limit).map((skill) => {
		const { rank: _rank } = skill;
		const [owner, repo] = skill.ownerRepo.split("/");
		
		return {
			id: `${owner}-${repo}`.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
			name: skill.name,
			description: `Top-ranked skill from ${skill.ownerRepo} with ${skill.installs} installations.`,
			versions: [
				{
					version: "latest",
					ref: "main",
					path: ".claude/skills",
					released: new Date().toISOString(),
				},
			],
			latestVersion: "latest",
			tags: ["popular", "top", skill.name.toLowerCase().replace(/[^a-z0-9]/g, "-")],
			author: {
				name: owner,
				github: owner,
			},
			repository: {
				owner,
				repo,
				defaultPath: ".claude/skills",
			},
			documentation: `# ${skill.name}

A top-ranked agent skill from [${skill.ownerRepo}](https://github.com/${skill.ownerRepo}).

## Stats
- Rank: ${skill.rank}
- Installs: ${skill.installs}

## Installation

\`\`\`bash
npx skani install https://github.com/${owner}/${repo}/tree/main/.claude/skills/${skill.name}
\`\`\`
`,
			installCommand: `skani install https://github.com/${owner}/${repo}/tree/main/.claude/skills/${skill.name}`,
		};
	});
}
