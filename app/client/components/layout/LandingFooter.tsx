import Link from "next/link";
import { footerConfig } from "@/lib/footer-config";

export function LandingFooter() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-border py-12 lg:py-20">
			<div className="container mx-auto px-6 lg:px-10">
				<div className="grid sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-10">
					<div>
						<h4 className="font-serif text-2xl lg:text-3xl mb-6">{footerConfig.brand.name}</h4>
						<p className="text-sm text-muted-foreground -mt-2">
							© {year} Mackenzie Bowes.
							<br />
							{footerConfig.brand.tagline}
						</p>
					</div>
					{footerConfig.sections.map((section) => (
						<div key={section.title}>
							<h5 className="text-xs uppercase tracking-[0.05em] text-muted-foreground mb-6">
								{section.title}
							</h5>
							<ul className="list-none">
								{section.links.map((link) => (
									<li key={link.href} className="mb-3">
										<Link
											href={link.href}
											className="text-foreground text-sm no-underline transition-colors hover:text-primary"
											target={
												link.href.startsWith("http") ? "_blank" : undefined
											}
											rel={
												link.href.startsWith("http")
													? "noopener noreferrer"
													: undefined
											}
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</footer>
	);
}
