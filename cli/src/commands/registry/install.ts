import type { InstalledSkill, SkaniFile } from "../../types/skill";
import type { Command } from "../../core/cli";
import { getKitByName } from "../../core/registry";
import { readSkaniFile, writeSkaniFile } from "../../core/skani-file";
import { installSkillFiles } from "../../core/skill-fetcher";
import { backupSkaniFile, clearSkillsDir } from "../../core/kit-utils";
import log from "../../core/log";

export const registryInstallCommand: Command = {
  name: "registry",
  subcommand: "install",
  description: "Install a kit from the remote registry",
  instructions: "Usage: skani registry install <name> [--replace] [--refresh]",
  run: async (args: string[]) => {
    const kitName = args.find((a) => !a.startsWith("--"));
    const replaceFlag = args.includes("--replace");
    const refreshFlag = args.includes("--refresh");

    if (!kitName) {
      log.single.err("REGISTRY INSTALL", "No kit specified");
      log.single.info("USAGE", "skani registry install <name> [--replace]");
      process.exit(1);
    }

    log.single.info("REGISTRY", `Fetching kit "${kitName}" from skani.mackenziebowes.com...`);

    let kitData;
    try {
      kitData = await getKitByName(kitName);
    } catch (error) {
      log.single.err("REGISTRY", error instanceof Error ? error.message : "Failed to fetch kit");
      process.exit(1);
    }

    log.single.info("REGISTRY INSTALL", `Installing ${kitData.skills.length} skill(s)...`);

    if (replaceFlag) {
      log.single.info("BACKUP", "Backing up skani.json to previous.skani.json");
      await backupSkaniFile();

      log.single.info("CLEAR", "Clearing skills directory");
      await clearSkillsDir();
    } else {
      const existing = await readSkaniFile();
      if (existing) {
        const existingIds = new Set(existing.skills.map((s) => s.id));
        kitData.skills = kitData.skills.filter((s) => !existingIds.has(s.id));
      }
    }

    let successCount = 0;
    let failCount = 0;
    let cacheCount = 0;
    let registryCount = 0;
    let githubCount = 0;

    for (const skill of kitData.skills) {
      log.single.info("INSTALL", `Installing ${skill.id}...`);

      const result = await installSkillFiles(skill.source, skill.id, process.cwd(), { refresh: refreshFlag });

      if (result.success) {
        successCount++;
        if (result.source === "cache") {
          cacheCount++;
        } else if (result.source === "registry") {
          registryCount++;
        } else {
          githubCount++;
        }
      } else {
        log.single.err("FAILED", `${skill.id}: ${result.error}`);
        failCount++;
      }
    }

    if (replaceFlag) {
      await writeSkaniFile({
        version: kitData.version,
        environment: kitData.environment,
        skills: kitData.skills,
      } as SkaniFile);
    } else {
      const existing = await readSkaniFile();
      if (existing) {
        for (const skill of kitData.skills) {
          existing.skills.push(skill as InstalledSkill);
        }
        await writeSkaniFile(existing);
      }
    }

    log.multi.info([
      { t: "REGISTRY COMPLETE", m: `Installed ${successCount} skill(s)` },
      ...(cacheCount > 0 ? [{ t: "CACHE", m: `${cacheCount} from cache` }] : []),
      ...(registryCount > 0 ? [{ t: "MIRRORED", m: `${registryCount} from registry` }] : []),
      ...(githubCount > 0 ? [{ t: "GITHUB", m: `${githubCount} from GitHub` }] : []),
      ...(failCount > 0 ? [{ t: "FAILED", m: `${failCount} skill(s) failed` }] : []),
    ]);
  },
};
