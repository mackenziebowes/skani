import { LandingNav } from "@/components/layout/LandingNav";
import { Hero } from "@/components/layout/Hero";
import { SpecsGrid } from "@/components/layout/SpecsGrid";
import { ManifestoSection } from "@/components/layout/ManifestoSection";
import { TerminalSection } from "@/components/layout/TerminalSection";
import { LandingFooter as Footer } from "@/components/layout/LandingFooter";

export default function LandingPage() {
	const specs = [
		{ label: "Version", value: "0.9.4 (Beta)" },
		{ label: "Registry", value: "Decentralized" },
		{ label: "Runtime", value: "Universal" },
		{ label: "Latency", value: "< 20ms" },
	];

	const features = [
		{
			title: "Immutable Snapshots",
			description: "Once defined, a skill is frozen in time. Like an insect in amber, it remains perfectly preserved until called upon by a new agent instance.",
		},
		{
			title: "Universal Resurrection",
			description: "Deploy skill manifests to local, staging, or production environments with zero dependency drift. What worked there, works here.",
		},
	];

	return (
		<div className="min-h-screen bg-background text-foreground font-sans font-light leading-[1.6]">
			<div className="container mx-auto px-10 max-w-[1400px]">
				<LandingNav />
				<Hero
					heading="Preserving Intelligence"
					italicText="(in code)"
					description="Fleeting genius, captured like amber. Install, share, and manage agent skill manifests across development environments with absolute precision."
					ctaText="Get Started"
					ctaHref="/docs"
				/>
			</div>

			<SpecsGrid specs={specs} />

			<div className="container mx-auto px-10 max-w-[1400px]">
				<ManifestoSection
					title="The Fossilization of Function"
					subtitle="Knowledge should rise again. Skani ensures your agent's capabilities are portable, immutable, and ready for resurrection in any environment."
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
	);
}
