# Mateus Paulino — Portfolio

A personal portfolio website inspired by the Chrome offline dinosaur game page. Minimal, monochrome, and playful.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Building for production

```bash
npm run build
npm run preview
```

## Deploying to GitHub Pages

This repo ships with a GitHub Actions workflow at `.github/workflows/deploy.yml`
that builds the site and publishes it to GitHub Pages on every push to `main`.

Deploy target: the user/org page repo
[`mateuspaulino/mateuspaulino.github.io`](https://github.com/mateuspaulino/mateuspaulino.github.io)
→ live at `https://mateuspaulino.github.io/`.

One-time setup:

1. Push to GitHub:
   ```bash
   git push -u origin main
   ```
2. In the repo, go to **Settings → Pages → Build and deployment**.
3. Set **Source** to **GitHub Actions**.
4. (Optional) Trigger a first deploy from the **Actions** tab → **Deploy to
   GitHub Pages** → **Run workflow**.

Pushes to `main` will rebuild and redeploy automatically. The workflow reads
the correct base path from `actions/configure-pages` and feeds it to Vite as
`VITE_BASE`, so the same workflow also works if you ever move to a project
page or custom domain:

| Repo type             | Example URL                           | Base path     |
| --------------------- | ------------------------------------- | ------------- |
| User / org page       | `https://<user>.github.io/`           | `/`           |
| Project page          | `https://<user>.github.io/<repo>/`    | `/<repo>/`    |
| Custom domain (CNAME) | `https://your-domain.com/`            | `/`           |

### Local production build for a specific deploy target

```bash
# Default (user/org page or custom domain)
npm run build

# Project page named e.g. `portfolio`
VITE_BASE=/portfolio/ npm run build
```

### Notes

- The build also writes `dist/404.html` (a copy of `index.html`) so any
  non-hash deep link still boots the SPA and lets the hash router take over.
- All in-app navigation uses hash routing (`#/blog`, `#/blog/:slug`), which
  GitHub Pages handles natively without any rewrite rules.

## Stack

- React 19 + Vite
- No external UI libraries — pure CSS with CSS custom properties
- Pixel fonts via Google Fonts (Press Start 2P, VT323)

## Features

- Pixel-art dino with idle animation
- Interactive dino runner mini-game (spacebar / tap to jump)
- Dark / light theme toggle (persisted in localStorage)
- Terminal-style links section
- Lightweight blog (`#/blog`, `#/blog/:slug`) with the latest 3 posts surfaced on the home page
- Fully responsive

## Adding a blog post

Posts are plain JS modules in `src/posts/`. To add one:

1. Create `src/posts/<slug>.js` exporting `{ slug, title, date, excerpt, body }`.
   `body` is an array of blocks: `{ type: 'p', text }`, `{ type: 'h2', text }`,
   or `{ type: 'list', ordered?, items: [{ title?, text }] }`.
2. Import it in `src/posts/index.js` and add it to the `ALL_POSTS` array.
   The list is sorted by `date` descending automatically.

The home page picks up the latest 3 entries with no further wiring.
