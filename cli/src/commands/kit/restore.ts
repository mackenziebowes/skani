import type { Command } from "../../core/cli";
import { readSkaniFile, writeSkaniFile } from "../../core/skani-file";
import { restoreFromBackup, clearSkillsDir } from "../../core/kit-utils";
import { installSkillFiles } from "../../core/skill-fetcher";
import log from "../../core/log";

export const kitRestoreCommand: Command = {
  name: "kit",
  subcommand: "restore",
  description: "Restore skani.json from most recent backup",
  instructions: "Usage: skani kit restore",
  run: async () => {
    const backupFile = "previous.skani.json";
    
    // Check if backup exists
    const exists = await Bun.file(backupFile).exists();
    if (!exists) {
      log.single.err("KIT RESTORE", "No backup found - nothing to restore");
      process.exit(1);
    }
    
    log.single.info("KIT RESTORE", `Restoring from ${backupFile}...`);
    
    // Restore backup
    await restoreFromBackup();
    
    // Read restored file
    const skaniFile = await readSkaniFile();
    if (!skaniFile) {
      log.single.err("KIT RESTORE", "Failed to read restored file");
      process.exit(1);
    }
    
    // Clear skills dir
    log.single.info("CLEAR", "Clearing skills directory");
    await clearSkillsDir();
    
    // Reinstall skills
    for (const skill of skaniFile.skills) {
      log.single.info("INSTALL", `Installing ${skill.name} (${skill.version})...`);
      await installSkillFiles(skill.source, skill.id);
    }
    
    log.multi.info([
      { t: "KIT RESTORE", m: `Restored ${skaniFile.skills.length} skill(s)` },
    ]);
  },
};
