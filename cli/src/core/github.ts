import type { SkillSource, SkillVersion, SkillMetadata } from "../types/skill";

export interface ParsedSkillRef {
	url: string;
	owner: string;
	repo: string;
	ref: string;
	path: string;
	skillId: string;
}

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com";

interface GitHubTag {
	name: string;
	commit: {
		sha: string;
	};
}

interface GitHubContent {
	name: string;
	path: string;
	type: "file" | "dir";
	download_url: string | null;
}

async function githubFetch(path: string): Promise<Response> {
	const response = await fetch(`${GITHUB_API_BASE}${path}`, {
		headers: {
			"Accept": "application/vnd.github.v3+json",
			"User-Agent": "skani-cli",
		},
	});
	
	if (!response.ok) {
		throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
	}
	
	return response;
}

export async function fetchTags(owner: string, repo: string): Promise<GitHubTag[]> {
	const response = await githubFetch(`/repos/${owner}/${repo}/tags`);
	return response.json() as Promise<GitHubTag[]>;
}

export async function fetchSkillVersions(owner: string, repo: string): Promise<SkillVersion[]> {
	const tags = await fetchTags(owner, repo);
	
	return tags.map(tag => ({
		version: tag.name,
		ref: tag.name,
		path: "", // Will be determined by skill config
		released: new Date().toISOString(), // GitHub doesn't provide tag date in list
	}));
}

export async function fetchFileContent(
	owner: string,
	repo: string,
	ref: string,
	path: string
): Promise<string> {
	const url = `${GITHUB_RAW_BASE}/${owner}/${repo}/${ref}/${path}`;
	const response = await fetch(url);
	
	if (!response.ok) {
		throw new Error(`Failed to fetch file: ${response.status}`);
	}
	
	return response.text();
}

export async function fetchDirectoryContents(
	owner: string,
	repo: string,
	ref: string,
	path: string
): Promise<GitHubContent[]> {
	const response = await githubFetch(`/repos/${owner}/${repo}/contents/${path}?ref=${ref}`);
	return response.json() as Promise<GitHubContent[]>;
}

export async function fetchSkillFiles(
	source: SkillSource
): Promise<Map<string, string>> {
	const files = new Map<string, string>();
	
	await fetchDirectoryRecursive(source, source.path, files);
	
	return files;
}

async function fetchDirectoryRecursive(
	source: SkillSource,
	currentPath: string,
	files: Map<string, string>
): Promise<void> {
	try {
		const contents = await fetchDirectoryContents(
			source.owner,
			source.repo,
			source.ref,
			currentPath
		);
		
		for (const item of contents) {
			if (item.type === "file" && item.download_url) {
				const content = await fetch(item.download_url).then(r => r.text());
				const relativePath = item.path.replace(source.path + "/", "");
				files.set(relativePath, content);
			} else if (item.type === "dir") {
				await fetchDirectoryRecursive(source, item.path, files);
			}
		}
	} catch (error) {
		throw new Error(`Failed to fetch directory ${currentPath}: ${error}`);
	}
}

export async function checkSkillExists(source: SkillSource): Promise<boolean> {
	try {
		await fetchDirectoryContents(
			source.owner,
			source.repo,
			source.ref,
			source.path
		);
		return true;
	} catch {
		return false;
	}
}

export function parseSkillRef(input: string): ParsedSkillRef | null {
	let url: URL;
	
	let versionOverride: string | undefined;
	const atIndex = input.lastIndexOf("@");
	if (atIndex > 0 && !input.startsWith("http")) {
		return null;
	}
	if (atIndex > 0 && input.startsWith("http")) {
		versionOverride = input.slice(atIndex + 1);
		input = input.slice(0, atIndex);
	}
	
	try {
		url = new URL(input);
	} catch {
		return null;
	}
	
	if (url.host !== "github.com" && url.host !== "www.github.com") {
		return null;
	}
	
	const pathParts = url.pathname.split("/").filter(Boolean);
	
	if (pathParts.length < 2) {
		return null;
	}
	
	const owner = pathParts[0]!;
	const repo = pathParts[1]!;
	
	if (pathParts.length === 2) {
		return null;
	}
	
	const type = pathParts[2];
	if (type !== "tree" && type !== "blob") {
		return null;
	}
	
	if (pathParts.length < 5) {
		return null;
	}
	
	const ref = versionOverride || pathParts[3]!;
	const skillPath = pathParts.slice(4).join("/");
	
	const finalPath = type === "blob" 
		? skillPath.split("/").slice(0, -1).join("/")
		: skillPath;
	
	if (!finalPath) {
		return null;
	}
	
	const pathSegments = finalPath.split("/");
	const lastSegment = pathSegments[pathSegments.length - 1]!;
	const skillId = `${owner}-${repo}-${lastSegment}`.toLowerCase();
	
	const normalizedUrl = `https://github.com/${owner}/${repo}/tree/${ref}/${finalPath}`;
	
	return {
		url: normalizedUrl,
		owner,
		repo,
		ref,
		path: finalPath,
		skillId,
	};
}

