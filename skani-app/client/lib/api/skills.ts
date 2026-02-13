import { SkillMetadata, SkillSearchResult } from "../types/skill";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3050";

export async function fetchSkills(): Promise<SkillSearchResult[]> {
	const response = await fetch(`${API_BASE}/api/skills`);
	if (!response.ok) {
		throw new Error("Failed to fetch skills");
	}
	return response.json();
}

export async function fetchSkill(id: string): Promise<SkillMetadata> {
	const response = await fetch(`${API_BASE}/api/skills/${id}`);
	if (!response.ok) {
		throw new Error("Failed to fetch skill");
	}
	return response.json();
}

export async function searchSkills(query: string): Promise<SkillSearchResult[]> {
	const response = await fetch(`${API_BASE}/api/skills/search?q=${encodeURIComponent(query)}`);
	if (!response.ok) {
		throw new Error("Failed to search skills");
	}
	return response.json();
}
