# Typescript and React utilities

To use one of these, save the file to your project folder, edit as necessary then import it in your code and use it according to the examples. You are not supposed to download the whole repository, and this is not a library.

## [Mini Redux](./mini-redux.ts)

`useState` but with global scope. Can get and set in or out of a component.

Example:

```tsx
import createGlobalState from './mini-redux';

const counter = createGlobalState(0);

function CounterDisplay() {
  const [count, setCount] = counter.use();

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

function CounterReset() {
  const [, reset] = counter.use();
  return <button onClick={() => reset(0)}>Reset</button>;
}
```

## [Mini React Router](./mini-react-router.tsx)

Minimal router built on top of `mini-redux` (can be found in the same repo)

Features:
 * `<Link>` component – navigates without page reload when clicked. Renders an `<a>` that gets class name `active` when route is active.
 * `<Redirect>` component – navigates when rendered.
 * `useCurrentRoute()` hook – returns the current pathname string.

Limitations:
 * It only gives you the path. You have to decide what to render yourself.
 * No search params
 * No built-in nested routes, but can be implemented with simple custom logic. (use startsWith as render condition and parse path to check inner route)

Example:
```tsx
function App() {
  const route = useCurrentRoute();
  
  return (
    <div>
      <nav>
        <Link to="/home">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/settings">Settings</Link>
      </nav>
      
      {route === '/home'     ? <HomePage />     :
       route === '/profile'  ? <ProfilePage />  :
       route === '/settings' ? <SettingsPage /> :
                               <Redirect to="/home" />}
    </div>
  );
 }
 ```

## [useGlobalEventListener](./use-global-event.ts)

A React hook that registers an event listener on `window` and cleans it up on unmount.

Example:

```ts
import { useState } from "react";
import useGlobalEventListener from "./useGlobalEventListener";

export default function WindowResizeCounter() {
  const [width, setWidth] = useState(window.innerWidth);

  // Update `width` whenever the window is resized.
  useGlobalEventListener(
    "resize",
    () => setWidth(window.innerWidth),
    [] // no extra dependencies
  );

  return <p>Current width: {width}px</p>;
}
```

## [Delay](./delay.ts)

Promisified `setTimeout`.

Example:

```ts
import delay from "./delay"

const start = Date.now();
await delay(1000);
console.log(Date.now() - start); // ~1000
```

## [Promise Timeout](./promise-timeout.ts)

Calls a callback if a promise takes longer than the specified time to resolve or reject.

Example:

```ts
import promiseTimeout from "./promise-timeout";

// This function may or may not take longer than 100ms
async function mayTakeLong() { /* ... */ }

// Show spinner if its hidden
function showSpinner() { /* ... */ }
// Hide spinner if its shown
function hideSpinner() { /* ... */ }

await promiseTimeout(mayTakeLong(), 100, ()=> showSpinner());// If mayTakeLong takes more than 100ms, spinner will be shown. Otherwise, nothing special happens.
hideSpinner(); // hide the spinner when it resolves.
```

## [Table](./table.ts)

Formats data as a table, to be `console.log`ged.

Example:

```ts
import table from "./table.ts"

const columns = ['name', 'age'] as const;
const people = [
  { name: 'Alice', age: '30' },
  { name: 'Bob',   age: '25' },
];

console.log(table(columns, people));
```
```txt
name  age
----- ---
Alice 30 
Bob   25
```

## [Async Find](./find-async.ts)

Like Array.prototype.find but takes an async predicate. The predicate runs per every element, **in parallel**.

Example:

```ts
// Example: find the first reachable API endpoint from a list

const endpoints = [
    'https://api.example.com/health',
    'https://staging.api.example.com/health',
    'https://prod.api.example.com/health',
]

async function isReachable(url: string): Promise<boolean> {
    try {
        const res = await fetch(url, { method: 'GET', cache: 'no-store' });
        return res.ok;          // true for 200‑299
    } catch (_) {
        return false;           // network error → not reachable
    }
}

const healthy = await findAsync(endpoints, isReachable);
if (healthy)
    console.log(`First healthy endpoint: ${healthy}`);
else
    console.warn('No endpoint responded with a 2xx status.');
```

## [Pretty print size](./pretty-size.ts)

Converts a size (in Bytes) to the biggest suitable base-2 suffix.

Example: 
 * `prettyFileSize(1024) == '1.00 KiB'`
 * `prettyFileSize(2_234_456) == '2.13 MiB'`
