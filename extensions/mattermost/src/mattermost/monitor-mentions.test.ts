import { describe, expect, it } from "vitest";
import {
  detectMattermostMentionFlags,
  shouldLeaderHandleUnmentionedMessage,
} from "./monitor-mentions.js";

describe("mattermost mention flags", () => {
  it("detects direct @username mentions", () => {
    expect(detectMattermostMentionFlags("请 @bot-fe 看下这个问题")).toEqual({
      hasAnyMention: true,
      hasBroadcastMention: false,
    });
  });

  it("detects broadcast mentions for @all/@channel/@here", () => {
    expect(detectMattermostMentionFlags("@all 看下"))
      .toEqual({ hasAnyMention: true, hasBroadcastMention: true });
    expect(detectMattermostMentionFlags("@channel 看下"))
      .toEqual({ hasAnyMention: true, hasBroadcastMention: true });
    expect(detectMattermostMentionFlags("@here 看下"))
      .toEqual({ hasAnyMention: true, hasBroadcastMention: true });
  });

  it("detects broadcast mention without whitespace prefix", () => {
    expect(detectMattermostMentionFlags("请@all 同步进度")).toEqual({
      hasAnyMention: true,
      hasBroadcastMention: true,
    });
  });

  it("does not treat email addresses as mentions", () => {
    expect(detectMattermostMentionFlags("联系 test@example.com")).toEqual({
      hasAnyMention: false,
      hasBroadcastMention: false,
    });
  });
});

describe("leader fallback routing", () => {
  it("allows leader fallback in groups when no mentions exist", () => {
    expect(
      shouldLeaderHandleUnmentionedMessage({
        isGroup: true,
        routeAgentId: "pm",
        accountId: "pm",
        hasAnyMention: false,
      }),
    ).toBe(true);
  });

  it("blocks leader fallback when any mention exists", () => {
    expect(
      shouldLeaderHandleUnmentionedMessage({
        isGroup: true,
        routeAgentId: "pm",
        accountId: "pm",
        hasAnyMention: true,
      }),
    ).toBe(false);
  });

  it("does not enable fallback for non-leader agents", () => {
    expect(
      shouldLeaderHandleUnmentionedMessage({
        isGroup: true,
        routeAgentId: "fe",
        accountId: "fe",
        hasAnyMention: false,
      }),
    ).toBe(false);
  });
});
