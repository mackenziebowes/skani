# Skani - Agent Skills Management

A monorepo for managing agent skills across development environments.

## Project Structure

```
skani/
├── cli/                 # Bun-based CLI tool
│   └── src/
│       ├── index.ts    # Entry point
│       ├── commands/   # CLI commands
│       │   ├── cache/  # Cache commands (list, clean)
│       │   ├── kit/    # Kit commands (list, install, restore)
│       │   └── registry/ # Registry commands (list, install, mirror)
│       ├── core/       # Core utilities (github, registry-fetcher, cache, symlink, logging)
│       └── types/      # TypeScript types
│
├── app/                 # Full-stack Next.js app
│   └── client/         # Next.js frontend
│       ├── app/        # App Router pages + API routes
│       │   └── api/    # API endpoints (skills, kits)
│       ├── components/ # React components (ShadCN UI + Custom Layout + Docs)
│       └── lib/        # Utilities, API clients, and data
│           └── data/   # Kits and mirrored skills data
│
└── basic_idea.md       # Project overview
```

## Commands

### CLI (cli/)

```bash
cd cli
bun install
bun run dev --help           # Show help
bun run dev init my-project  # Initialize skani.json
bun run dev install owner/repo  # Install a skill
bun run dev install owner/repo --refresh  # Force re-download (bypass cache)
bun run dev list             # List installed skills
bun run dev registry list    # List available kits
bun run dev registry install <kit-name>  # Install a kit from registry
bun run dev registry mirror <kit-name>   # Mirror skill files to local data
bun run dev cache list       # Show cached skills with sizes
bun run dev cache clean      # Clear global cache
```

### Global Cache

Skills are cached at `~/.skani/registry/skill/<id>/`. When installing:
- If cached, file-level symlinks are created in `.claude/skills/<id>/` (no network call)
- Use `--refresh` to force re-download from remote

**Cache commands:**
- `skani cache list` - Show cached skills with sizes
- `skani cache clean` - Clear entire cache

**Future:** Windows support will fall back to file copying instead of symlinks.

### App Client (app/client)

```bash
cd app/client
bun install
bun run dev  # Starts on port 3000
```

## API Endpoints

- `GET /` - API info
- `GET /api/skills` - List all skills
- `GET /api/skills/search?q=<query>` - Search skills
- `GET /api/skills/:id` - Get skill details
- `GET /api/skills/:id/files` - Get mirrored skill files (avoids GitHub rate limits)
- `GET /api/kits` - List available kits
- `GET /api/kits/:name` - Get kit details

## Mirrored Skills

To avoid GitHub rate limits when installing large kits, skills can be mirrored in the registry.

### Structure

```
app/client/lib/data/
├── kits/                    # Kit definitions
│   ├── index.ts            # Exports all kits
│   ├── obra-superpowers-full.ts
│   └── marketing-skills-full.ts
│
└── mirrored-skills/         # Mirrored skill files
    ├── index.ts            # Exports mirrored skills
    ├── types.ts            # TypeScript types
    └── *.json              # Skill files by kit
```

### Adding Mirrored Skills

1. Run the mirror command from project root:
   ```bash
   cd cli && bun run dev registry mirror <kit-name>
   ```

2. This creates `app/client/lib/data/mirrored-skills/<kit-name>.json`

3. Update `app/client/lib/data/mirrored-skills/index.ts` to import the new file

### How It Works

- CLI first tries to fetch skill files from `/api/skills/:id/files`
- If mirrored files exist, they're served directly (no GitHub API calls)
- Falls back to GitHub if files aren't mirrored
- Install output shows source: "MIRRORED" or "GITHUB"

## Theme System

The app uses a custom amber-themed design inspired by the dark concept landing page.

### Color Palette

**Dark Mode:**
- Background: `#050505`
- Card: `#0f0f0f`
- Primary/Accent: `#D98324` (Amber)
- Primary Text: `#ffffff`
- Secondary Text: `#888888`
- Border: `rgba(255, 255, 255, 0.15)`

