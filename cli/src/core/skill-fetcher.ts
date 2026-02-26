import { join } from "node:path";
import { homedir } from "node:os";
import type { InstalledSkill, SkillSource } from "../types/skill";
import { fetchSkillFiles, checkSkillExists } from "./github";
import { fetchSkillFilesFromRegistry } from "./registry-fetcher";
import { isSkillCached, cacheSkill, getSkillCachePath } from "./cache";
import { createSymlinksForSkill, removeSymlinks } from "./symlink";

// TODO: Multi-environment support - make this configurable for different agents
// (e.g., .opencode/skills/, .aider/skills/)
// See docs/plans/2026-02-26-global-cache-symlinks-design.md
const DEFAULT_SKILLS_DIR = ".claude/skills";

export function getSkillInstallPath(skillId: string, cwd: string = process.cwd()): string {
	return join(cwd, DEFAULT_SKILLS_DIR, skillId);
}

export async function installSkillFiles(
	source: SkillSource,
	skillId: string,
	cwd: string = process.cwd(),
	options: { refresh?: boolean } = {}
): Promise<{ success: boolean; filesWritten: number; error?: string; source: "registry" | "github" | "cache" }> {
	const skillDir = getSkillInstallPath(skillId, cwd);
	const { refresh = false } = options;
	
	const cached = await isSkillCached(skillId);
	
	if (!refresh && cached) {
		await removeSymlinks(skillDir);
		const filesWritten = await createSymlinksForSkill(
			getSkillCachePath(skillId),
			skillDir
		);
		return { success: true, filesWritten, source: "cache" };
	}
	
	let files: Map<string, string> | null = null;
	let usedSource: "registry" | "github" = "github";
	
	if (source.mirrored !== false) {
		files = await fetchSkillFilesFromRegistry(skillId);
		if (files) {
			usedSource = "registry";
		}
	}
	
	if (!files) {
		const exists = await checkSkillExists(source);
		if (!exists) {
			return { success: false, filesWritten: 0, error: "Skill not found at specified path", source: "github" };
		}
		
		files = await fetchSkillFiles(source);
		usedSource = "github";
	}
	
	await cacheSkill(skillId, files);
	
	await removeSymlinks(skillDir);
	const filesWritten = await createSymlinksForSkill(
		getSkillCachePath(skillId),
		skillDir
	);
	
	return { success: true, filesWritten, source: usedSource };
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
