# Global Cache with Symlinks Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a global cache layer at `~/.skani/registry/` that stores skills once and symlinks them into projects, reducing remote API calls and disk usage.

**Architecture:** Skills are downloaded to `~/.skani/registry/skill/<id>/` once. When installing, file-level symlinks are created in `.claude/skills/<id>/` pointing to the cache. The `--refresh` flag forces re-download. New `cache` commands manage the cache.

**Tech Stack:** Bun, Node.js fs/path modules, symlinks

---

## Task 1: Add Cache Path Utilities

**Files:**
- Create: `cli/src/core/cache.ts`
- Test: `cli/src/core/cache.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, test, expect } from "bun:test";
import { getCacheRoot, getSkillCachePath, getKitCachePath, ensureCacheDir } from "./cache";
import { homedir } from "node:os";
import { join } from "node:path";

describe("cache utilities", () => {
  test("getCacheRoot returns ~/.skani path", () => {
    const expected = join(homedir(), ".skani");
    expect(getCacheRoot()).toBe(expected);
  });

  test("getSkillCachePath returns skill cache path", () => {
    const expected = join(homedir(), ".skani", "registry", "skill", "my-skill");
    expect(getSkillCachePath("my-skill")).toBe(expected);
  });

  test("getKitCachePath returns kit manifest path", () => {
    const expected = join(homedir(), ".skani", "registry", "kit", "my-kit.json");
    expect(getKitCachePath("my-kit")).toBe(expected);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd cli && bun test src/core/cache.test.ts`
Expected: FAIL with "Cannot find module './cache'"

**Step 3: Write minimal implementation**

```typescript
import { homedir } from "node:os";
import { join } from "node:path";

export function getCacheRoot(): string {
  return join(homedir(), ".skani");
}

export function getSkillCachePath(skillId: string): string {
  return join(getCacheRoot(), "registry", "skill", skillId);
}

export function getKitCachePath(kitName: string): string {
  return join(getCacheRoot(), "registry", "kit", `${kitName}.json`);
}

export async function ensureCacheDir(skillId: string): Promise<string> {
  const skillPath = getSkillCachePath(skillId);
  await Bun.write(join(skillPath, ".gitkeep"), "");
  return skillPath;
}
```

**Step 4: Run test to verify it passes**

Run: `cd cli && bun test src/core/cache.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add cli/src/core/cache.ts cli/src/core/cache.test.ts
git commit -m "feat(cli): add cache path utilities"
```

---

## Task 2: Add Symlink Utilities

**Files:**
- Create: `cli/src/core/symlink.ts`
- Test: `cli/src/core/symlink.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { join } from "node:path";
import { mkdirSync, rmSync, existsSync, lstatSync } from "node:fs";
import { createSymlink, createSymlinksForSkill, removeSymlinks } from "./symlink";

describe("symlink utilities", () => {
  const testDir = join(process.cwd(), ".test-symlink");
  const cacheDir = join(testDir, "cache");
  const projectDir = join(testDir, "project");

  beforeEach(() => {
    mkdirSync(join(cacheDir, "test-skill"), { recursive: true });
    mkdirSync(join(projectDir, ".claude", "skills"), { recursive: true });
    Bun.write(join(cacheDir, "test-skill", "SKILL.md"), "# Test Skill");
    Bun.write(join(cacheDir, "test-skill", "extra.md"), "# Extra");
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  test("createSymlink creates a symlink from target to source", async () => {
    const target = join(projectDir, ".claude", "skills", "test-skill", "SKILL.md");
    const source = join(cacheDir, "test-skill", "SKILL.md");
    
    await createSymlink(source, target);
    
    expect(existsSync(target)).toBe(true);
    expect(lstatSync(target).isSymbolicLink()).toBe(true);
  });

  test("createSymlinksForSkill creates symlinks for all files in skill", async () => {
    const cacheSkillPath = join(cacheDir, "test-skill");
    const projectSkillPath = join(projectDir, ".claude", "skills", "test-skill");
    
    const count = await createSymlinksForSkill(cacheSkillPath, projectSkillPath);
    
    expect(count).toBe(2);
    expect(existsSync(join(projectSkillPath, "SKILL.md"))).toBe(true);
    expect(existsSync(join(projectSkillPath, "extra.md"))).toBe(true);
  });

  test("removeSymlinks removes all symlinks in directory", async () => {
    const cacheSkillPath = join(cacheDir, "test-skill");
    const projectSkillPath = join(projectDir, ".claude", "skills", "test-skill");
    
    await createSymlinksForSkill(cacheSkillPath, projectSkillPath);
    await removeSymlinks(projectSkillPath);
    
    expect(existsSync(join(projectSkillPath, "SKILL.md"))).toBe(false);
    expect(existsSync(join(projectSkillPath, "extra.md"))).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd cli && bun test src/core/symlink.test.ts`
