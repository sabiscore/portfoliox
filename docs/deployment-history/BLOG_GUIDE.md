# Engineering Writing Publishing Guide

## Quick Start: Publish a New Engineering Note

Writing entries live in `content/writing/*.mdx`, are compiled by [`lib/content.ts`](../../lib/content.ts), and render at `/writing`, `/writing/[slug]`, and `/rss.xml`.

### Manual Creation

1. **Create a slugged MDX file:**
   ```bash
   # Slug must match /^[a-z0-9]+(?:-[a-z0-9]+)*$/
   touch content/writing/your-post-slug.mdx
   ```

2. **Add frontmatter:** Provide `title`, `date`, `summary`, `tags`, and optional `featured`.

3. **Write content:** Use standard Markdown/MDX with GFM tables and fenced code blocks (`rehype-pretty-code` with `github-dark-dimmed` + `rehype-slug` heading anchors).

4. **Preview locally:**
   ```bash
   pnpm run dev
   # Visit http://localhost:3000/writing/your-post-slug
   ```

5. **Run verification gates before publishing:**
   ```bash
   pnpm run prebuild
   pnpm run build
   ```

6. **Publish:**
   ```bash
   git add content/writing/your-post-slug.mdx
   git commit -m "docs(writing): add your post title"
   git push origin main
   ```

Vercel auto-deploys from `main`. Check `https://scardubu.dev/writing` and `https://scardubu.dev/rss.xml`.

---

## Frontmatter Reference

Defined by `WritingFrontmatter` in [`lib/content.ts`](../../lib/content.ts):

```yaml
---
title: 'Your Engineering Note Title'     # Required
date: '2026-11-21'                       # Required (ISO YYYY-MM-DD; used for reverse-chronological sort)
summary: 'Concise 1–2 sentence summary.' # Required (used on index, OG description, and RSS)
tags:                                    # Optional (array of topic strings)
  - 'Backend Engineering'
  - 'Production Systems'
featured: false                          # Optional (boolean)
---
```

> **Note:** `readingTime` is computed automatically by `lib/content.ts` at `220` words/min; do not hardcode it in frontmatter.

---

## Evidence & Copy Standards

- Follow [`docs/claim-ledger.md`](../claim-ledger.md): distinguish architectural intent from measured production outcomes, and never publish unlinked benchmark metrics.
- `pnpm run audit:copy` scans `content/` as part of `pnpm run prebuild` and blocks banned unverified claims or placeholder text (`TODO`, `FIXME`, `PLACEHOLDER`).

---

## Formatting & Media

### Code Blocks

Use fenced code blocks with an explicit language identifier. [`mdx-components.tsx`](../../mdx-components.tsx) wraps every `<pre>` block in [`CodeBlockClient`](../../components/CodeBlockClient.tsx) with a language header, `COPY` button (`>= 44px` touch target + polite live-region feedback), and horizontal-scroll-safe `.mdx-code-pre` typography:

````markdown
```python
async def score_fixture(payload: ScoreRequest) -> ScoreResponse:
    ...
```
````

### Links, Headings & Automatic Outline

- `h2` headings are extracted automatically by `extractMarkdownHeadings` + `slugifyHeading` in [`lib/content.ts`](../../lib/content.ts) (matching `rehype-slug` / `github-slugger`) to populate the sticky [`ArticleOutline`](../../components/ArticleOutline.tsx) sidebar ("On this page" TOC + one-click **Copy section link**).
- `h2` and `h3` headings receive `scroll-mt-24` and slug IDs via `rehype-slug` + `mdx-components.tsx`; `h2` headings also expose a hover/focus `#` permalink anchor.
- External links automatically open in a new tab with `rel="noopener noreferrer"`.
- Internal links should target canonical routes (`/writing/[slug]`, `/work/[slug]`, `/#contact`).
- To cross-link a new article with matching case studies on `/writing`, `/writing/[slug]`, and `/work/[slug]`, add its slug mapping to `WRITING_TO_WORK_SLUGS` in [`lib/work-meta.ts`](../../lib/work-meta.ts).

### Images

Place static article images under `public/images/` (or a dedicated subfolder under `public/`) and optimize them before committing:

```markdown
![Descriptive alt text](/images/your-diagram.webp)
```

---

## Deployment Checklist

- [ ] Slug is lowercase hyphenated (`a-z`, `0-9`, `-`)
- [ ] Frontmatter has `title`, `date`, `summary`, and `tags`
- [ ] Claims comply with `docs/claim-ledger.md`
- [ ] `pnpm run prebuild` passes (lint, type-check, unit tests, `audit:copy`)
- [ ] `pnpm run build` generates `/writing/[slug]` cleanly
- [ ] Previewed on desktop (`1024px+` sticky sidebar) and mobile (`375px`)
