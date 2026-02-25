import type { Command } from "../../core/cli";
import { readSkaniFile, writeSkaniFile } from "../../core/skani-file";
import { installSkillFiles } from "../../core/skill-fetcher";
import { backupSkaniFile, clearSkillsDir } from "../../core/kit-utils";
import log from "../../core/log";

export const kitInstallCommand: Command = {
  name: "kit",
  subcommand: "install",
  description: "Install skills from a kit file",
  instructions: "Usage: skani kit install <name> [--replace]",
  run: async (args: string[]) => {
    const kitName = args[0];
    const replaceFlag = args.includes('--replace');
    
    if (!kitName) {
      log.single.err("KIT INSTALL", "No kit specified");
      log.single.info("USAGE", "skani kit install <name> [--replace]");
      process.exit(1);
    }
    
    const kitFile = `${kitName}.skani.json`;
    
    // Validate kit file exists
    const exists = await Bun.file(kitFile).exists();
    if (!exists) {
      log.single.err("KIT INSTALL", `Kit file not found: ${kitFile}`);
      process.exit(1);
    }
    
    // Read kit file
    const content = await Bun.file(kitFile).text();
    const kitData = JSON.parse(content);
    
    // Validate kit structure
    if (!kitData.skills || !Array.isArray(kitData.skills)) {
      log.single.err("KIT INSTALL", "Invalid kit structure: missing skills array");
      process.exit(1);
    }
    
    log.single.info("KIT INSTALL", `Installing from ${kitFile}...`);
    
    // Replace mode: backup and clear
    if (replaceFlag) {
      log.single.info("BACKUP", "Backing up skani.json to previous.skani.json");
      await backupSkaniFile();
      
      log.single.info("CLEAR", "Clearing skills directory");
      await clearSkillsDir();
    } else {
      // Merge mode: read existing
      const existing = await readSkaniFile();
      if (existing) {
        // Filter out already installed skills
        const existingIds = new Set(existing.skills.map(s => s.id));
        kitData.skills = kitData.skills.filter((s: any) => !existingIds.has(s.id));
      }
    }
    
    // Install skills
    let successCount = 0;
    let failCount = 0;
    let registryCount = 0;
    let githubCount = 0;
    
    for (const skill of kitData.skills) {
      log.single.info("INSTALL", `Installing ${skill.name} (${skill.version})...`);
      
      const result = await installSkillFiles(skill.source, skill.id);
      
      if (result.success) {
        successCount++;
        if (result.source === "registry") {
          registryCount++;
        } else {
          githubCount++;
        }
      } else {
        log.single.err("FAILED", `${skill.name}: ${result.error}`);
        failCount++;
      }
    }
    
    // Write new skani.json
    if (replaceFlag) {
      await writeSkaniFile({
        version: kitData.version,
        environment: kitData.environment,
        skills: kitData.skills,
      });
    } else {
      // Merge into existing
      const existing = await readSkaniFile();
      if (existing) {
        for (const skill of kitData.skills) {
          existing.skills.push(skill);
        }
        await writeSkaniFile(existing);
      }
    }
    
    log.multi.info([
      { t: "KIT COMPLETE", m: `Installed ${successCount} skill(s)` },
      ...(registryCount > 0 ? [{ t: "MIRRORED", m: `${registryCount} from registry` }] : []),
      ...(githubCount > 0 ? [{ t: "GITHUB", m: `${githubCount} from GitHub` }] : []),
      ...(failCount > 0 ? [{ t: "FAILED", m: `${failCount} skill(s) failed` }] : []),
    ]);
  },
};
