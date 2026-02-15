export interface DocsNavLink {
	label: string;
	href: string;
}

export interface DocsNavSection {
	title: string;
	links: DocsNavLink[];
}

export const docsNavSections: DocsNavSection[] = [
	{
		title: "Getting Started",
		links: [
			{ label: "Introduction", href: "/docs" },
			{ label: "Quick Start", href: "/docs/getting-started" },
		],
	},
	{
		title: "Reference",
		links: [
			{ label: "CLI Commands", href: "/docs/cli-commands" },
			{ label: "Skill Kits", href: "/docs/skill-kits" },
			{ label: "skani.json", href: "/docs/skani-json" },
		],
	},
];
