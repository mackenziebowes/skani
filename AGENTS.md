# Skani - Agent Skills Management

A monorepo for managing agent skills across development environments.

## Project Structure

```
skani/
├── cli/                 # Bun-based CLI tool
│   └── src/
│       ├── index.ts    # Entry point
│       ├── commands/   # CLI commands
│       ├── core/       # Core utilities (github, file handling, logging)
│       └── types/      # TypeScript types
│
├── app/                 # Full-stack Next.js + Hono app
│   ├── client/         # Next.js 16 frontend
│   │   ├── app/        # App Router pages
│   │   ├── components/ # React components (ShadCN UI + Custom Layout + Docs)
│   │   └── lib/        # Utilities and API clients
│   │
│   └── server/         # Hono/Bun backend
│       └── src/
│           ├── routes/ # API routes
│           └── data/   # Mock data (skills)
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
bun run dev list             # List installed skills
```

### App Server (app/server)

```bash
cd app/server
bun install
bun run dev  # Starts on port 3050
```

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
- Skills are installed to `.claude/skills/<skill-id>/` in the target project
- The `skani.json` file tracks installed skills with pinned versions
- The website currently uses mock data; GitHub integration can be added later
- Custom amber theme defined in `app/client/app/globals.css`
- Landing page at `/landing` showcases full component library
- Docs pages use new extracted components with fossil/preservation design language

## Agent Rules

**Keep this file accurate:** If you cannot find a file at an expected path, search for it first. Once found, immediately update AGENTS.md with the correct location to prevent future agents from hitting the same issue.