**Light Mode:**
- Background: `#fafafa`
- Card: `#ffffff`
- Primary/Accent: `#D98324` (Amber)
- Primary Text: `#050505`
- Secondary Text: `#666666`
- Border: `rgba(0, 0, 0, 0.15)`

### Typography

- **Serif**: Playfair Display (headings, decorative text)
- **Sans**: Inter (body text, UI elements)
- **Mono**: JetBrains Mono (code, technical text)

## Layout Components

Located in `client/components/layout/`

| Component | Description |
|-----------|-------------|
| `Hero` | Large hero section with artifact card and code display |
| `Nav` | Navigation bar with links |
| `Footer` / `FooterNew` | Footer with product/resources/legal links |
| `PillButton` | Rounded pill-shaped button with hover effect |
| `ArtifactCard` | Glass-morphism card with syntax-highlighted code |
| `Terminal` | Terminal window with blinking cursor |
| `SpecsGrid` | Grid of specification items |
| `FeatureItem` | Feature card with image and text |
| `ManifestoSection` | Section with sticky title and feature list |
| `TerminalSection` | Centered terminal section |
| `AmberGlow` | Animated radial gradient background effect |

## Docs Components

Located in `client/components/docs/`

| Component | Description |
|-----------|-------------|
| `DocsNav` | Left sidebar navigation with sections |
| `OnThisPage` | Right sidebar with page sections |
| `DocsFooter` | Previous/Next page navigation |
| `Breadcrumbs` | Breadcrumb trail (DOCS / PRESERVATION / ...) |
| `SectionTitle` | Section title with amber accent bar |
| `Step` | Numbered step (01, 02, 03) with hover indicator |
| `GlassPanel` | Glass-morphism panel with fossil-style corners |
| `CodeBlock` | Terminal-style code block with copy button |
| `VersionRequirementCard` | Version requirement display (Bun v1.0+, Node v18.0+) |
| `TerminalCursor` | Blinking amber cursor |
| `AmberGlowBackground` | Amber glow effect for page headings |
| `SkillListOutput` | Styled output for skani list command |
| `DocNavLink` | Navigation link with active/hover states |

### Example Usage

```tsx
import { DocsNav, OnThisPage, Breadcrumbs, Step, CodeBlock } from "@/components/docs";

export default function DocsPage() {
  return (
    <div className="flex">
      <DocsNav sections={navSections} />
      <main className="flex-1">
        <Breadcrumbs items={[...]} />
        <Step number="01" title="Initialize">
          <p>Description...</p>
          <CodeBlock code="npx skani init" />
        </Step>
      </main>
      <OnThisPage sections={["Prerequisites", "Initialize", "Install"]} />
    </div>
  );
}
```

## Development Notes

- The CLI uses Bun's built-in file API (`Bun.file`, `Bun.write`)
- Skills are cached globally at `~/.skani/registry/skill/<id>/`
- Projects use file-level symlinks in `.claude/skills/<skill-id>/` pointing to cache
- The `skani.json` file tracks installed skills with pinned versions
- Custom amber theme defined in `app/client/app/globals.css`
- Landing page at `/landing` showcases full component library
- Docs pages use new extracted components with fossil/preservation design language
- Large kits use mirrored skills from `/api/skills/:id/files` to avoid GitHub rate limits

## Agent Rules

**Keep this file accurate:** If you cannot find a file at an expected path, search for it first. Once found, immediately update AGENTS.md with the correct location to prevent future agents from hitting the same issue.

**End of work workflow:** Before finishing any work session, always run in order:
1. **Test** - Run tests to verify nothing is broken
2. **Lint** - Run linter to catch style/issues
3. **Build** - Run build to ensure compilation succeeds

```bash
# CLI
cd cli && bun test && bun lint && bun build

# App Client
cd app/client && bun test && bun lint && bun run build
```
