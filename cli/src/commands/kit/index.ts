import { registerCommand } from "../../core/cli";
import { kitListCommand } from "./list";
import { kitInstallCommand } from "./install";
import { kitRestoreCommand } from "./restore";

export function registerKitCommands() {
  registerCommand(kitListCommand);
  registerCommand(kitInstallCommand);
  registerCommand(kitRestoreCommand);
}
