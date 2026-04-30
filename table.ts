/**
 * Formats data as a table, to be `console.log`ged.
 * @param columns An array of columns. Controls which properties are printed and in what order.
 * @param data An array of objects, each with the same keys as the elements in `columns`
 */
export default function table<K extends string>(columns: readonly K[], data: Array<Record<K, string>>): string {
  const maxWidths = columns.map((col) =>
    Math.max(
      col.length,
      ...data.map((item) => item[col].length)
    )
  );

  // Header row
  const header = columns.join(' ');

  // Separator row (e.g. “--- ---”)
  const separator = columns
    .map((_, i) => '-'.repeat(maxWidths[i]))
    .join(' ');

  const rows = data.map((row) =>
    columns.map((col, i) => row[col].padEnd(maxWidths[i])).join(' ')
  );

  return [header, separator, ...rows].join('\n');
}
