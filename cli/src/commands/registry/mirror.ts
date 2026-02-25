import type { Command } from "../../core/cli";
import { fetchSkillFiles } from "../../core/github";
import type { SkillSource } from "../../types/skill";
import log from "../../core/log";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join, dirname, resolve } from "path";

function findProjectRoot(startDir: string): string | null {
  let dir = startDir;
  const marker = "app/client/lib/data/kits/index.ts";
  
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, marker))) {
      return dir;
    }
    dir = dirname(dir);
  }
  
  if (existsSync(join(dir, marker))) {
    return dir;
  }
  
  return null;
}

export const registryMirrorCommand: Command = {
  name: "registry",
  subcommand: "mirror",
  description: "Mirror skill files from GitHub to local registry data",
  instructions: "Usage: skani registry mirror <kit-name> [--output <dir>]",
  run: async (args: string[]) => {
    const kitName = args[0];
    const outputIndex = args.indexOf("--output");
    const outputDir = outputIndex !== -1 ? args[outputIndex + 1] : null;
    
    if (!kitName) {
      log.single.err("REGISTRY MIRROR", "No kit specified");
      log.single.info("USAGE", "skani registry mirror <kit-name> [--output <dir>]");
      process.exit(1);
    }
    
    log.single.info("REGISTRY MIRROR", `Mirroring skills from kit "${kitName}"...`);
    
    const projectRoot = findProjectRoot(process.cwd());
    
    if (!projectRoot) {
      log.single.err("REGISTRY MIRROR", "Could not find project root (looking for app/client/lib/data/kits/)");
      process.exit(1);
    }
    
    const kitDataPath = join(projectRoot, `app/client/lib/data/kits/${kitName}.ts`);
    
    if (!existsSync(kitDataPath)) {
      log.single.err("REGISTRY MIRROR", `Kit file not found: app/client/lib/data/kits/${kitName}.ts`);
      process.exit(1);
    }
    
    const kitContent = readFileSync(kitDataPath, "utf-8");
    const skillsMatch = kitContent.match(/skills:\s*\[([\s\S]*?)\n\s*\]/);
    
    if (!skillsMatch || !skillsMatch[1]) {
      log.single.err("REGISTRY MIRROR", "Could not parse skills from kit");
      process.exit(1);
    }
    
    const skillsContent = skillsMatch[1];
    const idMatches = [...skillsContent.matchAll(/id:\s*["']([^"']+)["']/g)];
    const sourceMatches = [...skillsContent.matchAll(/source:\s*\{([^}]+)\}/g)];
    
    const skills: Array<{ id: string; source: SkillSource }> = [];
    
    for (let i = 0; i < idMatches.length; i++) {
      const id = idMatches[i]?.[1];
      const sourceBlock = sourceMatches[i]?.[1];
      
      if (!id || !sourceBlock) continue;
      
      const ownerMatch = sourceBlock.match(/owner:\s*["']([^"']+)["']/);
      const repoMatch = sourceBlock.match(/repo:\s*["']([^"']+)["']/);
      const refMatch = sourceBlock.match(/ref:\s*["']([^"']+)["']/);
      const pathMatch = sourceBlock.match(/path:\s*["']([^"']+)["']/);
      
      if (ownerMatch?.[1] && repoMatch?.[1] && refMatch?.[1] && pathMatch?.[1]) {
        skills.push({
          id,
          source: {
            url: "",
            type: "github",
            owner: ownerMatch[1],
            repo: repoMatch[1],
            ref: refMatch[1],
            path: pathMatch[1],
          },
        });
      }
    }
    
    const mirroredSkills: Record<string, any> = {};
    const targetDir = outputDir || join(projectRoot, "app/client/lib/data/mirrored-skills");
    
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }
    
    for (const skill of skills) {
      log.single.info("FETCHING", `${skill.id}...`);
      
      try {
        const files = await fetchSkillFiles(skill.source);
        
        const filesObj: Record<string, string> = {};
        for (const [path, content] of files) {
          filesObj[path] = content;
        }
        
        mirroredSkills[skill.id] = {
          id: skill.id,
          source: {
            owner: skill.source.owner,
            repo: skill.source.repo,
            ref: skill.source.ref,
            path: skill.source.path,
          },
          files: filesObj,
          mirroredAt: new Date().toISOString(),
        };
        
        log.single.info("SUCCESS", `${skill.id} (${files.size} files)`);
      } catch (error) {
        log.single.err("FAILED", `${skill.id}: ${error}`);
      }
    }
    
    const outputPath = join(targetDir, `${kitName}.json`);
    writeFileSync(outputPath, JSON.stringify(mirroredSkills, null, 2));
    
    log.multi.info([
      { t: "COMPLETE", m: `Mirrored ${Object.keys(mirroredSkills).length} skills` },
      { t: "OUTPUT", m: outputPath },
    ]);
    
    log.single.info("NEXT", "Update app/client/lib/data/mirrored-skills/index.ts to import this file");
  },
};
