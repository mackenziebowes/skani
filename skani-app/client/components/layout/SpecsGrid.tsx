interface SpecItem {
	label: string;
	value: string;
}

interface SpecsGridProps {
	specs: SpecItem[];
}

export function SpecsGrid({ specs }: SpecsGridProps) {
	return (
		<div className="grid grid-cols-4 border-t border-b border-border">
			{specs.map((spec, index) => (
				<div
					key={index}
					className={`p-10 flex flex-col gap-4 border-r border-border last:border-r-0`}
				>
					<span className="text-xs uppercase tracking-[0.05em] text-muted-foreground">
						{spec.label}
					</span>
					<span className="font-serif text-2xl">{spec.value}</span>
				</div>
			))}
		</div>
	);
}