Expected: FAIL with "Cannot find module './symlink'"

**Step 3: Write minimal implementation**

```typescript
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
```

**Step 4: Run test to verify it passes**

Run: `cd cli && bun test src/core/symlink.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add cli/src/core/symlink.ts cli/src/core/symlink.test.ts
git commit -m "feat(cli): add symlink utilities"
```

---

## Task 3: Add Cache Skill Utilities

**Files:**
- Modify: `cli/src/core/cache.ts`
- Modify: `cli/src/core/cache.test.ts`

**Step 1: Write the failing test**

Add to `cli/src/core/cache.test.ts`:

```typescript
import { rmSync, existsSync } from "node:fs";
import { join } from "node:path";

describe("cache skill operations", () => {
  const testCacheDir = join(process.cwd(), ".test-cache-ops");

  afterEach(() => {
    rmSync(testCacheDir, { recursive: true, force: true });
  });

  test("isSkillCached returns false when skill not in cache", async () => {
    const result = await isSkillCached("nonexistent-skill", testCacheDir);
    expect(result).toBe(false);
  });

  test("cacheSkill stores skill files in cache", async () => {
    const files = new Map([
      ["SKILL.md", "# Test Skill"],
      ["extra.md", "# Extra content"],
    ]);
    
    await cacheSkill("test-skill", files, testCacheDir);
    
    const skillPath = join(testCacheDir, "registry", "skill", "test-skill");
    expect(existsSync(join(skillPath, "SKILL.md"))).toBe(true);
    expect(existsSync(join(skillPath, "extra.md"))).toBe(true);
  });

  test("isSkillCached returns true when skill exists in cache", async () => {
    const files = new Map([["SKILL.md", "# Test Skill"]]);
    await cacheSkill("cached-skill", files, testCacheDir);
    
    const result = await isSkillCached("cached-skill", testCacheDir);
    expect(result).toBe(true);
  });

  test("getCachedSkillFiles returns files from cache", async () => {
    const files = new Map([
      ["SKILL.md", "# Test Skill"],
      ["extra.md", "# Extra"],
    ]);
    await cacheSkill("read-skill", files, testCacheDir);
    
    const result = await getCachedSkillFiles("read-skill", testCacheDir);
    
    expect(result).not.toBeNull();
    expect(result?.get("SKILL.md")).toBe("# Test Skill");
    expect(result?.get("extra.md")).toBe("# Extra");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd cli && bun test src/core/cache.test.ts`
Expected: FAIL with "isSkillCached is not defined"

**Step 3: Add implementation to `cli/src/core/cache.ts`**

```typescript
import { exists, readdir, readFile } from "node:fs/promises";

export async function isSkillCached(skillId: string, cacheRoot?: string): Promise<boolean> {
  const skillPath = getSkillCachePath(skillId);
  const skillFile = join(skillPath, "SKILL.md");
  return await Bun.file(skillFile).exists();
}

export async function cacheSkill(
  skillId: string,
  files: Map<string, string>,
  cacheRoot?: string
): Promise<void> {
  const skillPath = getSkillCachePath(skillId);
  
  for (const [relativePath, content] of files) {
    const filePath = join(skillPath, relativePath);
    await Bun.write(filePath, content);
  }
}

export async function getCachedSkillFiles(
  skillId: string,
  cacheRoot?: string
): Promise<Map<string, string> | null> {
  const skillPath = getSkillCachePath(skillId);
  
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
```

