import { SkillMetadata, SkillSearchResult } from "../types/skill";

export async function fetchSkills(): Promise<SkillSearchResult[]> {
	const response = await fetch("/api/skills");
	if (!response.ok) {
		throw new Error("Failed to fetch skills");
	}
	return response.json();
}

export async function fetchSkill(id: string): Promise<SkillMetadata> {
	const response = await fetch(`/api/skills/${id}`);
	if (!response.ok) {
		throw new Error("Failed to fetch skill");
	}
	return response.json();
}

export async function searchSkills(query: string): Promise<SkillSearchResult[]> {
	const response = await fetch(`/api/skills/search?q=${encodeURIComponent(query)}`);
	if (!response.ok) {
		throw new Error("Failed to search skills");
	}
	return response.json();
}
