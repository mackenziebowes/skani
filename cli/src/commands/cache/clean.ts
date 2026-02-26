import type { Command } from "../../core/cli";
import { getCacheRoot } from "../../core/cache";
import log from "../../core/log";

export const cacheCleanCommand: Command = {
  name: "cache",
  subcommand: "clean",
  description: "Clear the global skill cache",
  instructions: "Usage: skani cache clean",
  run: async () => {
    const cacheRoot = getCacheRoot();
    
    log.single.info("CACHE", `Clearing ${cacheRoot}...`);
    
    const proc = Bun.spawn(["rm", "-rf", cacheRoot]);
    const exitCode = await proc.exited;
    
    if (exitCode === 0) {
      log.single.info("CLEAN", "Cache cleared successfully");
    } else {
      log.single.err("CLEAN", "Failed to clear cache");
      process.exit(1);
    }
  },
};
