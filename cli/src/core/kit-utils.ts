import { join } from "node:path";
import { readdir } from "node:fs/promises";

export async function listKits(cwd: string = process.cwd()): Promise<string[]> {
  const files = await readdir(cwd);
  return files.filter(f => f.endsWith('.skani.json'));
}

export async function backupSkaniFile(cwd: string = process.cwd()): Promise<void> {
  const skaniPath = join(cwd, 'skani.json');
  const backupPath = join(cwd, 'previous.skani.json');
  const content = await Bun.file(skaniPath).text();
  await Bun.write(backupPath, content);
}

export async function restoreFromBackup(cwd: string = process.cwd()): Promise<void> {
  const backupPath = join(cwd, 'previous.skani.json');
  const skaniPath = join(cwd, 'skani.json');
  const content = await Bun.file(backupPath).text();
  await Bun.write(skaniPath, content);
}

export async function clearSkillsDir(cwd: string = process.cwd()): Promise<void> {
  const skillsDir = join(cwd, '.claude', 'skills');
  const entries = await readdir(skillsDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(skillsDir, entry.name);
    await Bun.$`rm -rf ${fullPath}`;
  }
}
