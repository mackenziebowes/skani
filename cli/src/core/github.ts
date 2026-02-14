import type { SkillSource, SkillVersion, SkillMetadata } from "../types/skill";

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

export function parseSkillId(input: string): { owner: string; repo: string; skillId: string } | null {
	const match = input.match(/^([^/]+)\/([^/]+)$/);
	if (!match || !match[1] || !match[2]) {
		return null;
	}
	
	const owner = match[1];
	const repo = match[2];
	const skillId = `${owner}-${repo}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
	
	return { owner, repo, skillId };
}

export function parseSkillRef(input: string): { owner: string; repo: string; ref: string | undefined; path: string } | null {
	const githubMatch = input.match(/^github:([^/]+)\/([^/]+)(?:@([^/]+))?(?:\/(.+))?$/);
	if (githubMatch && githubMatch[1] && githubMatch[2]) {
		let ref = githubMatch[3];
		let path = githubMatch[4] || ".claude/skills";

		// Handle @version at the end of path
		if (!ref && path.includes("@")) {
			const pathParts = path.split("@");
			path = pathParts[0];
			ref = pathParts[1];
		}

		return {
			owner: githubMatch[1],
			repo: githubMatch[2],
			ref,
			path
		};
	}

	const simpleMatch = input.match(/^([^/]+)\/([^/]+)(?:@([^/]+))?$/);
	if (simpleMatch && simpleMatch[1] && simpleMatch[2]) {
		return {
			owner: simpleMatch[1],
			repo: simpleMatch[2],
			ref: simpleMatch[3],
			path: ".claude/skills"
		};
	}

	return null;
}
