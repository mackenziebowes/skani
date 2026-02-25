import { registerCommand } from "../../core/cli";
import { registryListCommand } from "./list";
import { registryInstallCommand } from "./install";
import { registryMirrorCommand } from "./mirror";

export function registerRegistryCommands() {
  registerCommand(registryListCommand);
  registerCommand(registryInstallCommand);
  registerCommand(registryMirrorCommand);
}
