import type { Command } from "../../core/cli";
import { listRemoteKits } from "../../core/registry";
import log from "../../core/log";

export const registryListCommand: Command = {
  name: "registry",
  subcommand: "list",
  description: "List available kits from the remote registry",
  instructions: "Usage: skani registry list",
  run: async () => {
    log.single.info("REGISTRY", "Fetching kits from skani.mackenziebowes.com...");

    try {
      const kits = await listRemoteKits();

      if (kits.length === 0) {
        log.single.info("REGISTRY", "No kits available");
        return;
      }

      log.single.info("REGISTRY", `Found ${kits.length} kit(s)`);

      for (const kit of kits) {
        log.single.info("", `• ${kit.name} (v${kit.version}, ${kit.skillCount} skills)`);
      }
    } catch (error) {
      log.single.err("REGISTRY", error instanceof Error ? error.message : "Failed to fetch kits");
      process.exit(1);
    }
  },
};
