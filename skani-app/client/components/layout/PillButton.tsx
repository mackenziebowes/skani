import { ArrowRight } from "lucide-react";
import { AnchorHTMLAttributes, ReactNode } from "react";

interface PillButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	children: ReactNode;
	icon?: boolean;
}

export function PillButton({ children, icon = true, className = "", ...props }: PillButtonProps) {
	return (
		<a
			className={`inline-flex items-center px-8 py-3 border border-border bg-transparent text-foreground text-sm font-normal transition-all duration-300 hover:bg-foreground hover:text-background cursor-pointer rounded-full ${className}`}
			{...props}
		>
			{children}
			{icon && <ArrowRight className="ml-3 h-4 w-4" />}
		</a>
	);
}
