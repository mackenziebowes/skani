export interface FooterLink {
	label: string;
	href: string;
}

export interface FooterSection {
	title: string;
	links: FooterLink[];
}

export const footerConfig = {
	brand: {
		name: "Skani",
		tagline: "Preserving future of AI.",
	},
	sections: [
		{
			title: "Product",
			links: [
				{ label: "CLI Tool", href: "/docs/cli-commands" },
				{ label: "Manifest Standard", href: "/docs/skani-json" },
				{ label: "Registry", href: "/registry" },
			],
		},
		{
			title: "Resources",
			links: [
				{ label: "Documentation", href: "/docs" },
				{ label: "Skills", href: "/registry/skills" },
				{ label: "Kits", href: "/registry/kits" },
				{ label: "GitHub", href: "https://github.com/mackenziebowes/skani" },
			],
		},
	] as FooterSection[],
};
