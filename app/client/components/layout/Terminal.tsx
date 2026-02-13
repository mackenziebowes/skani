export function Terminal({ command, output }: { command: string; output: string[] }) {
	return (
		<div className="max-w-[680px] mx-auto mt-16 bg-background border border-border rounded-xl p-6 text-left shadow-[0_0_60px_rgba(217,131,36,0.05)]">
			<div className="flex gap-2 mb-6 opacity-50">
				<div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
				<div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
				<div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
			</div>
			<div className="font-mono text-base flex gap-3">
				<span className="text-primary">➜</span>
				<span className="flex-1">{command}</span>
				<span className="w-2 h-[18px] bg-primary animate-blink" />
			</div>
			{output.length > 0 && (
				<div className="mt-3 text-[#666] font-mono text-sm text-left">
					{output.map((line, index) => (
						<div key={index}>{line}</div>
					))}
				</div>
			)}
		</div>
	);
}
