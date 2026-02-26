import { homedir } from "node:os";
import { join } from "node:path";
import { readdir } from "node:fs/promises";

export function getCacheRoot(): string {
  return join(homedir(), ".skani");
}

export function getSkillCachePath(skillId: string, cacheRoot?: string): string {
  return join(cacheRoot ?? getCacheRoot(), "registry", "skill", skillId);
}

export function getKitCachePath(kitName: string, cacheRoot?: string): string {
  return join(cacheRoot ?? getCacheRoot(), "registry", "kit", `${kitName}.json`);
}

export async function ensureCacheDir(skillId: string, cacheRoot?: string): Promise<string> {
  const skillPath = getSkillCachePath(skillId, cacheRoot);
  await Bun.write(join(skillPath, ".gitkeep"), "");
  return skillPath;
}

export async function isSkillCached(skillId: string, cacheRoot?: string): Promise<boolean> {
  const skillPath = getSkillCachePath(skillId, cacheRoot);
  const skillFile = join(skillPath, "SKILL.md");
  return await Bun.file(skillFile).exists();
}

export async function cacheSkill(
  skillId: string,
  files: Map<string, string>,
  cacheRoot?: string
): Promise<void> {
  const skillPath = getSkillCachePath(skillId, cacheRoot);
  
  for (const [relativePath, content] of files) {
    const filePath = join(skillPath, relativePath);
    await Bun.write(filePath, content);
  }
}

export async function getCachedSkillFiles(
  skillId: string,
  cacheRoot?: string
): Promise<Map<string, string> | null> {
  const skillPath = getSkillCachePath(skillId, cacheRoot);
  
  if (!(await isSkillCached(skillId, cacheRoot))) {
    return null;
  }
  
  const files = new Map<string, string>();
  const entries = await readdir(skillPath, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isFile()) {
      const content = await Bun.file(join(skillPath, entry.name)).text();
      files.set(entry.name, content);
    }
  }
  
  return files;
}

export interface CachedKitManifest {
  name: string;
  version: string;
  skills: Array<{ id: string }>;
}

export async function cacheKitManifest(
  kitName: string,
  manifest: CachedKitManifest,
  cacheRoot?: string
): Promise<void> {
  const kitPath = getKitCachePath(kitName, cacheRoot);
  await Bun.write(kitPath, JSON.stringify(manifest, null, 2));
}

export async function getCachedKitManifest(
  kitName: string,
  cacheRoot?: string
): Promise<CachedKitManifest | null> {
  const kitPath = getKitCachePath(kitName, cacheRoot);
  const exists = await Bun.file(kitPath).exists();
  
  if (!exists) {
    return null;
  }
  
  const content = await Bun.file(kitPath).text();
  return JSON.parse(content) as CachedKitManifest;
}
