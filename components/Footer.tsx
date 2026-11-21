import Link from 'next/link';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterProps {
  githubHref?: string;
  linkedinHref?: string;
  resumeHref?: string;
  email?: string;
  locationLabel?: string;
}

export function Footer({
  githubHref = 'https://github.com/scardubz',
  linkedinHref = 'https://www.linkedin.com',
  resumeHref = '/oscar-scardubu-resume.pdf',
  email = 'oscar@scardubu.dev',
  locationLabel = 'UTC+1 · Remote Worldwide',
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const navigationLinks: readonly FooterLink[] = [
    { label: 'Work', href: '/#work' },
    { label: 'Writing', href: '/writing' },
    { label: 'Contact', href: '/#contact' },
    { label: 'RSS', href: '/rss.xml' },
  ];

  const externalLinks: readonly FooterLink[] = [
    { label: 'GitHub', href: githubHref, external: true },
    { label: 'LinkedIn', href: linkedinHref, external: true },
    { label: 'CV (PDF)', href: resumeHref, external: true },
    { label: 'Email', href: `mailto:${email}`, external: true },
  ];

  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
        {/* Top Row: Closing Editorial Signature */}
        <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">
              Oscar Ndugbu
            </p>
            <p className="mt-1.5 text-lg font-semibold tracking-tight text-zinc-100">
              Systems you can trust at 2 AM.
            </p>
          </div>

          <p className="font-mono text-xs text-zinc-400">{locationLabel}</p>
        </div>

        {/* Middle Grid: Responsive 2 -> 4 Column Bar (Fixes Mobile Cramping) */}
        <div className="grid grid-cols-2 gap-6 border-y border-white/10 py-6 sm:grid-cols-4">
          {navigationLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="inline-flex min-h-11 items-center font-mono text-xs text-zinc-300 transition-colors duration-200 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 motion-reduce:transition-none"
            >
              {item.label}
            </Link>
          ))}

          {externalLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={
                item.href.startsWith('mailto:')
                  ? undefined
                  : 'noopener noreferrer'
              }
              className="inline-flex min-h-11 items-center font-mono text-xs text-zinc-300 transition-colors duration-200 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 motion-reduce:transition-none"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Bottom Attribution */}
        <div className="mt-6 flex flex-col gap-2 font-mono text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} Oscar Ndugbu. All rights reserved.</p>
          <p>Built with Next.js, TypeScript &amp; strict design contracts.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
