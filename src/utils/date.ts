/**
 * Normalizes a date string or Date object into a Date instance.
 * Parses ISO date strings as UTC noon to prevent timezone off-by-one day issues.
 */
function toDate(date: string | Date): Date {
  if (date instanceof Date) return date;
  // Append UTC noon so that e.g. "2026-03-02" is never shifted to the
  // previous day on machines in a negative UTC offset timezone.
  return new Date(date + 'T12:00:00Z');
}

/**
 * Formats a date for display.
 *
 * @param date   - An ISO date string (e.g. "2026-02-22") or Date object
 * @param options - Intl.DateTimeFormatOptions (defaults to long form: "February 22, 2026")
 * @returns      Formatted date string
 *
 * @example
 * formatDate("2026-02-22")
 * // → "February 22, 2026"
 *
 * formatDate("2026-02-22", { month: "short", year: "2-digit" })
 * // → "Feb '26"  (index page short form)
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }
): string {
  const d = toDate(date);
  const formatted = d.toLocaleDateString('en-US', options);

  // Apply the "feb '26" apostrophe-style transform when year is 2-digit
  if (options.year === '2-digit') {
    return formatted.toLowerCase().replace(' ', " '");
  }

  return formatted;
}

/**
 * Returns an ISO 8601 date string (YYYY-MM-DD) suitable for HTML datetime attributes.
 *
 * @param date - An ISO date string (e.g. "2026-02-22") or Date object
 * @returns    ISO date string, e.g. "2026-02-22"
 *
 * @example
 * getISODate("2026-02-22")
 * // → "2026-02-22"
 */
export function getISODate(date: string | Date): string {
  return toDate(date).toISOString().slice(0, 10);
}
