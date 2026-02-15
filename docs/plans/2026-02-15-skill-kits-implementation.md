# Skill Kits Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add skill kits feature - shareable `.skani.json` files for rapid bulk skill installation with backup/restore capabilities

**Architecture:** Create new `kit/` command namespace with install, list, and restore subcommands. Add `kit-utils.ts` for kit-specific utilities (list, backup, restore, clear). Reuse existing `installSkillFiles()` and `writeSkaniFile()` utilities. Follow existing command patterns from `cli/src/commands/`.

**Tech Stack:** Bun (runtime), TypeScript, existing CLI infrastructure

---

## Task 1: Create kit utilities module

**Files:**
- Create: `cli/src/core/kit-utils.ts`

**Step 1: Write utility functions**

```typescript
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
```

**Step 2: Commit**

```bash
git add cli/src/core/kit-utils.ts
git commit -m "feat: add kit utilities module"
```

---

## Task 2: Create kit command namespace

**Files:**
- Create: `cli/src/commands/kit/index.ts`

**Step 1: Write kit command registry**

```typescript
import { registerCommand } from "../../core/cli";
import { kitListCommand } from "./list";
import { kitInstallCommand } from "./install";
import { kitRestoreCommand } from "./restore";

export function registerKitCommands() {
  registerCommand(kitListCommand);
  registerCommand(kitInstallCommand);
  registerCommand(kitRestoreCommand);
}
```

**Step 2: Update main command registry**

**Files:**
- Modify: `cli/src/commands/index.ts`

```typescript
import { registerCommand } from "../core/cli";
import { initCommand } from "./init";
import { installCommand } from "./install";
import { listCommand } from "./list";
import { installAllCommand } from "./install-all";
import { removeCommand } from "./remove";
import { searchCommand } from "./search";
import { infoCommand } from "./info";
import { updateCommand } from "./update";
import { registerKitCommands } from "./kit";  // Add this

export function registerCommands() {
  registerCommand(initCommand);
  registerCommand(installCommand);
  registerCommand(listCommand);
  registerCommand(installAllCommand);
  registerCommand(removeCommand);
  registerCommand(searchCommand);
  registerCommand(infoCommand);
  registerCommand(updateCommand);
  registerKitCommands();  // Add this
}
```

**Step 3: Commit**

```bash
git add cli/src/commands/kit/index.ts cli/src/commands/index.ts
git commit -m "feat: register kit command namespace"
```

---

## Task 3: Implement kit list command

**Files:**
- Create: `cli/src/commands/kit/list.ts`

**Step 1: Write kit list command**

```typescript
import type { Command } from "../../core/cli";
import { listKits } from "../../core/kit-utils";
import { stat } from "node:fs/promises";
import log from "../../core/log";

export const kitListCommand: Command = {
  name: "kit",
  subcommand: "list",
  description: "List all available kits in current directory",
  instructions: "Usage: skani kit list",
  run: async () => {
    const kits = await listKits();
    
    if (kits.length === 0) {
      log.single.info("KIT LIST", "No kits found in current directory");
      return;
    }
    
    log.single.info("KIT LIST", `Found ${kits.length} kit(s)`);
    
    for (const kit of kits) {
      const kitPath = kit;
      const stats = await stat(kitPath);
      const content = await Bun.file(kitPath).text();
      const kitData = JSON.parse(content);
      const skillCount = kitData.skills?.length || 0;
      const sizeKB = (stats.size / 1024).toFixed(1);
      
      log.single.info("", `• ${kit} (${skillCount} skills, ${sizeKB}KB)`);
    }
  },
};
```

**Step 2: Test manually**

```bash
cd cli && bun run dev kit list
```

Expected: Shows list of kits (including superpowers.skani.json)

**Step 3: Commit**

```bash
git add cli/src/commands/kit/list.ts
git commit -m "feat: add kit list command"
```

---

## Task 4: Implement kit install command (structure)

**Files:**
- Create: `cli/src/commands/kit/install.ts`

**Step 1: Write kit install command scaffold**

