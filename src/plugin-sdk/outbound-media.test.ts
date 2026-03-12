import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadOutboundMediaFromUrl } from "./outbound-media.js";

const loadWebMediaMock = vi.hoisted(() => vi.fn());
const accessMock = vi.hoisted(() => vi.fn());

vi.mock("node:fs/promises", () => ({
  default: {
    access: accessMock,
  },
}));

vi.mock("../web/media.js", () => ({
  loadWebMedia: loadWebMediaMock,
}));

describe("loadOutboundMediaFromUrl", () => {
  beforeEach(() => {
    loadWebMediaMock.mockReset();
    accessMock.mockReset();
  });

  it("forwards maxBytes and mediaLocalRoots to loadWebMedia", async () => {
    accessMock.mockResolvedValue(undefined);
    loadWebMediaMock.mockResolvedValueOnce({
      buffer: Buffer.from("x"),
      kind: "image",
      contentType: "image/png",
    });

    await loadOutboundMediaFromUrl("file:///tmp/image.png", {
      maxBytes: 1024,
      mediaLocalRoots: ["/tmp/workspace-agent"],
    });

    expect(loadWebMediaMock).toHaveBeenCalledWith("file:///tmp/image.png", {
      maxBytes: 1024,
      localRoots: ["/tmp/workspace-agent"],
    });
  });

  it("keeps options optional", async () => {
    loadWebMediaMock.mockResolvedValueOnce({
      buffer: Buffer.from("x"),
      kind: "image",
      contentType: "image/png",
    });

    await loadOutboundMediaFromUrl("https://example.com/image.png");

    expect(loadWebMediaMock).toHaveBeenCalledWith("https://example.com/image.png", {
      maxBytes: undefined,
      localRoots: undefined,
    });
  });

  it("resolves relative local paths against mediaLocalRoots", async () => {
    const roots = ["/tmp/root-a", "/tmp/root-b"];
    accessMock.mockRejectedValueOnce(new Error("not found")).mockResolvedValueOnce(undefined);
    loadWebMediaMock.mockResolvedValueOnce({
      buffer: Buffer.from("x"),
      kind: "image",
      contentType: "image/png",
    });

    await loadOutboundMediaFromUrl("./output/im-files/wireframe.png", {
      mediaLocalRoots: roots,
    });

    expect(loadWebMediaMock).toHaveBeenCalledWith(
      path.resolve(roots[1], "./output/im-files/wireframe.png"),
      {
        maxBytes: undefined,
        localRoots: roots,
      },
    );
  });

  it("does not rewrite http urls", async () => {
    loadWebMediaMock.mockResolvedValueOnce({
      buffer: Buffer.from("x"),
      kind: "image",
      contentType: "image/png",
    });

    await loadOutboundMediaFromUrl("https://example.com/image.png", {
      mediaLocalRoots: ["/tmp/root-a"],
    });

    expect(accessMock).not.toHaveBeenCalled();
    expect(loadWebMediaMock).toHaveBeenCalledWith("https://example.com/image.png", {
      maxBytes: undefined,
      localRoots: ["/tmp/root-a"],
    });
  });

  it("keeps original relative path when roots do not contain the file", async () => {
    accessMock.mockRejectedValue(new Error("not found"));
    loadWebMediaMock.mockResolvedValueOnce({
      buffer: Buffer.from("x"),
      kind: "image",
      contentType: "image/png",
    });

    await loadOutboundMediaFromUrl("./output/im-files/wireframe.png", {
      mediaLocalRoots: ["/tmp/root-a", "/tmp/root-b"],
    });

    expect(loadWebMediaMock).toHaveBeenCalledWith("./output/im-files/wireframe.png", {
      maxBytes: undefined,
      localRoots: ["/tmp/root-a", "/tmp/root-b"],
    });
  });
});
