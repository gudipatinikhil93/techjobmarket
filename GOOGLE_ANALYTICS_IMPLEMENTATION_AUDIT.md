# Google Analytics Implementation Audit

## Overview
Google Analytics tracking has been integrated into the TechJobMarket platform to monitor user engagement, traffic sources, and site performance.

## Implementation Details
- **Tracking ID**: `G-2V7Y2B2ZGX`
- **Method**: Global site tag (`gtag.js`)
- **Location**: `src/layouts/Layout.astro`
- **Placement**: Inside the `<head>` section, immediately following the structured data scripts.

## Code Snippet
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-2V7Y2B2ZGX"></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-2V7Y2B2ZGX');
</script>
```

## Technical Notes
- **Astro Integration**: The configuration script uses the `is:inline` directive. This ensures Astro does not process or bundle the script, allowing it to execute exactly as provided by Google in the client browser.
- **Site-Wide Coverage**: Since `Layout.astro` is used by all pages (Home, About, Salaries, Roles, Trends, Layoffs, etc.), tracking is active across the entire application.
- **Performance**: The main `gtag.js` library is loaded asynchronously (`async`) to minimize impact on page load speed and Core Web Vitals.

## Verification Checklist
- [x] Script present in `<head>` of all pages.
- [x] Correct Tracking ID applied.
- [x] Asynchronous loading enabled.
- [x] `is:inline` used for inline configuration logic.
