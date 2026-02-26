import { describe, test, expect, afterEach } from "bun:test";
import { getCacheRoot, getSkillCachePath, getKitCachePath, ensureCacheDir, isSkillCached, cacheSkill, getCachedSkillFiles, cacheKitManifest, getCachedKitManifest } from "./cache";
import { homedir } from "node:os";
import { join } from "node:path";
import { rmSync, existsSync } from "node:fs";

describe("cache utilities", () => {
  test("getCacheRoot returns ~/.skani path", () => {
    const expected = join(homedir(), ".skani");
    expect(getCacheRoot()).toBe(expected);
  });

  test("getSkillCachePath returns skill cache path", () => {
    const expected = join(homedir(), ".skani", "registry", "skill", "my-skill");
    expect(getSkillCachePath("my-skill")).toBe(expected);
  });

  test("getKitCachePath returns kit manifest path", () => {
    const expected = join(homedir(), ".skani", "registry", "kit", "my-kit.json");
    expect(getKitCachePath("my-kit")).toBe(expected);
  });
});

describe("cache skill operations", () => {
  const testCacheDir = join(process.cwd(), ".test-cache-ops");

  afterEach(() => {
    rmSync(testCacheDir, { recursive: true, force: true });
  });

  test("isSkillCached returns false when skill not in cache", async () => {
    const result = await isSkillCached("nonexistent-skill", testCacheDir);
    expect(result).toBe(false);
  });

  test("cacheSkill stores skill files in cache", async () => {
    const files = new Map([
      ["SKILL.md", "# Test Skill"],
      ["extra.md", "# Extra content"],
    ]);
    
    await cacheSkill("test-skill", files, testCacheDir);
    
    const skillPath = join(testCacheDir, "registry", "skill", "test-skill");
    expect(existsSync(join(skillPath, "SKILL.md"))).toBe(true);
    expect(existsSync(join(skillPath, "extra.md"))).toBe(true);
  });

  test("isSkillCached returns true when skill exists in cache", async () => {
    const files = new Map([["SKILL.md", "# Test Skill"]]);
    await cacheSkill("cached-skill", files, testCacheDir);
    
    const result = await isSkillCached("cached-skill", testCacheDir);
    expect(result).toBe(true);
  });

  test("getCachedSkillFiles returns files from cache", async () => {
    const files = new Map([
      ["SKILL.md", "# Test Skill"],
      ["extra.md", "# Extra"],
    ]);
    await cacheSkill("read-skill", files, testCacheDir);
    
    const result = await getCachedSkillFiles("read-skill", testCacheDir);
    
    expect(result).not.toBeNull();
    expect(result?.get("SKILL.md")).toBe("# Test Skill");
    expect(result?.get("extra.md")).toBe("# Extra");
  });
});

describe("cache kit operations", () => {
  const testCacheDir = join(process.cwd(), ".test-cache-kit");

  afterEach(() => {
    rmSync(testCacheDir, { recursive: true, force: true });
  });

  test("cacheKitManifest stores kit manifest", async () => {
    const manifest = {
      name: "test-kit",
      version: "1.0.0",
      skills: [{ id: "skill-1" }, { id: "skill-2" }],
    };
    
    await cacheKitManifest("test-kit", manifest, testCacheDir);
    
    const kitPath = join(testCacheDir, "registry", "kit", "test-kit.json");
    expect(existsSync(kitPath)).toBe(true);
  });

  test("getCachedKitManifest returns cached manifest", async () => {
    const manifest = {
      name: "read-kit",
      version: "2.0.0",
      skills: [{ id: "skill-a" }],
    };
    
    await cacheKitManifest("read-kit", manifest, testCacheDir);
    const result = await getCachedKitManifest("read-kit", testCacheDir);
    
    expect(result).not.toBeNull();
    expect(result?.name).toBe("read-kit");
    expect(result?.version).toBe("2.0.0");
  });
});
