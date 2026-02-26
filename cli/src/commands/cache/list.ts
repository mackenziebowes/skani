import type { Command } from "../../core/cli";
import { getCacheRoot, getSkillCachePath } from "../../core/cache";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import log from "../../core/log";

export const cacheListCommand: Command = {
  name: "cache",
  subcommand: "list",
  description: "List all cached skills",
  instructions: "Usage: skani cache list",
  run: async () => {
    const cacheRoot = getCacheRoot();
    const skillPath = join(cacheRoot, "registry", "skill");
    
    try {
      const skills = await readdir(skillPath);
      
      if (skills.length === 0) {
        log.single.info("CACHE", "No skills cached");
        return;
      }
      
      let totalSize = 0;
      const rows: { t: string; m: string }[] = [{ t: "CACHED SKILLS", m: "" }];
      
      for (const skillId of skills) {
        const skillDir = getSkillCachePath(skillId);
        const size = await getDirectorySize(skillDir);
        totalSize += size;
        rows.push({ t: skillId, m: formatSize(size) });
      }
      
      rows.push({ t: "TOTAL", m: formatSize(totalSize) });
      log.multi.info(rows);
    } catch {
      log.single.info("CACHE", "No skills cached");
    }
  },
};

async function getDirectorySize(dir: string): Promise<number> {
  let size = 0;
  const files = await readdir(dir, { withFileTypes: true });
  
  for (const file of files) {
    if (file.isFile()) {
      const s = await stat(join(dir, file.name));
      size += s.size;
    }
  }
  
  return size;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