**Step 4: Run test to verify it passes**

Run: `cd cli && bun test src/core/cache.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add cli/src/core/cache.ts cli/src/core/cache.test.ts
git commit -m "feat(cli): add cache skill operations"
```

---

## Task 4: Refactor skill-fetcher to Use Cache

**Files:**
- Modify: `cli/src/core/skill-fetcher.ts`
- Add comment for future multi-environment support

**Step 1: Update getSkillInstallPath comment**

At line 6 in `cli/src/core/skill-fetcher.ts`, update the constant:

```typescript
// TODO: Multi-environment support - make this configurable for different agents
// (e.g., .opencode/skills/, .aider/skills/)
// See docs/plans/2026-02-26-global-cache-symlinks-design.md
const DEFAULT_SKILLS_DIR = ".claude/skills";
```

**Step 2: Update installSkillFiles to use cache + symlinks**

```typescript
import { join } from "node:path";
import type { InstalledSkill, SkillSource } from "../types/skill";
import { fetchSkillFiles, checkSkillExists } from "./github";
import { fetchSkillFilesFromRegistry } from "./registry-fetcher";
import { isSkillCached, cacheSkill, getCachedSkillFiles } from "./cache";
import { createSymlinksForSkill, removeSymlinks } from "./symlink";

// TODO: Multi-environment support - make this configurable for different agents
// (e.g., .opencode/skills/, .aider/skills/)
// See docs/plans/2026-02-26-global-cache-symlinks-design.md
const DEFAULT_SKILLS_DIR = ".claude/skills";

export function getSkillInstallPath(skillId: string, cwd: string = process.cwd()): string {
  return join(cwd, DEFAULT_SKILLS_DIR, skillId);
}

export async function installSkillFiles(
  source: SkillSource,
  skillId: string,
  cwd: string = process.cwd(),
  options: { refresh?: boolean } = {}
): Promise<{ success: boolean; filesWritten: number; error?: string; source: "registry" | "github" | "cache" }> {
  const skillDir = getSkillInstallPath(skillId, cwd);
  const { refresh = false } = options;
  
  // Check if skill is cached
  const cached = await isSkillCached(skillId);
  
  if (!refresh && cached) {
    // Use cached skill
    const cachedFiles = await getCachedSkillFiles(skillId);
    if (cachedFiles) {
      await removeSymlinks(skillDir);
      const filesWritten = await createSymlinksForSkill(
        join(process.env.HOME || "", ".skani", "registry", "skill", skillId),
        skillDir
      );
      return { success: true, filesWritten, source: "cache" };
    }
  }
  
  // Fetch from remote
  let files: Map<string, string> | null = null;
  let usedSource: "registry" | "github" = "github";
  
  if (source.mirrored !== false) {
    files = await fetchSkillFilesFromRegistry(skillId);
    if (files) {
      usedSource = "registry";
    }
  }
  
  if (!files) {
    const exists = await checkSkillExists(source);
    if (!exists) {
      return { success: false, filesWritten: 0, error: "Skill not found at specified path", source: "github" };
    }
    
    files = await fetchSkillFiles(source);
    usedSource = "github";
  }
  
  // Store in cache
  await cacheSkill(skillId, files);
  
  // Create symlinks in project
  await removeSymlinks(skillDir);
  const filesWritten = await createSymlinksForSkill(
    join(process.env.HOME || "", ".skani", "registry", "skill", skillId),
    skillDir
  );
  
  return { success: true, filesWritten, source: usedSource };
}

// ... rest of file unchanged
```

**Step 3: Run existing tests**

Run: `cd cli && bun test`
Expected: All tests pass

**Step 4: Commit**

```bash
git add cli/src/core/skill-fetcher.ts
git commit -m "feat(cli): refactor installSkillFiles to use cache + symlinks"
```

