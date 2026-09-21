/**
 * CONVICTION ENGINE — canonical profile-level portfolio content.
 *
 * This module owns public identity, hero copy, conviction stats, live metrics,
 * and social links. Project-specific content remains in lib/projects.ts.
 */
import { CONTACT_EMAIL, CV_ASSET_PATH, anchorUrl } from '@/lib/config';

export const PROFILE = {
  name: 'Oscar Ndugbu',
  handle: 'Scardubu',
  locationDisplay: 'Lagos, Nigeria 🇳🇬',
  locationShort: 'Lagos',
  role: 'Staff Backend and Platform Engineer',
  email: CONTACT_EMAIL,
  github: 'https://github.com/Scardubu',
  linkedin: 'https://linkedin.com/in/oscardubu',
  site: 'https://scardubu.dev',
  cvPath: CV_ASSET_PATH,
} as const;

export const HERO = {
  name: 'Oscar Ndugbu',
  title: 'Staff Backend and Platform Engineer',
  kicker: 'Staff Backend and Platform Engineer',
  h1: 'Systems you can trust at 2 AM.',
  subHeadline: 'Scalable backend, platform, and AI infrastructure.',
  body: 'I build resilient architectures designed for high availability and easy maintenance. My work makes failure visible, recovery deliberate, and day-to-day operations simple to understand.',
  availability: 'OPEN TO STAFF BACKEND AND PLATFORM OPPORTUNITIES',
  availabilityLastUpdated: '2026-08-22',
  location: 'Lagos, Nigeria 🇳🇬',
  trustStrip: 'Backend · Platform · AI infrastructure · Production reliability',
  cta: {
    primary: { label: 'Review production evidence', href: anchorUrl('section-projects') },
    secondary: { label: 'Discuss a system', href: anchorUrl('section-contact') },
    cv: { label: 'Download CV', href: CV_ASSET_PATH },
  },
} as const;

export const CONVICTION_STATS = [
  { value: 'Tenant-scoped', label: 'Data boundaries', stat: 'isolation' },
  { value: 'Replay-safe', label: 'Queue design', stat: 'recovery' },
  { value: 'Observable', label: 'Failure paths', stat: 'telemetry' },
  { value: 'Fallback-ready', label: 'Inference delivery', stat: 'resilience' },
] as const;

export const SOCIAL = {
  github: 'https://github.com/Scardubu',
  linkedin: 'https://linkedin.com/in/oscardubu',
  email: `mailto:${CONTACT_EMAIL}`,
  site: 'https://scardubu.dev',
} as const;
