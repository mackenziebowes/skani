import Link from "next/link";

interface OnThisPageProps {
	sections: string[];
	activeSection?: string;
}

export function OnThisPage({ sections, activeSection }: OnThisPageProps) {
	return (
		<aside className="hidden xl:block w-64 sticky top-20 h-[calc(100vh-80px)] py-12 pr-12">
			<h5 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-6">On this page</h5>
			<ul className="space-y-3 text-sm border-l border-gray-800 pl-4">
				{sections.map((section) => (
					<li key={section}>
						<Link
							href={`#${section.toLowerCase().replace(/\s+/g, "-")}`}
							className={`text-gray-500 hover:text-white block hover:translate-x-1 transition-transform ${
								section === activeSection ? "text-primary" : ""
							}`}
						>
							{section}
						</Link>
					</li>
				))}
			</ul>
		</aside>
	);
}
