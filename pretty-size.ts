/**
 * Converts a size (in Bytes) to the biggest suitable base-2 suffix.
 * Example: 
 *   prettyFileSize(1024) == '1.00 KiB'
 *   prettyFileSize(2_234_456) == '2.13 MiB'
 */
export default function prettyFileSize(size: number): string {
    if (size < 0 || !Number.isFinite(size)) return 'NaN';
    const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
    let i = 0;
    let val = size;
    while (val >= 1024 && i < units.length - 1) {
        val /= 1024;
        i++;
    }
    const formatted = val.toFixed(2);
    return `${formatted} ${units[i]}`;
}
