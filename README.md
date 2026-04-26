# Typescript and React utilities

## [Mini Redux](./mini-redux.ts)

`useState` but with global scope. Can get and set in or out of a component.

Example:

```ts
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

## [Mini React Redux](./mini-react-router.tsx)

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
```ts
function App() {
  const route = useCurrentRoute();
  
  return (
    <div>
      <nav>
        <Link href="/home">Home</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/settings">Settings</Link>
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

A React hook that registers an event listener `window` object and cleans it up on unmount.

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
