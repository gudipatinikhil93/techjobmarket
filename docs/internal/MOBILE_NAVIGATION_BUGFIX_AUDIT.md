# Mobile Navigation Bugfix Audit - TechJobMarket

**Date:** June 5, 2026
**Status:** Resolved
**Severity:** Critical (Mobile UX)

## 1. Root Cause Identification

The reported "freeze" and "unresponsive" behavior on mobile was caused by a combination of the following factors:

1.  **Scroll Lock Deadlock:** The `Navbar` was applying `document.body.style.overflow = 'hidden'` when the menu was open. However, if a user navigated to a new page (or the same page) via a menu link, the menu state in the DOM would sometimes persist or not be properly cleaned up, leaving the `body` locked even if the menu wasn't visible.
2.  **Menu Scroll Blocking:** The mobile menu did not have its own scrollable area. If the menu content (links + search) exceeded the viewport height on small screens, the user could not scroll to the bottom because the background (body) was locked, and the menu itself was static. This felt like the app was "frozen."
3.  **BFcache State Leakage:** Browser Back-Forward cache (BFcache) was restoring the page with the `overflow: hidden` style on the `body` if the user had navigated away while the menu was open.
4.  **Layout Restrictions:** `height: 100%` on `html` and `body` in `Layout.astro` combined with `overflow-hidden` on `main` elements (like in `contact.astro`) was creating unnecessary scroll boundaries that could trap the viewport.

## 2. Fixes Applied

### A. Enhanced `Navbar.astro` Interactivity
*   **Backdrop Implementation:** Added a `mobile-menu-backdrop` (`fixed inset-0`) with a blur effect to clearly distinguish the menu state and provide a global "close" trigger.
*   **Scrollable Menu:** Added `max-h-[calc(100vh-64px)]` and `overflow-y-auto` to the `#mobile-menu`. This ensures the menu is always scrollable regardless of its content length or screen size.
*   **Overscroll Control:** Added `overscroll-contain` to the menu to prevent scroll chaining to the locked body.
*   **Link Click Auto-Close:** Added event listeners to all links inside the mobile menu to trigger `closeMenu()` immediately upon click. This prevents stale states during navigation.

### B. Robust State Management Script
*   **`initMobileMenu()` Initialization:** Encapsulated logic into a reusable function.
*   **Astro Lifecycle Hooks:** 
    *   Added `astro:page-load` listener to ensure scripts re-run correctly if View Transitions are used.
    *   Added `astro:after-swap` listener to force-reset `body.overflow` after page transitions.
*   **BFcache Handling:** Added `pageshow` event listener with `event.persisted` check to reset the menu state when the user returns via the back button.
*   **Scrollbar Jitter Fix:** The `openMenu` function now calculates scrollbar width and applies `padding-right` to `body` to prevent the "layout shift" when the scrollbar disappears.

### C. Layout & Page Adjustments
*   **`Layout.astro`:** Changed `height: 100%` to `min-height: 100%` on `html` and `body` to allow for more flexible content growth.
*   **`contact.astro`:** Replaced `overflow-hidden` on the `<main>` element with `overflow-x-hidden` to prevent blocking vertical scroll while still clipping background decorative blurs.

## 3. Tested Scenarios

| Scenario | Expected Behavior | Result |
| :--- | :--- | :--- |
| Open Menu -> Scroll down | Menu scrolls, body remains fixed. | PASS |
| Open Menu -> Click "Salaries" | Menu closes, navigates to Salaries, scroll restored. | PASS |
| Open Menu -> Press "Back" button | Previous page restores with menu closed and scroll active. | PASS |
| Open Menu -> Rotate Device | Menu adjusts, state remains consistent. | PASS |
| Open Menu -> Click Backdrop | Menu closes, scroll restored. | PASS |
| Fast repeated toggling | No animation or state deadlock. | PASS |

## 4. Performance & UX Impact
*   **Zero Dependencies:** Fixed using vanilla JS and Tailwind utility classes.
*   **Native Feel:** The use of `overscroll-contain` and proper backdrop blurs makes the navigation feel production-grade.
*   **Accessibility:** Maintained `aria-expanded` and added `Escape` key support for closing the menu.
