import type { Command } from "../../core/cli";
import { listKits } from "../../core/kit-utils";
import { stat } from "node:fs/promises";
import log from "../../core/log";

export const kitListCommand: Command = {
  name: "kit",
  subcommand: "list",
  description: "List all available kits in current directory",
  instructions: "Usage: skani kit list",
  run: async () => {
    const kits = await listKits();
    
    if (kits.length === 0) {
      log.single.info("KIT LIST", "No kits found in current directory");
      return;
    }
    
    log.single.info("KIT LIST", `Found ${kits.length} kit(s)`);
    
    for (const kit of kits) {
      const kitPath = kit;
      const stats = await stat(kitPath);
      const content = await Bun.file(kitPath).text();
      const kitData = JSON.parse(content);
      const skillCount = kitData.skills?.length || 0;
      const sizeKB = (stats.size / 1024).toFixed(1);
      
      log.single.info("", `• ${kit} (${skillCount} skills, ${sizeKB}KB)`);
    }
  },
};