---

## Task 5: Update Install Command for --refresh Flag

**Files:**
- Modify: `cli/src/commands/install.ts`

**Step 1: Add --refresh flag parsing**

Update `cli/src/commands/install.ts`:

```typescript
export const installCommand: Command = {
  name: "install",
  description: "Install a skill from GitHub",
  instructions: "Usage: skani install https://github.com/owner/repo/tree/branch/path/to/skill [--refresh]",
  run: async (args: string[]) => {
    const refreshFlag = args.includes("--refresh");
    const skillRef = args.find(a => !a.startsWith("--"));
    
    if (!skillRef) {
      log.single.err("INSTALL", "No skill specified");
      log.single.info("USAGE", "skani install https://github.com/owner/repo/tree/branch/path/to/skill [--refresh]");
      process.exit(1);
    }
    
    // ... rest unchanged until installSkillFiles call
    
    const result = await installSkillFiles(source, skillId, process.cwd(), { refresh: refreshFlag });
    
    // ... rest unchanged
  },
};
```

**Step 2: Run existing tests**

Run: `cd cli && bun test`
Expected: All tests pass

**Step 3: Commit**

```bash
git add cli/src/commands/install.ts
git commit -m "feat(cli): add --refresh flag to install command"
```

---

## Task 6: Update Update Command for Cache

**Files:**
- Modify: `cli/src/commands/update.ts`

**Step 1: Update update command to use cache**

The update command should force refresh from remote:

```typescript
// In the update logic, pass { refresh: true } to installSkillFiles
const result = await installSkillFiles(source, skillId, process.cwd(), { refresh: true });
```

**Step 2: Run existing tests**

Run: `cd cli && bun test`
Expected: All tests pass

**Step 3: Commit**

```bash
git add cli/src/commands/update.ts
git commit -m "feat(cli): update command now forces cache refresh"
```

---

## Task 7: Update Registry Install for Cache

**Files:**
- Modify: `cli/src/commands/registry/install.ts`

**Step 1: Add --refresh flag to registry install**

```typescript
export const registryInstallCommand: Command = {
  name: "registry",
  subcommand: "install",
  description: "Install a kit from the remote registry",
  instructions: "Usage: skani registry install <name> [--replace] [--refresh]",
  run: async (args: string[]) => {
    const kitName = args.find(a => !a.startsWith("--"));
    const replaceFlag = args.includes("--replace");
    const refreshFlag = args.includes("--refresh");
    
    // ... existing logic ...
    
    for (const skill of kitData.skills) {
      log.single.info("INSTALL", `Installing ${skill.id}...`);
      
      const result = await installSkillFiles(skill.source, skill.id, process.cwd(), { refresh: refreshFlag });
      
      // ... rest unchanged
    }
    
    // Update output to show cache hits
    log.multi.info([
      { t: "REGISTRY COMPLETE", m: `Installed ${successCount} skill(s)` },
      ...(cacheCount > 0 ? [{ t: "CACHE", m: `${cacheCount} from cache` }] : []),
      ...(registryCount > 0 ? [{ t: "MIRRORED", m: `${registryCount} from registry` }] : []),
      ...(githubCount > 0 ? [{ t: "GITHUB", m: `${githubCount} from GitHub` }] : []),
      ...(failCount > 0 ? [{ t: "FAILED", m: `${failCount} skill(s) failed` }] : []),
    ]);
  },
};
```

**Step 2: Run existing tests**

Run: `cd cli && bun test`
Expected: All tests pass

**Step 3: Commit**

```bash
git add cli/src/commands/registry/install.ts
git commit -m "feat(cli): add --refresh flag to registry install"
```

---

## Task 8: Add Cache Kit Utilities

**Files:**
- Modify: `cli/src/core/cache.ts`
- Modify: `cli/src/core/cache.test.ts`

**Step 1: Write the failing test**

Add to `cli/src/core/cache.test.ts`:

