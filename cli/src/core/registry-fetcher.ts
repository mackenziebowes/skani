import type { SkillSource } from "../types/skill";

const REGISTRY_URL = "https://skani.mackenziebowes.com";

export interface RegistrySkillFiles {
	id: string;
	source: {
		owner: string;
		repo: string;
		ref: string;
		path: string;
	};
	files: Record<string, string>;
	mirroredAt: string;
	mirrored: boolean;
}

export async function fetchSkillFilesFromRegistry(
	skillId: string
): Promise<Map<string, string> | null> {
	try {
		const response = await fetch(`${REGISTRY_URL}/api/skills/${skillId}/files`);
		
		if (!response.ok) {
			if (response.status === 404) {
				return null;
			}
			throw new Error(`Registry error: ${response.status} ${response.statusText}`);
		}
		
		const data = (await response.json()) as RegistrySkillFiles;
		
		if (!data.mirrored || !data.files) {
			return null;
		}
		
		const files = new Map<string, string>();
		for (const [path, content] of Object.entries(data.files)) {
			files.set(path, content);
		}
		
		return files;
	} catch (error) {
		console.error(`Failed to fetch skill files from registry: ${error}`);
		return null;
	}
}

export async function checkSkillMirrored(skillId: string): Promise<boolean> {
	try {
		const response = await fetch(`${REGISTRY_URL}/api/skills/${skillId}/files`, {
			method: "HEAD",
		});
		return response.ok;
	} catch {
		return false;
	}
}
