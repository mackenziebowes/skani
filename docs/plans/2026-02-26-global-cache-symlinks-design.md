# Global Cache with Symlinks Design

**Date:** 2026-02-26
**Status:** Approved

## Overview

Add a global cache layer to the CLI that stores skills once at `~/.skani/registry/` and symlinks them into projects. This reduces remote API calls and disk usage when working across multiple projects.

## Directory Structure

```
~/.skani/
├── registry/
│   ├── skill/
│   │   └── <skill-id>/
│   │       ├── SKILL.md
│   │       └── ...other files
│   └── kit/
│       └── <kit-name>.json      # manifest only (list of skill IDs + metadata)
```

**Project structure (unchanged):**
```
project/
├── skani.json
└── .claude/
    └── skills/
        └── <skill-id>/
            ├── SKILL.md -> ~/.skani/registry/skill/<skill-id>/SKILL.md
            └── other.md -> ~/.skani/registry/skill/<skill-id>/other.md
```

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Cache location | Global `~/.skani/` | Single shared cache across all projects |
| Versioning | Latest only | Simpler, no need for multi-version support currently |
| Symlink type | File-by-file | Allows projects to have different skill configurations |
| Update behavior | Clean rebuild | Removes orphaned symlinks when files are removed from skill |
| Kit storage | Manifest only | Skills stored individually, no duplication |
| Offline mode | Cache-first | Use `--refresh` to force re-download |

## Install Flow

**`skani install <skill-url>`**

1. Parse skill URL → extract owner/repo/ref/path/skillId
2. Check if skill exists in `~/.skani/registry/skill/<skillId>/`
   - **If cached**: Skip network call (unless `--refresh`)
   - **If not cached**: Fetch from registry API or GitHub, write to cache
3. Ensure `.claude/skills/<skillId>/` directory exists
4. For each file in cached skill:
   - Create symlink: `.claude/skills/<skillId>/<file>` → `~/.skani/registry/skill/<skillId>/<file>`
5. Update `skani.json` with installed skill metadata

**`skani install --refresh <skill-url>`**
- Force re-download from remote, overwrite cache, rebuild symlinks

## Update Flow

**`skani update <skill-id>`**

1. Read skill metadata from `skani.json`
2. Fetch latest from remote (registry API or GitHub)
3. Overwrite `~/.skani/registry/skill/<skillId>/` with new files
4. Clean rebuild symlinks:
   - Remove all existing symlinks in `.claude/skills/<skillId>/`
   - Create new symlinks for each file in updated cache
5. Update version in `skani.json`

**`skani update` (no args)**
- Update all installed skills

## Registry Install Flow (Kits)

**`skani registry install <kit-name>`**

1. Fetch kit manifest from remote registry
2. Store manifest at `~/.skani/registry/kit/<kit-name>.json`
3. For each skill in kit:
   - Check cache at `~/.skani/registry/skill/<skillId>/`
   - If not cached: fetch and store in cache
   - Create file-level symlinks in `.claude/skills/<skillId>/`
4. Update `skani.json` with all kit skills

**`skani registry install <kit-name> --refresh`**
- Force re-download all kit skills from remote

## Remove Flow & Cache Management

**`skani remove <skill-id>`**

1. Remove `.claude/skills/<skillId>/` directory (symlinks)
2. Remove skill entry from `skani.json`
3. **Do NOT delete from cache** - other projects may still use it

**New command: `skani cache clean`**
- Remove `~/.skani/registry/` entirely (clear all cached skills)
- Useful for freeing disk space or forcing fresh downloads

**New command: `skani cache list`**
- Show all cached skills with their sizes

## Type Changes

- Add `cachePath` utility to resolve `~/.skani/registry/`
- Add `symlinked` boolean to `InstalledSkill` type (optional, for tracking)

## Future Considerations

### Windows Fallback

When `process.platform === 'win32'`, fall back to file copying instead of symlinks. Windows requires admin privileges for symlinks, and many users won't have that.

Implementation: Wrap symlink creation in try/catch, fall back to `Bun.write()` with file contents.

### Multi-Environment Support

The `DEFAULT_SKILLS_DIR` is currently hardcoded to `.claude/skills` at `cli/src/core/skill-fetcher.ts:6`.

Future support for different agent environments:
- `.opencode/skills/`
- `.aider/skills/`
- etc.

Could be configured via:
- `skani.json` environment field (e.g., `environment.agent: "opencode"`)
- CLI flag (e.g., `--agent opencode`)
