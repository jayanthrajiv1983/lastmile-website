# Performance Optimizations
## Lastmile Logi Solutions Website

**Date:** July 1, 2026  
**Scope:** Lighthouse performance improvements only — no visual, layout, animation, or UX changes.

---

## Summary

Applied delivery, loading, caching, and minification optimizations across all 5 HTML pages. The homepage hero background is now self-hosted as WebP (same Unsplash source). CSS and JS ship minified via a Netlify build step. Critical fonts and LCP images are preloaded. All 16 `clamp()` values in `main.min.css` were verified intact after minification.

**Estimated Lighthouse impact:**

| Page | Performance (before → after) | Primary gains |
|------|------------------------------|---------------|
| Homepage (`index.html`) | 85–92 → **90–96** | Self-hosted hero WebP, no third-party image DNS/TLS, minified assets, font preloads |
| Subpages | 88–94 → **92–98** | Minified CSS/JS, font preloads, LCP logo preload + `fetchpriority="high"` |
| Accessibility / SEO / Best Practices | Unchanged | 95–100 (no a11y or meta regressions) |

---

## 1. Image Loading

### Hero (homepage LCP)
- **Self-hosted** `assets/images/hero.webp` (772 KB) — downloaded from the same Unsplash photo (`photo-1586528116311-ad8dd3c8310d`) at `w=1920&q=80&fm=webp`.
- Updated `assets/css/layout.css` `.hero-bg` background URL from Unsplash CDN to `../images/hero.webp`.
- **Removed** `preconnect` to `images.unsplash.com` on homepage (no longer needed).
- **Added** `<link rel="preload" href="assets/images/hero.webp" as="image" type="image/webp" fetchpriority="high">` on `index.html`.
- Visual appearance preserved: same crop, overlays, gradients, parallax, and animations unchanged.

### Subpage LCP (header logo)
- Preload retained: `assets/images/lastmile-logo.png` with `fetchpriority="high"` on about, services, industries, contact.
- Header logos retain `fetchpriority="high"`.

### Below-fold images
- Footer logos already had `loading="lazy"` and `decoding="async"` (unchanged).

### Dimensions (CLS)
- All `<img>` tags already include explicit `width` and `height` — verified on all 5 pages (header, loader, footer, float SVGs).

### Float SVGs
- `float-box.svg`, `float-pallet.svg`, `float-pin.svg`, `float-truck.svg` — small inline SVGs (each under 500 bytes), unchanged.

---

## 2. Font Loading

### Google Fonts
- `display=swap` confirmed in all pages:  
  `family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap`
- `preconnect` to `fonts.googleapis.com` and `fonts.gstatic.com` (crossorigin) on all pages.

### Critical font preloads (latin subset woff2)
Added on all 5 pages:
```html
<link rel="preload" href="https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_Tkn9TR_V.woff2" as="font" type="font/woff2" crossorigin>
```

### Font weight audit
All loaded weights are used in CSS — none removed:

| Family | Weights loaded | Used for |
|--------|----------------|----------|
| Inter | 400, 500, 600, 700 | Body (400), badges/nav (500), buttons/labels (600), headings/emphasis (700) |
| Plus Jakarta Sans | 600, 700, 800 | Component titles (600), display headings (700), hero/page h1 (800) |

---

## 3. CSS Delivery

- Ran `node optimize.js` to regenerate `assets/css/main.min.css` from the 6-file import chain.
- **Verified:** 16 `clamp()` expressions — all retain required `+`/`-` spacing (0 broken).
- **Verified:** `hero.webp` path present in minified output.
- **Size:** ~83 KB source chain → ~64 KB minified (~23% smaller); eliminates 5 render-blocking `@import` requests.

All 5 HTML pages updated:
```html
<link rel="preload" href="assets/css/main.min.css" as="style">
<link rel="stylesheet" href="assets/css/main.min.css">
```

---

## 4. JavaScript Loading

- All scripts retain `defer` in correct dependency order (unchanged order).
- Switched all script references from `.js` to `.min.js` on every page.
- **Total JS savings:** ~7.3 KB across 13 modules.
- **console.log:** None found in source JS (no removal needed).
- Minified JS reviewed for syntax integrity (`nav.min.js` spot-checked).

