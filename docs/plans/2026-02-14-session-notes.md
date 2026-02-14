# Session Notes: 2026-02-14 GitHub URL Parsing Rewrite

## Context

Recovered from crash mid-planning. User was redesigning the GitHub parsing system.

## Problems Solved

### Problem A: Inhuman Input Format
Old parser required `owner/repo` format, but humans browse GitHub in browsers with URLs. Forcing mental conversion was unnecessary friction.

### Problem B: ID Collisions
Old ID generation (`owner-repo`) broke for colocated skills. Repos with multiple skills all got the same ID, causing overwrites.

## Design Decisions

| Question | Decision |
|----------|----------|
| ID format | `{owner}-{repo}-{lastPathSegment}` (e.g., `vercel-skills-react`) |
| URL without path | Error - require full path |
| Version override | URL `@version` suffix OR version in URL itself |
| Backward compatibility | Clean break - old formats removed |
| tree vs blob URLs | Both work - blob extracts directory |
| Source storage | Hybrid: `url` field + decomposed fields |

## Implementation Completed

### Files Changed

| File | Change |
|------|--------|
| `cli/src/types/skill.ts` | Added `url` field to `SkillSource` |
| `cli/src/core/github.ts` | Rewrote `parseSkillRef()` for URL parsing, removed `parseSkillId()` |
| `cli/src/commands/install.ts` | Updated to use new parsing, skillId from parsed result |
| `cli/USAGE.md` | Updated examples and skani.json format |

### Commits

```
67593c9 feat(types): add url field to SkillSource
2b884c0 refactor(github): rewrite parseSkillRef for URL parsing
5121327 refactor(install): use URL-based parsing and new skillId
bca522e docs: update for URL-based install format
```

### New Input Format

```bash
skani install https://github.com/owner/repo/tree/main/.claude/skills/foo
skani install https://github.com/owner/repo/tree/v1.2.0/.claude/skills/foo
skani install https://github.com/owner/repo/tree/main/.claude/skills/foo@v1.2.0
skani install https://github.com/owner/repo/blob/main/.claude/skills/foo/SKILL.md
```

### New skani.json Format

```json
{
  "id": "owner-repo-foo",
  "source": {
    "url": "https://github.com/owner/repo/tree/v1.0.0/.claude/skills/foo",
    "type": "github",
    "owner": "owner",
    "repo": "repo",
    "ref": "v1.0.0",
    "path": ".claude/skills/foo"
  }
}
```

## Known Issues / Future Work

### Install Path Mismatch
- `.agents/skills/` → Where current agent's skills live (local development)
- `.claude/skills/` → Where skani installs skills

Currently installs to `.claude/skills/{skillId}/` with full collision-free ID (e.g., `obra-superpowers-brainstorming`).

### Potential `nameOnDisk` Field
Discussed adding a `nameOnDisk` field to allow simple folder names while keeping collision-free IDs:
```json
{
  "id": "obra-superpowers-brainstorming",
  "nameOnDisk": "brainstorming",
  ...
}
```
Deferred for future iteration.

## Global Install

CLI installed globally at `/home/mpb/.local/bin/skani` via `bun link`.
