/**
 * Automatically attaches the referral parameter '?ref=icpc-apac' to sponsor URLs
 * while preserving any existing query parameters.
 */
export function getSponsorUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("ref")) {
      parsed.searchParams.set("ref", "icpc-apac");
    }
    return parsed.toString();
  } catch {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}ref=icpc-apac`;
  }
}