| Page | Scripts |
|------|---------|
| index.html | loader, page-transitions, nav, smooth-scroll, scroll-progress, parallax, scroll-reveal, animations, process-flow, main |
| about.html | + timeline |
| contact.html | + form |
| services.html, industries.html | base set (no parallax/process-flow/timeline/form) |

---

## 5. Asset Caching (`netlify.toml`)

- **Build command** set to `node optimize.js` so minified CSS/JS are generated at deploy (they remain gitignored).
- Added `stale-while-revalidate=86400` to all `/assets/*` cache headers for smoother CDN revalidation.
- Updated CSP: removed `https://images.unsplash.com` from `img-src` (hero is now self-hosted).

---

## 6–10. Additional Lighthouse Wins

| Optimization | Status |
|--------------|--------|
| Resource hints (preconnect, preload) | ✅ Fonts, CSS, LCP images |
| Render-blocking reduction | ✅ Single minified CSS file instead of `@import` chain |
| CLS prevention | ✅ All images have width/height |
| Third-party reduction | ✅ Hero no longer fetched from Unsplash at runtime |
| Deferred JS | ✅ All scripts use `defer` |
| Accessibility / SEO | ✅ Unchanged — skip links, meta, JSON-LD, ARIA intact |

---

## Files Modified

| File | Change |
|------|--------|
| `index.html` | Minified assets, font preloads, hero.webp preload, removed Unsplash preconnect |
| `about.html` | Minified assets, font preloads, logo preload fetchpriority |
| `services.html` | Minified assets, font preloads, logo preload fetchpriority |
| `industries.html` | Minified assets, font preloads, logo preload fetchpriority |
| `contact.html` | Minified assets, font preloads, logo preload fetchpriority |
| `assets/css/layout.css` | Hero background → `../images/hero.webp` |
| `netlify.toml` | Build command, stale-while-revalidate, CSP update |
| `assets/images/hero.webp` | **New** — self-hosted hero background |
| `PERFORMANCE_OPTIMIZATIONS.md` | **New** — this document |

**Generated at build time (gitignored):** `assets/css/main.min.css`, `assets/js/*.min.js`

---

## Verification Steps

### 1. Local setup
```bash
node optimize.js
```
Then serve the site (e.g. `npx serve .` or Netlify CLI) and confirm pages load with styles and animations intact.

### 2. clamp() integrity
```bash
node -e "const c=require('fs').readFileSync('assets/css/main.min.css','utf8'); const cl=c.match(/clamp\\([^)]+\\)/g)||[]; const bad=cl.filter(x=>/\\d(?:rem|vw)\\+(?!\\s)/.test(x)); console.log(cl.length+' clamps, '+bad.length+' broken');"
```
Expected: `16 clamps, 0 broken`

### 3. Visual regression
- Homepage hero: same warehouse photo, overlays, parallax scroll, floating SVG animations.
- Typography: Inter body + Plus Jakarta Sans headings at all weights.
- All page transitions, scroll reveal, nav dropdown, FAQ accordion, form validation UI.

### 4. Lighthouse (Chrome DevTools → Lighthouse → Mobile)
Run on each page after deploy:
- **Performance** ≥ 90 (homepage), ≥ 92 (subpages)
- **LCP** element: hero.webp (index) or header logo (subpages)
- **CLS** ≤ 0.1
- Accessibility, Best Practices, SEO unchanged

### 5. Network panel checks
- No requests to `images.unsplash.com`
- `main.min.css` and `*.min.js` return 200
- Font preloads return 200 from `fonts.gstatic.com`
- Response headers include `Cache-Control: ... immutable, stale-while-revalidate=86400` for `/assets/*`

### 6. Netlify deploy
Confirm build log shows `node optimize.js` completing and `Created assets/css/main.min.css`.

---

## Notes

- **Design preserved:** Zero changes to colors, spacing, animations, layout, or UX behavior.
- **Hero.webp:** Same source image as prior Unsplash URL; WebP format reduces transfer vs. JPEG over CDN with connection overhead.
- **Local dev:** Run `node optimize.js` before previewing — minified files are gitignored and not committed.
- **Future:** Replace `hero.webp` with owned photography when available; update `layout.css` path only.

---

*End of performance optimization report.*
