import { join } from "node:path";
import type { InstalledSkill, SkillSource } from "../types/skill";
import { fetchSkillFiles, checkSkillExists } from "./github";

const DEFAULT_SKILLS_DIR = ".claude/skills";

export function getSkillInstallPath(skillId: string, cwd: string = process.cwd()): string {
	return join(cwd, DEFAULT_SKILLS_DIR, skillId);
}

export async function installSkillFiles(
	source: SkillSource,
	skillId: string,
	cwd: string = process.cwd()
): Promise<{ success: boolean; filesWritten: number; error?: string }> {
	const exists = await checkSkillExists(source);
	if (!exists) {
		return { success: false, filesWritten: 0, error: "Skill not found at specified path" };
	}
	
	const files = await fetchSkillFiles(source);
	const skillDir = getSkillInstallPath(skillId, cwd);
	
	let filesWritten = 0;
	
	for (const [relativePath, content] of files) {
		const filePath = join(skillDir, relativePath);
		await Bun.write(filePath, content);
		filesWritten++;
	}
	
	return { success: true, filesWritten };
}

export async function uninstallSkillFiles(
	skillId: string,
	cwd: string = process.cwd()
): Promise<boolean> {
	const skillDir = getSkillInstallPath(skillId, cwd);
	
	try {
		await Bun.file(skillDir).exists();
		const { exitCode } = Bun.spawn(["rm", "-rf", skillDir]);
		return exitCode === 0;
	} catch {
		return false;
	}
}

export async function isSkillInstalled(
	skillId: string,
	cwd: string = process.cwd()
): Promise<boolean> {
	const skillDir = getSkillInstallPath(skillId, cwd);
	const skillFile = join(skillDir, "SKILL.md");
	return await Bun.file(skillFile).exists();
}

export function createInstalledSkill(
	id: string,
	name: string,
	version: string,
	source: SkillSource
): InstalledSkill {
	return {
		id,
		name,
		version,
		source,
		installedAt: new Date().toISOString(),
	};
}
