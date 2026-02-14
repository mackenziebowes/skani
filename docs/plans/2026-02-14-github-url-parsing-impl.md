# GitHub URL Parsing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Rewrite GitHub parsing to accept full URLs and generate collision-free skill IDs.

**Architecture:** Replace `owner/repo` shorthand parsing with URL-based parsing. Extract owner, repo, ref, path from GitHub URLs. Derive skill ID from final path segment.

**Tech Stack:** TypeScript, Bun, existing GitHub API helpers

---

### Task 1: Update SkillSource Type

**Files:**
- Modify: `cli/src/types/skill.ts:1-7`

**Step 1: Add url field to SkillSource interface**

```typescript
export interface SkillSource {
	url: string;       // full GitHub URL (source of truth)
	type: "github";
	owner: string;
	repo: string;
	ref: string;
	path: string;
}
```

**Step 2: Run typecheck**

Run: `cd cli && bun run typecheck` (or `bun tsc --noEmit`)
Expected: No errors (url field unused yet)

**Step 3: Commit**

```bash
git add cli/src/types/skill.ts
git commit -m "feat(types): add url field to SkillSource"
```

---

### Task 2: Rewrite parseSkillRef Function

**Files:**
- Modify: `cli/src/core/github.ts:141-173`

**Step 1: Add new ParsedSkillRef interface at top of file (after imports)**

```typescript
export interface ParsedSkillRef {
	url: string;
	owner: string;
	repo: string;
	ref: string;
	path: string;
	skillId: string;
}
```

**Step 2: Rewrite parseSkillRef function**

Replace lines 141-173 with:

```typescript
export function parseSkillRef(input: string): ParsedSkillRef | null {
	let url: URL;
	
	// Handle @version suffix
	let versionOverride: string | undefined;
	const atIndex = input.lastIndexOf("@");
	if (atIndex > 0 && !input.startsWith("http")) {
		// owner/repo@version format - no longer supported
		return null;
	}
	if (atIndex > 0 && input.startsWith("http")) {
		versionOverride = input.slice(atIndex + 1);
		input = input.slice(0, atIndex);
	}
	
	// Parse as URL
	try {
		url = new URL(input);
	} catch {
		return null;
	}
	
	// Validate GitHub host
	if (url.host !== "github.com" && url.host !== "www.github.com") {
		return null;
	}
	
	// Parse path: /owner/repo[/tree|/blob]/ref/path...
	const pathParts = url.pathname.split("/").filter(Boolean);
	
	if (pathParts.length < 2) {
		return null;
	}
	
	const owner = pathParts[0];
	const repo = pathParts[1];
	
	if (pathParts.length === 2) {
		// Just owner/repo - no path, error
		return null;
	}
	
	const type = pathParts[2]; // "tree" or "blob"
	if (type !== "tree" && type !== "blob") {
		return null;
	}
	
	if (pathParts.length < 5) {
		return null; // Need at least /tree/ref/something
	}
	
	const ref = versionOverride || pathParts[3];
	const skillPath = pathParts.slice(4).join("/");
	
	// For blob URLs, get the directory containing the file
	const finalPath = type === "blob" 
		? skillPath.split("/").slice(0, -1).join("/")
		: skillPath;
	
	if (!finalPath) {
		return null;
	}
	
	// Generate skill ID: owner-repo-lastPathSegment
	const pathSegments = finalPath.split("/");
	const lastSegment = pathSegments[pathSegments.length - 1];
	const skillId = `${owner}-${repo}-${lastSegment}`.toLowerCase();
	
	// Build normalized URL
	const normalizedUrl = `https://github.com/${owner}/${repo}/tree/${ref}/${finalPath}`;
	
	return {
		url: normalizedUrl,
		owner,
		repo,
		ref,
		path: finalPath,
		skillId,
	};
}
```

**Step 3: Remove parseSkillId function (lines 128-139)**

Delete the entire `parseSkillId` function - no longer needed.

**Step 4: Run typecheck**

Run: `cd cli && bun tsc --noEmit`
Expected: May have errors in install.ts (uses old return type)

**Step 5: Commit**

```bash
git add cli/src/core/github.ts
git commit -m "refactor(github): rewrite parseSkillRef for URL parsing"
```

---

### Task 3: Update Install Command

**Files:**
- Modify: `cli/src/commands/install.ts`

**Step 1: Update imports**

Change line 3:
```typescript
import { parseSkillRef, fetchTags } from "../core/github";
```
to:
```typescript
import { parseSkillRef, fetchTags, type ParsedSkillRef } from "../core/github";
```

**Step 2: Update skillId derivation (line 29)**

Replace:
```typescript
const skillId = `${owner}-${repo}`.toLowerCase();
```
with:
```typescript
const { skillId } = parsed;
```

**Step 3: Update source object to include url (lines 56-62)**

Replace:
```typescript
const source: SkillSource = {
	type: "github",
	owner,
	repo,
	ref: version || "main",
	path,
};
```
with:
```typescript
const source: SkillSource = {
	url: parsed.url.replace(/\/tree\/[^/]+/, `/tree/${version || "main"}`),
	type: "github",
	owner,
	repo,
	ref: version || "main",
	path,
};
```

**Step 4: Update instructions text (line 11)**

Replace:
```typescript
instructions: "Usage: skani install <owner/repo>[@version] or skani install github:owner/repo[@version][/path]",
```
with:
```typescript
instructions: "Usage: skani install https://github.com/owner/repo/tree/branch/path/to/skill[@version]",
```

**Step 5: Update error messages (lines 23-24)**

Replace:
```typescript
log.single.err("INSTALL", "Invalid skill reference format");
log.single.info("FORMAT", "owner/repo, owner/repo@version, or github:owner/repo/path@version");
```
with:
```typescript
log.single.err("INSTALL", "Invalid skill reference format");
log.single.info("FORMAT", "https://github.com/owner/repo/tree/branch/path/to/skill");
```

**Step 6: Run typecheck**

Run: `cd cli && bun tsc --noEmit`
Expected: No errors

**Step 7: Commit**

```bash
git add cli/src/commands/install.ts
git commit -m "refactor(install): use URL-based parsing and new skillId"
```

---

### Task 4: Update Skill Fetcher

**Files:**
- Modify: `cli/src/core/skill-fetcher.ts`

**Step 1: Check if source.url is used**

Read the file and verify it uses `source.owner`, `source.repo`, `source.ref`, `source.path` - these still exist, so no changes needed if it doesn't reference the url field.

If it needs the url field, add it where appropriate.

**Step 2: Run typecheck**

Run: `cd cli && bun tsc --noEmit`
Expected: No errors

**Step 3: Commit (if changes made)**

```bash
git add cli/src/core/skill-fetcher.ts
git commit -m "refactor(skill-fetcher): update for new source format"
```

---

### Task 5: Test Manually

**Files:**
- None (manual testing)

**Step 1: Test valid URL parsing**

Run: `cd cli && bun run dev install https://github.com/anthropics/anthropic-quickstarts/tree/main/.claude/skills/reviewer`

