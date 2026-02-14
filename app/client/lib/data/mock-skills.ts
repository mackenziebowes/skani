import { SkillMetadata, SkillSearchResult } from "../types/skill";

export const mockSkills: SkillMetadata[] = [
	{
		id: "omarchy",
		name: "Omarchy",
		description: "REQUIRED for ANY changes to Linux desktop, window manager, or system config. Handles Hyprland, waybar, walker, terminal configs, themes, and more.",
		versions: [
			{
				version: "1.2.3",
				ref: "v1.2.3",
				path: ".claude/skills/Omarchy",
				released: "2024-01-15T00:00:00Z",
				changelog: "Added support for new Hyprland animations",
			},
			{
				version: "1.2.2",
				ref: "v1.2.2",
				path: ".claude/skills/Omarchy",
				released: "2024-01-10T00:00:00Z",
			},
			{
				version: "1.2.1",
				ref: "v1.2.1",
				path: ".claude/skills/Omarchy",
				released: "2024-01-05T00:00:00Z",
			},
		],
		latestVersion: "1.2.3",
		tags: ["hyprland", "window-manager", "desktop", "linux", "waybar"],
		author: {
			name: "Anomaly",
			github: "anomalyco",
		},
		repository: {
			owner: "anomalyco",
			repo: "omarchy",
			defaultPath: ".claude/skills/Omarchy",
		},
		documentation: `# Omarchy

A comprehensive skill for managing Linux desktop configurations.

## Features

- Hyprland window manager configuration
- Waybar status bar management
- Walker application launcher
- Terminal configurations (kitty, alacritty, ghostty)
- Theme management
- Keybindings and window rules

## Usage

After installation, the skill will be available for your coding agent to use when modifying desktop configurations.
`,
		installCommand: "skani install anomalyco/omarchy@v1.2.3",
	},
	{
		id: "nextjs-boilerplate",
		name: "Next.js Boilerplate",
		description: "Scaffold new Next.js projects with best practices, TypeScript, Tailwind, and common patterns.",
		versions: [
			{
				version: "2.0.0",
				ref: "v2.0.0",
				path: ".claude/skills/NextJS",
				released: "2024-02-01T00:00:00Z",
				changelog: "Updated to Next.js 15, App Router by default",
			},
			{
				version: "1.5.0",
				ref: "v1.5.0",
				path: ".claude/skills/NextJS",
				released: "2024-01-20T00:00:00Z",
			},
		],
		latestVersion: "2.0.0",
		tags: ["nextjs", "react", "typescript", "tailwind", "scaffolding"],
		author: {
			name: "Dev Tools",
			github: "devtools",
		},
		repository: {
			owner: "devtools",
			repo: "nextjs-skill",
			defaultPath: ".claude/skills/NextJS",
		},
		documentation: `# Next.js Boilerplate

Create new Next.js applications with production-ready configurations.

## Features

- App Router with TypeScript
- Tailwind CSS configured
- ESLint and Prettier setup
- Common UI components
- API route patterns
`,
		installCommand: "skani install devtools/nextjs-skill@v2.0.0",
	},
	{
		id: "rust-backend",
		name: "Rust Backend",
		description: "Patterns and utilities for building robust Rust backend services with Axum, SQLx, and common middleware.",
		versions: [
			{
				version: "1.0.0",
				ref: "v1.0.0",
				path: ".claude/skills/RustBackend",
				released: "2024-01-25T00:00:00Z",
			},
		],
		latestVersion: "1.0.0",
		tags: ["rust", "axum", "backend", "api", "sqlx"],
		author: {
			name: "Rustacean",
			github: "rustacean",
		},
		repository: {
			owner: "rustacean",
			repo: "rust-backend-skill",
			defaultPath: ".claude/skills/RustBackend",
		},
		documentation: `# Rust Backend

Build production-ready Rust backend services.

## Features

- Axum web framework patterns
- SQLx for database operations
- JWT authentication
- Error handling patterns
- Logging and tracing
`,
		installCommand: "skani install rustacean/rust-backend-skill@v1.0.0",
	},
	{
		id: "prisma-schema",
		name: "Prisma Schema",
		description: "Design and manage Prisma schemas with best practices, migrations, and common patterns.",
		versions: [
			{
				version: "1.1.0",
				ref: "v1.1.0",
				path: ".claude/skills/Prisma",
				released: "2024-02-05T00:00:00Z",
			},
			{
				version: "1.0.0",
				ref: "v1.0.0",
				path: ".claude/skills/Prisma",
				released: "2024-01-15T00:00:00Z",
			},
		],
		latestVersion: "1.1.0",
		tags: ["prisma", "database", "orm", "typescript", "migrations"],
		author: {
			name: "DB Expert",
			github: "dbexpert",
		},
		repository: {
			owner: "dbexpert",
			repo: "prisma-skill",
			defaultPath: ".claude/skills/Prisma",
		},
		documentation: `# Prisma Schema

Manage Prisma schemas with best practices.

## Features

- Schema design patterns
- Migration strategies
- Relation modeling
- Index optimization
`,
		installCommand: "skani install dbexpert/prisma-skill@v1.1.0",
	},
	{
		id: "testing-vitest",
		name: "Vitest Testing",
		description: "Comprehensive testing patterns for Vitest including unit tests, integration tests, and mocking strategies.",
		versions: [
			{
				version: "1.0.0",
				ref: "v1.0.0",
				path: ".claude/skills/Vitest",
				released: "2024-02-01T00:00:00Z",
			},
		],
		latestVersion: "1.0.0",
		tags: ["vitest", "testing", "javascript", "typescript", "mocking"],
		author: {
			name: "Test Pro",
			github: "testpro",
		},
		repository: {
			owner: "testpro",
			repo: "vitest-skill",
			defaultPath: ".claude/skills/Vitest",
		},
		documentation: `# Vitest Testing

Comprehensive testing patterns for Vitest.

## Features

- Unit test patterns
- Integration testing
- Mocking strategies
- Coverage configuration
`,
		installCommand: "skani install testpro/vitest-skill@v1.0.0",
	},
];

