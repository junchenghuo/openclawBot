const MENTION_TOKEN_REGEX = /(^|[^a-z0-9._%+-])@([a-z0-9._-]{1,64})/gi;
const BROADCAST_MENTION_TOKENS = new Set(["all", "channel", "here"]);
const LEADER_AGENT_IDS = new Set(["leader", "pm"]);

function normalizeId(value: string | undefined | null): string {
  return (value ?? "").trim().toLowerCase();
}

export type MattermostMentionFlags = {
  hasAnyMention: boolean;
  hasBroadcastMention: boolean;
};

export function detectMattermostMentionFlags(text: string): MattermostMentionFlags {
  if (!text.trim()) {
    return {
      hasAnyMention: false,
      hasBroadcastMention: false,
    };
  }

  let hasAnyMention = false;
  let hasBroadcastMention = false;
  let match: RegExpExecArray | null;
  const regex = new RegExp(MENTION_TOKEN_REGEX.source, MENTION_TOKEN_REGEX.flags);

  while ((match = regex.exec(text)) !== null) {
    const token = normalizeId(match[2]);
    if (!token) {
      continue;
    }
    hasAnyMention = true;
    if (BROADCAST_MENTION_TOKENS.has(token)) {
      hasBroadcastMention = true;
    }
  }

  return {
    hasAnyMention,
    hasBroadcastMention,
  };
}

export function shouldLeaderHandleUnmentionedMessage(params: {
  isGroup: boolean;
  routeAgentId?: string | null;
  accountId?: string | null;
  hasAnyMention: boolean;
}): boolean {
  if (!params.isGroup || params.hasAnyMention) {
    return false;
  }

  const routeAgentId = normalizeId(params.routeAgentId);
  const accountId = normalizeId(params.accountId);
  return LEADER_AGENT_IDS.has(routeAgentId) || LEADER_AGENT_IDS.has(accountId);
}