Expected: Should parse correctly, attempt to fetch (may fail if repo doesn't exist - that's ok for parsing test)

**Step 2: Test blob URL**

Run: `cd cli && bun run dev install https://github.com/anthropics/anthropic-quickstarts/blob/main/.claude/skills/reviewer/SKILL.md`

Expected: Same as above - should extract directory path

**Step 3: Test @version override**

Run: `cd cli && bun run dev install https://github.com/owner/repo/tree/main/skills/foo@v1.0.0`

Expected: ref should be "v1.0.0" not "main"

**Step 4: Test error cases**

Run each and verify error messages:
- `bun run dev install owner/repo` → "Invalid skill reference format"
- `bun run dev install https://github.com/owner/repo` → "Invalid skill reference format" (no path)
- `bun run dev install https://gitlab.com/owner/repo/tree/main/skills/foo` → "Invalid skill reference format" (non-GitHub)

---

### Task 6: Update Documentation

**Files:**
- Modify: `cli/USAGE.md`

**Step 1: Update Install Reference Formats section (lines 30-37)**

Replace:
```markdown
## Install Reference Formats

```bash
skani install owner/repo                    # Latest tag or main
skani install owner/repo@v1.2.0             # Specific version
skani install github:owner/repo             # Explicit GitHub
skani install github:owner/repo/skills/foo  # Subdirectory path
```
```

with:
```markdown
## Install Reference Formats

```bash
skani install https://github.com/owner/repo/tree/main/.claude/skills/foo
skani install https://github.com/owner/repo/tree/v1.2.0/.claude/skills/foo  # Specific version in URL
skani install https://github.com/owner/repo/tree/main/.claude/skills/foo@v1.2.0  # Override version
```
```

**Step 2: Update skani.json example (lines 45-68)**

Add `url` field to source:
```json
"source": {
  "type": "github",
  "url": "https://github.com/owner/repo/tree/v1.0.0/.claude/skills/foo",
  "owner": "owner",
  "repo": "repo",
  "ref": "v1.0.0",
  "path": ".claude/skills/foo"
}
```

**Step 3: Commit**

```bash
git add cli/USAGE.md
git commit -m "docs: update for URL-based install format"
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Add `url` field to `SkillSource` type |
| 2 | Rewrite `parseSkillRef` for URL parsing |
| 3 | Update `install` command to use new parsing |
| 4 | Verify `skill-fetcher` works with new format |
| 5 | Manual testing |
| 6 | Update documentation |
