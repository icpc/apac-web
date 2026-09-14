import diff from 'html-diff-ts';

/**
 * Compares two HTML strings, detecting changes in text and hyperlink URLs.
 * When a hyperlink's href attribute changes between versions, an inline badge
 * showing `(from-url → to-url)` is displayed next to the link.
 */
export function diffHtml(oldHtml: string, newHtml: string): string {
  const injectLinkTokens = (html: string): string => {
    return html.replace(
      /<a\s+([^>]*?)href=(["'])(.*?)\2([^>]*)>([\s\S]*?)<\/a>/gi,
      (match, pre, quote, href, post, text) => {
        const encodedHref = encodeURIComponent(href);
        return `<a ${pre}href=${quote}${href}${quote}${post}>${text}</a> <span class="diff-url-badge font-mono text-xs opacity-75">@@@LINK_URL:${encodedHref}@@@</span>`;
      }
    );
  };

  const rawDiff = diff(injectLinkTokens(oldHtml), injectLinkTokens(newHtml), {
    blocksExpression: [{ exp: /@@@LINK_URL:[\s\S]+?@@@/g }],
  });

  // 1. Where the URL changed between versions: format as (old → new)
  let formattedDiff = rawDiff.replace(
    /<span class="diff-url-badge[^\"]*">\s*<del[^>]*>@@@LINK_URL:(.*?)@@@<\/del>\s*<ins[^>]*>@@@LINK_URL:(.*?)@@@<\/ins>\s*<\/span>/gi,
    (_, encodedOld, encodedNew) => {
      const oldUrl = decodeURIComponent(encodedOld);
      const newUrl = decodeURIComponent(encodedNew);
      return ` <span class="diff-url-change text-xs font-mono inline-block align-baseline ml-1 select-text">(<del class="diffmod line-through text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/60 px-1 py-0.5 rounded break-all">${oldUrl}</del> → <ins class="diffmod no-underline text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-950/60 px-1 py-0.5 rounded break-all">${newUrl}</ins>)</span>`;
    }
  );

  // 2. Decode all remaining URL badges (for newly added links, removed links, and unchanged links)
  formattedDiff = formattedDiff.replace(
    /@@@LINK_URL:(.*?)@@@/g,
    (_, encodedUrl) => `[${decodeURIComponent(encodedUrl)}]`
  );

  return formattedDiff;
}

export default diffHtml;
