import type { Command } from "../core/cli";
import { readSkaniFile } from "../core/skani-file";
import { installSkillFiles, createInstalledSkill, getSkillInstallPath } from "../core/skill-fetcher";
import log from "../core/log";

export const installAllCommand: Command = {
	name: "install-all",
	description: "Install all skills from skani.json",
	instructions: "Usage: skani install-all",
	run: async () => {
		const skaniFile = await readSkaniFile();
		
		if (!skaniFile) {
			log.single.err("INSTALL-ALL", "No skani.json found. Run 'skani init' first.");
			process.exit(1);
		}
		
		if (skaniFile.skills.length === 0) {
			log.single.info("INSTALL-ALL", "No skills to install");
			return;
		}
		
		log.single.info("INSTALL-ALL", `Installing ${skaniFile.skills.length} skill(s)...`);
		
		let successCount = 0;
		let failCount = 0;
		
		for (const skill of skaniFile.skills) {
			log.single.info("INSTALL", `Installing ${skill.name} (${skill.version})...`);
			
			const result = await installSkillFiles(skill.source, skill.id);
			
			if (result.success) {
				log.single.info("SUCCESS", `${skill.name}: ${result.filesWritten} files`);
				successCount++;
			} else {
				log.single.err("FAILED", `${skill.name}: ${result.error}`);
				failCount++;
			}
		}
		
		log.multi.info([
			{ t: "COMPLETE", m: `Installed ${successCount} skill(s)` },
			...(failCount > 0 ? [{ t: "FAILED", m: `${failCount} skill(s) failed` }] : []),
		]);
	},
};