```typescript
import type { Command } from "../../core/cli";
import { readSkaniFile, writeSkaniFile } from "../../core/skani-file";
import { installSkillFiles } from "../../core/skill-fetcher";
import { backupSkaniFile, clearSkillsDir } from "../../core/kit-utils";
import log from "../../core/log";

export const kitInstallCommand: Command = {
  name: "kit",
  subcommand: "install",
  description: "Install skills from a kit file",
  instructions: "Usage: skani kit install <name> [--replace]",
  run: async (args: string[]) => {
    const kitName = args[0];
    const replaceFlag = args.includes('--replace');
    
    if (!kitName) {
      log.single.err("KIT INSTALL", "No kit specified");
      log.single.info("USAGE", "skani kit install <name> [--replace]");
      process.exit(1);
    }
    
    const kitFile = `${kitName}.skani.json`;
    
    // Validate kit file exists
    const exists = await Bun.file(kitFile).exists();
    if (!exists) {
      log.single.err("KIT INSTALL", `Kit file not found: ${kitFile}`);
      process.exit(1);
    }
    
    // Read kit file
    const content = await Bun.file(kitFile).text();
    const kitData = JSON.parse(content);
    
    // Validate kit structure
    if (!kitData.skills || !Array.isArray(kitData.skills)) {
      log.single.err("KIT INSTALL", "Invalid kit structure: missing skills array");
      process.exit(1);
    }
    
    log.single.info("KIT INSTALL", `Installing from ${kitFile}...`);
    
    // Replace mode: backup and clear
    if (replaceFlag) {
      log.single.info("BACKUP", "Backing up skani.json to previous.skani.json");
      await backupSkaniFile();
      
      log.single.info("CLEAR", "Clearing skills directory");
      await clearSkillsDir();
    } else {
      // Merge mode: read existing
      const existing = await readSkaniFile();
      if (existing) {
        // Filter out already installed skills
        const existingIds = new Set(existing.skills.map(s => s.id));
        kitData.skills = kitData.skills.filter((s: any) => !existingIds.has(s.id));
      }
    }
    
    // Install skills
    let successCount = 0;
    let failCount = 0;
    
    for (const skill of kitData.skills) {
      log.single.info("INSTALL", `Installing ${skill.name} (${skill.version})...`);
      
      const result = await installSkillFiles(skill.source, skill.id);
      
      if (result.success) {
        successCount++;
      } else {
        log.single.err("FAILED", `${skill.name}: ${result.error}`);
        failCount++;
      }
    }
    
    // Write new skani.json
    if (replaceFlag) {
      await writeSkaniFile({
        version: kitData.version,
        environment: kitData.environment,
        skills: kitData.skills,
      });
    } else {
      // Merge into existing
      const existing = await readSkaniFile();
      if (existing) {
        for (const skill of kitData.skills) {
          existing.skills.push(skill);
        }
        await writeSkaniFile(existing);
      }
    }
    
    log.multi.info([
      { t: "KIT COMPLETE", m: `Installed ${successCount} skill(s)` },
      ...(failCount > 0 ? [{ t: "FAILED", m: `${failCount} skill(s) failed` }] : []),
    ]);
  },
};
```

**Step 2: Commit**

```bash
git add cli/src/commands/kit/install.ts
git commit -m "feat: add kit install command"
```

---

## Task 5: Implement kit restore command

**Files:**
- Create: `cli/src/commands/kit/restore.ts`

**Step 1: Write kit restore command**

```typescript
import type { Command } from "../../core/cli";
import { readSkaniFile, writeSkaniFile } from "../../core/skani-file";
import { restoreFromBackup, clearSkillsDir } from "../../core/kit-utils";
import { installSkillFiles } from "../../core/skill-fetcher";
import log from "../../core/log";

export const kitRestoreCommand: Command = {
  name: "kit",
  subcommand: "restore",
  description: "Restore skani.json from most recent backup",
  instructions: "Usage: skani kit restore",
  run: async () => {
    const backupFile = "previous.skani.json";
    
    // Check if backup exists
    const exists = await Bun.file(backupFile).exists();
    if (!exists) {
      log.single.err("KIT RESTORE", "No backup found - nothing to restore");
      process.exit(1);
    }
    
    log.single.info("KIT RESTORE", `Restoring from ${backupFile}...`);
    
    // Restore backup
    await restoreFromBackup();
    
    // Read restored file
    const skaniFile = await readSkaniFile();
    if (!skaniFile) {
      log.single.err("KIT RESTORE", "Failed to read restored file");
      process.exit(1);
    }
    
    // Clear skills dir
    log.single.info("CLEAR", "Clearing skills directory");
    await clearSkillsDir();
    
    // Reinstall skills
    for (const skill of skaniFile.skills) {
      log.single.info("INSTALL", `Installing ${skill.name} (${skill.version})...`);
      await installSkillFiles(skill.source, skill.id);
    }
    
    log.multi.info([
      { t: "KIT RESTORE", m: `Restored ${skaniFile.skills.length} skill(s)` },
    ]);
  },
};
```

**Step 2: Commit**

```bash
git add cli/src/commands/kit/restore.ts
git commit -m "feat: add kit restore command"
```

---

## Task 6: Test kit list command

**Files:**
- Test: Manual testing

**Step 1: Run kit list**

```bash
cd /Users/mpbowes/dev/skani
skani kit list
```

Expected output:
```
[KIT LIST] Found 1 kit(s)
• superpowers.skani.json (14 skills, X.XKB)
```

**Step 2: Verify with no kits**

Create a temp directory:
```bash
cd /tmp
mkdir test-skani
cd test-skani
skani kit list
```

