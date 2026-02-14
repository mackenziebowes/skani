import type { Command } from "../core/cli";
import type { SkillMetadata } from "../types/skill";
import log from "../core/log";

const API_BASE = "https://api.skani.io";

export const infoCommand: Command = {
	name: "info",
	description: "Get detailed information about a skill",
	instructions: "Usage: skani info <skill-id>",
	run: async (args: string[]) => {
		const skillId = args[0];
		
		if (!skillId) {
			log.single.err("INFO", "No skill ID specified");
			log.single.info("USAGE", "skani info <skill-id>");
			process.exit(1);
		}
		
		log.single.info("INFO", `Fetching details for "${skillId}"...`);
		
		try {
			const response = await fetch(`${API_BASE}/skills/${skillId}`);
			
			if (!response.ok) {
				if (response.status === 404) {
					log.single.err("INFO", `Skill "${skillId}" not found`);
				} else {
					throw new Error(`API error: ${response.status}`);
				}
				process.exit(1);
			}
			
			const skill = await response.json() as SkillMetadata;
			
			console.log("\n  SKILL DETAILS\n");
			console.log(`  Name:        ${skill.name}`);
			console.log(`  ID:          ${skill.id}`);
			console.log(`  Latest:      ${skill.latestVersion}`);
			console.log(`  Author:      ${skill.author.name} (@${skill.author.github})`);
			console.log(`  Repository:  https://github.com/${skill.repository.owner}/${skill.repository.repo}`);
			console.log(`  Tags:        ${skill.tags.join(", ")}`);
			console.log("\n  DESCRIPTION");
			console.log(`  ${skill.description}`);
			console.log("\n  INSTALL");
			console.log(`  ${skill.installCommand}`);
			console.log("\n  VERSIONS");
			
			for (const version of skill.versions.slice(0, 5)) {
				console.log(`  ${version.version.padEnd(12)} ${version.released}`);
			}
			
			if (skill.versions.length > 5) {
				console.log(`  ... and ${skill.versions.length - 5} more versions`);
			}
			
			console.log("");
		} catch (error) {
			log.single.err("INFO", "Failed to fetch skill details");
			log.single.info("FALLBACK", "Try visiting https://skani.io/skills/" + skillId);
		}
	},
};
