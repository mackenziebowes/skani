import type { Command } from "../core/cli";
import { readSkaniFile, addSkillToSkaniFile } from "../core/skani-file";
import { fetchTags } from "../core/github";
import { installSkillFiles, createInstalledSkill, getSkillInstallPath } from "../core/skill-fetcher";
import log from "../core/log";

export const updateCommand: Command = {
	name: "update",
	description: "Update a skill to the latest version",
	instructions: "Usage: skani update <skill-id>",
	run: async (args: string[]) => {
		const skillId = args[0];
		
		if (!skillId) {
			log.single.err("UPDATE", "No skill ID specified");
			log.single.info("USAGE", "skani update <skill-id>");
			process.exit(1);
		}
		
		const skaniFile = await readSkaniFile();
		
		if (!skaniFile) {
			log.single.err("UPDATE", "No skani.json found");
			process.exit(1);
		}
		
		const skill = skaniFile.skills.find(s => s.id === skillId || s.name.toLowerCase() === skillId.toLowerCase());
		
		if (!skill) {
			log.single.err("UPDATE", `Skill "${skillId}" not installed`);
			process.exit(1);
		}
		
		if (skill.source.type !== "github") {
			log.single.err("UPDATE", "Only GitHub skills can be updated");
			process.exit(1);
		}
		
		log.single.info("UPDATE", `Checking for updates to ${skill.name}...`);
		
		const tags = await fetchTags(skill.source.owner, skill.source.repo);
		
		if (tags.length === 0) {
			log.single.warn("UPDATE", "No version tags found in repository");
			return;
		}
		
		const latestTag = tags[0];
		if (!latestTag) {
			log.single.warn("UPDATE", "No version tags found in repository");
			return;
		}
		
		const latestVersion = latestTag.name;
		const currentVersion = skill.version;
		
		if (latestVersion === currentVersion) {
			log.single.info("UPDATE", `${skill.name} is already at the latest version (${currentVersion})`);
			return;
		}
		
		log.single.info("UPDATE", `Updating ${skill.name} from ${currentVersion} to ${latestVersion}...`);
		
		const updatedSkill = createInstalledSkill(
			skill.id,
			skill.name,
			latestVersion,
			{ ...skill.source, ref: latestVersion }
		);
		
		const result = await installSkillFiles(updatedSkill.source, skill.id);
		
		if (!result.success) {
			log.single.err("UPDATE", result.error || "Failed to update skill");
			process.exit(1);
		}
		
		await addSkillToSkaniFile(updatedSkill);
		
		log.multi.info([
			{ t: "SUCCESS", m: `Updated ${skill.name} to ${latestVersion}` },
			{ t: "FILES", m: `${result.filesWritten} files written` },
		]);
	},
};
