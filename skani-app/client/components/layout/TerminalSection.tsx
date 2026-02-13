import { Terminal } from "./Terminal";

interface TerminalSectionProps {
	heading: string;
	subtitle?: string;
	command: string;
	output: string[];
}

export function TerminalSection({
	heading,
	subtitle,
	command,
	output,
}: TerminalSectionProps) {
	return (
		<section className="py-[120px] bg-[#0a0a0a] border-t border-b border-border text-center">
			<div className="container mx-auto px-10">
				<h2 className="font-serif text-[42px]">{heading}</h2>
				{subtitle && (
					<p className="text-muted-foreground mt-4">{subtitle}</p>
				)}
				<Terminal command={command} output={output} />
			</div>
		</section>
	);
}
