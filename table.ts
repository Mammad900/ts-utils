/**
 * Formats data as a table, to be `console.log`ged.
 * @param columns An array of columns. Controls which properties are printed and in what order.
 * @param data An array of objects, each with the same keys as the elements in `columns`
 */
export default function table<K extends string>(columns: readonly K[], data: Array<Record<K, string>>): string {
    const maxWidths = columns.map(column => 
        Math.max(
            column.length, 
            ...data.map(item => item[column].length)
        )
    );

    const newData = [
        Object.fromEntries(columns.map(c => [c, c as string])),
        Object.fromEntries(columns.map((c, i) => [c, '-'.repeat(maxWidths[i])])),
        ...data
    ];

    return newData.map(line =>
        columns.map((c, i) => line[c].padEnd(maxWidths[i])).join(' ')
    ).join('\n')
}
