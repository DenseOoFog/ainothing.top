# AInothing.top

AInothing.top is an Astro-based editorial site focused on AI, internet businesses, and realistic revenue breakdowns.

Core sections:
- Home
- Revenue hub
- Archive
- About
- Privacy
- Contact
- RSS feed

## Stack
- Astro 6
- Markdown/MDX content collections
- RSS via `@astrojs/rss`
- Sitemap via `@astrojs/sitemap`
- Vitest for content utility tests

## Project structure
- `src/site.config.ts` — site identity, nav, homepage copy
- `src/content/blog/` — blog posts and MDX content
- `src/lib/posts.ts` — post sorting/filter helpers
- `src/pages/` — route pages
- `editorial/` — editorial notes and templates

## Local development
```bash
npm install
npm run dev
```

## Verification
```bash
npm run check
npm run test
npm run build
```

## Output
Production files are generated in `dist/`.

## Notes
- `public/robots.txt` points at `https://ainothing.top/sitemap-index.xml`
- `public/manifest.json` provides basic PWA metadata
- The site is configured for static deployment
