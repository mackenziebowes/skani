import type { Command } from "../core/cli";
import { readSkaniFile, removeSkillFromSkaniFile } from "../core/skani-file";
import { uninstallSkillFiles, getSkillInstallPath } from "../core/skill-fetcher";
import log from "../core/log";

export const removeCommand: Command = {
	name: "remove",
	description: "Remove an installed skill",
	instructions: "Usage: skani remove <skill-id>",
	run: async (args: string[]) => {
		const skillId = args[0];
		
		if (!skillId) {
			log.single.err("REMOVE", "No skill ID specified");
			log.single.info("USAGE", "skani remove <skill-id>");
			process.exit(1);
		}
		
		const skaniFile = await readSkaniFile();
		
		if (!skaniFile) {
			log.single.err("REMOVE", "No skani.json found");
			process.exit(1);
		}
		
		const skill = skaniFile.skills.find(s => s.id === skillId || s.name.toLowerCase() === skillId.toLowerCase());
		
		if (!skill) {
			log.single.err("REMOVE", `Skill "${skillId}" not found in skani.json`);
			process.exit(1);
		}
		
		log.single.info("REMOVE", `Removing ${skill.name}...`);
		
		await uninstallSkillFiles(skill.id);
		await removeSkillFromSkaniFile(skill.id);
		
		log.multi.info([
			{ t: "SUCCESS", m: `Removed ${skill.name}` },
			{ t: "LOCATION", m: getSkillInstallPath(skill.id) },
		]);
	},
};