```typescript
describe("cache kit operations", () => {
  test("cacheKitManifest stores kit manifest", async () => {
    const manifest = {
      name: "test-kit",
      version: "1.0.0",
      skills: [{ id: "skill-1" }, { id: "skill-2" }],
    };
    
    await cacheKitManifest("test-kit", manifest, testCacheDir);
    
    const kitPath = join(testCacheDir, "registry", "kit", "test-kit.json");
    expect(existsSync(kitPath)).toBe(true);
  });

  test("getCachedKitManifest returns cached manifest", async () => {
    const manifest = {
      name: "read-kit",
      version: "2.0.0",
      skills: [{ id: "skill-a" }],
    };
    
    await cacheKitManifest("read-kit", manifest, testCacheDir);
    const result = await getCachedKitManifest("read-kit", testCacheDir);
    
    expect(result).not.toBeNull();
    expect(result?.name).toBe("read-kit");
    expect(result?.version).toBe("2.0.0");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd cli && bun test src/core/cache.test.ts`
Expected: FAIL with "cacheKitManifest is not defined"

**Step 3: Add implementation to `cli/src/core/cache.ts`**

```typescript
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
  const kitPath = getKitCachePath(kitName);
  await Bun.write(kitPath, JSON.stringify(manifest, null, 2));
}

export async function getCachedKitManifest(
  kitName: string,
  cacheRoot?: string
): Promise<CachedKitManifest | null> {
  const kitPath = getKitCachePath(kitName);
  const exists = await Bun.file(kitPath).exists();
  
  if (!exists) {
    return null;
  }
  
  const content = await Bun.file(kitPath).text();
  return JSON.parse(content) as CachedKitManifest;
}
```

**Step 4: Run test to verify it passes**

Run: `cd cli && bun test src/core/cache.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add cli/src/core/cache.ts cli/src/core/cache.test.ts
git commit -m "feat(cli): add cache kit manifest utilities"
```

---

## Task 9: Add Cache Clean Command

**Files:**
- Create: `cli/src/commands/cache/clean.ts`
- Create: `cli/src/commands/cache/index.ts`

**Step 1: Create clean command**

`cli/src/commands/cache/clean.ts`:

```typescript
import type { Command } from "../../core/cli";
import { getCacheRoot } from "../../core/cache";
import log from "../../core/log";

export const cacheCleanCommand: Command = {
  name: "cache",
  subcommand: "clean",
  description: "Clear the global skill cache",
  instructions: "Usage: skani cache clean",
  run: async () => {
    const cacheRoot = getCacheRoot();
    
    log.single.info("CACHE", `Clearing ${cacheRoot}...`);
    
    const { exitCode } = Bun.spawn(["rm", "-rf", cacheRoot]);
    
    if (exitCode === 0) {
      log.single.success("CLEAN", "Cache cleared successfully");
    } else {
      log.single.err("CLEAN", "Failed to clear cache");
      process.exit(1);
    }
  },
};
```

**Step 2: Create cache index**

`cli/src/commands/cache/index.ts`:

```typescript
import { cacheCleanCommand } from "./clean";
import { cacheListCommand } from "./list";

export const cacheCommands = [cacheCleanCommand, cacheListCommand];
```

**Step 3: Register in main commands index**

Update `cli/src/commands/index.ts`:

```typescript
import { cacheCommands } from "./cache";

export function registerCommands() {
  // ... existing registrations ...
  
  for (const cmd of cacheCommands) {
    registerCommand(cmd);
  }
}
```

**Step 4: Commit**

```bash
git add cli/src/commands/cache/
git commit -m "feat(cli): add cache clean command"
```

---

## Task 10: Add Cache List Command

**Files:**
- Create: `cli/src/commands/cache/list.ts`

**Step 1: Create list command**

`cli/src/commands/cache/list.ts`:

```typescript
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
```

**Step 2: Commit**

```bash
git add cli/src/commands/cache/
git commit -m "feat(cli): add cache list command"
```

---

## Task 11: Update Remove Command (Don't Delete Cache)

**Files:**
- Modify: `cli/src/commands/remove.ts`

