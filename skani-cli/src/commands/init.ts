import type { Command } from "../core/cli";
import { initSkaniFile, skaniFileExists } from "../core/skani-file";
import log from "../core/log";

export const initCommand: Command = {
	name: "init",
	description: "Initialize skani.json in the current directory",
	instructions: "Usage: skani init [project-name]",
	run: async (args: string[]) => {
		const projectName = args[0] || "skani-project";
		
		const exists = await skaniFileExists();
		if (exists) {
			log.single.err("INIT", "skani.json already exists in this directory");
			process.exit(1);
		}
		
		await initSkaniFile(projectName);
		
		log.multi.info([
			{ t: "INIT", m: `Created skani.json for "${projectName}"` },
			{ t: "FILE", m: "skani.json" },
			{ t: "NEXT", m: "Use 'skani install <skill>' to add skills" },
		]);
	},
};
