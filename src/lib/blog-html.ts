import sanitizeHtml from 'sanitize-html';

/**
 * Blog articles are written in a rich-text editor and often pasted from other tools, so the HTML is
 * never trusted. This keeps only the formatting the journal supports and throws the rest away:
 * scripts, styles, event handlers, iframes, images, tracking attributes, javascript: links and the
 * colours/fonts that come along when copying from a web page.
 *
 * Server only (it is used when saving an article and again before showing it).
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'br', 'h2', 'h3', 'h4', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li', 'blockquote', 'a', 'hr', 'code', 'pre'],
  allowedAttributes: { a: ['href', 'target', 'rel'] },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowProtocolRelative: false,
  // Unknown tags (div, span, font, table...) are removed but their text is kept.
  disallowedTagsMode: 'discard',
  transformTags: {
    // The article title is already the page's H1, so body headings start at H2.
    h1: 'h2',
    h5: 'h4',
    h6: 'h4',
    b: 'strong',
    i: 'em',
    del: 's',
    strike: 's',
    a: (_tag, attribs): sanitizeHtml.Tag => {
      // Only web and e-mail links keep their address; anything else (javascript:, data:...) loses it
      // and is turned back into plain text afterwards.
      if (!attribs.href || !/^(https?:|mailto:)/i.test(attribs.href.trim())) return { tagName: 'a', attribs: {} as Record<string, string> };
      return { tagName: 'a', attribs: { href: attribs.href, target: '_blank', rel: 'noopener noreferrer' } };
    },
  },
  // Drop empty paragraphs/headings/list items that pasting tends to leave behind.
  exclusiveFilter: (frame) => ['p', 'h2', 'h3', 'h4', 'li', 'blockquote'].includes(frame.tag) && !frame.text.trim(),
};

export function sanitizeBlogHtml(html: string): string {
  const clean = sanitizeHtml(html, OPTIONS);
  // Unwrap links that ended up without an address (the output is already well-formed, and links never nest).
  return clean.replace(/<a(\s[^>]*)?>([\s\S]*?)<\/a>/g, (match, attrs: string | undefined, inner: string) =>
    /\shref=/.test(attrs ?? '') ? match : inner
  );
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

/**
 * Plain-text paragraphs of an article (headings, list items and quotes each become one). Kept alongside
 * the formatted version so search-engine data, previews and older code that expect paragraphs keep working.
 */
export function htmlToParagraphs(html: string): string[] {
  const withBreaks = sanitizeBlogHtml(html).replace(/<\/(p|h2|h3|h4|li|blockquote|pre)>|<br\s*\/?>|<hr\s*\/?>/gi, '$&\n\n');
  const text = decodeEntities(sanitizeHtml(withBreaks, { allowedTags: [], allowedAttributes: {} }));
  return text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}
