import { registerCommand } from "../../core/cli";
import { registryListCommand } from "./list";
import { registryInstallCommand } from "./install";

export function registerRegistryCommands() {
  registerCommand(registryListCommand);
  registerCommand(registryInstallCommand);
}
