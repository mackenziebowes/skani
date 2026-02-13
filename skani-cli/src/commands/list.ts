import type { Command } from "../core/cli";
import { readSkaniFile } from "../core/skani-file";
import log from "../core/log";

export const listCommand: Command = {
	name: "list",
	description: "List all installed skills",
	instructions: "Usage: skani list",
	run: async () => {
		const skaniFile = await readSkaniFile();
		
		if (!skaniFile) {
			log.single.err("LIST", "No skani.json found. Run 'skani init' first.");
			process.exit(1);
		}
		
		if (skaniFile.skills.length === 0) {
			log.single.info("LIST", "No skills installed");
			return;
		}
		
		console.log("\n  INSTALLED SKILLS\n");
		console.log("  ID                  VERSION    SOURCE");
		console.log("  ─────────────────────────────────────────────────────");
		
		for (const skill of skaniFile.skills) {
			const id = skill.id.padEnd(20);
			const version = skill.version.padEnd(10);
			const source = `${skill.source.owner}/${skill.source.repo}`;
			console.log(`  ${id} ${version} ${source}`);
		}
		
		console.log("");
		console.log(`  Total: ${skaniFile.skills.length} skill(s)\n`);
	},
};