**Step 1: Update remove to only remove symlinks**

Ensure `skani remove` only removes the project symlinks, not the cache:

```typescript
// The uninstallSkillFiles function already handles this
// Just verify it only removes the project directory, not the cache
```

**Step 2: Add comment for clarity**

```typescript
// Note: This removes project symlinks only, not the global cache
// Use `skani cache clean` to clear the cache entirely
```

**Step 3: Commit**

```bash
git add cli/src/commands/remove.ts
git commit -m "docs(cli): clarify remove only deletes project symlinks"
```

---

## Task 12: Integration Test

**Files:**
- Create: `cli/src/integration/cache-symlink.test.ts`

**Step 1: Write integration test**

```typescript
import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { join } from "node:path";
import { mkdirSync, rmSync, existsSync, lstatSync } from "node:fs";
import { cacheSkill, getSkillCachePath, getCacheRoot } from "../core/cache";
import { createSymlinksForSkill, removeSymlinks } from "../core/symlink";
import { installSkillFiles } from "../core/skill-fetcher";

describe("cache + symlink integration", () => {
  const testDir = join(process.cwd(), ".test-integration");
  const projectDir = join(testDir, "project");
  
  beforeEach(() => {
    mkdirSync(join(projectDir, ".claude", "skills"), { recursive: true });
  });
  
  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });
  
  test("full install flow caches and symlinks", async () => {
    const skillId = "test-integration-skill";
    const files = new Map([
      ["SKILL.md", "# Test Integration Skill\n\nThis is a test."],
      ["guide.md", "# Guide\n\nFollow these steps."],
    ]);
    
    // First install: should cache and symlink
    await cacheSkill(skillId, files);
    const cachePath = getSkillCachePath(skillId);
    
    const projectSkillPath = join(projectDir, ".claude", "skills", skillId);
    const count = await createSymlinksForSkill(cachePath, projectSkillPath);
    
    expect(count).toBe(2);
    expect(existsSync(join(projectSkillPath, "SKILL.md"))).toBe(true);
    expect(lstatSync(join(projectSkillPath, "SKILL.md")).isSymbolicLink()).toBe(true);
    
    // Verify content is accessible through symlink
    const content = await Bun.file(join(projectSkillPath, "SKILL.md")).text();
    expect(content).toContain("Test Integration Skill");
  });
});
```

**Step 2: Run test**

Run: `cd cli && bun test src/integration/cache-symlink.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add cli/src/integration/cache-symlink.test.ts
git commit -m "test(cli): add cache + symlink integration test"
```

---

## Task 13: Update AGENTS.md

**Files:**
- Modify: `AGENTS.md`

**Step 1: Add cache documentation**

Add to AGENTS.md under CLI section:

```markdown
### Global Cache

Skills are cached at `~/.skani/registry/skill/<id>/`. When installing:
- If cached, symlinks are created in project (no network call)
- Use `--refresh` to force re-download from remote

**Cache commands:**
- `skani cache list` - Show cached skills with sizes
- `skani cache clean` - Clear entire cache

**Future:** Windows support will fall back to file copying instead of symlinks.
```

**Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add global cache documentation to AGENTS.md"
```

---

## Task 14: Final Verification

**Step 1: Run all tests**

Run: `cd cli && bun test`
Expected: All tests pass

**Step 2: Run lint**

Run: `cd cli && bun lint`
Expected: No errors

**Step 3: Manual smoke test**

```bash
# Clean cache
cd cli && bun run dev cache clean

# Install a skill
bun run dev install https://github.com/owner/repo/tree/main/path/to/skill

# Verify cache exists
ls ~/.skani/registry/skill/

# Verify symlinks
ls -la .claude/skills/<skill-id>/

# Install same skill again (should use cache)
bun run dev install https://github.com/owner/repo/tree/main/path/to/skill

# Force refresh
bun run dev install https://github.com/owner/repo/tree/main/path/to/skill --refresh

# List cache
bun run dev cache list
```

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat(cli): complete global cache with symlinks implementation"
```
