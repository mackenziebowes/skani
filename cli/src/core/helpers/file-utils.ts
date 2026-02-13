import { mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";

export async function writeFileTuple([targetDir, relativePath, content]: [string, string, string]): Promise<void> {
  const fullPath = resolve(targetDir, relativePath);
  await mkdir(join(fullPath, ".."), { recursive: true });
  await Bun.write(fullPath, content);
}
