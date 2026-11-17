import { getWritingPosts } from '@/lib/content';
import { CONTACT_EMAIL, SITE_URL } from '@/lib/config';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET(): Promise<Response> {
  const posts = await getWritingPosts();
  const now = new Date();
  const items = posts
    .filter((post) => post.title && post.slug)
    .map((post) => {
      const url = `${SITE_URL}/writing/${post.slug}`;
      const published = Date.parse(post.date);
      const pubDate = Number.isNaN(published)
        ? now.toUTCString()
        : new Date(published).toUTCString();

      return [
        '<item>',
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<description>${escapeXml(post.summary)}</description>`,
        `<pubDate>${pubDate}</pubDate>`,
        `<author>${escapeXml(CONTACT_EMAIL)} (Oscar Ndugbu)</author>`,
        ...post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`),
        '</item>',
      ].join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Oscar Ndugbu — Engineering Notes</title>
    <link>${SITE_URL}/writing</link>
    <description>Engineering writing on backend systems, platform reliability, AI infrastructure, data-intensive products, and fintech systems.</description>
    <language>en</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>${escapeXml(CONTACT_EMAIL)} (Oscar Ndugbu)</managingEditor>
    <webMaster>${escapeXml(CONTACT_EMAIL)} (Oscar Ndugbu)</webMaster>
    <copyright>Copyright ${now.getFullYear()} Oscar Ndugbu</copyright>
    <ttl>60</ttl>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=300',
    },
  });
}
