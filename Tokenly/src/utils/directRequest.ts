import type { DirectRequestMeta } from "../types/directRequest";

const DIRECT_HELPER_PREFIX = "[[DIRECT_HELPER:";
const DIRECT_HELPER_NAME_PREFIX = "[[DIRECT_HELPER_NAME:";
const MARKER_SUFFIX = "]]";

function extractMarkerValue(line: string, prefix: string) {
  if (!line.startsWith(prefix) || !line.endsWith(MARKER_SUFFIX)) return null;
  return line.slice(prefix.length, -MARKER_SUFFIX.length).trim() || null;
}

export function buildDirectRequestDescription(
  helperId: string,
  helperName: string,
  description: string
) {
  return [
    `${DIRECT_HELPER_PREFIX}${helperId}${MARKER_SUFFIX}`,
    `${DIRECT_HELPER_NAME_PREFIX}${helperName}${MARKER_SUFFIX}`,
    "",
    description.trim(),
  ].join("\n");
}

export function parseDirectRequestDescription(description?: string | null): DirectRequestMeta {
  const rawDescription = description ?? "";
  const lines = rawDescription.split("\n");
  const helperId = extractMarkerValue(lines[0] ?? "", DIRECT_HELPER_PREFIX);
  const helperName = extractMarkerValue(lines[1] ?? "", DIRECT_HELPER_NAME_PREFIX);
  const isDirectRequest = Boolean(helperId);

  if (!isDirectRequest) {
    return {
      isDirectRequest: false,
      cleanDescription: rawDescription.trim(),
    };
  }

  return {
    isDirectRequest: true,
    directHelperId: helperId ?? undefined,
    directHelperName: helperName ?? undefined,
    cleanDescription: lines.slice(2).join("\n").trim(),
  };
}
