import { LandingNav } from "@/components/layout/LandingNav";
import { Hero } from "@/components/layout/Hero";
import { SpecsGrid } from "@/components/layout/SpecsGrid";
import { ManifestoSection } from "@/components/layout/ManifestoSection";
import { TerminalSection } from "@/components/layout/TerminalSection";
import { LandingFooter as Footer } from "@/components/layout/LandingFooter";

export default function Home() {
	const specs = [
		{ label: "Version", value: "0.9.4 (Beta)" },
		{ label: "Registry", value: "Decentralized" },
		{ label: "Runtime", value: "Universal" },
		{ label: "Latency", value: "< 20ms" },
	];

	const quickstartCodes = [
		{ type: "comment" as const, content: "# Initialize a new project" },
		{ type: "plain" as const, content: "" },
		{ type: "keyword" as const, content: "npx" },
		{ type: "string" as const, content: " skani init my-project" },
		{ type: "plain" as const, content: "" },
		{ type: "plain" as const, content: "" },
		{ type: "comment" as const, content: "# Install a skill" },
		{ type: "plain" as const, content: "" },
		{ type: "keyword" as const, content: "npx" },
		{ type: "string" as const, content: " skani install owner/repo" },
	];

	const features = [
		{
			title: "Simple Installation",
			description: "Install skills with a single command from GitHub or the central registry. No complex setup required.",
		},
		{
			title: "Reproducible Environments",
			description: "Version-pinned skills ensure consistent environments across devices. What works on your machine works everywhere.",
		},
		{
			title: "CLI & Website",
			description: "Manage skills via CLI for automation or browse and discover skills on the website. Use whichever fits your workflow.",
		},
	];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'Skani - Agent Skills Management',
		description: 'Install, share, and manage agent skills across development environments with a single command.',
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
				}}
			/>
			<div className="min-h-screen bg-background text-foreground font-sans font-light leading-[1.6]">
			<div className="container mx-auto px-10 max-w-[1400px]">
				<LandingNav />
				<Hero
					heading="Manage Agent Skills"
					italicText="with Ease"
					description="Install, share, and manage agent skills across development environments with a single command."
					ctaText="Get Started"
					ctaHref="/docs"
					codes={quickstartCodes}
				/>
			</div>

			<SpecsGrid specs={specs} />

			<div className="container mx-auto px-10 max-w-[1400px]">
				<ManifestoSection
					title="Why Skani"
					subtitle="Skani makes agent skill management simple, reliable, and portable across all your development environments."
					features={features}
				/>

				<TerminalSection
					heading="One Command."
					subtitle="The complexity of agent orchestration, reduced to a single line."
					command="skani install @latest/vision-core --global"
					output={[
						"[success] Manifest retrieved (48ms)",
						"[linking] Integrating dependencies...",
						"[ready] Agent skill active.",
					]}
				/>
			</div>

			<Footer />
		</div>
		</>
	);
}
