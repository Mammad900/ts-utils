/*
 * Minimal router built on top of `mini-redux` (can be found in the same repo)
 *
 * Features:
 *   * <Link> component – navigates without page reload when clicked. uses <a>.
 *   * <Redirect> component – navigates without page reload **when mounted**.
 *   * useCurrentRoute() hook – returns the current pathname string.
 * 
 * Limitations:
 *   * It only gives you the path. You have to decide what to render yourself.
 *   * No search params
 *   * No built-in nested routes, but can be implemented with simple custom logic. (use startsWith as render condition and parse path to check inner route)
 *
 * Usage example:
 *   function App() {
 *   const route = useCurrentRoute();
 *  
 *   return (
 *     <div>
 *       <nav>
 *         <Link href="/home">Home</Link>
 *         <Link href="/profile">Profile</Link>
 *         <Link href="/settings">Settings</Link>
 *       </nav>
 *  
 *       {route === '/home' ? <HomePage /> :
 *        route === '/profile' ? <ProfilePage /> :
 *        route === '/settings' ? <SettingsPage /> :
 *                               <Redirect to="/home" />}
 *     </div>
 *   );
}
 */

import React, { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import createGlobalState from './mini-redux';
import classNames from 'classnames';

// Global state that holds the current pathname
const routeStore = createGlobalState<string>(window.location.pathname);

/** Hook: read the current route. Example output: `"/home"` */
export function useCurrentRoute() {
    const [path] = routeStore.use();   // we only need the value, not the setter
    return path;
}

export type LinkProps = {
    /** Link target route. Does not support relative paths. */
    to: string,
    children: ReactNode
} & HTMLAttributes<HTMLAnchorElement>

/** A link that navigates to the given route when clicked. Renders an <a> that gets class name "active" when route is active. */
export function Link({ to, children, className, ...rest }: LinkProps) {
    const route = useCurrentRoute()

    const handleClick = (e: MouseEvent) => {
        // Allow default behavior for modified clicks or non‑left mouse button.
        if (
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.button !== 0
        ) return;

        e.preventDefault();                     // stop full page reload
        history.pushState(null, '', to);       // update the URL bar
        routeStore.set(to);                   // notify the global store
    };

    return (
        <a href={to} onClick={handleClick} className={classNames(className, {active: route.startsWith(to)})} {...rest}>
            {children}
        </a>
    );
}

window.addEventListener('popstate', () => {
    routeStore.set(window.location.pathname);
});

/** Navigates to the given path when rendered. */
export function Redirect({ to }) {
    React.useEffect(() => {
        history.pushState(null, '', to);   // update URL bar
        routeStore.set(to);                // notify the global store
    }, [to]);

    return null;
}
