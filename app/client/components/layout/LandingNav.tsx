import Link from "next/link";

export function LandingNav() {
	return (
		<nav className="py-10 flex justify-between items-center border-b border-border px-10">
			<Link href="/" className="font-serif text-2xl font-normal tracking-[-0.02em]">
				Skani.
			</Link>
			<div className="flex gap-10">
				<Link
					href="/docs"
					className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
				>
					Documentation
				</Link>
				<Link
					href="/skills"
					className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
				>
					Registry
				</Link>
			</div>
		</nav>
	);
}
