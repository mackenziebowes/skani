export function AmberGlowBackground({ className = "" }: { className?: string }) {
	return (
		<div className={`absolute -top-20 -left-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none ${className}`} />
	);
}
