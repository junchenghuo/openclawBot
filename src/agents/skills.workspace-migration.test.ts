import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildWorkspaceSkillsPrompt } from "./skills.js";
import { writeSkill } from "./skills.test-helpers.js";

const tempDirs: string[] = [];

async function createTempDir(prefix: string) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0, tempDirs.length).map((dir) => fs.rm(dir, { recursive: true, force: true })),
  );
});

describe("buildWorkspaceSkillsPrompt legacy migration", () => {
  it("migrates workspace .agents/skills into workspace skills and removes legacy directory", async () => {
    const workspaceDir = await createTempDir("openclaw-workspace-");
    const managedDir = path.join(workspaceDir, ".managed");
    const bundledDir = path.join(workspaceDir, ".bundled");

    await writeSkill({
      dir: path.join(workspaceDir, ".agents", "skills", "legacy-skill"),
      name: "legacy-skill",
      description: "Legacy project skill",
    });

    const prompt = buildWorkspaceSkillsPrompt(workspaceDir, {
      managedSkillsDir: managedDir,
      bundledSkillsDir: bundledDir,
    });

    expect(prompt).toContain("legacy-skill");
    expect(prompt).toContain("Legacy project skill");

    await expect(
      fs.access(path.join(workspaceDir, "skills", "legacy-skill", "SKILL.md")),
    ).resolves.toBeUndefined();
    await expect(fs.access(path.join(workspaceDir, ".agents", "skills"))).rejects.toBeTruthy();
  });
});