export function searchSkills(query: string): SkillSearchResult[] {
	const lowerQuery = query.toLowerCase();
	
	return mockSkills
		.filter(skill => 
			skill.name.toLowerCase().includes(lowerQuery) ||
			skill.description.toLowerCase().includes(lowerQuery) ||
			skill.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
		)
		.map(skill => ({
			id: skill.id,
			name: skill.name,
			description: skill.description,
			latestVersion: skill.latestVersion,
			tags: skill.tags,
		}));
}

export function getSkillById(id: string): SkillMetadata | null {
	return mockSkills.find(skill => skill.id === id) || null;
}

export function getAllSkills(): SkillSearchResult[] {
	return mockSkills.map(skill => ({
		id: skill.id,
		name: skill.name,
		description: skill.description,
		latestVersion: skill.latestVersion,
		tags: skill.tags,
	}));
}

import { getTopSkills } from "./skills-dot-sh";

let cachedRealSkills: SkillMetadata[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getSkillsWithRealData(): Promise<SkillMetadata[]> {
	const now = Date.now();
	
	if (cachedRealSkills && (now - cacheTimestamp) < CACHE_DURATION) {
		return cachedRealSkills;
	}
	
	try {
		const topSkills = await getTopSkills(50);
		cachedRealSkills = [...topSkills, ...mockSkills];
		cacheTimestamp = now;
		return cachedRealSkills;
	} catch (error) {
		console.error("Failed to fetch real skills data:", error);
		return mockSkills;
	}
}

export async function searchSkillsReal(query: string): Promise<SkillSearchResult[]> {
	const skills = await getSkillsWithRealData();
	const lowerQuery = query.toLowerCase();
	
	return skills
		.filter(skill => 
			skill.name.toLowerCase().includes(lowerQuery) ||
			skill.description.toLowerCase().includes(lowerQuery) ||
			skill.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
		)
		.map(skill => ({
			id: skill.id,
			name: skill.name,
			description: skill.description,
			latestVersion: skill.latestVersion,
			tags: skill.tags,
		}));
}

export async function getAllSkillsReal(): Promise<SkillSearchResult[]> {
	const skills = await getSkillsWithRealData();
	return skills.map(skill => ({
		id: skill.id,
		name: skill.name,
		description: skill.description,
		latestVersion: skill.latestVersion,
		tags: skill.tags,
	}));
}

export async function getSkillByIdReal(id: string): Promise<SkillMetadata | null> {
	const skills = await getSkillsWithRealData();
	return skills.find(skill => skill.id === id) || null;
}
