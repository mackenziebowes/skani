export function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
	return (
		<h2 className={`font-serif text-2xl mb-8 flex items-center gap-4 ${className}`}>
			<span className="w-px h-6 bg-primary" />
			{children}
		</h2>
	);
}
