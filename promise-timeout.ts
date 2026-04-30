/**
 * Calls the specified callback if a promise takes longer than the specified time to complete
 * Returns a new promise that is equivalent to the given one.
 * Once the timeout is reached, it calls either the first or second callback, depending on whether the promise has resolved/rejected yet.
 */
export default function promiseTimeout<T>(promise: Promise<T>, timeout: number, callback: (promise: Promise<T>) => void, noTimeoutCallback?: (promise: Promise<T>) => void): Promise<T> {
    let hasCompleted = false;
    setTimeout(() => {
        if (!hasCompleted) {
            callback(promise);
        } else {
            noTimeoutCallback?.(promise);
        }
    }, timeout);
    return new Promise((resolve, reject) => {
        promise.then((res) => {
            hasCompleted = true;
            resolve(res);
        }, (err) => {
            hasCompleted = true;
            reject(err);
        })
    })
}
