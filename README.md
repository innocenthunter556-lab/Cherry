# Sri Sai Boutique

Real, deployable Vite + React project -- scaffolded around the single-file
component built and previewed earlier in chat. `src/App.jsx` is an exact,
byte-for-byte copy of that verified file; nothing in the component itself
was changed, only the project wrapper around it.

## Before you deploy

This has NOT been run locally -- there was no network access available to
`npm install` or build it. Run it locally first and fix anything that comes
up before pushing to production:

```
npm install
npm run dev
```

Open the local URL it prints and click through every view (Home,
Collections, a couple of products, Wishlist, Track Order) before deploying.

## Deploy to Vercel

**Option A -- Vercel CLI (fastest):**
```
npm install -g vercel
vercel
```
Follow the prompts. Vercel auto-detects Vite (build command `vite build`,
output directory `dist`) -- no extra config needed.

**Option B -- GitHub + Vercel dashboard:**
1. Push this folder to a new GitHub repo.
2. On vercel.com: New Project -> import that repo.
3. Framework preset should auto-detect as Vite. Deploy.

Either way, you'll get a live `.vercel.app` URL immediately, plus the option
to attach a custom domain afterward in the Vercel dashboard.

## Stack

- Vite 8 + React 18
- Tailwind CSS v4 (CSS-first config -- no `tailwind.config.js`/`postcss.config.js`;
  see `vite.config.js` and `src/index.css`)
- three.js (hero animation) + lucide-react (icons)

## What's NOT included

No backend, no database, no login -- this was a deliberate design choice
throughout the project. Ordering happens via WhatsApp deep links to the
real boutique number. If that ever needs to change, that's new scope, not
a bug in this scaffold.
