# Skani CLI - Developer Usage Guide

## Overview

Skani CLI manages agent skills for AI coding assistants. Skills are installed to `.claude/skills/<skill-id>/` and tracked in `skani.json`.

## Getting Started

```bash
cd skani-cli
bun install
bun run dev --help    # Show all commands
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `init [name]` | Create `skani.json` in current directory |
| `install <ref>` | Install skill from GitHub |
| `install-all` | Reinstall all skills from `skani.json` |
| `list` | Show installed skills |
| `remove <id>` | Uninstall a skill |
| `update <id>` | Update skill to latest version |
| `search <query>` | Search central registry |
| `info <id>` | Get skill details from registry |
| `-h, --help` | Show help |
| `-v, --version` | Show version |

## Install Reference Formats

```bash
skani install owner/repo                    # Latest tag or main
skani install owner/repo@v1.2.0             # Specific version
skani install github:owner/repo             # Explicit GitHub
skani install github:owner/repo/skills/foo  # Subdirectory path
```

## Files Created

### `skani.json`

Tracks project skills:

```json
{
  "version": "1.0.0",
  "environment": {
    "name": "my-project",
    "created": "2024-01-01T00:00:00.000Z",
    "updated": "2024-01-01T00:00:00.000Z"
  },
  "skills": [
    {
      "id": "owner-repo",
      "name": "repo",
      "version": "v1.0.0",
      "source": {
        "type": "github",
        "owner": "owner",
        "repo": "repo",
        "ref": "v1.0.0",
        "path": ""
      },
      "installedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### `.claude/skills/<skill-id>/`

Installed skill files (SKILL.md, scripts, etc.)

## Architecture

```
src/
├── commands/         # One file per command
│   ├── init.ts
│   ├── install.ts
│   ├── list.ts
│   ├── remove.ts
│   ├── update.ts
│   ├── search.ts
│   ├── info.ts
│   └── install-all.ts
│
├── core/
│   ├── cli.ts        # Command registry and runCLI() router
│   ├── skani-file.ts # Read/write skani.json
│   ├── skill-fetcher.ts # Download/install skill files from GitHub
│   ├── github.ts     # GitHub API (fetch tags, parse skill refs)
│   └── log.ts        # Logging utilities
│
└── types/
    └── skill.ts      # TypeScript interfaces
```

## Adding a New Command

1. Create `src/commands/mycommand.ts`:

```typescript
import type { Command } from "../core/cli";
import log from "../core/log";

export const myCommand: Command = {
  name: "mycommand",
  description: "Brief description",
  instructions: "Usage: skani mycommand <args>",
  run: async (args: string[]) => {
    // Implementation
    log.single.info("MYCOMMAND", "Done");
  },
};
```

2. Register in `src/commands/index.ts`:

```typescript
import { myCommand } from "./mycommand";
// ...
registerCommand(myCommand);
```

## Development

```bash
bun run dev <command>   # Run CLI during development
```