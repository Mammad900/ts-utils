// Mini redux: tiny library to manage global state, with React support

import { useEffect, useState } from 'react';

/**
 * Creates a lightweight global state store that can be shared across any number of React components.
 *
 * The returned object exposes three members:
 *
 * - `set(newValue)` – update the global value (only notifies listeners if the value actually changes).
 * - `get()`          – retrieve the current value synchronously.
 * - `use()`          – a custom hook that subscribes to the store and returns `[value, set]`.
 *
 * @template T
 * @param {T} initial The initial value of the global state.
 * @returns {{
*   set: (newValue: T) => void,
*   get: () => T,
*   use: () => [T, (newValue: T) => void]
* }}
*
* @example
* // In a component file:
* import createGlobalState from './globalState';
*
* const counter = createGlobalState(0);
*
* function CounterDisplay() {
*   const [count, setCount] = counter.use();
*
*   return (
*     <div>
*       <span>{count}</span>
*       <button onClick={() => setCount(count + 1)}>Increment</button>
*     </div>
*   );
* }
*
* function CounterReset() {
*   const [, reset] = counter.use();
*   return <button onClick={() => reset(0)}>Reset</button>;
* }
*/
export default function createGlobalState<T>(initial: T): {
    /** Set the value and re-render any components that `use()` this state. */
    set: (newValue: T) => void;
    /** Get the current value. React components should use `use()` instead of this. */
    get: () => T;
    /** A React hook to get and set the state. Behaves like React's builtin useState hook. */
    use: () => [T, (newValue: T) => void];
} {
    let value: T = initial; 
    const listeners = new Set<() => void>();

    function set(newValue: T) {
        if (newValue !== value) { // only notify on real change
            value = newValue;
            for (const fn of listeners) fn();
        }
    }

    function get() {
        return value;
    }

    function use(): [T, typeof set] {
        const [state, setState] = useState(get());   // initial value

        useEffect(() => {
            /* subscribe when component mounts – the callback just updates local state */
            const fn = () => setState(get());
            listeners.add(fn);

            return () => {listeners.delete(fn);} // cleanup on unmount
        }, []);

        return [state, set];   // expose current value & setter
    }

    return {set, get, use};
}
