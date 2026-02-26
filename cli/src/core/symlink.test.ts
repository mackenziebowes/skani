import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { join } from "node:path";
import { mkdirSync, rmSync, existsSync, lstatSync } from "node:fs";
import { createSymlink, createSymlinksForSkill, removeSymlinks } from "./symlink";

describe("symlink utilities", () => {
  const testDir = join(process.cwd(), ".test-symlink");
  const cacheDir = join(testDir, "cache");
  const projectDir = join(testDir, "project");

  beforeEach(() => {
    mkdirSync(join(cacheDir, "test-skill"), { recursive: true });
    mkdirSync(join(projectDir, ".claude", "skills"), { recursive: true });
    Bun.write(join(cacheDir, "test-skill", "SKILL.md"), "# Test Skill");
    Bun.write(join(cacheDir, "test-skill", "extra.md"), "# Extra");
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  test("createSymlink creates a symlink from target to source", async () => {
    const target = join(projectDir, ".claude", "skills", "test-skill", "SKILL.md");
    const source = join(cacheDir, "test-skill", "SKILL.md");
    
    await createSymlink(source, target);
    
    expect(existsSync(target)).toBe(true);
    expect(lstatSync(target).isSymbolicLink()).toBe(true);
  });

  test("createSymlinksForSkill creates symlinks for all files in skill", async () => {
    const cacheSkillPath = join(cacheDir, "test-skill");
    const projectSkillPath = join(projectDir, ".claude", "skills", "test-skill");
    
    const count = await createSymlinksForSkill(cacheSkillPath, projectSkillPath);
    
    expect(count).toBe(2);
    expect(existsSync(join(projectSkillPath, "SKILL.md"))).toBe(true);
    expect(existsSync(join(projectSkillPath, "extra.md"))).toBe(true);
  });

  test("removeSymlinks removes all symlinks in directory", async () => {
    const cacheSkillPath = join(cacheDir, "test-skill");
    const projectSkillPath = join(projectDir, ".claude", "skills", "test-skill");
    
    await createSymlinksForSkill(cacheSkillPath, projectSkillPath);
    await removeSymlinks(projectSkillPath);
    
    expect(existsSync(join(projectSkillPath, "SKILL.md"))).toBe(false);
    expect(existsSync(join(projectSkillPath, "extra.md"))).toBe(false);
  });
});
