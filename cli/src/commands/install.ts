import type { Command } from "../core/cli";
import { readSkaniFile, initSkaniFile, addSkillToSkaniFile } from "../core/skani-file";
import { parseSkillRef, fetchTags } from "../core/github";
import { installSkillFiles, createInstalledSkill, getSkillInstallPath } from "../core/skill-fetcher";
import type { SkillSource } from "../types/skill";
import log from "../core/log";

export const installCommand: Command = {
	name: "install",
	description: "Install a skill from GitHub",
	instructions: "Usage: skani install <owner/repo>[@version] or skani install github:owner/repo[@version][/path]",
	run: async (args: string[]) => {
		const skillRef = args[0];
		
		if (!skillRef) {
			log.single.err("INSTALL", "No skill specified");
			log.single.info("USAGE", "skani install <owner/repo>[@version]");
			process.exit(1);
		}
		
		const parsed = parseSkillRef(skillRef);
		if (!parsed) {
			log.single.err("INSTALL", "Invalid skill reference format");
			log.single.info("FORMAT", "owner/repo, owner/repo@version, or github:owner/repo/path@version");
			process.exit(1);
		}
		
		const { owner, repo, ref, path } = parsed;
		const skillId = `${owner}-${repo}`.toLowerCase();
		
		let skaniFile = await readSkaniFile();
		if (!skaniFile) {
			log.single.info("INIT", "No skani.json found, creating one...");
			skaniFile = await initSkaniFile("skani-project");
		}
		
		const existing = skaniFile.skills.find(s => s.id === skillId);
		if (existing) {
			log.single.warn("INSTALL", `Skill "${skillId}" is already installed (v${existing.version})`);
		}
		
		log.single.info("INSTALL", `Fetching ${owner}/${repo}...`);
		
		let version = ref;
		if (!version) {
			const tags = await fetchTags(owner, repo);
			if (tags.length > 0 && tags[0]) {
				version = tags[0].name;
				log.single.info("VERSION", `Using latest version: ${version}`);
			} else {
				version = "main";
				log.single.warn("VERSION", "No tags found, using 'main' branch");
			}
		}
		
		const source: SkillSource = {
			type: "github",
			owner,
			repo,
			ref: version || "main",
			path,
		};
		
		const skillName = repo;
		const installedSkill = createInstalledSkill(skillId, skillName, version || "latest", source);
		
		log.single.info("INSTALL", `Installing skill to ${getSkillInstallPath(skillId)}...`);
		
		const result = await installSkillFiles(source, skillId);
		
		if (!result.success) {
			log.single.err("INSTALL", result.error || "Failed to install skill");
			process.exit(1);
		}
		
		await addSkillToSkaniFile(installedSkill);
		
		log.multi.info([
			{ t: "SUCCESS", m: `Installed ${skillName} (${version || "latest"})` },
			{ t: "FILES", m: `${result.filesWritten} files written` },
			{ t: "LOCATION", m: getSkillInstallPath(skillId) },
		]);
	},
};
