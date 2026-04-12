const DIRECT_PREFIX = "[[DIRECT_HELPER:";
const DIRECT_SUFFIX = "]]";

export function buildDirectRequestDescription(
  helperId: string,
  helperName: string,
  description: string
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