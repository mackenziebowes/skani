# Skill Kits - Design Document

**Date:** 2026-02-15
**Topic:** Skill Kits - Shareable skani.json bundles for rapid skill installation

## Overview

Skill kits are shareable `.skani.json` files that allow developers to rapidly install a curated set of skills. Users can share kits around to bootstrap their skani environment with specific skill collections.

## Scope

**Phase 1 (Current Session):**
- Local-only kit files (*.skani.json)
- Three kit commands: install, list, restore
- Configurable install behavior (--replace flag)
- Simple backup system (single previous.skani.json)
- Continue-on-error for skill installation failures

**Future Enhancements:**
- Registry system for publishing and discovering kits by name
- Remote kit installation from GitHub URLs
- Rich kit metadata (name, description, version, author)
- Full backup history with multiple restore points

## Architecture

### File Structure

```
cli/src/
├── commands/
│   └── kit/                    # New folder for kit commands
│       ├── index.ts           # Registers kit commands
│       ├── install.ts         # skani kit install <name> [--replace]
│       ├── list.ts            # skani kit list
│       └── restore.ts         # skani kit restore
├── core/
│   ├── skani-file.ts          # Extend with kit file functions
│   └── kit-utils.ts           # New: kit-specific utilities
└── types/
    └── skill.ts               # No changes needed
```

### New File: core/kit-utils.ts

Contains kit-specific utility functions:
- `listKits()` - Find all `*.skani.json` files in current directory
- `backupSkaniFile()` - Create `previous.skani.json` backup
- `restoreFromBackup()` - Restore from `previous.skani.json`
- `clearSkillsDir()` - Remove all skills from `.claude/skills/`

### New Directory: commands/kit/

Contains kit command implementations:
- `index.ts` - Registers kit subcommands with main CLI
- `install.ts` - Installs a kit with configurable behavior
- `list.ts` - Lists available kits in current directory
- `restore.ts` - Restores from most recent backup

## Command Specifications

### skani kit list

**Purpose:** List all available kits in current directory

**Behavior:**
- Finds all `*.skani.json` files in current directory
- Displays each kit with:
  - Kit filename
  - Number of skills in kit
  - File size
- Example output:
  ```
  [KIT LIST] Found 2 kit(s)
  • superpowers.skani.json (14 skills, 4.2KB)
  • web-dev.skani.json (8 skills, 2.1KB)
  ```

**Errors:** None (empty list is valid)

---

### skani kit install <name> [--replace]

**Purpose:** Install skills from a kit file

**Behavior:**
1. Validates kit file exists (`<name>.skani.json`)
2. Validates kit structure (has `skills` array)
3. If `--replace` flag:
   - Backs up current `skani.json` to `previous.skani.json`
   - Clears `.claude/skills/` directory (deletes all skills)
4. If no `--replace` flag:
   - Merges kit skills with existing `skani.json`
   - Skips skills that already exist (same ID)
5. Installs each skill using existing `installSkillFiles()` utility
6. On skill installation error:
   - Logs failure with skill name and error message
   - Continues to next skill
7. Creates new `skani.json` from kit file (or merged version)
8. Shows success/failure summary

**Examples:**
```bash
# Replace mode - clean slate
skani kit install superpowers --replace

# Merge mode - preserve existing skills
skani kit install web-dev
```

**Errors:**
- "Kit file not found: {name}.skani.json"
- "Invalid kit structure: missing skills array"
- "Failed to clear skills directory, aborting" (replace mode only)

**Output:**
```
[KIT INSTALL] Installing from superpowers.skani.json...
[BACKUP] Backed up skani.json to previous.skani.json
[CLEAR] Cleared skills directory
[INSTALL] Installing brainstorming (main)...
[INSTALL] Installing systematic-debugging (main)...
[INSTALL] Installing test-driven-development (main)...
[KIT COMPLETE] Installed 14 skill(s), 0 failed
```

---

### skani kit restore

**Purpose:** Restore skani.json from most recent backup

**Behavior:**
1. Checks if `previous.skani.json` exists
2. Restores it to `skani.json`
3. Clears `.claude/skills/` directory
4. Reinstalls all skills from the restored file
5. Shows confirmation

**Errors:**
- "No backup found - nothing to restore"

**Output:**
```
[KIT RESTORE] Restoring from previous.skani.json...
[CLEAR] Cleared skills directory
[INSTALL] Installing brainstorming (main)...
[KIT RESTORE] Restored 14 skill(s)
```

## Data Flow

### Install Flow (Replace Mode)

