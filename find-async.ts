/**
 * Like Array.prototype.find but takes an async predicate. The predicate runs per every element, **in parallel**.
 */
export default async function findAsync<T>(arr: T[], asyncCallback: (value: T, index: number, array: T[]) => Promise<boolean>) {
    const promises = arr.map(asyncCallback);
    const results = await Promise.all(promises);
    const index = results.findIndex(result => result);
    return index == -1 ? undefined : arr[index];
}
