import Link from "next/link";
import { Terminal, FileJson } from "lucide-react";

const docsSections = [
	{
		title: "Getting Started",
		description: "Learn basics of Skani and how to get up and running",
		href: "/docs/getting-started",
		icon: Terminal,
	},
	{
		title: "CLI Commands",
		description: "Reference for all available CLI commands",
		href: "/docs/cli-commands",
		icon: Terminal,
	},
	{
		title: "skani.json",
		description: "Understanding skani.json configuration file",
		href: "/docs/skani-json",
		icon: FileJson,
	},
];

export default function DocsPage() {
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'Documentation - Skani',
		description: 'Everything you need to know about using Skani',
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
				}}
			/>
			<div className="container mx-auto px-4 py-8">
			<article className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
				<h1>Documentation</h1>
				<p className="lead">
					Everything you need to know about using Skani
				</p>

				<div className="grid md:grid-cols-2 gap-4 not-prose">
					{docsSections.map((section) => (
						<Link
							key={section.href}
							href={section.href}
							className="group p-6 rounded-lg border hover:border-primary transition-colors"
						>
							<div className="flex items-start gap-4">
								<div className="p-2 rounded-lg bg-primary/10">
									<section.icon className="h-5 w-5 text-primary" />
								</div>
								<div>
									<h3 className="font-semibold group-hover:text-primary">{section.title}</h3>
									<p className="text-sm text-gray-400 mt-1">
										{section.description}
									</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			</article>
		</div>
		</>
	);
}
