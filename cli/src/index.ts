#!/usr/bin/env bun
import { runCLI } from "./core/cli";
import { registerCommands } from "./commands";
import log from "./core/log";

registerCommands();

runCLI().catch((err) => {
	log.single.err("FATAL", err.message);
	process.exit(1);
});
