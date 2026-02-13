interface VersionRequirementProps {
	name: string;
	version: string;
	hoverClass?: string;
}

export function VersionRequirementCard({ name, version, hoverClass = "group-hover:border-amber-accent/50" }: VersionRequirementProps) {
	return (
		<div className={`flex-1 bg-white/5 border border-white/10 p-4 flex items-center justify-between group hover:border-white/20 transition-colors cursor-default ${hoverClass}`}>
			<span className="font-mono text-sm text-gray-300">{name}</span>
			<span className="text-xs text-amber-accent/60 group-hover:text-amber-accent">{version}</span>
		</div>
	);
}
