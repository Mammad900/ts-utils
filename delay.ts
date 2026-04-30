/**
 * Promisified `setTimeout`
 * Returns a promise that resolves after the given number of milliseconds.
 */
export default function delay(ms: number) {
    return new Promise<void>(resolve => {
        setTimeout(resolve, ms)
    })
}
