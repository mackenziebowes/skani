import { join } from "node:path";

export interface WatchConfig {
	name: string;
	type: "dir" | "file";
	sourcePath: string;
	outputPath: string;
}

type Config = {
	about_text: string;
	more_info_text: string;
	watchConfigs: WatchConfig[];
}
export const config: Config = {
		about_text:
	"A Bunx/Npx Tool that manages agent skills",
		more_info_text:
	"See https://github.com/mackenziebowes/mkcmd for more details.",
	watchConfigs: [
		{
			name: "core",
			type: "dir",
			sourcePath: join(".", "src", "core"),
			outputPath: join(".", "src", "data", "core.ts"),
		},
	],
};