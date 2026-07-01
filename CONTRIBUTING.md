# Contributing to Lastmile Logi Solutions

Thank you for helping keep the site production-ready. This document describes how we use Git, Netlify, and the asset optimizer.

## Branch strategy

- **`main` is production.** Every push to `main` triggers a Netlify deploy.
- Complete work on feature branches if you prefer, then merge to `main` with a clean history of focused commits.
- After finishing a feature, **commit and push to `main`** so the live site stays current.

## Git workflow

1. Implement one logical feature or fix.
2. Stage only the files that belong to that change.
3. Commit with a **meaningful message** (see below).
4. Repeat for the next logical change—**keep commits small** (one concern per commit).
5. When the feature is done, **push to `origin main`**.

The repository should remain **production-ready at all times**: no broken pages, no committed secrets, and no reliance on uncommitted local-only files.

## Commit message format

- Use **imperative mood** (as if completing: “Add …”, “Fix …”, “Remove …”).
- State **what** changed and **why** when it is not obvious.
- Keep the subject line concise; add a body for extra context if needed.

**Examples:**

- `Add Netlify config for clean URLs and security headers`
- `Preload hero.webp and reference minified assets in HTML`
- `Fix nav active state for Netlify clean URL paths`
- `Remove obsolete logo.svg placeholder asset`

## What never to commit

Do **not** add or commit:

- `node_modules/`
- Build or cache folders: `build/`, `dist/`, `.cache/`
- Generated minified files: `*.min.css`, `*.min.js` (from `optimize.js`)
- Environment files: `.env`, `.env.*`, keys, `*.pem`, `credentials*`
- IDE settings: `.vscode/`, `.idea/`, swap files (`*.swp`)
- OS junk: `.DS_Store`, `Thumbs.db`, etc.
- Temp files: `temp/`, `tmp/`, `*.log`

**Do commit** source HTML, CSS, JS, images such as `hero.webp`, `netlify.toml`, and documentation under `docs/` when present.

## Pre-push checklist

Before pushing to `main`:

1. **Review the diff**—no secrets, no accidental `node_modules`, no minified bundles you meant to regenerate.
2. **Run the optimizer locally** (optional but recommended before preview):
   ```bash
   node optimize.js
   ```
   Netlify runs this during the build; local runs help catch issues early.
3. **Smoke-test** key pages locally (navigation, forms, hero, mobile menu).
4. **Push** only when you are confident the site is deployable.

## Netlify deployment

- The site **auto-deploys from the `main` branch** on Netlify.
- Build settings and headers live in `netlify.toml` at the project root.
- The Netlify build runs **`node optimize.js`** to produce minified CSS/JS used by the HTML references.

## Running `optimize.js` locally

From the repository root:

```bash
node optimize.js
```

This regenerates minified assets (for example under `assets/css/` and `assets/js/`). Those outputs are **gitignored**; Netlify generates them on each deploy. Use local output only for preview—do not commit `*.min.css` or `*.min.js`.

## Questions

For deployment or content questions, coordinate with the project owner before changing production-critical settings in `netlify.toml` or global styles.
