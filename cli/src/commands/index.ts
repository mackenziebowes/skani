import { registerCommand } from "../core/cli";
import { initCommand } from "./init";
import { installCommand } from "./install";
import { listCommand } from "./list";
import { installAllCommand } from "./install-all";
import { removeCommand } from "./remove";
import { searchCommand } from "./search";
import { infoCommand } from "./info";
import { updateCommand } from "./update";
import { registerKitCommands } from "./kit";
import { registerRegistryCommands } from "./registry";

export function registerCommands() {
	registerCommand(initCommand);
	registerCommand(installCommand);
	registerCommand(listCommand);
	registerCommand(installAllCommand);
	registerCommand(removeCommand);
	registerCommand(searchCommand);
	registerCommand(infoCommand);
	registerCommand(updateCommand);
	registerKitCommands();
	registerRegistryCommands();
}