/**
 * Decode HTML entities and strip any remaining HTML tags from text.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  const decoded = textarea.value;
  // Strip any remaining HTML tags
  return decoded.replace(/<[^>]*>/g, '').trim();
}
