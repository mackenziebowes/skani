import { join } from "node:path";
import type { SkaniFile, InstalledSkill, SkaniEnvironment } from "../types/skill";

const SKANI_FILE_NAME = "skani.json";
const CURRENT_VERSION = "1.0.0";

function getDefaultEnvironment(): SkaniEnvironment {
	const now = new Date().toISOString();
	return {
		name: "skani-project",
		created: now,
		updated: now,
	};
}

export function getDefaultSkaniFile(): SkaniFile {
	return {
		version: CURRENT_VERSION,
		environment: getDefaultEnvironment(),
		skills: [],
	};
}

export async function skaniFileExists(cwd: string = process.cwd()): Promise<boolean> {
	const filePath = join(cwd, SKANI_FILE_NAME);
	return await Bun.file(filePath).exists();
}

export async function readSkaniFile(cwd: string = process.cwd()): Promise<SkaniFile | null> {
	const filePath = join(cwd, SKANI_FILE_NAME);
	const exists = await Bun.file(filePath).exists();
	
	if (!exists) {
		return null;
	}
	
	const content = await Bun.file(filePath).text();
	return JSON.parse(content) as SkaniFile;
}

export async function writeSkaniFile(data: SkaniFile, cwd: string = process.cwd()): Promise<void> {
	const filePath = join(cwd, SKANI_FILE_NAME);
	data.environment.updated = new Date().toISOString();
	await Bun.write(filePath, JSON.stringify(data, null, 2));
}

export async function initSkaniFile(name: string, cwd: string = process.cwd()): Promise<SkaniFile> {
	const now = new Date().toISOString();
	const skaniFile: SkaniFile = {
		version: CURRENT_VERSION,
		environment: {
			name,
			created: now,
			updated: now,
		},
		skills: [],
	};
	
	await writeSkaniFile(skaniFile, cwd);
	return skaniFile;
}

export async function addSkillToSkaniFile(
	skill: InstalledSkill,
	cwd: string = process.cwd()
): Promise<SkaniFile> {
	let skaniFile = await readSkaniFile(cwd);
	
	if (!skaniFile) {
		skaniFile = getDefaultSkaniFile();
	}
	
	const existingIndex = skaniFile.skills.findIndex(s => s.id === skill.id);
	if (existingIndex >= 0) {
		skaniFile.skills[existingIndex] = skill;
	} else {
		skaniFile.skills.push(skill);
	}
	
	await writeSkaniFile(skaniFile, cwd);
	return skaniFile;
}

export async function removeSkillFromSkaniFile(
	skillId: string,
	cwd: string = process.cwd()
): Promise<SkaniFile | null> {
	const skaniFile = await readSkaniFile(cwd);
	
	if (!skaniFile) {
		return null;
	}
	
	skaniFile.skills = skaniFile.skills.filter(s => s.id !== skillId);
	await writeSkaniFile(skaniFile, cwd);
	return skaniFile;
}

export async function getInstalledSkill(
	skillId: string,
	cwd: string = process.cwd()
): Promise<InstalledSkill | null> {
	const skaniFile = await readSkaniFile(cwd);
	
	if (!skaniFile) {
		return null;
	}
	
	return skaniFile.skills.find(s => s.id === skillId) || null;
}
