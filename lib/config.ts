/**
 * lib/config.ts
 *
 * Single source of truth for environment-specific URL and contact configuration.
 *
 * CRITICAL DISTINCTION — two functions, two contexts:
 *
 *   anchorUrl('section-contact')
 *     → Returns '/#section-contact' (root-relative)
 *     → USE FOR: Next.js <Link href>, HTML <a href> for same-page anchors
 *     → WHY: Next.js Link with an absolute URL triggers a full hard page reload.
 *            A root-relative path uses client-side navigation correctly.
 *
 *   canonicalSectionUrl('section-contact')
 *     → Returns 'https://scardubu.dev/#section-contact' (absolute)
 *     → USE FOR: <meta> tags, og:url, sitemap.xml, JSON-LD only
 *     → NEVER USE IN: <Link href> or <a href> for in-page navigation
 *
 * Previous version had sectionUrl() returning an absolute URL and it was
 * used in Navbar <Link> components — causing a full page reload on every
 * nav click. That function is removed. Use anchorUrl() instead.
 */

// Canonical hostname: the apex host redirects to www, so all indexable
// metadata, structured data, feeds, and sitemaps use the redirect destination.
export const SITE_URL = 'https://www.scardubu.dev';

export const BLOG_BASE: string = `${SITE_URL}/writing`;
export const CV_ASSET_PATH = '/cv/oscar-ndugbu-resume.pdf';

// ─── Contact ──────────────────────────────────────────────────────────────────

/**
 * CONTACT_EMAIL — single source of truth for all contact surfaces.
 *
 * Used in:
 *   - Footer
 *   - HeroSection mailto CTA
 *   - Navbar CTA
 *   - ContactSection
 *   - CommandPalette
 *   - app/api/contact/route.ts (Resend "to" address)
 *   - app/error.tsx fallback
 *   - app/rss.xml/route.ts
 *   - lib/portfolio-data.ts
 *   - lib/data.ts
 *   - app/lib/constants.ts
 *
 * Do NOT hardcode the email anywhere else. Import this constant instead.
 * Verify the Resend configuration in app/api/contact/route.ts uses this value.
 *
 * ⚠️  VERIFY: Ensure oscar@scardubu.dev is configured in your Resend dashboard
 *     and set as the RESEND_TO_EMAIL environment variable in Vercel.
 */
export const CONTACT_EMAIL = 'oscar@scardubu.dev';

/**
 * SENDER_EMAIL — the "from" address used by Resend when sending contact
 * form submissions. Must be a verified domain sender in the Resend dashboard.
 * Do NOT hardcode this string anywhere else — import this constant.
 */
export const SENDER_EMAIL = 'noreply@scardubu.dev';

// ─── Blog URLs ────────────────────────────────────────────────────────────────

/**
 * Canonical URL for an editorial post.
 * The public editorial route is /writing; legacy /blog URLs redirect there.
 * These are external links — absolute URLs are correct here.
 */
export function blogUrl(slug: string): string {
  return `${BLOG_BASE}/${slug}`;
}

// ─── In-page anchor navigation ────────────────────────────────────────────────

/**
 * Root-relative anchor link — safe for Next.js <Link> and <a> same-page nav.
 *
 * Returns: '/#section-id'
 *
 * Example:
 *   anchorUrl('section-contact')  → '/#section-contact'
 *   anchorUrl('section-projects') → '/#section-projects'
 *
 * Use everywhere a nav link or CTA points to a section on the homepage.
 */
export function anchorUrl(anchor: string): string {
  return `/#${anchor}`;
}

// ─── Canonical absolute URLs (meta/SEO only) ──────────────────────────────────

/**
 * Absolute canonical URL — for <meta>, og:url, sitemap, JSON-LD only.
 * Do NOT use in Next.js <Link href> or <a href> for navigation.
 *
 * Returns: 'https://www.scardubu.dev/#section-id'
 */
export function canonicalSectionUrl(anchor: string): string {
  return `${SITE_URL}/#${anchor}`;
}

// ─── GitHub API proxy ─────────────────────────────────────────────────────────

/**
 * Base path for the server-side GitHub stats proxy.
 * Prevents unauthenticated rate limits (60 req/hr per IP).
 */
export const GITHUB_PROXY_BASE = '/api/github';
