import { TerminalCursor } from "./TerminalCursor";

interface SkillListOutputProps {
	skills: { name: string; version: string }[];
	command?: string;
}

export function SkillListOutput({ skills, command = "npx skani list" }: SkillListOutputProps) {
	return (
		<div className="relative bg-[#0a0a0a] border border-gray-800 rounded-lg p-6 font-mono text-sm shadow-2xl overflow-hidden group-hover:shadow-primary/10 transition-shadow">
			<div className="flex gap-3 text-gray-300 mb-3">
				<span className="text-primary select-none">➜</span>
				<span className="text-gray-500 select-none">~</span>
				<span>{command}</span>
				<TerminalCursor />
			</div>
			<div className="pl-6 border-l border-gray-800 ml-1.5 py-1">
				<div className="flex justify-between text-gray-400 text-xs mb-2 uppercase tracking-widest border-b border-gray-800 pb-1 w-full max-w-md">
					<span>Skill</span>
					<span>Version</span>
				</div>
				{skills.map((skill) => (
					<div key={skill.name} className="flex justify-between text-gray-300 w-full max-w-md">
						<span>{skill.name}</span>
						<span className="text-primary">{skill.version}</span>
					</div>
				))}
				<div className="flex justify-between text-gray-500 w-full max-w-md italic mt-2 text-xs">
					<span>{skills.length} skills fossilized.</span>
				</div>
			</div>
			<div className="flex gap-3 text-gray-300 mt-4">
				<span className="text-primary select-none">➜</span>
				<span className="text-gray-500 select-none">~</span>
				<TerminalCursor />
			</div>
		</div>
	);
}
