interface StepProps {
	number: string;
	title: string;
	children: React.ReactNode;
}

export function Step({ number, title, children }: StepProps) {
	return (
		<div className="relative group mb-8">
			<div className="absolute -left-[41px] md:-left-[57px] top-2 w-[17px] h-[17px] rounded-full border border-gray-700 bg-background flex items-center justify-center group-hover:border-amber-accent transition-colors">
				<div className="w-1.5 h-1.5 bg-amber-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
			</div>
			<h3 className="font-serif text-3xl mb-4 flex items-baseline gap-4">
				<span className="font-mono text-sm text-amber-accent opacity-60">{number}</span>
				{title}
			</h3>
			{children}
		</div>
	);
}
