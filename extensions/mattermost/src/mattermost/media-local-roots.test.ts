import os from "node:os";
import path from "node:path";
import type { OpenClawConfig } from "openclaw/plugin-sdk";
import { afterEach, describe, expect, it } from "vitest";
import { resolveMattermostMediaLocalRoots } from "./media-local-roots.js";

const originalProfile = process.env.OPENCLAW_PROFILE;

afterEach(() => {
  if (originalProfile === undefined) {
    delete process.env.OPENCLAW_PROFILE;
  } else {
    process.env.OPENCLAW_PROFILE = originalProfile;
  }
});

describe("resolveMattermostMediaLocalRoots", () => {
  it("includes agent-scoped state roots and configured workspaces", () => {
    const cfg = {
      agents: {
        defaults: { workspace: "~/default-workspace" },
        list: [{ id: "ui", workspace: "~/team-ui" }],
      },
    } as OpenClawConfig;

    const roots = resolveMattermostMediaLocalRoots({
      cfg,
      agentId: "ui",
      stateDir: "/tmp/openclaw-state",
    });

    expect(roots).toEqual(
      expect.arrayContaining([
        "/tmp/openclaw-state/workspace-ui",
        "/tmp/openclaw-state/media",
        path.join(os.homedir(), "team-ui"),
        path.join(os.homedir(), "default-workspace"),
      ]),
    );
  });

  it("adds profile workspace when OPENCLAW_PROFILE is set", () => {
    process.env.OPENCLAW_PROFILE = "dev";
    const roots = resolveMattermostMediaLocalRoots({ cfg: {} as OpenClawConfig, agentId: "ui" });

    expect(roots).toContain(path.join(os.homedir(), ".openclaw", "workspace-dev"));
  });
});
