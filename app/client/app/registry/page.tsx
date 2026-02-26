import Link from "next/link";
import { Puzzle, Package } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const registrySections = [
	{
		title: "Skills",
		description: "Individual, reusable capabilities that extend your agent's abilities. Each skill is a self-contained module with specific functionality.",
		href: "/registry/skills",
		icon: Puzzle,
		details: [
			"Single-purpose modules",
			"Install individually",
			"Mix and match as needed",
		],
	},
	{
		title: "Kits",
		description: "Curated bundles of skills pre-configured for specific workflows or domains. Get up and running quickly with a complete skillset.",
		href: "/registry/kits",
		icon: Package,
		details: [
			"Pre-bundled skill collections",
			"One-command installation",
			"Domain-specific configurations",
		],
	},
];

export default function RegistryPage() {
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'Registry - Skani',
		description: 'Browse skills and kits in the Skani registry',
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
					<h1>Registry</h1>
					<p className="lead">
						Discover skills and kits to supercharge your AI agents
					</p>

					<h2>Skills vs Kits</h2>
					<p>
						<strong>Skills</strong> are individual capabilities — think of them as 
						plugins or extensions. Each skill provides specific functionality 
						that your agent can use.
					</p>
					<p>
						<strong>Kits</strong> are curated collections of skills bundled together 
						for common use cases. They provide a quick way to get started with 
						a complete set of related capabilities.
					</p>

					<div className="grid md:grid-cols-2 gap-6 not-prose mt-8">
						{registrySections.map((section) => (
							<Card key={section.href} className="group hover:border-primary transition-colors">
								<CardHeader>
									<div className="flex items-start gap-4">
										<div className="p-2.5 rounded-lg bg-primary/10">
											<section.icon className="h-5 w-5 text-primary" />
										</div>
										<div className="flex-1">
											<CardTitle className="group-hover:text-primary transition-colors">
												{section.title}
											</CardTitle>
											<CardDescription className="mt-2">
												{section.description}
											</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<ul className="space-y-1.5 mb-4">
										{section.details.map((detail, i) => (
											<li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
												<span className="h-1 w-1 rounded-full bg-primary/50" />
												{detail}
											</li>
										))}
									</ul>
									<Button asChild variant="outline" className="w-full">
										<Link href={section.href}>
											Browse {section.title}
										</Link>
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</article>
			</div>
		</>
	);
}
