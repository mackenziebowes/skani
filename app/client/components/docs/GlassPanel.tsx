export function GlassPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
	return (
		<div className={`bg-card/60 backdrop-blur-md border border-white/8 p-8 rounded-sm relative ${className}`}>
			{/* Fossil-style corner decorations */}
			<span className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b border-r border-amber-accent" />
			<span className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t border-l border-amber-accent" />
			{children}
		</div>
	);
}
