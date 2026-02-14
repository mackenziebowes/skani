import { describe, test, expect } from "bun:test";
import { parseSkillRef } from "./github";

describe("parseSkillRef", () => {
	describe("valid URLs", () => {
		test("parses tree URL with full path", () => {
			const result = parseSkillRef("https://github.com/owner/repo/tree/main/.claude/skills/foo");
			
			expect(result).not.toBeNull();
			expect(result!.owner).toBe("owner");
			expect(result!.repo).toBe("repo");
			expect(result!.ref).toBe("main");
			expect(result!.path).toBe(".claude/skills/foo");
			expect(result!.skillId).toBe("owner-repo-foo");
			expect(result!.url).toBe("https://github.com/owner/repo/tree/main/.claude/skills/foo");
		});

		test("parses tree URL with version tag", () => {
			const result = parseSkillRef("https://github.com/owner/repo/tree/v1.2.0/skills/bar");
			
			expect(result).not.toBeNull();
			expect(result!.ref).toBe("v1.2.0");
			expect(result!.path).toBe("skills/bar");
			expect(result!.skillId).toBe("owner-repo-bar");
		});

		test("parses blob URL and extracts directory", () => {
			const result = parseSkillRef("https://github.com/owner/repo/blob/main/skills/baz/SKILL.md");
			
			expect(result).not.toBeNull();
			expect(result!.path).toBe("skills/baz");
			expect(result!.skillId).toBe("owner-repo-baz");
		});

		test("parses URL with @version override", () => {
			const result = parseSkillRef("https://github.com/owner/repo/tree/main/skills/foo@v2.0.0");
			
			expect(result).not.toBeNull();
			expect(result!.ref).toBe("v2.0.0");
		});

		test("parses www.github.com URL", () => {
			const result = parseSkillRef("https://www.github.com/owner/repo/tree/main/skills/test");
			
			expect(result).not.toBeNull();
			expect(result!.owner).toBe("owner");
		});

		test("handles hyphenated names", () => {
			const result = parseSkillRef("https://github.com/my-org/my-awesome-repo/tree/main/skills/my-cool-skill");
			
			expect(result).not.toBeNull();
			expect(result!.owner).toBe("my-org");
			expect(result!.repo).toBe("my-awesome-repo");
			expect(result!.skillId).toBe("my-org-my-awesome-repo-my-cool-skill");
		});
	});

	describe("invalid URLs", () => {
		test("rejects old owner/repo format", () => {
			expect(parseSkillRef("owner/repo")).toBeNull();
		});

		test("rejects old owner/repo@version format", () => {
			expect(parseSkillRef("owner/repo@v1.0.0")).toBeNull();
		});

		test("rejects old github: prefix format", () => {
			expect(parseSkillRef("github:owner/repo/skills/foo")).toBeNull();
		});

		test("rejects URL without path", () => {
			expect(parseSkillRef("https://github.com/owner/repo")).toBeNull();
		});

		test("rejects non-GitHub URL", () => {
			expect(parseSkillRef("https://gitlab.com/owner/repo/tree/main/skills/foo")).toBeNull();
		});

		test("rejects URL without tree or blob", () => {
			expect(parseSkillRef("https://github.com/owner/repo/main/skills/foo")).toBeNull();
		});

		test("rejects URL with insufficient path segments", () => {
			expect(parseSkillRef("https://github.com/owner/repo/tree/main")).toBeNull();
		});

		test("rejects empty string", () => {
			expect(parseSkillRef("")).toBeNull();
		});

		test("rejects random string", () => {
			expect(parseSkillRef("not-a-url")).toBeNull();
		});
	});

	describe("skillId generation", () => {
		test("generates lowercase skillId", () => {
			const result = parseSkillRef("https://github.com/MyOrg/MyRepo/tree/main/skills/MySkill");
			
			expect(result).not.toBeNull();
			expect(result!.skillId).toBe("myorg-myrepo-myskill");
		});

		test("includes final path segment in skillId", () => {
			const result = parseSkillRef("https://github.com/vercel/skills/tree/main/.claude/skills/react");
			
			expect(result).not.toBeNull();
			expect(result!.skillId).toBe("vercel-skills-react");
		});

		test("different repos with same skill name get different IDs", () => {
			const result1 = parseSkillRef("https://github.com/vercel/skills/tree/main/.claude/skills/react");
			const result2 = parseSkillRef("https://github.com/facebook/skills/tree/main/.claude/skills/react");
			
			expect(result1!.skillId).toBe("vercel-skills-react");
			expect(result2!.skillId).toBe("facebook-skills-react");
			expect(result1!.skillId).not.toBe(result2!.skillId);
		});

		test("same repo with different skills get different IDs", () => {
			const result1 = parseSkillRef("https://github.com/vercel/skills/tree/main/.claude/skills/react");
			const result2 = parseSkillRef("https://github.com/vercel/skills/tree/main/.claude/skills/nextjs");
			
			expect(result1!.skillId).toBe("vercel-skills-react");
			expect(result2!.skillId).toBe("vercel-skills-nextjs");
			expect(result1!.skillId).not.toBe(result2!.skillId);
		});
	});
});
