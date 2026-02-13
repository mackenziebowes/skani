import Link from "next/link";

interface DocsFooterProps {
	previous?: { title: string; href: string };
	next?: { title: string; href: string };
}

export function DocsFooter({ previous, next }: DocsFooterProps) {
	return (
		<div className="border-t border-border pt-12 flex justify-between items-center">
			{previous && (
				<Link href={previous.href} className="group">
					<div className="text-xs font-mono text-gray-500 mb-1 group-hover:text-primary transition-colors">PREVIOUS</div>
					<div className="font-serif text-xl">{previous.title}</div>
				</Link>
			)}
			{next && (
				<Link href={next.href} className="group text-right">
					<div className="text-xs font-mono text-gray-500 mb-1 group-hover:text-primary transition-colors">NEXT</div>
					<div className="font-serif text-xl">{next.title} →</div>
				</Link>
			)}
		</div>
	);
}