```
1. Parse args (kit name, --replace flag)
2. Read kit file → {kit name}.skani.json
3. Validate kit structure (skills array exists)
4. If --replace:
   - backupSkaniFile() → previous.skani.json
   - clearSkillsDir() → delete all in .claude/skills/
5. For each skill in kit:
   - installSkillFiles(skill.source, skill.id)
   - If success: increment success counter
   - If error: log error, increment fail counter, continue
6. Write new skani.json from kit file
7. Show summary (X installed, Y failed)
```

### Install Flow (Merge Mode)

```
1. Parse args (kit name, no --replace flag)
2. Read kit file → {kit name}.skani.json
3. Read existing skani.json
4. Merge: add only skills not in existing (compare by ID)
5. For each new skill:
   - installSkillFiles(skill.source, skill.id)
   - If success: increment success counter
   - If error: log error, increment fail counter, continue
6. Update skani.json with merged skills
7. Show summary (X installed, Y failed)
```

### Restore Flow

```
1. Check if previous.skani.json exists
2. Read previous.skani.json
3. clearSkillsDir()
4. For each skill in backup:
   - installSkillFiles(skill.source, skill.id)
5. Write skani.json from backup
6. Show confirmation
```

## Error Handling

| Scenario | Error Message | Behavior |
|----------|--------------|----------|
| Kit file not found | "Kit file not found: {name}.skani.json" | Exit with error |
| Invalid kit structure | "Invalid kit structure: missing skills array" | Exit with error |
| No backup to restore | "No backup found - nothing to restore" | Exit with error |
| Skill install fails | "[FAILED] {skill.name}: {error}" | Continue to next skill |
| Clear skills dir fails | "Failed to clear skills directory, aborting" | Exit with error, no changes |
| Backup file write fails | "Failed to create backup file" | Exit with error, no changes |

## Testing Strategy

### Unit Tests

- `kit-utils.ts` functions:
  - `listKits()` - Returns array of kit file names
  - `backupSkaniFile()` - Creates backup with correct content
  - `restoreFromBackup()` - Restores from backup correctly
  - `clearSkillsDir()` - Removes all skill directories

- Kit file validation:
  - Valid kit structure passes
  - Missing skills array fails
  - Invalid JSON fails

- Merge logic:
  - No duplicates when merging (same ID skills skipped)
  - New skills added to existing
  - Existing skills preserved

### Integration Tests

- Install kit with `--replace`:
  - Verifies `previous.skani.json` created
  - Verifies skills directory cleared
  - Verifies all kit skills installed
  - Verifies new `skani.json` created

- Install kit without `--replace`:
  - Verifies existing skills preserved
  - Verifies new skills added
  - Verifies no duplicates in skani.json

- Restore from backup:
  - Verifies previous state restored
  - Verifies skills reinstalled correctly
  - Verifies skani.json content matches backup

- Install with some skills failing:
  - Verifies continue-on-error behavior
  - Verifies summary shows correct counts
  - Verifies successful skills installed

### Test Fixtures

- `test/fixtures/simple-kit.skani.json` (2 skills)
- `test/fixtures/complex-kit.skani.json` (14 skills like superpowers)
- `test/fixtures/invalid-kit.skani.json` (missing skills array)

## Kit File Format

Kits use the same format as `skani.json`, just saved with `.skani.json` extension:

```json
{
  "version": "1.0.0",
  "environment": {
    "name": "skani-project",
    "created": "2026-02-15T18:26:44.000Z",
    "updated": "2026-02-15T18:26:44.000Z"
  },
  "skills": [
    {
      "id": "obra-superpowers-brainstorming",
      "name": "superpowers",
      "version": "main",
      "source": {
        "url": "https://github.com/obra/superpowers/tree/main/skills/brainstorming",
        "type": "github",
        "owner": "obra",
        "repo": "superpowers",
        "ref": "main",
        "path": "skills/brainstorming"
      },
      "installedAt": "2026-02-15T18:26:44.364Z"
    }
  ]
}
```

## Implementation Notes

- Reuse existing `installSkillFiles()` from `skill-fetcher.ts`
- Reuse existing `writeSkaniFile()` from `skani-file.ts`
- Follow existing command pattern in `cli/src/commands/`
- Use existing log utilities from `core/log.ts`
- Follow bun file API patterns (Bun.file, Bun.write)

## Success Criteria

- Users can create kits by copying `skani.json` to `<name>.skani.json`
- Users can list all kits in current directory
- Users can install kits with `--replace` for clean slate
- Users can install kits without `--replace` to merge skills
- Users can restore from backup with single command
- Installation continues on error and shows summary
- All commands have proper error handling and user feedback
