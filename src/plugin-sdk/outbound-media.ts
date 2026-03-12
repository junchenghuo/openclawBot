import fs from "node:fs/promises";
import path from "node:path";
import { loadWebMedia } from "../web/media.js";

export type OutboundMediaLoadOptions = {
  maxBytes?: number;
  mediaLocalRoots?: readonly string[];
};

const HTTP_URL_RE = /^https?:\/\//i;
const WINDOWS_DRIVE_RE = /^[a-zA-Z]:[\\/]/;
const URL_SCHEME_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

function isRelativeLocalPath(value: string): boolean {
  if (!value || value.startsWith("~") || path.isAbsolute(value)) {
    return false;
  }
  if (HTTP_URL_RE.test(value) || value.startsWith("file://")) {
    return false;
  }
  if (WINDOWS_DRIVE_RE.test(value)) {
    return false;
  }
  return !URL_SCHEME_RE.test(value);
}

async function resolveMediaPathAgainstRoots(
  mediaUrl: string,
  mediaLocalRoots: readonly string[] | undefined,
): Promise<string> {
  const trimmed = mediaUrl.trim();
  if (!isRelativeLocalPath(trimmed) || !mediaLocalRoots?.length) {
    return trimmed;
  }

  for (const root of mediaLocalRoots) {
    const candidate = path.resolve(root, trimmed);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try the next root.
    }
  }

  return trimmed;
}

export async function loadOutboundMediaFromUrl(
  mediaUrl: string,
  options: OutboundMediaLoadOptions = {},
) {
  const resolvedUrl = await resolveMediaPathAgainstRoots(mediaUrl, options.mediaLocalRoots);
  return await loadWebMedia(resolvedUrl, {
    maxBytes: options.maxBytes,
    localRoots: options.mediaLocalRoots,
  });
}
