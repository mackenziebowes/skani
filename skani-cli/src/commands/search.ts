import type { Command } from "../core/cli";
import type { SkillSearchResult } from "../types/skill";
import log from "../core/log";

const API_BASE = "https://api.skani.io";

export const searchCommand: Command = {
	name: "search",
	description: "Search for skills in the central registry",
	instructions: "Usage: skani search <query>",
	run: async (args: string[]) => {
		const query = args.join(" ");
		
		if (!query) {
			log.single.err("SEARCH", "No search query specified");
			log.single.info("USAGE", "skani search <query>");
			process.exit(1);
		}
		
		log.single.info("SEARCH", `Searching for "${query}"...`);
		
		try {
			const response = await fetch(`${API_BASE}/skills/search?q=${encodeURIComponent(query)}`);
			
			if (!response.ok) {
				throw new Error(`API error: ${response.status}`);
			}
			
			const results = await response.json() as SkillSearchResult[];
			
			if (results.length === 0) {
				log.single.info("SEARCH", "No skills found");
				return;
			}
			
			console.log("\n  SEARCH RESULTS\n");
			console.log("  ID                  NAME                    VERSION     TAGS");
			console.log("  ─────────────────────────────────────────────────────────────────────");
			
			for (const skill of results) {
				const id = skill.id.padEnd(20);
				const name = skill.name.padEnd(24);
				const version = skill.latestVersion.padEnd(12);
				const tags = skill.tags.slice(0, 3).join(", ");
				console.log(`  ${id} ${name} ${version} ${tags}`);
			}
			
			console.log("");
			console.log(`  Found ${results.length} skill(s)`);
			console.log("  Use 'skani info <skill-id>' for more details\n");
		} catch (error) {
			log.single.err("SEARCH", "Failed to search skills");
			log.single.info("FALLBACK", "Try browsing skills at https://skani.io");
		}
	},
};
