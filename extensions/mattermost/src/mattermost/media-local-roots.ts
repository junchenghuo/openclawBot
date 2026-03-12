import os from "node:os";
import path from "node:path";
import {
  normalizeAgentId,
  resolvePreferredOpenClawTmpDir,
  type OpenClawConfig,
} from "openclaw/plugin-sdk";

function resolveUserPath(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed === "~") {
    return os.homedir();
  }
  if (trimmed.startsWith("~/")) {
    return path.join(os.homedir(), trimmed.slice(2));
  }
  return path.resolve(trimmed);
}

export function resolveMattermostMediaLocalRoots(params: {
  cfg: OpenClawConfig;
  agentId?: string;
  stateDir?: string;
}): readonly string[] {
  const normalizedAgentId = normalizeAgentId(params.agentId ?? "main");
  const stateDir = params.stateDir?.trim() || path.join(os.homedir(), ".openclaw");
  const roots = new Set<string>([
    resolvePreferredOpenClawTmpDir(),
    path.join(stateDir, "media"),
    path.join(stateDir, "agents"),
    path.join(stateDir, "workspace"),
    path.join(stateDir, "sandboxes"),
    path.join(stateDir, `workspace-${normalizedAgentId}`),
  ]);

  const agentList = Array.isArray(params.cfg.agents?.list) ? params.cfg.agents.list : [];
  const matchedAgent = agentList.find(
    (entry) => normalizeAgentId(String(entry?.id ?? "")) === normalizedAgentId,
  );
  if (typeof matchedAgent?.workspace === "string" && matchedAgent.workspace.trim()) {
    roots.add(resolveUserPath(matchedAgent.workspace));
  }

  const defaultsWorkspace = params.cfg.agents?.defaults?.workspace;
  if (typeof defaultsWorkspace === "string" && defaultsWorkspace.trim()) {
    roots.add(resolveUserPath(defaultsWorkspace));
  }

  roots.add(path.join(os.homedir(), ".openclaw", "workspace"));
  const profile = process.env.OPENCLAW_PROFILE?.trim();
  if (profile && profile.toLowerCase() !== "default") {
    roots.add(path.join(os.homedir(), ".openclaw", `workspace-${profile}`));
  }

  return [...roots];
}
