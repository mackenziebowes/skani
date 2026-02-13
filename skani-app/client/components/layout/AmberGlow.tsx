export function AmberGlow({ className = "" }: { className?: string }) {
	return (
		<div
			className={`absolute w-[300px] h-[400px] bg-primary opacity-40 blur-[80px] animate-pulse z-0 ${className}`}
			style={{
				background: "radial-gradient(circle at center, #D98324, transparent 70%)",
			}}
		/>
	);
}
