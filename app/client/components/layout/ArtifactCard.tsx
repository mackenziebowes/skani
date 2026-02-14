import { AmberGlow } from "./AmberGlow";

interface CodeLine {
	type: "comment" | "keyword" | "string" | "plain";
	content: string;
}

interface ArtifactCardProps {
	title?: string;
	version?: string;
	captured?: string;
	codes: CodeLine[];
	className?: string;
}

export function ArtifactCard({
	title = "Agent Skill Manifest",
	version = "v1.0.4",
	captured = "2024-05-12",
	codes,
	className = "",
}: ArtifactCardProps) {
	return (
		<div className={`relative w-full ${className}`}>
			<AmberGlow />
			<div className="relative z-10 w-[380px] max-w-[85vw] max-md:scale-75 max-sm:scale-65 bg-card/40 border border-white/10 backdrop-blur-[20px] rounded-3xl p-10 shadow-[0_40px_80px_rgba(0,0,0,0.5)] -rotate-2 transition-transform duration-500 hover:rotate-0 hover:scale-[1.02]">
				<div className="font-mono text-[13px] text-[#ccc] leading-[1.8]">
					{codes.map((line, index) => (
						<div
							key={index}
							className={
								line.type === "comment"
									? "text-primary opacity-80"
									: line.type === "keyword"
										? "text-white font-bold"
										: line.type === "string"
											? "text-[#aaa]"
											: ""
							}
						>
							{line.content}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
