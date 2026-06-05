# Domain Routing Audit - TechJobMarket

## 1. Problem Statement
The `www` subdomain (`www.techjobmarket.com`) was not properly resolving to the Cloudflare Worker, resulting in an **Error 522 (Connection Timed Out)**. Additionally, the configuration was initially set to redirect all `www` traffic to the apex domain, but the requirement was changed to allow both to operate independently.

## 2. Root Cause Analysis
- **DNS Conflict:** A manual CNAME record for `www` existed, which conflicted with Worker internal routing.
- **Missing Custom Domain Binding:** The Worker was not explicitly listening for the `www` hostname.

## 3. Fixes Applied

### A. Wrangler Configuration
Updated `wrangler.toml` to explicitly bind both hostnames as **Custom Domains**.

```toml
[[routes]]
pattern = "techjobmarket.com"
custom_domain = true

[[routes]]
pattern = "www.techjobmarket.com"
custom_domain = true
```

### B. Dual-Domain Metadata Support
Removed the redirect middleware and updated `src/layouts/Layout.astro` to dynamically generate canonical URLs and JSON-LD based on the current requested hostname. This ensures that both domains are SEO-friendly without forcing a cross-domain redirect.

```typescript
// src/layouts/Layout.astro
const currentOrigin = Astro.url.origin;
const canonicalURL = Astro.url.href;
```

## 4. Final Routing Architecture
1. **User requests** either `https://techjobmarket.com` or `https://www.techjobmarket.com`.
2. **Cloudflare Edge** identifies the Custom Domain binding for the Worker.
3. **Worker executes** and serves the content directly for that hostname.
4. **Metadata** (Canonical tags, Open Graph, JSON-LD) is self-referential to the domain being used.

## 5. Verification Checklist
- [x] `wrangler.toml` includes both domains.
- [x] Redirect middleware removed (Dual-domain active).
- [x] Layout dynamically adjusts meta tags to current domain.
- [x] Project builds successfully.
- [x] **Verified Deployment:** `npx wrangler deploy` successful.
