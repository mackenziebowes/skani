import { symlink, mkdir, readdir, lstat, unlink } from "node:fs/promises";
import { join, basename } from "node:path";

export async function createSymlink(source: string, target: string): Promise<void> {
  await mkdir(join(target, ".."), { recursive: true });
  await symlink(source, target);
}

export async function createSymlinksForSkill(
  cacheSkillPath: string,
  projectSkillPath: string
): Promise<number> {
  await mkdir(projectSkillPath, { recursive: true });
  
  const files = await readdir(cacheSkillPath);
  let count = 0;
  
  for (const file of files) {
    const sourcePath = join(cacheSkillPath, file);
    const stat = await lstat(sourcePath);
    
    if (stat.isFile()) {
      const targetPath = join(projectSkillPath, file);
      await createSymlink(sourcePath, targetPath);
      count++;
    }
  }
  
  return count;
}

export async function removeSymlinks(skillPath: string): Promise<void> {
  const files = await readdir(skillPath);
  
  for (const file of files) {
    const filePath = join(skillPath, file);
    const stat = await lstat(filePath);
    
    if (stat.isSymbolicLink()) {
      await unlink(filePath);
    }
  }
}
