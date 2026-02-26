import { Terminal } from "./Terminal";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface TerminalSectionProps {
	heading: string;
	subtitle?: string;
	command: string;
	output: string[];
	ctaText?: string;
	ctaHref?: string;
}

export function TerminalSection({
	heading,
	subtitle,
	command,
	output,
	ctaText,
	ctaHref,
}: TerminalSectionProps) {
	return (
		<section className="py-20 lg:py-[120px] bg-[#0a0a0a] border-t border-b border-border text-center">
			<div className="container mx-auto px-6 lg:px-10">
				<h2 className="font-serif text-[32px] lg:text-[42px]">{heading}</h2>
				{subtitle && (
					<p className="text-muted-foreground mt-4">{subtitle}</p>
			)}
				<Terminal command={command} output={output} />
				{ctaText && ctaHref && (
					<div className="mt-8">
						<Button asChild variant="outline">
							<a href={ctaHref}>
								{ctaText}
								<ArrowRight className="h-4 w-4" />
							</a>
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}
