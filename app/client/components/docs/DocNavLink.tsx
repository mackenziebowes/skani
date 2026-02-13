import Link from "next/link";

interface DocNavLinkProps {
	href: string;
	children: React.ReactNode;
	active?: boolean;
	className?: string;
}

export function DocNavLink({ href, children, active = false, className = "" }: DocNavLinkProps) {
	return (
		<Link
			href={href}
			className={`block pl-4 py-2 text-sm border-l transition-colors ${
				active
					? "text-amber-accent font-medium border-amber-accent bg-amber-accent/20"
					: "text-gray-400 hover:text-white border-transparent hover:border-gray-700"
			} ${className}`}
		>
			{children}
		</Link>
	);
}
