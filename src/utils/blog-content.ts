/** Small helpers for blog content that are safe to use in both the browser and on the server. */

const WORDS_PER_MINUTE = 200;

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Plain paragraphs (how older posts were stored) as HTML, so the editor can open them. */
export function paragraphsToHtml(paragraphs: string[]): string {
  return paragraphs
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('');
}

/** "4 min read" from the amount of text. */
export function estimateReadTime(plainText: string): string {
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min read`;
}

/** True for the empty document an editor reports when nothing has been written (e.g. "<p></p>"). */
export function isEmptyHtml(html: string): boolean {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length === 0;
}
