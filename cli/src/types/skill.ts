export interface SkillSource {
	url: string;
	type: "github" | "registry";
	owner: string;
	repo: string;
	ref: string;
	path: string;
	mirrored?: boolean;
}

export interface InstalledSkill {
	id: string;
	name: string;
	version: string;
	source: SkillSource;
	installedAt: string;
}

export interface SkaniEnvironment {
	name: string;
	created: string;
	updated: string;
}

export interface SkaniFile {
	version: string;
	environment: SkaniEnvironment;
	skills: InstalledSkill[];
}

export interface SkillVersion {
	version: string;
	ref: string;
	path: string;
	released: string;
	changelog?: string;
}

export interface SkillAuthor {
	name: string;
	github: string;
}

export interface SkillRepository {
	owner: string;
	repo: string;
	defaultPath: string;
}

export interface SkillMetadata {
	id: string;
	name: string;
	description: string;
	versions: SkillVersion[];
	latestVersion: string;
	tags: string[];
	author: SkillAuthor;
	repository: SkillRepository;
	documentation: string;
	installCommand: string;
}

export interface SkillSearchResult {
	id: string;
	name: string;
	description: string;
	latestVersion: string;
	tags: string[];
}

export interface RegistrySkill {
	id: string;
	repository: SkillRepository;
	tags: string[];
	featured?: boolean;
}
