# GitHub URL Parsing Redesign

## Problems

### Problem A: Inhuman Input Format
Current parser requires `owner/repo` format, but humans browse GitHub in browsers with URLs displayed prominently. Forcing mental conversion from URL to shorthand is unnecessary friction.

### Problem B: ID Collisions
Current ID generation (`owner-repo`) breaks for colocated skills. Repos like `vercel/skills` contain multiple skills, but all become `vercel-skills`, causing overwrites.

## Design

### Input Format

Accept full GitHub URLs only:

```
https://github.com/owner/repo
https://github.com/owner/repo/tree/ref/path/to/skill
https://github.com/owner/repo/blob/ref/path/to/SKILL.md
```

Optional `@version` suffix overrides the ref in the URL:

```
https://github.com/vercel/skills/tree/main/.claude/skills/react@v1.2.0
```

Both `tree` (directory) and `blob` (file) URLs work. For `blob`, extract the directory from the file path.

### ID Generation

Pattern: `{owner}-{repo}-{final-path-segment}`

Examples:
- `github.com/vercel/skills/tree/main/.claude/skills/react` → `vercel-skills-react`
- `github.com/anthropic/claude-skills/tree/main/review` → `anthropic-claude-skills-review`

### skani.json Source Format

Hybrid approach - URL is source of truth, decomposed fields for convenience:

```json
"source": {
  "url": "https://github.com/vercel/skills/tree/v1.2.0/.claude/skills/react",
  "type": "github",
  "owner": "vercel",
  "repo": "skills",
  "ref": "v1.2.0",
  "path": ".claude/skills/react"
}
```

### Error Handling

| Case | Behavior |
|------|----------|
| No path in URL | Error: "Path required, use …/tree/main/path/to/skill" |
| Invalid GitHub URL | Error with expected format examples |
| 404 on repo/path | Error with details from GitHub API |

### New `parseSkillRef()` Signature

```typescript
interface ParsedSkillRef {
  url: string;      // normalized URL (no @version suffix)
  owner: string;
  repo: string;
  ref: string;
  path: string;
  skillId: string;  // derived: owner-repo-finalPathSegment
}

function parseSkillRef(input: string): ParsedSkillRef | null
```

### Backward Compatibility

None - this is a clean break. Old `owner/repo@version/path` format is removed.

## Files to Change

1. `cli/src/core/github.ts` - Rewrite `parseSkillRef()`, remove `parseSkillId()`
2. `cli/src/types/skill.ts` - Update `SkillSource` interface to include `url`
3. `cli/src/commands/install.ts` - Update to use new parsing, generate skillId from parsed result
4. `cli/src/core/skill-fetcher.ts` - Ensure it works with new source format
5. `cli/src/core/skani-file.ts` - Handle new source format when reading/writing