Expected output:
```
[KIT LIST] No kits found in current directory
```

---

## Task 7: Test kit install command (replace mode)

**Files:**
- Test: Manual testing

**Step 1: Install kit with replace**

```bash
cd /Users/mpbowes/dev/skani
skani kit install superpowers --replace
```

Expected output:
```
[KIT INSTALL] Installing from superpowers.skani.json...
[BACKUP] Backing up skani.json to previous.skani.json
[CLEAR] Clearing skills directory
[INSTALL] Installing brainstorming (main)...
...
[KIT COMPLETE] Installed 14 skill(s)
```

**Step 2: Verify backup created**

```bash
ls -la previous.skani.json
```

Expected: File exists

**Step 3: Verify skills installed**

```bash
ls .claude/skills/
```

Expected: 14 skill directories

---

## Task 8: Test kit install command (merge mode)

**Files:**
- Test: Manual testing

**Step 1: Create minimal kit file**

Create `test-kit.skani.json`:
```json
{
  "version": "1.0.0",
  "environment": {
    "name": "test",
    "created": "2026-02-15T00:00:00.000Z",
    "updated": "2026-02-15T00:00:00.000Z"
  },
  "skills": [
    {
      "id": "test-skill",
      "name": "test",
      "version": "main",
      "source": {
        "url": "https://github.com/obra/superpowers/tree/main/skills/brainstorming",
        "type": "github",
        "owner": "obra",
        "repo": "superpowers",
        "ref": "main",
        "path": "skills/brainstorming"
      },
      "installedAt": "2026-02-15T00:00:00.000Z"
    }
  ]
}
```

**Step 2: Install without replace**

```bash
skani kit install test-kit
```

Expected output:
```
[KIT INSTALL] Installing from test-kit.skani.json...
[KIT COMPLETE] Installed 0 skill(s)
```

Expected behavior: Skips duplicate skills

---

## Task 9: Test kit restore command

**Files:**
- Test: Manual testing

**Step 1: Restore from backup**

```bash
skani kit restore
```

Expected output:
```
[KIT RESTORE] Restoring from previous.skani.json...
[CLEAR] Clearing skills directory
[INSTALL] Installing brainstorming (main)...
[KIT RESTORE] Restored 14 skill(s)
```

**Step 2: Verify skani.json restored**

```bash
cat skani.json
```

Expected: Contains skills from before the kit install

---

## Task 10: Test error handling

**Files:**
- Test: Manual testing

**Step 1: Test missing kit file**

```bash
skani kit install nonexistent
```

Expected:
```
[KIT INSTALL] Kit file not found: nonexistent.skani.json
```

**Step 2: Test invalid kit file**

Create `invalid.skani.json`:
```json
{
  "version": "1.0.0",
  "environment": {}
}
```

```bash
skani kit install invalid
```

Expected:
```
[KIT INSTALL] Invalid kit structure: missing skills array
```

**Step 3: Test restore without backup**

```bash
rm previous.skani.json
skani kit restore
```

Expected:
```
[KIT RESTORE] No backup found - nothing to restore
```

---

## Task 11: Update help documentation

**Files:**
- Modify: `cli/src/core/cli.ts` (if needed for help text)

**Step 1: Verify help includes kit commands**

```bash
skani --help
```

Expected: Shows kit commands in help output

---

## Task 12: Run end-to-end workflow

**Files:**
- Test: Manual testing

**Step 1: Complete workflow test**

```bash
# 1. List available kits
skani kit list

# 2. Install kit with replace
skani kit install superpowers --replace

# 3. Verify skills
skani list

# 4. Restore from backup
skani kit restore

# 5. Verify restoration
skani list
```

Expected: All commands execute successfully, skills properly managed

**Step 2: Final commit**

```bash
git status
git add -A
git commit -m "feat: complete skill kits implementation"
```

---

## Task 13: Run linting and type checking

**Files:**
- Build: All CLI files

**Step 1: Run linting**

```bash
cd cli
bun run lint
```

Expected: No lint errors

**Step 2: Run type check**

```bash
cd cli
bun run build
```

Expected: Successful build

---

## Task 14: Clean up test files

**Files:**
- Remove: `test-kit.skani.json`, `invalid.skani.json`

**Step 1: Remove test files**

```bash
cd /Users/mpbowes/dev/skani
rm -f test-kit.skani.json invalid.skani.json
```

**Step 2: Commit cleanup**

```bash
git status
git commit -m "chore: remove test files" -n
```

---

## Summary

This implementation plan:
- Creates kit utilities module for core functions
- Adds kit command namespace with 3 subcommands
- Implements install (with --replace flag), list, and restore commands
- Tests all commands manually
- Verifies error handling
- Runs linting and type checking

**Total estimated time:** 1.5-2 hours
**Total commits:** ~12 commits
**Files created:** 4 new files
**Files modified:** 2 existing files
