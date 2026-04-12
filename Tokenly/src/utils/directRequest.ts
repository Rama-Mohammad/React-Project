<<<<<<< HEAD
const DIRECT_HELPER_PREFIX = "[[DIRECT_HELPER:";
const DIRECT_HELPER_NAME_PREFIX = "[[DIRECT_HELPER_NAME:";
const MARKER_SUFFIX = "]]";

export type DirectRequestMeta = {
  isDirectRequest: boolean;
  directHelperId?: string;
  directHelperName?: string;
  cleanDescription: string;
};

function extractMarkerValue(line: string, prefix: string) {
  if (!line.startsWith(prefix) || !line.endsWith(MARKER_SUFFIX)) return null;
  return line.slice(prefix.length, -MARKER_SUFFIX.length).trim() || null;
}
=======
const DIRECT_PREFIX = "[[DIRECT_HELPER:";
const DIRECT_SUFFIX = "]]";
>>>>>>> 89fe3be02781cde398abd56e6d9288485b38f2d8

export function buildDirectRequestDescription(
  helperId: string,
  helperName: string,
  description: string
<<<<<<< HEAD
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
=======
): string {
  return `${DIRECT_PREFIX}${helperId}${DIRECT_SUFFIX}:${helperName}\n${description.trim()}`;
}

// Parses the description to extract direct request metadata
export function parseDirectRequestDescription(description?: string | null): {
  isDirectRequest: boolean;
  helperId: string | null;
  directHelperName: string | null;
  actualDescription: string;
} {
  const empty = { isDirectRequest: false, helperId: null, directHelperName: null, actualDescription: description ?? "" };

  if (!description || !description.startsWith(DIRECT_PREFIX)) return empty;

  const closingIdx = description.indexOf(DIRECT_SUFFIX);
  if (closingIdx === -1) return empty;

  const helperId = description.slice(DIRECT_PREFIX.length, closingIdx);
  const rest = description.slice(closingIdx + DIRECT_SUFFIX.length);

  let directHelperName: string | null = null;
  let actualDescription = rest.trim();

  if (rest.startsWith(":")) {
    const newlineIdx = rest.indexOf("\n");
    if (newlineIdx !== -1) {
      directHelperName = rest.slice(1, newlineIdx).trim();
      actualDescription = rest.slice(newlineIdx + 1).trim();
    } else {
      directHelperName = rest.slice(1).trim();
      actualDescription = "";
    }
  }

  return { isDirectRequest: true, helperId, directHelperName, actualDescription };
}
>>>>>>> 89fe3be02781cde398abd56e6d9288485b38f2d8
